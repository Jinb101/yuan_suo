<template>
  <div class="sel_detail">
    <van-divider content-position="left">录{{ item.type }}</van-divider>
    <van-cell title="分类明细" :value="item.ify + '=>' + item.ify2"></van-cell>
    <van-cell title="金额" :value="item.money + '元'"></van-cell>
    <van-cell
      v-if="item.acc"
      title="账户"
      :value="item.acc.opening_bank"
      :label="item.acc.account_title + '\n' + item.acc.account_number"
    ></van-cell>
    <template>
      <van-cell title="客户" v-if="item.cus" :value="item.cus"></van-cell>
      <van-cell title="部门" v-if="item.dep" :value="item.dep"></van-cell>
      <van-cell title="供应商" v-if="item.sup" :value="item.sup"></van-cell>
      <van-cell title="员工" v-if="item.sid" :value="item.sid"></van-cell>
    </template>
    <van-cell title="分摊时间" :value="times"></van-cell>
    <van-cell title="备注" :label="finance.remarks"></van-cell>
    <van-cell title="附件"></van-cell>
    <div class="img flex fw" v-if="item.img && item.img.length">
      <div class="pic" v-for="(i, j) in item.img" :key="j">
        <van-image :src="i" @click="appShowImage(item.img, j)"></van-image>
      </div>
    </div>
    <div class="detbtns">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: null,
  },
  data() {
    return {
      item: {},
    };
  },
  inject: ["appShowImage"],
  computed: {
    det: {
      get: function get() {
        return this.value;
      },
      set: function set(n) {
        this.$emit("input", n);
      },
    },
    finance() {
      return (this.det.finance || [])[0] || {};
    },
    times() {
      let s = this.finance.allocation_start_time;
      let e = this.finance.allocation_end_time;
      let a = ["/", "/"];
      if (s > 0) {
        // eslint-disable-next-line
        a[0] = demo.timeout(s, "ymd");
      }
      if (e > 0) {
        // eslint-disable-next-line
        a[1] = demo.timeout(e, "ymd");
      }
      if (a[0] === a[1] && a[0] === "/") return "无";
      return a.join("~~");
    },
  },
  watch: {
    det: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
  },
  methods: {
    toData(x) {
      let ify = (x.financial_classify || {}).classify_name;
      let ify2 = (x.level_classify || {}).classify_name;
      let acc = x.financial_account || {};
      try {
        if (acc.account_title.indexOf("公户") > 0) {
          acc.account_title = acc.account_title.replace(/\(公户\)/g, "");
          acc.account_title = "(公户) " + acc.account_title;
        } else if (acc.account_title.indexOf("私户") > 0) {
          acc.account_title = acc.account_title.replace(/\(私户\)/g, "");
          acc.account_title = "(私户) " + acc.account_title;
        }
        acc.account_title = acc.account_title.split(" ").join("");
      } catch (e) {}
      let people =
        (x.applicant_id > 0
          ? (x.staff || {}).name
          : (x.financial_staff || {}).name) || "";

      let img = (x.enclosure + "").split(",");
      img = img.filter((r) => {
        return r !== "";
      });
      if (img.length) {
        img = img.map((s) => {
          return x.picture_domain_name + s;
        });
      }
      let cus = (x.financial_customer || {}).customer_name;
      let dep = (x.department || {}).name;
      let sup = (x.supplier || {}).customer_name;
      let sid = "";
      if (x.applicant_id && x.applicant_id > 0) {
        sid = (x.financial_staff || {}).name;
      }
      if (x.financial_staff_id && x.financial_staff_id > 0) {
        sid = (x.staff || {}).name;
      }

      return {
        ify,
        ify2,
        type: +x.financial_type === 2 ? "支出" : "收入",
        money: +x.amount_money,
        acc,
        people,
        status: +x.financial_type === 2,
        img,
        cus,
        dep,
        sup,
        sid,
      };
    },
  },
  mounted() {
    this.det = this.value;
    this.$nextTick(() => {
      this.item = this.toData(this.finance);
    });
  },
};
</script>
<style lang='less' scoped>
.img {
  padding: 10px;
  .pic {
    width: 80px;
    height: 80px;
    margin: 0 10px 10px 0;
    overflow: hidden;
    border-radius: 5px;
  }
}
.detbtns {
  padding: 10px;
  background-color: #fff;
  position: sticky;
  bottom: 0;
  z-index: 50;
}
</style>
