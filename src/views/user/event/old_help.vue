<template>
  <v-view header>
    <div class="app_top">
      <v-s v-model="search" @search="onPage(1)"></v-s>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <van-cell
        :title="i.problem"
        is-link
        :key="j"
        v-for="(i, j) in item"
        @click="ondet(i.problem_id)"
      ></van-cell>
    </v-page>
    <template #fixed>
      <v-f v-model="open" :footer="false" :text="detail.problem">
        <template v-if="detail.video">
          <div class="app_top">
            <div class="video_box">
              <template v-if="play">
                <div id="player-detail-help" @click.stop></div>
              </template>
              <template v-else>
                <div class="poster">
                  <div
                    class="player"
                    @click.stop="onCreatePlayer(detail.video)"
                  >
                    <van-icon name="play-circle-o" />
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
        <div class="app_frame_content" v-html="detail.content"></div>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vS from "../../private/search.vue";
import vF from "../../private/fixed.vue";
export default {
  data() {
    return {
      search: "",
      item: [],
      open: false,
      detail: {},
      play: false,
      player: null,
    };
  },
  watch: {
    open(n) {
      if (!n) {
        this.appPath("/event_help", true);
      }
    },
  },
  inject: ["appPath"],
  components: { vS, vF },
  methods: {
    onCreatePlayer(video) {
      this.play = true;
      this.$nextTick(() => {
        if (!this.player) {
          // eslint-disable-next-line
          this.player = new DEMO_Player({
            // eslint-disable-next-line
            container: demo.$.id("player-detail-help"),
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
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("userhelp", { page, problem: this.search }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
    ondet(problem_id) {
      this.appPath("/event_help/" + problem_id, true);
      this.$api.http("userhelpdet", { problem_id }, (r) => {
        this.detail = r;
        this.open = true;
      });
    },
    init() {
      this.$api.http("userhelptype", {}, (r) => {
        console.log(r);
      });
    },
  },
  mounted() {
    this.init();
    // userhelp
    let id = this.$route.params.id;
    if (id > 0) {
      this.ondet(id);
    }
  },
  destroyed() {
    if (this.player && this.player.video) {
      this.player.destroy();
    }
  },
};
</script>
<style lang='less' scoped>
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
