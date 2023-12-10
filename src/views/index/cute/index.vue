<template>
  <v-view header @on-view="onView" index="400">
    <template #menu>
      <span @click="appPath('/cute_add')">发布</span>
    </template>
    <v-page ref="page" @on-page="onPage">
      <v-e v-model="item" :del="is_del" @detail="onDetail"></v-e>
    </v-page>
    <template #fixed>
      <v-f
        :footer="false"
        :index="500"
        v-model="open"
        :text="ext_title"
        bgc="#f7f7f7"
      >
        <template #menu>
          <span @click="onDelExt" v-if="is_del">删除</span>
        </template>
        <v-d v-model="ext" @onlike="onLike"></v-d>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vE from "./item.vue";
import vF from "../../private/fixed.vue";
import vD from "./detail.vue";
export default {
  data() {
    return {
      item: [],
      is_del: false,
      id: "",
      ext: {},
      ext_title: "",
      open: false,
    };
  },
  watch: {
    "$route.params.id"(n) {
      if (+this.id !== +n) {
        this.onDetail(n);
      }
    },
    open(n) {
      if (!n) {
        this.appPath("/cute", true);
      }
    },
  },
  inject: ["appPath"],
  components: { vE, vF, vD },
  methods: {
    onView(e) {
      this.is_del = this.$js.islevel(459, e.level);
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("cute", { page }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
    onDetail(e) {
      if (e) {
        this.id = e;
        this.$api.http(
          "cutedet",
          { page: 1, limit: 10, lovable_id: e },
          (res) => {
            this.ext = res;
            this.ext_title = (res.details || {}).title || "精彩瞬间";
            this.open = true;
          }
        );
      } else {
        this.id = "";
        this.open = false;
      }
    },
    onDelExt() {
      this.$js.model("删除确认", "是否删除精彩瞬间", (res) => {
        if (res) {
          let id = this.id;
          this.$api.http("cutedel", { lovable_id: id }, () => {
            this.$toast("删除成功");
            this.onDetail("");
            this.item = this.item.filter((r) => {
              return r.id !== id;
            });
          });
        }
      });
    },
    onLike(e) {
      this.item = this.item.map((s) => {
        if (s.id === e.id) {
          s.like = e.like;
          s.quantity = e.quantity;
        }
        return s;
      });
    },
  },
  mounted() {
    this.id = this.$route.params.id || "";
    this.onDetail(this.id);
  },
};
</script>
<style lang='less' scoped>
</style>
