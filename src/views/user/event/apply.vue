<template>
  <v-view header @on-user="onuser">
    <div class="app_top">
      <v-s v-model="search" @search="init"></v-s>
    </div>
    <van-empty
      v-if="!item.length"
      description="您可以尝试搜索集团名"
    ></van-empty>
    <div class="app_section">
      <section v-for="(i, j) in item" :key="j" class="flex">
        <div class="logo">
          <van-image :src="src"></van-image>
        </div>
        <div class="text">
          <h6>{{ i.center_name }}</h6>
          <p>{{ [i.province_name, i.city_name, i.county_name].join("-") }}</p>
          <div class="btn">
            <van-button
              size="small"
              block
              round
              :color="$js.btnColor"
              @click="onsubmit(i)"
              >点击申请</van-button
            >
          </div>
        </div>
      </section>
    </div>
  </v-view>
</template>

<script>
import vS from "../../private/search.vue";
export default {
  data() {
    return {
      search: "",
      item: [],
      user: {},
      // eslint-disable-next-line
      src: demo.siteConfig.icon("home", "private"),
    };
  },
  components: { vS },
  methods: {
    onsubmit(e) {
      this.$js.model("加入提示", "是否加入该集团", (r) => {
        if (r) {
          this.$api.http("userjoingroup", { center_id: e.id }, () => {
            this.$toast("申请成功，等待集团审批");
            // eslint-disable-next-line
            demo.$session.clear("user");
            this.$nextTick(() => {
              this.$router.back();
            });
          });
        }
      });
    },
    onuser(e) {
      this.user = e;
    },
    init() {
      if (this.user.is_whether !== 1) {
        return this.$toast("抱歉！您没有权限使用本功能");
      }
      if (this.search === "") {
        this.item = [];
        return 0;
      }
      this.$api.http("getgroups", { center_name: this.search }, (r) => {
        this.item = r;
      });
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.btn {
  padding-left: 60%;
}
</style>
