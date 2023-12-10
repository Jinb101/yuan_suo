<template>
  <v-view header @on-user="onuser">
    <div class="app_top">
      <v-s v-model="search" @search="onPage(1)"></v-s>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <div class="app_section">
        <section
          v-for="(i, j) in item"
          :key="j"
          class="flex"
          @click.stop="ondetail(i)"
        >
          <div class="logo">
            <v-a :src="i.avatar" teacher></v-a>
          </div>
          <div class="text">
            <h6>{{ i.name }}</h6>
            <p>部门：{{ [i.group_name, i.job_name].join("-") }}</p>
            <p>
              联系方式：<b class="col_primary" @click.stop="ontel(i.contact)">{{
                i.contact
              }}</b>
            </p>
          </div>
        </section>
      </div>
    </v-page>
    <template #fixed>
      <v-f v-model="open" :footer="false" text="制定考核表">
        <v-p1 :ids="id" :user="user"></v-p1>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vS from "../../../private/search.vue";
import vF from "../../../private/fixed.vue";
import vA from "../../../private/avatar.vue";
import vP1 from "./_set_detail.vue";
export default {
  data() {
    return {
      search: "",
      item: [],
      detail: {},
      open: false,
      id: "",
      user: {},
    };
  },
  watch: {
    open(n) {
      if (!n) {
        this.appPath("/management_achievements_set", true);
      }
    },
  },
  components: { vS, vF, vA, vP1 },
  inject: ["appPath"],
  methods: {
    onuser(e) {
      this.user = e;
    },
    ondetail(e) {
      this.appPath("/management_achievements_set/" + e.id, true);
      this.open = true;
      this.id = e.id;
    },
    ontel(e) {
      // eslint-disable-next-line
      demo.siteConfig.tel(e);
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "achievementslist",
        { page, limit: 100, name: this.search },
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
    this.id = this.$route.params.id || "";
    if (this.id) {
      this.ondetail({ id: this.id });
    }
  },
};
</script>
<style lang='less' scoped>
</style>
