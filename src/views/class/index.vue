<!-- eslint-disable vue/valid-v-model -->
<template>
  <v-view bar
          @on-user="onUser"
          :index="400">
    <v-class v-model="classdata"
             @change="onPage(1)"
             change
             class="view_search_parnt"
             ref="classview">
    </v-class>
    <div class="view_seach">
      <img v-if="!showSearch"
           :src="showSearchClass ? require('@/assets/image/reset.png') : require('@/assets/image/sousuo.png')"
           alt=""
           @click.stop="openSearch(true)">
      <form v-else
            class="box_search_form"
            action="/">
        <van-search v-model="searchValue"
                    show-action
                    autofocus
                    ref="search"
                    :value="searchValue"
                    class="box_show"
                    placeholder="请输入搜索关键词"
                    @search.stop="onSearch"
                    @cancel="openSearch(false)">
          <template #action>
            <div @click="onSearch">搜索</div>
          </template>
        </van-search>
      </form>
    </div>
    <div class="class_view">
      <v-page ref="page"
              @on-page="onPage">
        <van-empty v-if="!item.length"
                   description="暂无"> </van-empty>
        <!-- 搜索 -->

        <!-- 点击头像 进入 该用户朋友圈主页
      点击图片 放大预览
      点击评论 触发 @评论
      点击 tool 无反应
      点击其他 进入详情 -->
        <section class="l_box flex van-hairline--bottom"
                 v-for="(i, j) in item"
                 :key="j"
                 @click.stop="onDetail(i, j)">
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
                <template v-if="i.play">
                  <div :id="'player-' + j"
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
                     v-for="(x, y) in tocoverImage(i.imgs)"
                     :key="y + '-' + j">
                  <van-image :src="x.img"
                             fit="cover"
                             @click.stop="openView(i, y)"
                             lazy-load></van-image>
                </div>
                <div class="pic pic_mini pic_more"
                     v-if="i.imgs.length > maxshowimage">
                  <van-icon name="weapp-nav" />
                  <p>更多{{ i.imgs.length - maxshowimage }}</p>
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
                <b>{{ +i.is_like === 1 ? "取消" : "" }}点赞 ({{
                  i.likes.length
                }})</b>
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

            <div v-show="i.comment.length > 0"
                 class="commeents flex">
              <review :item="i"
                      :curIndex="j"
                      @deleteCommentItem="deleteCommentItem"
                      @oepnComment="onCommentAt"
                      @details="onCommentMore"
                      :user="user"></review>
            </div>

          </div>
        </section>
      </v-page>
    </div>

    <div class="app_btn_add"
         @click="onadd">
      <div class="add_cover"><van-icon name="plus" /></div>
      <p>发布</p>
    </div>
    <template #fixed>
      <transition name="van-fade">
        <div class="app_show_fixed tran"
             v-if="comment.open"
             style="z-index: 502">
          <span class="comment_cover"
                @click="onCommentReset"></span>
          <v-c v-model="comment.message"
               @change="onCommentSubmit"></v-c>
        </div>
      </transition>
      <v-f v-model="child_open"
           :footer="false"
           text="Ta的班级圈"
           :index="402">
        <v-u v-model="id"
             @change="onchangechild"></v-u>
      </v-f>
      <v-f v-model="detail_open"
           :footer="false"
           text="班级圈详情"
           :index="403">
        <v-d v-model="detail"
             :user="user"
             @details="detailsDelete"
             @comment="(e) => {
               comment = e;
             }
               "
             @del="onTagChange"
             @close="detail_open = false"></v-d>
      </v-f>
    </template>
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

  </v-view>
</template>

<script>
import vC from "./comment.vue";
import vF from "../private/fixed.vue";
import vU from "./child.vue";
import vD from "./detail.vue";
import vClass from "../private/class.vue";
import review from "./review.vue";
export default {
  data() {
    return {
      ImagePreview: null,
      right_Menu: false,
      isLeftMouseDown: false,
      mask_bg: false,
      startX: 0,
      isWeChatOnMobile: null,
      newImglist: [],
      curImgIndex: 0,
      item: [],
      player: [],
      user: {},
      comment: {
        open: false,
        message: "",
      },
      id: "",
      userID: "",
      child_open: false, // 判断个人朋友圈
      detail_open: false, // 详情
      detail: {},
      load: null,
      classdata: {},
      maxshowimage: 9,
      childext: {},
      classicon: [200, 201, 202].map((s) => {
        // eslint-disable-next-line
        return demo.siteConfig.icon(s, "private");
      }),
      params: {},
      block: false,
      showSearch: false,
      showSearchClass: false,
      searchValue: '',
    };
  },
  components: { vC, vF, vU, vD, vClass, review },
  inject: ["appShowImage", "appTimeout", "appPath"],

  methods: {
    // 根部点击
    rootClick(e) {
      // if (!document.querySelector('.view_seach').contains(e.target)) {
      //   e.preventDefault();
      //   e.stopPropagation(); // 阻止事件冒泡
      //   if (this.showSearch) {
      //     this.$nextTick(() => {
      //       this.showSearch = false
      //       let search = document.getElementsByClassName('view_seach')[0]
      //       search.style.width = '40px';
      //       search.style.borderTopLeftRadius = '50%';
      //       search.style.borderBottomLeftRadius = '50%';
      //       search.style.height = '35px';
      //     })
      //   }
      // }
    },
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
      let curIndex = this.curImgIndex + 1;
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
    // 删除评论回调
    detailsDelete(c, i) {
      this.item.forEach((item) => {
        item.comment.forEach((comment, index) => {
          if (comment.id === c.id) {
            // 删除对应的 comment 数据
            item.comment.splice(index, 1);
            item.comment_count--;
          }
        });
      });
    },
    // 删除评论
    deleteCommentItem(c, i) {
      console.log(c, i);
      console.log(this.item);
      this.$api.http('delComment', {
        comment_id: c.id
      }, (r) => {
        this.item.forEach((item) => {
          item.comment.forEach((comment, index) => {
            if (comment.id === c.id) {
              // 删除对应的 comment 数据
              item.comment.splice(index, 1);
              item.comment_count--;
            }
          });
        });
        this.$toast("删除成功");
      })
    },
    onSearch(v) {
      // eslint-disable-next-line no-undef, new-cap
      let es6 = new demo.es6()
      this.load = this.$toast.loading();
      if (this.searchValue !== '') {
        // eslint-disable-next-line no-undef
        es6.timeoutFn('searchValue', () => {
          this.$api.http('search_class', {
            search: this.searchValue || v,
            class_id: this.classdata.id,
            page: 1,
            limit: 100
          }, (r) => {
            if (r.length > 0) {
              this.item = r
              this.showSearch = false
              this.showSearchClass = true
              this.openSearch(false)
              this.searchValue = ''
            } else {
              this.$toast('没有找到')
            }
          })
        }, 600)
      }
      this.load.close();
      console.log(v, this.searchValue);
    },
    openSearch(open) {
      if (open && this.showSearchClass) {
        this.showSearchClass = false
        this.onPage(1)
        return
      }
      // 需要给 ref search 下的 input 框 直接获取焦点
      this.showSearch = open;
      this.$nextTick(() => {
        let search = document.getElementsByClassName('view_seach')[0]
        search.style.width = open ? '100%' : '40px';
        search.style.borderTopLeftRadius = open ? '0px' : '50%';
        search.style.borderBottomLeftRadius = open ? '0px' : '50%';
        search.style.height = open ? '52px' : '35px';
        if (open) {
          let input = document.querySelector('.van-field__control');
          if (input) {
            input.focus();
          }
        }
      })
    },
    onchangechild(e) {
      this.detail = { ...e };
      this.detail_open = true;
    },
    tocoverImage(e) {
      if (e.length > this.maxshowimage) {
        let a = [...e].splice(0, this.maxshowimage);
        return a;
      }
      return e;
    },
    onadd() {
      if (this.classdata.id) {
        this.appPath("/class_add/" + this.classdata.id);
      } else {
        this.appPath("/class_add");
      }
    },
    onUser(e) {
      this.user = e;
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
    // 主方法 请求数据
    onPage(page, f) {
      if (!this.classdata.id) {
        return this.$refs.page.onFinish(true);
      }
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        if (this.player.length) {
          this.player.forEach((k) => {
            if (k.video) {
              k.destroy();
            }
          });
        }
        this.item = [];
      }
      this.$api.http(
        "class",
        { page, class_id: this.classdata.id || "" },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          this.item = this.item.concat(
            e.map((s) => {
              s.play = null;
              s.open = false;
              return s;
            })
          );
          this.$refs.page.onFinish(e.length < 20);
        }
      );
    },
    // 创建播放器 播放视频
    onCreatePlayer(e, index) {
      e.play = true;
      this.$nextTick(() => {
        if (!e.player) {
          // eslint-disable-next-line
          this.player[index] = new DEMO_Player({
            // eslint-disable-next-line
            container: demo.$.id("player-" + index),
            video: {
              url: e.imgs[0].img,
              pic: e.imgs[0].cover,
            },
            mutex: true,
            preload: "none",
          });
          this.player[index].play();

          this.player[index].on("error", () => {
            this.player[index].switchVideo({
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
      console.log(e);
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
            this.$set(this.item[e.index], "is_like", f ? 1 : 0);
            this.$set(this.item[e.index], "likes_count", c);
            this.$set(this.item[e.index], "likes", cs);
            c = null;
            cs = null;
          });
          break;
        case "del":
          this.$js.model("是否删除班级圈", "", (res) => {
            if (res) {
              this.$api.http("classdeel", { s_id: edata.id }, () => {
                this.item.splice(e.index, 1);
                this.$toast("删除成功");
              });
            }
          });
          break;
        case "del_end":
          this.item.splice(e.index, 1);
          break;
        case "comment":
          console.log(edata, e);
          this.comment = {
            open: true,
            message: "",
            $index: e.index,
            ...edata,
          };
          this.$nextTick(() => {
            this.comment.open = true;
          });
          break;
        case "down":
          let url = (edata.imgs[0] || {}).img;
          // eslint-disable-next-line
          let h5 = demo.siteConfig.api.h5 + "player/down.html?url=" + url;
          if (url) {
            window.location.href = h5;
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
                    this.$set(this.item[e.index], "is_shield", "0");
                    this.$set(this.item[e.index], "from_client", "1");
                  } else {
                    this.$set(this.item[e.index], "is_shield", "1");
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
    // 评论重置
    onCommentReset() {
      this.comment = {
        open: false,
        message: "",
      };
    },
    // 评论提交
    onCommentSubmit(e) {
      this.load = this.$toast.loading({
        duration: 0,
        forbidClick: true,
      });
      let index = this.comment.$index;
      let obj = this.comment.obj || {};
      if (obj.r_id) {
        let toname = "@" + this.comment.name + "：";

        if (e.indexOf(toname) < 1) {
          obj = {};
        }
        e = e.replace(toname, "");
      }
      let os = {
        comment: ["<b>", e, "</b>"].join(""),
        parent_id: "",
        r_id: "",
        reply_client: "",
        s_id: this.comment.id,
        ...obj,
      };
      this.$api.http("classcomment", os, (r) => {
        let val = this.comment.comment || [];
        let d = { ...os, name: this.user.nickname, ...r };
        if (obj.r_id) {
          d.to_name = this.comment.name;
        }
        let count = this.comment.comment_count + 1;
        if (val.length > 6) {
          val.pop();
        }
        val.unshift(d);
        this.onCommentReset();
        if (index === undefined) {
          this.load.close();
          return 0;
        }
        if (val.length < 6) {
          this.$set(this.item[index], "comment", val);
        }
        this.$set(this.item[index], "comment_count", count);
        if (this.detail_open) {
          this.detail = {
            ...this.item[index],
            $index: index,
            $comment: val.length < 11 ? null : null,
          };
        }
        this.load.close();
      });
      // setTimeout(() => {
      //   if (this.load && this.load.close) {
      //     this.load.close();
      //   }
      // }, 4000);
      this.$nextTick(() => {
        if (this.load && this.load.close) {
          this.load.close();
        }
      })
    },
    // @评论
    onCommentAt(e, index) {
      console.log(e, index);
      let uid = this.user.id;
      // 点击自己时
      if (uid === e.u_id) {
        this.comment = {
          open: true,
          message: "",
          $index: index,
          ...e,
          comment: this.item[index].comment,
          comment_count: this.item[index].comment_count,
          id: this.item[index].id,
        };
        return 0;
      }
      this.comment = {
        open: true,
        message: "@" + e.name + "：",
        $index: index,
        ...e,
        comment: this.item[index].comment,
        comment_count: this.item[index].comment_count,
        id: this.item[index].id,
        obj: {
          parent_id: e.id,
          r_id: e.u_id,
          reply_client: e.from_client,
        },
      };
    },
    // 更多评论 进入详情
    onCommentMore(e, index) {
      this.detail = { ...e, $index: index, $more: true };
      this.detail_open = true;
    },
    // 点击头像 进入个人班级圈
    onUserClass(e, index) {
      this.params.did = "";
      this.id = e.u_id;
      // this.detail = { ...e, $index: index, $more: true };
      this.appPath("/class/" + e.u_id, true);
    },
    // 查看详情
    onDetail(e, index) {
      this.$nextTick(() => {
        console.log(this.showSearch);
        if (this.showSearch) {
          let search = document.getElementsByClassName('view_seach')[0]
          search.style.width = '40px';
          search.style.borderTopLeftRadius = '50%';
          search.style.borderBottomLeftRadius = '50%';
          search.style.height = '35px';
          this.showSearch = false
        } else {
          this.detail = { ...e, $index: index };
          this.detail_open = true;
        }
      })
    },
  },
  watch: {
    "$route.params.id"(n) {
      if (n) {
        this.id = n;
      }
    },
    'ImagePreview.value'(v) {
      console.log(v);
      if (!v) {
        this.isLeftMouseDown = false;
        this.startX = 0;
        this.mask_bg = false
      }
    },
    showSearch(v) {
      if (!v) {
        this.searchValue = ''
      }
    },
    child_open(n) {
      if (!n) {
        this.appPath("/class", true);
        this.id = "";
      }
    },
    id(n) {
      if (n > 0 && !this.params.did) {
        this.child_open = true;
      }
    },
    detail_open(n) {
      if (!n) {
        let obj = { ...this.detail };
        if (obj.id) {
          let index = obj.$index || "";
          delete obj.$index;
          delete obj.$more;
          delete obj.$comment;
          if (index >= 0 && index !== "") {
            this.item.splice(index, 1, obj);
          }
        }
      }
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
    this.params = this.$route.params;
    // 首次进入 检测是否进入 个人班级圈
    this.id = this.params.id;
    // eslint-disable-next-line no-undef
    let user = demo.$session.get("user");
    if (user) {
      this.userID = user.id
    }
    if (this.params.did > 0) {
      // 获取详情
      this.$api.http("classdet", { s_id: this.params.did }, (r) => {
        this.onchangechild(r);
      });
    }
    if (this.params.cid > 0) {
      // 获取班级 变更班级
      this.$refs.classview.setclassid(this.params.cid);
    }
  },
  beforeDestroy() {
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
    position: relative;

    .pic {
      background-color: #f7f7f7;
      margin-bottom: 5px;
      margin-right: 7px;
      border-radius: 3px;
      overflow: hidden;

      &.pic_more {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 16px;

        .van-icon {
          font-size: 22px;
          margin-bottom: 5px;
        }

        background-color: rgba(78, 78, 78, 0.6);
        color: #fff;
        position: absolute;
        right: 0;
        bottom: 5px;
        margin: 0;
      }

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

.class_view {
  padding-bottom: 80px;
  position: relative;
}

.view_search_parnt {
  position: relative;
}

.view_seach {
  position: fixed;
  right: 0;
  top: 60px;
  z-index: 100;
  height: 35px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
  background: #fff;
  box-shadow: 0 3.2px 12px #00000014, 0 5px 25px #0000000a;
  border: 1px solid #f4f6f8;
  transition: .5s ease;
}

.box_search_form {
  height: 100%;
  width: 100%;
}

.box_show {
  width: 100%;
  height: 52px;
  box-shadow: 0 3.2px 12px #00000014, 0 5px 25px #0000000a;
}

.view_seach img {
  height: 22px;
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

[id^="player"] {
  height: 100%;
  width: 100%;
  display: block;
}

.comment_cover {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
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

// .right_menu {
//   height: 100%;
//   width: 100%;
//   position: fixed;
//   right: 0;
//   top: 0;
//   z-index: 3000;
// }

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
