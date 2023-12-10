<template>
  <div class="integral_jf">
    <div class="app_top">
      <van-tabs v-model="active">
        <van-tab
          :title="i.t"
          v-for="(i, j) in tab"
          :key="j"
          :name="i.v"
        ></van-tab>
      </van-tabs>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section v-for="(i, j) in item" :key="j">
        <div class="cont">
          {{ i.describe }}
        </div>
        <p class="time">{{ appTimeout(i.create_time, true) }}</p>
        <p class="grade">+{{ +i.integral }}</p>
      </section>
    </v-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: "all",
      item: [],
      tab: [
        { t: "全部", v: "all" },
        { t: "引荐奖", v: "recommend" },
        { t: "签约奖", v: "sign" },
        { t: "服务奖", v: "serve" },
        { t: "感召奖", v: "inspire" },
        { t: "城市合伙人", v: "city" },
        { t: "园所积分", v: "garden_office" },
        { t: "宝贝在线", v: "baby_online" },
      ],
    };
  },
  watch: {
    active() {
      this.onPage(1);
    },
  },
  inject: ["appTimeout"],
  methods: {
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "myintegrallist",
        { page, award_type: this.active === "all" ? "" : this.active },
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
  mounted() {},
};
</script>
<style lang='less' scoped>
section {
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  position: relative;
  min-height: 40px;
  font-size: 15px;
  color: #666;
  background-color: #fff;
  .cont {
    padding-right: 60px;
  }
  .time {
    font-size: 12px;
    margin-top: 12px;
  }
  .grade {
    position: absolute;
    right: 5px;
    top: 0;
    bottom: 0;
    margin: auto;
    color: #15c1a9;
    font-size: 25px;
    height: 40px;
    line-height: 40px;
  }
}
</style>
