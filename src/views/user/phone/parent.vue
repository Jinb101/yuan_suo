<template>
  <v-view header>
    <template #menu>
      <v-c v-model="class_ext" teach></v-c>
    </template>
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
          <van-image :src="toIcon(i)" lazy-load></van-image>
        </div>
        <div class="f1">
          <h6>
            姓名：{{ i.nickname }}
            <b>[{{ i.relevance }}]</b>
            <van-tag :type="+i.guardian === 1 ? 'primary' : 'success'">
              {{ i.guardian === 1 ? "主" : "副" }}监护人
            </van-tag>
          </h6>
          <p>电话：{{ i.phone }}</p>
          <p>宝宝姓名：{{ i.name }}</p>
        </div>

        <van-icon name="phone"></van-icon>
      </section>
    </v-page>
  </v-view>
</template>

<script>
import vC from "../../private/select_class.vue";
export default {
  data() {
    return {
      class_ext: {},
      item: [],
      search: "",
    };
  },
  watch: {
    search() {
      this.$timefn(() => {
        this.onPage(1);
      });
    },
    class_ext: {
      handler() {
        this.onPage(1);
      },
      deep: true,
    },
  },
  components: { vC },
  methods: {
    toIcon(e) {
      let num = e.relevance === "爸爸" ? 24 : e.relevance === "妈妈" ? 36 : 41;
      // eslint-disable-next-line
      return demo.siteConfig.icon(num + 10000, "people");
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "userphoneparent",
        { page, name: this.search, class_id: this.class_ext.id || "" },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          this.item = this.item.concat(e);
          this.$refs.page.onFinish(e.length < 20);
        }
      );
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
      b {
        font-weight: 400;
        padding-left: 5px;
      }
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
