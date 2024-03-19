<template>
  <div id="app">
    <!-- 入口 -->
    <transition :name="transitionName">
      <router-view v-if="isRouterAlive"
                   class="app_view"></router-view>
    </transition>
    <transition name="van-slide-left">
      <v-f v-if="src_h5"
           :footer="false"
           :index="999"
           v-model="openh5"
           text="外链">
        <iframe :src="src_h5"
                frameborder="0"
                class="app_h5_frame"></iframe>
      </v-f>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ImagePreview } from "vant";
import vF from "./views/private/fixed.vue";
// eslint-disable-next-line
const configs = demo.siteConfig;
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload,
      appPath: this.appPath,
      appReplace: this.appReplace,
      appShowImage: this.appShowImage,
      appOnBackOld: this.appOnBackOld,
      appTimeout: this.appTimeout,
      appGetFinance: this.appGetFinance,
    };
  },
  data() {
    return {
      isRouterAlive: true,
      transitionName: "none",
      src_h5: "",
      openh5: false,
      params: {},
      version: process.env.VERSION,
    };
  },
  components: { vF },
  watch: {
    $route: {
      handler(to, from) {
        const toDepth = to.path.split("/").length;
        const fromDepth = from.path.split("/").length;
        this.transitionName =
          toDepth < fromDepth ? "slide-right" : "slide-left";
        let a = ["/index", "/class", "/work", "/user"];
        if (a.indexOf(to.path) >= 0) {
          // eslint-disable-next-line
          demo.$session.set("view-menu-bar", a.indexOf(to.path));
        }
      },
      deep: true,
    },
    vuex_h5: {
      handler(n) {
        this.toH5(n);
      },
      deep: true,
    },
    src_h5(n) {
      this.openh5 = n !== "";
    },
    params: {
      handler() {
        this.setParams();
      },
      deep: true,
    },
  },
  computed: {
    ...mapState({
      vuex_progress: "progress",
      vuex_h5: "h5",
    }),
  },
  methods: {
    // 刷新
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
    // 跳转
    appPath(v, f) {
      if (f) {
        return this.appReplace(v);
      }
      this.$router.push(v);
    },
    // 无感跳转
    appReplace(v) {
      this.$router.replace(v);
    },
    appTimeout(e, f, type = "all") {
      if (isNaN(e)) return e;
      if (e < 1e3) return "/";
      // eslint-disable-next-line
      return f ? demo.es6().timeoutDiff(e) : demo.timeout(e, type, "-");
    },
    appShowImage(e, index, opt, name = "") {
      if (index !== undefined && index >= 0) {
        let imgs = [];
        try {
          if (name) {
            imgs = e.map((s) => {
              return s[name];
            });
          }
        } catch (err) {
          if (name) {
            imgs = e[name];
          }
        }
        return ImagePreview({
          images: name ? imgs : e,
          startPosition: index,
          ...opt,
        });
      }
      ImagePreview([e]);
    },
    toH5(val) {
      this.src_h5 = "";
      if (val.time && val.event) {
        switch (val.event) {
          case "see":
            // eslint-disable-next-line
            let h5 = demo
              .es6()
              .encrypt({ type: val.type, url: val.url }, "see");
            this.src_h5 = configs.api.see + "?h5=" + h5;
            break;
          case "video":
            this.src_h5 = configs.api.h5 + "player/?url=" + val.url;
            break;
          default:
        }
        this.$nextTick(() => {
          if (!this.openh5) {
            this.openh5 = true;
          }
        });
      }
    },
    // 返回旧项目
    appOnBackOld(name = "index") {
      window.location.href = "../?id=" + this.params.id + "#/" + name;
    },
    setParams() {
      let id = this.params.id;
      let tk = this.params.token;
      if (id) {
        // eslint-disable-next-line
        let nid = demo.$local.get("nid");
        if (+nid !== +id) {
          // 切换园所
          // eslint-disable-next-line
          demo.$local.set("nid", id);
          // eslint-disable-next-line
          demo.$local.clear(["token", "app_config", "app_wx"]);
          this.reload();
        }
      }
      if (tk) {
        // eslint-disable-next-line
        let token = demo.siteConfig.tktoggle();
        if (token !== tk) {
          // 切换账号
          // eslint-disable-next-line
          demo.siteConfig.tktoggle(tk);
          // eslint-disable-next-line
          demo.$session.clear("user");
          this.reload();
        }
      }
    },
    // 财务状态
    appGetFinance(fn) {
      // eslint-disable-next-line
      let lv = demo.$session.get("finance-status", {});
      let tm = Date.now();
      if (lv.time > tm) {
        return fn(lv);
      }
      this.$api.http("finlevel", {}, (r) => {
        let o = {
          time: tm + 3e5,
          level: r.authority, // 1:有权限 2：无权限 3：部分权限 (查看报表)
          ispwd: r.set_password === 1,
        };
        // eslint-disable-next-line
        demo.$session.set("finance-status", o);
        fn(o);
      });
    },
  },
  mounted() {
    // 获取本地 名为 VERSION 的环境变量
    const localVersion = localStorage.getItem("VERSION");
    // 如果没有本地版本号或者本地版本号与当前版本号不一致
    if (!localVersion || localVersion !== this.version) {
      // 设置本地版本号为当前版本号
      localStorage.setItem("VERSION", this.version);
      // 刷新页面 重新加载资源
      window.location.reload();
    }
    // eslint-disable-next-line
    this.params = demo.getUrl();
    console.log(this.version);
  },
};
</script>

<style lang="less">
html,
body {
  height: 100%;
}

body {
  background-color: #eee;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  // user-select: none;
  background-color: #fff;
}

.x_radius {
  background-color: #fff !important;
}

.db_image {
  display: block;
  width: 100%;
  height: 100%;
}

// .up {
//   z-index: -1;
//   position: fixed;
//   left: -100vw;
//   top: -100vh;
// }

[id^="player"] {
  height: 100%;
  width: 100%;
  display: block;
}

.app_view {
  box-sizing: border-box;
  font-size: 18px;
  z-index: 1;
  position: absolute;
  width: 100%;
  overflow: hidden;
  transition: all 0.75s cubic-bezier(0.55, 0, 0.1, 1);
  height: 100%;
}

.app_progress {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 2px;
  z-index: 800;
  background-color: #46c6f7;
}

.van-image {
  display: block;
  width: 100%;
  height: 100%;
}

.app_top {
  position: sticky;
  z-index: 50;
  top: 0;

  &.bgc {
    background-color: #fff;
  }

  &.h44 {
    top: 44px;
  }

  &.h10 {
    top: 10px;
  }
}

.app_bottom {
  position: sticky;
  z-index: 50;
  bottom: 0;
  padding: 10px;
  background-color: #fff;

  &.tran {
    background: transparent;
  }
}

.app_frame_content {
  font-size: 14px;
  line-height: 1.5;
  padding: 0 8px;

  img,
  iframe,
  video {
    max-width: 100%;
    border-radius: 5px;
  }

  iframe,
  video {
    display: block;
    width: 100%;
  }
}

.app_show_fixed {
  position: fixed;
  top: 0;
  background-color: #fff;
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  left: 0;
  z-index: 50;

  .w60 {
    margin: 30px auto 10px;
    width: 60%;
  }

  .w80,
  .w70 {
    position: fixed;
    z-index: 55;
    left: 10%;
    bottom: 15px;
    width: 80%;

    .van-button+.van-button {
      margin-left: 10px;
    }
  }

  .w70 {
    bottom: 65px;
  }

  &.auto {
    padding-bottom: 60px;
    overflow-y: scroll;
  }

  &.tran {
    background-color: transparent;
  }

  .w90 {
    position: sticky;
    bottom: 0;
    padding: 20px 10%;
    z-index: 55;
  }
}

.app_h5_frame {
  display: block;
  width: 100%;
  height: 100%;
}

.app_title6 {
  padding: 10px 16px;
  font-size: 14px;
  margin-bottom: 5px;
  color: #646566;
}

.app_btn_add {
  position: fixed;
  right: 10px;
  bottom: 60px;
  background-color: #a8d578;
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 14px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 10px #a8d578;
  transform: scale(0.9);
  z-index: 50;

  i {
    font-size: 20px;
  }

  &.b20 {
    bottom: 20px;
  }
}

.app_section {
  position: relative;

  section {
    padding: 10px;
    background-color: rgba(188, 241, 245, 0.3);
    position: relative;

    &:nth-child(2n) {
      background-color: rgba(250, 241, 192, 0.3);
    }

    align-items: center;

    .logo {
      width: 50px;
      margin-right: 10px;
      height: 50px;
    }

    .text {
      width: calc(100% - 60px);
      font-size: 12px;
      position: relative;
      padding-top: 5px;
      color: #999;

      .status {
        position: absolute;
        right: 0;
        top: 0;
        color: #999;
        font-size: 13px;

        &.send {
          top: 25px;
          font-size: 12px;
        }
      }

      h6 {
        font-weight: 650;
        line-height: 20px;
        margin-bottom: 5px;
        font-size: 15px;
        color: #666;

        span {
          font-size: 13px;
          font-weight: 400;
          padding-left: 10px;
        }
      }

      p+p {
        margin-top: 5px;
      }

      p {
        line-height: 1.2;

        b {
          padding: 0 5px;
        }
      }
    }
  }

  &.even {
    section {
      background-color: rgba(192, 188, 245, 0.2);

      &:nth-child(2n) {
        background-color: rgba(250, 192, 192, 0.2);
      }
    }
  }
}

.trigger_tag {
  padding: 10px;
  font-size: 15px;

  span {
    padding: 0 10px;
    line-height: 20px;
    display: flex;
    align-items: center;

    i {
      margin-right: 4px;
    }
  }
}

.slide-left-enter,
.slide-left-leave-active {
  opacity: 0;
  transform: .5 translateX(100%);
}

.slide-right-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: .5 translateX(-100%);
}

.van-tabs__line {
  background-color: #6943f2;
}

.form_analysis {
  overflow: hidden;

  .val {
    font-size: 13px;
    color: #666;
  }

  .box {
    margin: 10px;
    padding: 8px 0;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;

    h5 {
      padding: 10px 15px;
      position: relative;
      font-weight: 650;
      font-size: 14px;
      color: #333;
      text-indent: 12px;
      line-height: 16px;

      >span {
        position: absolute;
        right: 8px;
        top: 10px;
        font-weight: 400;
        color: #999;
        font-size: 12px;
      }

      &::before {
        position: absolute;
        content: "";
        left: 15px;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 4px;
        height: 15px;
        border-radius: 2px;
        background-color: #f99b51;
      }
    }

    .add {
      margin: 12px 25%;
    }

    h6 {
      position: relative;
      font-size: 14px;
      padding: 8px 15px;
      text-indent: 15px;

      &::before {
        position: absolute;
        content: "";
        left: 15px;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #38f;
      }
    }

    .price,
    .input {
      padding: 5px;
      background-color: rgba(51, 136, 255, 0.1);
      position: relative;

      &:nth-child(2n) {
        background-color: rgba(80, 252, 94, 0.1);
      }

      .del_btn {
        position: absolute;
        right: 5px;
        top: 5px;
        width: 42px;
        height: 42px;
        background-color: rgba(205, 206, 197, 0.3);
        color: tomato;
        z-index: 5;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 25px;
        border-radius: 8px 0 0 8px;
      }
    }

    .price {
      padding-bottom: 15px;

      .del_btn {
        top: 0;
        height: 35px;
        background-color: transparent;
      }
    }

    .input {
      display: flex;

      .van-field:not(.input_label) {
        flex: 1;
      }
    }

    .input_label {
      width: 100px;
      padding-right: 0;
    }
  }

  .save_btn {
    padding: 30px 15%;
    box-sizing: border-box;

    .van-button+.van-button {
      margin-top: 60px;
    }
  }

  input {
    background-color: rgba(206, 206, 206, 0.2);
    color: #333;

    &[readonly] {
      background-color: transparent;
      text-align: right;
      color: #fff;
      opacity: 0;
    }
  }

  .input_label,
  .price_label {
    input[readonly] {
      width: 0;
    }

    .van-field__button {
      padding-left: 0;
    }

    &.readonly {
      background-color: transparent;
      padding: 0;
    }
  }
}

.van-image-preview__overlay {
  background: rgba(0, 0, 0, 0.4);
}

.font_bold {
  font-weight: 650;
}
</style>
