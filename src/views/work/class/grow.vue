<template>
  <v-view header cover index="400">
    <template #menu>
      <v-c v-model="cls"></v-c>
    </template>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section v-for="(i, j) in item" :key="j" @click.stop="ondetail(i, j)">
        <p class="content">发布内容：{{ i.content }}</p>
        <template v-if="i.picture && i.picture.length">
          <div class="imgs flex fw">
            <div class="img" v-for="(x, y) in i.picture" :key="y + 'c' + j">
              <van-image
                :src="x"
                fit="cover"
                @click.stop="appShowImage(i.picture, y)"
              ></van-image>
            </div>
          </div>
        </template>
        <template v-if="i.video">
          <div class="video">
            <template v-if="i.play">
              <div :id="'player-grow-' + j" @click.stop></div>
            </template>
            <template v-else>
              <div class="poster">
                <van-image :src="poster" fit="cover"></van-image>
                <div class="player" @click.stop="onCreatePlayer(i, j)">
                  <van-icon name="play-circle-o" />
                </div>
              </div>
            </template>
          </div>
        </template>
        <div class="tool van-hairline--top">
          <span class="time">发布时间：{{ appTimeout(i.create_time) }}</span>
          <b>查看详情</b>
        </div>
      </section>
    </v-page>
    <div class="app_btn_add b20" @click="open = true" v-if="!cls.id">
      <div class="add_cover"><van-icon name="plus" /></div>
      <p>发布</p>
    </div>
    <template #fixed>
      <v-f v-model="open" :footer="false" text="发布成长任务" :index="500">
        <v-a @close="onPage(1)"></v-a>
      </v-f>
      <v-f
        v-model="open1"
        :footer="false"
        text="成长任务详情"
        :index="501"
        bgc="#f5f5f5"
      >
        <v-d :param="params" @det="showchild" @check="tosettype"></v-d>
      </v-f>
      <v-f v-model="open2" :footer="false" text="成长任务详情" :index="503">
        <v-d2 :param="params"></v-d2>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vC from "../../private/select_class.vue";
import vF from "../../private/fixed.vue";
import vA from "./_grow_add.vue";
import vD from "./_grow_det.vue";
import vD2 from "./_grow_dets.vue";
export default {
  data() {
    return {
      cls: {},
      item: [],
      // eslint-disable-next-line
      poster: demo.siteConfig.icon("player", "player", ".jpg"),
      player: [],
      open: false, // 发布
      open1: false, // 详情作业
      open2: false, // 详情
      params: {
        id: "",
        type: "",
        tid: "",
      },
    };
  },
  inject: ["appShowImage", "appTimeout", "appPath"],
  watch: {
    "cls.id"() {
      this.onPage(1);
    },
    params: {
      handler(n) {
        if (n.tid) {
          this.showchild(n.tid);
        } else if (n.id) {
          if (!n.type) {
            this.ondetail(n);
          }
        }
      },
      deep: true,
    },
    open1(n) {
      if (!n) {
        this.appPath("/work_grow", true);
        this.params = {
          id: "",
          type: "",
          tid: "",
        };
      }
    },
    open2(n) {
      if (!n) {
        this.params.tid = "";
        this.appPath(
          "/work_grow/" + this.params.id + "&" + this.params.type,
          true
        );
      }
    },
  },
  components: { vC, vF, vA, vD, vD2 },
  methods: {
    tosettype(e) {
      this.params.type = e;
    },
    showchild(e) {
      this.params.tid = e;
      this.open2 = true;
    },
    ondetail(e, index) {
      this.appPath("/work_grow/" + e.id, true);
      this.params.id = e.id;
      this.open1 = true;
    },
    // 创建播放器 播放视频
    onCreatePlayer(e, index) {
      let pic = this.poster;
      e.play = true;
      this.$nextTick(() => {
        if (!e.player) {
          // eslint-disable-next-line
          this.player[index] = new DEMO_Player({
            // eslint-disable-next-line
            container: demo.$.id("player-grow-" + index),
            video: {
              url: e.video,
              pic,
            },
            mutex: true,
            preload: "none",
          });
          this.player[index].play();
        }
      });
    },
    onPage(page, f) {
      this.open = false;
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("grow", { page, class_id: this.cls.id || "" }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(
          e.map((s) => {
            s.play = false;
            return s;
          })
        );
        this.$refs.page.onFinish(e.length < 20);
      });
    },
  },
  mounted() {
    this.params = { id: "", type: "", tid: "", ...this.$route.params };
  },
  destroyed() {
    if (this.player.length) {
      this.player.forEach((k) => {
        if (k.video) {
          k.destroy();
        }
      });
    }
  },
};
</script>
<style lang='less' scoped>
section {
  margin: 10px 5px 0;
  padding: 10px;
  border-radius: 10px;
  background-color: #fff;
  font-size: 15px;
  color: #666;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  .content {
    padding: 10px 0;
    line-height: 1.2;
  }
}
.imgs {
  margin-bottom: 8px;
  .img {
    width: 80px;
    height: 80px;
    margin: 0 10px 10px 0;
    border-radius: 5px;
    overflow: hidden;
  }
}
.video {
  margin-bottom: 8px;
  height: 185px;
  background: #222;
  border-radius: 5px;
  overflow: hidden;
}
.tool {
  padding-top: 5px;
  font-size: 12px;
  display: flex;
  span {
    flex: 1;
  }
  b {
    color: #ccc;
  }
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
