<template>
  <div class="det_banner">
    <h6>{{ ext.describe }}</h6>
    <p class="time">发表时间：{{ appTimeout(ext.create_time, true) }}</p>
    <div class="app_frame_content" v-html="ext.content"></div>
  </div>
</template>

<script>
export default {
  props: {
    value: null,
  },
  data() {
    return {};
  },
  inject: ["appTimeout"],
  computed: {
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(n) {
        this.$emit("input", n);
      },
    },
  },
  watch: {
    ext: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
  },
  methods: {},
  mounted() {
    this.ext = this.value;
  },
};
</script>
<style lang='less' scoped>
.det_banner {
  > h6 {
    padding: 8px 10px;
    font-weight: 650;
  }
  > p {
    font-size: 12px;
    color: #ccc;
    padding: 5px 10px;
    margin-bottom: 5px;
  }
}
</style>
