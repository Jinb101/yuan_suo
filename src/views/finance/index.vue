<template>
  <v-finance :back="$frameview">
    <div class="box">
      <v-m v-model="menu" @change="onMenu" cls="purple"></v-m>
    </div>
  </v-finance>
</template>

<script>
import vM from "../private/menu.vue";
export default {
  data() {
    return {
      menu: [],
    };
  },
  inject: ["appPath"],
  components: { vM },
  methods: {
    onMenu(e) {
      if (e.path) {
        this.appPath(e.path);
      }
    },
  },
  mounted() {
    this.menu = this.$js.def.finance.index;
  },
};
</script>
<style lang='less' scoped>
.box {
  margin: 15px 10px;
  border-radius: 15px;
  background-color: #fff;
  font-size: 16px;
  padding: 10px;
}
</style>
