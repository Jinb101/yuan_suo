<template>
  <div class="album_year">
    <van-cell title="选择年" :value="yeartext"></van-cell>
    <div class="pad flex fw">
      <span
        v-for="(i, j) in year"
        :key="j"
        @click="os.year = i"
        :class="{ active: +os.year === i }"
        >{{ i }}年</span
      >
    </div>
    <van-cell title="选择学期" :value="semestertext"></van-cell>
    <div class="pad flex">
      <span @click="os.semester = 1" :class="{ active: +os.semester === 1 }"
        >春季学期</span
      >
      <span @click="os.semester = 2" :class="{ active: +os.semester === 2 }"
        >秋季学期</span
      >
    </div>
    <van-cell title="选择自定义时间段"></van-cell>
    <div class="pad flex">
      <span @click="open1 = !open1">{{
        os.start_time ? os.start_time : "选择开始时间"
      }}</span>
      <span @click="open2 = !open2">
        {{ os.end_time ? os.end_time : "选择结束时间" }}
      </span>
    </div>
    <div class="w60">
      <van-button block round :color="$js.btnColor" @click="onsave"
        >点击查询</van-button
      >
    </div>
    <v-t :open="open1" type="year-month" v-model="m1" max="m_1"></v-t>
    <v-t :open="open2" type="year-month" v-model="m2" max="m_6"></v-t>
  </div>
</template>

<script>
import vT from "../../private/time.vue";
export default {
  props: {
    value: null,
  },
  components: { vT },
  computed: {
    val: {
      get: function get() {
        return this.value;
      },
      set: function set(n) {
        this.$emit("input", n);
      },
    },
    yeartext() {
      if (this.os.year) {
        return "已选择" + this.os.year + "年";
      }
      return "";
    },
    semestertext() {
      if (this.os.semester > 0) {
        return "选择" + ["", "春", "秋"][this.os.semester] + "季学期";
      }
      return "";
    },
  },
  watch: {
    val: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
    m1: {
      handler(n) {
        if (n.obj) {
          this.os.start_time = [n.obj.y, n.obj.m].join("/");
        } else {
          this.os.start_time = "";
        }
      },
      deep: true,
    },
    m2: {
      handler(n) {
        if (n.obj) {
          this.os.end_time = [n.obj.y, n.obj.m].join("/");
        } else {
          this.os.end_time = "";
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      year: [],
      os: {
        end_time: "",
        semester: "",
        start_time: "",
        year: "",
      },
      open1: false,
      open2: false,
      m1: {},
      m2: {},
    };
  },
  methods: {
    onsave() {
      let o = { ...this.os };
      if (o.start_time && o.end_time) {
        o.year = "";
        o.semester = "";
      } else {
        o.start_time = "";
        o.end_time = "";
      }
      this.val = o;
      this.$nextTick(() => {
        this.$emit("change", o);
      });
    },
    init() {
      // eslint-disable-next-line
      let time = demo.timeout("", "object");
      let year = [];
      for (let i = 0; i < 20; i++) {
        year.push(time.y + 1 - i);
      }
      this.year = year;
      if (typeof this.val.year !== "undefined") {
        this.os = this.val;
      }
    },
  },
  mounted() {
    this.val = this.value;
    this.init();
  },
};
</script>
<style lang='less' scoped>
.pad {
  padding: 10px;
  font-size: 15px;
  span {
    border: 1px solid #333;
    box-sizing: border-box;
    padding: 10px;
    width: 49%;
    margin-bottom: 8px;
    margin-right: 2%;
    text-align: center;
    border-radius: 5px;
    transition: all 0.3s;
    &.active {
      border-color: #18bc9c;
      color: #fff;
      background-color: #18bc9c;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    }
    &:nth-child(2n) {
      margin-right: 0;
    }
  }
  &.fw {
    span {
      width: 23.4%;
      margin-right: 2%;
      &:nth-child(2n) {
        margin-right: 2%;
      }
      &:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
}
</style>
