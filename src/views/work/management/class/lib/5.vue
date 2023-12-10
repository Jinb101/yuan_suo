<template>
  <div class="class_5">
    <van-cell title="宝宝姓名" :value="detail.name"></van-cell>
    <van-cell
      title="年级"
      is-link
      :value="class1"
      @click="open1 = !open1"
    ></van-cell>
    <van-cell title="班级" is-link :value="class2" @click="onclass"></van-cell>
    <div class="w60">
      <van-button
        block
        round
        :color="$js.btnColor"
        :disabled="!a2.id"
        @click="onsub"
        >点击转班</van-button
      >
    </div>
    <v-c v-model="a1" :list="t1" text="name" :open="open1"></v-c>
    <v-c v-model="a2" :list="t2" text="nickname" :open="open2"></v-c>
  </div>
</template>

<script>
import vC from "../../../../private/select.vue";
export default {
  props: { value: null, ids: [String, Number] },
  data() {
    return {
      open1: false,
      open2: false,
      t1: [],
      t2: [],
      a1: {},
      a2: {},
    };
  },
  components: { vC },
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
    detail: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
  },
  inject: ["reload"],
  computed: {
    detail: {
      get: function get() {
        return this.value;
      },
      set: function set(n) {
        this.$emit("input", n);
      },
    },
    class1() {
      return this.a1.id ? this.a1.name : "请选择年级";
    },
    class2() {
      return this.a2.id ? this.a2.nickname : "请选择班级";
    },
  },
  methods: {
    onclass() {
      if (!this.a1.id) return this.$toast("请先选择年级");
      this.open2 = !this.open2;
    },
    onsub() {
      let os = {
        group_id: this.a1.id,
        class_id: this.a2.id,
        c_id: this.ids,
        base_map: "",
      };
      this.$api.http("classshift", os, () => {
        this.$toast("转班成功");
        this.$emit("del");
      });
    },
  },
  mounted() {
    this.detail = this.value;
    this.t1 = this.$api.classes();
  },
};
</script>
<style lang='less' scoped>
</style>
