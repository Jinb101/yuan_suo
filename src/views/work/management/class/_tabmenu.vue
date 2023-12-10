<template>
  <div class="tab">
    <van-tabs v-model="active">
      <van-tab v-for="(i, j) in tab" :key="j">
        <template #title>
          <h6>
            {{ i.text }}
            <span v-if="i.num"><van-badge :content="i.num" /></span>
          </h6>
        </template>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  props: {
    num: [String, Number],
  },
  data() {
    return {
      tab: [],
      active: "",
    };
  },
  watch: {
    active() {
      this.onchange();
    },
  },
  inject: ["appPath"],
  methods: {
    init() {
      this.$api.http("classnonum", {}, (r) => {
        this.$set(this.tab[2], "num", r);
      });
    },
    ondetail(e) {
      if (e.path) {
        this.appPath(e.path, +this.num === 999);
      }
    },
    onchange() {
      if (+this.active === +this.num) return 0;
      let b = this.tab[this.active];
      this.$nextTick(() => {
        this.ondetail(b);
      });
    },
  },
  mounted() {
    this.tab = this.$js.def.works.class;
    this.active = this.num ? this.num : "0";
    this.init();
  },
};
</script>
<style lang='less' scoped>
</style>
