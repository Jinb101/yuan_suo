<template>
  <v-view header bgc="#f8f7fa">
    <template #menu>
      <span @click="$refs.box.open3 = true">我的订单</span>
    </template>
    <v-p ref="box"></v-p>
  </v-view>
</template>

<script>
import vP from "./_chant/example.vue";
export default {
  data() {
    return {
      params: {},
    };
  },
  components: { vP },
  methods: {},
  mounted() {
    this.params = this.$route.params;
  },
};
</script>
<style lang='less' scoped>
</style>
