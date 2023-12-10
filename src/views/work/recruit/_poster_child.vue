<template>
  <div class="poster_child">
    <div class="app_top">
      <div class="player">
        <div id="player-detail-video" @click.stop="" v-if="ext.video"></div>
        <van-image
          :src="ext.picture[0]"
          v-else-if="ext.picture && ext.picture.length"
        ></van-image>
      </div>
    </div>
    <!-- <template>
      <x-content></x-content>
      <x-content> 推荐/分享接口 还未调用 </x-content>
      <x-content></x-content>
    </template> -->
    <div class="head">
      <h2>{{ ext.title }}</h2>
      <p class="price">{{ totype(ext) }}</p>
      <div class="content">{{ ext.content }}</div>
    </div>
    <div class="pic">
      <van-image
        v-for="(i, j) in ext.picture"
        :key="j"
        :src="i"
        fit="cover"
      ></van-image>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cid: [String, Number],
  },
  data() {
    return {
      ext: {},
    };
  },
  watch: {
    cid() {
      this.init();
    },
  },
  methods: {
    totype(e) {
      if (+e.type === 1) return "免费";
      if (+e.type === 2) return +e.price + "元";
      return "邀请" + e.invite + "人";
    },
    init() {
      // this.$api.http("posterrecommed", { id: this.cid }, (r) => {
      //   console.log(r);
      // });
      this.$api.http("posterdet", { id: this.cid }, (r) => {
        this.ext = r;
        this.$emit("end", r);
        this.$nextTick(() => {
          if (r.video) {
            // eslint-disable-next-line
            new DEMO_Player({
              // eslint-disable-next-line
              container: demo.$.id("player-detail-video"),
              video: {
                url: r.video,
              },
              mutex: true,
              preload: "none",
            });
          }
        });
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
};
</script>
<style lang='less' scoped>
.poster_child {
  .player {
    height: 200px;
    background-color: #222;
    color: #fff;
  }
  .head {
    padding: 10px;
    font-weight: 650;
    line-height: 1.2;
    h2 {
      font-size: 18px;
    }
    .content {
      font-size: 14px;
    }
    .price {
      text-align: right;
      font-size: 16px;
      color: tomato;
    }
  }
}
</style>
