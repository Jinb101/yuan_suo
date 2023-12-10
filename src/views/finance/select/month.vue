<template>
  <v-finance>
    <div class="time flex" v-if="year">
      <span @click="open1 = !open1">{{
        start_time ? start_time : "选择开始时间"
      }}</span>
      <b>~</b>
      <span @click="open2 = !open2">{{
        end_time ? end_time : "选择结束时间"
      }}</span>
    </div>
    <div class="tab flex">
      <span :class="{ active: type === '1' }" @click="type = '1'">利润表</span>
      <span :class="{ active: type === '2' }" @click="type = '2'"
        >现金流表</span
      >
    </div>
    <div class="box">
      <div class="cont" @click="open = true">
        <h2>{{ title }}</h2>
        <h3>总余额：{{ num }}</h3>
        <p>{{ toNum }}</p>
        <div class="hand">
          <van-image :src="hand"></van-image>
        </div>
      </div>
      <v-m v-model="det"></v-m>
    </div>
    <template #fixed>
      <v-f v-model="open" :footer="false" text="财报详情">
        <v-m v-model="det" :time="[start_time, end_time]"></v-m>
      </v-f>
      <v-t v-model="start_time" :open="open1" ymd max="d_1"></v-t>
      <v-t v-model="end_time" :open="open2" ymd max="y_1"></v-t>
    </template>
  </v-finance>
</template>

<script>
import vM from "./_month.vue";
import vF from "../../private/fixed.vue";
import vT from "../../private/time.vue";
export default {
  props: {
    year: Boolean,
  },
  data() {
    return {
      type: "1",
      start_time: "",
      end_time: "",
      num: 0,
      det: {},
      title: "",
      open: false,
      open1: false,
      open2: false,
      // eslint-disable-next-line
      hand: demo.siteConfig.staticicon(3),
    };
  },
  components: { vM, vF, vT },
  computed: {
    toNum() {
      // eslint-disable-next-line
      let a = demo.es6().toChinaNum(parseFloat(this.num), true);
      if (a.indexOf("元") < 0) return a + "元";
      return a;
    },
  },
  watch: {
    type() {
      this.open = false;
      this.init();
    },
  },
  methods: {
    init() {
      this.$api.http("financemonthly", { type: this.type }, (r) => {
        this.num = r;
      });
      this.$api.http(
        "financesummary",
        {
          type: this.type,
          start_time: this.start_time,
          end_time: this.end_time,
        },
        (r) => {
          this.det = r;
        }
      );
    },
    oninit() {
      // eslint-disable-next-line
      let time = demo.timeout("", "array");
      if (this.year) {
        // 期间
        // eslint-disable-next-line
        this.start_time = demo.month().past(6).ymd;
        this.end_time = [time[0], time[1], time[2]].join("/");
      } else {
        // eslint-disable-next-line
        this.end_time = demo.month().monthend().ymd;
        this.start_time = [time[0], time[1], "01"].join("/");
      }
    },
  },
  mounted() {
    this.oninit();
    // 月度 默认 当前时间 月份 1号 到 30号
    // 期间 默认 当前时间 至 之前 六个月
    this.init();
    // eslint-disable-next-line
    this.title = demo.$session.get("user", {}).nursery_name;
  },
};
</script>
<style lang='less' scoped>
.time {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: #fff;
  line-height: 50px;
  b {
    padding: 0 12px;
  }
  span {
    flex: 1;
    text-align: center;
    color: #666;
    font-size: 15px;
    font-weight: 650;
  }
}
.tab {
  height: 50px;
  background-color: #fff;
  border-radius: 45px 45px 0 0;
  margin-top: 10px;
  span {
    flex: 5;
    text-align: center;
    font-size: 16px;
    font-weight: 650;
    line-height: 50px;
    border-radius: 45px 45px 0 0;
    transition: all 0.3s;
    &.active {
      flex: 6;
      color: #fff;
      background: linear-gradient(180deg, #6943f2, #fff);
    }
  }
}
.box {
  padding: 10px;
  background-color: #fff;
  font-size: 16px;
  .cont {
    padding: 8px;
    border-radius: 16px 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    position: relative;
    .hand {
      position: absolute;
      right: 20px;
      bottom: 0;
      width: 20px;
      height: 30px;
      opacity: 0.5;
      transform: scale(1.2) rotate(-45deg);
      margin: auto;
      top: 0;
      animation: run1 8s infinite;
    }
    h2 {
      padding: 10px 0;
      font-weight: 650;
    }
    h3 {
      margin-bottom: 8px;
      color: tomato;
      font-weight: 650;
    }
    p {
      font-size: 13px;
    }
  }
}
@keyframes run1 {
  0% {
    transform: scale(0.8) rotate(-45deg);
  }
  50% {
    transform: scale(1.2) rotate(-45deg);
  }
  100% {
    transform: scale(0.8) rotate(-45deg);
  }
}
</style>
