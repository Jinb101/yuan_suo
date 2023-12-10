<template>
  <v-view header>
    <van-cell title="我的信息" is-link @click="appPath('/my_info')"></van-cell>
    <van-cell title="紧急联系人" is-link @click="err"></van-cell>
    <van-cell title="我的简历" is-link @click="err"></van-cell>
  </v-view>
</template>

<script>
export default {
  data() {
    return {};
  },
  inject: ["appPath"],
  methods: {
    err() {
      this.$toast("正在维护中...");
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
</style>
