<template>
  <v-view header @on-user="onuser">
    <van-cell title="账号/手机号" :value="user.phone"></van-cell>
    <van-field
      v-model="sms"
      label="验证码"
      placeholder="请输入验证码"
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
    <van-field
      v-model="password"
      label="新密码"
      placeholder="请输入6-20位数字或字母密码"
      maxlength="20"
    />
    <van-field
      v-model="password2"
      label="确认密码"
      placeholder="请输入6-20位数字或字母密码"
      maxlength="20"
      type="password"
    />
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
    return { user: {}, sms: "", password: "", password2: "", nums: 0 };
  },
  inject: ["appPath"],
  methods: {
    onuser(e) {
      this.user = e;
    },
    onSms() {
      this.$api.http(
        "sms",
        { phone: this.user.phone, type: "forget_password" },
        () => {
          // eslint-disable-next-line
          demo.es6().downTime("", (e) => {
            this.nums = e.all;
          });
          this.$toast("验证码发送成功!请注意查收");
        }
      );
    },
    sub() {
      if (!this.sms) return this.$toast("请输入验证码");
      if (!this.password) return this.$toast("请输入新密码");
      if (!this.password2) return this.$toast("请再次输入新密码");
      if (this.password.length < 6) {
        return this.$toast("请输入6-20位数字或字母密码");
      }
      if (this.password !== this.password2) {
        return this.$toast("两次密码输入不一致");
      }
      let os = {
        phone: this.user.phone,
        code: this.sms,
        // eslint-disable-next-line
        repassword: md5(this.password2),
        // eslint-disable-next-line
        password: md5(this.password),
      };
      this.$api.http("respwd", os, () => {
        this.$toast("变更成功");
        // eslint-disable-next-line
        demo.siteConfig.tktoggle("clear");
        // eslint-disable-next-line
        demo.$session.reset();
        this.$nextTick(() => {
          this.appPath("/login");
        });
      });
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
