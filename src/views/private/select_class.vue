<template>
  <div class="select_class" :class="{ center: db }">
    <span @click="onClick">{{ title }}</span>
    <v-s v-model="ext" :open="open" :list="list" text="nickname"></v-s>
    <van-icon name="arrow-down" v-if="arrow" />
  </div>
</template>

<script>
import vS from "./select.vue";
export default {
  props: {
    value: null,
    teach: Boolean,
    db: Boolean,
    arrow: Boolean,
    all: Boolean,
  },
  data() {
    return {
      open: false,
      list: [],
      ext: {},
      s: "选择班级",
    };
  },
  watch: {
    class_ext: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
    ext: {
      handler(n) {
        // eslint-disable-next-line
        demo.$local.set("index-class", n);
        this.class_ext = n;
      },
      deep: true,
    },
  },
  computed: {
    class_ext: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
    title() {
      let x = this.ext || {};
      return x.text || x.nickname || this.s;
    },
    allname() {
      return { nickname: "全部班级", id: "all", text: "全部班级" };
    },
  },
  components: { vS },
  methods: {
    onClick() {
      this.open = !this.open;
    },
    init() {
      // eslint-disable-next-line
      let user = demo.$session.get("user", {});
      if (!user.account) {
        this.$emit("created");
        return 0;
      }
      if (user.is_whether !== 1) {
        // if (+user.is_teacher === 1 && +user.multiple_classes === 1) {
        //   this.s = "";
        //   this.$emit("created");
        //   return 0;
        // }
        // if (+user.is_teachers === 1 && +user.multiple_classes === 1) {
        //   this.s = "";
        //   this.$emit("created");
        //   return 0;
        // }
      }
      if (
        +user.multiple_classes > 0 &&
        +user.is_teachers === 1 &&
        +user.is_whether !== 1
      ) {
        // eslint-disable-next-line
        let v = demo.$local.get("index-class-teacher", {});
        if (v.id && !this.all) {
          this.ext = v;
        }
        this.$api.http("getclassteach", {}, (res) => {
          this.list =
            res.length > 1
              ? this.all
                ? [this.allname].concat(res)
                : res
              : res;
          if (!this.ext.id) {
            this.ext = this.list[0];
          }
        });
        // new
      } else {
        // eslint-disable-next-line
        let v = demo.$local.get("index-class", {});
        if (v.id && v.id !== "all" && !this.all) {
          this.ext = v;
        }

        this.$api.http("getClass", {}, (res) => {
          this.list =
            res.length > 1
              ? this.all
                ? [this.allname].concat(res)
                : res
              : res;
          if (!this.ext.id) {
            this.ext = this.list[0];
          }
        });
      }
    },
  },
  mounted() {
    this.class_ext = this.value;
    this.init();
  },
};
</script>
<style lang='less' scoped>
.select_class {
  height: 100%;
  font-size: 14px;
  display: flex;
  align-items: center;
  position: relative;
  &.center > span {
    text-align: center;
    width: 100%;
  }
  .van-icon {
    position: absolute;
    right: 5px;
    top: 0;
    bottom: 0;
    margin: auto;
    height: 14px;
  }
}
</style>
