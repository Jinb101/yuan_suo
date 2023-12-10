<template>
  <div class="v_view"
       :style="pageStyle">
    <div class="cover"
         v-if="cover"
         :style="coverStyle"></div>
    <div class="header flex van-hairline--bottom"
         v-if="header">
      <transition name="van-slide-down">
        <div class="header_cover"
             v-if="headerCover"
             :style="headStyle"></div>
      </transition>
      <!-- <span class="return" @click="onBack">
        <img :src="retIcon" alt="" class="db_image" />
      </span> -->
      <div class="return v_edit"
           @click="onBack">
        <van-icon name="arrow-left"
                  size=".6rem" />
      </div>
      <p class="text text_overflow"
         :class="{ active: headerCover }"
         v-if="text">
        {{ text }}
      </p>
      <p v-else
         class="text">
        <slot name="texts" />
      </p>
      <div class="tool"
           :class="[{ menu: $slots.menu }, { menu_cover: headerCover }]">
        <template v-if="share">
          <div class="share"
               @click.stop="onshare">
            <van-image :src="shareicon"></van-image>
          </div>
        </template>
        <template v-else-if="$slots.menu">
          <slot name="menu" />
        </template>
      </div>
    </div>
    <span class="return return_fixed"
          @click="onBack"
          v-if="retreat"
          :style="retreatStyle">
      <img :src="retIcon"
           alt=""
           class="db_image" />
    </span>
    <div class="view"
         :class="[viewStyls, { overflow: overflow }]"
         :style="viewStyle"
         ref="view"
         @scroll="onViewScroll">
      <div class="cover"
           v-if="cover && !header && bgc"
           :style="coverStyle"></div>
      <slot :scope="configs" />
    </div>
    <transition name="van-fade">
      <div class="footer"
           v-if="bar">
        <template v-if="$slots.footer">
          <slot name="footer" />
        </template>
        <template v-else>

          <van-tabbar v-model="bar_active"
                      @change="onFooterRep">
            <van-tabbar-item :dot="i.num > 0"
                             v-for="(i, j) in bars"
                             :key="j"
                             @click="onFooterBars(i)">
              <span>{{ i.text }}</span>
              <template #icon="props">
                <img :src="props.active
                  ? configs.icon(i.icon, 'bar')
                  : configs.icon(i.icons, 'bar')
                  " />
              </template>
            </van-tabbar-item>
          </van-tabbar>
        </template>
      </div>
    </transition>
    <div class="fixed"
         :style="fixedIndex">
      <slot name="fixed" />
    </div>
    <v-s v-if="shareopen"
         @change="shareopen = false"></v-s>
  </div>
</template>

<script>
import vS from "./share.vue";
// eslint-disable-next-line
const config = demo.siteConfig;
export default {
  props: {
    cover: Boolean,
    header: Boolean,
    bar: Boolean,
    bgc: String,
    back: Boolean,
    text: String,
    overflow: Boolean,
    index: [String, Number],
    retreat: Boolean, // 在不开启header的情况下 显示 返回按钮
    retreatTop: { type: [Number, String], default: 0 },
    coverBgc: String,
    viewbgc: String,
    share: Boolean,
  },
  components: { vS },
  computed: {
    coverStyle() {
      if (this.coverBgc) {
        return { background: this.coverBgc };
      }
      return { background: config.theme.linear };
    },
    headStyle() {
      return { background: config.theme.linear2 };
    },
    viewStyls() {
      if (this.header && this.bar) return "a2";
      if (this.header || this.bar) return "a1";
      return "";
    },
    viewStyle() {
      if (this.bgc) {
        return { background: this.bgc };
      }
      return {};
    },
    pageStyle() {
      if (this.viewbgc) {
        return { background: this.viewbgc };
      }
      return {};
    },
    retIcon() {
      let n = this.cover || this.headerCover ? 1 : 0;
      return this.coverIcon[n];
    },
    fixedIndex() {
      if (this.index < 2) return {};
      return { "z-index": this.index };
    },
    retreatStyle() {
      let top = this.retreatTop;
      if ((this.retreatTop + "").indexOf("rem") > -1) {
        return { top };
      }
      if (!isNaN(top) && top > 0) {
        return { top: top + "px" };
      }
      return {};
    },
  },
  inject: ["appPath"],
  watch: {
    views: {
      handler(n) {
        try {
          if (Object.keys(n.validate).length > 0) {
            if (!n.validate.t7) {
              this.bars = this.bars.filter((r) => {
                return r.path !== "/class";
              });
              // eslint-disable-next-line
              demo.$session.set("no-menu-class", 1);
            } else {
              // eslint-disable-next-line
              demo.$session.clear("no-menu-class");
            }
          } else {
            // eslint-disable-next-line
            demo.$session.clear("no-menu-class");
          }
        } catch (err) { }
      },
      deep: true,
    },
    "views.user": {
      handler(n) {
        this.ongetdots();
        this.$emit("on-user", n);
        // eslint-disable-next-line
        demo.$err.setConfig({
          id: n.s_id,
          name: n.nursery_name,
          nid: n.n_id,
          nick: n.nickname,
          phone: n.phone,
          type: "yuansuo",
          openid: +n.is_openid === 1,
          ua: navigator.userAgent,
          // eslint-disable-next-line
          token: demo.siteConfig.tktoggle(),
        });
      },
      deep: true,
    },
    "views.dot": {
      handler(n) {
        this.ischeckdot(n);
        this.$emit("on-dot", n);
      },
      deep: true,
    },
    "views.rand"() {
      console.log("初始化获取配置");
      this.$emit("on-view", this.views);
    },
    headerCover(n) {
      this.$emit("on-cover", n);
    },
    shareopen(n) {
      if (!n) {
        this.$emit("share-close");
      }
    },
  },
  data() {
    return {
      coverIcon: [config.icon(2, "action"), config.icon(1, "action")],
      top: 0,
      headerCover: false,
      bar_active: "",
      bars: [],
      configs: config,
      views: {
        config: {},
        wx: {},
        user: {},
        level: [],
        dot: {},
        menulevel: {},
        validate: {},
        state: "",
        rand: 0,
      },
      rect: { w: 0, h: 0 },
      shareicon: config.icon("share", "share"),
      shareopen: false,
      apinum: 0,
    };
  },
  methods: {
    onFooterRep(index) {
      console.log(index);
    },
    $share() {
      this.shareopen = true;
    },
    onshare() {
      let os = {
        ...this.views,
        path: this.$route.path,
        params: this.$route.params,
      };
      this.$emit("on-share", os);
    },
    onBack() {
      if (this.back) {
        this.$emit("on-back");
        return 0;
      }
      this.$router.back();
      let p = this.$route.path;
      if (p !== "/" && p !== "/index") {
        setTimeout(() => {
          if (p === this.$route.path) {
            this.$router.push("/");
          }
        }, 300);
      }
    },
    onViewScroll(v) {
      let a = this.$refs.view;
      try {
        this.top = a.scrollTop;
        if (this.header) {
          this.headerCover = this.top > a.offsetTop;
        }
      } catch (e) {
        console.warn(e + "");
      }
    },
    gotTop() {
      this.$emit("on-top", this.top);
    },
    init() {
      /* eslint-disable */
      // 获取配置
      let config = demo.$local.get("app_config", {});
      let wx = demo.$local.get("app_wx", {});
      let level = demo.$session.get("app_level", {});
      let nid = demo.$local.get("nid", "");
      let token = demo.siteConfig.tktoggle();
      let time = Date.now();
      let len = 3e5; // 5分钟缓存
      if (!nid) {
        return 0;
      }
      if (config.into_time && config.into_time > time) {
        this.views.config = config;
        this.apinum++;
      } else {
        this.$api.http("config", {}, (res) => {
          this.apinum++;
          demo.$local.set("app_config", {
            into_time: Date.now() + len,
            ...res,
          });
          this.views.config = res;
        });
      }
      if (this.$js.env) {
        this.$js.wxshare(); // 测试待删除
      }

      if (wx.into_time > 0) {
        let u = wx.url;
        let u2 = window.location.href.split("#")[0];
        if (u !== u2) {
          wx.into_time = 0;
        }
      }
      // 获取微信
      if (wx.into_time && wx.into_time > time) {
        this.views.wx = wx;
        this.$js.wxshare();
        this.apinum++;
      } else {
        // 如果不是微信浏览器 就不获取
        if (demo.es6().isWx()) {
          this.$api.http("wx", {}, (res) => {
            this.apinum++;
            demo.$local.set("app_wx", {
              into_time: Date.now() + len,
              ...res,
            });
            this.views.wx = res;
            this.$js.wxshare();
          });
        }
      }

      if (token) {
        // 获取权限
        if (level.into_time && level.into_time > time) {
          this.views.level = level.level;
          this.apinum++;
        } else {
          this.$api.http("getLevel", {}, (res) => {
            this.apinum++;
            let rej = res.map((s) => {
              return {
                id: s.id,
                by: s.p_id,
                t: s.menu_name,
              };
            });
            demo.$session.set("app_level", {
              into_time: Date.now() + len,
              level: rej,
            });
            this.views.level = rej;
          });
        }

        // 获取用户信息
        this.ongettouser(len);
        // let user = demo.$session.get("user", {});
        // if (user.into_time && user.into_time > time) {
        //   this.views.user = user;
        // } else {
        //   this.$api.http("user", {}, (res) => {
        //     demo.$session.set("user", {
        //       into_time: Date.now() + len,
        //       ...res,
        //     });
        //     this.views.user = res;
        //   });
        // }

        // 老师食谱
        let teachfood = demo.$session.get("teachfood", {});
        if (teachfood.into_time && teachfood.into_time > time) {
          this.$emit("foodstatus", teachfood.status);
          this.apinum++;
        } else {
          this.$api.http("receiveid", {}, (r) => {
            this.apinum++;
            let status = !isNaN(r + "");
            demo.$session.set("teachfood", {
              into_time: Date.now() + len,
              status,
            });
            this.$emit("foodstatus", status);
          });
        }

        // 功能开关权限
        let validate = demo.$session.get("view_menu_level", {});
        if (validate.into_time && validate.into_time > time) {
          this.views.validate = validate;
          this.apinum++;
        } else {
          let a = [];
          let b = [];
          let valnew = demo.siteConfig.text.levelmenu;
          this.$api.http("viewlevelmenu", { menu_type: 2 }, (res) => {
            this.apinum++;
            let obj = {};
            if (res.length > 0) {
              for (let i = 0; i < res.length; i++) {
                obj["t" + res[i].type] = res[i].is_show === 0;
                if (res[i].is_show !== 0) {
                  a.push(valnew[res[i].type]);
                }
                b.push(valnew[res[i].type]);
              }
            }
            let c = valnew.filter((r) => {
              return b.indexOf(r) < 0;
            });
            a = a.filter((r) => {
              return r !== "";
            });
            if (!demo.siteConfig.isvalidateopen) {
              a = a.concat(c);
              b = null;
            }
            demo.$session.set("view_menu_level", {
              into_time: Date.now() + len,
              noopen: a,
              ...obj,
            });
            this.views.validate = { noopen: a, ...obj };
          });
        }

        // 新权限
        let newmenulevel = demo.$session.get("menulevel", {});
        if (newmenulevel.into_time && newmenulevel.into_time > time) {
          this.apinum++;
          this.views.menulevel = newmenulevel;
        } else {
          let v = demo.getUrl();
          this.$api.http("getlevelmenu", {
            access_token: demo.siteConfig.tktoggle() || demo.$session.get("access_token", {}),
            n_id: v.id
          }, (r) => {
            //  育儿课堂 1 隐藏  0 显示
            let newRlist = r.filter((item) => item.switch);
            console.log(newRlist);
            if (newRlist.length > 0) {
              demo.$local.set('gl_level_list', newRlist)
            } else {
              demo.$local.set('gl_level_list', [])
            }
            this.apinum++;
            let res = this.configs.menulevel(r);
            demo.$session.set("menulevel", {
              into_time: Date.now() + len,
              ...res,
            });
            this.views.menulevel = res;
          }, false, true);
        }

        this.views.state = demo.$random.vars(8);
      }

      let tnum = token ? 7 : 2;
      if (this.$js.env || !demo.es6().isWx()) {
        tnum -= 1;
      }
      this.waitfn(tnum);
    },
    waitfn(num) {
      // console.log(this.apinum, num);
      if (this.apinum !== num) {
        // this.$toast.loading({ duration: 0 });
        setTimeout(() => {
          this.waitfn(num);
        }, 500);
        return 0;
      }
      // this.$toast.clear();
      this.$nextTick(() => {
        this.views.rand = Math.random();
      });
    },
    ongettouser(len) {
      let user = demo.$session.get("user", {});
      if (user.into_time && user.into_time > Date.now()) {
        this.views.user = user;
        this.apinum++;
      } else {
        this.$api.http("user", {}, (res) => {
          this.apinum++;
          demo.$session.set("user", {
            into_time: Date.now() + len,
            ...res,
          });
          this.views.user = res;
        });
      }
    },
    onFooterBars(e) {
      // demo.$session.set("view-menu-bar", this.bar_active);
      if (e.path) {
        this.appPath(e.path);
      }
    },
    ongetdots() {
      let time = Date.now();
      let len = 6e4; // 1分钟缓存
      let dot = demo.$session.get("worknum", {});
      if (dot.into_time && dot.into_time > time) {
        this.views.dot = dot;
      } else {
        this.$api.http("getdot", {
          access_token: demo.siteConfig.tktoggle() || demo.$session.get("access_token", {}),
          n_id: demo.getUrl().id
        }, (res) => {
          demo.$session.set("worknum", {
            into_time: Date.now() + len,
            ...res,
          });
          this.views.dot = res;
        });
      }
    },
    ischeckdot(v) {
      let data = { ...v };
      try {
        delete data.into_time;
      } catch (e) { }
      let nums = Object.values(data).filter((r) => {
        return r > 0;
      });
      let index = this.bars
        .map((s) => {
          return s.path === "/work";
        })
        .indexOf(true);
      this.bars[index].num = nums.length;
    },
  },
  mounted() {
    this.bars = this.$js.def.menu;
    let v = demo.$session.get("view-menu-bar", 0);
    let a = demo.$session.get("no-menu-class", 0);
    this.bar_active = +(v >= 0 ? v : 0);
    if (a > 0) {
      this.bar_active =
        this.bar_active > 1 ? this.bar_active - 1 : this.bar_active;
    }
    try {
      let a = this.$refs.view;
      this.rect = {
        w: a.clientWidth,
        h: a.clientHeight,
      };
    } catch (err) { }
    this.init();
    this.$emit("on-init", config);
  },
};
</script>
<style lang='less' scoped>
.v_view {
  width: 100%;
  height: 100%;

  // position: relative;
  .v_edit {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .return {
    width: 40px;
    height: 40px;
    padding-right: 20px;
    cursor: pointer;
    box-sizing: border-box;
    padding: 5px;
    position: absolute;
    top: 5px;
    left: 5px;
    z-index: 10;

    &.return_fixed {
      position: fixed;
    }
  }

  .header {
    height: 50px;
    box-sizing: border-box;
    padding: 5px;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .tool {
      position: absolute;
      z-index: 7;
      min-width: 40px;
      top: 5px;
      right: 5px;
      height: 40px;

      &.menu {
        span {
          line-height: 40px;
          font-size: 14px;
          padding: 0 5px;

          &.bold {
            font-weight: 650;
          }
        }

        &.menu_cover span {
          color: #fff;
        }
      }

      .share {
        width: 40px;
        height: 40px;
        box-sizing: border-box;
        padding: 8px;
        cursor: pointer;
      }
    }

    .text {
      position: relative;
      text-align: center;
      line-height: 40px;
      max-width: 60%;
      font-size: 16px;
      font-weight: 650;
      z-index: 5;
      margin: 0 auto;

      &.active {
        color: #fff;
      }
    }

    .header_cover {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 4;
    }
  }

  .view {
    height: 100%;
    overflow-y: scroll;

    &.a1 {
      height: calc(100% - 50px);
    }

    &.a2 {
      height: calc(100% - 100px);
    }

    &.overflow {
      overflow: hidden;
    }
  }

  .footer,
  .view,
  .header,
  .fixed {
    position: relative;
    z-index: 2;
  }

  .footer {
    height: 50px;
    box-sizing: border-box;
    z-index: 100;
  }

  .cover {
    z-index: 1;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 210px;
  }
}

.van-tabbar-item--active img {
  position: relative;
  animation: dropAndRecover 1.5s ease;
  transform: translate3d(0, 0, 0);
  /* 使用硬件加速 */
}

@keyframes dropAndRecover {
  0% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-15px) scale(1.4);
  }

  100% {
    transform: translateY(0) scale(1);
  }
}
</style>
