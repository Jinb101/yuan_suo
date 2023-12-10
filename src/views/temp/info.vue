<template>
  <v-view header>
    <iframe :src="src" ref="frame" frameborder="0"></iframe>
  </v-view>
</template>

<script>
export default {
  data() {
    return {
      src: "",
      // eslint-disable-next-line
      baseurl: demo.siteConfig.api.h5,
    };
  },
  methods: {
    send() {
      this.$refs.frame.contentWindow.postMessage(
        { type: "a1", data: "1" },
        "*"
      );
    },
    onget() {},
  },
  mounted() {
    this.src = this.baseurl + "template/";
    window.addEventListener("message", (e) => {
      console.log(e.data);
    });
  },
};
</script>
<style lang='less' scoped>
iframe {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
