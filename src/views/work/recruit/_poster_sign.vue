<template>
  <div class="poster_sign">
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <div class="app_section">
        <section v-for="(i, j) in item" :key="j" class="flex">
          <div class="logo">
            <v-a :sex="i.gender"></v-a>
          </div>
          <div class="text">
            <h6>宝宝姓名：{{ i.baby_name }}</h6>
            <p>出生日期：{{ i.birthday }}</p>
            <p>
              联系电话：<b @click="ontel(i.phone)" class="col_info">{{
                i.phone
              }}</b>
            </p>
            <p>地区：{{ toCity(i) }}</p>
          </div>
        </section>
      </div>
    </v-page>
  </div>
</template>

<script>
import vA from "../../private/avatar.vue";
export default {
  props: {
    ids: [String, Number],
  },
  components: { vA },
  data() {
    return {
      item: [],
    };
  },
  methods: {
    ontel(e) {
      if (e) {
        // eslint-disable-next-line
        demo.siteConfig.tel(e);
      }
    },
    toCity(e) {
      let a = [];
      if (e.province && e.province.province) {
        a = [e.province.province, e.city.city, e.county.county, e.address];
      }
      return a.join("");
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("posterinfo", { page, id: this.ids }, (e) => {
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
</style>
