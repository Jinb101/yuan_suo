<template>
  <v-view cover @on-view="onview">
    <template v-if="wx.url">
      <template v-if="open">
        <van-empty description="登记离园完成"></van-empty>
      </template>
      <template v-else>
        <van-empty description="正在登记离园,若无响应,请点击下方按钮">
          <van-button size="small" :color="$js.btnColor" @click="once"
            >重试</van-button
          >
        </van-empty>
      </template>
    </template>
    <template v-else>
      <van-empty description="请使用微信扫码进入" image="error"></van-empty>
      <div class="qrcode">
        <div id="qr-code-visitleave"></div>
      </div>
    </template>
  </v-view>
</template>

<script>
export default {
  data() {
    return {
      open: false,
      qr: "",
      wx: {},
      id: "",
    };
  },
  methods: {
    onview(e) {
      this.wx = e.wx;
    },
    once() {
      if (!this.id) {
        return this.$js.wxcode("visitleave");
      }
      this.$api.http("visitleave", { openid: this.id }, () => {
        this.$toast("记录成功");
        this.open = true;
      });
    },
    init() {
      /* eslint-disable */
      let params = demo.getUrl();
      if (params.code) {
        this.$api.http("openid", { type: 1, js_code: params.code }, (r) => {
          try {
            this.id = r.openid;
            this.once();
          } catch (e) {
            console.log("err", e);
          }
        });
      } else {
        this.$js.wxcode("visitleave");
      }
    },
    openqr() {
      this.qr = this.$js.def.qrcode.leave();
      this.$nextTick(() => {
        // eslint-disable-next-line
        new QRCode(demo.$.id("qr-code-visitleave"), {
          text: this.qr,
          width: 200,
          height: 200,
        });
      });
    },
  },
  mounted() {
    // eslint-disable-next-line
    let wx = demo.es6().isWx();
    if (!wx) {
      this.openqr();
      return this.$toast("请使用微信扫码打开");
    } else {
      this.init();
    }
  },
};
</script>
<style lang='less' scoped>
.qrcode {
  width: 200px;
  height: 200px;
  margin: 0 auto;
}
</style>
