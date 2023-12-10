<template>
  <div class="top_class van-hairline--bottom">
    <van-cell size="large" is-link @click="onClass">
      <template #title>
        {{ label ? "选择班级" : class_name }}
      </template>
      {{ label ? class_name : "" }}
    </van-cell>
    <v-s v-model="item" :open="open" :list="list" text="label"></v-s>
  </div>
</template>

<script>
import vS from "./select.vue";
export default {
  props: {
    value: null,
    change: Boolean,
    label: Boolean,
    unhis: Boolean,
  },
  data() {
    return {
      list: [],
      open: false,
      item: {},
    };
  },
  components: { vS },
  computed: {
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    class_name() {
      return (this.ext || {}).name || "选择班级";
    },
  },
  watch: {
    ext: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
    item: {
      handler(n) {
        let a = {
          id: n.value,
          name: n.label,
        };
        // eslint-disable-next-line
        demo.$local.set("class-change", a);
        this.ext = a;
        this.$nextTick(() => {
          this.$emit("change", a);
        });
      },
      deep: true,
    },
  },
  methods: {
    setclassid(id) {
      let s = () => {
        let v =
          this.list.filter((r) => {
            return +r.value === +id;
          })[0] || {};
        if (v.value) {
          this.ext = { id: v.value, name: v.label };
          this.$nextTick(() => {
            this.toemit(this.ext);
          });
        }
      };
      if (id) {
        if (this.list.length) {
          s();
        } else {
          this.init(
            null,
            () => {
              s();
            },
            true
          );
        }
      }
    },
    toemit(v) {
      this.$emit("change", v);
    },
    onClass() {
      if (this.list.length) {
        this.open = !this.open;
      } else {
        this.init(null, () => {
          this.open = !this.open;
        });
      }
    },
    init(q, fn, flag) {
      // eslint-disable-next-line
      let user = demo.$session.get("user", {});
      if (
        +user.multiple_classes > 0 &&
        +user.is_teachers === 1 &&
        +user.is_whether !== 1
      ) {
        this.$api.http("getclassteach", {}, (res) => {
          let e = res.map((s) => {
            return { label: s.nickname, value: s.id, n: 1 };
          });
          if (!e.length) {
            this.list = [];
            if (fn) {
              fn();
            }
            return this.noclassitem();
          }
          this.list = e;
          if (this.change && !flag) {
            let v = this.list[0];
            this.ext = { id: v.value, name: v.label };
            this.$nextTick(() => {
              this.toemit(this.ext);
            });
          }
          if (fn) {
            fn();
          }
        });
        // new
      } else {
        this.$api.http("getClass", {}, (r) => {
          let e = r.map((s) => {
            return {
              // label: s.nickname + (s.parents_count < 1 ? "(无宝宝)" : ""),
              label: s.nickname,
              value: s.id,
              // disabled: s.parents_count < 1,
              n: s.parents_count < 1 ? "0" : "1",
            };
          });
          if (!e.length) {
            this.list = [];
            if (fn) {
              fn();
            }
            return this.noclassitem();
          }
          // eslint-disable-next-line
          this.list = demo.array(e).sort("n").reverse();
          if (this.change) {
            let v = this.list[0];
            this.ext = { id: v.value, name: v.label };
            this.$nextTick(() => {
              this.toemit(this.ext);
            });
          }
          if (fn) {
            fn();
          }
        });
      }
    },
    noclassitem() {
      if (this.change) {
        this.toemit({});
      }
    },
  },
  mounted() {
    this.ext = this.value;
    if (this.unhis) {
      this.init();
    } else {
      // eslint-disable-next-line
      let ids = demo.$local.get("class-change", {});
      if (ids.id) {
        this.ext = ids;
      } else {
        this.init();
      }
    }
  },
};
</script>
<style lang='less' scoped>
.top_class {
  position: sticky;
  top: 0;
  z-index: 78;
}
</style>
