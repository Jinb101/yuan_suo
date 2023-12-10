<template>
  <div class="atten_clock">
    <transition name="van-fade">
      <div class="head flex" v-if="open">
        <div class="logo">
          <v-a :src="user.avatar"></v-a>
        </div>
        <div class="text">
          <h6>{{ user.nickname }}</h6>
          <p>{{ [user.auth_group, user.auth_job].join(" ") }}</p>
        </div>
        <div class="reload" @click.stop="init">
          <van-icon name="replay" />
        </div>
      </div>
    </transition>
    <div class="v_box" :class="open ? '' : 'bottom'">
      <div class="h flex" v-if="open">
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
        <div class="radius_btn" :class="'active_' + work_address.s">
          <p>{{ work_address.t }}</p>
          <b>{{ times }}</b>
        </div>
        <p class="desc">已进入考勤范围：{{ local.name }}</p>
        <slot />
      </div>
      <span class="status" @click="open = false">查看考勤范围</span>
    </div>
    <div id="map-clock" class="map_box"></div>
  </div>
</template>

<script>
import vA from "../../private/avatar.vue";
export default {
  data() {
    return {
      user: {},
      local: {},
      timeout: Date.now(),
      time: [],
      timer: null,
      today: {},
      center: [],
      radius: 0,
      ext: {},
      iswx: false,
      map: null,
      amap: null,
      open: true,
    };
  },
  computed: {
    times() {
      return [this.time[3], this.time[4], this.time[5]].join(":");
    },
    ymd() {
      return [this.time[0], this.time[1], this.time[2]].join("-");
    },
    // 上班
    work_on() {
      return "未打卡";
    },
    // 下班
    work_off() {
      return "未打卡";
    },
    work_address() {
      if (this.center.length < 2) return { t: "打卡", s: 9 };
      // 检测是否在考勤范围内

      // 检测是否打卡 上班

      // 检测是否打卡 下班

      return { t: "外勤打卡", s: 0 };
    },
  },
  watch: {
    center: {
      handler(n) {
        if (n.length === 2) {
          this.mapcenter(n);
        }
      },
      deep: true,
    },
  },
  components: { vA },
  methods: {
    mapcenter(path) {
      if (!this.amap) {
        setTimeout(() => {
          this.mapcenter(path);
        }, 500);
        return 0;
      }
      this.map.center(path[0], path[1]);
      this.amap.setZoom(15);
      // 创建点
      this.map.circleDel("circle");
      this.map.circle({ lng: path[0], lat: path[1], type: "circle" });
      // this.map.address({ path }, (e) => {
      //   if (e.code) {
      //     let v = e.data;
      //     console.log(v);
      //   }
      // });
      this.map.circular({ lng: path[0], lat: path[1], radius: 100 }, (ee) => {
        this.map.circularEnd({ id: ee.data.id });
      });
    },
    // 获取当前位置
    getcenter() {
      if (this.iswx) {
        this.$js.wxshare({}, "geo", (r) => {
          // 创建地图
          if (!(r.lng && r.lat)) {
            return this.$toast("定位错误，请重试");
          }
          // 我现在的位置
          // lng 104.00405
          // lat 30.636559
        });
      } else {
        this.$toast("请用微信打开");
        // this.map.poi({}, (e) => {
        //   console.log(e);
        // });
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
    init() {
      // eslint-disable-next-line
      // this.map = new demo.$map("map-clock", { layer: false, zoom: 12 }, (e) => {
      //   this.amap = e.data.map;
      //   this.amap.on("click", function (ss) {
      //   });
      // });
      // eslint-disable-next-line
      demo.ajax(demo.siteConfig.api.hps + "time.php").get({}, (r) => {
        this.timeout = r;
        this.downtime(r);
        this.$api.http("clockdet", { date: this.ymd }, (r) => {
          this.today = r;
        });
      });
      this.$api.http("clockinfo", {}, (r) => {
        this.ext = r;
        this.center = [r.longitude, r.latitude];
        this.radius = r.distance;
      });
      this.getcenter();
    },
    downtime(time) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      // eslint-disable-next-line
      this.time = demo.timeout(time, "array");
      // eslint-disable-next-line
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        this.timer = null;
        this.downtime(time + 1);
      }, 1e3);
    },
  },
  mounted() {
    // eslint-disable-next-line
    this.user = demo.$session.get("user", {});
    // eslint-disable-next-line
    this.local = demo.$local.get("app_config", {});
    // eslint-disable-next-line
    this.iswx = demo.es6().isWx();
    this.init();
  },
};
</script>
<style lang='less' scoped>
.atten_clock {
  height: 100%;
  box-sizing: border-box;
  padding-top: 15px;
  position: relative;
  .head {
    margin: 0 10px 15px;
    background-color: #fff;
    box-sizing: border-box;
    padding: 10px;
    border-radius: 10px;
    font-size: 15px;
    align-items: center;
    position: relative;
    z-index: 66;
    .reload {
      position: absolute;
      right: 15px;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 40px;
      height: 40px;
      // background-color: #f8f7fa;
      font-size: 25px;
      color: #999;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
    .text {
      width: calc(100% - 60px);
    }
    h6 {
      padding: 5px 0;
      font-weight: 650;
    }
    p {
      font-size: 12px;
      color: #999;
    }
  }
  .v_box {
    height: calc(100% - 100px);
    margin: 0 10px;
    border-radius: 15px;
    box-sizing: border-box;
    padding: 20px;
    background-color: #fff;
    min-height: 300px;
    position: relative;
    z-index: 66;
    transition: all 0.3s;
    width: calc(100% - 20px);
    &.bottom {
      position: absolute;
      left: 0;
      bottom: 20px;
      height: 180px;
      padding: 0 20px;
      min-height: 100px;
      .radius_btn {
        position: absolute;
        top: -60px;
        left: 0;
        right: 0;
        margin: auto;
      }
      .btn {
        padding-top: 60px;
        box-sizing: border-box;
      }
      .desc {
        margin-top: 8px;
      }
    }
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
  .map_box {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
