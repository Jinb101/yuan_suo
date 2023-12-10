<template>
  <v-view header>
    <van-button block type="primary" @click="on1">投票价格</van-button>
    <van-button block type="info" @click="on2">投票规则</van-button>
    <van-button block type="primary" @click="on3">投票购买</van-button>
  </v-view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    on1() {
      this.$api.http("voteprice", {}, (r) => {
        console.log(r);
      });
    },
    on2() {
      this.$api.http("voterule", {}, (r) => {
        console.log(r);
      });
    },
    on3() {
      this.$api.http("votebuys", { vote_id: 11 }, (r) => {
        console.log(r);
      });
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
</style>
