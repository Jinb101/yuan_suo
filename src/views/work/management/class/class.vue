<template>
  <v-view header>
    <div class="app_top">
      <v-t :num="1"></v-t>
      <v-s v-model="val" @search="onPage(1)"></v-s>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <div class="app_section">
        <section
          v-for="(i, j) in item"
          :key="j"
          class="flex"
          @click="ondetail(i)"
        >
          <div class="logo" @click.stop><v-a :sex="i.gender"></v-a></div>
          <div class="text">
            <h6>{{ i.name }}</h6>
            <p>学号：{{ i.no }}</p>
            <p>所在班级：{{ i.nickname }}</p>
          </div>
        </section>
      </div>
    </v-page>
    <template #fixed>
      <v-f v-model="open" :footer="false" text="学生操作" @on-cover="oncover">
        <v-c-m
          :ids="id"
          v-model="detail"
          :scover="scover"
          @del="ondelitem"
        ></v-c-m>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../../private/fixed.vue";
import vA from "../../../private/avatar.vue";
import vS from "../../../private/search.vue";
import vC from "../../../private/select.vue";
import vCM from "./_class_menu.vue";
import vT from "./_tabmenu.vue";
export default {
  data() {
    return {
      item: [],
      val: "",
      open: false, // 控制vcm
      id: "",
      detail: {},
      scover: false,
    };
  },
  watch: {
    open(n) {
      if (!n) {
        this.appPath("/management_classsplit", true);
      }
    },
  },
  computed: {},
  inject: ["appPath"],
  components: { vF, vA, vS, vC, vCM, vT },
  methods: {
    oncover(e) {
      this.scover = e;
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("classsplitlist", { page, name: this.val }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
    ondetail(e) {
      this.id = e.id;
      this.appPath("/management_classsplit/" + e.id, true);
      this.open = true;
    },
    ondelitem(id) {
      this.item = this.item.filter((r) => {
        return +r.id !== +id;
      });
      this.open = false;
    },
  },
  mounted() {
    this.id = this.$route.params.id || "";
    if (this.id > 0) {
      this.ondetail({ id: this.id });
    }
  },
};
</script>
<style lang='less' scoped>
</style>
