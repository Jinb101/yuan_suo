<template>
  <div class="task_index">
    <div class="tab">
      <van-tabs
        v-model="active"
        :color="$js.color"
        :title-active-color="$js.color"
      >
        <van-tab name="0">
          <template #title>
            <van-badge :content="dot" v-if="dot > 0" />
            未接受
          </template>
        </van-tab>
        <van-tab title="已接受" name="1"></van-tab>
        <van-tab title="已完成" name="2"></van-tab>
        <van-tab title="已取消" name="3"></van-tab>
      </van-tabs>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    value: null,
    dot: { type: [String, Number], default: 0 },
  },
  data() {
    return {};
  },
  watch: {
    active(n) {
      this.$emit("input", n);
    },
  },
  computed: {
    active: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {},
  mounted() {
    this.active = this.value;
  },
};
</script>
<style lang='less' scoped>
.task_index {
  .tab {
    position: sticky;
    top: 0;
    z-index: 55;
  }
}
</style>
