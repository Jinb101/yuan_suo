<template>
  <div class="cute_item">
    <van-empty v-if="!item.length"
               description="暂无精彩瞬间"></van-empty>
    <section v-for="(i, j) in list"
             :key="j"
             class="van-hairline--bottom"
             :class="{ pad: pad }"
             @click.stop="onDetail(i)">
      <h2 class="van-ellipsis">{{ i.title || "精彩瞬间" }}</h2>
      <div class="view_video">
        <template v-if="i.play">
          <div :id="'player-' + j"
               @click.stop=""></div>
        </template>
        <template v-else>
          <div class="poster">
            <van-image :src="i.cover[0]"
                       fit="cover"
                       lazy-load></van-image>
            <div class="player"
                 @click.stop="onCreatePlayer(i, j)">
              <van-icon name="play-circle-o" />
            </div>
          </div>
        </template>
      </div>
      <div class="tool flex">
        <span class="time">
          {{ appTimeout(i.create_time, true) }}
        </span>
        <div class="btns">
          <span>
            <van-icon name="eye-o" /><b>{{ i.pageview }}</b>
          </span>
          <template v-if="i.like === 1">
            <span @click.stop="onTagChange({ index: j, ext: i, type: 'unlike' })">
              <van-icon name="like"
                        color="#f38979" />
              <b style="color: #f38979">{{ i.quantity }}</b>
            </span>
          </template>
          <template v-else>
            <span @click.stop="onTagChange({ index: j, ext: i, type: 'like' })">
              <van-icon name="like-o" /><b>{{ i.quantity }}</b>
            </span>
          </template>
        </div>
      </div>
      <v-more v-model="i.open"
              tag
              class="tag_up"
              :item="toTag(i, j)"
              @change="onTagChange"></v-more>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    value: null,
    del: Boolean,
    pad: Boolean,
  },
  data() {
    return {
      list: [],
      player: [],
    };
  },
  inject: ["appTimeout", "appPath"],
  computed: {
    item: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
  },
  watch: {
    item: {
      handler(n) {
        this.init();
        this.$emit("input", n);
      },
      deep: true,
    },
  },
  methods: {
    toTag(e, index) {
      let like = e.like === 1 ? 2 : 0;
      let a = [like, 3];
      if (this.del) {
        a.push(1);
      }
      // eslint-disable-next-line
      return demo.siteConfig.text.tag(a, { index, ext: e });
    },
    onTagChange(e) {
      let edata = e.ext;
      switch (e.type) {
        case "unlike":
        case "like":
          let _like = edata.like === 1;
          this.$api.http("cutestatus", { lovable_id: edata.id }, () => {
            if (_like) {
              this.$set(this.list[e.index], "quantity", edata.quantity - 1);
              this.$set(this.list[e.index], "like", 2);
            } else {
              this.$set(this.list[e.index], "quantity", edata.quantity + 1);
              this.$set(this.list[e.index], "like", 1);
            }
          });
          break;
        case "del":
          this.$js.model("删除确认", "是否删除精彩瞬间", (res) => {
            if (res) {
              this.$api.http("cutedel", { lovable_id: edata.id }, () => {
                this.list.splice(e.index, 1);
                this.$toast("删除成功");
              });
            }
          });
          break;
        case "down":
          window.location.href = edata.video;
          break;
        default:
      }
    },
    onCreatePlayer(e, index) {
      e.play = true;
      this.$nextTick(() => {
        if (!e.player) {
          // eslint-disable-next-line
          this.player[index] = new DEMO_Player({
            // eslint-disable-next-line
            container: demo.$.id("player-" + index),
            video: {
              url: e.video,
              pic: e.cover[0],
            },
            mutex: true,
            preload: "none",
          });
          this.player[index].play();
        }
      });
    },
    onDetail(e) {
      this.$emit("detail", e.id);
      this.appPath("/cute/" + e.id, !this.pad);
    },
    init() {
      let a = JSON.parse(JSON.stringify(this.item));
      this.list = a.map((s) => {
        s.open = false;
        s.play = false;
        return s;
      });
    },
  },
  mounted() {
    this.item = this.value;
    this.init();
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
  position: relative;
  padding: 5px;
  background-color: #fff;
  margin: 0 10px;

  h2 {
    font-size: 15px;
    font-weight: 650;
    padding: 8px 20px 8px 0;
    line-height: 15px;
    height: 31px;
    box-sizing: border-box;
  }

  .view_video {
    height: 195px;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    background-color: #f7f7f7;
  }

  .tool {
    padding: 5px 0;
    line-height: 16px;
    font-size: 12px;

    .time {
      color: #999;
    }

    .btns {
      flex: 1;
      display: flex;
      flex-direction: row-reverse;

      span {
        padding-left: 5px;
        display: flex;
        align-items: center;

        i {
          font-size: 16px;
          margin-right: 5px;
        }

        b {
          min-width: 20px;
        }
      }
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

  &.pad {
    margin: 0;

    .view_video {
      height: 182px;
    }
  }
}

.tag_up {
  top: 8px !important;
}</style>
