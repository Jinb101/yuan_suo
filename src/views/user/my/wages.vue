<template>
  <v-view header :text="title" bgc="#f5f5f5">
    <template #menu>
      <span @click="open = !open">历史工资</span>
    </template>
    <template v-if="detail.year_month">
      <div class="box">
        <van-cell title="姓名" :value="staff.name"></van-cell>
        <van-cell
          title="部门职位"
          :value="[staff.group_name, staff.job_name].join('-')"
        ></van-cell>
        <van-cell title="岗级" :value="staff.level_name"></van-cell>
        <van-cell title="账号/手机号" :value="staff.contact"></van-cell>
      </div>
      <div class="box">
        <van-cell title="考核月份" :value="tomonth(info.log_date)"></van-cell>
        <van-cell title="考核总分" :value="+detail.score + '分'"></van-cell>
        <van-cell
          title="扣税金额"
          :value="+info.tax_deduction_amount + '元'"
        ></van-cell>
      </div>
      <div class="box" v-if="list.length">
        <van-cell
          :title="i.name"
          :value="+i.amount + '元'"
          v-for="(i, j) in list"
          :key="j"
        ></van-cell>
      </div>
      <div class="foot">
        <van-cell title="应发工资" :value="info.amount + '元'"></van-cell>
      </div>
    </template>
    <van-empty v-else description="暂无下发工资"></van-empty>
    <template #fixed>
      <v-t v-model="s1" max="m_0" type="year-month" :open="open"></v-t>
    </template>
  </v-view>
</template>

<script>
import vT from "../../private/time.vue";
export default {
  data() {
    return {
      s1: {},
      open: false,
      time: "",
      detail: {},
    };
  },
  watch: {
    s1: {
      handler(n) {
        if (n.obj) {
          this.time = [n.obj.y, n.obj.m].join("-");
        }
      },
      deep: true,
    },
    time() {
      this.init();
    },
  },
  components: { vT },
  computed: {
    title() {
      if (this.time && this.time.indexOf("-") > 0) {
        let v = this.time.split("-");
        return v[0] + "年" + v[1] + "月工资条总览";
      }
      return "工资条";
    },
    list() {
      return this.detail.list || [];
    },
    staff() {
      return this.detail.staff || {};
    },
    info() {
      return this.detail.wage_info || {};
    },
  },
  methods: {
    tomonth(v) {
      if (v < 1 || v === undefined) return "/";
      // eslint-disable-next-line
      let a = demo.timeout(v, "array");
      return [a[0], "年", a[1], "月"].join("");
    },
    init() {
      // usermywages
      this.$api.http("usermywages", { year_month: this.time }, (r) => {
        this.detail = r || {};
      });
    },
  },
  mounted() {
    // eslint-disable-next-line
    let d = demo.month().month(-1)[0];
    this.time = [d.year, d.month].join("-");
  },
};
</script>
<style lang='less' scoped>
.box {
  margin-top: 10px;
}
.foot {
  position: sticky;
  bottom: 0;
  z-index: 5;
  margin-top: 10px;
}
</style>
