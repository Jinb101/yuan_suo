<template>
  <v-view header cover>
    <v-t :num="999"></v-t>
    <!-- <section v-for="(i, j) in tab" :key="j" @click="ondetail(i)">
      <div class="logo"></div>
      <h6>
        {{ i.text }}<span v-if="i.num"><van-badge :content="i.num" /></span>
      </h6>
      <span class="arrow">
        <van-icon name="arrow"></van-icon>
      </span>
    </section> -->
    <!-- <div class="img">
      <van-image :src="pic"></van-image>
    </div> -->
  </v-view>
</template>

<script>
import vT from "./_tabmenu.vue";
export default {
  data() {
    return {
      tab: [],
      // eslint-disable-next-line
      // pic: demo.siteConfig.icon("1", "other"),
      // bgc: "linear-gradient(#38f,#fff 60%)",
    };
  },
  components: { vT },
  inject: ["appPath"],
  methods: {
    init() {
      this.$api.http("classnonum", {}, (r) => {
        this.$set(this.tab[2], "num", r);
      });
    },
    ondetail(e) {
      if (e.path) {
        this.appPath(e.path);
      }
    },
  },
  mounted() {
    // this.tab = this.$js.def.works.class;
    // this.init();
  },
};
</script>
<style lang='less' scoped>
section {
  position: relative;
  margin: 10px;
  padding: 10px;
  box-sizing: border-box;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 25px 0;
  font-size: 15px;
  background-color: #fff;
  overflow: hidden;
  &:nth-child(2n) {
    border-radius: 0 25px;
  }
  h6 {
    display: flex;
    align-items: center;
    font-weight: 650;
    padding: 20px 10px;
    span {
      padding-left: 5px;
    }
  }
  .arrow {
    position: absolute;
    right: 5px;
    top: 0;
    bottom: 0;
    margin: auto;
    height: 20px;
    color: #ccc;
  }
  .logo {
    background-color: #38f;
    opacity: 0.1;
    position: absolute;
    left: 0;
    top: 0;
    width: 60px;
    height: 60px;
    border-radius: 0 0 30px;
  }
}
.img {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: -1;
}
</style>
