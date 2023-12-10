<template>
  <div class="index_set_time">
    <div class="title flex">
      <span @click="onToTime(-1)">上一月</span>
      <p @click="show = !show">{{ times ? times : "选择时间" }}</p>
      <span @click="onToTime(1)">下一月</span>
    </div>
    <div class="day">
      <section class="head flex">
        <span>日</span>
        <span>一</span>
        <span>二</span>
        <span>三</span>
        <span>四</span>
        <span>五</span>
        <span>六</span>
      </section>
      <van-checkbox-group v-model="result">
        <section class="body flex fw">
          <span v-for="(i, j) in timearr" :key="j" @click="onToggle(i)">
            <template v-if="i.week">
              <div class="check">
                <van-checkbox :name="i.timeout"></van-checkbox>
              </div>
              <i class="cover" v-if="result.indexOf(i.timeout) >= 0"></i>
              <b>{{ i.day }}</b>
            </template>
          </span>
        </section>
      </van-checkbox-group>
    </div>
    <van-field
      v-model="len"
      label="考勤天数"
      placeholder="请输入考勤天数"
      type="digit"
    />
    <div class="btn">
      <van-button round block type="primary" @click="onSubmit"
        >提交设置</van-button
      >
    </div>
    <v-t
      v-model="time"
      type="year-month"
      :open="show"
      :once="once"
      max="m_1"
    ></v-t>
  </div>
</template>

<script>
// 设置考勤天数
import vT from "../private/time.vue";
export default {
  props: {
    value: null,
  },
  data() {
    return {
      time: {},
      show: false,
      once: 0,
      result: [],
    };
  },
  computed: {
    len: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
    times() {
      if (this.time.obj) {
        return this.time.obj.y + "年" + this.time.obj.m + "月";
      }
      return "";
    },
    timearr() {
      if (this.time.obj) {
        // eslint-disable-next-line
        let val = demo.month().month(this.time.time);
        let index = val[0].index;
        let n = [];
        if (index > 0) {
          for (let i = 0; i < index; i++) {
            n.push({});
          }
        }
        return [...n, ...val];
      }
      return [];
    },
    uns() {
      return this.timearr.filter((s) => {
        return !s.week;
      }).length;
    },
  },
  watch: {
    "time.time"() {
      this.onToggleChange();
    },
    len(n) {
      this.$emit("input", n);
    },
    "result.length"(n) {
      this.len = n;
    },
  },
  components: { vT },
  methods: {
    onToTime(index) {
      this.once = index;
      this.$nextTick(() => {
        this.once = 2;
      });
    },
    onToggle(j) {
      if (this.result.indexOf(j.timeout) > -1) {
        this.result = this.result.filter((s) => s !== j.timeout);
      } else {
        this.result.push(j.timeout);
      }
    },
    onToggleChange() {
      let result = [];
      this.timearr.forEach((k) => {
        if (k.index > 0 && k.index < 6) {
          k.timeout && result.push(k.timeout);
        }
      });
      if (this.value > result.length) {
        result = [];
        this.timearr.forEach((k) => {
          k.timeout && result.push(k.timeout);
        });
      }
      if (result.length > this.value) {
        result = result.splice(0, this.value);
      }
      this.result = result;
    },
    onSubmit() {
      let o = this.time.obj;
      this.$api.http(
        "attensetnum",
        {
          years: [o.y, o.m].join("-"),
          day: this.value,
        },
        () => {
          this.$js.message("设置成功");
          // eslint-disable-next-line
          demo.$session.clear("index");
          this.$emit("on-init");
        }
      );
    },
  },
  mounted() {
    // this.len = this.value;
  },
};
</script>
<style lang='less' scoped>
.title {
  padding: 10px;
  font-size: 14px;
  p {
    flex: 1;
    text-align: center;
    font-weight: 650;
  }
  p,
  span {
    padding: 5px;
  }
}
.btn {
  margin: 40px 15% 10px;
}
.day {
  box-sizing: border-box;
  margin: 0 15px;
  padding: 10px;
  background-color: #fff;
  border-radius: 15px 15px 5px 5px;
  box-shadow: 0 5px 5px #f9f9f9;
  span {
    width: 14.285%;
    text-align: center;
    line-height: 40px;
    position: relative;
    i {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 5;
      transform: scale(0.95);
      border-radius: 5px;
      background-color: #825fff;
      & + b {
        color: #fff;
      }
    }
    b {
      position: relative;
      z-index: 6;
    }
    .check {
      position: absolute;
      z-index: 1;
      transform: scale(0);
    }
  }
  .head {
    font-size: 13px;
    span {
      font-weight: 650;
    }
  }
  .body {
    font-size: 14px;
  }
}
</style>
