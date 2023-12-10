<template>
  <div class="month_detail" :class="{ pad: !!times }">
    <div class="month_view" ref="monthview">
      <div class="time" v-if="times">{{ times }}</div>
      <div class="boxs">
        <h6>经营结果汇总</h6>
        <div class="list flex fw">
          <p v-for="(i, j) in line1" :key="j" class="p">
            {{ i.s }}:<b>{{ i.n }}元</b>
          </p>
        </div>
      </div>
      <div class="boxs">
        <h6>支出项</h6>
        <div class="list">
          <p class="p3" v-if="!line2.length">暂无</p>
          <p v-for="(i, j) in toData(line2)" :key="j + 'p2'" class="p2">
            {{ i.label }}:<b class="col_danger">{{ i.value }}元</b>
            <span class="col_green">{{ i.prop }}</span>
          </p>
        </div>
      </div>
      <div class="boxs">
        <h6>收入项</h6>
        <div class="list">
          <p class="p3" v-if="!line3.length">暂无</p>
          <p v-for="(i, j) in toData(line3)" :key="j + 'p3'" class="p2">
            {{ i.label }}:<b class="col_danger">{{ i.value }}元</b>
            <span class="col_green">{{ i.prop }}</span>
          </p>
        </div>
      </div>
      <div class="boxs">
        <h6>费用明细</h6>
        <div class="list">
          <p class="p3" v-if="!line4.length">暂无</p>
          <p v-for="(i, j) in toData(line4)" :key="j + 'p4'" class="p2">
            {{ i.label }}:<b class="col_danger">{{ i.value }}元</b>
            <span class="col_green">{{ i.prop }}</span>
          </p>
        </div>
      </div>
    </div>
    <template v-if="!!times">
      <div class="btn">
        <van-button block round type="info" @click="onsave"
          >生成财报图片</van-button
        >
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    value: null,
    time: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      pic: "",
    };
  },
  computed: {
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    times() {
      if (this.time.length === 2) {
        return [this.time[0], this.time[1]].join("~~");
      }
      return "";
    },
    line1() {
      let ext = this.ext;
      let arr = [ext.income, ext.expenditure, ext.profit, ext.average_charge];
      return ["收入合计", "费用合计", "利润合计", "平均收费"].map((s, v) => {
        return { s, n: arr[v] };
      });
    },
    line2() {
      let o = this.ext;
      return (o.expense_details || []).map((s) => {
        return { label: s.classify_name, value: +s.apportioned_amount };
      });
    },
    line3() {
      let o = this.ext;
      return (o.income_item || []).map((s) => {
        return { label: s.classify_name, value: +s.apportioned_amount };
      });
    },
    line4() {
      let o = this.ext;
      return (o.expenditure_item || []).map((s) => {
        return {
          label: s.classify_name,
          value: +s.apportioned_amount,
        };
      });
    },
  },
  watch: {
    ext: {
      handler(v) {
        this.pic = "";
        this.$emit("input", v);
      },
      deep: true,
    },
  },
  inject: ["appShowImage"],
  methods: {
    toData(arr) {
      if (!arr.length) return [];
      let max = arr.map((s) => {
        return +s.value;
      });
      // eslint-disable-next-line
      let maxprice = demo.array(max.concat(0)).sum(0);
      return arr.map((s) => {
        s.prop = +((s.value / maxprice) * 100).toFixed(2) + "%";
        return s;
      });
    },
    async onsave() {
      if (this.pic) {
        return this.appShowImage(this.pic);
      }
      // eslint-disable-next-line
      let img = await demo.es6().tocanvas(".month_view");
      this.pic = img.img;
      this.appShowImage(img.img);
    },
  },
  mounted() {
    this.ext = this.value;
    this.pic = "";
  },
};
</script>
<style lang='less' scoped>
.month_detail {
  &.pad {
    padding: 10px;
  }
  .time {
    font-size: 13px;
    text-align: right;
    margin-bottom: 15px;
  }
  .boxs {
    margin-bottom: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    border-radius: 15px 5px;
    padding: 15px 0;
    &:nth-child(2n) {
      border-radius: 5px 15px;
    }
    h6 {
      color: #7354f8;
      position: relative;
      padding: 5px 0;
      padding-left: 20px;
      font-weight: 650;
      letter-spacing: 1px;
      margin-bottom: 10px;
      font-size: 16px;
      &::before {
        position: absolute;
        content: "";
        width: 2px;
        height: 12px;
        left: 10px;
        top: 0;
        bottom: 0;
        margin: auto;
        background-color: #7354f8;
      }
    }
  }
  .list {
    position: relative;
    padding: 0 15px;
  }
  .p,
  .p2 {
    font-size: 13px;
    line-height: 20px;
    margin-bottom: 5px;
    b {
      font-weight: 650;
      padding-left: 3px;
    }
  }
  .p {
    width: 50%;
    box-sizing: border-box;
    padding-right: 5px;
    word-break: break-all;
  }
  .p2 {
    position: relative;
    span {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .p3 {
    width: 100%;
    text-align: center;
    font-size: 12px;
    padding: 10px;
    color: #999;
    box-sizing: border-box;
  }
}
.btn {
  padding: 30px 20%;
}
</style>
