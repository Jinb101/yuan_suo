<template>
  <div class="integral_txjl">
    <div class="app_top">
      <van-tabs v-model="active">
        <van-tab title="提现中" name="0"></van-tab>
        <van-tab title="已完成" name="1"></van-tab>
      </van-tabs>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section v-for="(i, j) in item" :key="j" @click="ondet(i.id)">
        <p>
          提现积分：<b class="col_green">{{ +i.integral }}</b>
        </p>
        <span class="status">{{ tostatus(i.status) }}</span>
      </section>
    </v-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: "0",
      item: [],
    };
  },
  watch: {
    active() {
      this.onPage(1);
    },
  },
  methods: {
    ondet(withdrawal_id) {
      // this.$api.http("myintegraldet", { withdrawal_id }, (r) => {
      //   console.log(r);
      // });
    },
    tostatus(n) {
      return ["", "提现申请", "", "", "打款中"][n];
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "myintegralgetlist",
        { page, is_withdrawal: this.active },
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
  margin: 5px;
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  font-size: 15px;
  color: #666;
  .status {
    font-size: 12px;
    margin-top: 5px;
    display: inline-block;
  }
}
</style>
