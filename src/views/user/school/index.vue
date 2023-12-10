<template>
  <v-view header>
    <div class="app_top" v-if="tab.length > 0">
      <van-tabs v-model="type" title-active-color="#38f" @click="ontab">
        <van-tab
          :title="i.name"
          :name="i.id + ''"
          v-for="(i, j) in tab"
          :key="j"
        ></van-tab>
      </van-tabs>
    </div>
    <template v-if="tab.length">
      <v-page ref="page" @on-page="onPage">
        <van-empty v-if="!item.length"></van-empty>
        <section v-for="(i, j) in item" :key="j" @click="ondet(i, j)">
          <div class="logo">
            <van-image :src="i.cover" fit="cover"></van-image>
          </div>
          <div class="text">
            <van-cell :title="i.title" :label="i.courses"></van-cell>
          </div>
        </section>
      </v-page>
    </template>
    <van-empty v-else description="暂未开放"></van-empty>
    <template #fixed>
      <v-f v-model="open" :footer="false" text="详情">
        <v-c :ids="det.id"></v-c>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
import vC from "./det.vue";
export default {
  data() {
    return {
      tab: [],
      type: "",
      item: [],
      open: false,
      det: {},
    };
  },
  components: { vF, vC },
  watch: {
    type() {
      this.onPage(1);
    },
    open(n) {
      if (!n) {
        this.appPath("/school/" + this.type, true);
      }
    },
  },
  inject: ["appPath"],
  methods: {
    ondet(i, j) {
      this.appPath("/school/" + this.type + "&" + i.id, true);
      this.det = { id: i.id, $index: j };
      this.open = true;
    },
    ontab() {
      this.appPath("/school/" + this.type, true);
    },
    onPage(page, f) {
      if (this.type === "") return 0;
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "userschoollist",
        { page, department_id: this.type, title: "" },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          this.item = this.item.concat(e);
          this.$refs.page.onFinish(e.length < 20);
        }
      );
    },
  },
  mounted() {
    this.$api.http("userschoolmenu", { type: 3 }, (r) => {
      this.tab = r;
      this.type = this.$route.params.type || "";
      let id = this.$route.params.id || "";
      if (id > 0) {
        this.ondet({ id }, -1);
      }
    });
  },
};
</script>
<style lang='less' scoped>
section {
  margin: 10px;
  font-size: 15px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  .logo {
    height: 200px;
  }
}
</style>
