<template>
  <v-view @on-view="onview">
    <template v-if="name">
      <div class="head">
        <h2>
          欢迎注册成为<span>{{ name }}</span
          >的一员
        </h2>
        <p>在使用本系统之前,请先填写以下信息!</p>
        <p>申请成为本园的员工!</p>
        <p>
          我们会以最快的速度审核，请保持手机通话畅通。审核通过后我们会联系您！
        </p>
      </div>
    </template>
    <div class="box">
      <van-divider content-position="left">您需要填写以下信息</van-divider>
      <van-field
        v-model="nick"
        label="您的姓名"
        placeholder="请输入您的姓名"
        label-width="5em"
        maxlength="18"
      />
      <van-field
        v-model="tel"
        label="手机号"
        placeholder="请输入您的登录手机号"
        label-width="5em"
        maxlength="15"
      />
      <van-cell
        title="申请部门"
        :value="s1.name ? s1.name : '选择部门'"
        is-link
        @click="open1 = !open1"
      ></van-cell>
      <template v-if="s1.id">
        <van-cell
          v-if="!t2.length"
          title="抱歉，该部门下未设置岗位,请选择其他部门"
        ></van-cell>
        <van-cell
          title="岗位"
          :value="s2.name ? s2.name : '选择岗位'"
          is-link
          @click="open2 = !open2"
          v-else
        ></van-cell>
      </template>
      <div class="btns">
        <van-button block color="#99cc33" @click="onsubmit"
          >点击申请</van-button
        >
      </div>
    </div>
    <template #fixed>
      <v-s :open="open1" :list="t1" v-model="s1" @change="ons1"></v-s>
      <v-s :open="open2" :list="t2" v-model="s2" @change="ons2"></v-s>
    </template>
  </v-view>
</template>

<script>
import vS from "../private/select.vue";
export default {
  data() {
    return {
      name: "",
      nick: "",
      tel: "",
      open1: false,
      open2: false,
      t1: [],
      t2: [],
      s1: {},
      s2: {},
    };
  },
  inject: ["appPath"],
  components: { vS },
  methods: {
    onview(e) {
      this.name = (e.config || {}).name;
    },
    ons1(e) {
      this.s2 = {};
      this.$api.http("getjob", { g_id: this.s1.id }, (r) => {
        this.t2 = r;
      });
    },
    ons2(e) {},
    onsubmit() {
      if (this.nick === "") return this.$toast("请先输入姓名哦");
      if (this.tel === "") return this.$toast("请先输入手机号哦");
      if (this.s2.id === "") return this.$toast("请先选择岗位哦");
      let os = {
        name: this.nick,
        contact: this.tel,
        j_id: this.s2.id,
      };
      this.$api.http("userjointeach", os, () => {
        this.$toast("申请成功");
        this.appPath("/apply_status/403");
        this.$emit("end");
      });
    },
  },
  mounted() {
    this.tel = this.$route.params.tel || "";
    this.$api.http("getGroup", {}, (r) => {
      this.t1 = r;
    });
  },
};
</script>
<style lang='less' scoped>
.head {
  margin-bottom: 30px;
  h2 {
    text-align: center;
    font-size: 14px;
    padding: 15px 0;
    span {
      font-size: 16px;
      font-weight: 650;
      padding: 0 5px;
    }
  }
  p {
    font-size: 14px;
    padding-left: 15px;
    margin-top: 5px;
    color: #999;
    line-height: 1.2;
  }
}
.btns {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 5;
}
</style>
