<template>
  <v-view>
    <span class="ret" @click="onlogin">返回登录</span>
    <div class="status" :class="'c_' + id">
      <van-image :src="status"></van-image>
    </div>
    <p class="text">{{ totext }}</p>
    <div class="wx" v-if="+id === 403">
      <p>您可以绑定微信，绑定微信后可使您能即时收到</p>
      <p>审核是否通过</p>
      <p>若已绑定请忽略</p>
    </div>
    <div class="btns">
      <van-button
        v-if="+id === 403"
        block
        round
        :color="$js.btnColor"
        @click="onbind"
        >绑定微信</van-button
      >
      <van-button
        v-else-if="+id === 405"
        block
        round
        type="info"
        @click="open = true"
        >重新申请</van-button
      >
    </div>
    <transition name="van-slide-left">
      <div class="app_show_fixed" v-if="open">
        <v-a @end="open = false"></v-a>
      </div>
    </transition>
  </v-view>
</template>

<script>
import vA from "./apply.vue";
export default {
  data() {
    return {
      id: "",
      text: {
        403: "审核中",
        405: "申请未通过",
        408: "该账号已被禁用",
      },
      // eslint-disable-next-line
      status: demo.siteConfig.icon("status", "private"),
      open: false,
      user: {},
    };
  },
  components: { vA },
  inject: ["appPath"],
  computed: {
    totext() {
      return this.text[this.id];
    },
  },
  methods: {
    onlogin() {
      // eslint-disable-next-line
      demo.siteConfig.tktoggle("clear");
      // eslint-disable-next-line
      demo.$session.reset();
      this.appPath("/login");
    },
    onbind() {
      this.$js.wxcode("event_bind");
    },
    onuser() {
      this.$api.http("user", {}, () => {});
    },
  },
  mounted() {
    this.id = this.$route.params.id || "403";
  },
};
</script>
<style lang='less' scoped>
.ret {
  position: fixed;
  left: 0;
  top: 0;
  font-size: 14px;
  line-height: 20px;
  padding: 10px;
}
.status {
  margin: 44px auto 30px;
  width: 250px;
  height: 250px;
}
.c_405 {
  filter: grayscale(100%);
}
.c_408 {
  filter: hue-rotate(75deg);
}
.text {
  font-size: 16px;
  text-align: center;
}
.btns {
  position: fixed;
  left: 0;
  bottom: 20px;
  width: 50%;
  right: 0;
  margin: auto;
}
.wx {
  padding: 10px 18%;
  p {
    font-size: 14px;
    color: #999;
    padding: 2px 0;
  }
}
</style>
