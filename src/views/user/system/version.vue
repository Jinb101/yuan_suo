<template>
  <div class="version">
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section v-for="(i, j) in item" :key="j">
        <van-divider content-position="left">v{{ i.version }}</van-divider>
        <h5>#{{ i.title }}</h5>
        <template v-if="i.children && i.children.length">
          <p
            class="p"
            v-for="(x, y) in i.children"
            :key="y + '-' + j"
            v-html="x"
          ></p>
        </template>
        <p v-else class="p">例行维护</p>
        <van-divider content-position="right">{{ toTime(i) }}更新</van-divider>
      </section>
    </v-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: [],
    };
  },
  methods: {
    toTime(e) {
      let t = e.timeout;
      return [t.y, t.m, t.d].join("-");
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      // eslint-disable-next-line
      demo.siteConfig.version(page, 20, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
section {
  h5 {
    padding: 5px 10px;
    font-size: 16px;
    font-weight: 650;
  }
  .p {
    font-size: 13px;
    color: #999;
    line-height: 1.2;
    padding: 10px;
    padding-left: 20px;
    & + .p {
      padding-top: 0;
    }
  }
  h6 {
    color: #666;
    padding: 10px;
  }
  div.p {
    padding-bottom: 0;
  }
}
</style>
