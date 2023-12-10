<template>
  <v-view header>
    <div class="top">
      <van-search
        v-model="search"
        placeholder="请输入搜索关键词"
        shape="round"
      />
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section v-for="(i, j) in item" :key="j" class="flex" @click="onTel(i)">
        <div class="logo">
          <van-image :src="pic" lazy-load></van-image>
        </div>
        <div class="f1">
          <h6>姓名：{{ i.name }}</h6>
          <p>电话：{{ i.phone }}</p>
          <p>职位：{{ i.group_name }}-{{ i.job_name }}</p>
        </div>

        <van-icon name="phone"></van-icon>
      </section>
    </v-page>
  </v-view>
</template>

<script>
export default {
  data() {
    return {
      item: [],
      search: "",
      // eslint-disable-next-line
      pic: demo.siteConfig.icon(10006, "people"),
    };
  },
  watch: {
    search() {
      this.$timefn(() => {
        this.onPage(1);
      });
    },
  },
  methods: {
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("userphoneteach", { page, name: this.search }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
    onTel(e) {
      // eslint-disable-next-line
      demo.siteConfig.tel(e.phone);
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.top {
  position: sticky;
  top: 0;
  z-index: 55;
}
section {
  padding: 5px 15px;
  align-items: center;
  margin-bottom: 5px;
  box-sizing: border-box;
  position: relative;
  .van-icon {
    position: absolute;
    right: 20px;
    top: 0;
    bottom: 0;
    margin: auto;
    font-size: 18px;
    color: #ccc;
    height: 20px;
  }
  .logo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f7f7f7;
  }
  .f1 {
    width: calc(100% - 40px);
    font-size: 15px;
    box-sizing: border-box;
    padding-left: 10px;
    h6 {
      padding: 5px 0;
      font-weight: 650;
    }
    p {
      line-height: 1.2;
      &:last-child {
        color: #999;
      }
    }
  }
}
</style>
