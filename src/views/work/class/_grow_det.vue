<template>
  <div class="grow_det">
    <div class="app_top">
      <van-tabs v-model="type" title-active-color="#38f" @click="ontabclick">
        <van-tab
          :title="i.t"
          :name="i.v"
          v-for="(i, j) in tab"
          :key="j + '-s'"
        ></van-tab>
      </van-tabs>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section
        v-for="(i, j) in item"
        :key="j"
        class="flex"
        @click="ondet(i, j)"
      >
        <div class="logo">
          <v-a :sex="i.gender"></v-a>
        </div>
        <div class="text">
          <h5>{{ i.name || i.child_name }}</h5>
          <template v-if="+type < 3">
            <p>学号：{{ i.no }}</p>
            <p>出生日期：{{ i.birthday }}</p>
          </template>
        </div>
      </section>
    </v-page>
  </div>
</template>

<script>
import vA from "../../private/avatar.vue";
export default {
  props: {
    param: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  inject: ["appPath"],
  components: { vA },
  data() {
    return {
      tab: [
        { t: "已答题", v: "1" },
        { t: "未答题", v: "2" },
        { t: "已提交", v: "3" },
        { t: "已完成", v: "4" },
      ],
      type: "",
      item: [],
    };
  },
  watch: {
    param: {
      handler() {
        this.init();
      },
      deep: true,
    },
  },
  methods: {
    ontabclick() {
      this.onPage(1);
      this.$emit("check", this.type);
      this.$nextTick(() => {
        this.appPath("/work_grow/" + this.param.id + "&" + this.type, true);
      });
    },
    init() {
      // console.log(this.param);
      if (this.param.type) {
        this.type = this.param.type;
      }
      if (this.param.tid) {
        // this.ondet({ id: this.param.tid });
      }
    },
    ondet(i, j) {
      let id = i.child_id ? i.child_id : i.id;
      this.appPath(
        "/work_grow/" + this.param.id + "&" + this.type + "&" + id,
        true
      );
      this.$emit("det", id);
    },
    onPage(page, f) {
      let status = this.type > 2 ? this.type - 2 : this.type;
      let api = this.type > 2 ? "growtext" : "growquest";
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(api, { page, task_id: this.param.id, status }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
section {
  padding: 10px;
  background-color: #fff;
  margin: 10px 10px 0;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  align-items: center;
  .logo {
    width: 50px;
    height: 50px;
  }
  .text {
    width: calc(100% - 50px);
    box-sizing: border-box;
    padding-left: 10px;
    font-size: 15px;
    h5 {
      font-weight: 650;
      padding: 5px 0;
    }
    p {
      line-height: 1.2;
      color: rgb(173, 173, 173);
    }
  }
}
</style>
