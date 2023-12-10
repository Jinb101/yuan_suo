<template>
  <div class="list_add">
    <template v-if="detail.$type">
      <van-field
        label="班级名称"
        placeholder="请输入班级名称"
        required
        label-width="5em"
        v-model="os.nickname"
      />
      <van-field
        label="班级类型"
        placeholder="请选择班级类型"
        required
        readonly
        right-icon="arrow"
        input-align="right"
        label-width="5em"
        @click="open = !open"
        v-model="s1.text"
      />
      <van-field
        label="班级容量"
        placeholder="请输入班级容量"
        required
        type="digit"
        label-width="5em"
        v-model="os.capacity"
      >
        <template #button> 人 </template>
      </van-field>
      <van-cell title="选择班主任" value="仅限1人" is-link></van-cell>
      <v-p v-model="s2" :max="1" nome></v-p>
      <van-cell title="选择老师" value="最多10人" is-link></van-cell>
      <v-p v-model="s3" :max="10" nome></v-p>
      <v-s :open="open" v-model="s1" :list="t1" text="name"></v-s>
      <div class="w80">
        <van-button block round :color="$js.btnColor" @click="onsubmit"
          >确认{{ btntext }}</van-button
        >
      </div>
    </template>
    <van-empty v-else description="暂未操作"></van-empty>
  </div>
</template>

<script>
import vS from "../../../private/select.vue";
import vP from "../../../private/people.vue";
export default {
  props: {
    value: null,
  },
  data() {
    return {
      t1: [],
      open: false,
      s1: {},
      s2: [],
      s3: [],
      os: {
        capacity: "",
        class_id: "",
        leader_id: "",
        nickname: "",
        staff_id: "",
        type: "",
      },
      // eslint-disable-next-line
      avatar: demo.siteConfig.icon("10004", "people"),
    };
  },
  components: { vS, vP },
  computed: {
    btntext() {
      return this.detail.$type === "add" ? "添加" : "编辑";
    },
    detail: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
  },
  watch: {
    detail: {
      handler(v) {
        this.$emit("input", v);
      },
      deep: true,
    },
    s1: {
      handler(n) {
        this.os.type = n.id;
      },
      deep: true,
    },
    s2: {
      handler(n) {
        if (n[0]) {
          this.os.leader_id = n[0].id;
        }
      },
      deep: true,
    },
    s3: {
      handler(n) {
        if (n.length) {
          this.os.staff_id = n
            .map((s) => {
              return s.id;
            })
            .join(",");
        }
      },
      deep: true,
    },
  },
  methods: {
    onsubmit() {
      let os = { ...this.os };
      let api = "classesadd";
      if (this.detail.$type === "edit") {
        os.class_id = this.detail.id;
        api = "classesedit";
      }
      this.$api.http(api, os, () => {
        this.$toast(this.btntext + "成功");
        this.$emit(
          "end",
          this.retos(os),
          this.detail.$type === "add" ? -1 : this.detail.$index
        );
      });
    },
    retos(r) {
      let v = JSON.parse(JSON.stringify(r));
      if (this.detail.$type === "add") return {};
      delete v.class_id;
      return {
        ...v,
        type: this.s1.text,
        class_type: this.s1.id,
        leader_id: (this.s2[0] || {}).id,
        name: (this.s2[0] || {}).name,
        staff: this.s3,
      };
    },
    init() {
      if (this.detail.$type === "edit") {
        this.os.capacity = this.detail.capacity;
        this.os.nickname = this.detail.nickname;
        this.s1 = { text: this.detail.type, id: this.detail.class_type };
        this.s2 = [
          {
            id: this.detail.leader_id,
            name: this.detail.name,
            avatar: this.avatar,
          },
        ];
        this.s3 = this.detail.staff || [];
      }
    },
  },
  mounted() {
    this.detail = this.value;
    this.t1 = this.$api.classes();
    this.init();
  },
};
</script>
<style lang='less' scoped>
</style>
