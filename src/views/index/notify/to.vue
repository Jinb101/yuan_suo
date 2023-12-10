<template>
  <div class="to"></div>
</template>

<script>
export default {
  data() {
    return {};
  },
  inject: ["appPath"],
  methods: {},
  mounted() {
    let a = this.$route.params;
    this.appPath("/notify/" + a.id + "&" + (a.type === "a" ? 1 : 2), true);
  },
};
</script>
<style lang='less' scoped>
</style>
