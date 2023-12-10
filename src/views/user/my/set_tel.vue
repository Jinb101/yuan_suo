<template>
  <v-view header @on-user="onuser">
    <van-cell title="账号/手机号" :value="user.phone"></van-cell>
    <van-field
      v-model="tel"
      type="tel"
      label="新手机号"
      maxlength="13"
      placeholder="请输入手机号"
    />
    <van-field
      v-model="sms"
      center
      clearable
      label="验证码"
      placeholder="请输入短信验证码"
      maxlength="6"
    >
      <template #button>
        <van-button
          size="small"
          type="info"
          round
          @click="onSms"
          :disabled="nums > 0"
        >
          {{ nums > 0 ? nums + "s" : "获取验证码" }}
        </van-button>
      </template>
    </van-field>
    <section class="send">
      <van-button block round :color="$js.btnColor" @click="sub"
        >修改</van-button
      >
    </section>
  </v-view>
</template>

<script>
export default {
  data() {
    return { user: {}, tel: "", sms: "", nums: 0 };
  },
  methods: {
    onuser(e) {
      this.user = e;
    },
    onSms() {
      if (!this.tel) return this.$toast("请输入手机号");
      this.$api.http("sms", { phone: this.tel, type: "register" }, () => {
        // eslint-disable-next-line
        demo.es6().downTime("", (e) => {
          this.nums = e.all;
        });
        this.$toast("验证码发送成功!请注意查收");
      });
    },
    sub() {
      if (!this.tel) return this.$toast("请输入手机号", 2);
      if (!this.sms) return this.$toast("请输入验证码", 2);
      this.$api.http(
        "checkSms",
        {
          phone: this.tel,
          code: this.sms,
        },
        () => {
          this.$api.http("userinfophone", { phone: this.tel }, () => {
            this.$toast("重置成功");
            // eslint-disable-next-line
            demo.siteConfig.tktoggle("clear");
            // eslint-disable-next-line
            demo.$session.reset();
            this.$nextTick(() => {
              this.appPath("/login");
            });
          });
        }
      );
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.send {
  margin: 30px 18%;
}
</style>
