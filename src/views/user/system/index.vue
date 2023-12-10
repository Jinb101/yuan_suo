<template>
  <v-view header cover viewbgc="#f9f9f9" @on-view="onview">
    <x-content></x-content>
    <x-content>
      <van-cell title="用户协议" is-link @click="open = true"></van-cell>
    </x-content>
    <x-content>
      <van-cell title="用户反馈" is-link @click="open4 = true"></van-cell>
    </x-content>
    <x-content>
      <van-cell title="版本号" :value="version"></van-cell>
    </x-content>
    <x-content v-if="kb > 0">
      <van-cell
        title="清除缓存"
        :value="kb + 'kb'"
        is-link
        @click="onclearkb"
      ></van-cell>
    </x-content>
    <x-content>
      <van-cell title="基础功能设置" is-link @click="open5 = true"></van-cell>
    </x-content>
    <x-content>
      <van-cell title="开发者选项" is-link @click="open2 = true"></van-cell>
    </x-content>
    <x-content>
      <van-cell title="日志" is-link @click="open3 = true"></van-cell>
    </x-content>
    <x-content v-if="show1">
      <van-cell title="清除草稿箱" is-link @click="open6 = true"></van-cell>
    </x-content>
    <x-content></x-content>
    <template #fixed>
      <v-f v-model="open" :footer="false" text="用户协议">
        <x-content>
          <div class="app_frame_content" v-html="agrees"></div>
        </x-content>
      </v-f>
      <v-f
        v-model="open2"
        :footer="false"
        text="开发者选项"
        cover
        viewbgc="#f9f9f9"
      >
        <v-d :user="user">
          <x-content v-if="val.length > 10 && +user.is_whether === 1">
            <van-cell
              is-link
              title="功能权限"
              @click="appPath('/work_menulevel')"
            ></van-cell>
          </x-content>
        </v-d>
      </v-f>
      <v-f v-model="open3" :footer="false" text="日志" cover viewbgc="#f5f5f5">
        <template #menu>
          <span @click="oncopyinfo">上传日志</span>
        </template>
        <v-e></v-e>
      </v-f>
      <v-f
        v-model="open4"
        :footer="false"
        text="用户反馈"
        cover
        viewbgc="#f5f5f5"
      >
        <v-b></v-b>
      </v-f>
      <v-f
        v-model="open5"
        :footer="false"
        text="功能设置"
        cover
        viewbgc="#f8f7fa"
      >
        <v-m></v-m>
      </v-f>
    </template>
  </v-view>
</template>

<script>
/* eslint-disable */
import vF from "../../private/fixed.vue";
import vD from "./developer.vue";
import vE from "./errorinfo.vue";
import vB from "./feedback.vue";
import vM from "./mode.vue";
export default {
  data() {
    return {
      open: false,
      open1: false,
      open2: false,
      open3: false,
      open4: false,
      open5: false,
      open6: false,
      agrees: "",
      version: "",
      nid: "",
      token: "",
      kb: 0,
      debug: false,
      user: {},
      val: [],
      show1: false,
    };
  },
  inject: ["appPath"],
  components: { vF, vD, vE, vB, vM },
  watch: {
    open(n) {
      if (n && this.agrees === "") {
        this.$api.http("agree", {}, (e) => {
          this.agrees = e;
        });
      }
    },
    open6(n) {
      n &&
        this.$js.model(
          "提示",
          "是否清除发布[班级圈、资讯、通知]草稿箱内容？",
          (r) => {
            if (r) {
              ["class", "info", "notify"].forEach((k) => {
                demo.siteConfig.tempdata(k, null, "clear");
              });
              this.$toast("清除完成");
            }
            this.open6 = false;
          }
        );
    },
  },
  methods: {
    onview(e) {
      this.user = e.user || {};
      this.val = (e.validate || {}).noopen || [];
    },
    tokb() {
      let a = demo.$local.all();
      let b = demo.$session.all();
      this.nid = a.nid;
      this.token = a.token;
      let len = JSON.stringify(a).length + JSON.stringify(b).length;
      len = (len / 1024).toFixed(2);
      this.kb = len;
    },
    init() {
      let a = demo.$local.get("system-mode", {});
      if (a.tempdata) {
        this.show1 = true;
      }
      // console.log(a);
      // 缓存
      this.tokb();
      this.debug = !!demo.siteConfig.params.debug;
    },
    onclearkb() {
      this.$js.model("清除提示", "是否清除缓存？", (r) => {
        if (r) {
          demo.$local.reset();
          demo.$session.reset();
          demo.$local.set("nid", this.nid);
          demo.siteConfig.tktoggle(this.token);
          this.$toast("清除完成");
          this.kb = 0;
          this.$nextTick(() => {});
        }
      });
    },
    oncopyinfo() {
      if (this.$js.env) {
        return this.$toast("测试禁用功能");
      }
      if (!demo.$error.length) {
        demo.$err.setMsg({ type: "日志上传" });
      }
      demo.$err.uploadinfo((r) => {
        if (r > 0) {
          this.$toast("成功");
        }
      });
      // demo.errorinfo();
      // this.$toast("复制剪贴板成功");
    },
  },
  mounted() {
    this.version = demo.version;
    // demo.siteConfig.version(1, 20, (e) => {
    //   this.version = "v" + e[0].version;
    // });
    this.init();
  },
};
</script>
<style lang='less' scoped>
</style>
