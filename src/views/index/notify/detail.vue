<template>
  <v-view header :text="text" back @on-back="onBack">
    <template #menu>
      <span class="col_green" @click="open = true">查看未读</span>
    </template>
    <x-content></x-content>
    <x-content class="user">
      <div class="flex">
        <span v-if="!my"><van-icon name="manager-o" />{{ ext.name }}</span>
        <span class="last"
          ><van-icon name="underway-o" />{{ $js.timeout(ext.time) }}</span
        >
      </div>
    </x-content>
    <x-content class="cont">
      <div v-html="content"></div>
    </x-content>
    <x-content v-if="imageList.length">
      <van-divider content-position="left">图片</van-divider>
      <v-uploads v-model="imageList" :del="false"></v-uploads>
    </x-content>
    <x-content v-if="fileList.length">
      <van-divider content-position="left">附件</van-divider>
      <v-uploads v-model="fileList" :del="false"></v-uploads>
    </x-content>
    <x-content v-if="iswrite && !my">
      <van-divider content-position="left">签名</van-divider>
      <template v-if="!ext.sign">
        <v-hand ref="hand" v-model="hand" api></v-hand>
      </template>
      <van-image
        v-else
        fit="cover"
        class="hand"
        :src="ext.sign"
        @click="appShowImage(ext.sign)"
      ></van-image>
    </x-content>
    <x-content></x-content>
    <template #fixed>
      <v-fixed
        index="500"
        :text="(openType ? '园所' : '家长') + '未读人员'"
        v-model="open"
        bgc="#f8f7fa"
        :footer="false"
      >
        <template #menu>
          <span @click="openType = !openType" class="col_ash bold"
            >{{ openType ? "家长" : "园所" }}未读</span
          >
        </template>
        <van-empty v-if="!reads.length" description="暂无"></van-empty>
        <section
          v-for="(i, j) in reads"
          :key="j + 's'"
          class="flex reads van-hairline--bottom"
        >
          <x-radius size="40">
            <van-image :src="i.avatar" lazy-load fit="cover"></van-image>
          </x-radius>
          <div class="font">
            <p class="name">{{ i.nickname || i.name }}</p>
            <p v-if="i.group_name">{{ i.group_name }}</p>
          </div>
          <span class="status" :class="{ col_danger: !i.sign }" v-if="iswrite"
            >{{ i.sign ? "已" : "未" }}签名</span
          >
        </section>
      </v-fixed>
    </template>
  </v-view>
</template>

<script>
import vFixed from "../../private/fixed.vue";
import vHand from "../../private/hand.vue";
export default {
  props: {
    my: Boolean,
    detailid: [Number, String],
  },
  components: { vFixed, vHand },
  data() {
    return {
      ext: {},
      imageList: [],
      fileList: [],
      open: false,
      openType: false,
      reads: [],
      hand: {},
    };
  },
  watch: {
    open(n) {
      n && this.onGetReads();
    },
    openType() {
      this.onGetReads();
    },
    hand: {
      handler(n) {
        if (n.data) {
          this.$api.http(
            "noticeWrite",
            { notice_id: this.detailid, sign: n.halfway },
            () => {
              this.$js.message("操作成功");
              this.init();
            }
          );
        }
      },
      deep: true,
    },
  },
  computed: {
    text() {
      if (this.ext.title) {
        return this.ext.title;
      }
      return "通知详情";
    },
    content() {
      if (this.ext.content) {
        return this.ext.content.replace(/\n/g, "<br/>");
      }
      return "";
    },
    iswrite() {
      return +this.ext.is_sign === 1;
    },
  },
  inject: ["appShowImage"],
  methods: {
    onBack() {
      this.$emit("on-close");
    },
    // 获取未读
    onGetReads() {
      let api = this.openType ? "noticeUnread1" : "noticeUnread2";
      this.$api.http(api, { notice_id: this.detailid, status: "0" }, (res) => {
        this.reads = res;
      });
    },
    init() {
      let api = this.my ? "noticeMyDetail" : "noticeDetail";
      this.$api.http(api, { notice_id: this.detailid }, (res) => {
        this.ext = res;
        this.imageList = this.toImageList(res.imgs);
        this.fileList = this.toFileList(res.file);
      });
    },
    toFileList(file) {
      if (!file) return [];
      let arr = (file + "").split(",");
      let ts = this.$js.uploadShow;
      arr = arr.filter((s) => !!s);
      return arr.map((s) => {
        let suffix = s.split(".");
        suffix = suffix[suffix.length - 1];
        return {
          num: 100,
          srcs: s,
          cover: suffix,
          base: ts(suffix),
        };
      });
    },
    toImageList(imgs = []) {
      if (imgs.length) {
        return imgs.map((s) => {
          return {
            num: 100,
            srcs: s.img,
            cover: "img",
          };
        });
      }
      return [];
    },
  },
  mounted() {
    this.init();
  },
  destroyed() {
    // eslint-disable-next-line
    // demo.$session.clear("index-dot");
  },
};
</script>
<style lang='less' scoped>
.cont {
  font-size: 15px;
  line-height: 1.2;
}
.user {
  font-size: 14px;
  line-height: 15px;
  color: rgb(196, 196, 196);
  .van-icon {
    vertical-align: middle;
    margin-right: 2px;
  }
  span {
    flex: 1;
    &.last {
      text-align: right;
    }
  }
}
.hand {
  height: 200px;
  width: 100%;
  border: 1px dashed #ccc;
  box-sizing: border-box;
}
.reads {
  padding: 10px;
  background-color: #fff;
  .font {
    font-size: 12px;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    padding-left: 10px;
    .name {
      font-weight: 650;
      font-size: 15px;
      & + p {
        margin-top: 5px;
        color: #999;
      }
    }
  }
  .status {
    font-size: 12px;
    color: #999;
  }
}
</style>
