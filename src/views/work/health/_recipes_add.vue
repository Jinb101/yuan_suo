<template>
  <div class="recipes_add">
    <van-cell
      title="开始时间"
      is-link
      @click="open = !open"
      :value="start_time"
    ></van-cell>
    <van-cell
      title="结束时间"
      is-link
      @click="open1 = !open1"
      :value="end_time"
    ></van-cell>
    <van-tabs v-model="active" title-active-color="#38f" v-if="!isadd">
      <van-tab title="文本" name="0"></van-tab>
      <van-tab title="图片" name="1"></van-tab>
    </van-tabs>
    <template v-if="+active === 0">
      <van-empty v-if="!item.length"></van-empty>
      <section v-for="(i, j) in item" :key="j">
        <van-cell
          :title="i.ymd + ' ' + i.week"
          is-link
          value="新增"
          @click="onadditems(j)"
        ></van-cell>
        <div
          v-for="(x, y) in i.list"
          :key="y + '-' + j"
          class="div"
          :style="{ filter: 'hue-rotate(' + y * 30 + 'deg)' }"
        >
          <van-field
            v-model="x.title"
            label="食谱类别"
            placeholder="请输入食谱类别"
            maxlength="12"
            label-width="5em"
          >
            <template #button>
              <b class="col_danger" @click="ondelitems(y, j)"> 删除 </b>
            </template>
          </van-field>
          <van-field
            v-model="x.content"
            label="食谱内容"
            placeholder="请输入食谱内容"
            maxlength="500"
            label-width="5em"
            type="textarea"
            show-word-limit
            rows="3"
            autosize
          />
          <div class="p" v-if="false">
            <v-uploads v-model="x.img">
              <div class="image">
                <v-upload
                  more
                  moreLength="3"
                  @on-path="onpath"
                  @on-loading="onpath"
                  :sort="y + '-' + j"
                  :ids="'upl-' + y + '-' + j"
                ></v-upload>
              </div>
            </v-uploads>
          </div>
        </div>
      </section>
    </template>
    <template v-else>
      <div class="p">
        <v-uploads v-model="imgs">
          <div class="img">
            <v-upload
              more
              moreLength="20"
              ids="upload-img"
              @on-path="onpath2"
              @on-loading="onpath2"
            ></v-upload>
          </div>
        </v-uploads>
      </div>
    </template>
    <div class="app_bottom">
      <van-button block :color="$js.btnColor" @click="onsubmit"
        >{{ btntext }}食谱</van-button
      >
    </div>
    <v-t :open="open" max="d_30" v-model="t1"></v-t>
    <v-t :open="open1" max="d_60" v-model="t2"></v-t>
  </div>
</template>

<script>
import vT from "../../private/time.vue";
export default {
  props: {
    value: null,
  },
  data() {
    return {
      open: false,
      open1: false,
      t1: {},
      t2: {},
      item: [],
      oldItem: [],
      active: "0",
      imgs: [],
    };
  },
  components: { vT },
  computed: {
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    edit() {
      return this.ext.$edit;
    },
    isadd() {
      return this.ext.$use;
    },
    btntext() {
      if (this.isadd) return "复用";
      if (this.edit) return "编辑";
      return "发布";
    },
    start_time() {
      console.log(this.t1.ymd, this.t1, this.item);
      if (this.t1.ymd) {
        return [this.t1.ymd, this.t1.obj.w].join(" ");
      }
      return "点击选择开始时间";
    },
    end_time() {
      if (this.t2.ymd) {
        return [this.t2.ymd, this.t2.obj.w].join(" ");
      }
      return "点击选择结束时间";
    },
    join_time() {
      return (
        this.start_time.indexOf("选择") < 0 && this.end_time.indexOf("选择") < 0
      );
    },
  },
  watch: {
    ext: {
      handler(v) {
        this.$emit("input", v);
      },
      deep: true,
    },
    join_time(n) {
      if (n) {
        // 设置item数量
        this.tosetitem();
      }
    },
    start_time(v, o) {
      if (this.join_time) {
        this.tosetitem();
      }
    },
    end_time() {
      if (this.join_time) {
        this.tosetitem();
      }
    },
  },
  methods: {
    tosetitem() {
      // eslint-disable-next-line
      let day = demo.month().between(this.t1.time, this.t2.time);
      let dmap = day.map((s) => {
        return {
          // eslint-disable-next-line
          ymd: demo.timeout(s.timeout, "ymd", "-"),
          // eslint-disable-next-line
          week: demo.timeout(s.timeout, "object").w,
          time: s.timeout,
          list: "早餐，早点，午餐，午点，晚餐".split("，").map((k) => {
            return {
              title: k,
              content: "",
              img_url: [],
              img_urls: [],
              img: [],
            };
          }),
        };
      });
      if (this.oldItem.length > 0) {
        this.oldItem.forEach((s) => {
          let matchingItems = dmap.filter((r) => r.week === s.week);
          matchingItems.forEach((item) => {
            item.list = s.list;
          });
        });
      }
      this.item = JSON.parse(JSON.stringify(dmap));
    },
    totimeset(timeout) {
      return {
        // eslint-disable-next-line
        ymd: demo.timeout(timeout, "ymd", "-"),
        // eslint-disable-next-line
        obj: demo.timeout(timeout, "object"),
        time: timeout,
      };
    },
    init() {
      if (this.edit) {
        this.active = +this.ext.type - 1 + "";
        let list = this.ext.list;
        if (+this.active === 0) {
          let s = new Date(list[0].day.replace(/-/g, "/")).getTime();
          let e = new Date(
            list[list.length - 1].day.replace(/-/g, "/")
          ).getTime();
          this.t1 = this.totimeset(s);
          this.t2 = this.totimeset(e);
          this.$nextTick(() => {
            let v = JSON.parse(JSON.stringify(list)).map((s) => {
              return {
                ymd: s.day,
                week: s.week,
                time: s.day,
                list: s.list.map((r) => {
                  if (r.img_url && r.img_url.length) {
                    r.img = r.img_url.map((k, q) => {
                      return {
                        srcs: k,
                        src: r.img_urls[q],
                        base: k,
                        old: true,
                        cover: "img",
                      };
                    });
                  } else {
                    r.img = [];
                  }
                  return r;
                }),
              };
            });
            this.item = v;
            this.oldItem = v
          });
        } else {
          this.imgs = list[0].list.map((k) => {
            return {
              srcs: k,
              src: "/uploads/" + k.split("/uploads/")[1],
              base: k,
              old: true,
              cover: "img",
            };
          });
        }
      } else {
        // eslint-disable-next-line
        let today = demo.month().week(5);
        this.t1 = this.totimeset(today[0].timeout);
        this.t2 = this.totimeset(today[today.length - 1].timeout);
        // this.$api.http("user", {}, () => {});
        // console.log(this.t1);
      }
    },
    onpath(e, v, i, j) {
      let s = j.split("-");
      this.$set(this.item[s[1]].list[s[0]], "img", v);
    },
    onpath2(e, v) {
      this.imgs = v;
    },
    onadditems(i) {
      this.item[i].list.push({
        title: "",
        content: "",
        img_url: [],
        img_urls: [],
        img: [],
      });
    },
    ondelitems(y, j) {
      this.item[j].list.splice(y, 1);
    },
    onsubmit() {
      let i = JSON.parse(JSON.stringify(this.item)).map((s) => {
        s.list = (s.list || []).map((r) => {
          if (r.img && r.img.length) {
            r.img_url = r.img.map((k) => {
              return k.src;
            });
            r.img_urls = r.img.map((k) => {
              return k.srcs;
            });
          }
          delete r.img;
          r.img_url = r.img_url.join(",");
          r.img_urls = r.img_urls.join(",");
          return r;
        });
        s.day = s.ymd;
        delete s.ymd;
        delete s.time;
        return s;
      });
      let api = this.edit && !this.isadd ? "recipesedit" : "recipesadd";

      let os = {
        start_time: this.t1.ymd,
        end_time: this.t2.ymd,
        type: +this.active + 1,
        // describe: "",
        recipes: i,
      };
      if (this.edit && !this.isadd) {
        os.id = this.ext.id;
      }
      if (+this.active === 1) {
        os.describe = "";
        os.recipes = [
          {
            list: this.imgs.map((s) => {
              return s.src;
            }),
          },
        ];
      }
      this.$api.http(api, os, () => {
        this.$toast(this.btntext + "成功");
        this.$emit("end");
      });
    },
  },
  mounted() {
    console.log(this.value);
    this.ext = this.value;
    if (this.edit) {
      this.$router.meta.title = "编辑食谱";
    }
    console.log(this.edit, this.$router);
    this.init();
  },
};
</script>
<style lang='less' scoped>
section {
  font-size: 15px;
}
.image {
  width: 80px;
  height: 80px;
}
.p {
  padding: 10px;
}
.div {
  background-color: rgba(170, 207, 255, 0.1);

  .van-cell {
    background: transparent;
  }
}
.img {
  width: 100px;
  height: 100px;
}
</style>
