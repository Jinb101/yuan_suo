<template>
  <div class="a03"></div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  inject: ["appPath"],
  mounted() {
    // eslint-disable-next-line
    let a = demo.getUrl();
    if (a.tps === "show") {
      // eslint-disable-next-line
      let time = demo.timeout(a.timeout, "zero");
      let id = a.eid;
      this.appPath("/work_connection/" + id + "&" + time, true);
    }
  },
};
</script>
<style lang='less' scoped>
</style>
