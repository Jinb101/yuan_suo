<template>
  <v-view header>
    <template #menu>
      <span @click="add = !add" class="col_danger"
        >{{ add ? "关闭" : "" }}删除管理</span
      >
    </template>
    <v-s :del="add"></v-s>
  </v-view>
</template>

<script>
import vS from "./_sign.vue";
export default {
  data() {
    return {
      item: [],
      add: false,
      s1: {},
    };
  },
  components: { vS },
  methods: {},
  mounted() {},
};
</script>
<style lang='less' scoped>
section {
  position: relative;
  padding: 10px;
  .pic {
    height: 200px;
    box-sizing: border-box;
    border: 1px dashed #38f;
  }
  .del {
    position: absolute;
    right: 0;
    top: 0;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    background-color: tomato;
    color: #fff;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }
}
</style>
