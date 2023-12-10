<template>
  <div class="chant_example_det">
    <div class="player">
      <iframe
        :src="[framesrc, det.video, '&pic=', det.cover].join('')"
        frameborder="0"
        class="db_image"
        v-if="det.video"
      ></iframe>
      <van-image :src="det.cover" v-else></van-image>
    </div>
    <div class="head">
      <h2>{{ det.title }}</h2>
      <p class="r">发布时间：{{ appTimeout(det.create_time, true) }}</p>
    </div>
    <template v-if="ismy || ismys">
      <div class="tool_menus">
        <van-button round block type="warning" plain @click="onedit"
          >编辑</van-button
        >
        <van-button
          round
          block
          type="info"
          plain
          v-if="+det.status === 2"
          @click="ontostatus(1)"
          >上架</van-button
        >
        <van-button
          round
          block
          type="primary"
          plain
          v-else
          @click="ontostatus(2)"
          >下架</van-button
        >
        <van-button round block type="danger" plain @click="ondel"
          >删除</van-button
        >
      </div>
    </template>
    <template v-else> </template>
    <div class="bottom_h"></div>
    <div class="bottom flex" v-if="!ismy">
      <div class="text">
        <p>原价：￥{{ det.original_price }}</p>
        <p>
          优惠价：￥<b class="col_danger">{{ det.price }}</b>
        </p>
      </div>
      <van-button type="primary" v-if="ismys" disabled>我上传的</van-button>
      <van-button
        type="danger"
        v-else-if="+det.is_purchase === 0"
        @click.stop="onbuy"
        >购买</van-button
      >
      <van-button disabled type="info" v-else>已购买</van-button>
    </div>
    <v-f v-model="open" :footer="false" text="编辑" :index="600">
      <v-e
        edit
        v-model="det"
        @end="
          open = false;
          init();
        "
      ></v-e>
    </v-f>
  </div>
</template>

<script>
import vF from "../../../private/fixed.vue";
import vE from "./example_add.vue";
export default {
  props: {
    ids: [Number, String],
  },
  data() {
    return {
      det: {},
      ismy: false,
      user: {},
      open: false,
    };
  },
  components: { vF, vE },
  computed: {
    uid() {
      return this.user.s_id;
    },
    ismys() {
      return this.det.staff_id === this.uid;
    },
    framesrc() {
      // eslint-disable-next-line
      return demo.siteConfig.api.h5 + "player/?url=";
    },
  },
  inject: ["appTimeout"],
  methods: {
    onedit() {
      this.open = true;
    },
    ontostatus(e) {
      this.$api.http(
        "chantvideostatus",
        { presentation_id: this.det.presentation_id },
        (r) => {
          this.det.status = r;
          this.$emit("end");
        }
      );
    },
    init() {
      // eslint-disable-next-line
      this.user = demo.$session.get("user", {});
      let val = (this.ids + "").split("_");
      this.ismy = +val[1] === 2;
      this.$api.http(
        "chantvideodet",
        { presentation_id: val[0], type: val[1] },
        (r) => {
          this.det = r;
        }
      );
    },
    ondel() {
      this.$js.modeldel(() => {
        this.$api.http(
          "chantvideodel",
          { presentation_id: this.det.presentation_id },
          () => {
            this.$emit("close");
            this.$toast("删除成功");
          }
        );
      });
    },
    onbuy() {
      if (this.det.price <= 0) {
        this.$api.http(
          "chantvideopay",
          { presentation_id: this.det.presentation_id },
          () => {
            this.init();
            this.$toast("购买成功");
          }
        );
        return 0;
      }
      let os = this.$js.wxshareh5(
        "chantpay",
        {
          checkcode: true,
          pay: true,
          // eslint-disable-next-line
          token: demo.$local.get("token"),
          id: this.det.presentation_id,
          path: this.$route.path,
          price: this.det.price,
        },
        "",
        true
      );
      if (this.$js.env) {
        console.log(os);
        return 0;
      }
      window.location.replace(os);
      // 需要openid 跳转至
      // this.$api.http(
      //   "chantvideopay",
      //   { presentation_id: this.det.presentation_id, open_id: "" },
      //   (r) => {}
      // );
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.chant_example_det {
  .player {
    height: 200px;
    background-color: #222;
    margin-bottom: 10px;
  }
  .bottom_h {
    height: 80px;
  }
  .bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 5;
    background-color: #fff;
    .text {
      width: calc(100% - 150px);
      font-size: 14px;
      box-sizing: border-box;
      padding: 0 10px;
      line-height: 1.2;
      display: flex;
      justify-content: center;
      flex-direction: column;
      color: #999;
      b {
        font-weight: 600;
        font-size: 16px;
      }
    }
    .van-button {
      width: 150px;
    }
  }
  .head {
    box-sizing: border-box;
    padding: 10px;
    background-color: #fff;
    h5 {
      font-weight: 600;
      font-size: 15px;
      padding: 5px 0;
    }
    .r {
      text-align: right;
      font-size: 12px;
      color: #999;
    }
  }
  .tool_menus {
    box-sizing: border-box;
    padding: 10px;
    margin: 0 auto;
    width: 65%;
    .van-button {
      margin-bottom: 40px;
    }
  }
}
</style>
