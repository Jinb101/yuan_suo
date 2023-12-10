<template>
  <div class="atten" :style="tos">
    <div class="head flex" ref="head">
      <span v-for="(i, j) in tq" :key="j + '-d'">{{ i }}</span>
    </div>
    <div class="calendar" :style="tor">
      <div class="day flex fw" ref="days">
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
    <div class="isopenfoot" @click="open = !open">
      {{ open ? "收起" : "查看更多" }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: null,
  },
  data() {
    return {
      list: [],
      index: 0,
      num: 0,
      open: false,
      h1: 0,
      h2: 0,
    };
  },
  computed: {
    dayh() {
      if (this.$refs.days) {
        return this.$refs.days.children[0].clientHeight;
      }
      // eslint-disable-next-line
      let div = demo.js(".atten .calendar .day section");
      return div.height ? div.height() : 0;
    },
    headh() {
      if (this.$refs.head) {
        return this.$refs.head.clientHeight;
      }
      // eslint-disable-next-line
      let div = demo.js(".atten .head");
      return div.height ? div.height() : 0;
    },
    row() {
      return Math.ceil((this.num + 1 + this.index) / 7);
    },
    tos() {
      if (!this.open) {
        return {
          height: this.h1 + this.h2 + "px",
          overflow: "hidden",
        };
      }
      return {};
    },
    tor() {
      if (!this.open) {
        let n = (this.row - 1) * this.h2;
        return {
          transform: "translateY(-" + n + "px)",
        };
      }
      return {};
    },
    tq() {
      return "日一二三四五六".split("");
    },
    detail: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
  },
  watch: {
    detail: {
      handler(v) {
        this.init();
        this.$emit("input", v);
      },
      deep: true,
    },
  },
  inject: ["appTimeout"],
  methods: {
    initsum() {
      this.h1 = this.headh;
      this.h2 = this.dayh;
      try {
        if (this.h1 < 1) {
          // eslint-disable-next-line
          this.h1 = demo.js(".atten .head").height();
        }
        if (this.h2 < 1) {
          // eslint-disable-next-line
          this.h2 = demo.js(".atten .calendar .day section").height();
        }
      } catch (err) {}
    },
    onClickSpan(i, j) {
      this.num = j;
    },
    init() {
      let e = this.detail;
      let col = ["", "green", "danger", "purple", "warning", "info"];
      let s = {};
      if (!e.info) return 0;
      let date = e.$date || {};
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
      let list = demo
        .month()
        .month(date.default)
        .map((r) => {
          let j = val.indexOf(r.time);
          r.ext = j >= 0 ? s[val[j]] : {};
          return r;
        });
      this.list = JSON.parse(JSON.stringify(list));
      let i = this.list[0].week.replace("星期", "");
      this.index = this.tq.indexOf(i);
      // 计算num位置
      let mom = +date.m * 12 + +date.d + date.y * 365;
      // eslint-disable-next-line
      let yoy = demo.timeout("", "array");
      let yom = yoy[0] * 365 + +yoy[1] * 12;
      if (mom >= yom) {
        this.num = +yoy[2] - 1;
      } else {
        this.num = -1;
      }

      this.$nextTick(() => {
        this.initsum();
      });
    },
  },
  mounted() {
    this.detail = this.value;
    // eslint-disable-next-line
    this.init();
  },
};
</script>
<style lang='less' scoped>
.atten {
  padding-bottom: 30px;
  transition: all 0.5s;
  position: relative;
  .isopenfoot {
    height: 30px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 66;
    background-color: #fff;
    text-align: center;
    font-size: 12px;
    color: #999;
    line-height: 30px;
  }
  .calendar {
    transition: all 0.5s;
  }
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
    z-index: 66;
    position: relative;
    background-color: #fff;
    span {
      flex: 1;
    }
  }
  .day {
    // padding: 10px 0;
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
</style>
