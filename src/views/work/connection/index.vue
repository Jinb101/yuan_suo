<template>
  <v-t1></v-t1>
</template>

<script>
import vT1 from "./1/index.vue";
export default {
  data() {
    return {
      params: {},
    };
  },
  components: { vT1 },
  inject: ["appPath"],
  methods: {
    init() {
      if (!this.params.type) {
        let s = this.params.id ? "/" + this.params.id : "";
        this.appPath("/work_connection" + s, true);
      } else {
        console.log(this.params);
        // 模板选择
      }
    },
  },
  mounted() {
    this.params = this.$route.params;
    this.init();
  },
};
</script>
<style lang='less' scoped>
</style>
