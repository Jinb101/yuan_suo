<template>
  <div class="approval_my_index">
    <div class="tab">
      <van-tabs
        v-model="active"
        :color="$js.color"
        :title-active-color="$js.color"
      >
        <!-- <van-tab name="99">
          <template #title> <van-icon name="arrow-left" />返回 </template>
        </van-tab> -->
        <van-tab name="0">
          <template #title>
            待我审批
            <van-badge :content="dot" v-if="dot > 0" />
          </template>
        </van-tab>
        <van-tab name="1">
          <template #title>
            我发起的
            <van-badge :content="send" v-if="send > 0" />
          </template>
        </van-tab>
        <van-tab name="2">
          <template #title>
            知会我的
            <van-badge :content="notice" v-if="notice > 0" />
          </template>
        </van-tab>
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
    notice: { type: [String, Number], default: 0 },
    send: { type: [String, Number], default: 0 },
  },
  data() {
    return {};
  },
  watch: {
    active(n) {
      this.$emit("input", n);
      if (n > 90) {
        this.$router.back();
      }
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
    this.active = this.value || "0";
  },
};
</script>
<style lang='less' scoped>
.approval_my_index {
  position: relative;
  z-index: 50;
  .tab {
    position: sticky;
    top: 0;
    z-index: 55;
  }
  .van-icon {
    vertical-align: middle;
    transform: translateY(-1px);
  }
}
</style>
