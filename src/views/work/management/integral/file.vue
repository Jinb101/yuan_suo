<template>
  <v-view header>
    <template #menu>
      <span @click="open = true">点击上传</span>
    </template>
    <iframe :src="urls" frameborder="0" v-if="url"></iframe>
    <van-empty v-else description="暂无">
      <van-button size="small" type="info" @click="open = true"
        >点击上传</van-button
      >
    </van-empty>
    <template #fixed>
      <v-f v-model="open" :footer="false" text="上传积分管理制度PDF">
        <van-cell title="点击下方按钮即可上传pdf"></van-cell>
        <x-content></x-content>
        <x-content>
          <v-upload-once
            type="pdf"
            v-model="a"
            @path="onpath"
            class="image"
          ></v-upload-once>
        </x-content>
        <x-content></x-content>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../../private/fixed.vue";
export default {
  data() {
    return {
      url: "",
      open: false,
      a: {},
    };
  },
  computed: {
    urls() {
      let u = this.url;
      // eslint-disable-next-line
      return u ? demo.siteConfig.api.see + "?t=" + u : "";
    },
  },
  components: { vF },
  methods: {
    onpath(e, upload) {
      this.$api.http("integralfileset", { url: e.src }, () => {
        this.$toast("上传成功");
        this.url = e.url;
        this.open = false;
      });
    },
  },
  mounted() {
    this.$api.http("integralfile", {}, (r) => {
      this.url = (r || {}).urls;
    });
  },
};
</script>
<style lang='less' scoped>
iframe {
  display: block;
  width: 100%;
  height: 100%;
}
.image {
  width: 100px;
  height: 100px;
}
</style>
