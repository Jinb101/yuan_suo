<template>
  <v-a ref="login"
       qr
       title="登录">
    <template v-if="wx">
      <!-- 若您有登录账号且绑定微信的 -->
      <van-divider content-position="left"></van-divider>
      <van-button block
                  round
                  type="primary"
                  icon="wechat"
                  @click="onevent('wx')">微信一键登录</van-button>
    </template>
    <!-- 若您有登录账号 -->
    <van-divider content-position="left"></van-divider>
    <van-button block
                round
                type="info"
                icon="phone"
                @click="onevent('login')">账号登录</van-button>
    <!-- 若您是第一次进入 -->
    <van-divider content-position="left"></van-divider>
    <van-button block
                round
                :color="$js.btnColor"
                icon="manager"
                @click="onevent('reg')">新用户注册</van-button>
  </v-a>
</template>

<script>
import vA from "./temp.vue";
export default {
  data() {
    return {
      wx: false,
    };
  },
  inject: ["appPath"],
  components: { vA },
  methods: {
    onevent(e) {
      switch (e) {
        case "wx":
          this.$refs.login.wxlogin();
          break;
        case "login":
          this.appPath("/login1");
          break;
        case "reg":
          if (this.wx) {
            this.$refs.login.wxreg();
          } else {
            this.appPath("/login_reg");
          }
          break;
        default:
      }
    },
  },
  mounted() {
    // eslint-disable-next-line
    console.log(demo.$local.get('demo-login-pwd-1'));
    // eslint-disable-next-line no-undef
    if (demo.es6().isWx()) {
      // eslint-disable-next-line no-undef
      if (demo.$local.get('not_wx_admin') === '1') {
        this.wx = false;
        // eslint-disable-next-line no-undef
      } else {
        this.wx = true
      }
    } else {
      this.wx = false;
    }
    // this.wx = demo.es6().isWx();
  },
};
</script>
<style lang='less' scoped>
.van-button {
  max-width: 190px;
  margin: 0 auto;
}
</style>
