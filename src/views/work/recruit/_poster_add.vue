<template>
  <div class="poster_add">
    <van-field
      label="标题"
      placeholder="请输入标题"
      maxlength="66"
      v-model="os.title"
    />
    <van-cell title="图片介绍上传"></van-cell>
    <x-content>
      <v-uploads v-model="imgs">
        <div class="image">
          <v-upload
            more
            moreLength="9"
            @on-path="onpath"
            @on-loading="onpath"
          ></v-upload>
        </div>
      </v-uploads>
    </x-content>
    <van-cell title="视频"></van-cell>
    <x-content>
      <v-upload-once
        class="video"
        type="video"
        v-model="videos"
      ></v-upload-once>
    </x-content>
    <van-field label="推广类型" readonly>
      <template #button>
        <van-radio-group v-model="os.type" direction="horizontal">
          <van-radio name="1">免费</van-radio>
          <van-radio name="2">付费</van-radio>
          <van-radio name="3">邀请</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <van-field
      label="价格"
      placeholder="请输入推广价格"
      type="number"
      v-if="+os.type === 2"
      v-model="os.price"
      required
    >
      <template #button> 元 </template>
    </van-field>
    <van-field
      label="邀请人数"
      placeholder="请输入邀请人数"
      type="number"
      v-model="os.invite"
      v-if="+os.type === 3"
      required
    >
      <template #button> 个 </template>
    </van-field>
    <van-field label="是否推荐" readonly>
      <template #button>
        <van-radio-group v-model="os.status" direction="horizontal">
          <van-radio name="1">推荐</van-radio>
          <van-radio name="0">不推荐</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <van-field
      v-model="os.content"
      rows="2"
      autosize
      label="内容"
      type="textarea"
      maxlength="255"
      placeholder="请输入内容"
      show-word-limit
    />
    <div class="w60">
      <van-button block round :color="$js.btnColor" @click="onsub">{{
        os.id ? "编辑" : "发布"
      }}</van-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    edit: Boolean,
    ext: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      os: {
        type: "1",
        status: "1",
        content: "",
        invite: "",
        price: "",
        video: "",
        picture: "",
        title: "",
      },
      imgs: [],
      videos: {},
    };
  },
  methods: {
    setext() {
      if (!this.edit) return 0;
      let v = {};
      for (let i in this.os) {
        v[i] = this.ext[i];
      }
      v.picture = this.ext.pictures;
      v.video = this.ext.videos;
      v.id = this.ext.id;
      if (v.picture) {
        let p = this.ext.pictures.split(",");
        this.imgs = this.ext.picture.map((s, v) => {
          return {
            srcs: s,
            src: p[v],
            base: s,
            old: true,
            cover: "img",
          };
        });
      }
      if (v.video) {
        this.videos = {
          // eslint-disable-next-line
          image: demo.siteConfig.uploadType.video.src,
          src: v.video,
        };
      }
      this.os = JSON.parse(JSON.stringify(v));
    },
    onpath(e, v) {
      this.imgs = v;
    },
    onsub() {
      let os = { ...this.os };
      os.picture = this.imgs
        .map((s) => {
          return s.src;
        })
        .join(",");
      os.video = this.videos.src;
      this.$api.http("posteradd", os, () => {
        this.$toast((os.id ? "编辑" : "发布") + "成功");
        this.$emit("end");
      });
    },
  },
  mounted() {
    this.setext();
  },
};
</script>
<style lang='less' scoped>
.image {
  width: 100px;
  height: 100px;
}
.video {
  width: 178px;
  height: 100px;
}
</style>
