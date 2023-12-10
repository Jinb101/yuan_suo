<template>
  <div class="grow_det">
    <van-cell title="状态" :value="state"></van-cell>
    <van-cell title="提交人" :value="ans.chlid_name" v-if="isstate"></van-cell>
    <van-cell title="内容"></van-cell>
    <div class="content">{{ detail.content }}</div>
    <template v-if="pic.length">
      <van-cell title="图片"></van-cell>
      <div class="imgs flex">
        <div class="img" v-for="(i, j) in pic" :key="j">
          <van-image
            :src="i"
            fit="cover"
            @click="appShowImage(pic, j)"
          ></van-image>
        </div>
      </div>
    </template>
    <template v-if="detail.video">
      <van-cell title="视频"></van-cell>
      <div class="video">
        <template v-if="play">
          <div id="player-that" @click.stop></div>
        </template>
        <template v-else>
          <div class="poster">
            <van-image :src="poster" fit="cover"></van-image>
            <div class="player" @click.stop="onCreatePlayer(detail.video)">
              <van-icon name="play-circle-o" />
            </div>
          </div>
        </template>
      </div>
    </template>
    <div class="answer" v-if="isstate">
      <van-cell title="提交内容"></van-cell>
      <p class="content">{{ cont }}</p>
      <template v-if="imgs.length">
        <van-cell title="提交图片"></van-cell>
        <div class="imgs flex">
          <div class="img" v-for="(i, j) in imgs" :key="j + 100">
            <van-image
              :src="i"
              fit="cover"
              @click="appShowImage(imgs, j)"
            ></van-image>
          </div>
        </div>
      </template>
      <template v-if="video">
        <van-cell title="提交视频"></van-cell>
        <div class="video">
          <template v-if="play2">
            <div id="player-this" @click.stop></div>
          </template>
          <template v-else>
            <div class="poster">
              <van-image :src="poster" fit="cover"></van-image>
              <div class="player" @click.stop="onCreatePlayer2(video)">
                <van-icon name="play-circle-o" />
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    param: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  inject: ["appShowImage"],
  watch: {
    param: {
      handler() {
        this.init();
      },
      deep: true,
    },
  },
  computed: {
    state() {
      let s = "";
      if (this.detail.task_answers && this.detail.task_answers.child_id) {
        s = this.detail.task_answers.status * 1 === 1;
      }
      return s ? "已提交" : s === "" ? "未答题" : "已完成";
    },
    pic() {
      return this.detail.picture || [];
    },
    ans() {
      return this.detail.task_answers || {};
    },
    imgs() {
      return this.ans.answer_picture || [];
    },
    video() {
      return this.ans.answer_video || "";
    },
    cont() {
      return this.ans.answer_content || "";
    },
    isstate() {
      return this.state.indexOf("已") >= 0;
    },
  },
  data() {
    return {
      detail: {},
      play: false,
      play2: false,
      // eslint-disable-next-line
      poster: demo.siteConfig.icon("player", "player", ".jpg"),
      player: false,
      player2: false,
    };
  },
  methods: {
    init() {
      this.$api.http(
        "growdet",
        { task_id: this.param.id, child_id: this.param.tid },
        (r) => {
          this.detail = r;
        }
      );
    },
    onCreatePlayer(url) {
      this.play = true;
      let pic = this.poster;
      this.$nextTick(() => {
        // eslint-disable-next-line
        this.player = new DEMO_Player({
          // eslint-disable-next-line
          container: demo.$.id("player-that"),
          video: {
            url,
            pic,
          },
          mutex: true,
          preload: "none",
        });
        this.player.play();
      });
    },
    onCreatePlayer2(url) {
      this.play2 = true;
      let pic = this.poster;
      this.$nextTick(() => {
        // eslint-disable-next-line
        this.player2 = new DEMO_Player({
          // eslint-disable-next-line
          container: demo.$.id("player-this"),
          video: {
            url,
            pic,
          },
          mutex: true,
          preload: "none",
        });
        this.player2.play();
      });
    },
  },
  mounted() {
    this.init();
  },
  destroyed() {
    if (this.player && this.player.video) {
      this.player.destroy();
    }
    if (this.player2 && this.player2.video) {
      this.player2.destroy();
    }
  },
};
</script>
<style lang='less' scoped>
.imgs {
  padding: 10px;
  .img {
    width: 80px;
    height: 80px;
    margin: 0 10px 10px 0;
  }
}
.video {
  margin: 10px;
  height: 180px;
  background-color: #333;
  border-radius: 5px;
  overflow: hidden;
}
.content {
  padding: 10px;
  font-size: 15px;
  line-height: 1.2;
}
.poster {
  height: 100%;
  position: relative;
  .player {
    position: absolute;
    z-index: 5;
    width: 80px;
    height: 80px;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 50px;
  }
}
[id^="player"] {
  height: 100%;
  width: 100%;
  display: block;
}
.answer {
  padding: 10px 0 40px;
  background: rgba(195, 245, 232, 0.2);
}
</style>
