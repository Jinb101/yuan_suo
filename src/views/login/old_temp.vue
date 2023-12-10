<template>
  <v-view @on-view="onView" @on-init="onInit" ref="viewPage">
    <template v-if="isios">
      <div class="cover_ios" :style="{ background: $js.btnColor }"></div>
    </template>
    <template v-else>
      <div class="covers" v-html="coverHtml" ref="covers"></div>
    </template>
    <div class="foot_cover"></div>
    <div class="qr" v-if="qrstate" @click="onshowqr">
      <van-icon name="qr" />
    </div>
    <div class="login" ref="logins">
      <div class="h1 flex">
        <h5>{{ title }}</h5>
        <div class="logo">
          <van-image :src="src" fit="cover"></van-image>
        </div>
      </div>
      <div class="views">
        <slot />
      </div>
    </div>
    <template #fixed>
      <transition name="van-slide-left">
        <div class="app_show_fixed" v-if="open">
          <v-view header back @on-back="open = false" text="用户登录协议">
            <x-content>
              <div class="app_frame_content" v-html="agrees"></div>
            </x-content>
          </v-view>
        </div>
      </transition>
      <v-f v-model="open1" text="扫码登录" :footer="false" cover>
        <div class="qrs">
          <div id="qr-login-view"></div>
        </div>
        <p class="qr_desc">请打开我的园所-设置-扫码登录进行扫码</p>
      </v-f>
      <slot name="footer" />
    </template>
  </v-view>
</template>

<script>
import vF from "../private/fixed.vue";
export default {
  props: {
    title: String,
    qr: Boolean,
  },
  computed: {
    qrstate() {
      // eslint-disable-next-line
      return !!demo.siteConfig.params.debug && this.qr;
    },
  },
  components: { vF },
  data() {
    return {
      // eslint-disable-next-line
      src: demo.siteConfig.icon("home", "private"),
      open: false,
      agrees: "",
      coverHtml: "",
      size: {},
      open1: false,
      qrs: null,
      timer: null,
      // eslint-disable-next-line
      isios: demo.$web !== 1,
    };
  },
  watch: {
    open(n) {
      if (n && this.agrees === "") {
        this.$api.http("agree", {}, (e) => {
          this.agrees = e;
        });
      }
    },
    open1() {
      this.cleartimer();
    },
  },
  inject: ["appPath"],
  methods: {
    cleartimer() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
    onshowqr() {
      this.open1 = true;
      this.$nextTick(() => {
        // eslint-disable-next-line
        let url = demo.$random.vars(32);
        // eslint-disable-next-line
        this.qrs = new QRCode(demo.$.id("qr-login-view"), {
          text: url,
          width: 200,
          height: 200,
        });
        this.timer = setTimeout(() => {
          this.onqrloginwait(url);
        }, 2000);
      });
    },
    onqrloginwait(url) {
      /* eslint-disable */
      this.cleartimer();
      demo.siteConfig.hps("login", { url }, (r) => {
        if (r.data) {
          demo.siteConfig.tktoggle(r.data.token);
          demo.$local.set("nid", r.data.id);
          demo.$session.reset();
          this.$toast("登录成功");
          this.$nextTick(() => {
            this.appPath("/");
          });
        } else {
          this.timer = setTimeout(() => {
            this.onqrloginwait(url);
          }, 2000);
        }
      });
    },
    onView(e) {
      // eslint-disable-next-line
      this.src = e.config.logo || demo.siteConfig.icon("home", "private");
    },
    onInit(e) {
      /* eslint-disable */
      this.$nextTick(() => {
        if (!this.isios) {
          let a = this.$refs.covers;
          this.coverHtml = demo.css().wave({
            width: a.clientWidth,
            color: e.theme.colors,
            bgc: e.theme.linear,
          });
        }
      });
    },
    wxreg() {
      demo.$local.reset();
      demo.$session.reset();
      this.$js.wxcode("login_reg");
    },
    wxlogin() {
      this.$js.wxcode("login2");
    },
  },
  mounted() {
    let v = this.$refs.logins.clientHeight;
    let w = this.$refs.viewPage.$el.clientHeight;
    this.size = {
      all: w,
      used: v,
      unused: w - v,
    };
    this.$emit("on-size", this.size);
    // eslint-disable-next-line
    let a = demo.getUrl().id;
    if (!a) {
      this.$emit("chengeid");
    }
  },
  destroyed() {
    this.open = false;
    this.open1 = false;
  },
};
</script>
<style lang='less' scoped>
.login {
  position: relative;
  font-size: 18px;
  box-sizing: border-box;
  z-index: 5;
}
.covers,
.cover_ios {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 200px;
  z-index: -1;
}
.qr {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 50;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
  opacity: 0.5;
  cursor: pointer;
}
.h1 {
  height: 80px;
  margin: 30px 0 90px;
  box-sizing: border-box;
  padding: 17.5px 32px;
  display: flex;
  h5 {
    font-size: 24px;
    color: #fff;
    font-weight: 700;
    width: calc(~"100% - 53px");
    height: 53px;
    line-height: 53px;
    letter-spacing: 1px;
  }
  .logo {
    width: 53px;
    height: 53px;
    box-sizing: border-box;
    border-radius: 50%;
    background-color: rgba(238, 238, 238, 0.4);
    overflow: hidden;
    object-fit: cover;
  }
  i.logo {
    background-color: #99cc33;
    opacity: 0.1;
  }
}
.views {
  box-sizing: border-box;
  padding: 20px;
}
.foot_cover {
  position: absolute;
  top: 200px;
  left: 0;
  width: 100%;
  height: 100px;
  z-index: 1;
  border-radius: 32px 32px 0 0;
  box-shadow: 0 -5px 10px #e7e7e7;
}
.qrs {
  width: 200px;
  margin: 20px auto;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
  border-radius: 5px;
}
.qr_desc {
  padding: 10px;
  text-align: center;
  font-size: 13px;
  color: #999;
}
</style>
