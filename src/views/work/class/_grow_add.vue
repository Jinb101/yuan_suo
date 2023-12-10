<template>
  <div class="grow_adds">
    <van-field
      v-model="message"
      rows="2"
      autosize
      label="成长内容"
      type="textarea"
      maxlength="225"
      placeholder="请输入成长内容"
      show-word-limit
      label-width="5em"
    />
    <van-cell title="图片" label="可选，最大可上传9张"></van-cell>
    <div class="pad">
      <v-uploads v-model="img">
        <div class="image">
          <v-upload
            more
            moreLength="9"
            @on-loading="onImagePath"
            @on-path="onImagePath"
          >
          </v-upload>
        </div>
      </v-uploads>
    </div>
    <van-cell title="视频" label="可选，建议视频长度控制在2分钟内"></van-cell>
    <div class="pad">
      <v-upload-once class="pic2" type="video" v-model="vio"></v-upload-once>
    </div>
    <div class="w60">
      <van-button block round :color="$js.btnColor" @click="onsave"
        >发布</van-button
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "",
      img: [],
      vio: {},
    };
  },
  methods: {
    onImagePath(e, v) {
      this.img = v;
    },
    onsave() {
      if (this.message === "") return this.$toast("请填写成长任务明细");
      this.$api.http(
        "growadd",
        {
          content: this.message,
          picture: this.img
            .map((s) => {
              return s.src;
            })
            .join(","),
          video: this.vio.src || "",
        },
        () => {
          this.$toast("发布成功");
          this.$emit("close");
        }
      );
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.pad {
  padding: 10px;
}
.image {
  width: 100px;
  height: 100px;
}
.pic2 {
  width: 160px;
  height: 90px;
}
</style>
