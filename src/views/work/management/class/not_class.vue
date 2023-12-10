<template>
  <v-view header>
    <div class="app_top">
      <v-t :num="2"></v-t>
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
            <span class="status">点击分班</span>
          </div>
        </section>
      </div>
    </v-page>
    <template #fixed>
      <v-f v-model="open" :footer="false" text="分班操作">
        <van-cell title="宝宝姓名" :value="detail.name"></van-cell>
        <van-cell
          title="年级"
          is-link
          :value="class1"
          @click="open1 = !open1"
        ></van-cell>
        <van-cell
          title="班级"
          is-link
          :value="class2"
          @click="onclass"
        ></van-cell>
        <div class="w60">
          <van-button
            block
            round
            :color="$js.btnColor"
            :disabled="!a2.id"
            @click="onsubmit"
            >确认转入</van-button
          >
        </div>
      </v-f>
      <v-c v-model="a1" :list="t1" text="name" :open="open1"></v-c>
      <v-c v-model="a2" :list="t2" text="nickname" :open="open2"></v-c>
    </template>
  </v-view>
</template>

<script>
import vF from "../../../private/fixed.vue";
import vA from "../../../private/avatar.vue";
import vS from "../../../private/search.vue";
import vC from "../../../private/select.vue";
import vT from "./_tabmenu.vue";
export default {
  data() {
    return {
      item: [],
      val: "",
      open: false,
      detail: {},
      open1: false,
      open2: false,
      t1: [],
      t2: [],
      a1: {},
      a2: {},
    };
  },
  watch: {
    a1: {
      handler(n) {
        this.a2 = {};
        this.t2 = [];
        this.$api.http("getclassonce", { g_id: n.id }, (r) => {
          this.t2 = r;
        });
      },
      deep: true,
    },
    open(n) {
      if (!n) {
        this.appPath("/management_classnot", true);
        this.detail = {};
      }
    },
  },
  computed: {
    class1() {
      return this.a1.id ? this.a1.name : "请选择年级";
    },
    class2() {
      return this.a2.id ? this.a2.nickname : "请选择班级";
    },
  },
  inject: ["appPath"],
  components: { vF, vA, vS, vC, vT },
  methods: {
    onsubmit() {
      let os = {
        group_id: this.a1.id,
        class_id: this.a2.id,
        c_id: this.detail.id,
        base_map: "",
      };
      this.$api.http("classsplit", os, () => {
        this.$toast("成功分班");
        this.open = false;
        this.item = this.item.filter((r) => {
          return r.id !== os.c_id;
        });
        this.a1 = this.a2 = {};
      });
    },
    onclass() {
      if (!this.a1.id) return this.$toast("请先选择年级");
      this.open2 = !this.open2;
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("classnotlist", { page, name: this.val }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
    ondetail(e) {
      this.detail = e;
      this.open = true;
      this.appPath("/management_classnot/" + e.id, true);
    },
  },
  mounted() {
    this.t1 = this.$api.classes();
  },
};
</script>
<style lang='less' scoped>
</style>
