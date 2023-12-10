<template>
  <div class="class_card" :style="cover" @click.stop="onclick">
    <p class="van-ellipsis">{{ title }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    type: [String, Number],
  },
  data() {
    return {
      // eslint-disable-next-line
      clspic: demo.siteConfig.icon("class", "private"),
    };
  },
  computed: {
    cover() {
      return {
        background: "url(" + this.clspic + ") no-repeat 0 0 transparent scroll",
        "background-size": "100% 100%",
      };
    },
  },
  methods: {
    onclick() {
      this.$emit("tap", this.type);
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.class_card {
  width: 117px;
  height: 50px;
  position: absolute;
  right: 0;
  top: 5px;
  transform: scale(0.7) translateY(-15%) translateX(15%);
  box-sizing: border-box;
  color: #fff;
  font-size: 13px;
  padding: 15px 30px 0 25px;
}
</style>
