<template>
  <div class="school_det">
    <transition name="van-slide-down">
      <div class="app_top" v-if="index >= 0">
        <div class="video_box">
          <template v-if="play">
            <div id="player-detail-school" @click.stop></div>
          </template>
          <template v-else>
            <div class="poster">
              <div class="player" @click.stop="onCreatePlayer(det.video)">
                <van-icon name="play-circle-o" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </transition>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section
        v-for="(i, j) in item"
        :key="j"
        class="flex"
        @click="index = j"
        :class="{ active: index === j }"
      >
        <div class="logo">
          <van-image :src="tologo(i)" fit="cover"></van-image>
        </div>
        <div class="text">{{ i.head }}</div>
      </section>
    </v-page>
  </div>
</template>

<script>
export default {
  props: {
    ids: [String, Number],
  },
  data() {
    return {
      item: [],
      index: -1,
      det: {},
      play: false,
      player: null,
    };
  },
  watch: {
    index(n) {
      this.det = n > -1 ? this.item[n] : {};
      if (this.play && this.player && this.det.video) {
        this.player.switchVideo({ url: this.det.video });
      }
    },
  },
  methods: {
    onCreatePlayer(video) {
      this.play = true;
      this.$nextTick(() => {
        if (!this.player) {
          // eslint-disable-next-line
          this.player = new DEMO_Player({
            // eslint-disable-next-line
            container: demo.$.id("player-detail-school"),
            video: {
              url: video,
              pic: "",
            },
            mutex: true,
            preload: "none",
          });
          this.player.play();
        }
      });
    },
    tologo(e) {
      return (e.schoolroom || {}).cover || "";
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "userschooldir",
        { page, schoolroom_id: this.ids, limit: 50 },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          this.item = this.item.concat(e);
          this.$refs.page.onFinish(e.length < 20);
        }
      );
    },
  },
  mounted() {},
  destroyed() {
    if (this.player && this.player.video) {
      this.player.destroy();
    }
  },
};
</script>
<style lang='less' scoped>
section {
  padding: 10px;
  .logo {
    width: 100px;
    height: 60px;
    border-radius: 5px;
    overflow: hidden;
  }
  .text {
    width: calc(100% - 60px);
    box-sizing: border-box;
    padding-left: 10px;
    font-size: 15px;
    display: flex;
    align-items: center;
  }
  &.active .text {
    color: #38f;
  }
}
.video_box {
  height: 210px;
  background-color: #232323;
  overflow: hidden;
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
</style>
