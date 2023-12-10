<template>
  <v-finance :text="text">
    <template v-if="list.length">
      <template v-for="(i, j) in list">
        <v-l
          :item="items"
          v-model="list[j]"
          :status="+type === 1"
          @change="onchangesub"
          @del="ondel($event, j)"
          :key="j"
        ></v-l>
      </template>
    </template>
    <v-l
      :item="items"
      v-model="aa"
      :status="+type === 1"
      @change="onchangesub"
      :indexnum="num"
    ></v-l>
  </v-finance>
</template>

<script>
import vL from "./line.vue";
export default {
  data() {
    return {
      type: "",
      item: {},
      items: {},
      list: [],
      aa: {},
      num: 0,
    };
  },
  components: { vL },
  computed: {
    text() {
      return +this.type === 1
        ? "录收入"
        : +this.type === 2
        ? "录支出"
        : "录凭证";
    },
  },
  methods: {
    onchangesub(e, isedit) {
      this.$api.http("financevoucherset", e, (r) => {
        this.$toast("记录成功");
        this.aa = { $reload: true };
        this.onlist();
      });
    },
    ondel(e, index) {
      this.$js.modeldel(() => {
        this.$api.http(
          "financevoucherdelcheck",
          { finance_id: e.finance_id },
          () => {
            this.$toast("删除成功");
            this.list.splice(index, 1);
          }
        );
      });
    },
    onlist() {
      this.$api.http(
        "financevouchercheck",
        { financial_type: this.type },
        (r) => {
          this.list = r;
          // if (r.length) {
          //   this.num =
          //     (r[r.length - 1].financial_voucher || {}).voucher_word + 1;
          // }
        }
      );
    },
    httpdef(api, data = {}) {
      let t = this;
      return new Promise((resolve, reject) => {
        t.$api.http(api, data, (res) => {
          resolve(res);
        });
      });
    },
    // 类型
    async get1() {
      return this.httpdef("financeifyget", { classify_type: this.type }).then(
        (e) => {
          // eslint-disable-next-line
          let tree = demo.tree(e, "classify_id", "pid");
          this.item.ify = tree;
        }
      );
    },
    async get2() {
      return this.httpdef("financevoucher").then((e) => {
        this.num = e;
      });
    },
    // 账户
    async get3() {
      return this.httpdef("financeaccount").then((e) => {
        this.item.account = e;
      });
    },
    // 客户
    async get4() {
      return this.httpdef("financecustomer", { customer_type: 1 }).then((e) => {
        this.item.customer = e;
      });
    },
    // 供应商
    async get5() {
      return this.httpdef("financecustomer", { customer_type: 2 }).then((e) => {
        this.item.supplier = e;
      });
    },
    // 获取部门
    async get6() {
      return this.httpdef("getGroup").then((e) => {
        this.item.group = e;
      });
    },
    // 获取员工
    async get7() {
      return this.httpdef("financestaffget").then((e) => {
        this.item.staff = e;
      });
    },
    async init() {
      let load = this.$toast.loading({ duration: 0, forbidClick: true });
      this.items = {};
      // 获取分类
      await this.get1();
      // 最新凭证号
      await this.get2();
      // 获取账户
      await this.get3();
      // 获取客户
      await this.get4();
      // 获取供应商
      await this.get5();
      // 获取部门
      await this.get6();
      // 获取员工
      await this.get7();
      this.items = { time: Date.now(), ...this.item };
      // 列表
      this.onlist();
      load.close();
    },
  },
  mounted() {
    this.type = this.$route.params.type;
    this.init();
  },
};
</script>
<style lang='less' scoped>
</style>
