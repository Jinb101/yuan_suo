<template>
  <div class="class_baby">
    <template v-if="tab.length">
      <v-a1 path @change="onchange" v-if="+type === +tab[0].level">
        <div class="app_top">
          <van-tabs v-model="type" @change="ontypechange">
            <van-tab
              :title="i.text"
              v-for="(i, j) in tab"
              :key="j"
              :name="i.level"
            ></van-tab>
          </van-tabs></div
      ></v-a1>

      <v-a2 path v-else-if="+type === +tab[1].level">
        <div class="app_top">
          <van-tabs v-model="type" @change="ontypechange">
            <van-tab
              :title="i.text"
              v-for="(i, j) in tab"
              :key="j + '-1'"
              :name="i.level"
            ></van-tab>
          </van-tabs></div
      ></v-a2>

      <v-a3 path v-else-if="+type === +tab[2].level">
        <div class="app_top">
          <van-tabs v-model="type" @change="ontypechange">
            <van-tab
              :title="i.text"
              v-for="(i, j) in tab"
              :key="j + '-2'"
              :name="i.level"
            ></van-tab>
          </van-tabs></div
      ></v-a3>

      <v-a4 path v-else-if="+type === +tab[3].level">
        <div class="app_top">
          <van-tabs v-model="type" @change="ontypechange">
            <van-tab
              :title="i.text"
              v-for="(i, j) in tab"
              :key="j + '-3'"
              :name="i.level"
            ></van-tab>
          </van-tabs></div
      ></v-a4>
    </template>
  </div>
</template>

<script>
import vA1 from "./reward.vue";
import vA2 from "./reward_rule.vue";
import vA3 from "./integral.vue";
import vA4 from "./integral_rank.vue";
export default {
  data() {
    return {
      tab: [],
      type: "",
      id: "",
    };
  },
  inject: ["appPath"],
  watch: {
    type(n) {
      if (n) {
        if (this.id) {
          // this.appPath("/work_baby/" + n + "&" + this.id, true);
        } else {
          this.appPath("/work_baby/" + n, true);
        }
      }
    },
  },
  components: { vA1, vA2, vA3, vA4 },
  methods: {
    ontypechange(ee) {
      this.appPath("/work_baby/" + ee, true);
    },
    onchange(e) {
      if (this.type === "") {
        this.type = this.$route.params.type;
      }
      this.appPath("/work_baby/" + this.type + "&" + e, true);
    },
  },
  mounted() {
    this.tab = this.$js.def.works.baby;
    this.type = this.$route.params.type;
    if (!this.type) {
      this.type = this.tab[0].level;
    }
    this.id = this.$route.params.id || "";
  },
};
</script>
<style lang='less' scoped>
</style>
