<template>
  <div class="detail">
    <div class="app_top">
      <div class="player" v-if="childdet.video">
        <iframe
          :src="toframesrc(childdet)"
          class="db_image"
          frameborder="0"
          allowfullscreen="allowfullscreen"
          mozallowfullscreen="mozallowfullscreen"
          msallowfullscreen="msallowfullscreen"
          oallowfullscreen="oallowfullscreen"
          webkitallowfullscreen="webkitallowfullscreen"
        ></iframe>
      </div>
      <div
        class="swipe"
        v-else-if="childdet.picture && childdet.picture.length"
      >
        <van-swipe>
          <van-swipe-item v-for="(x, y) in childdet.picture" :key="y">
            <van-image
              :src="x"
              fit="contain"
              @click.stop="appShowImage(childdet.picture, y)"
            ></van-image>
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="rank flex">
        <section>
          <b>{{ childdet.ranking }}</b>
          <p>排名</p>
        </section>
        <section v-if="+childdet.ranking > 1">
          <b>{{ childdet.from_previous_place }}</b>
          <p>距离上一名积分</p>
        </section>
        <section>
          <b>{{ childdet.score }}</b>
          <p>积分</p>
        </section>
      </div>
    </div>
    <div class="content">
      <p>班级：{{ childdet.grade }} {{ childdet.nickname }}</p>
      <p>学号：{{ childdet.no }}</p>
      <p>作品说明：{{ childdet.content || "暂无" }}</p>
    </div>
    <van-divider content-position="left">评论({{ commentlen }})</van-divider>
    <v-c-l v-model="commentlist" @write="onwritewrite"></v-c-l>
    <v-c unfocus v-model="comment.msg" @change="onchangecomment"></v-c>
  </div>
</template>

<script>
import vC from "../../class/comment.vue";
import vCL from "../../private/comment_list.vue";
export default {
  props: {
    value: null,
  },
  data() {
    return {
      commentlist: [],
      comment: {},
      commentlen: 0,
    };
  },
  components: { vC, vCL },
  computed: {
    childdet: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
  },
  watch: {
    childdet: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
  },
  methods: {
    // 生成 评论 配置
    onwritewrite(e, index = -1) {
      this.comment = {
        msg: "@" + e.name + ":",
        parent_id: e.voters_comment_id,
        r_id: e.u_id,
        toname: e.name,
        index,
      };
    },
    // 获取评论 列表
    onwritelist(limit = 20, page = 1) {
      if (page === 1) {
        this.commentlist = [];
      }
      this.$api.http(
        "votecomment",
        { page, limit, voters_id: this.childdet.voters_id },
        (r) => {
          this.commentlen = r.total;
          let iscount = Math.ceil(r.total / limit) > page;
          if (iscount) {
            this.onwritelist(limit, page + 1);
          }
          this.commentlist = this.commentlist.concat(r.list || []);
        }
      );
    },
    // 评论
    onchangecomment(e) {
      let comment = e;
      let s = "@" + this.comment.toname + ":";
      if (this.comment.toname && e.indexOf(s) >= 0) {
        comment = e.replace(s, "回复" + this.comment.toname + "：");
      } else {
        this.comment = {
          msg: e,
          index: -1,
        };
      }
      this.$api.http(
        "votewrite",
        {
          voters_id: this.childdet.voters_id,
          comment,
          parent_id: this.comment.parent_id || "0",
          r_id: this.comment.r_id || "",
          reply_client: "2",
        },
        (res) => {
          this.$toast("评论成功");
          if (this.comment.index >= 0) {
            let a = this.commentlist[this.comment.index].voters_comment || [];
            a.push(res);
            this.$set(
              this.commentlist[this.comment.index],
              "voters_comment",
              a
            );
          } else {
            this.commentlist.push(res);
            this.commentlen += 1;
          }
          this.comment = {
            msg: "",
          };
        }
      );
    },
    toframesrc(e) {
      // eslint-disable-next-line
      let t = demo.siteConfig.api.h5 + "player/?auto=1&url=";
      return [t, e.video, "&pic=", e.video_picture].join("");
    },
  },
  mounted() {
    this.childdet = this.value;
    this.$nextTick(() => {
      this.onwritelist();
    });
  },
};
</script>
<style lang='less' scoped>
.detail {
  font-size: 14px;
  line-height: 1.2;
  h1 {
    font-weight: 650;
    font-size: 18px;
    padding: 15px 10px;
    border: 1px dashed #eee;
  }
  .player,
  .swipe,
  .van-swipe {
    height: 210px;
  }
  .rank {
    padding: 10px 5px;
    background-color: #fff;
    section {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 14px;
      b {
        font-size: 16px;
        font-weight: 650;
        padding: 5px 0;
        color: #38f;
      }
    }
  }
  .content {
    box-sizing: border-box;
    padding: 10px 20px;
    > p {
      font-size: 14px;
      padding: 0 10px;
      line-height: 1.2;
      margin-top: 8px;
      color: #999;
    }
  }
}
</style>
