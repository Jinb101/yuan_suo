<template>
  <v-view header>
    <div class="class_3">
      <div class="app_top" v-if="!child">
        <van-cell
          :title="times"
          is-link
          value="点击查询历史出勤"
          @click="open = !open"
        ></van-cell>
      </div>
      <div class="calendar">
        <div class="head flex">
          <span v-for="(i, j) in tq" :key="j + '-d'">{{ i }}</span>
        </div>
        <div class="day flex fw">
          <template v-if="index > 0">
            <section v-for="(i, j) in index" :key="j" class="box"></section>
          </template>
          <section
            v-for="(i, j) in list"
            :key="j + '-li'"
            :class="[{ active: num === j }]"
            @click="onClickSpan(i, j)"
            class="box"
          >
            <b>{{ i.day }}</b>
            <div class="circle">
              <span :class="i.ext.enter"></span>
              <span :class="i.ext.leave"></span>
            </div>
          </section>
        </div>
      </div>
      <div class="texts flex van-hairline--top">
        <div class="num">
          <p>{{ detail.attendance }}<b>天</b></p>
          <span>当月出勤天数</span>
        </div>
        <div class="tag">
          <p>迟到：{{ detail.late }}次</p>
          <p>早退：{{ detail.leave_early }}次</p>
          <p>缺勤：{{ detail.absence }}次</p>
          <p>请假：{{ detail.leave }}次</p>
        </div>
      </div>
      <div class="btn flex fw" v-if="!child">
        <van-button
          round
          block
          plain
          type="info"
          size="small"
          @click="open1 = true"
          >打卡记录</van-button
        >
        <van-button
          round
          block
          plain
          type="primary"
          size="small"
          @click="open2 = true"
          >请假记录</van-button
        >
        <van-button
          round
          block
          plain
          type="info"
          size="small"
          @click="open3 = true"
          >上传考勤图</van-button
        >
        <!-- <van-button
          round
          block
          plain
          type="warning"
          size="small"
          @click="open4 = true"
          >考勤打卡</van-button
        > -->
      </div>
      <div class="tips">
        <h6>提示/Tips</h6>
        <p>不同考勤状态对应不同颜色的小点</p>
        <div class="hp flex">
          <p><i class="bgc_purple"></i><b>迟到</b></p>
          <p><i class="bgc_warning"></i><b>早退</b></p>
          <p><i class="bgc_danger"></i><b>缺勤</b></p>
          <p><i class="bgc_info"></i><b>请假</b></p>
          <p><i class="bgc_green"></i><b>打卡</b></p>
        </div>
      </div>
      <slot />
      <v-t :open="open" v-model="t1" max="m_0" type="year-month"></v-t>
      <v-f v-model="open1" :footer="false" text="考勤记录">
        <v-p :time="time"></v-p>
      </v-f>
      <v-f v-model="open2" :footer="false" text="请假记录">
        <v-l></v-l>
      </v-f>
      <v-f v-model="open3" :footer="false" text="考勤图设置">
        <v-a></v-a>
      </v-f>
    </div>
  </v-view>
</template>

<script>
import vT from "../../private/time.vue";
import vF from "../../private/fixed.vue";
import vP from "./_atten_punch.vue";
import vL from "./_atten_leave.vue";
import vA from "./_atten_pic.vue";
export default {
  props: {
    child: Boolean,
  },
  data() {
    return {
      date: [],
      detail: {},
      info: {},
      list: [],
      index: 0,
      day: "",
      num: 0,
      t1: {},
      open: false,
      open1: false,
      open2: false,
      open3: false,
      open4: false,
    };
  },
  components: { vT, vF, vP, vL, vA },
  computed: {
    time() {
      if (!this.date.y) return "";
      return [this.date.y, this.date.m].join("-");
    },
    times() {
      if (!this.date.y) return "";
      return [this.date.y, "年", this.date.m, "月出勤"].join("");
    },
    tq() {
      return "日一二三四五六".split("");
    },
  },
  watch: {
    time() {
      this.init();
    },
    date: {
      handler(n) {
        this.day = [n.y, n.m, n.d].join("/");
      },
      deep: true,
    },
    t1: {
      handler(n) {
        if (n.obj) {
          this.date = n.obj;
        }
      },
      deep: true,
    },
  },
  inject: ["appTimeout"],
  methods: {
    onClickSpan(i, j) {
      this.num = j;
    },
    init() {
      this.$api.http("usermyatten", { date: this.time }, (e) => {
        this.detail = e;
        let col = ["", "green", "danger", "purple", "warning", "info"];
        let s = {};
        Object.values(e.info).forEach((r, v) => {
          let time = r.specific_date.replace(/-/g, "/");
          s[time] = {
            time,
            index: v,
            enter: "bgc_" + col[+r.enter_status],
            leave: "bgc_" + col[+r.leave_status],
          };
        });
        let val = Object.keys(s);
        // eslint-disable-next-line
        this.list = demo
          .month()
          .month(this.date.default)
          .map((r) => {
            let j = val.indexOf(r.time);
            r.ext = j >= 0 ? s[val[j]] : {};
            return r;
          });
        let i = this.list[0].week.replace("星期", "");
        this.index = this.tq.indexOf(i);
        // 计算num位置
        let mom = +this.date.m * 12 + +this.date.d + this.date.y * 365;
        // eslint-disable-next-line
        let yoy = demo.timeout("", "array");
        let yom = yoy[0] * 365 + +yoy[1] * 12;
        if (mom >= yom) {
          this.num = +yoy[2] - 1;
        } else {
          this.num = -1;
        }
      });
    },
  },
  mounted() {
    // eslint-disable-next-line
    this.date = demo.timeout("", "object");
  },
};
</script>
<style lang='less' scoped>
.class_3 {
  padding-bottom: 40px;
  .calendar {
    .head,
    .day {
      align-items: center;
      text-align: center;
      font-size: 15px;
    }
    .head {
      height: 40px;
      font-weight: 650;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
      span {
        flex: 1;
      }
    }
    .day {
      padding: 10px 0;
      .box {
        height: 53px;
        width: 14.2%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        overflow: hidden;
        flex-direction: column;
        position: relative;
        transition: all 0.3s;
        &.active {
          background-color: #99cc33;
          color: #fff;
          > b {
            font-weight: 650;
          }
        }
      }
      .circle {
        position: absolute;
        bottom: 8px;
        left: 0;
        right: 0;
        margin: auto;
        display: flex;
        width: 80%;
        justify-content: center;
        span {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          & + span {
            margin-left: 3px;
          }
        }
      }
    }
  }
  .texts {
    font-size: 14px;
    padding-top: 5px;
    color: #888;
    .num,
    .tag {
      width: 50%;
      box-sizing: border-box;
      text-align: center;
    }
    .tag {
      text-align: right;
      padding-right: 30px;
      line-height: 1.5;
    }
    .num {
      padding-top: 10px;
      p {
        margin-bottom: 10px;
        font-size: 40px;
        color: #2ea875;
        b {
          color: #999;
          font-size: 14px;
        }
      }
    }
  }
  .tips {
    font-size: 14px;
    color: #999;
    padding: 0 10px;
    margin-top: 35px;
    h6 {
      font-weight: 650;
      padding: 5px 0;
    }
    > p {
      line-height: 1.5;
      margin-top: 2px;
    }
    .hp {
      p {
        flex: 1;
        i {
          width: 8px;
          height: 8px;
          display: inline-block;
          vertical-align: middle;
          border-radius: 50%;
          margin-right: 3px;
        }
      }
    }
  }
  .btn {
    padding: 10px 10px 0;
    justify-content: center;
    .van-button {
      // width: 40%;
      // margin: 0 5% 10px;
      margin: 0 5px;
      flex: 1;
    }
  }
}
</style>
