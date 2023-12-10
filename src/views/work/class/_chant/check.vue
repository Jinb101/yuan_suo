<template>
  <div class="check_leesson">
    <template v-if="child">
      <div class="new_page_chant">
        <div class="cover_bgc"><img :src="icons(0)" alt="" /></div>
        <div class="headers">
          <div class="cover_image_fixed">
            <img :src="icons(700)" alt="" class="db_image" />
          </div>
          <div class="flex">
            <section
              v-for="(i, j) in menu"
              :key="j"
              @click="type = i.id"
              :class="{ active: +type === +i.id }"
              :style="bgc(icons(+type === +i.id ? 701 : 702))"
            >
              <b
                v-for="(q, w) in totextarr(i.name)"
                :key="w + '-' + j + '-1'"
                >{{ q }}</b
              >
            </section>
          </div>
        </div>
        <template v-if="menu1.length">
          <div class="headers_2">
            <section
              v-for="(x, y) in menu1"
              :key="y + '-2'"
              @click="type1 = x.id"
              :class="{ active: +type1 === x.id }"
              :style="bgc(icons(+type1 === +x.id ? 703 : 704))"
            >
              {{ x.name }}
            </section>
          </div>
          <div class="headers_3">
            <section
              v-for="(x, y) in menu2"
              :key="y + '-3'"
              @click="type2 = x.id"
              :class="{ active: +type2 === x.id }"
              :style="bgc(icons(+type2 === +x.id ? 705 : 706))"
            >
              {{ x.name }}
            </section>
          </div>
        </template>
        <div class="pages_box demo_scrollbar">
          <v-page ref="page" @on-page="onPage">
            <van-empty v-if="!item.length"></van-empty>
            <ul>
              <li
                v-for="(i, j) in item"
                :key="j + 'l'"
                class="flex"
                :style="bgc(icons(707))"
                @click="onchecklesson(i)"
              >
                <div class="logo">
                  <img
                    :src="toimgs(i.parent_cover_picture, j)"
                    alt=""
                    class="db_image"
                  />
                </div>
                <div class="text">
                  <h2>
                    <b>{{ i.types }}</b>
                  </h2>
                  <p>{{ i.name }}</p>
                </div>
                <div class="right_btn">
                  <span>点击换成此课</span>
                </div>
              </li>
            </ul>
          </v-page>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="box_menus">
        <div class="box_radio">
          <van-radio-group v-model="allid">
            <section v-for="(i, j) in menu" :key="j + 's'">
              <div class="label">{{ i.name }}</div>
              <div class="text" v-if="i.children && i.children.length">
                <div v-for="(x, y) in i.children" :key="y + '-' + j + 's'">
                  <van-radio :name="x.id">{{ x.name }}</van-radio>
                </div>
              </div>
              <van-radio-group v-model="all2id">
                <div class="child" v-if="allextid === i.id">
                  <van-radio
                    :name="q.id"
                    v-for="(q, w) in allext"
                    :key="w + 'sss'"
                    >{{ q.name }}</van-radio
                  >
                </div>
              </van-radio-group>
            </section>
          </van-radio-group>
        </div>
        <van-button
          block
          round
          @click="onsubmitall"
          type="info"
          :disabled="all2id === ''"
          >确认选择</van-button
        >
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    ext: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    child() {
      return !this.ext.code;
    },
    ids() {
      return this.ext.id;
    },
    menu1() {
      let id = this.type;
      let arr = this.menu;
      if (arr && arr.length) {
        arr =
          arr.filter((r) => {
            return r.id === +id;
          })[0] || {};
        return arr.children || [];
      }
      return [];
    },
    menu2() {
      if (!this.menu1.length) return [];
      let id = this.type1;
      let arr = this.menu1;
      if (arr && arr.length) {
        arr =
          arr.filter((r) => {
            return r.id === +id;
          })[0] || {};
        return arr.children || [];
      }
      return [];
    },
  },
  watch: {
    type() {
      if (this.oncestatus) {
        this.type1 = "";
        setTimeout(() => {
          this.type1 = this.menu1[0].id;
        }, 200);
      }
    },
    type1() {
      if (this.oncestatus) {
        this.type2 = "";
        setTimeout(() => {
          this.type2 = this.menu2[0].id;
        }, 200);
      }
    },
    type2(n) {
      if (n) {
        this.onPage(1);
      }
    },
    allid(n) {
      let v = this.menu.filter((s) => {
        return (
          s.children
            .map((r) => {
              return r.id;
            })
            .indexOf(+n) >= 0
        );
      });
      this.allextid = v[0].id;
      this.allext =
        (
          v[0].children.filter((s) => {
            return s.id === +n;
          })[0] || {}
        ).children || [];
      this.all2id = "";
    },
  },
  data() {
    return {
      cid: "",
      menu: [],
      type: "",
      type1: "",
      type2: "",
      item: [],
      oncestatus: false,
      allid: "",
      all2id: "",
      allext: [],
      allextid: -1,
    };
  },
  methods: {
    onsubmitall() {
      this.$api.http(
        "chantcheck",
        {
          class_id: this.ext.class_id,
          country_classify_id: this.all2id,
          class_schedule_country_classes_id: this.ext.id,
        },
        () => {
          this.$toast("换课成功");
          this.$emit("end");
        }
      );
    },
    onchecklesson(e) {
      let id = e.country_study_id;
      let s = [e.name, "[", e.types, "]"].join("");
      if (id === this.cid) {
        return this.$toast("这是同一节课");
      }
      this.$js.model(
        "换课提示",
        "是否将“" + this.ext.zh + "”换成“" + s + "”？",
        (r) => {
          console.log(r);
          this.$api.http(
            "chantchecks",
            {
              class_schedule_country_id: this.ext.id,
              country_study_id: id,
            },
            () => {
              this.$toast("换课成功");
              this.$emit("end");
            }
          );
        }
      );
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page && this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "chant",
        { page, class_id: this.type, classify_id: this.type2 },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          this.item = this.item.concat(e);
          this.$refs.page.onFinish(e.length < 20);
          // country_study_class 为null时 不显示打卡按钮与状态
        }
      );
    },
    toimgs(src, index) {
      // if (src) return src;
      return this.icons((index % 24) + 1);
    },
    icons(name) {
      // eslint-disable-next-line
      return demo.siteConfig.icon(name, "parent");
    },
    totypestext(e) {
      let arr = [
        "",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
        "十一",
        "十二",
        "十三",
        "十四",
        "十五",
        "十六",
        "十七",
        "十八",
        "十九",
        "二十",
      ]
        .map((s, v) => {
          return {
            s,
            v,
          };
        })
        .filter((r) => {
          return (e + "").indexOf(r.s) >= 0 && r.v > 0;
        });
      if (arr.length) {
        return arr[arr.length - 1].v;
      }
      return 0;
    },
    bgc(s) {
      return {
        background:
          "url(" + s + ") 0 0 / 100% 100% no-repeat scroll transparent",
      };
    },
    init() {
      // 获取
      this.ify(() => {
        if (this.child) {
          this.$api.http(
            "chant",
            { classify_id: this.ext.t2, page: 1, limit: 200 },
            (r) => {
              try {
                this.cid = r[0].country_study_id;
              } catch (err) {}
            }
          );
        } else {
          this.$api.http(
            "chantprevstatus",
            { classify_id: this.ext.id, class_id: this.ext.class_id },
            (r) => {
              try {
                this.allid = r.pid;
                this.$nextTick(() => {
                  this.all2id = r.id;
                });
              } catch (err) {}
            }
          );
        }
      });
    },
    ify(fn) {
      this.$api.http("chantgetallify", {}, (r) => {
        this.menu = r;
        setTimeout(() => {
          this.type = r[0].id;
          this.oncestatus = true;
        }, 300);
        fn();
      });
    },
    totextarr(str) {
      let s = (str + "").split("");
      return s;
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.check_leesson {
  height: 100%;
}
.new_page_chant {
  padding-top: 50px;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  .headers {
    margin: 0 26px;
    height: 110px;
    position: relative;
    box-sizing: border-box;
    padding: 10px 50px;
    > div.flex {
      align-items: center;
      justify-content: space-between;
      position: relative;
      z-index: 5;
      height: 100%;
      section {
        width: 40px;
        height: 84px;
        font-size: 17px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        // background-size: 100% 100%;
        // background-color: #38f;
        position: relative;
        &.active {
          // background-color: tomato;
        }
        b + b {
          margin-top: 10px;
        }
      }
    }
  }
  .headers_2,
  .headers_3 {
    margin: 30px 40px 40px;
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 5;
    section {
      width: 130px;
      height: 40px;
      letter-spacing: 12px;
      text-align: center;
      line-height: 40px;
      font-size: 17px;
      color: #6e4000;
      position: relative;
      // background-size: 100% 100%;
      // background-color: #38f;
      &.active {
        // background-color: tomato;
      }
    }
  }
  .headers_3 {
    margin: 0 8px 30px;
    section {
      width: 115px;
      height: 30px;
      line-height: 30px;
      letter-spacing: 1px;
      font-size: 14px;
    }
  }
  .pages_box {
    height: calc(100% - 260px);
    position: relative;
    z-index: 5;
    color: #6e4000;
    li {
      margin: 0 5px 12px;
      position: relative;
      box-sizing: border-box;
      padding: 20px 40px;
      padding-left: 60px;
      .logo {
        width: 60px;
        height: 60px;
      }
      .text {
        width: calc(100% - 60px);
        box-sizing: border-box;
        font-size: 15px;
        padding: 0 60px 0 10px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        h2 {
          margin-bottom: 14px;
        }
        p {
          font-weight: 650;
        }
      }
      .right_btn {
        position: absolute;
        right: 0;
        top: 0;
        padding-right: 60px;
        box-sizing: border-box;
        bottom: 0;
        margin: auto;
        height: 47px;
        span {
          // width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          // background-color: #fff;
          // border-radius: 50%;
          font-size: 12px;
          // border: 1px solid #6e4000;
          flex-direction: column;
          // img {
          //   width: 20px;
          //   height: 20px;
          //   margin-bottom: 4px;
          // }
        }
      }
    }
  }

  .cover_image_fixed {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
}
.cover_bgc {
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100vw;
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
  &::after {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    filter: blur(2px);
    content: "";
  }
}
.box_menus {
  height: 100%;
  overflow: hidden;
  .box_radio {
    box-sizing: border-box;
    padding-top: 44px;
    // justify-content: center;
    // align-items: center;
    height: calc(100% - 100px);
    & + .van-button {
      margin: 28px 10% 0;
      width: 80%;
    }
    .van-radio-group {
      width: 100%;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  }
  section {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    .label {
      width: 100px;
      text-align: center;
      padding: 10px 0;
    }
    .text {
      width: calc(100% - 100px);
      display: flex;
      > div {
        height: 100%;
        flex: 1;
        padding: 10px 0;
      }
    }
    .child {
      padding: 10px;
      width: 100%;
      display: flex;
      .van-radio {
        flex: 1;
        font-size: 14px;
      }
    }
  }
}
</style>
