<template>
  <div class="chant_in">
    <template v-if="!pageshow">
      <van-empty description="暂未开课"></van-empty>
    </template>
    <template v-else>
      <v-page ref="page"
              @on-page="onPage">
        <van-empty v-if="!item.length"></van-empty>
        <ul>
          <li v-for="(i, j) in item"
              :key="j"
              class="flex"
              @click.stop="ondet(i)">
            <div class="logo">
              <van-image v-lazy
                         :src="i.avatar || i.child_base_map"></van-image>
            </div>
            <div class="text">
              <div class="name">
                {{ i.child_name }}
                <van-tag v-if="+i.type === 2"
                         type="primary">家长打卡</van-tag>
              </div>
              <div class="players"
                   @click.stop>
                <template v-if="i.play">
                  <div :id="'player-' + j"
                       @click.stop=""></div>
                </template>
                <template v-else>
                  <div class="poster">
                    <van-image :src="i.picture || ''"
                               fit="cover"></van-image>
                    <div class="player"
                         @click.stop="onCreatePlayer(i, j)">
                      <van-icon name="play-circle-o" />
                    </div>
                  </div>
                </template>
              </div>
              <div class="content"
                   v-html="i.content"></div>
              <div class="tools flex van-hairline--top">
                <span @click.stop="onvent('like', i, j)">
                  <img :src="icons(+i.give === 2 ? 201 : 202)"
                       alt=""
                       class="db_image" />
                  <b>点赞 ({{ tonum(i.like_count) }})</b>
                </span>
                <span @click.stop="onvent('comment', i, j)">
                  <img :src="icons(203)"
                       alt=""
                       class="db_image" />
                  <b>评论 ({{ tonum(i.comment_count) }})</b>
                </span>
                <span @click.stop="onvent('share', i, j)">
                  <img :src="icons(200)"
                       alt=""
                       class="db_image" />
                  <b>分享</b>
                </span>
              </div>
              <div class="comments"
                   v-if="i.country_study_comment && i.country_study_comment.length">
                <div class="comment_line"
                     v-for="(x, y) in tocommentmore(i.country_study_comment)"
                     :key="y + 's' + j"
                     @click.stop="onvent('commentparent', i, j, y)">
                  <b class="names col_primary">{{ x.name }}:</b>
                  <b v-html="x.comment"></b>
                </div>
                <div class="comment_line"
                     v-if="i.comment_count > 3"
                     @click.stop="ondet(i)">
                  <b class="col_info">更多回复</b>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </v-page>
    </template>
    <transition name="van-fade">
      <div class="app_show_fixed tran top"
           v-if="comment.open"
           style="z-index: 502">
        <span class="comment_cover"
              @click="onCommentReset"></span>
        <v-c v-model="comment.message"
             @change="onCommentSubmit"
             @end="comend"></v-c>
      </div>
    </transition>
    <v-f v-model="open"
         :footer="false"
         bgc="#f8f7fa">
      <v-d :ext="ext"
           @likes="setlikes"
           @comments="setcomments"
           @shares="onshares"></v-d>
    </v-f>
  </div>
</template>

<script>
import vC from "../../../class/comment.vue";
import vF from "../../../private/fixed.vue";
import vD from "./det.vue";
export default {
  props: {
    value: null,
    ids: [String, Number],
  },
  data() {
    return {
      player: [],
      comment: {
        open: false,
        message: "",
      },
      open: false,
      ext: {},
      pageshow: false,
    };
  },
  components: { vC, vF, vD },
  computed: {
    item: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
  },
  watch: {
    item: {
      handler(v) {
        this.$emit("input", v);
      },
      deep: true,
    },
  },
  methods: {
    tocommentmore(e) {
      // eslint-disable-next-line
      let v = demo.copy(e).map((s) => {
        let c = s.country_study_comment || [];
        if (c.length) {
          return [s, ...c];
        }
        return [s];
      });
      let b = [];
      v.forEach((r) => {
        b = b.concat(r);
      });
      return b;
    },
    setlikes(g, l, id) {
      let index = this.item
        .map((s) => {
          return s.country_study_child_id === id;
        })
        .indexOf(true);
      if (index >= 0) {
        this.$set(this.item[index], "give", g);
        this.$set(this.item[index], "like_count", l);
      }
    },
    setcomments(c, id) {
      let index = this.item
        .map((s) => {
          return s.country_study_child_id === id;
        })
        .indexOf(true);
      if (index >= 0) {
        this.$set(this.item[index], "comment_count", c);
      }
    },
    onCommentSubmit(e) {
      if (e === "") return this.$toast("请输入评论");
      let index = this.comment.$index;
      let o = {};
      if (this.comment.$child) {
        let index = this.comment.$childindex;
        o = {
          parent_id: this.comment.country_study_comment[index].parent_id || 0,
          r_id: this.comment.country_study_comment[index].r_id || 0,
        };
        e = "回复" + this.comment.country_study_comment[index].name + "：" + e;
      }
      this.$api.http(
        "chantlistcomment",
        {
          country_study_child_id: this.comment.country_study_child_id,
          comment: e,
          parent_id: o.parent_id || 0,
          r_id: o.r_id || 0,
          reply_client: 2,
        },
        (r) => {
          // push 到 country_study_comment
          if (this.comment.comment_count < 3) {
            let d = this.comment.country_study_comment;
            d.push(r);
            this.$set(this.item[index], "country_study_comment", d);
          }
          this.$set(
            this.item[index],
            "comment_count",
            this.comment.comment_count + 1
          );
          this.$toast("评论成功");
          this.onCommentReset();
        }
      );
    },
    onCommentReset() {
      this.comment = {
        open: false,
        message: "",
      };
    },
    comend(id) {
      this.item = this.item.filter((r) => {
        return r.country_study_child_id !== id;
      });
      this.onCommentReset();
    },
    ondet(e) {
      if (this.player.length) {
        this.player.forEach((k) => {
          if (k.video) {
            k.pause();
          }
        });
      }
      this.ext = e;
      this.open = true;
    },
    // 创建播放器 播放视频
    onCreatePlayer(e, index) {
      e.play = true;
      // eslint-disable-next-line
      let pic = demo.siteConfig.icon("player", "player", ".jpg");
      this.$nextTick(() => {
        if (!e.player) {
          // eslint-disable-next-line
          this.player[index] = new DEMO_Player({
            // eslint-disable-next-line
            container: demo.$.id("player-" + index),
            video: {
              url: e.video,
              pic: e.picture || pic,
            },
            mutex: true,
            preload: "none",
          });
          this.player[index].play();
        }
      });
    },
    onvent(type, data, index, child) {
      switch (type) {
        case "comment":
          this.comment = { open: true, message: "", $index: index, ...data };
          this.$nextTick(() => {
            this.comment.open = true;
          });
          break;
        case "commentparent":
          this.comment = {
            open: true,
            message: "",
            $index: index,
            $child: true,
            $childindex: child,
            ...data,
          };
          this.$nextTick(() => {
            this.comment.open = true;
          });
          break;
        case "like":
          let status = +data.give === 2; // 未
          this.$api.http(
            "chantlike",
            {
              country_study_child_id: data.country_study_child_id,
              status: status ? 1 : 2,
              open_id: "",
            },
            () => {
              this.$set(this.item[index], "give", status ? 1 : 2);
              this.$set(
                this.item[index],
                "like_count",
                status ? data.like_count + 1 : data.like_count - 1
              );
            }
          );
          break;
        case "share":
          this.$toast("请点击微信右上角...分享给您的朋友");
          this.onshares(data);
          break;
        default:
      }
    },
    onshares(e) {
      this.$emit("share", e);
    },
    icons(num) {
      // eslint-disable-next-line
      return demo.siteConfig.icon(num, "parent");
    },
    tonum(v) {
      return v > 99 ? "99+" : v;
    },
    init() {
      if (this.ids > 0) {
        this.pageshow = true;
      }
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page && this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "chantlist",
        {
          page,
          class_schedule_country_id: this.ids,
        },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          this.item = this.item.concat(
            e.list.map((s) => {
              s.play = false;
              return s;
            })
          );
          this.$refs.page.onFinish(e.list.length < 20);
        }
      );
    },
  },
  mounted() {
    this.item = this.value;
    this.init();
  },
  destroyed() {
    if (this.player.length) {
      this.player.forEach((k) => {
        if (k.video) {
          k.destroy();
        }
      });
    }
  },
};
</script>
<style lang='less' scoped>
li {
  margin: 10px;
  padding-left: 10px;
  box-sizing: border-box;

  .logo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 5px;
    overflow: hidden;
    transform: translateY(20px);
  }

  .text {
    width: calc(100% - 55px);
    border-radius: 5px;
    background-color: #fff;
    box-sizing: border-box;
    padding: 10px;
    font-size: 16px;
  }

  .players {
    height: 150px;
    background-color: #222;
    border-radius: 5px;
    overflow: hidden;
    margin: 5px 0;
  }

  .name {
    font-weight: 650;
    padding: 8px 0;
  }

  .content {
    padding: 5px;
    font-size: 14px;
    color: #999;
  }

  .tools {
    height: 40px;
    margin-bottom: 5px;
    font-size: 12px;
    padding-top: 5px;

    span {
      flex: 1;
      display: flex;
      align-items: center;

      img {
        width: 30px;
        height: 30px;
        margin-right: 2px;
        transform: scale(0.5);
      }

      b {
        transform: translateX(-6px);
      }
    }
  }

  .comments {
    padding: 0 5px;

    .comment_line {
      font-size: 14px;
      padding: 2px 0;
      color: #999;

      .names {
        vertical-align: top;
      }

      .name {
        padding-right: 5px;
        opacity: 0.9;
      }

      b:last-child {
        display: inline-block;
        word-break: break-all;
      }
    }
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

.comment_cover {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
}
</style>
