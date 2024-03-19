<template>
  <v-view header>
    <template #menu>
      <span @click="onhistory">历史食谱</span>
    </template>
    <template v-if="issup === true">
      <!-- 供应商食谱 -->
      <div class="list">
        <section v-for="(i, j) in list" :key="j">
          <van-divider
            content-position="left"
            :style="{
              color: '#ffbc00',
              borderColor: '#ffbc00',
              padding: '0 16px',
              margin: '10px 0 0',
            }"
          >
            {{ i.recipe_date }} {{ i.week }}
          </van-divider>
          <template v-if="i.list && i.list.length">
            <div class="lst" v-for="(x, y) in i.list" :key="y + '-' + j">
              <h6 v-if="x.dish_type_name">{{ x.dish_type_name }}</h6>
              <template v-if="x.list && x.list.length">
                <ul>
                  <li
                    v-for="(q, w) in x.list"
                    :key="w + '-' + y + '-' + j"
                    class="flex"
                    @click.stop="ondetail(q)"
                  >
                    <div class="logo">
                      <van-image
                        :src="q.picture_of_dishes"
                        v-if="q.picture_of_dishes"
                        fit="cover"
                        @click="appShowImage(q.picture_of_dishes)"
                      ></van-image>
                      <van-image v-else :src="foodpic"></van-image>
                    </div>
                    <p class="name">
                      {{ q.cooked_food_name }}
                      <span>{{ +q.total_ingredients }}g</span>
                      <b class="click">点击查看食材</b>
                    </p>
                  </li>
                </ul>
              </template>
              <!-- <p v-else>暂无</p> -->
            </div>
          </template>
          <div class="lst" v-else><p>暂无</p></div>
        </section>
      </div>
    </template>
    <template v-else-if="issup === false">
      <van-cell
        :title="detail.start_time + '~' + detail.end_time"
        :value="detail.week"
        label="最新食谱"
        v-if="detail.start_time"
      ></van-cell>
      <!-- 没有供应商食谱 -->
      <template v-if="+detail.type === 1">
        <van-collapse
          v-model="activeName"
          accordion
          v-if="detail.recipes && detail.recipes.length"
        >
          <van-collapse-item
            :title="x.day + '(' + x.week + ')'"
            :name="y + ''"
            v-for="(x, y) in detail.recipes"
            :key="y + '-w'"
          >
            <article v-for="(q, w) in x.list" :key="w + '-ar'" class="article">
              <h5>{{ q.title }}</h5>
              <p class="content">{{ q.content }}</p>
              <span
                class="article_add"
                @click.stop="onuploadclick([w, y], q)"
                v-if="q.img_url.length < 3"
                >添加食谱图片</span
              >
              <div class="box flex fw">
                <template v-if="q.img_url && q.img_url.length">
                  <div
                    class="box_img2"
                    v-for="(x2, y2) in q.img_url"
                    :key="y2 + '-' + y"
                  >
                    <van-image
                      :src="x2"
                      lazy-load
                      @click.stop="appShowImage(q.img_url, y2)"
                    ></van-image>
                    <span class="del" @click.stop="ondellogo(y2, w, y)">
                      <van-icon name="cross" />
                    </span>
                  </div>
                </template>
              </div>
            </article>
          </van-collapse-item>
        </van-collapse>
        <div class="app_bottom">
          <van-button class="btn_left"  @click="oneditfood"
            >编辑历史</van-button
          >
          <van-button class="btn_right"   @click="onadd" v-if="!issup" :color="$js.btnColor"
            >发布新食谱</van-button
          >
        </div>
      </template>
      <template v-else>
        <div class="detail" v-if="detail.recipes && detail.recipes.length">
          <section
            class="box flex fw"
            v-for="(i, j) in detail.recipes"
            :key="j"
          >
            <template v-if="i.list && i.list.length">
              <div class="box_img" v-for="(x, y) in i.list" :key="y + '-' + j">
                <van-image
                  :src="x"
                  lazy-load
                  @click="appShowImage(i.list, y)"
                ></van-image>
              </div>
            </template>
          </section>
        </div>
        <van-empty v-else description="暂无添加食谱"></van-empty>
      </template>
    </template>
    <template v-else>
      <van-empty description="请重试">
        <van-button
          @click="reload"
          :color="$js.btnColor"
          round
          size="small"
          class="b1"
          >点击重试</van-button
        >
      </van-empty>
    </template>
    <template #fixed>
      <v-f v-model="open" :footer="false" :text="ext.cooked_food_name">
        <template v-if="ext.nursery_dish && ext.nursery_dish.length">
          <van-cell
            v-for="(i, j) in ext.nursery_dish"
            :key="j"
            :title="i.goods_name || '*'"
            :value="+i.consumption + 'g'"
          ></van-cell>
        </template>
        <van-empty v-else description="暂未收录食材"></van-empty>
      </v-f>
      <div class="upload_files">
        <v-upload
          more
          moreLength="3"
          :del="false"
          ref="upload"
          @on-path="onUpload"
          @on-loading="onUpload"
        ></v-upload>
      </div>
      <!-- <div class="app_btn_add b20"  @click="oneditfood">
        <p>编辑</p>
      </div> -->
      <v-f v-model="open1" :footer="false" :text="titleText">
        <v-a v-model="addext" @end="onend"></v-a>
      </v-f>
    </template>
    <div class="foot"></div>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
import vA from "./_recipes_add.vue";
export default {
  data() {
    return {
      issup: null, // 是否有供应商
      id: "", // 宝宝 1/老师 2 食谱分类
      list: [],
      types: ["", "早餐", "早点", "午餐", "午点", "晚餐"],
      // eslint-disable-next-line
      foodpic: demo.siteConfig.icon("food", "private"),
      open: false,
      ext: {},
      detail: {},
      activeName: "0",
      uploadconfig: {
        key: 0,
        key1: 0,
        recipes_id: "",
        img_url: [],
        img_urls: [],
      },
      open1: false, // 控制发布
      addext: {},
      titleText: '添加食谱'
    };
  },
  components: { vF, vA },
  inject: ["reload", "appShowImage", "appPath"],
  computed: {},
  watch: {
  addext: function (v, o) {
    this.titleText = v.$edit ? '编辑食谱' : '添加食谱';
      }
    },
  methods: {
    onend() {
      this.open1 = false;
      this.init();
    },
    ondellogo(a, b, c) {
      let d = this.detail.recipes[c].list[b];
      this.$js.modeldel(() => {
        this.detail.recipes[c].list[b].img_urls.splice(a, 1);
        this.detail.recipes[c].list[b].img_url.splice(a, 1);
        let os = {
          img_url: d.img_urls.join(","),
          key: c,
          key1: b,
          recipes_id: this.detail.id,
        };
        this.$api.http("recipesoldpic", os, () => {
          this.$toast("删除完成");
        });
      });
    },
    onuploadclick(indexs, obj) {
      this.uploadconfig = {
        key: indexs[1],
        key1: indexs[0],
        recipes_id: this.detail.id,
        img_url: obj.img_url || [],
        img_urls: obj.img_urls || [],
      };
      if (this.uploadconfig.img_url.length >= 3) {
        return this.$toast("最大可上传 3 张");
      }
      if (this.$refs.upload) {
        this.$refs.upload.onclear(true);
      } else {
        this.$toast("请重试");
      }
    },
    onUpload(e, v) {
      let len = v
        .map((s) => {
          return s.num;
        })
        .filter((r) => {
          return r < 100;
        });
      if (len.length) return 0;
      setTimeout(() => {
        let img = v.map((s) => {
          return s.src;
        });
        let imgs = v.map((s) => {
          return s.srcs;
        });
        let narr = this.uploadconfig.img_url.concat(imgs);
        let narr2 = this.uploadconfig.img_urls.concat(img);
        narr = narr.filter((r) => {
          return r !== "";
        });
        narr2 = narr2.filter((r) => {
          return r !== "";
        });
        let os = {
          img_url: narr2.join(","),
          key: this.uploadconfig.key,
          key1: this.uploadconfig.key1,
          recipes_id: this.detail.id,
        };
        this.$api.http("recipesoldpic", os, () => {
          this.$set(
            this.detail.recipes[this.uploadconfig.key].list[os.key1],
            "img_url",
            narr
          );
          this.$set(
            this.detail.recipes[this.uploadconfig.key].list[os.key1],
            "img_urls",
            narr2
          );
        });
      }, 500);
    },
    onhistory() {
      if (+this.id === 2) {
        this.appPath("/work_recipes_history/" + this.id);
      } else {
        this.appPath("/work_recipes_history");
      }
    },
    onadd() {
      this.open1 = true;
      this.addext = {};
    },
    ondetail(e) {
      this.ext = e;
      this.open = true;
    },
    oneditfood() {
      this.open1 = true;
      this.addext = {
        $edit: true,
        list: this.detail.recipes,
        id: this.detail.id,
        type: this.detail.type,
      };
    },
    check() {
      let http = this.$api.http;
      return new Promise((resolve, reject) => {
        http("receiveid", {}, (r) => {
          resolve(!isNaN(r + ""));
        });
      });
    },
    toget1() {
      this.$api.http(
        "recipes",
        { cookbook_type: this.id, recipes_id: "" },
        (r) => {
          this.list = r;
        }
      );
    },
    toget2() {
      this.$api.http("recipesold", {}, (r) => {
        this.detail = r;
      });
    },
    async init() {
      let a = await this.check();
      this.issup = a;
      if (a) {
        this.toget1();
      } else {
        this.toget2();
      }
    },
  },
  mounted() {
    this.id = this.$route.params.id || "1";
    console.log(123);
    this.init();
  },
};
</script>
<style lang='less' scoped>
.list {
  font-size: 15px;
}
.b1 {
  width: 120px;
}
.lst {
  padding: 0 10px 10px;
  h6 {
    padding: 8px;
    position: relative;
    font-weight: 650;
    &::before {
      position: absolute;
      content: "";
      left: 0;
      width: 2px;
      height: 12px;
      top: 0;
      bottom: 0;
      margin: auto;
      background-color: #38f;
    }
  }
  li {
    color: rgb(119, 119, 119);
    line-height: 40px;
    padding-left: 10px;
    & + li {
      margin-top: 8px;
    }
    .logo {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
      background-color: #f9f9f9;
    }
    .name {
      flex: 1;
      position: relative;
      .click {
        position: absolute;
        right: 0;
        bottom: 0;
        font-size: 12px;
        color: rgb(226, 225, 225);
        line-height: 1;
      }
    }
  }
}
.detail {
  font-size: 15px;
  .box {
    padding: 10px;
    margin-bottom: 10px;
    .box_img {
      width: 110px;
      height: 110px;
      margin: 0 10px 10px 0;
      border-radius: 5px;
      overflow: hidden;
      &:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
}
.article {
  padding: 8px 0;
  position: relative;
  .article_add {
    position: absolute;
    right: 0;
    top: 8px;
    font-size: 12px;
    color: #ccc;
  }
}
.upload_files {
  position: absolute;
  left: -100vw;
  top: -100vh;
}
.box_img2 {
  width: 78px;
  height: 78px;
  margin: 0 10px 10px 0;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  &:nth-child(4n) {
    margin-right: 0;
  }
  .del {
    position: absolute;
    right: 0;
    top: 0;
    border-radius: 0 0 0 15px;
    background-color: tomato;
    color: #fff;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
}
.foot {
  height: 80px;
}
.app_bottom{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn_left{
  width:49%;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  background-color: #ff6347;
  color: #fff;
}
.btn_right{
  width:49%;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}
</style>
