<template>
  <v-view header>
    <template #menu>
      <v-c v-model="cls" @created="init"></v-c>
    </template>
    <slot />
    <div class="cont">点击下方可更换奖励素材</div>
    <v-upload-once v-model="img" class="image" @path="onPath"></v-upload-once>
    <div class="btns">
      <van-button
        block
        round
        :color="$js.btnColor"
        @click="appShowImage(img.image ? img.image : img.url)"
        size="small"
        >预览</van-button
      >
    </div>
    <div class="tips">
      <h6>提示</h6>
      <p>点击+或者图片可上传图片</p>
      <p>点击预览可全屏查看图片</p>
    </div>
  </v-view>
</template>

<script>
import vC from "../../private/select_class.vue";
export default {
  data() {
    return {
      img: {},
      cls: {},
    };
  },
  watch: {
    "cls.id"() {
      this.init();
    },
  },
  inject: ["appShowImage"],
  components: { vC },
  methods: {
    init() {
      this.$api.http("rewardrule", { class_id: this.cls.id || "" }, (r) => {
        this.img = { image: r.img, src: r.imgs };
      });
    },
    onPath(e) {
      this.$api.http(
        "rewardruleset",
        { class_id: this.cls.id || "", img: e.src },
        () => {
          this.$toast("更换成功");
        }
      );
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.cont {
  height: 80px;
  line-height: 80px;
  font-size: 13px;
  font-weight: 650;
  text-align: center;
}
.btns {
  padding: 15px 35%;
  margin-top: 15px;
}
.tips {
  padding: 10px;
  color: #ccc;
  h6 {
    padding: 5px 0;
    font-size: 14px;
  }
  p {
    font-size: 13px;
    line-height: 1.5;
  }
}
.image {
  width: 350px;
  margin: 0 auto;
  height: 200px;
}
</style>
