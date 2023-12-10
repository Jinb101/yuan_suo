<template>
  <div class="locate_page">
    <van-empty v-if="!item.length"></van-empty>
    <section
      v-for="(i, j) in item"
      :key="j"
      class="flex"
      @click.stop="ondetail(i, j)"
    >
      <div class="logo">
        <v-a></v-a>
      </div>
      <div class="text">
        <h6>{{ i.name }}</h6>
        <p>录入时间：{{ appTimeout(i.entry_time) }}</p>
      </div>
    </section>
  </div>
</template>

<script>
import vA from "../../private/avatar.vue";
export default {
  props: {
    value: null,
    state: Boolean,
  },
  data() {
    return {};
  },
  computed: {
    item: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
  },
  components: { vA },
  inject: ["appTimeout"],
  watch: {
    item: {
      handler(v) {
        this.$emit("input", v);
      },
      deep: true,
    },
  },
  methods: {
    ondetail(i, j) {
      this.$emit("detail", i, j);
    },
  },
  mounted() {
    this.item = this.value;
  },
};
</script>
<style lang='less' scoped>
section {
  padding: 10px;
  background-color: rgba(188, 241, 245, 0.3);
  position: relative;
  &:nth-child(2n) {
    background-color: rgba(250, 241, 192, 0.3);
  }
  align-items: center;
  .logo {
    width: 50px;
    margin-right: 10px;
    height: 50px;
  }
  .text {
    width: calc(100% - 60px);
    font-size: 12px;
    position: relative;
    padding-top: 5px;
    color: #999;
    h6 {
      font-weight: 650;
      line-height: 20px;
      margin-bottom: 5px;
      font-size: 15px;
      color: #666;
      span {
        font-size: 13px;
        font-weight: 400;
        padding-left: 10px;
      }
    }
    p + p {
      margin-top: 5px;
    }
  }
}
</style>
