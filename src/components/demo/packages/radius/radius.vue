<template>
  <div class="x_radius" :style="styls" :class="[{ bef: before }]">
    <div v-if="name" class="icon">
      <i class="van-icon" :class="'van-icon-' + name"></i>
    </div>
    <div
      class="div"
      v-else-if="$slots.default"
      :class="[{ cover: cover }, { center: center }]"
    >
      <span class="cover" v-if="bgc" :style="bgcstyle"></span>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "XRadius",
  componentName: "XRadius",
  props: {
    size: { type: [String, Number], default: 50 },
    before: { type: Boolean, default: false },
    rem: { type: Boolean, default: true },
    name: { type: String, default: "" },
    color: {
      type: [Array, String],
    },
    cover: { type: Boolean, default: true },
    center: Boolean,
    bgc: Boolean,
  },
  data() {
    return {};
  },
  computed: {
    styls() {
      let a = (this.size + "").indexOf("px");
      let h = a >= 0 ? this.size : this.size + "px";
      if (this.rem) {
        h = +h.replace("px", "") / 37.5 + "rem";
      }
      let os = {
        width: h,
        height: h,
        "line-height": h,
      };
      let type = Object.prototype.toString.call(this.color);
      let col =
        type === "[object String]" || type === "[object Undefined]"
          ? [this.color]
          : [...this.color];
      if (col.length) {
        let v = ["135deg", ...col];
        if (v.length === 2) {
          v.splice(1, 0, "#fff");
        }
        os.background = "linear-gradient(" + v.join(",") + ")";
      }
      return os;
    },
    bgcstyle() {
      if (!this.bgc) return {};
      let type = Object.prototype.toString.call(this.color);
      let col =
        type === "[object String]" || type === "[object Undefined]"
          ? [this.color]
          : [...this.color];
      if (col.length) {
        let color = [col[0], "rgba(0,0,0,0) 55%"];
        return {
          background: "linear-gradient(135deg," + color.join(",") + ")",
        };
      }
      return {};
    },
  },
  methods: {},
  mounted() {},
};
</script>
<style lang='less' scoped>
.div.center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.div .cover {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}
</style>
