<template>
  <div class="atten_clock">
    <div class="h flex">
      <section>
        <h6>上班 {{ today.work_hours }}</h6>
        <p>{{ work_on }}</p>
      </section>
      <section>
        <h6>下班 {{ today.closing_time }}</h6>
        <p>{{ work_off }}</p>
      </section>
    </div>
    <div class="btn">
      <div class="radius_btn"
           :class="'active_' + work_address.s"
           @click.stop="onclock">
        <p>{{ work_address.t }}</p>
        <b>{{ times }}</b>
      </div>
      <p class="desc">考勤范围：{{ user.nursery_name }}</p>
      <slot />
    </div>
    <span class="status"
          @click="$emit('showmap')">查看考勤范围</span>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      today: {},
      time: {},
      timer: null,
      timeout: 0,
      iswx: false,
      lng: "",
      lat: "",
      center: [0, 0],
      radius: 0,
      show: false,
      timers: null,
    };
  },
  watch: {
    center: {
      handler(v) {
        this.$emit("center", v);
      },
      deep: true,
    },
  },
  computed: {
    times() {
      return [this.time.h, this.time.i, this.time.s].join(":");
    },
    ymd() {
      return [this.time.y, this.time.m, this.time.d].join("-");
    },
    // 上班
    work_on() {
      let type = +this.today.enter_status;
      if (type === 2) return "缺勤";
      if (type === 5) return "请假";
      if (this.today.enter_time) {
        let s = type === 3 ? " [迟到]" : "";
        // eslint-disable-next-line
        let t = demo.timeout(this.today.enter_time, "object");
        return "已打卡 " + [t.h, t.i].join(":") + s;
      }
      return "未打卡";
    },
    // 下班
    work_off() {
      console.log(this.today);
      let type = +this.today.leave_status;
      if (type === 5) return "请假";
      if (this.today.leave_time) {
        let s = type === 4 ? " [早退]" : "";
        console.log(s);
        // eslint-disable-next-line
        let t = demo.timeout(this.today.leave_time, "object");
        console.log(t);
        return "已打卡 " + [t.h, t.i].join(":") + s;
      }
      return "未打卡";
    },
    work_address() {
      let w = "外勤";
      let s = 0;
      if (this.isatten === null) {
        return { t: "定位中", v: "", s: "2" };
      }
      // 判断是否在考勤范围内
      if (this.isatten) {
        w = "";
        s = 1;
      }
      if (["未打卡", "缺勤", "请假"].indexOf(this.work_on) >= 0) {
        let time = new Date(
          [this.ymd, this.today.closing_time].join(" ").replace(/-/g, "/")
        ).getTime();
        if (this.time.default < time / 1e3) {
          // 未过下班时间
          return { t: (w || "上班") + "打卡", s, v: 0 };
        }
      } else {
        // 判断 上班时间之前为 上班打卡
        let t2 = new Date(
          [this.ymd, this.today.work_hours].join(" ").replace(/-/g, "/")
        ).getTime();
        if (this.time.default < t2 / 1e3) {
          return { t: (w || "上班") + "打卡", s, v: 0 };
        }
      }
      return { t: (w || "下班") + "打卡", s, v: 1 };
    },
    isatten() {
      if (this.lng && this.lat && this.center.length && this.center[0] !== 0) {
        let a = this.getDistance(
          this.lat,
          this.lng,
          this.center[1],
          this.center[0]
        );
        return this.radius > a;
      }
      if (!this.center.length || +this.center[0] === 0) {
        return null;
      }
      return true;
    },
  },
  methods: {
    timersrun() {
      if (this.timers) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timers = setTimeout(() => {
        this.geo();
        clearTimeout(this.timers);
        this.timers = null;
        this.timersrun();
      }, 1e3);
    },
    onclock() {
      if (this.isatten === null) return 0;
      let http = this.$api.http;
      let apis = () => {
        let v = this.work_address.t.indexOf("外勤") >= 0;
        if (v) {
          this.$emit("clockchange", this.center, this.work_address);
          // 显示外勤打卡页
          return 0;
        }
        http(
          "clockin",
          { longitude: this.center[0], latitude: this.center[1], notes: "" },
          (res) => {
            this.$api.http("clockdet", { date: this.ymd }, (r) => {
              this.today = r;
              this.$emit("today", r);
            });
            this.$emit("end", res, this.work_address);
            // 显示成功页
          }
        );
      };

      if (this.center.length && this.center[0] !== 0) {
        apis();
      } else {
        this.geo(() => {
          this.$nextTick(() => {
            apis();
          });
        });
      }
    },
    getDistance(lat1, lon1, lat2, lon2) {
      let R = 6371000; // 地球半径(单位:米)
      let dLat = ((lat2 - lat1) * Math.PI) / 180; // 纬度差(弧度)
      let dLon = ((lon2 - lon1) * Math.PI) / 180; // 经度差(弧度)
      let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let d = R * c; // 两点之间的距离(单位:米)
      return d;
    },
    downtime(time) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      // eslint-disable-next-line
      this.time = demo.timeout(time, "object");
      // eslint-disable-next-line
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        this.timer = null;
        this.downtime(time + 1);
      }, 1e3);
    },
    init() {
      // eslint-disable-next-line
      demo.ajax(demo.siteConfig.api.hps + "time.php").get({}, (tm) => {
        this.timeout = tm;
        this.$emit("time", tm);
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.downtime(tm);
        this.$api.http("clockdet", {}, (r) => {
          this.today = r;
          this.$emit("today", r);
        });
        this.getlng();
      });
    },
    // 获取考勤定位
    getlng() {
      this.$api.http("clockinfo", {}, (r) => {
        this.lng = r.longitude;
        this.lat = r.latitude;
        this.radius = r.distance;
        this.geo();
        this.timersrun();
      });
    },
    // 获取定位
    geo(callback) {
      if (this.iswx) {
        // this.center = [];
        this.$js.wxshare({}, "geo", (r) => {
          // 创建地图
          if (!(r.lng && r.lat)) {
            return this.$toast("定位错误，请重试");
          }
          this.center = [r.lng, r.lat];
          // lng 104.00405
          // lat 30.636559
          if (callback) {
            callback();
          }
        });
      } else {
        if (this.$js.env) {
          if (this.center.length > 0 && this.center[0] > 0) {
            // eslint-disable-next-line
            let lng = demo.array([+this.center[0], 0.00001]).sum();
            // eslint-disable-next-line
            let lat = demo.array([+this.center[1], 0.00001]).sum();
            this.center = [lng, lat];
          } else {
            this.center = [104.00405, 30.636559]; // 测试
          }
        } else {
          this.$toast("请用微信打开");
        }
      }
    },
  },
  mounted() {
    // eslint-disable-next-line
    this.iswx = demo.es6().isWx();
    this.init();
  },
  destroyed() {
    if (this.timers) {
      clearTimeout(this.timers);
      this.timers = null;
    }
  },
};
</script>
<style lang='less' scoped>
.atten_clock {
  box-sizing: border-box;
  padding: 20px;
  // background-color: #fff;
  position: relative;
  z-index: 66;
  transition: all 0.3s;
  height: 100%;

  .h {
    justify-content: space-between;

    section {
      background-color: #f5f5f5;
      width: 48%;
      box-sizing: border-box;
      padding: 8px;
      border-radius: 12px;
      font-size: 14px;
    }

    h6 {
      font-weight: 600;
      margin-bottom: 5px;
    }

    p {
      color: #999;
    }
  }

  .btn {
    height: calc(100% - 50px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
  }

  .status {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    padding: 10px 30px;
    font-size: 12px;
    color: #999;
    text-align: center;
    opacity: 0.5;
  }

  .radius_btn {
    border-radius: 50%;
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #fff;
    font-size: 18px;
    background: linear-gradient(-45deg, rgb(0, 162, 254), rgb(95, 186, 255));
    box-shadow: 0 0 25px rgb(192, 218, 253);

    &.active_0 {
      background: linear-gradient(-45deg, #07dd72, #a1ffd8);
      box-shadow: 0 0 25px rgb(181, 255, 206);
    }

    &.active_2 {
      background: linear-gradient(-45deg, #ccc, #eee);
      box-shadow: 0 0 25px rgb(209, 209, 209);
    }

    p {
      padding: 8px 0;
      font-weight: 650;
    }

    b {
      font-size: 14px;
      opacity: 0.7;
    }
  }

  .desc {
    font-size: 14px;
    padding: 5px 0;
    color: #999;
    margin-top: 15px;
    text-align: center;
  }
}
</style>
