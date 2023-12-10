<template>
  <div class="audio">
    <div class="clear">
      <div class="header_cover header_cover_2">
        <span class="a"></span>
        <span class="b"></span>
      </div>
    </div>
    <div class="tab flex" v-if="tab.length > 1">
      <section :class="{ active: type === 'mp3' }" @click="once = tab[0]">
        吟诵音频
      </section>
      <section :class="{ active: type === 'mp4' }" @click="once = tab[1]">
        吟诵视频
      </section>
    </div>
    <div class="plays">
      <template v-if="type === 'mp3'">
        <div class="mp3">
          <img :src="pic" alt="" class="db_image" @error="onerror" />
          <div class="player_pause" @click="onplayaudio">
            <van-icon :name="player3 ? 'pause' : 'play'" />
          </div>
        </div>
      </template>
      <template v-else-if="type === 'mp4'">
        <div class="mp4">
          <iframe
            :src="framesrc"
            frameborder="0"
            class="db_image"
            allowfullscreen="allowfullscreen"
            mozallowfullscreen="mozallowfullscreen"
            msallowfullscreen="msallowfullscreen"
            oallowfullscreen="oallowfullscreen"
            webkitallowfullscreen="webkitallowfullscreen"
            v-if="framesrc"
          ></iframe>
          <p class="error">暂未配置吟诵视频</p>
        </div>
      </template>
    </div>
    <div
      class="cont demo_scrollbar"
      :class="{ c4: type === 'mp4' }"
      v-html="once.content"
    ></div>
    <slot />
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    value: null,
    index: [String, Number],
  },
  computed: {
    i: {
      get: function () {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
  },
  watch: {
    i: {
      handler(v) {
        this.$emit("input", v);
      },
      deep: true,
    },
    once: {
      handler(n) {
        this.type = n.type || "mp3";
        this.pic = n.pic || this.defaultpic;
        this.framesrc = n.src
          ? demo.siteConfig.api.h5 + "player/?url=" + n.src + "&pic=" + this.pic
          : "";
        this.ondestroyaudio();
      },
      deep: true,
    },
  },
  data() {
    return {
      pic: "",
      player3: false,
      audiodom: null,
      aid: "a" + demo.$random.vars(8),
      framesrc: "",
      type: "mp3",
      defaultpic: demo.siteConfig.icon("player", "player", ".jpg"),
      once: {},
      tab: [],
      active: "",
    };
  },
  methods: {
    ondestroyaudio() {
      let a = document.getElementById(this.aid);
      if (a) {
        demo.js("#" + this.aid).remove();
      }
      this.player3 = false;
      this.audiodom = null;
    },
    onplayaudio() {
      if (this.audiodom) {
        if (this.player3) {
          this.audiodom.pause();
        } else {
          this.audiodom.play();
        }
        return 0;
      }
      this.ondestroyaudio();
      let a = demo._div("audio");
      a.src = this.once.src;
      let id = this.aid;
      a.id = id;
      document.body.appendChild(a);
      this.audiodom = document.getElementById(id);
      this.audiodom.addEventListener("error", (e) => {
        // console.log("error");
        this.audiodom.src = demo.siteConfig.icon("error", "audio", ".mp3");
      });
      this.audiodom.addEventListener("loadedmetadata", (e) => {
        this.audiodom.play();
      });
      this.audiodom.addEventListener("ended", (e) => {
        this.ondestroyaudio();
      });
      this.audiodom.addEventListener("play", (e) => {
        this.player3 = true;
      });
      this.audiodom.addEventListener("pause", (e) => {
        this.player3 = false;
      });
    },
    onerror() {
      this.pic = this.defaultpic;
    },
    init() {
      let index = this.i.index;
      let data = this.i.data || [];

      if (index === 3) {
        this.once = data[2];
      } else {
        this.tab = [data[0], data[1]];
        this.once = this.tab[0];
      }
    },
  },
  mounted() {
    this.i = this.value;
    this.init();
  },
  destroyed() {
    this.ondestroyaudio();
  },
};
</script>
<style lang='less' scoped>
.header_cover {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  background: linear-gradient(90deg, #cae6ff, #4ca8ff);
  box-sizing: border-box;
  z-index: 1;
}
.header_cover_2 {
  background: linear-gradient(0deg, rgba(255, 255, 255, 0), #cae6ff, #4ca8ff);
  height: 220px;
  &::before,
  &::after,
  .a,
  .b {
    position: absolute;
    content: "";
    width: 220px;
    height: 40px;
    background: linear-gradient(
      45deg,
      rgba(158, 217, 254, 0.5),
      rgba(255, 255, 255, 0)
    );
    border-radius: 20px;
    transform: rotate(-45deg);
    opacity: 0.4;
    transform-origin: 100% 0;
    right: 10px;
    top: -50px;
  }
  &::before {
    transform: rotate(-45deg) scale(0.6);
    right: 70px;
  }
  .a {
    right: auto;
    left: -150px;
    transform: rotate(-45deg) scale(0.6);
    top: 0px;
    width: 330px;
  }
  .b {
    right: auto;
    left: -20px;
    top: -40px;
    width: 140px;
  }
}
.audio {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.mp3 {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #222;
  position: relative;
  z-index: 5;
  box-sizing: border-box;
  padding: 6px;
  &::before {
    position: absolute;
    content: "";
    z-index: 8;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 20px;
    height: 20px;
    background-color: #222;
    border-radius: 50%;
  }
  img {
    border-radius: 50%;
    overflow: hidden;
    object-fit: cover;
  }
}
.mp4 {
  position: relative;
  z-index: 5;
  width: 350px;
  height: 200px;
  border-radius: 8px;
  background-color: #222;
  overflow: hidden;
  .error {
    width: 100%;
    height: 100%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    box-sizing: border-box;
  }
}
.plays {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 0 10px;
}
.cont {
  position: relative;
  z-index: 5;
  box-sizing: border-box;
  padding: 15px 15px 30px;
  font-size: 15px;
  line-height: 1.2;
  color: #666;
  height: calc(100% - 210px);
  &.c4 {
    height: calc(100% - 290px);
  }
}
.player_pause {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  width: 60px;
  height: 60px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: #fff;
  z-index: 22;
}
.tab {
  z-index: 8;
  position: fixed;
  width: 80%;
  margin: 0 10%;
  section {
    font-size: 14px;
    flex: 1;
    text-align: center;
    height: 40px;
    line-height: 40px;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      width: 40%;
      margin: auto;
      height: 1px;
    }
    &.active {
      &::before {
        background-color: #38f;
      }
    }
  }
}
</style>
