<template>
  <v-view header :text="title">
    <template #menu>
      <span v-if="+active === 3" @click="open = true">更换vr地址</span>
    </template>
    <div class="app_top">
      <van-tabs v-model="active" title-active-color="#38f" @click="ontab">
        <van-tab
          :title="i.t"
          :name="i.v"
          v-for="(i, j) in tab"
          :key="j"
        ></van-tab>
      </van-tabs>
    </div>
    <template v-if="+active === 1">
      <div class="app_frame_content">
        <div v-html="content"></div>
      </div>
    </template>
    <template v-else-if="+active === 2">
      <div class="flex fw imgs">
        <div class="img" v-for="(i, j) in imgs" :key="j">
          <span class="close" @click.stop="ondelimg(i)">
            <van-icon name="cross" />
          </span>
          <van-image
            :src="i.url"
            @click="appShowImage(imgs, j, 'url')"
          ></van-image>
        </div>
        <v-upload-once
          class="img"
          v-model="imgext"
          @path="onPath"
        ></v-upload-once>
      </div>
    </template>
    <template v-else-if="+active === 3">
      <iframe :src="urls" frameborder="0"></iframe>
    </template>
    <template #fixed>
      <v-f v-model="open" :footer="false" text="更改VR地址" bgc="#f5f5f5">
        <van-field
          v-model="url"
          rows="3"
          autosize
          label="VR地址"
          label-width="4em"
          type="textarea"
          maxlength="300"
          placeholder="请输入VR地址"
          show-word-limit
        />
        <div class="w60">
          <van-button
            block
            round
            :color="$js.btnColor"
            :disabled="url === urls"
            @click="onsave"
            >保存</van-button
          >
        </div>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
export default {
  data() {
    return {
      tab: [
        { t: "园所简介", v: "1" },
        { t: "园所荣誉", v: "2" },
        { t: "VR校园", v: "3" },
      ],
      active: "",
      title: "",
      content: "",
      url: "",
      urls: "",
      open: false,
      imgs: [],
      imgext: {},
    };
  },
  components: { vF },
  inject: ["appPath", "appShowImage"],
  methods: {
    ontab() {
      this.appPath("/work_kindergarten/" + this.active, true);
      this.init();
    },
    init() {
      if (+this.active === 1) {
        if (this.content) return 0;
        this.$api.http("kindergartenbrief", { type: "2" }, (r) => {
          this.content = r.content;
        });
      } else if (+this.active === 3) {
        this.$api.http("userorg", { type: 6 }, (r) => {
          if (r.length && r[0].url) {
            this.url = this.urls = r[0].url;
          }
        });
      } else {
        this.initimage();
      }
      this.$nextTick(() => {
        this.$js.wxshare();
      });
    },
    onsave() {
      if (this.url === "") return this.$toast("请输入VR地址");
      this.$api.http("kindergartenadd", { type: 6, url: this.url }, () => {
        this.$toast("更改成功");
        this.urls = this.url;
        this.open = false;
      });
    },
    ondelimg(e) {
      this.$js.modeldel(() => {
        this.$api.http("kindergartendel", { id: e.id }, () => {
          this.$toast("删除成功");
          this.imgs = this.imgs.filter((r) => {
            return r.id !== e.id;
          });
        });
      });
    },
    onPath(e) {
      let url = e.src;
      this.$api.http("kindergartenadd", { type: 1, url }, () => {
        this.$toast("添加成功");
        this.$nextTick(() => {
          this.imgext = { $reset: true, image: "" };
          this.initimage();
        });
      });
    },
    initimage() {
      this.$api.http("kindergartenlist", { type: 1 }, (r) => {
        this.imgs = r;
      });
    },
  },
  mounted() {
    this.active = this.$route.params.type || "1";
    if (this.active > 1) {
      this.ontab();
    } else {
      this.init();
    }
  },
};
</script>
<style lang='less' scoped>
iframe {
  display: block;
  width: 100%;
  height: calc(100% - 44px);
}
.imgs {
  padding: 10px;
  .img {
    position: relative;
    margin: 0 10px 10px 0;
    width: 110px;
    height: 110px;
    &:nth-child(3n) {
      margin-right: 0;
    }
    .close {
      position: absolute;
      right: 0;
      top: 0;
      border-radius: 0 0 0 30px;
      background-color: tomato;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      width: 25px;
      height: 25px;
      z-index: 5;
      text-indent: 1px;
      cursor: pointer;
    }
  }
}
</style>
