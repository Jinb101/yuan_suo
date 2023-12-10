<template>
  <v-view cover>
    <div class="err" v-if="code">
      <van-empty image="error" description="绑定失败"></van-empty>
      <p class="msg">{{ errmessage }}</p>
    </div>
    <div class="app_bottom btn">
      <van-button block :color="$js.btnColor" @click="appPath('/', true)" round
        >返回主页</van-button
      >
    </div>
  </v-view>
</template>

<script>
export default {
  data() {
    return {
      params: {},
      load: null,
      errmessage: "",
      code: false,
    };
  },
  inject: ["appPath"],
  methods: {
    clearload() {
      if (this.load) {
        this.load.clear();
        this.load = null;
      }
    },
    init() {
      if (!this.params.code) {
        this.appPath("/event_wx");
        this.clearload();
        return this.$toast("未绑定成功，请重试");
      }
      this.$api.http(
        "usersetopenid",
        { code: this.params.code },
        (e, code, err) => {
          this.clearload();
          if (code === 411) {
            this.code = true;
            try {
              this.errmessage = err.msg;
            } catch (es) {}
            return 0;
          }
          this.$toast("绑定成功");
          // eslint-disable-next-line
          demo.$session.clear("user");
          this.appPath("/");
        },
        "post",
        false,
        [200, 411]
      );
    },
  },
  mounted() {
    this.load = this.$toast.loading({ duration: 0 });
    // eslint-disable-next-line
    this.params = demo.getUrl();
    this.init();
  },
  destroyed() {
    this.clearload();
  },
};
</script>
<style lang='less' scoped>
.msg {
  text-align: center;
  line-height: 1.2;
  font-size: 14px;
  color: #999;
}
.btn {
  padding: 20px 20%;
}
</style>
