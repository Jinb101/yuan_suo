<template>
  <v-view header>
    <van-cell
      v-for="(i, j) in item"
      :key="j"
      is-link
      :icon="i.icon"
      :label="toLabel(i)"
      @click="onclick(i)"
    >
      <template #title>
        {{ i.text }}
      </template>
    </van-cell>
  </v-view>
</template>

<script>
export default {
  data() {
    return {
      item: [],
    };
  },
  inject: ["appPath"],
  methods: {
    toLabel(i) {
      if (i.children && i.children.length) {
        return "点击查看" + i.text + "(" + i.children.length + "张)";
      }
      return i.text + "内暂无表单";
    },
    onclick(e) {
      if (e.path) {
        this.appPath(e.path);
      }
    },
  },
  mounted() {
    this.item = this.$js.def.form();
  },
};
</script>
<style lang='less' scoped>
</style>
