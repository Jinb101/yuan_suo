<template>
  <v-view header>
    <van-empty v-if="!item.length" description="暂无"></van-empty>
    <section v-for="(i, j) in item" :key="j" class="flex">
      <div class="logo">
        <van-image :src="pic"></van-image>
      </div>
      <div class="f1">
        <h6>{{ i.name }}</h6>
      </div>
      <div class="btn">
        <van-button size="small" type="info" plain @click="down(i)"
          >下载</van-button
        >
        <van-button size="small" type="primary" plain @click="view(i)"
          >预览</van-button
        >
      </div>
    </section>
    <template #fixed>
      <v-f :footer="false" :index="501" text="查看" v-model="open">
        <iframe :src="url" frameborder="0"></iframe>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
export default {
  data() {
    return {
      // eslint-disable-next-line
      pic: demo.siteConfig.uploadType.pdf.src,
      item: [],
      open: false,
      url: "",
    };
  },
  components: { vF },
  methods: {
    down(e) {
      // eslint-disable-next-line
      demo.location(e.url, { target: "open" });
    },
    view(e) {
      // eslint-disable-next-line
      this.url = demo.siteConfig.api.see + "?t=" + e.url;
      this.open = true;
    },
  },
  mounted() {
    this.$api.http("userhelpmanual", {}, (r) => {
      this.item = r;
    });
  },
};
</script>
<style lang='less' scoped>
section {
  padding: 10px 10px 40px;
  margin: 10px;
  position: relative;
  align-items: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-size: 15px;
  border-radius: 20px 5px;
  .logo {
    width: 50px;
    height: 50px;
  }
  .f1 {
    width: calc(100% - 50px);
    box-sizing: border-box;
    padding-left: 10px;
  }
  h6 {
    font-weight: 650;
    padding: 5px 0;
  }
  .btn {
    padding: 0 15px 5px;
    box-sizing: border-box;
    display: flex;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 5;
    .van-button {
      margin-left: 8px;
      min-width: 70px;
    }
  }
}
iframe {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
