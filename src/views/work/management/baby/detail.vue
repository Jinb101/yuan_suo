<template>
  <div class="baby_detail">
    <template v-if="open">
      <div class="app_top">
        <iframe :src="src + (s ? '&rotate=1' : '')"
                frameborder="0"
                class="play"
                :class="{ auto: s }"
                allowfullscreen="allowfullscreen"
                mozallowfullscreen="mozallowfullscreen"
                msallowfullscreen="msallowfullscreen"
                oallowfullscreen="oallowfullscreen"
                webkitallowfullscreen="webkitallowfullscreen"
                ref="frame"></iframe>
        <div class="tops">
          <h3 class="name">{{ detail.video_name }}</h3>
          <p class="time">
            开放时间：<b>
              {{ detail.morning_start }}~{{ detail.morning_end }}
              {{ detail.afternoon_start }}~{{ detail.afternoon_end }}
            </b>
          </p>
        </div>
      </div>
      <div class="view">
        <van-cell :label="totime(i)"
                  is-link
                  v-for="(i, j) in item"
                  :key="j"
                  @click="onDetail(i)">
          <template #title>
            <span class="font">{{ i.video_name }}</span>
          </template>
        </van-cell>
      </div>
    </template>
    <van-empty v-else
               description="未开放"></van-empty>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    ids: [Number, String],
    menu: Boolean,
  },
  data() {
    return {
      open: false,
      item: [],
      detail: {},
      pic: "",
      src: "",
      id: "",
      s: false,
    };
  },
  watch: {
    menu(n) {
      this.s = n;
    },
  },
  methods: {
    totime(e) {
      let a = ["开放时间："];
      if (e.morning_start) {
        a = a.concat([e.morning_start, "~", e.morning_end, " "]);
      }
      if (e.afternoon_start) {
        a = a.concat([e.afternoon_start, "~", e.afternoon_end, " "]);
      }
      return a.join("");
    },
    init() {
      this.$api.http("babydetail", { baby_id: this.id, page: 1 }, (r) => {
        this.detail = r.video;
        this.item = r.videos || [];
        this.pic = this.detail.video_img;
        let type = +this.detail.device_type === 1;
        let v = demo.$local.get("system-mode");
        let definition = !(v.definition === undefined || !v.definition); // 是否高清 大华
        if (this.detail.device_type === undefined) {
          type = true;
        }
        let a = demo.$session.get("user", {});
        let h5 = demo.es6().encrypt(
          {
            token: type ? this.detail.access_token : this.detail.getkit_token,
            url: this.detail.hd_address,
            time: [
              this.detail.morning_start,
              this.detail.morning_end,
              this.detail.afternoon_start,
              this.detail.afternoon_end,
            ],
            now: this.detail.server_time, // 当前时间 服务器返
            width: this.$refs.frame.clientWidth,
            height: this.$refs.frame.clientHeight,
            type,
            channid: this.detail.channeiid || 0,
            deviceid: this.detail.device_id || "",
            ooo: {
              t: a.phone || "",
              po: a.pay_openid || "",
              b: this.id,
              id: demo.$local.get("nid"),
            },
          },
          "baby",
          "admin"
        );
        console.log(h5, demo.siteConfig.api.h5, '--------------------------------------------------------');
        this.src =
          demo.siteConfig.api.h5 +
          "surveillance/?h5=" +
          h5 +
          "&definition=" +
          definition;
        console.log(this.src);

      });
    },
    onDetail(e) {
      this.id = e.baby_id;
      this.init();
    },
  },
  mounted() {
    this.$api.http("babyisoff", { baby_id: this.ids }, (r) => {
      if (+r.is_on === 1) {
        this.$emit("close");
        return this.$toast("该宝贝在线暂未开启");
      } else {
        this.open = true;
        this.id = this.ids;
        this.init();
      }
    });
  },
};
</script>
<style lang='less' scoped>
.play {
  height: 210px;
  display: block;
  width: 100%;
  background-color: #fff;

  &.auto {
    position: fixed;
    left: 0;
    top: 46px;
    width: 100%;
    height: calc(100% - 46px);
    z-index: 55;
  }
}

.tops {
  position: relative;
  background-color: #fff;
  z-index: 5;

  .name {
    padding: 15px 10px 10px;
    font-size: 15px;
    font-weight: 650;
    line-height: 20px;
  }

  .time {
    font-size: 13px;
    color: #999;
    padding: 0 10px;
    line-height: 15px;
  }
}

.view {
  border-top: 8px solid #f5f5f5;
}
</style>
