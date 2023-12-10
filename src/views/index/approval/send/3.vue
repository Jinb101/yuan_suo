<template>
  <div class="approval_send">
    <van-field
      v-model="money"
      type="number"
      label="申请金额"
      placeholder="请输入申请金额"
      label-width="5em"
    >
      <template #right-icon>
        <div>元</div>
      </template>
    </van-field>
  </div>
</template>

<script>
export default {
  props: {
    value: null,
  },
  data() {
    return {
      money: "",
    };
  },
  computed: {
    list: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
  },
  watch: {
    list: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
    money(n) {
      this.list = [n || 0];
    },
  },
  methods: {},
  mounted() {
    this.list = this.value;
  },
};
</script>
<style lang='less' scoped>
</style>
