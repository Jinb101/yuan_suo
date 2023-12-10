<template>
  <v-view header text="发布" bgc="#f7f7f7" index="450">
    <van-cell title="视频描述" />
    <van-field
      v-model="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="35"
      placeholder="请输入内容,如：都要被宝宝萌到了"
      show-word-limit
    />
    <div class="br"></div>
    <van-cell
      title="视频上传"
      label="每次只能上传一个视频,建议横屏拍摄,30秒以内"
    />
    <div class="upl">
      <v-upload-once class="image" type="video" v-model="vio"></v-upload-once>
    </div>
    <van-cell
      title="视频封面"
      label="(可选)展示视频封面,不传时默认截取视频第一帧"
    />
    <div class="upl">
      <v-upload-once class="image" v-model="pic"></v-upload-once>
    </div>
    <div class="brs"></div>
    <div class="btn">
      <van-button block :color="$js.btnColor" @click="onSubmit"
        >发布</van-button
      >
    </div>
    <template #fixed>
      <v-c v-model="open"></v-c>
    </template>
  </v-view>
</template>

<script>
import vC from "../../private/send_status.vue";
export default {
  data() {
    return {
      message: "",
      vio: {},
      pic: {},
      open: false,
    };
  },
  watch: {
    open(n) {
      if (!n) {
        this.reload();
      }
    },
  },
  inject: ["reload"],
  components: { vC },
  methods: {
    onSubmit() {
      let os = {
        type: 2,
        title: this.message,
        cover: [this.pic.src],
        video: this.vio.src,
      };
      this.$api.http("cuteadd", os, () => {
        this.$toast("添加成功");
        this.open = true;
      });
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.br {
  padding: 1px;
}
.upl {
  background-color: #fff;
  padding: 10px;
  margin-bottom: 2px;
}
.image {
  width: 100px;
  height: 100px;
}
.btn {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 50;
}
.brs {
  padding-bottom: 50px;
}
</style>
