<template>
  <div class="b_in">
    <div class="app_top h44">
      <v-s v-model="search" unauto @search="onPage(1)"></v-s>
    </div>
    <van-cell
      title="缴费总额："
      :value="allmoney + '元'"
      v-if="!out && item.length"
    ></van-cell>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <div class="app_section">
        <section v-for="(i, j) in item" :key="j" class="flex">
          <v-a class="logo" :src="tosrc(i)" :sex="tosex(i)"></v-a>
          <div class="text">
            <h6>{{ toname(i) }}</h6>
            <p v-if="i.birthday">生日：{{ i.birthday }}</p>
            <p>{{ toclass(i) }}</p>
            <p v-if="i.nickname">{{ [i.nickname, i.phone].join("-") }}</p>
            <template v-if="!out">
              <p>支付费用：{{ i.amount }}元</p>
              <p>购买时间：{{ appTimeout(i.pay_time) }}</p>
              <p>到期时间：{{ appTimeout(i.maturity_time) }}</p>
            </template>
            <template v-else>
              <p>未续费金额：{{ i.amount || 0 }}元</p>
            </template>
          </div>
        </section>
      </div>
    </v-page>
  </div>
</template>

<script>
import vS from "../../private/search.vue";
import vA from "../../private/avatar.vue";
export default {
  props: {
    cid: [String, Number],
    rid: [String, Number],
    apiname: {
      type: String,
      default: "babymyin",
    },
    out: Boolean,
  },
  data() {
    return {
      item: [],
      search: "",
      allmoney: 0,
    };
  },
  watch: {
    cid() {
      this.onPage(1);
    },
  },
  inject: ["appTimeout"],
  components: { vS, vA },
  methods: {
    toclass(i) {
      if (this.out) {
        return [i.type, i.class_name].join("-");
      }
      let e = i.child || {};
      return [e.type, e.class_name].join("-");
    },
    toname(i) {
      if (this.out) {
        return i.name;
      }
      return (i.child || {}).name;
    },
    tosrc(i) {
      if (this.out) {
        return "";
      }
      return (i.child || {}).head;
    },
    tosex(i) {
      let zh = (i.child || {}).gender;
      if (this.out) {
        zh = i.gender;
      }
      return zh === "男" ? 1 : 2;
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        this.apiname,
        { page, class_id: this.cid, grade: this.rid, name: this.search },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          this.allmoney = e.total_amount || 0;
          this.item = this.item.concat(e.list);
          this.$refs.page.onFinish(e.list.length < 20);
        }
      );
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
</style>
