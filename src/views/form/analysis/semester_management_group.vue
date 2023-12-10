<template>
  <v-a group :ext="ext" @change="onsub" ref="vi" :enum="s"></v-a>
</template>

<script>
import vA from "./semester_management.vue";

export default {
  props: {
    ext: {
      type: Object,
      default: () => {
        return {};
      },
    },
    enum: Boolean,
  },
  data() {
    return { s: false };
  },
  watch: {
    enum(n) {
      this.s = n;
    },
  },
  components: { vA },
  methods: {
    onsub(e) {
      this.$api.http("", { ...e, group: true }, () => {
        this.$refs.vi.clearlocal();
        this.$toast("保存成功");
        this.$refs.vi.init();
      });
    },
  },
  mounted() {
    this.s = this.enum;
  },
};
</script>
<style lang='less' scoped>
</style>
