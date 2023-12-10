<template>
  <v-view bar
          cover
          bgc="#f2f2f2"
          :index="400"
          @on-view="onView">
    <template #default="{ scope }">
      <!-- 分类入口 -->
      <x-content>
        <div class="bars flex">
          <section v-for="(i, j) in bar"
                   :key="j"
                   @click="onDetail(i)">
            <x-radius size="39"
                      :color="i.color">
              <van-image class="icon"
                         :src="scope.icon(i.icon, 'index')"></van-image>
            </x-radius>
            <b>{{ i.text }}</b>
            <van-badge :content="i.num"
                       class="b"
                       max="99"
                       v-if="i.num > 0" />
          </section>
        </div>
      </x-content>
      <!-- 出勤 -->
      <x-content v-if="val.t3 || val.t4">
        <div class="x_line line flex"
             v-if="val.t3">
          <div class="text">
            <p @click="appPath('/census/1')">
              出勤幼儿：<b class="bold">{{ census1.attendance }}</b>
            </p>
            <p @click="appPath('/census/2')">
              缺勤幼儿：<b class="bold">{{ census1.absence_from_duty }}</b>
            </p>
          </div>
          <div class="circle"
               @click="appPath('/census/3')"
               v-if="is_show">
            <van-circle v-model="census1.attendance_rate"
                        :rate="census1.attendance_rate"
                        :speed="100"
                        size="2rem"
                        layer-color="#ebedf0"
                        stroke-width="80">
              <div class="font">
                <p>{{ census1.attendance_rate }}%</p>
                <b>出勤率</b>
              </div>
            </van-circle>
          </div>
          <div class="logo"
               @click="show_time = true">
            <van-image :src="scope.icon(0, 'index')"></van-image>
            <div class="logo_font">
              <p class="col_green">{{ index.month_days }}天</p>
              <b>当月出勤天数</b>
            </div>
          </div>
        </div>
        <div class="x_line line flex"
             v-if="val.t4">
          <div class="text">
            <p @click="appPath('/census/4')">
              出勤教师：<b class="bold">{{ index.teacher_attendance.attendance }}</b>
            </p>
            <p @click="appPath('/census/5')">
              缺勤教师：<b class="bold">{{ census2.absence_from_duty }}</b>
            </p>
          </div>
          <div class="circle">
            <van-circle v-model="census2.attendance_rate"
                        :rate="census2.attendance_rate"
                        :speed="100"
                        size="2rem"
                        layer-color="#ebedf0"
                        stroke-width="80">
              <div class="font">
                <p>{{ census2.attendance_rate }}%</p>
                <b>出勤率</b>
              </div>
            </van-circle>
          </div>
          <div class="logo">
            <van-image :src="scope.icon(1, 'index')"></van-image>
            <!-- <div class="logo_font" @click="appPath('/attendance')">
              我的出勤
            </div> -->
            <div class="logo_font">
              <van-icon @click="appPath('/attendance')"
                        name="flag-o"
                        size="1rem"
                        color="#18bc9c" />
              <div>我的出勤</div>
            </div>
          </div>
        </div>
      </x-content>
      <x-content v-if="is_openid">
        <van-notice-bar color="#1989fa"
                        background="#ecf9ff"
                        left-icon="wechat"
                        @click="onbindwx">
          请绑定微信
        </van-notice-bar>
      </x-content>
      <!-- canvas统计 -->
      <x-content v-if="charts">
        <x-box :header="false"
               size="big">
          <div class="reload"
               @click="reload">
            <van-icon name="replay"
                      size="22" />
            <p>刷新</p>
          </div>
          <div class="canvas">
            <iframe :src="charts"
                    frameborder="0"
                    class="db_image"></iframe>
          </div>
        </x-box>
      </x-content>
      <!-- 精彩瞬间 -->
      <x-content v-if="val.t5">
        <x-box title="精彩瞬间">
          <template #icon>
            <van-image :src="iconlike"></van-image>
          </template>
          <template #btn>
            <van-button size="small"
                        round
                        :color="$js.btnColor"
                        class="m65"
                        @click="appPath('/cute_add')">发布</van-button>
            <van-button size="small"
                        round
                        @click="appPath('/cute')">查看更多</van-button>
          </template>
          <v-c :del="cute_del"
               v-model="cutes"
               pad></v-c>
        </x-box>
      </x-content>
      <!-- 园所资讯 -->
      <x-content v-if="val.t6">
        <x-box title="园所资讯">
          <template #icon>
            <van-image :src="iconmsg"></van-image>
          </template>
          <template #btn>
            <van-button size="small"
                        round
                        :color="$js.btnColor"
                        class="m65"
                        @click="appPath('/info_add')">发布</van-button>
            <van-button size="small"
                        round
                        @click="appPath('/info')">查看更多</van-button>
          </template>
          <v-i :del="info_del"
               v-model="infos"
               pad
               watch></v-i>
        </x-box>
      </x-content>
      <x-content></x-content>
    </template>
    <template #fixed>
      <v-f v-model="show_time"
           text="设置考勤天数"
           :index="560"
           :footer="false"
           customize>
        <template #custom>
          <div class="heaer_menu"></div>
        </template>
        <v-tn v-model="index.month_days"
              @on-init="init"></v-tn>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../private/fixed.vue";
import vTn from "../attendance/set_time.vue"; // 设置考勤时间
import vC from "./cute/item.vue";
import vI from "./info/item.vue";
export default {
  data() {
    return {
      a: 60,
      bar: [],
      cutes: [],
      infos: [],
      index: {},
      maste: null,
      show_time: false,
      cute_del: false,
      info_del: false,
      is_openid: false,
      // eslint-disable-next-line
      iconlike: demo.siteConfig.icon("like", "private"),
      // eslint-disable-next-line
      iconmsg: demo.siteConfig.icon("msg", "private"),
      val: {},
      is_show: false,
    };
  },
  inject: ["appPath", "reload"],
  computed: {
    census1() {
      let a = this.index.child_attendance || {};
      a.attendance_rate *= 1;
      return a;
    },
    census2() {
      let a = this.index.teacher_attendance || {};
      console.log(this.index.teacher_attendance);
      a.attendance_rate *= 1;
      return a;
    },
    charts() {
      // 满园比 数据
      let e = this.index;
      if (e.studentsOfTheGarden === undefined) return "";
      let data = {
        rate: e.studentsOfTheGarden + "/" + e.capacityOfGarden,
        list: [
          { name: "生源", value: e.child_source },
          { name: "定位", value: e.child_location },
          { name: "在读", value: e.child_onread },
          { name: "在册", value: e.child_unclass },
        ],
      };
      // eslint-disable-next-line
      let url = demo.siteConfig.api.chart + "?type=a_index&h5=";
      // eslint-disable-next-line
      return url + demo.es6().encrypt(data, "chart");
    },
  },
  components: { vF, vTn, vC, vI },
  methods: {
    onbindwx() {
      // eslint-disable-next-line
      let iswx = demo.es6().isWx();
      if (!iswx) {
        return this.$toast("请在微信内点击");
      }
      this.$js.wxcode("event_bind");
    },
    checkmenu(name, key, flag, str) {
      if (!flag) {
        this[name] = this[name].filter((r) => {
          return r[key] !== str;
        });
      }
    },
    onView(e) {
      this.bar = this.$js.def.index.bar;
      this.checkmenu("bar", "path", e.validate.t0, "/notify");
      this.checkmenu("bar", "path", e.validate.t1, "/task");
      this.checkmenu("bar", "path", e.validate.t2, "/approval");
      this.val = e.validate;
      this.cute_del = this.$js.islevel(459, e.level);
      this.info_del = this.$js.islevel(439, e.level);
      this.is_openid = e.user.is_openid === 0;
      this.is_show = e.user.user_id !== "";

      if (this.is_openid) {
        this.$js.model(
          "微信绑定",
          "是否微信授权，授权后可实时接收信息",
          (r) => {
            if (r) {
              this.onbindwx();
            }
          }
        );
      }

      this.onDot();
      this.init();
      this.onGetCute();
    },
    onDetail(e) {
      if (e.path) {
        this.appPath(e.path);
      }
    },
    onDot() {
      let ti = (path) => {
        return this.bar
          .map((s) => {
            return path === s.path;
          })
          .indexOf(true);
      };
      // let time = Date.now();
      // eslint-disable-next-line
      // let data = demo.$session.get("index-dot", {});
      let fn = (os) => {
        let val = os.reduce((a, b) => {
          return a + b;
        }, 0);
        if (this.bar[ti("/approval")]) {
          this.$set(this.bar[ti("/approval")], "num", val);
        }
      };
      // if (data.time && data.time > time) {
      //   return fn(data.list);
      // }
      this.$api.http("approvalDot", {}, (res) => {
        if (this.bar[ti("/notify")]) {
          this.$set(this.bar[ti("/notify")], "num", res.un_read_count);
        }
        let os = [res.attendance, res.cost, res.goods, res.receipt, res.use];
        // eslint-disable-next-line
        // demo.$session.set("index-dot", { time: time + 6e4, list: os });
        fn(os);
      });
    },
    init() {
      this.show_time = false;
      // 1分钟缓存
      let time = Date.now();
      // eslint-disable-next-line
      let data = demo.$session.get("index", {});
      if (data.time && data.time > time) {
        this.index = data.list;
        return 0;
      }
      this.getAttendance();
    },
    onGetCute() {
      this.$api.http("cute", { page: 1, limit: 3 }, (e) => {
        this.cutes = e;
      });
      this.$api.http("info", { page: 1, limit: 3, type: 2 }, (e) => {
        this.infos = e;
      });
    },
    getAttendance() {
      // 1分钟缓存
      let time = Date.now();
      this.$api.http("index", {}, (res) => {
        this.index = res;
        this.maste = res.teacher_attendance;
        // eslint-disable-next-line
        demo.$session.set("index", { time: time + 6e4, list: res });
      });
    }
  },
  mounted() {
    // 获取出勤教师
    this.getAttendance()
  },
};
</script>
<style lang='less' scoped>
.m65 {
  min-width: 65px !important;
}

.bars {
  padding: 0 10px;
  justify-content: space-between;
  margin: 20px 0;

  section {
    padding: 8px;
    max-width: 125px;
    flex: 1;
    box-sizing: border-box;
    height: 55px;
    border-radius: 28px;
    text-align: center;
    position: relative;
    background-color: #fff;
    display: flex;

    .b {
      position: absolute;
      right: 5px;
      top: 5px;
    }

    b {
      color: #6a6993;
      letter-spacing: 2px;
      flex: 1;
      line-height: 30px;
      height: 30px;
      margin-top: 5px;
      font-weight: 600;
      font-size: 15px;
    }

    &+section {
      margin-left: 10px;
    }
  }
}

.line {
  .font {
    height: 100%;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    justify-content: center;
    color: #999;

    p {
      font-weight: 650;
      font-size: 14px;
      margin-bottom: 2px;
      color: #666;
    }
  }

  .logo_font {
    position: absolute;
    left: 0;
    top: -10px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    flex-direction: column;
    line-height: 1;

    div {
      font-size: 12px;
      margin-top: 8px;
      font-weight: 600;
      color: rgba(102, 102, 102, 0.61);
    }

    ;

    b {
      font-size: 12px;
      font-weight: 600;
      margin-top: 8px;
      color: rgba(102, 102, 102, 0.61);
    }

    ;

    p {
      font-weight: 650;
      font-size: 16px;
      margin-bottom: 5px;
    }
  }
}

.canvas {
  height: 250px;
  position: relative;

  &::before {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    content: "";
  }
}

.reload {
  position: absolute;
  width: 40px;
  height: 40px;
  left: 0;
  top: 0;
  // background-color: rgba(128, 126, 126, .1);
  border-radius: 3px;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  color: #999;
  z-index: 50;
}

.bold {
  font-weight: 650;
}

.heaer_menu {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 200px;
  z-index: -1;
  background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);
  filter: blur(2px);
}
</style>
