<template>
  <v-view header text="访问错误">
    <van-empty>
      <van-button to="/" type="info" size="small" round replace
        >主页</van-button
      >
    </van-empty>
  </v-view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    // onPage(e) {
    //   this.list = e === 1 ? 20 : this.list + 20;
    //   setTimeout(() => {
    //     this.$refs.page.onFinish(this.list > 80);
    //   }, 1200);
    // },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.van-button {
  width: 100px;
}
</style>
