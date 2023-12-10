<template>
  <div class="class_4">
    <v-upload-once class="img" v-model="img"></v-upload-once>
    <h4>我的考勤头像</h4>
    <p class="desc">点击上方可进行更换</p>
    <div class="showpic" v-if="showpic">
      <van-image :src="showpic"></van-image>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      img: {},
      showpic: "",
      img_once: "",
    };
  },
  watch: {
    img: {
      handler() {
        this.setimg();
      },
      deep: true,
    },
  },
  methods: {
    init() {
      this.$api.http("getconfigonce", { name: "face_settings" }, (r) => {
        this.showpic = r.content;
      });
      this.$api.http("usermyattenpic", {}, (r) => {
        this.img_once = r.base_maps;
        this.img = { image: r.base_maps, src: r.base_map };
      });
    },
    setimg() {
      if (this.img.url) {
        this.$api.http(
          "usermyattenpicset",
          { base_map: this.img.src },
          (e, code, err) => {
            if (code === 411) {
              this.img = { image: this.img_once || "", $reset: true };
              return this.$toast(err.msg);
            }
            this.$toast("设置成功");
          },
          "post",
          true,
          [200, 411]
        );
      }
    },
  },
  mounted() {
    this.init();
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
  .showpic {
    width: 300px;
    height: 300px;
    margin: 30px auto 20px;
  }
}
</style>
