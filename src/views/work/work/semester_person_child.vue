<template>
  <div class="child">
    <van-cell :title="group.name" :label="group.label"></van-cell>
    <van-cell :title="t1.name" :label="t1.label"></van-cell>
    <van-divider content-position="left">学期重点工作</van-divider>
    <van-empty v-if="!t2.length" description="暂无"></van-empty>
    <section v-for="(i, j) in t2" :key="j + 's'">
      <h4>重点指标</h4>
      <p>{{ i.key }}</p>
      <h4>保底目标</h4>
      <p>{{ i.target }}</p>
      <h4>冲刺目标</h4>
      <p>{{ i.spurt }}</p>
    </section>
    <van-divider content-position="left">学期指标目标</van-divider>
    <van-empty v-if="!t3.length" description="暂无"></van-empty>
    <section v-for="(i, j) in t3" :key="j">
      <h6>{{ [i.year, "年", i.month, "月"].join("") }}</h6>
      <template>
        <p v-for="(x, y) in i.work" :key="y + '-' + j">{{ y + 1 }}、{{ x }}</p>
      </template>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    child: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  inject: ["appTimeout"],
  computed: {
    group() {
      return {
        label: [this.child.group_name, this.child.job_name].join("-"),
        name: "发布人：" + this.child.name,
      };
    },
    t1() {
      return {
        name: [
          this.child.year,
          "年",
          this.child.semester === 1 ? "春" : "秋",
          "季学期",
        ],
        label: this.appTimeout(this.child.create_time, true) + "发布",
      };
    },
    t2() {
      let a = [];
      try {
        a = JSON.parse(this.child.semester_index);
      } catch (e) {}
      return a;
    },
    t3() {
      let a = [];
      try {
        a = JSON.parse(this.child.key_work);
      } catch (e) {}
      return a;
    },
  },
  data() {
    return {};
  },
  methods: {},
  mounted() {},
};
</script>
<style lang='less' scoped>
section {
  padding: 8px 10px;
  font-size: 15px;
  line-height: 1.2;
  background-color: rgb(253, 255, 238);
  &:nth-child(2n) {
    background-color: rgb(246, 255, 255);
  }
  h6 {
    font-weight: 650;
    line-height: 1.5;
    margin-bottom: 8px;
  }
  h4 {
    font-weight: 600;
    padding: 8px 0;
  }
}
</style>
