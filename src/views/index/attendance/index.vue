<template>
  <v-view retreat
          bgc="#f8f7fa"
          @on-view="onview"
          index="500">
    <div class="app_top top">
      <div class="head">
        <v-a class="logo"
             :src="user.avatar"></v-a>
        <div class="text">
          <h6>{{ user.nickname }}</h6>
          <p>{{ [user.auth_group, user.auth_job].join(" ") }}</p>
        </div>
        <div class="reload"
             @click.stop="init">
          <van-icon name="replay" />
        </div>
      </div>
      <div class="tools flex">
        <section>
          <p>
            <b class="col_green">{{ detail.attendance }}</b>天
          </p>
          <b>出勤</b>
        </section>
        <section>
          <p>
            <b class="col_purple">{{ detail.late }}</b>次
          </p>
          <b>迟到</b>
        </section>
        <section>
          <p>
            <b class="col_warning">{{ detail.leave_early }}</b>次
          </p>
          <b>早退</b>
        </section>
        <section>
          <p>
            <b class="col_danger">{{ detail.absence }}</b>次
          </p>
          <b>缺勤</b>
        </section>
        <section>
          <p>
            <b class="col_info">{{ detail.leave }}</b>天
          </p>
          <b>请假</b>
        </section>
      </div>
    </div>
    <div class="v_box"
         ref="vbox">
      <div class="vv">
        <v-c :user="user"
             ref="clock"
             @clockchange="onclock"
             @end="onclockend"
             @today="ontodaydata"
             :style="{ height: h + 'px' }"
             @time="ontimeinit"
             @center="oncenterdata"
             @showmap="open6 = true"></v-c>
        <div class="atten_title">
          <van-divider>{{ timezh }}</van-divider>
          <span class="p"
                v-if="atten_btn[0] && atten_btn[0].timeout"
                @click.stop="ontimeinit(atten_btn[0].timeout)">上一月</span>
          <span class="n"
                v-if="atten_btn[1] && atten_btn[1].timeout"
                @click.stop="ontimeinit(atten_btn[1].timeout)">下一月</span>
        </div>
        <v-p2 v-model="detail"></v-p2>
        <!-- 按钮区 -->
        <div class="menus_box">
          <v-m v-model="menu"
               :column="3"
               @change="onchangemenu"></v-m>
        </div>
      </div>
    </div>
    <van-dialog v-model="open"
                show-cancel-button
                confirm-button-text="确认打卡"
                @confirm="onclocksend">
      <div class="clock_model">
        <h6>注意，您正在进行外勤打卡</h6>
        <van-field v-model="clockmsg"
                   rows="3"
                   autosize
                   type="textarea"
                   placeholder="打卡备注(选填)" />
        <p class="clock_h6">备注拍照(选填)</p>
        <v-upload-once class="image_logo"
                       v-model="clockimg"></v-upload-once>
      </div>
    </van-dialog>
    <van-popup v-model="open1"
               closeable
               get-container="#app"
               round>
      <div class="clock_success">
        <div class="box flex">
          <div class="icon">
            <img :src="clockicon"
                 alt="" />
          </div>
          <div class="time">{{ clocktime }}</div>
          <p class="desc">{{ clockstatus.t || "打卡" }}成功</p>
        </div>
        <div class="foot">
          <van-button block
                      @click="open1 = false">
            <b class="col_primary">我知道了</b>
          </van-button>
        </div>
      </div>
    </van-popup>
    <template #fixed>
      <v-t :open="open5"
           v-model="t1"
           max="m_0"
           type="year-month"></v-t>
      <v-f v-model="open2"
           :footer="false"
           text="请假记录"
           :index="600">
        <v-m2></v-m2>
      </v-f>
      <v-f v-model="open3"
           :footer="false"
           text="考勤图设置"
           :index="600">
        <v-m3></v-m3>
      </v-f>
      <v-f v-model="open4"
           :footer="false"
           :text="timezh"
           :index="600">
        <v-m1 :time="timeen"></v-m1>
      </v-f>
      <v-f v-model="open6"
           :footer="false"
           text="考勤范围"
           :index="600">
        <v-m-p v-model="today"
               :uc="ucenter"></v-m-p>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vA from "../../private/avatar.vue";
import vC from "./clock.vue";
import vP2 from "./atten.vue";
import vM from "../../private/menu.vue";
import vF from "../../private/fixed.vue";
import vT from "../../private/time.vue";
import vM1 from "../../user/my/_atten_punch.vue";
import vM2 from "../../user/my/_atten_leave.vue";
import vM3 from "../../user/my/_atten_pic.vue";
import vMP from "./map.vue";
export default {
  data() {
    return {
      user: {},
      h: 0,
      open: false, // 外勤打卡
      open1: false, // 打卡成功
      open2: false,
      open3: false,
      open4: false,
      open5: false,
      open6: false, // 范围地图
      clockmsg: "",
      clockcenter: [],
      clockstatus: {},
      clocktime: "",
      // eslint-disable-next-line
      clockicon: demo.siteConfig.icon("clock", "private"),
      detail: {},
      menu: [],
      timezh: "",
      timeen: "",
      t1: {},
      today: {},
      ucenter: [],
      atten_btn: [],
      clockimg: {},
    };
  },
  watch: {
    t1: {
      handler(n) {
        if (n.obj) {
          this.ontimeinit(n.time);
        }
      },
      deep: true,
    },
  },
  inject: ["appPath"],
  components: { vA, vC, vP2, vM, vF, vT, vM1, vM2, vM3, vMP },
  methods: {
    ontodaydata(e) {
      this.today = e;
    },
    oncenterdata(e) {
      this.ucenter = e;
    },
    onchangemenu(e) {
      let path = e.path;
      if (path.indexOf("to:") >= 0) {
        let type = path.split("to:")[1];
        switch (+type) {
          case 1:
            this.open4 = true;
            break;
          case 2:
            this.open2 = true;
            break;
          case 3:
            this.open3 = true;
            break;
          case 4:
            this.open6 = true;
            break;
          case 5:
            this.open5 = !this.open5;
            break;
          default:
        }
      } else {
        this.appPath(path);
      }
    },
    ontimeinit(e) {
      // eslint-disable-next-line
      let n = demo.timeout("", "object");
      let b = n.y * 12 + +n.m;
      // eslint-disable-next-line
      let tm = demo.timeout(e, "object");
      let o = tm.y * 12 + +tm.m;
      this.timezh = [tm.y, "年", tm.m, "月考勤记录"].join("");
      this.timeen = [tm.y, tm.m].join("-");

      // eslint-disable-next-line
      let y = [demo.month().past(1, tm.default)];
      if (o < b) {
        // eslint-disable-next-line
        y.push(demo.month().future(1, tm.default));
      }
      this.atten_btn = y;
      this.$api.http("usermyatten", { date: [tm.y, tm.m].join("-") }, (r) => {
        this.detail = { ...r, $date: tm };
      });
      this.menu = this.$js.def.works.atten;
    },
    onview(e) {
      this.user = e.user || {};
      // console.log(e);
    },
    init() {
      this.$refs.clock.init();
    },
    onclock(e, v) {
      this.clockcenter = e;
      this.clockmsg = "";
      this.clockstatus = v;
      this.open = true;
    },
    onclocksend() {
      this.$api.http(
        "clockin",
        {
          longitude: this.clockcenter[0],
          latitude: this.clockcenter[1],
          notes: this.clockmsg,
          photo: this.clockimg.src || "",
        },
        (res) => {
          this.$refs.clock.init();
          this.onclockend(res, this.clockstatus);
        }
      );
    },
    // 显示成功页
    onclockend(obj, v) {
      this.clockstatus = v;
      this.open = false;
      let type = v.v === 1; // 下班
      this.open1 = true;
      let time = type ? obj.leave_time : obj.enter_time;
      // eslint-disable-next-line
      this.clocktime = demo.timeout(time, "his", ":");
      this.ontimeinit("");
    },
  },
  mounted() {
    this.h = this.$refs.vbox.clientHeight * 0.9;
  },
};
</script>
<style lang='less' scoped>
.atten_title {
  position: relative;

  >span {
    position: absolute;
    top: 0;
    padding: 5px 10px;
    font-size: 12px;
    z-index: 15;

    &.p {
      left: 0;
    }

    &.n {
      right: 0;
    }
  }
}

.top {
  z-index: 88;
  background-color: #f8f7fa;
}

.head {
  height: 50px;
  box-sizing: border-box;
  padding-left: 60px;
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;

  .logo {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }

  .text {
    width: calc(100% - 50px);
    font-size: 15px;

    h6 {
      font-weight: 600;
    }

    p {
      font-size: 12px;
      color: #999;
      margin-top: 2px;
    }
  }

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
    z-index: 55;
  }
}

.tools {
  section {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 14px;
    color: #999;
    line-height: 1.2;
    padding: 10px 0;

    >p b {
      font-size: 18px;
      padding-right: 2px;
      // font-weight: 600;
    }

    >p {
      font-size: 12px;
    }

    &:first-child>p b {
      display: inline-block;
      font-weight: 600;
      transform: scale(1.2);
    }
  }
}

.v_box {
  height: calc(100% - 130px);
  box-sizing: border-box;
  width: calc(100% - 20px);
  margin: 10px;
  overflow: hidden;
  border-radius: 15px;

  .vv {
    height: 100%;
    overflow-y: scroll;
    background-color: #fff;
  }
}

.clock_model {
  box-sizing: border-box;

  h6 {
    font-weight: 600;
    padding: 20px 0;
    font-size: 15px;
    text-align: center;
  }
}

.clock_success {
  width: 280px;
  height: 350px;
  max-height: 70%;
  background-color: #fff;

  .box {
    height: calc(100% - 44px);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    color: #20a2ff;
  }

  .icon {
    height: 100px;

    img {
      display: block;
      height: 100%;
    }
  }

  .time {
    font-size: 25px;
    font-weight: 650;
    letter-spacing: 2px;
    transform: scale(1, 2);
    padding: 30px 0;
  }

  .desc {
    padding: 10px 0;
  }
}

.menus_box {
  padding: 30px 10px 10px;
}

.image_logo {
  width: 100px;
  height: 100px;
  margin-left: 10px;
}

.clock_h6 {
  font-size: 14px;
  color: #999;
  padding: 5px;
  text-indent: 12px;
}</style>
