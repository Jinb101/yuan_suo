<template>
  <div class="developer">
    <van-notice-bar
      color="#1989fa"
      background="#ecf9ff"
      left-icon="info-o"
      scrollable
    >
      非管理人员请勿使用，以下功能误操作会造成数据错误
    </van-notice-bar>
    <x-content></x-content>
    <x-content>
      <van-cell
        title="TOKEN变更"
        is-link
        @click="open = true"
        v-if="!open"
      ></van-cell>
      <van-field
        v-model="token"
        label="token"
        placeholder="请输入token"
        v-else
        label-width="4em"
      >
        <template #button>
          <span @click="onchecktoken">点击变更</span>
        </template>
      </van-field>
    </x-content>
    <x-content>
      <van-cell title="清除浏览器缓存" is-link @click="onclear"></van-cell>
    </x-content>
    <x-content v-if="iswx">
      <van-cell title="扫码登录" is-link @click="onopenqr"></van-cell>
    </x-content>
    <x-content>
      <van-cell title="生成调试二维码" is-link @click="onsetqr"></van-cell>
      <div class="qr">
        <div id="qr-debug-view"></div>
      </div>
    </x-content>
    <x-content>
      <van-cell
        title="关闭debug模式"
        is-link
        @click="ondebug"
        v-if="isdb"
      ></van-cell>
      <van-cell title="debug模式" is-link @click="ondebug" v-else></van-cell>
    </x-content>
    <x-content v-if="isdb">
      <van-cell title="mmduck" is-link @click="onclock"></van-cell>
    </x-content>
    <!-- <x-content>
      <van-cell
        :title="(colour ? '旧版' : '新版') + '图标模式'"
        is-link
        @click="ontoggleicon"
      ></van-cell>
    </x-content> -->
    <slot />
    <x-content></x-content>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      iswx: false,
      token: "",
      open: false,
      qr: null,
      colour: false,
      isdb: false,
    };
  },
  inject: ["appPath", "reload"],
  methods: {
    onclock() {
      // eslint-disable-next-line
      let id = demo.siteConfig.params.id;
      if (+id !== 7) {
        return this.$toast("该功能无法使用");
      }
      // eslint-disable-next-line
      let center = demo.siteConfig.text.geo;
      this.$api.http(
        "clockin",
        {
          longitude: center[0],
          latitude: center[1],
          notes: "",
        },
        () => {
          this.$toast("成功");
        }
      );
    },
    once() {
      try {
        // eslint-disable-next-line
        this.colour = +demo.$local.get("colour-icon-status", "0") === 1;
        // eslint-disable-next-line
        this.isdb = +demo.$local.get("debug-page-status", "") === 1;
      } catch (e) {}
    },
    ontoggleicon() {
      // eslint-disable-next-line
      demo.$local.set("colour-icon-status", this.colour ? 0 : 1);
      this.$toast("请刷新后使用");
    },
    ondebug() {
      // eslint-disable-next-line
      let status = demo.$local.get("debug-page-status", "");
      if (+status === 1) {
        this.isdb = false;
        // eslint-disable-next-line
        demo.$local.clear("debug-page-status");
      } else {
        this.isdb = true;
        // eslint-disable-next-line
        demo.$local.set("debug-page-status", 1);
      }
      this.$toast("刷新后生效");
    },
    model(msg, fn) {
      this.$js.model("温馨提示", msg, (r) => {
        if (r) {
          fn();
        }
      });
    },
    onchecktoken() {
      if (!this.token) {
        return this.$toast("请输入token");
      }
      this.model("是否变更token?", () => {
        // eslint-disable-next-line
        demo.$session.reset();
        // eslint-disable-next-line
        demo.siteConfig.tktoggle(this.token);
        this.$toast("变更成功");
        setTimeout(() => {
          this.reload();
        }, 1500);
      });
    },
    onclear() {
      this.model(
        "此操作会对系统内所有缓存进行清除，包括现在的登录状态，是否执行？",
        () => {
          window.localStorage.clear();
          window.sessionStorage.clear();
          this.$toast("完成");
          setTimeout(() => {
            this.reload();
          }, 1000);
        }
      );
    },
    onopenqr() {
      // 扫码
      // eslint-disable-next-line
      this.$js.wxshare({}, "qr", (r) => {
        if (r.code) {
          this.$toast.loading({ duration: 0 });
          try {
            let url = r.data.resultStr;
            // 1.扫调试码
            if (url.indexOf("/json/") > 0) {
              this.onopenqrhttp(url, true);
            } else {
              // 2.扫登陆码
              this.onsetqrs(url, (r) => {
                this.onopenqrhttp(r);
              });
            }
          } catch (e) {
            this.$toast.clear();
            this.$toast("该功能维护中");
          }
        } else {
          this.$toast("该功能维护中");
        }
      });
    },
    onsetqr() {
      this.onsetqrs();
    },
    onopenqrhttp(url, fs) {
      // eslint-disable-next-line
      demo.ajax(url).get({}, (res) => {
        if (res.token && res.id) {
          if (fs) {
            this.$toast("扫码成功，正在为您请求数据");
            // eslint-disable-next-line
            demo.siteConfig.tktoggle(res.token);
            // eslint-disable-next-line
            demo.$local.set("nid", res.id);
            // eslint-disable-next-line
            demo.$session.reset();
            setTimeout(() => {
              this.appPath("/index");
            }, 500);
          } else {
            this.$toast("扫码成功");
          }
        }
        this.$toast.clear();
      });
    },
    onsetqrs(type = "", callback) {
      let os = {
        // eslint-disable-next-line
        token: demo.siteConfig.tktoggle(),
        // eslint-disable-next-line
        id: demo.$local.get("nid"),
        account: this.user.phone,
        json: JSON.stringify(this.user),
        status: type,
      };
      // eslint-disable-next-line
      demo.siteConfig.hps("qr", os, (r, url) => {
        if (r.code) {
          let urls = url + r.data;
          if (type !== "") {
            return callback(urls, r.data);
          }
          // eslint-disable-next-line
          this.qr = new QRCode(demo.$.id("qr-debug-view"), {
            text: urls,
            width: 200,
            height: 200,
          });
        }
      });
    },
  },
  mounted() {
    this.debug = this.$js.debug || this.$demo.getUrlParam("debug");
    // eslint-disable-next-line
    this.iswx = demo.es6().isWx();
    this.once();
  },
  destroyed() {
    this.$toast.clear();
  },
};
</script>
<style lang='less' scoped>
.qr {
  margin: 0 auto;
  width: 200px;
}
</style>
