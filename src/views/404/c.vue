<template>
  <v-view header>
    <input type="file" name="" accept="video/*" id="" />
    <!-- <x-content>
      <h6 class="app_title6">方形</h6>
      <v-a v-model="list">
        <div class="image">
          <v-c
            ids="a1"
            more
            @on-loading="onImageLoading"
            @on-path="onImagePath"
            type="word"
          ></v-c>
        </div>
      </v-a>
    </x-content>
    <x-content>
      <h6 class="app_title6">横向</h6>
      <div class="image1">
        <v-c ids="a2" type="video" @on-path="onvideo"></v-c>
      </div>
    </x-content>
    <x-content>
      <h6 class="app_title6">纵向</h6>
      <div class="image2">
        <v-c></v-c>
      </div>
    </x-content>
    <x-content>
      <h6 class="app_title6">测试图片base64</h6>
      <v-upload-once
        class="image"
        noapi
        @base64="onbase64"
        v-model="a"
      ></v-upload-once>
    </x-content> -->
  </v-view>
</template>

<script>
/* eslint-disable */
import vC from "../public/upload.vue";
import vA from "../public/uploads.vue";
export default {
  data() {
    return {
      list: [],
      a: {},
    };
  },
  components: { vC, vA },
  methods: {
    onbase64(e) {
      console.log(e);
    },
    onvideo(e) {
      console.log(e);
    },
    onImageLoading(ext, list, index) {
      this.list = list;
    },
    onImagePath(ext, list, index) {
      this.list = list;
      console.log(list, "success", index);
    },
    init() {
      let toShow = (key) => {
        demo.$vx.start(key, (res) => {
          if (res.code) {
            demo.$vx.imageFile((rej) => {
              console.log(rej);
            }, 1);
          } else {
            console.log(res);
          }
        });
      };
      let key = demo.$local.get("app_wx", {});
      if (!key.into_time) {
        this.$api.http("wx", {}, (res) => {
          // eslint-disable-next-line
          demo.$local.set("app_wx", {
            into_time: Date.now() + 30e6,
            ...res,
          });
          toShow(res);
        });
      } else {
        toShow(key);
      }
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.image {
  width: 120px;
  height: 120px;
}
.image1 {
  width: 120px;
  height: 68px;
}
.image2 {
  width: 120px;
  height: 215px;
}
</style>
