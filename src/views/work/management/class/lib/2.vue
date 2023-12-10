<template>
  <div class="class_2">
    <van-empty v-if="!item.length" description="暂无缴费记录"></van-empty>
    <section v-for="(i, j) in item" :key="j">
      <p>缴费类型：{{ i.charge_item_name }}</p>
      <p>缴费金额：{{ i.amount }}元</p>
      <p>缴费时间：{{ appTimeout(i.time, false, "ymd") }}</p>
      <p>到期时间：{{ i.expire_date }}</p>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    ids: [String, Number],
  },
  data() {
    return {
      item: [],
    };
  },
  inject: ["appTimeout"],
  methods: {},
  mounted() {
    this.$api.http("classstudentpay", { id: this.ids }, (r) => {
      this.item = r;
    });
  },
};
</script>
<style lang='less' scoped>
section {
  background-color: #fff;
  padding: 15px;
  font-size: 15px;
  p {
    color: #999;
    margin-bottom: 5px;
  }
}
</style>
