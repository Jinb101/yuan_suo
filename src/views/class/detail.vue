<template>
  <div class="class_detail">
    <section class="l_box flex van-hairline--bottom">
      <div class="avatar"
           @click.stop="onUserClass(i, j)">
        <van-image :src="i.avatar"></van-image>
      </div>
      <div class="strong">
        <span class="is_shield"
              v-if="+i.is_shield === 1">已被屏蔽</span>
        <h2>{{ i.nickname }}</h2>
        <p class="text"
           v-html="i.content"></p>
        <template v-if="+i.type === 2">
          <!-- video -->
          <div class="video_box">
            <template v-if="play">
              <div id="player-detail"
                   @click.stop=""></div>
            </template>
            <template v-else>
              <div class="poster">
                <van-image :src="i.imgs[0] ? i.imgs[0].cover : ''"
                           fit="cover"></van-image>
                <div class="player"
                     @click.stop="onCreatePlayer(i, j)">
                  <van-icon name="play-circle-o" />
                </div>
              </div>
            </template>
          </div>
        </template>
        <template v-else>
          <!-- image -->
          <div class="image_box flex fw">
            <div class="pic"
                 :class="toLenOfClass(i.imgs.length)"
                 v-for="(x, y) in i.imgs"
                 :key="y + '-' + j">
              <van-image :src="x.img"
                         fit="cover"
                         @click.stop="openView(i, y)"
                         lazy-load></van-image>
            </div>
          </div>
        </template>
        <div class="tool flex">
          <span class="time">{{ appTimeout(i.release_time, true) }}</span>
          <v-more v-model="i.open"
                  class="tag"
                  :item="toTag(i, j)"
                  @change="onTagChange"></v-more>
        </div>
        <div class="comment_to_like flex">
          <div class="key"
               @click.stop="
                 onTagChange({
                   ext: i,
                   type: 'like',
                   index: j,
                 })
                 ">
            <div class="icon">
              <img :src="classicon[+i.is_like === 1 ? 0 : 1]"
                   alt=""
                   class="db_image" />
            </div>
            <b>{{ +i.is_like === 1 ? "取消" : "" }}点赞 ({{ i.likes.length }})</b>
          </div>
          <div class="key"
               @click.stop="
                 onTagChange({
                   ext: i,
                   type: 'comment',
                   index: j,
                 })
                 ">
            <div class="icon">
              <img :src="classicon[2]"
                   alt=""
                   class="db_image" />
            </div>
            <b>评论 ({{ i.comment_count }})</b>
          </div>
        </div>
        <div class="likes flex"
             v-if="i.likes && i.likes.length">
          <i><img :src="classicon[0]"
                 alt=""
                 class="db_image" /></i>
          <div class="flex fw like">
            <template v-for="(x, y) in i.likes">
              <template v-if="y > 19"> </template>
              <template v-else>
                <b :key="y + 'likes'"
                   v-if="y > 0">、</b>
                <span :key="y + 'like'">{{ x.like_nickname }}</span>
              </template>
            </template>
            <template v-if="i.likes.length > 19">
              <b>等{{ i.likes.length }}人觉得很赞</b>
            </template>
          </div>
        </div>
        <div v-if="i.comment.length > 0"
             class="commeents flex">
          <review :item="i"
                  :curIndex="j"
                  @deleteCommentItem="deleteCommentItem"
                  @oepnComment="onCommentAt"
                  :wherdets="true"
                  @details="onCommentMore"
                  :user="user"></review>
        </div>

      </div>
    </section>
    <div v-if="!isWeChatOnMobile"
         :style="!right_Menu ? { opacity: 0, height: '0', width: '0' } : { opacity: 1 }"
         class="right_menu"
         ref="rightMenu">
      <van-cell title="下载"
                @click.stop="downloadImg" />
    </div>
    <div ref="mask"
         v-if="!isWeChatOnMobile"
         @click="onMousedown"
         @contextmenu="(e) => {
           this.onConMenu(e)
         }"
         :style="mask_bg ? { height: '100%' } : {}"
         class="fullmask">
      <van-icon v-if="mask_bg"
                name="arrow-left"
                size="1.5rem"
                @click.stop="iconClick($event, 'left')" />
      <van-icon v-if="mask_bg"
                name="arrow"
                size="1.5rem"
                @click.stop="iconClick($event, 'right')" />
    </div>
  </div>
</template>

<script>
import review from "./review.vue";
export default {
  props: {
    value: null,
    user: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: { review },
  data() {
    return {
      ImagePreview: null,
      right_Menu: false,
      isLeftMouseDown: false,
      mask_bg: false,
      startX: 0,
      isWeChatOnMobile: null,
      newImglist: [],
      player: null,
      comment: {
        message: "",
        open: false,
      },
      commentlist: [],
      end: true,
      end_id: "",
      classicon: [200, 201, 202].map((s) => {
        // eslint-disable-next-line
        return demo.siteConfig.icon(s, "private");
      }),
      block: false,
      play: false,
    };
  },
  inject: ["appTimeout", "appShowImage", "appPath"],
  computed: {
    i: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    j() {
      return this.i.$index;
    },
  },
  watch: {
    i: {
      handler(n) {
        if (n.$comment && n.$comment.name && this.end) {
          this.commentlist.push(n.$comment);
        }
        this.$emit("input", n);
      },
      deep: true,
    },
  },
  methods: {
    //
    onMousedown() {
      this.isLeftMouseDown = true;
      this.startX = event.clientX;
      if (this.mask_bg && !this.right_Menu) {
        this.mask_bg = false;
        this.right_Menu = false
        this.ImagePreview.value = false;
        this.isLeftMouseDown = false;
        // 退出预览
        return
      }
      if (this.right_Menu) {
        this.right_Menu = false
      }
    },
    iconClick(event, direction) {
      // 获取 van-swipe__track 节点
      const track = document.querySelector('.van-swipe__track');
      // 获取 van-swipe-item 的宽度
      const itemWidth = track.querySelector('.van-swipe-item').offsetWidth;
      // 获取当前 transform 属性值
      const transform = window.getComputedStyle(track).getPropertyValue('transform');
      let curIndex = this.curImgIndex + 1;
      console.log(this.curImgIndex);
      console.log('transform:', transform);
      // 在点击事件处理程序中，可以访问事件对象和传递的参数
      console.log('点击事件对象：', event);
      console.log('点击方向：', direction);

      // 根据点击方向设置 transform 属性
      if (direction === 'left') {
        // 向左点击
        if (curIndex === 1) {
          // 如果当前点击的是最后一张图片，则回到初始位置
          track.style.transform = `translateX(-${(this.newImglist.length - 1) * itemWidth}px)`;
          this.curImgIndex = this.newImglist.length - 1
        } else {
          track.style.transform = `translateX(-${(curIndex - 2) * itemWidth}px)`;
          this.curImgIndex--;
        }
      } else if (direction === 'right') {
        // 向右点击
        if (curIndex === this.newImglist.length) {
          // 如果当前点击的是第一张图片，则移动到最后一张图片的位置
          track.style.transform = `translateX(${0}px)`;
          console.log(123);
          this.curImgIndex = 0
        } else {
          // 向右移动一张图片的宽度
          track.style.transform = `translateX(-${(curIndex) * itemWidth}px)`;
          this.curImgIndex++
        }
      }
      track.style.transitionDuration = '300ms'
      this.ImagePreview.startPosition = this.curImgIndex
      // console.log(this.ImagePreview.startPosition = this.curImgIndex);
      this.$nextTick()
    },
    // 下载 downloadImg
    downloadImg() {
      if (!this.right_Menu) {
        return
      }
      try {
        let imgList = this.ImagePreview.images;
        let index = this.ImagePreview.$data.active;
        const link = document.createElement('a');
        link.href = imgList[index];
        link.download = 'img_' + new Date().getTime();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.$toast('下载成功');
        this.right_Menu = false;
      } catch (error) {
        this.$toast('确认图片地址');
        console.error('下载失败', error);
      }
    },
    // 鼠标右键
    onConMenu(event) {
      // 在移动设备上访问
      event.preventDefault(); // 阻止默认的上下文菜单行为
      if (!this.right_Menu) {
        this.right_Menu = true
      }
      this.$nextTick()
      const e = event || window.event;
      // 获取 rightMenu 元素
      const rightMenu = this.$refs.rightMenu;
      // 获取当前视图中右键点击的坐标点
      const scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
      const scrollY = document.documentElement.scrollTop || document.body.scrollTop;
      const x = e.pageX || e.clientX + scrollX;
      const y = e.pageY || e.clientY + scrollY;
      // 设置 rightMenu 的位置
      const menuWidth = rightMenu.offsetWidth;
      const menuHeight = rightMenu.offsetHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let left = x;
      let top = y;

      // 检查右边界
      if (x + menuWidth > windowWidth) {
        left = x - menuWidth;
      }

      // 检查左边界
      if (left < 0) {
        left = x;
      }

      // 检查下边界
      if (y + menuHeight > windowHeight) {
        top = y - menuHeight;
      }

      // 检查上边界
      if (top < 0) {
        top = y;
      }
      console.log(left);
      // 设置 rightMenu 的位置
      rightMenu.style.left = left === 1 ? '80%' : left + 'px';
      rightMenu.style.top = top === 1 ? '19%' : top + 'px';
      document.body.appendChild(rightMenu);
    },
    openView(i, y) {
      let opt = {
        onClose: () => {
          this.right_Menu = false;
          this.ImagePreview = null;
        },
        onChange: () => {
          this.right_Menu = false;
        },
      }
      this.ImagePreview = this.appShowImage(
        i.imgs.map((s) => {
          return s.img;
        }),
        y,
        opt
      )
      if (!this.isWeChatOnMobile) {
        this.$nextTick(() => {
          let maskNode = this.$refs.mask;
          // // 添加右键事件监听器
          this.newImglist = i.imgs.map((s) => {
            return s.img;
          })
          this.mask_bg = true
          document.body.appendChild(maskNode);
        })
      }
      this.curImgIndex = y;
    },
    // 删除评论
    deleteCommentItem(c, i) {
      this.$js.model("是否删除该评论", "", (res) => {
        if (res) {
          this.$api.http('delComment', {
            comment_id: c.id
          }, (r) => {
            this.value.comment.forEach((comment, index) => {
              if (comment.id === c.id) {
                // 删除对应的 comment 数据
                this.value.comment.splice(index, 1);
                this.value.comment_count--;
              }
            });
            this.$toast("删除成功");
            this.$emit('details', c, i)
          })
        }
      });
    },
    // 返回操作按钮组
    toTag(e, index) {
      // 点赞/不点赞 评论 屏蔽/不屏蔽 删除
      let a = [8];
      if (+e.type === 2) {
        // 下载 3
        a.push(3);
      }
      if (+e.u_id === +this.user.id) {
        // 删除 1
        a.push(1);
      }

      if (+e.from_client === 1 && +e.is_shield !== 1) {
        // 屏蔽 6
        a.push(6);
      }
      if (+e.is_shield === 1) {
        // 取消屏蔽 7
        a.push(7);
      }

      if (+e.is_like === 1) {
        // 取消点赞 2
        a.push(2);
      } else {
        // 点赞 0
        a.push(0);
      }
      // eslint-disable-next-line
      return demo.siteConfig.text.tag(a, { index, ext: e });
    },
    // 检测图片数量 并返回 布局
    toLenOfClass(len) {
      let s = "pic_mini";
      switch (len) {
        case 1:
          s = "pic_big";
          break;
        case 2:
        case 4:
          s = "pic_small";
          break;
        default:
      }
      return s;
    },
    // 创建播放器 播放视频
    onCreatePlayer(e, index) {
      this.play = true;
      this.$nextTick(() => {
        if (!e.player) {
          // eslint-disable-next-line
          this.player = new DEMO_Player({
            // eslint-disable-next-line
            container: demo.$.id("player-detail"),
            video: {
              url: e.imgs[0].img,
              pic: e.imgs[0].cover,
            },
            mutex: true,
            preload: "none",
          });
          this.player.play();

          this.player.on("error", () => {
            this.player.switchVideo({
              url: e.imgs[0].img + "?v" + Date.now(),
              pic: e.imgs[0].cover,
            });
          });
        }
      });
    },
    // 操作中控
    onTagChange(e) {
      let edata = e.ext;
      let ts = this;
      switch (e.type) {
        case "like":
        case "unlike":
          let f = +edata.is_like === 0; // 未点赞
          let c = edata.likes_count;
          let cs = edata.likes || [];
          this.$api.http("classlike", { s_id: edata.id }, () => {
            if (f) {
              c += 1;
              cs.push({ like_nickname: ts.user.nickname });
            } else {
              c -= 1;
              cs = cs.filter((r) => {
                return r.like_nickname !== ts.user.nickname;
              });
            }
            this.$set(this.i, "is_like", f ? 1 : 0);
            this.$set(this.i, "likes_count", c);
            this.$set(this.i, "likes", cs);
            c = null;
            cs = null;
          });
          break;
        case "del":
          this.$js.model("是否删除班级圈", "", (res) => {
            if (res) {
              this.$api.http("classdeel", { s_id: edata.id }, () => {
                this.$toast("删除成功");
                this.$emit("del", { ...e, type: "del_end" });
              });
            }
          });
          break;
        case "comment":
          console.log(this.comment, edata);
          this.comment = { open: true, message: "", $index: e.index, ...edata };
          this.$nextTick(() => {
            this.comment.open = true;
            this.$emit("comment", this.comment);
          });
          break;
        case "down":
          let url = (edata.imgs[0] || {}).img;
          if (url) {
            window.location.href = url;
          } else {
            this.$toast("不支持下载");
          }
          break;
        case "in":
        case "out":
          let n = e.type === "in" ? "解除" : "";
          this.$js.model(
            n + "屏蔽操作",
            "是否" +
            n +
            "屏蔽？(" +
            n +
            "屏蔽后其他家长" +
            (e.type === "in" ? "" : "不") +
            "能看到这条朋友圈)",
            (res) => {
              if (res) {
                this.$api.http("classout", { show_id: edata.id }, () => {
                  if (e.type === "in") {
                    this.$set(this.i, "is_shield", "0");
                    this.$set(this.i, "from_client", "1");
                  } else {
                    this.$set(this.i, "is_shield", "1");
                  }
                  this.$toast(n + "屏蔽成功");
                });
              }
            }
          );
          break;
        default:
      }
    },
    // @评论
    onCommentAt(e, index) {
      let uid = this.user.id;
      // 点击自己时
      if (uid === e.u_id) {
        this.comment = {
          open: true,
          message: "",
          $index: index,
          ...e,
          comment: this.i.comment,
          comment_count: this.i.comment_count,
          id: this.i.id,
        };
        this.$emit("comment", this.comment);
        return 0;
      }
      this.comment = {
        open: true,
        message: "@" + e.name + "：",
        $index: index,
        ...e,
        comment: this.i.comment,
        comment_count: this.i.comment_count,
        id: this.i.id,
        obj: {
          parent_id: e.id,
          r_id: e.u_id,
          reply_client: e.from_client,
        },
      };
      this.$emit("comment", this.comment);
    },
    // 更多评论 进入详情
    onCommentMore(e, index) {
      this.detail = { ...e, $index: index, $more: true };
      this.detail_open = true;
    },
    onUserClass(e) {
      this.$emit("close");
      this.appPath("/class/" + e.id, true);
    },
    async init() {
      let val = this.i;
      if (val.id) {
        if (val.comment_count > val.comment.length) {
          let id = val.comment[val.comment.length - 1].id;
          this.commentlist = [];
          // await this.onCommentPage(id); // 等待 onCommentPage 执行完毕
          this.$nextTick()
          // 在这里进行处理，确保 onCommentPage 执行完毕后再执行下面的代码
        }
      }
    },
    onCommentPage(id) {
      return new Promise((resolve, reject) => {
        console.log(id);
        this.$api.http("classcomments", { id, s_id: this.i.id }, (r) => {
          if (r.length > 0) {
            this.end = r.length !== 10;
            this.commentlist = [...this.commentlist, ...r];
            if (!this.end) {
              this.end_id = r[r.length - 1].id;
            }
          }
          resolve(); // 异步请求完成后调用 resolve
        });
      });
    },

  },
  mounted() {
    // 判断用户设备类型并执行相应逻辑
    this.isWeChatOnMobile = /MicroMessenger/i.test(navigator.userAgent) && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (this.isWeChatOnMobile) {
      console.log('在移动设备上访问');
    } else {
      // 在 mounted 钩子函数中给 body 元素添加右键事件
      console.log('不在手机微信中', this.isWeChatOnMobile);
    }
    console.log(this.i);
    this.i = this.value;
    this.init();
  },
  destroyed() {
    this.i.play = false;
    if (this.player && this.player.video) {
      this.player.destroy();
    }
  },
};
</script>
<style lang='less' scoped>
.class_detail {
  font-size: 15px;
}

.l_box {
  padding: 15px 10px;
  font-size: 15px;

  .avatar {
    width: 45px;
    height: 45px;
    background-color: #f7f7f7;
    border-radius: 2px;
    overflow: hidden;
  }

  .strong {
    width: calc(100% - 45px);
    box-sizing: border-box;
    padding-left: 10px;
    color: #171518;
    position: relative;

    h2 {
      padding: 5px 0;
      font-weight: 650;
      color: #646788;
    }

    .text {
      line-height: 1.5;
      word-break: break-all;
      margin-bottom: 2px;
    }

    .is_shield {
      position: absolute;
      right: 5px;
      top: 5px;
      font-size: 12px;
      color: #999;
    }
  }

  .tool {
    padding: 8px 0;
    line-height: 20px;

    .time {
      color: #c9c9c9;
      font-size: 13px;
      flex: 1;
      letter-spacing: 1px;
    }

    .tag {
      position: relative;
      padding: 0 5px 0 15px;
      font-size: 20px;

      &::before {
        position: absolute;
        content: "";
        width: 150%;
        height: 200%;
        left: -25%;
        top: -50%;
      }
    }
  }

  .image_box {
    .pic {
      background-color: #f7f7f7;
      margin-bottom: 5px;
      margin-right: 7px;
      border-radius: 3px;
      overflow: hidden;

      &.pic_big {
        width: 200px;
        height: auto;
        min-height: 200px;
      }

      &.pic_small {
        width: 146px;
        height: 146px;

        &:nth-child(2n) {
          margin-right: 0;
        }
      }

      &.pic_mini {
        width: 95px;
        height: 95px;

        &:nth-child(3n) {
          margin-right: 0;
        }
      }
    }
  }

  .likes,
  .commeents {
    background-color: #f7f7f7;
    padding: 8px;
    line-height: 16px;
    border-radius: 5px 5px 0 0;

    >i {
      width: 22px;
      height: 22px;

      img {
        transform: scale(0.7) translateY(-10%) translateX(-5%);
      }
    }

    .like,
    ul {
      width: calc(100% - 22px);
      font-size: 13px;
    }
  }

  .commeents {
    border-radius: 0 0 5px 5px;

    li {
      box-sizing: border-box;
      padding-right: 20px;
      position: relative;
      line-height: 20px;

      &+li {
        margin-top: 3px;
      }

      >b {
        display: inline-block;
      }

      .del {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 20px;
        height: 20px;
        font-size: 17px;
        color: gray;
        z-index: 5;

        &.un {
          color: tomato;
        }
      }
    }

    span {
      color: #3d97c7;
      vertical-align: top;
    }
  }

  .video_box {
    height: 170px;
    background-color: #232323;
    border-radius: 5px;
    overflow: hidden;
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

.comment_to_like {
  margin-bottom: 5px;

  .key {
    min-width: 33%;
    font-size: 12px;
    display: flex;
    align-items: center;
    margin-right: 5%;
    color: #b9b9b9;

    .icon {
      width: 25px;
      height: 25px;
      margin-right: 2px;
      transform: scale(0.7);
    }
  }
}

.review {
  display: flex !important;
  justify-content: start !important;
  align-items: start !important;

  ul {
    margin-left: 2px;
    width: 100%;
  }

  li {
    margin-bottom: 8px;
    width: 100%;
    display: flex;
    justify-content: start;
    align-items: start;

    .text-hw {
      width: 24%;
      font-size: 12.5px;
      color: #3d97c7;
      text-align: left;
      letter-spacing: 0.09em;
    }

    .com_html {
      width: 55%;
      font-size: 12.5px;
      padding-right: 8px;
      word-wrap: break-word;
      text-align: left;

    }

  }

  .del {
    height: 100%;
    display: flex;
    justify-content: start;
    align-items: center;
    width: auto;
    font-size: 17px;
    color: gray;
    z-index: 5;
    margin-left: 8px;

    &.un {
      color: tomato;
    }
  }

}

.right_menu {
  width: 2rem;
  position: fixed;
  background-color: #f4f6f8;
  cursor: position;
  border-radius: 12px;
  padding: 2px 0;
  overflow: hidden;
  z-index: 3000;
}

:deep(.van-cell) {
  background-color: #f4f6f8 !important;
  cursor: pointer !important;

  .van-cell__title {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: position
  }

}

.fullmask {
  width: 100%;
  z-index: 2200;
  position: fixed;
  right: 0;
  top: 0;

  .van-icon-arrow-left {
    position: absolute;
    left: 0;
    top: 50%;
    z-index: 2400;
    color: #c7c5c58a;
    transition: transform 0.3s;
    /* 添加过渡效果 */
  }

  .van-icon-arrow {
    position: absolute;
    right: 0;
    top: 50%;
    z-index: 2400;
    color: #c7c5c58a;
    transition: transform 0.3s;
    /* 添加过渡效果 */
  }

  .van-icon-arrow:hover {
    transform: scale(1.2);
    /* 鼠标移入时放大到 1.2 倍 */
  }

  .van-icon-arrow-left:hover {
    transform: scale(1.2);
    /* 鼠标移入时放大到 1.2 倍 */
  }
}

:deep(.van-swipe__track) {
  transition: 0.3s;
}
</style>
