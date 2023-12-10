<template>
  <div class="vote_det">
    <div class="temp">
      <div class="cover_fixed_img">
        <img :src="det.cover_image" class="db_image" alt="封面失效" />
      </div>
      <h2 v-html="totitle(det.activity_name)"></h2>
      <p>
        {{
          [
            appTimeout(det.start_time, false, "ymd"),
            appTimeout(det.end_time, false, "ymd"),
          ].join(" ~ ")
        }}
      </p>
      <div class="tool flex">
        <van-button
          size="small"
          type="warning"
          plain
          @click="open = true"
          v-if="ismy"
          >编辑活动</van-button
        >
      </div>
    </div>
    <div class="author flex" v-if="det.staff">
      <v-ava :src="det.staff.avatar" class="logo"></v-ava>
      <div class="text">
        发布人：<b>{{ det.staff.name }}</b>
      </div>
    </div>
    <div class="search app_top">
      <v-s v-model="sval" unauto @search="onPage(1)"></v-s>
    </div>
    <div class="list">
      <v-page ref="page" @on-page="onPage">
        <ul>
          <li v-for="(i, j) in item" :key="j" @click.stop="ondet(i)">
            <span class="status" @click.stop="onedit(i)" v-if="isevent(i)"
              >编辑</span
            >
            <span
              class="status status1"
              @click.stop="ondel(i, j)"
              v-if="isevent(i)"
              >删除</span
            >
            <h2>{{ i.name }}</h2>
            <p>{{ i.full_name }}</p>
            <div class="rank flex">
              <b>排名:{{ i.ranking }}</b>
              <b v-if="+i.ranking > 1"
                >距离上一名:{{ i.from_previous_place }}分</b
              >
              <b>积分：{{ i.score }}分</b>
            </div>
            <div class="clearfix"></div>
            <div class="imgs flex fw" v-if="i.picture && i.picture.length">
              <div
                class="ig"
                v-for="(x, y) in i.picture"
                :key="y + '-' + j"
                @click.stop="appShowImage(i.picture, y)"
              >
                <img :src="x" alt="" class="db_image" />
              </div>
            </div>
          </li>
        </ul>
        <ul :class="{ btl: item.length > 5 }">
          <li
            class="add_list"
            @click.stop="
              child = {};
              open1 = true;
            "
            v-if="issend"
          >
            <van-icon name="plus"></van-icon>
            <p>发布作品</p>
          </li>
        </ul>
        <van-empty v-if="!item.length"></van-empty>
      </v-page>
    </div>
    <v-f v-model="open" :footer="false" text="编辑" :index="601">
      <v-a edit v-model="det" @end="onendedit" :edit2="isedit2"></v-a>
    </v-f>
    <v-f v-model="open1" :footer="false" text="添加" :index="602" bgc="#f8f7fa">
      <v-as v-model="child" :exts="det" @end="onPage(1)"></v-as>
    </v-f>
    <v-f v-model="open2" :footer="false" text="编辑" :index="603" bgc="#f8f7fa">
      <v-as v-model="child" :exts="det" @end="onPage(1)" edit></v-as>
    </v-f>
    <v-f v-model="open3" :footer="false" text="详情" :index="604" bgc="#f8f7fa">
      <template #menu>
        <span @click="onsahre">分享</span>
      </template>
      <v-d v-model="child" :exts="det"></v-d>
    </v-f>
  </div>
</template>

<script>
import vA from "./add.vue";
import vF from "../../private/fixed.vue";
import vAs from "./childadd.vue";
import vD from "./detail.vue";
import vAva from "../../private/avatar.vue";
import vS from "../../private/search.vue";
export default {
  props: {
    value: null,
    sid: [Number, String],
  },
  data() {
    return {
      det: {},
      item: [],
      open: false,
      open1: false,
      open2: false,
      open3: false,
      child: {},
      params: {},
      ismy: false,
      isedit2: false,
      sval: "",
    };
  },
  computed: {
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    issend() {
      let v = [2, 3].indexOf(+this.det.pay_status) >= 0; // 已支付或次数抵扣
      let type = +this.det.activity_type === 1;
      if (v) {
        if (type) {
          // 全园
          return true;
        } else {
          // 班级
          return this.det.is_publish;
        }
      }
      return v;
    },
  },
  components: { vA, vF, vAs, vD, vAva, vS },
  inject: ["appTimeout", "appShowImage", "appPath"],
  watch: {
    ext: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
    open3(n) {
      if (!n) {
        this.appPath("/vote/" + this.params.id, true);
        this.$nextTick(() => {
          this.sharevote();
        });
      }
    },
  },
  methods: {
    isevent(i) {
      if (this.ismy) {
        return true;
      }
      return +i.staff_id === +this.sid;
    },
    totitle(e) {
      if (!e) {
        return "";
      }
      let t = (e + "").split("/#br#/").join("<br>");
      return t;
    },
    onsahre() {
      this.$emit("share");
      this.$nextTick(() => {
        this.sharevote();
      });
    },
    onendedit() {
      this.open = false;
      this.init();
    },
    onedit(e) {
      this.child = e;
      this.open2 = true;
    },
    ondel(i, j) {
      this.$js.modeldel(() => {
        this.$api.http("votedelonce", { voters_id: i.voters_id }, () => {
          this.$toast("删除完成");
          this.item.splice(j, 1);
        });
      });
    },
    ondet(e) {
      this.appPath("/vote/" + this.params.id + "&" + e.voters_id, true);
      this.$api.http("votedetail", { voters_id: e.voters_id }, (r) => {
        this.child = r;
        this.open3 = true;
        if (!this.params.cid) {
          this.params.cid = e.voters_id;
        }
        this.$nextTick(() => {
          this.sharevote();
        });
      });
      // this.$api.http("voteup", { voters_id: e.voters_id }, () => {});
    },
    onPage(page, f) {
      this.open1 = false;
      this.open2 = false;
      this.child = {};
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "voteinfo",
        { page, vote_id: this.ext.vote_id, full_name: this.sval },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          this.item = this.item.concat(e);
          this.$refs.page.onFinish(e.length < 20);
        }
      );
    },
    sharevote(flag) {
      let n = ["请为", this.child.full_name, "投上一票！"].join("");
      this.$js.wxshareh5(
        "vote",
        {
          id: flag ? "" : this.params.cid,
          path: this.$route.path,
          did: this.params.id || this.det.vote_id,
        },
        flag ? "您的好友分享给你为宝宝投票" : n,
        false,
        {
          logo: this.det.cover_image,
          title: (this.det.activity_name + "").replace("/#br#/", " "),
        }
      );
    },
    init() {
      this.params = this.$route.params;
      this.$nextTick(() => {
        this.$api.http("votedet", { vote_id: this.ext.vote_id }, (r) => {
          this.det = r;
          this.ismy = +r.staff_id === +this.sid;
          this.isedit2 = +r.state !== 1;
          if (this.params.cid) {
            this.ondet({ voters_id: this.params.cid });
          } else {
            this.sharevote(true);
          }
        });
      });
    },
  },
  mounted() {
    this.ext = this.value;
    this.init();
  },
};
</script>
<style lang='less' scoped>
.vote_det {
  .temp {
    position: relative;
    // height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
    h2,
    p,
    .tool {
      z-index: 3;
      position: relative;
    }
    h2 {
      padding: 5px 10px;
      font-weight: 650;
      font-size: 16px;
      line-height: 1.2;
    }
    p {
      font-size: 14px;
      color: #999;
      margin: 5px 0 10px;
      background-color: rgba(255, 255, 255, 0.7);
      padding: 5px;
      border-radius: 5px;
    }
  }
  .cover_fixed_img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    filter: blur(2px);
    opacity: 0.8;
    z-index: 1;
    img {
      object-fit: cover;
    }
  }
  .list {
    padding: 10px;
    .btl {
      position: fixed;
      bottom: 0;
      z-index: 30;
      left: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 10px;
      transition: all 0.3s;
    }
    li {
      box-sizing: border-box;
      position: relative;
      font-size: 14px;
      border-radius: 10px;
      background-color: #fff;
      padding: 10px;
      .status {
        position: absolute;
        right: 0;
        top: 0;
        padding: 10px 20px;
        line-height: 1.2;
        z-index: 5;
        color: #ff976a;
        font-size: 14px;
        &.status1 {
          right: 70px;
          color: tomato;
        }
      }
      & + li {
        margin-top: 10px;
      }
      &.add_list {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px 0;
        border: 1px dashed #18bc9c;
        color: #18bc9c;
        .van-icon {
          font-size: 30px;
          margin-bottom: 8px;
        }
      }
      h2 {
        font-weight: 600;
        padding: 10px 70px 10px 0;
      }
      p {
        font-size: 15px;
        color: #999;
      }
      .rank {
        float: right;
        color: #999;
        font-size: 14px;
        transform: translateY(-15px);
        b {
          padding-left: 5px;
        }
      }
      .imgs {
        padding-top: 10px;
        .ig {
          width: 50px;
          height: 50px;
          margin: 0 8px 8px 0;
          img {
            object-fit: cover;
          }
        }
      }
    }
  }
  .author {
    justify-content: center;
    box-sizing: border-box;
    align-items: center;
    padding: 10px;
    .logo {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
    .text {
      width: calc(100% - 50px);
      b {
        font-weight: 650;
      }
    }
  }
  .search {
    background-color: #fff;
  }
}
</style>
