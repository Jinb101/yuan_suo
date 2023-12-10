<template>
  <div class="class_4">
    <v-upload-once class="img" v-model="img" @path="onpath"></v-upload-once>
    <h4>宝宝[{{ detail.name }}]的考勤头像</h4>
    <p class="desc">点击上方可进行更换</p>
  </div>
</template>

<script>
export default {
  props: { value: null, ids: [String, Number] },
  data() {
    return {
      img: {},
      up: null,
    };
  },
  computed: {
    detail: {
      get: function get() {
        return this.value;
      },
      set: function set(n) {
        this.$emit("input", n);
      },
    },
    pics() {
      let sex = this.detail.genders + 2;
      let pic = this.detail.base_maps;
      // eslint-disable-next-line
      return pic ? pic : demo.siteConfig.icon(sex, "people");
    },
  },
  watch: {
    detail: {
      handler(n) {
        this.img = { image: this.pics };
        this.$emit("input", n);
      },
      deep: true,
    },
    img: {
      handler() {
        this.init();
      },
      deep: true,
    },
  },
  methods: {
    onpath(v, j) {
      this.up = j;
    },
    init() {
      if (this.img.src) {
        this.$api.http(
          "classstudentface",
          { base_map: this.img.src, c_id: this.ids },
          (e, code, d) => {
            this.up.close = false;
            if (code === 411) {
              this.img = { $reset: true };
              return this.$toast(d.msg);
            }
            this.$toast("变更完成");
            this.detail.base_map = this.img.src;
            this.detail.base_maps = this.img.url;
            this.$emit("end");
          },
          "post",
          false,
          [200, 411]
        );
      }
    },
  },
  mounted() {
    this.detail = this.value;
    this.img = { image: this.pics };
  },
};
</script>
<style lang='less' scoped>
.class_4 {
  padding: 30px 10px;
  h4 {
    padding: 8px;
    text-align: center;
    font-weight: 650;
    margin-top: 10px;
    font-size: 13px;
  }
  .img {
    width: 260px;
    height: 260px;
    border-radius: 50%;
    margin: 0 auto;
    overflow: hidden;
  }
  .desc {
    font-size: 12px;
    color: #ccc;
    padding: 6px 0;
    text-align: center;
  }
}
</style>
