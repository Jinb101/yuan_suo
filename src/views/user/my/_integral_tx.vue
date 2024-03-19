<template>
  <div class="integral_tx">
    <div class="head">
      <p>可提现积分</p>
      <b>￥{{ num }}</b>
    </div>
    <div class="box">
      <van-field
        v-model="money"
        label="提现积分"
        placeholder="请输入提现积分"
        type="number"
        label-width="5em"
        @input="changeinput"
      >
        <template #button>
          <span class="col_primary" @click="money = num">全部提现</span>
        </template>
      </van-field>
      <van-cell title="提现至" value="微信零钱"></van-cell>
    </div>
    <div class="select" v-if="num > mtab[0].t">
      <section
        class="sel"
        v-for="(i, j) in mtab"
        :key="j"
        :class="[{ disable: num < i.t }, { change: index === j }]"
        @click="onchangemoney(i, j)"
      >
        <p>{{ i.v }}元</p>
        <b>{{ i.t }}积分兑换</b>
      </section>
    </div>
    <div class="btn">
      <van-button
        block
        :color="$js.btnColor"
        round
        @click="onsubmit"
        :disabled="dis"
        >立即提现</van-button
      >
    </div>
    <v-f v-model="success" :footer="false" text="提现成功">
      <div class="flex success_view">
        <div class="icon col_green"><van-icon name="success" /></div>
        <p>您已成功提现</p>
        <div class="btn">
          <van-button block round plain type="info" @click="success = false"
            >知道了</van-button
          >
        </div>
      </div>
    </v-f>
  </div>
</template>

<script>
import vF from "../../private/fixed.vue";
// eslint-disable-next-line
const bl = demo.siteConfig.text.moneytograde;
export default {
  props: {
    value: null,
    openid: String,
  },
  data() {
    return {
      mtab: [10, 20, 50, 100, 200, 500].map((s) => {
        return { t: s, v: s / bl };
      }),
      success: false,
      money: "",
      index: "",
      dis: false,
    };
  },
  components: { vF },
  computed: {
    num: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    errors() {
      return this.num < this.money;
    },
  },
  watch: {
    num(v) {
      this.$emit("input", v);
    },
    success(n) {
      if (!n) {
        this.num = this.num - this.money;
        this.$emit("end");
      }
    },
  },
  methods: {
    onchangemoney(i, j) {
      if (this.num < i.t) {
        return 0;
      }
      this.index = j;
      this.money = i.t;
    },
    changeinput() {
      if (this.index !== "") {
        let a = this.mtab[this.index].t;
        if (a !== +this.money) {
          this.index = "";
        }
      }
    },
    onsubmit() {
      if (this.errors) return this.$toast("提现积分过大");
      if (!(this.money > 0)) return this.$toast("请输入提现积分");
      if (this.openid) {
        this.dis = true;
        // 直接提现
        this.$api.http(
          "myintegralget",
          { open_id: this.openid, integral: this.money },
          () => {
            this.$toast("提现申请成功");
            // eslint-disable-next-line
            demo.$session.clear("user");
            this.success = true;
            this.dis = false;
          }
        );
      } else {
        // 获取授权 支付 id 提现
        let os = {
          type: "admin",
          // eslint-disable-next-line
          nid: demo.$local.get("nid", ""),
          path: this.$route.path,
          time: Date.now(),
          checkcode: true,
          money: this.money,
          be: bl,
          // eslint-disable-next-line
          token: demo.$local.get("token", ""),
        };
        // eslint-disable-next-line
        let a = demo.es6().encrypt(os, "", "poster");
        // eslint-disable-next-line
        let url = [
          // eslint-disable-next-line
          demo.siteConfig.api.h5,
          "poster/?type=adminwithdrawal&h5=",
          a,
        ].join("");
        // eslint-disable-next-line
        if (!demo.es6().isWx()) {
          console.log(url);
          return this.$toast("请用微信打开");
        }
        window.location.href = url;
      }
    },
  },
  mounted() {
    this.num = this.value;
  },
};
</script>
<style lang='less' scoped>
.head {
  color: #fff;
  padding: 20px;
  box-sizing: border-box;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  b {
    font-size: 20px;
    margin-top: 5px;
  }
}
.box {
  padding: 10px;
  box-sizing: border-box;
  .van-cell {
    margin-top: 2px;
  }
}
.select {
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  section {
    width: 110px;
    margin-right: 12px;
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 12px;
    padding: 12px 0;
    background-color: #fff;
    margin-bottom: 12px;
    border-radius: 8px;
    box-sizing: border-box;
    color: #666;
    border: 1px solid transparent;
    transition: all 0.3s;
    &.disable {
      filter: blur(1px);
    }
    &.change {
      border-color: red;
      color: red;
    }
    p {
      font-size: 20px;
      margin-bottom: 5px;
    }
    b {
      color: rgb(228, 150, 7);
    }
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
}
.btn {
  padding: 10px 18%;
  width: 100%;
  box-sizing: border-box;
}
.success_view {
  flex-direction: column;
  align-items: center;
  .icon {
    margin-top: 30px;
    font-size: 60px;
    border-radius: 50%;
    border: 4px solid #18bc9c;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    & + p {
      padding: 30px 0;
      font-size: 13px;
      color: #999;
    }
  }
}
</style>
