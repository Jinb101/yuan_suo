<template>
  <v-view header :text="ify.name" bgc="#f8f7fa" ref="views" index="580">
    <template #menu>
      <v-c v-model="cls"></v-c>
    </template>
    <template v-if="open">
      <div class="app_top">
        <van-tabs v-model="type1">
          <van-tab
            :title="i.name"
            :name="i.id"
            v-for="(i, j) in ify.children"
            :key="j"
          ></van-tab>
        </van-tabs>
      </div>
      <div class="leftmenu">
        <section
          v-for="(x, y) in menu2"
          :key="y"
          @click="type2 = x.id"
          :class="{ active: +type2 === x.id }"
        >
          {{ x.name }}
        </section>
      </div>
      <div class="content_view">
        <v-page ref="page" @on-page="onPage">
          <!-- <section class="check_btn">
            <van-button block @click="onsendcheck(true, {})"
              >更换{{ sems.name || "" }}课程</van-button
            >
          </section> -->
          <van-empty v-if="!item.length"></van-empty>
          <section
            v-for="(i, j) in item"
            :key="j + '-l'"
            class="flex"
            @click="ondetail(i)"
          >
            <div class="logo">
              <van-image
                :src="toimgs(i.cover_image, j)"
                v-lazy
                fit="cover"
              ></van-image>
            </div>
            <div class="text">
              <h3>{{ i.name }}</h3>
              <p class="desc">{{ i.types }}</p>
              <p>
                {{ tostatus(i.release) }}
              </p>
            </div>
            <!-- <span class="status" @click.stop="onsendcheck(false, i)">换课</span> -->
          </section>
        </v-page>
      </div>
      <div class="bottom_btn">
        <van-button block @click="onsendcheck(true, {})" type="info"
          >更换{{ sems.name || "" }}课程
        </van-button>
      </div>
    </template>
    <van-empty v-else description="该班级暂未开通功能"></van-empty>
    <template #fixed>
      <v-f v-model="open1" :footer="false" index="599">
        <template #menu>
          <span @click="onsend" v-if="+det.release === 0">发布打卡</span>
        </template>
        <v-d
          v-model="det"
          @vxsend="onvxsend"
          @share="onshare"
          :cid="cls.id"
        ></v-d>
      </v-f>
      <v-f v-model="open2" :footer="false" :index="600" retreat :header="false">
        <v-s :ext="open2id" @end="onPage(1)"></v-s>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vC from "../../private/select_class.vue";
import vD from "./_chant_detail.vue";
import vF from "../../private/fixed.vue";
import vS from "./_chant/check.vue";
export default {
  data() {
    return {
      cls: {},
      ify: {},
      open: false,
      type1: "", // 控制春秋
      type2: "", // 二级分类
      item: [],
      open1: false,
      det: {},
      id: "",
      open2: false,
      open2id: {},
    };
  },
  inject: ["appPath"],
  watch: {
    "cls.id"() {
      this.onceify();
    },
    type1() {
      this.type2 = "";
    },
    menu2: {
      handler(n) {
        if (n.length && this.type2 === "") {
          this.type2 = n[0].id;
        }
      },
      deep: true,
    },
    type2(n) {
      if (n) {
        this.onPage(1);
      }
    },
    typespath(n) {
      if (n) {
        this.appPath("/work_chant/" + n, true);
      }
    },
    open1(n) {
      if (!n) {
        this.appPath("/work_chant/" + this.typespath, true);
      }
    },
  },
  computed: {
    menu2() {
      if (!this.open) return [];
      let id = this.type1;
      let arr = this.ify.children;
      if (arr && arr.length) {
        arr =
          arr.filter((r) => {
            return r.id === +id;
          })[0] || {};
        return arr.children || [];
      }
      return [];
    },
    typespath() {
      let u = [this.type1, this.type2];
      let e = u.filter((r) => {
        return r !== "";
      });
      if (u.length === e.length) {
        return u.join("&");
      }
      return "";
    },
    sems() {
      let v = this.type2;
      let r = this.menu2;
      let c =
        r.filter((s) => {
          return +s.id === +v;
        })[0] || {};
      return c;
    },
  },
  components: { vC, vD, vF, vS },
  methods: {
    onsendcheck(e, f) {
      this.open2 = true;
      this.open2id = {
        id: e ? this.sems.id : f.class_schedule_country_id,
        code: e,
        t1: this.type1,
        t2: this.type2,
        zh: e ? "" : [f.name, "[", f.types, "]"].join(""),
        class_id: this.cls.id,
      };
    },
    toimgs(src, index) {
      // if (src) return src;
      // eslint-disable-next-line
      return demo.siteConfig.icon((index % 24) + 1, "parent");
    },
    tostatus(e) {
      return +e === 1 ? "已发布" : "";
    },
    onshare(e) {
      if (!e.$shareunopen) {
        this.$refs.views.$share();
      }
      let os = {
        type: "admin",
        // eslint-disable-next-line
        nid: demo.$local.get("nid", ""),
        path: this.$route.path,
        time: Date.now(),
        id: e.country_study_child_id,
      };
      // eslint-disable-next-line
      let a = demo.es6().encrypt(os, "", "poster");
      // eslint-disable-next-line
      let url = [
        // eslint-disable-next-line
        demo.siteConfig.api.h5,
        "poster/?type=chant&h5=",
        a,
      ].join("");
      // eslint-disable-next-line
      if (!demo.es6().isWx()) {
        console.log(url);
        if (e.$shareunopen) return 0;
        return this.$toast("请用微信打开");
      }
      // window.location.href = url;
      this.$js.wxshare({
        link: url,
        desc:
          "您的好友[" + (e.child_name || e.nickname) + "]邀您查看Ta的经典吟诵",
      });
    },
    ondetail(e) {
      this.id = e.class_schedule_country_id;
      this.$nextTick(() => {
        this.appPath("/work_chant/" + this.typespath + "&" + this.id, true);
      });
      this.$api.http(
        "chantdet",
        {
          class_schedule_country_id: e.class_schedule_country_id,
          class_id: this.cls.id,
        },
        (r) => {
          this.det = r;
          this.open1 = true;
        }
      );
    },
    onsend() {
      this.$js.model("发布打卡", "是否发布打卡?", (res) => {
        if (res) {
          this.$api.http(
            "chantadd",
            {
              class_schedule_country_id: this.det.class_schedule_country_id,
              class_id: this.cls.id,
            },
            () => {
              this.$toast("发布成功");
              this.ondetail(this.det);
            }
          );
        }
      });
    },
    onvxsend(e) {
      let id = e.country_study_id;
      this.$api.http("chantunlistpush", { country_study_class_id: id }, () => {
        this.$toast("推送成功，未打卡的宝宝将收到推送信息");
      });
    },
    onceify() {
      let params = this.$route.params;
      if (params.videoid) {
        this.appPath("/work_chant_video/" + params.videoid, true);
        return 0;
      }
      this.ify = {};
      this.$api.http("chantgetify", { class_id: this.cls.id }, (r) => {
        this.open = r.children && r.children.length;
        this.ify = r;
        if (params.sid) {
          this.type1 = params.sid;
        }
        this.$nextTick(() => {
          if (params.tid && !this.type2) {
            this.type2 = params.tid;
          }
          setTimeout(() => {
            if (params.id) {
              this.ondetail({ class_schedule_country_id: params.id });
            }
          }, 200);
        });
      });
    },
    onPage(page, f) {
      this.open2 = false;
      if (!f) {
        return this.$refs.page && this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "chantgetclsify",
        {
          page,
          classify_id: this.type2,
          class_id: this.cls.id || "",
        },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          this.item = this.item.concat(e);
          this.$refs.page.onFinish(e.length < 20);
        }
      );
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.leftmenu {
  width: 100px;
  padding: 10px 0;
  position: fixed;
  left: 0;
  top: 92px;
  z-index: 29;
  section {
    padding: 15px 10px;
    font-size: 15px;
    margin-bottom: 5px;
    border-radius: 0 20px 20px 0;
    background-color: #fff;
    &.active {
      background-color: #999;
      color: #fff;
    }
  }
}
.bottom_btn {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 20;
}
.content_view {
  box-sizing: border-box;
  padding: 10px 0 60px 110px;
  font-size: 16px;
  position: relative;
  z-index: 20;
  section {
    margin: 8px;
    box-sizing: border-box;
    padding: 8px;
    background-color: #fff;
    border-radius: 8px;
    position: relative;
    .logo {
      margin-right: 10px;
      width: 60px;
      height: 60px;
      border-radius: 5px;
      overflow: hidden;
    }
    .text {
      width: calc(100% - 70px);
      h3 {
        font-weight: 650;
        padding: 10px 0;
      }
      p {
        font-size: 14px;
        color: #999;
      }
    }
    .status {
      position: absolute;
      right: 10px;
      top: 0;
      bottom: 0;
      margin: auto;
      font-size: 14px;
      padding: 8px;
      height: 20px;
      line-height: 20px;
      letter-spacing: 1px;
      color: #999;
    }
  }
}
</style>
