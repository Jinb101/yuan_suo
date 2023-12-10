<template>
  <div class="recruit_poster">
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section v-for="(i, j) in item" :key="j" @click.stop="ondet(i)">
        <div class="flex">
          <div class="logo" v-if="i.picture && i.picture.length">
            <van-image :src="i.picture[0]" fit="cover"></van-image>
          </div>
          <div class="text">
            <h5>{{ i.title }}</h5>
            <p>
              {{ totype(i) }}
            </p>
            <p>发布人：{{ (i.staff || {}).name }}</p>
          </div>
        </div>
        <div class="tool flex">
          <template v-if="user.s_id === i.staff.id">
            <van-button
              size="small"
              type="warning"
              round
              @click.stop="onedititem(i)"
              >编辑</van-button
            >
            <van-button
              size="small"
              type="danger"
              round
              @click.stop="ondelitem(i)"
              >删除</van-button
            >
          </template>
          <van-button round type="info" @click.stop="onsignitem(i)" size="small"
            >报名信息</van-button
          >
        </div>
      </section>
    </v-page>
    <div class="foot">
      <van-button block round :color="$js.btnColor" @click="open = true"
        >添加海报</van-button
      >
    </div>
    <v-f v-model="open" :footer="false" text="添加">
      <v-a @end="onend"></v-a>
    </v-f>
    <v-f v-model="open1" :footer="false" text="编辑">
      <v-a edit :ext="ext" @end="onend"></v-a>
    </v-f>
    <v-f
      v-model="open2"
      :footer="false"
      text="课程详情"
      share
      @on-share="onshare"
    >
      <v-c :cid="child" @end="onendchild"></v-c>
    </v-f>
    <v-f v-model="open3" :footer="false" text="报名信息">
      <v-s :ids="sid"></v-s>
    </v-f>
    <v-s2 v-if="open4" @change="open4 = false"></v-s2>
  </div>
</template>

<script>
import vF from "../../private/fixed.vue";
import vA from "./_poster_add.vue";
import vC from "./_poster_child.vue";
import vS from "./_poster_sign.vue";
import vS2 from "../../public/share.vue";
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      open: false, // 控制添加
      open1: false, // 控制编辑
      open2: false, // 控制详情
      open3: false, // 控制报名
      open4: false,
      item: [],
      ext: {},
      child: "",
      childext: {},
      ce: {},
      sid: "",
    };
  },
  watch: {
    open2(n) {
      if (!n) {
        this.appPath("/work_recruit/5", true);
      }
    },
  },
  inject: ["appPath"],
  components: { vF, vA, vC, vS, vS2 },
  methods: {
    totype(e) {
      if (+e.type === 1) return "免费";
      if (+e.type === 2) return +e.price + "元";
      return "邀请" + e.invite + "人";
    },
    onend() {
      this.open = this.open1 = false;
      this.onPage(1);
    },
    ondet(e) {
      this.appPath("/work_recruit/5&" + e.id, true);
      this.child = e.id;
      this.open2 = true;
    },
    onedititem(e) {
      this.$api.http("posterdet", { id: e.id }, (r) => {
        this.ext = r;
        this.open1 = true;
      });
    },
    ondelitem(e) {
      this.$js.modeldel(() => {
        this.$api.http("posterdel", { id: e.id }, () => {
          this.$toast("删除成功");
          this.item = this.item.filter((r) => {
            return r.id !== e.id;
          });
        });
      });
    },
    onsignitem(e) {
      this.sid = e.id;
      this.open3 = true;
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("poster", { page }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
    onendchild(e) {
      this.childext = e;
      this.onshares();
    },
    onshare(e, type) {
      let os = {
        type: "admin",
        // eslint-disable-next-line
        nid: demo.$local.get("nid", ""),
        sid: (e.user || {}).s_id,
        path: e.path,
        id: this.childext.id,
        name: (e.config || {}).name || "",
        time: Date.now(),
        m: "", // openid
      };
      // eslint-disable-next-line
      let a = demo.es6().encrypt(os, "", "poster");
      // eslint-disable-next-line
      let url = demo.siteConfig.api.h5 + "poster/?h5=" + a;
      if (type) return url;
      // eslint-disable-next-line
      if (!demo.es6().isWx()) {
        console.log(url);
        return this.$toast("请用微信打开");
      }
      // this.$toast("请点击微信右上角...进行分享");
      this.open4 = true;
      this.toshare(url);
    },
    onshares() {
      let os = {
        // eslint-disable-next-line
        user: demo.$session.get("user", {}),
        path: this.$route.path,
        config: {},
      };
      let link = this.onshare(os, true);
      this.toshare(link);
    },
    toshare(link) {
      this.$js.wxshare({ link, desc: this.childext.title });
    },
  },
  mounted() {
    // ondet
    let id = this.$route.params;
    if (id.id) {
      this.ondet(id);
    }
  },
};
</script>
<style lang='less' scoped>
.foot {
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 10px 15%;
  width: 100%;
  z-index: 50;
  box-sizing: border-box;
}
section {
  margin: 10px;
  font-size: 15px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  box-sizing: border-box;
  .logo {
    width: 80px;
    height: 80px;
    margin-right: 10px;
    border-radius: 8px;
    overflow: hidden;
  }
  .text {
    flex: 1;
    h5 {
      padding: 8px 0;
    }
    p {
      line-height: 1.2;
      margin-top: 8px;
      color: #999;
    }
  }
  .tool {
    flex-direction: row-reverse;
    padding: 8px 8px 0;
    .van-button {
      min-width: 80px;
      margin-left: 12px;
    }
  }
}
.share {
  font-size: 20px !important;
  text-align: center;
}
</style>
