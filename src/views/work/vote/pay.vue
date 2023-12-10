<template>
  <div class="pay">
    <div class="items flex fw">
      <div
        class="item"
        v-for="(i, j) in item"
        :key="j"
        :class="[
          { disable: i.index >= 100 },
          { active: index === i.index && i.index < 100 },
        ]"
        @click="ondet(i)"
      >
        <p>{{ i.title }}</p>
        <span>{{ i.val.price }}</span>
        <b>共{{ i.val.number }}次投票活动</b>
      </div>
    </div>
    <div class="buy" v-if="index > 0 && index < 100">
      <van-button block round type="info" @click="onpay">购买并支付</van-button>
    </div>
    <van-divider>投票规则</van-divider>
    <div class="app_frame_content" v-html="content"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: [],
      content: "",
      index: "",
    };
  },
  methods: {
    onpay() {
      this.$emit("pay", this.det);
    },
    ondet(e) {
      this.det = e;
      this.index = e.index;
    },
    on1() {
      let tx = {
        single_time: "单作品 / 日",
        season_card: "季卡",
        monthly_card: "月卡",
        half_year_card: "半年卡",
        annual_pass: "年卡",
      };
      this.$api.http("voteprice", {}, (r) => {
        let a = Object.keys(r).map((k, v) => {
          return {
            type: k,
            title: tx[k],
            val: typeof r[k] === "string" ? { price: r[k] } : r[k],
            index: typeof r[k] === "string" ? v + 100 : v,
          };
        });
        // eslint-disable-next-line
        this.item = demo.array(a).sort("index").sort();
        this.ondet(this.item[0]);
      });
    },
    on2() {
      this.$api.http("voterule", {}, (r) => {
        this.content = typeof r === "string" ? r : "";
      });
    },
    init() {
      this.on1();
      this.on2();
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.items {
  .item {
    margin: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 10px;
    border: 2px solid #999;
    border-radius: 15px;
    background-color: #fff;
    font-weight: 650;
    flex-direction: column;
    width: 150px;
    justify-content: space-between;
    font-size: 16px;
    transition: all 0.3s;
    p {
      padding: 10px 0;
    }
    span {
      font-size: 24px;
      padding: 15px 0 20px;
      color: #d5a656;
      position: relative;
      &::before {
        position: absolute;
        content: "￥";
        left: -14px;
        bottom: 22px;
        font-size: 14px;
      }
    }
    b {
      font-size: 12px;
      padding: 5px;
      border-radius: 10px;
      background-color: #f3d4a3;
      color: #fff;
    }
    &.active {
      border-color: #d9c190;
      background-color: #fcf5ea;
    }
    &.disable {
      border-color: #999 !important;
      background-color: #fff !important;
      opacity: 0.3;
      display: none;
      b {
        display: none;
      }
    }
  }
}
.buy {
  margin: 10px 10%;
}
</style>
