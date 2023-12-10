<template>
  <v-view
    header
    ref="view"
    @on-view="oninit"
    bgc="#f8f7fa"
    @share-close="open = false"
  >
    <template #menu>
      <span class="menu_tab" @click="onopenqr(true)" v-if="+type === 0"
        ><van-icon name="qr"
      /></span>
      <span v-else @click="open2 = !open2">{{
        a2[1] ? a2[1] : "筛选班级"
      }}</span>
    </template>
    <div class="app_top">
      <van-tabs v-model="type">
        <van-tab title="缴费价格"></van-tab>
        <van-tab title="已缴费"></van-tab>
        <van-tab title="未缴费"></van-tab>
      </van-tabs>
    </div>
    <div class="views_pay">
      <v-in v-if="+type === 1" :cid="cls.id" :rid="cls.rid"></v-in>
      <v-out v-else-if="+type === 2" :cid="cls.id" :rid="cls.rid"></v-out>
      <div class="price_show" v-else-if="+type === 0">
        <van-cell
          title="主监护人学期费用"
          :value="price.main_half_year + '元'"
        ></van-cell>
        <van-cell
          title="主监护人学年费用"
          :value="price.main_one_year + '元'"
        ></van-cell>
        <van-cell
          title="副监护人学期费用"
          :value="price.minor_half_year + '元'"
        ></van-cell>
        <van-cell
          title="副监护人学年费用"
          :value="price.minor_one_year + '元'"
        ></van-cell>
      </div>
      <van-empty description="暂无" v-else></van-empty>
    </div>
    <div class="bottom" v-if="+type === 0">
      <van-button block @click="onshare" type="info"
        >点击转发收费页面</van-button
      >
    </div>
    <template #fixed>
      <van-popup v-model="open" round get-container="#app" :overlay="overlay">
        <div class="cover_share_box">
          <div id="qr-img" ref="qr"></div>
        </div>
      </van-popup>
      <v-s
        v-model="a2"
        :open="open2"
        :list="grade"
        @change="onchangeselect"
      ></v-s>
    </template>
  </v-view>
</template>

<script>
/* eslint-disable */
import vIn from "./babypay/in.vue";
import vOut from "./babypay/out.vue";
import vS from "../private/select.vue";
export default {
  data() {
    return {
      type: "",
      url: "",
      sid: "",
      open: false,
      qr: null,
      overlay: false,
      price: {},
      open2: false,
      grade: [],
      a2: [],
      cls: { id: "", rid: "" },
    };
  },
  components: { vIn, vOut, vS },
  watch: {
    open(n) {
      if (!n) {
        if (this.qr) {
          this.qr.innerHTML = "";
          this.qr = null;
        }
      }
    },
    type(n) {
      if (+n === 0 && !this.price.time) {
        this.$api.http("babymy", {}, (r) => {
          this.price = { ...r, time: Date.now() };
        });
      }
    },
    open2(n) {
      if (n) {
        this.getgradeonce();
      }
    },
  },
  methods: {
    onchangeselect(e, v) {
      let rid = this.grade[e[0]].id;
      let id = this.grade[e[0]].children[e[1]].id;
      if (+id === 9999) {
        id = "";
        v[1] = v[0];
      }
      if (+rid === 9999) {
        rid = "";
      }
      this.cls = { e, v, id, rid };
      demo.$local.set("babypay-cls", this.cls);
    },
    getgradeonce() {
      if (this.grade.length > 0) {
        return 0;
      }
      this.$toast.loading({ duration: 0 });
      let c = this.$api.classes().map((s) => {
        s.children = [{ name: "全部", id: 9999 }];
        return s;
      });
      let ids = c.map((s) => {
        return s.id;
      });
      this.$api.http("classeslist", {}, (r) => {
        r.forEach((k) => {
          let by = ids.indexOf(k.class_type);
          if (by >= 0) {
            c[by].children.push({
              name: k.nickname,
              id: k.id,
            });
          }
        });
        this.grade = [
          {
            name: "全部年级",
            id: 9999,
            children: [{ name: "全部班级", id: 9999 }],
          },
        ].concat(c);
        this.$toast.clear();
      });
    },
    oninit(e) {
      this.sid = e.user.s_id || "";
      this.url = this.onlink();
    },
    onopenqr(f) {
      this.overlay = f;
      this.open = true;
      this.$nextTick(() => {
        this.qr = this.$refs.qr;
        let rect = this.qr.getBoundingClientRect();
        new QRCode(demo.$.id("qr-img"), {
          text: this.url,
          width: rect.width,
          height: rect.height,
        });
      });
    },
    onshare() {
      this.$refs.view.$share();
      this.onopenqr(false);
      this.$js.wxshare({
        link: this.onlink(),
        desc: "提示您该缴费啦",
        title: "宝宝在线缴费",
      });
      // this.$js.wxshareh5(
      //   "babypayindex",
      //   { sid: this.sid },
      //   "提示您该缴费啦",
      //   false,
      //   {
      //     title: "宝宝在线缴费",
      //   }
      // );
    },
    onlink() {
      let id = demo.$local.get("nid");
      return [
        window.location.origin,
        "/parent/?id=",
        id,
        "#/babypay/",
        this.sid,
      ].join("");
    },
  },
  mounted() {
    let cls = demo.$local.get("babypay-cls", {});
    if (cls.rid) {
      this.cls = cls;
      this.a2 = cls.v;
    }
  },
};
</script>
<style lang='less' scoped>
.menu_tab {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #55d7f1;
  .van-icon {
    font-size: 25px;
  }
}
.bottom {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
.cover_share_box {
  width: 300px;
  height: 300px;
  box-sizing: border-box;
  padding: 20px;
  > div {
    height: 100%;
  }
}
.views_pay {
  height: calc(100% - 88px);
}
</style>
