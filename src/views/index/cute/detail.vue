<template>
  <div class="cute_detail">
    <div class="view_video">
      <template v-if="play">
        <div :id="'player-9999'" @click.stop=""></div>
      </template>
      <template v-else>
        <div class="poster">
          <van-image :src="det.cover[0]" fit="cover"></van-image>
          <div class="player" @click.stop="onCreatePlayer">
            <van-icon name="play-circle-o" />
          </div>
        </div>
      </template>
    </div>
    <div class="head">
      <div class="flex">
        <h2 class="van-multi-ellipsis--l2">{{ det.title || "精彩瞬间" }}</h2>
        <div class="like">
          <template v-if="det.like === 1">
            <span @click.stop="onLike">
              <van-icon name="like" color="#f38979" />
              <b style="color: #f38979">{{ det.quantity }}</b>
            </span>
          </template>
          <template v-else>
            <span @click.stop="onLike">
              <van-icon name="like-o" /><b>{{ det.quantity }}</b>
            </span>
          </template>
        </div>
      </div>
      <div class="flex">
        <span class="time">
          {{ appTimeout(det.create_time) }}
        </span>
        <span class="preview">
          <van-icon name="eye-o" /><b>{{ det.pageview }}</b>
        </span>
      </div>
    </div>
    <div class="list">
      <h3>相关视频</h3>
      <ul>
        <li
          v-for="(i, j) in list"
          :key="j"
          class="flex van-hairline--bottom"
          @click.stop="onDet(i)"
        >
          <div class="avatar">
            <van-image
              :src="i.cover[0]"
              fit="cover"
              lazy-load
              @click.stop="appShowImage(i.cover[0])"
            ></van-image>
          </div>
          <div class="strong">
            <h4>{{ i.title || "精彩瞬间" }}</h4>
            <div class="tool flex">
              <span class="time">{{ appTimeout(i.create_time) }}</span>
              <span class="preview">
                <van-icon name="eye-o" /><b>{{ i.pageview }}</b>
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: null,
  },
  data() {
    return {
      play: false,
      player: null,
    };
  },
  inject: ["appTimeout", "appShowImage", "appPath"],
  computed: {
    item: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
    det() {
      return this.item.details || {};
    },
    list() {
      return this.item.list || [];
    },
  },
  watch: {
    item: {
      handler(n) {
        if (this.player && this.player.video) {
          this.player.destroy();
        }
        this.play = false;
        this.$emit("input", n);
      },
      deep: true,
    },
  },
  methods: {
    onCreatePlayer() {
      this.play = true;
      this.$nextTick(() => {
        // eslint-disable-next-line
        this.player = new DEMO_Player({
          // eslint-disable-next-line
          container: demo.$.id("player-9999"),
          video: {
            url: this.det.video,
            pic: this.det.cover[0],
          },
          mutex: true,
          preload: "none",
        });
        this.player.play();
      });
    },
    onDet(e) {
      this.appPath("/cute/" + e.id, true);
    },
    onLike() {
      let edata = this.det;
      let _like = edata.like === 1;
      let os = { id: edata.id };
      this.$api.http("cutestatus", { lovable_id: edata.id }, () => {
        if (_like) {
          os.like = 2;
          os.quantity = edata.quantity - 1;
        } else {
          os.like = 1;
          os.quantity = edata.quantity + 1;
        }
        this.$set(this.item.details, "quantity", os.quantity);
        this.$set(this.item.details, "like", os.like);
        this.$emit("onlike", os);
      });
    },
  },
  mounted() {
    this.item = this.value;
  },
};
</script>
<style lang='less' scoped>
.view_video {
  height: 211px;
  position: sticky;
  top: 0;
  z-index: 5;
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
.head {
  padding: 10px;
  background-color: #fff;
  h2 {
    font-weight: 600;
    line-height: 16px;
    font-size: 15px;
    height: 32px;
    width: calc(100% - 50px);
  }
  .flex + .flex {
    margin-top: 5px;
  }
}

.like,
.preview {
  width: 50px;
  display: flex;
  align-items: center;
  font-size: 14px;
  justify-content: center;
}
.time,
.preview {
  font-size: 12px;
  color: #999;
}
.time {
  flex: 1;
}

.list {
  background-color: #fff;
  margin-top: 10px;
  font-size: 15px;
  h3 {
    padding: 10px;
    font-weight: 600;
    border-bottom: 1px solid #f7f7f7;
  }
  li {
    padding: 10px;
    .avatar {
      width: 100px;
      height: 100px;
      background-color: #f7f7f7;
      border-radius: 5px;
      overflow: hidden;
    }
    .strong {
      width: calc(100% - 100px);
      box-sizing: border-box;
      padding-left: 10px;
      padding-bottom: 30px;
      position: relative;
      overflow: hidden;
    }
    .tool {
      position: absolute;
      left: 10px;
      bottom: 0;
      width: calc(100% - 10px);
    }
    h4 {
      padding-top: 5px;
      line-height: 1.2;
    }
  }
}
</style>
