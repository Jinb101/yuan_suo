<template>
  <v-view
    header
    cover
    :index="400"
    @on-view="onView"
    :text="text"
    :back="back"
    @on-back="appOnBackOld('work')"
  >
    <template #menu>
      <slot name="menu" />
    </template>
    <div class="finance_view">
      <slot />
    </div>
    <template #fixed>
      <v-f :index="9999" v-model="login_open" :footer="false" text="登录财务">
        <div class="finance_login">
          <div class="logo">
            <van-image :src="logincover"></van-image>
          </div>
          <h3>{{ config.name }}</h3>
          <p class="desc col_danger" v-if="!logins.ispwd">
            初次登录，请设置财务专属登录密码
          </p>
          <div class="inputs">
            <div class="cell">
              <van-field
                v-model="logins.password"
                type="password"
                label="密码"
                label-width="4em"
                maxlength="28"
                placeholder="请设置登录密码"
              />
            </div>
            <div class="cell" v-if="resetpwd">
              <van-field
                v-model="logins.code"
                label="验证码"
                label-width="4em"
                maxlength="6"
                placeholder="请输入验证码"
              >
                <template #button>
                  <span class="col_green" @click="onSms">{{ smstext }}</span>
                </template>
              </van-field>
            </div>
          </div>
          <div class="btns">
            <van-button block :color="$js.btnColor" round @click="onLogin">
              {{ logintext }}
            </van-button>
            <span class="reset col_warning" @click="logins.edit = !logins.edit">
              {{ logins.edit ? "去登录" : "忘记密码" }}
            </span>
          </div>
        </div>
      </v-f>
      <slot name="fixed" />
    </template>
  </v-view>
</template>

<script>
import vView from "./view.vue";
import vF from "../private/fixed.vue";
export default {
  props: {
    text: String,
    back: Boolean,
  },
  data() {
    return {
      token: "",
      login_open: false,
      config: {},
      logins: {
        password: "",
        code: "",
        nums: 0,
        ispwd: false,
        edit: false,
        level: 0,
      },
      // eslint-disable-next-line
      logincover: demo.siteConfig.staticicon(2),
    };
  },
  inject: ["appGetFinance", "appOnBackOld"],
  components: { vView, vF },
  watch: {
    login_open(n) {
      if (!n && this.token === "") {
        this.$router.back();
      }
    },
  },
  computed: {
    smstext() {
      return this.logins.nums > 0 ? this.logins.nums + "s" : "获取验证码";
    },
    resetpwd() {
      return !this.logins.ispwd || this.logins.edit;
    },
    logintext() {
      if (!this.logins.ispwd) return "设置并登入";
      if (this.logins.edit) return "重置密码";
      return "登入";
    },
  },
  methods: {
    onView(e) {
      this.config = e.config || {};
    },
    onSms() {
      if (this.logins.nums > 0) return 0;
      this.$api.http("fincode", {}, () => {
        // eslint-disable-next-line
        demo.es6().downTime("", (e) => {
          this.logins.nums = e.all;
        });
        this.$toast("验证码发送成功，请注意查收！");
      });
    },
    onLogin() {
      if (this.logins.password === "") {
        return this.$toast("请输入密码");
      }
      let api = "finlogin";
      let os = {
        // eslint-disable-next-line
        password: md5(this.logins.password),
      };
      if (this.resetpwd) {
        if (this.logins.code === "") {
          return this.$toast("请输入验证码");
        }
        api = "finreset";
        os.confirm_password = os.password;
        os.code = this.logins.code;
      }
      this.$api.http(api, os, (token) => {
        // eslint-disable-next-line
        demo.$local.set("finance-token", token);
        this.$toast("登录成功");
        this.token = token;
        this.login_open = false;
      });
    },
  },
  mounted() {
    // eslint-disable-next-line
    this.token = demo.$local.get("finance-token", "");
    this.login_open = this.token === "";
    this.appGetFinance((e) => {
      this.logins.ispwd = e.ispwd;
      this.logins.level = e.level;
    });
  },
};
</script>
<style lang='less' scoped>
.finance_login {
  text-align: center;
  font-size: 16px;
  h3 {
    padding: 30px 0;
    font-size: 14px;
  }
  .inputs {
    padding: 20px;
    background: linear-gradient(45deg, #c9b3e1, #e7c9e1);
    margin: 45px 15px 15px;
    border-radius: 30px 0;
  }
  .cell {
    border-radius: 5px;
    overflow: hidden;
    & + .cell {
      margin-top: 8px;
    }
  }
  .btns {
    padding: 30px;
    margin: 0 15px;
  }
  .reset {
    padding: 5px;
    font-size: 14px;
    margin-top: 15px;
    display: inline-block;
  }
  .logo {
    width: 280px;
    height: 280px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    margin: auto;
    z-index: -1;
    opacity: 0.3;
  }
}
</style>
