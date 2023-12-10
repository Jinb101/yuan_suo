<template>
  <v-view header bgc="#f8f7fa">
    <div class="app_top">
      <van-tabs v-model="active">
        <van-tab
          :name="i.v"
          :title="i.s"
          v-for="(i, j) in tab"
          :key="j"
        ></van-tab>
      </van-tabs>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <ul>
        <li v-for="(i, j) in item" :key="j" @click.stop="ondet(i)">
          <h6>订单编号：{{ i.order_sn }}</h6>
          <p
            class="status"
            :class="{ col_primary: [1, 3].indexOf(+i.status) >= 0 }"
          >
            {{ types[i.status - 1] || "" }}
          </p>
          <div class="v">
            <template v-if="+i.activity_type === 0">
              <p><van-icon name="vip-card-o" />{{ type3[i.type] }}续费开通</p>
            </template>
            <template v-else>
              <p>
                <van-icon name="flag-o" />活动名称:
                {{ (i.vote || {}).activity_name || "" }}
              </p>
              <p>
                <van-icon name="label-o" />{{ type2[i.activity_type] || "" }}
              </p>
            </template>
          </div>
          <div class="foot">
            <p class="price">{{ i.price }}</p>
            <p class="time">{{ appTimeout(i.create_time) }}</p>
          </div>
          <div class="btn">
            <template v-if="[1, 3].indexOf(+i.status) >= 0">
              <van-button size="small" round>取消订单</van-button>
              <van-button size="small" round type="info" @click.stop="onpay(i)"
                >立即支付</van-button
              >
            </template>
          </div>
        </li>
      </ul>
    </v-page>
    <template #fixed>
      <v-f v-model="open" :footer="false" text="订单详情">
        <template v-if="+det.activity_type === 0">
          <van-cell title="套餐购买" :value="type3[det.type]"></van-cell>
        </template>
        <template v-else>
          <van-cell title="活动名称" :value="det.activity_name"></van-cell>
          <van-cell
            title="活动类型"
            :value="type2[det.activity_type]"
          ></van-cell>
        </template>
        <van-cell title="订单号" :value="det.order_sn"></van-cell>
        <van-cell title="订单金额" :value="det.price"></van-cell>
        <van-cell title="订单状态" :value="types[det.status]"></van-cell>
        <div class="btn2">
          <template v-if="[1, 3].indexOf(+det.status) >= 0">
            <van-button>取消订单</van-button>
            <van-button type="info" @click.stop="onpay(det)"
              >立即支付</van-button
            >
          </template>
        </div>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
export default {
  data() {
    return {
      active: "",
      tab: ["全部", "待支付", "已支付", "已退款", "已取消"].map((s, v) => {
        return { s, v };
      }),
      item: [],
      types: ["待支付", "已支付", "补差价", "已付款", "已退款", "已取消"],
      type2: ["购卡", "园所活动", "班级活动"],
      type3: {
        season_card: "季卡",
        monthly_card: "月卡",
        half_year_card: "半年卡",
        annual_pass: "年卡",
      },
      det: {},
      open: false,
    };
  },
  components: { vF },
  watch: {
    active() {
      this.onPage(1);
    },
  },
  inject: ["appTimeout"],
  methods: {
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("voteorder", { page, status: this.active }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
    ondet(e) {
      this.det = {};
      this.open = false;
      this.$api.http("voteorders", { vote_order_id: e.vote_order_id }, (r) => {
        this.det = r;
        this.open = true;
      });
    },
    onpay(e) {
      let os = {
        paytype: e.type,
        price: e.price,
      };
      if (e.vote && e.vote.vote_id) {
        os.vote_id = e.vote_id;
        os.paytype = "single_time";
      }
      // if (+e.status === 3) {
      //   e.price = e.amount;
      // }
      let url = this.$js.wxshareh5(
        "votepay",
        {
          checkcode: true,
          pay: true,
          // eslint-disable-next-line
          token: demo.$local.get("token"),
          path: this.$route.path,
          ...os,
        },
        "",
        true
      );
      if (this.$js.env) {
        console.log(url);
        return 0;
      }
      window.location.replace(url);
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
li {
  padding: 10px;
  box-sizing: border-box;
  margin: 10px;
  margin-bottom: 0;
  border-radius: 10px;
  background-color: #fff;
  font-size: 15px;
  position: relative;
  color: #999;
  h6 {
    font-size: 12px;
  }
  .status {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 12px;
  }
  .btn {
    position: absolute;
    right: 10px;
    bottom: 10px;
    display: flex;
    .van-button {
      min-width: 80px;
      margin-left: 10px;
    }
  }
  .v {
    padding: 15px 5px;
    color: #333;
    line-height: 1.5;
    p {
      display: flex;
      align-items: center;
      .van-icon {
        margin-right: 5px;
      }
    }
  }
  .foot {
    min-height: 35px;
    .price {
      font-size: 20px;
      color: rgb(255, 195, 83);
      position: relative;
      height: 20px;
      text-indent: 14px;
      &::before {
        position: absolute;
        content: "￥";
        left: -14px;
        bottom: 0;
        font-size: 14px;
      }
    }
    .time {
      font-size: 12px;
      margin-top: 5px;
    }
  }
}
.btn2 {
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  .van-button {
    flex: 1;
  }
}
</style>
