<template>
  <v-finance>
    <div class="box">
      <ul class="flex fw">
        <li v-for="(i, j) in menu" :key="j" @click="onMenu(i)">
          <h2>{{ i.text }}</h2>
          <p>{{ i.sub }}</p>
          <span class="num" v-if="i.num">{{ i.num }}</span>
        </li>
      </ul>
    </div>
  </v-finance>
</template>

<script>
export default {
  data() {
    return {
      menu: [],
    };
  },
  inject: ["appPath"],
  methods: {
    onMenu(e) {
      if (e.path) {
        this.appPath(e.path);
      }
    },
  },
  mounted() {
    this.menu = this.$js.def.finance.setting;
  },
};
</script>
<style lang='less' scoped>
.box {
  margin: 15px 10px;
  font-size: 15px;
}
li {
  border-radius: 25px 5px;
  width: 49%;
  position: relative;
  padding: 20px 15px 0;
  box-sizing: border-box;
  height: 100px;
  margin-bottom: 15px;
  background: #fff;
  background: linear-gradient(-45deg, #edeef3, #f6dde1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  &:nth-child(2n) {
    margin-left: 2%;
  }
  h2 {
    font-weight: 650;
    padding: 8px 0;
  }
  > p {
    font-size: 12px;
    color: rgb(177, 177, 177);
  }
  .num {
    position: absolute;
    right: 12px;
    top: 8px;
    border-radius: 50%;
    background-color: tomato;
    color: #fff;
    font-size: 12px;
    padding: 0 5px;
  }
}
</style>
