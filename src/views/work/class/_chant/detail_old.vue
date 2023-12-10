<template>
  <div class="chant_detail">
    <div class="player_box">
      <template v-if="play">
        <div id="player-chant-detail" @click.stop=""></div>
      </template>
      <template v-else>
        <div class="poster">
          <van-image :src="det.cover_image || ''" fit="cover"></van-image>
          <div class="player" @click.stop="onCreatePlayer()">
            <van-icon name="play-circle-o" />
          </div>
        </div>
      </template>
    </div>
    <div class="content" v-html="det.content"></div>
    <div class="tag">{{ tags }}</div>
    <ul class="data_ul">
      <li
        v-for="(i, j) in toteacher"
        :key="j"
        class="flex van-hairline--bottom"
        @click="onshowframedata(i)"
      >
        <div class="logo">
          <van-image :src="i.icon"></van-image>
        </div>
        <div class="text">
          <h2>{{ i.title }}</h2>
          <p>点击预览</p>
        </div>
      </li>
    </ul>
    <template v-if="issend">
      <van-tabs v-model="types">
        <van-tab :title="'已打卡(' + nums + ')'" name="1">
          <v-i v-model="item1" @share="onshare"></v-i>
        </van-tab>
        <van-tab :title="'未打卡(' + nume + ')'" name="2">
          <v-u-p
            v-model="item2"
            sendicon
            @sends="onchange({ path: 'send' })"
          ></v-u-p>
        </van-tab>
      </van-tabs>
    </template>
    <template v-else>
      <van-button
        class="send_btn"
        block
        round
        type="info"
        @click="onchange({ path: 'add' })"
        >发布</van-button
      >
    </template>
    <v-f v-model="open5" :footer="false" :index="600">
      <iframe :src="framesrc" frameborder="0" class="db_image"></iframe>
    </v-f>
  </div>
</template>

<script>
import vM from "../../../private/menu.vue";
import vF from "../../../private/fixed.vue";
import vUP from "./out.vue";
import vI from "./in.vue";
export default {
  props: {
    value: null,
  },
  data() {
    return {
      item: [],
      play: false,
      player: null,
      open5: false, // iframe
      item1: [], // 打卡人
      item2: [], // 未打卡人
      framesrc: "",
      nums: 0,
      nume: 0,
      types: "",
    };
  },
  computed: {
    issend() {
      // eslint-disable-next-line
      return demo.$obj(this.det.country_study_class, 1) === 6 ? "已发布" : "";
    },
    csc() {
      if (this.issend) {
        return this.det.country_study_class || {};
      }
      return {};
    },
    det: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    tags() {
      let a = this.det.classify || {};
      let b = [
        a.classify_title,
        a.classify_name,
        a.name,
        this.det.types,
        this.det.name,
      ].join(" - ");
      return b;
    },
    toteacher() {
      return [this.det.courseware, this.det.courseware_description].map(
        (s, v) => {
          let e = (s + "").split(".");
          return {
            title: v === 0 ? "课件" : "课件说明",
            url: s,
            // eslint-disable-next-line
            icon: demo.siteConfig.uploadShow(e[e.length - 1]),
          };
        }
      );
    },
  },
  watch: {
    det: {
      handler(v) {
        this.init();
        this.$emit("input", v);
      },
      deep: true,
    },
    types(n) {
      if (+n === 1) {
        this.onchange({ path: "in" });
      } else {
        this.onchange({ path: "out" });
      }
    },
  },
  components: { vM, vF, vUP, vI },
  methods: {
    onshare(e) {
      this.$emit("share", e);
    },
    onshowframedata(e) {
      this.open5 = true;
      // eslint-disable-next-line
      this.framesrc = demo.siteConfig.api.see + "?t=" + e.url;
    },
    onchange(e) {
      let type = e.path.replace("/to:", "");
      switch (type) {
        case "add":
          this.$js.model("发布打卡", "是否发布打卡?", (res) => {
            if (res) {
              this.$emit("send", this.det);
            }
          });
          break;
        case "in":
          this.togetlist(null, (e, list) => {
            this.open1 = true;
            this.item1 = list.map((s) => {
              s.play = false;
              return s;
            });
          });
          break;
        case "out":
          this.togetunlist(null, (e, list) => {
            this.open2 = true;
            this.item2 = list;
          });
          break;
        case "send":
          this.togetunlist(null, (e) => {
            if (e < 1) return this.$toast("已全部打卡");
            this.$js.model(
              "打卡推送",
              "是否对未打卡的宝宝进行推送通知?",
              (res) => {
                if (res) {
                  this.$emit("vxsend", this.det);
                }
              }
            );
          });
          break;
        case "data":
          this.open3 = true;
          break;
        default:
          console.log(e, type);
      }
    },
    onCreatePlayer() {
      this.play = true;
      this.$nextTick(() => {
        // eslint-disable-next-line
        this.player = new DEMO_Player({
          // eslint-disable-next-line
          container: demo.$.id("player-chant-detail"),
          video: {
            url: this.det.video_address,
            pic: this.det.cover_image,
          },
          mutex: true,
          preload: "none",
        });
        this.player.play();
      });
    },
    init() {
      let item = this.$js.def.works.chant;
      // 检测是否发布
      let s = this.issend;
      this.item = item.filter((r) => {
        return (s ? !r.issend : r.issend) || r.all;
      });

      // 发布 检测未打卡人数
      if (s) {
        this.togetunlist();
      }
    },
    togetlist(f, fn) {
      this.$api.http(
        "chantlist",
        {
          country_study_class_id: this.csc.country_study_class_id || "",
          page: 1,
          limit: 200,
        },
        (r) => {
          this.nums = r.checked_in;
          this.nume = r.not_checked_in;
          if (r.not_checked_in < 1) {
            this.item = this.item.filter((r) => {
              return !r.check;
            });
          }
          if (fn) {
            fn(r.checked_in, r.list);
          }
        }
      );
    },
    togetunlist(f, fn) {
      this.$api.http(
        "chantunlist",
        {
          country_study_class_id: this.csc.country_study_class_id || "",
          page: 1,
          limit: 200,
        },
        (r) => {
          this.nums = r.checked_in;
          this.nume = r.not_checked_in;
          if (r.not_checked_in < 1) {
            this.item = this.item.filter((r) => {
              return !r.check;
            });
          }
          if (fn) {
            fn(r.not_checked_in, r.list);
          }
        }
      );
    },
  },
  mounted() {
    this.det = this.value;
    this.init();
  },
  destroyed() {
    if (this.player && this.player.video) {
      this.player.destroy();
    }
  },
};
</script>
<style lang='less' scoped>
.chant_detail {
  .player_box {
    height: 210px;
    background-color: #222;
  }
  .content {
    padding: 10px;
    font-size: 15px;
    color: #666;
  }
  .tag {
    background-color: #f8f7fa;
    padding: 10px;
    font-size: 14px;
    color: #999;
    margin-bottom: 10px;
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
.data_ul {
  li {
    padding: 10px;
    align-items: center;
    .logo {
      width: 60px;
      height: 60px;
      margin-right: 10px;
    }
    .text {
      width: calc(100% - 70px);
    }
    h2 {
      padding: 5px 0;
      font-size: 15px;
      font-weight: 650;
    }
    p {
      font-size: 14px;
      color: #999;
    }
  }
}
.send_btn {
  margin: 30px 15%;
  width: 70%;
}
</style>
