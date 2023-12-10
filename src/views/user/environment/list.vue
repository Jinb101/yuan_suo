<template>
  <div class="envio_det">
    <div class="app_top">
      <div class="flex">
        <div class="searchs">
          <v-s v-model="search" @search="onPage(1)"></v-s>
        </div>
        <div class="sorts">
          <van-popover
            v-model="show"
            trigger="click"
            :actions="menu"
            @select="onmenu"
            class="menu"
          >
            <template #reference>
              <b>{{ title }}</b>
              <van-icon :name="show ? 'arrow-up' : 'arrow-down'" />
            </template>
          </van-popover>
        </div>
      </div>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <div class="flex fw">
        <div v-for="(i, j) in item" :key="j" class="tap" @click="ondetail(i)">
          <div class="logo">
            <van-image :src="i.cover" fit="cover"></van-image>
          </div>
          <div class="text van-multi-ellipsis--l2">
            {{ i.title }}
          </div>
        </div>
      </div>
    </v-page>
    <v-f v-model="open" :footer="false" text="环创详情">
      <v-d v-model="det"></v-d>
    </v-f>
  </div>
</template>

<script>
import vS from "../../private/search.vue";
import vF from "../../private/fixed.vue";
import vD from "./det.vue";
export default {
  props: {
    ids: [String, Number],
  },
  data() {
    return {
      type: "",
      menu: [
        { text: "点赞量正序", v: "2" },
        { text: "点赞量倒序", v: "1" },
        { text: "浏览量倒序", v: "3" },
        { text: "浏览量正序", v: "4" },
        { text: "发布时间倒序", v: "5" },
        { text: "发布时间正序", v: "6" },
      ],
      search: "",
      show: false,
      title: "",
      item: [],
      open: false,
      det: {},
    };
  },
  watch: {
    open(n) {
      if (!n) {
        this.det = {};
      }
    },
  },
  components: { vS, vF, vD },
  methods: {
    ondetail(e) {
      this.$api.http("environmentdet", { id: e.id }, (r) => {
        this.det = r;
        this.open = true;
      });
    },
    onmenu(e) {
      this.title = e.text;
      this.type = e.v;
      this.onPage(1);
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "environmentlist",
        {
          page,
          classify_id: this.ids,
          sort: this.type,
          limit: 50,
          name: this.search,
        },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          this.item = this.item.concat(e);
          this.$refs.page.onFinish(e.length < 50);
        }
      );
    },
  },
  mounted() {
    this.title = this.menu[0].text;
    this.type = this.menu[0].v;
  },
};
</script>
<style lang='less' scoped>
.searchs {
  flex: 1;
}
.sorts {
  padding: 10px;
  font-size: 14px;
  line-height: 34px;
}
.tap {
  width: 50%;
  box-sizing: border-box;
  padding: 8px 5px;
  font-size: 14px;
  cursor: pointer;
  .logo {
    height: 100px;
    border-radius: 0 0 8px 8px;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .text {
    height: 34px;
    line-height: 1.2;
    text-indent: 5px;
    color: #999;
  }
}
</style>
