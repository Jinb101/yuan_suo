<template>
  <div class="chant_detail">
    <v-m v-model="item" :column="5" @change="onchange"></v-m>
    <div class="app_top">
      <van-tabs v-model="types">
        <van-tab
          v-for="(i, j) in tab"
          :key="j"
          :title="i.t"
          :name="i.v"
        ></van-tab>
      </van-tabs>
    </div>
    <template v-if="+types === 1">
      <v-i
        v-model="item1"
        @share="onshare"
        :ids="det.class_schedule_country_id"
      ></v-i>
    </template>
    <template v-else-if="+types === 2">
      <v-u-p
        v-model="item2"
        sendicon
        @sends="onchange({ path: '6' })"
        :ids="det.class_schedule_country_id"
        :cid="cid"
      ></v-u-p>
    </template>
    <template v-else-if="+types === 3">
      <v-c
        :ids="det.class_schedule_country_id"
        :cid="cid"
        v-model="item3"
        @share="onshare"
      ></v-c>
    </template>
    <v-f v-model="open5" :footer="false" :index="600">
      <iframe :src="framesrc" frameborder="0" class="db_image"></iframe>
    </v-f>
    <v-f v-model="open6" :footer="false" :index="602" :header="false" retreat>
      <v-p v-model="open6src"></v-p>
    </v-f>
    <v-f v-model="open7" :footer="false" :index="605" bgc="#f8f7fa">
      <template #menu>
        <span @click="$refs.box.open3 = true">我的订单</span>
      </template>
      <v-e child ref="box"></v-e>
    </v-f>
    <!-- <van-button class="send_btn" block round type="info" @click="onsend"
      >发布</van-button
    > -->
  </div>
</template>

<script>
import vM from "../../private/menu.vue";
import vF from "../../private/fixed.vue";
import vUP from "./_chant/out.vue";
import vI from "./_chant/in.vue";
import vA from "../../private/avatar.vue";
import vE from "./_chant/example.vue";
import vC from "./_chant/child.vue";
import vP from "./_chant/player_song.vue";
export default {
  props: {
    value: null,
    cid: [String, Number],
  },
  data() {
    return {
      item: [],
      tab: [
        { t: "已打卡", v: 1 },
        { t: "未打卡", v: 2 },
        { t: "打卡列表", v: 3 },
      ],
      open5: false, // iframe
      open6: false,
      open7: false, // 示范课
      framesrc: "",
      types: 1,
      plays: [],
      play: {},
      item1: [],
      item2: [],
      item3: [],
      open6src: "",
    };
  },
  computed: {
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
    issend() {
      // eslint-disable-next-line
      return +this.det.release === 1 ? "已发布" : "";
    },
    csc() {
      if (this.issend) {
        return this.det.country_study_class || {};
      }
      return {};
    },
    toplayerurl() {
      return (
        // eslint-disable-next-line
        demo.siteConfig.api.h5 +
        "player/?url=" +
        this.play.url +
        "&pic=" +
        this.play.pic
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
  },
  components: { vM, vF, vUP, vI, vA, vE, vC, vP },
  methods: {
    onchangeplayer(e) {
      this.play = e;
    },
    onshare(e) {
      this.$emit("share", e);
    },
    onshowframedata(e) {
      if (!e) {
        this.$toast("暂无");
        return 0;
      }
      this.open5 = true;
      // eslint-disable-next-line
      this.framesrc = demo.siteConfig.api.see + "?t=" + e;
    },
    init() {
      this.item = this.$js.def.works.chant;
    },
    onsend() {
      this.$js.model("发布打卡", "是否发布打卡?", (res) => {
        if (res) {
          this.$emit("send", this.det);
        }
      });
    },
    onchange(e) {
      let obj = this.det.country_study || {};
      let tp = e.path.replace("/to:", "");
      switch (+tp) {
        case 1:
          this.open7 = true;
          break;
        case 2:
        case 3:
          let os = [
            { src: obj.audio, pic: obj.parent_cover_picture },
            {
              src: obj.parent_video,
              pic: obj.parent_cover_picture,
              type: "mp4",
            },
            { src: obj.read_aloud, pic: obj.read_aloud_cover },
          ].map((s) => {
            s.content = obj.content;
            return s;
          });
          this.open6src = { index: +tp, data: os };
          this.open6 = true;
          break;
        case 4:
          this.onshowframedata(obj.courseware);
          break;
        case 5:
          this.onshowframedata(obj.courseware_description);
          break;
        case 6:
          this.$emit("vxsend", this.det);
          break;
        default:
      }
    },
  },
  mounted() {
    this.det = this.value;
    this.init();
  },
  destroyed() {
    // if (this.player && this.player.video) {
    //   this.player.destroy();
    // }
  },
};
</script>
<style lang='less' scoped>
.player_view {
  .cover_fixed_image {
  }
  .tab {
    padding: 10px;
    height: 40px;
    line-height: 40px;
    width: 70%;
    margin: 0 auto;
    font-size: 15px;
    span {
      flex: 1;
      text-align: center;
      border: 1px solid #999;
      border-radius: 20px;
      & + span {
        margin-left: 10px;
      }
      &.active {
        color: #fff;
        background-color: #18bc9c;
        border-color: #18bc9c;
      }
    }
  }
  .player {
    margin: 10px;
    height: 200px;
    background-color: #222;
    border-radius: 5px;
    overflow: hidden;
  }
  .content {
    padding: 10px 20px;
    box-sizing: border-box;
    font-size: 15px;
    line-height: 1.2;
  }
}
</style>
