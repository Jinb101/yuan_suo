<template>
  <div class="login2">
    <template v-if="!id">
      <van-empty v-if="!det.length"
                 description="暂无可选园所">
        <van-button @click="appPath('/login_reg')"
                    type="info"
                    size="small">去注册</van-button>
      </van-empty>
      <template v-else>
        <p class="h6 col_danger">请选择园所 点击进入</p>
      </template>
      <van-cell :title="i.label"
                is-link
                @click.stop="onc(i)"
                v-for="(i, j) in det"
                :key="j"></van-cell>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      code: "",
      id: "",
      det: [],
      once: 0,
    };
  },
  inject: ["appPath"],
  methods: {
    onc(obj) {
      // eslint-disable-next-line
      demo.$session.reset();
      // eslint-disable-next-line
      demo.siteConfig.tktoggle(obj.token);
      // eslint-disable-next-line
      demo.$local.set("nid", obj.value);
      this.onwxconfig();
      this.appPath("/");
      this.$nextTick(() => {
        // eslint-disable-next-line
        demo.es6().readytojump("get");
      });
    },
    totoken() {
      if (this.once > 0) {
        return 0;
      }
      this.once = 1;
      this.$api.http(
        "gettoken",
        { code: this.code, n_id: this.id },
        (res, code) => {
          // eslint-disable-next-line
          demo.$session.reset();
          // eslint-disable-next-line
          console.log(res, code);
          // demo.siteConfig.tktoggle("clear");
          if (res && code === 200) {
            // eslint-disable-next-line
            demo.$local.clear("login-code-once-data");
            // eslint-disable-next-line
            demo.siteConfig.tktoggle(res);
            this.onwxconfig();
            this.$nextTick(() => {
              // eslint-disable-next-line
              demo.es6().readytojump("get");
            });
            this.appPath("/");
            // demo.$cookie.set("token", res);
          } else {
            this.$toast("登录失败：" + (res.msg || res.err || "请再次尝试"));
            this.$nextTick(() => {
              this.appPath("/login");
            });
          }
        },
        "post",
        false,
        [200, 411]
      );
    },
    gettoken() {
      this.$api.http("getys", { code: this.code, nursery_id: 0 }, (r) => {
        this.det = (r || []).map((s) => {
          return {
            label: (s.nursery || {}).name,
            value: s.n_id,
            token: s.access_token,
          };
        });
      });
    },
    init() {
      if (this.id > 0) {
        // eslint-disable-next-line
        let c = demo.$local.get("login-code-once-data");
        if (c === this.code) {
          console.warn("code 已使用");
          return 0;
        }
        // eslint-disable-next-line
        demo.$local.set("login-code-once-data", this.code);
        this.totoken();
      } else {
        this.gettoken();
      }
    },
    onwxconfig() {
      this.$api.http("wx", {}, (res) => {
        // eslint-disable-next-line
        demo.$local.set("app_wx", {
          into_time: Date.now() + 30e4,
          ...res,
        });
      });
    },
  },
  mounted() {
    // eslint-disable-next-line
    let v = demo.getUrl();
    this.code = v.code;
    this.id = v.id;
    if (!this.code) {
      this.appPath("/login");
      return this.$toast("请重新点击微信一键登录进行登录");
    }
    if (this.code === "null") {
      console.warn("code 不存在");
      return 0;
    }
    this.init();
  },
  destroyed() {
    this.once = 0;
  },
};
</script>
<style lang='less' scoped>
.h6 {
  text-align: center;
  font-weight: 650;
  font-size: 18px;
  padding: 20px 0;
}
</style>
