<template>
  <v-view></v-view>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {};
  },
  inject: ["appPath"],
  methods: {
    init() {
      this.$toast.loading({ duration: 0 });
      let params = demo.getUrl();
      params.id && demo.$local.set("nid", params.id);
      if (params.token) {
        demo.$local.set("token", params.token);
        demo.$session.reset();
        if (params.group) {
          // 集团进入
        } else {
          // url进入token
        }
        this.toindex(params.group ? "group" : "link");
        return 0;
      }
      let token = demo.$local.get("token");
      let user = demo.$session.get("user", {});
      if (!token) {
        // 一键登录
        this.setdata({}, (tp) => {
          if (tp === "wx") {
            this.$js.wxcode("login2");
          } else {
            this.appPath("/login1");
          }
        });
        return "";
      }
      // if (user.access_token === token) {
      //   // 进入主页
      //   this.toindex("index");
      //   return 0;
      // }
      this.toindex("index");
      // this.setdata({}, (tp) => {
      //   if (tp === "wx") {
      //     this.$js.wxcode("login2");
      //   } else {
      //     this.appPath("/login1");
      //   }
      // });
    },
    toindex(by) {
      this.setdata({ by }, () => {
        this.$nextTick(() => {
          this.appPath("/index");
        });
      });
    },
    setdata(obj = {}, fn) {
      let iswx = demo.es6().isWx();
      let os = {
        by: iswx ? "wx" : "login",
        time: Date.now(),
        ...obj,
      };
      demo.$local.set("login-status-data-check", os);
      fn ? fn(os.by) : null;
    },
  },
  mounted() {
    this.init();
  },
  destroyed() {
    this.$toast.clear();
  },
};
</script>
<style lang='less' scoped>
</style>
