<template>
  <v-f v-model="open" :index="550" :footer="false" :header="false">
    <div class="van-empty">
      <div class="van-empty__image">
        <div class="circle" :style="{ background: icon.color }">
          <van-icon :name="icon.s" />
        </div>
      </div>
      <p class="van-empty__description">{{ title }}</p>
    </div>
    <div class="btn">
      <van-button
        block
        round
        :color="$js.btnColor"
        @click="open = false"
        v-if="!edit"
        >再次添加</van-button
      >
      <van-button block round color="#999" @click="onBack">返回</van-button>
    </div>
  </v-f>
</template>

<script>
import vF from "./fixed.vue";
export default {
  props: {
    status: { type: Boolean, default: true },
    text: String,
    value: null,
    edit: Boolean,
  },
  data() {
    return {};
  },
  computed: {
    open: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
    icon() {
      let a = [
        { s: "success", color: "linear-gradient(45deg,#65b017,#99cc33)" },
        { s: "cross", color: "linear-gradient(45deg,#f38979,#fa5b45)" },
      ];
      return this.status ? a[0] : a[1];
    },
    title() {
      return this.text || "发布成功";
    },
  },
  watch: {
    open(n) {
      this.$emit("input", n);
    },
  },
  components: { vF },
  methods: {
    onBack() {
      if (this.edit) {
        this.open = false;
        this.$emit("change");
        return 0;
      }
      this.$router.back();
    },
  },
  mounted() {
    this.open = this.value;
  },
};
</script>
<style lang='less' scoped>
.circle {
  border-radius: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 100px;
  transform: scale(0.8);
}
.btn {
  padding: 15px 20%;
  .van-button + .van-button {
    margin-top: 20px;
  }
}
.van-empty__description {
  font-size: 18px;
}
</style>
