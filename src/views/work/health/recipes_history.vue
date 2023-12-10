<template>
  <v-view header bgc="#f9f9f9" :index="499">
    <!-- 供应商食谱 -->
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section v-for="(i, j) in item" :key="j" @click="ondetail(i)" class="cs">
        <template v-if="issup === true">
          <h5>{{ i.recipe_name || "食谱" + (j + 1) }}</h5>
          <p>
            类型：{{ ["", "标准", "优选", "精致", "自定义"][+i.recipe_type] }}
          </p>
          <p>
            周期：{{ time(i.recipe_start_time) }} ~~
            {{ time(i.recipe_end_time) }}
          </p>
          <p>评语：{{ i.comment || "无" }}</p>
          <p>添加人：{{ i.staff.name }}</p>
        </template>
        <template v-else-if="issup === false">
          <!-- 没有供应商食谱 -->
          <van-cell
            :title="i.start_time + '~' + i.end_time"
            is-link
            @click.stop="onuse(i)"
          ></van-cell>
          <template v-if="+i.type === 1">
            <van-collapse
              v-model="activeName"
              accordion
              v-if="i.recipes && i.recipes.length"
            >
              <van-collapse-item
                :title="x.day + '(' + x.week + ')'"
                :name="y + j * 100 + ''"
                v-for="(x, y) in i.recipes"
                :key="y + '-w'"
              >
                <article
                  v-for="(q, w) in x.list"
                  :key="w + '-ar'"
                  class="article"
                >
                  <h5>{{ q.title }}</h5>
                  <p class="content">{{ q.content }}</p>
                  <div class="box flex fw">
                    <template v-if="q.img_url && q.img_url.length">
                      <div
                        class="box_img2"
                        v-for="(x2, y2) in q.img_url"
                        :key="y2 + '-' + w + '-' + y"
                      >
                        <van-image
                          :src="x2"
                          lazy-load
                          @click.stop="appShowImage(q.img_url, y2)"
                        ></van-image>
                      </div>
                    </template>
                  </div>
                </article>
              </van-collapse-item>
            </van-collapse>
          </template>
          <template v-else>
            <div class="detail" v-if="i.recipes && i.recipes.length">
              <section
                class="box flex fw"
                v-for="(i2, j2) in i.recipes"
                :key="j2 + '5000'"
              >
                <template v-if="i2.list && i2.list.length">
                  <div
                    class="box_img"
                    v-for="(x, y) in i2.list"
                    :key="y + '-' + j2 + '5000'"
                  >
                    <van-image
                      :src="x"
                      lazy-load
                      @click.stop="appShowImage(i2.list, y)"
                    ></van-image>
                  </div>
                </template>
              </section>
            </div>
            <van-empty v-else description="暂无添加食谱"></van-empty>
          </template>
          <div class="flex btns">
            <van-button
              size="small"
              icon="delete-o"
              type="danger"
              round
              @click.stop="ondels(i)"
              plain
              v-if="j === 0"
              >删除</van-button
            >
            <van-button
              size="small"
              icon="plus"
              type="info"
              round
              @click.stop="onuse(i)"
              plain
              >复用</van-button
            >
          </div>
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
      </section>
    </v-page>
    <template #fixed>
      <v-f v-model="open" :footer="false" :index="500">
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
                      @click.stop="onchilddetail(q)"
                    >
                      <div class="logo">
                        <van-image
                          :src="q.picture_of_dishes"
                          v-if="q.picture_of_dishes"
                          fit="cover"
                          lazy-load
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
      </v-f>
      <v-f
        v-model="open2"
        :footer="false"
        :text="child.cooked_food_name"
        :index="505"
      >
        <template v-if="child.nursery_dish && child.nursery_dish.length">
          <van-cell
            v-for="(i, j) in child.nursery_dish"
            :key="j"
            :title="i.goods_name || '*'"
            :value="+i.consumption + 'g'"
          ></van-cell>
        </template>
        <van-empty v-else description="暂未收录食材"></van-empty>
      </v-f>
      <v-f v-model="open3" :footer="false" text="复用食谱">
        <v-a v-model="ext" @end="onends"></v-a>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
import vA from "./_recipes_add.vue";
export default {
  data() {
    return {
      issup: null, // 是否有供应商
      id: "",
      item: [],
      list: [],
      open: false,
      open2: false,
      open3: false,
      child: {},
      // eslint-disable-next-line
      foodpic: demo.siteConfig.icon("food", "private"),
      activeName: "0",
      ext: {},
    };
  },
  components: { vF, vA },
  inject: ["reload", "appShowImage"],
  methods: {
    onuse(e) {
      // 复用
      this.ext = {
        $edit: true,
        $use: true,
        list: e.recipes,
        id: e.id,
        type: e.type,
      };
      this.open3 = true;
    },
    ondels(e) {
      this.$js.modeldel(() => {
        this.$api.http("recipesdel", { id: e.id }, () => {
          this.$toast("删除成功");
          this.item = this.item.filter((r) => {
            return r.id !== e.id;
          });
        });
      });
    },
    onends() {
      this.open3 = false;
      this.init();
    },
    ondetail(e) {
      if (!this.issup) return 0;
      this.$api.http(
        "recipes",
        { cookbook_type: this.id, recipes_id: e.recipes_id },
        (r) => {
          this.list = r;
          this.open = true;
        }
      );
    },
    onchilddetail(e) {
      this.child = e;
      this.open2 = true;
    },
    time(v) {
      // eslint-disable-next-line
      return demo.timeout(v, "ymd");
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      let api = this.issup ? "recipeshistory" : "recipesoldhistory";
      this.$api.http(
        api,
        {
          page,
          cookbook_type: this.id,
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
    check() {
      let http = this.$api.http;
      return new Promise((resolve, reject) => {
        http("receiveid", {}, (r) => {
          resolve(!isNaN(r + ""));
        });
      });
    },
    toget1() {
      // this.onPage(1)
    },
    toget2() {
      // this.$toast("暂无供应商");
      // this.onPage(1)
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
    this.init();
  },
};
</script>
<style lang='less' scoped>
.cs {
  font-size: 15px;
  padding: 10px;
  margin: 10px;
  background-color: #fff;
  border-radius: 25px 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  h5 {
    font-weight: 650;
    padding: 10px 0;
  }
  p {
    line-height: 1.2;
    padding: 5px 0;
  }
}
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
    margin-bottom: 10px;
    .box_img {
      width: 100px;
      height: 100px;
      margin: 0 10px 10px 0;
      border-radius: 5px;
      overflow: hidden;
      &:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
}
.van-cell {
  padding-right: 0;
  &::before {
    position: absolute;
    right: 20px;
    top: 10px;
    font-size: 12px;
    content: "点击复用";
    color: #ccc;
  }
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
}
.btns {
  padding-top: 10px;
  flex-direction: row-reverse;
  .van-button {
    min-width: 100px;
    margin-left: 10px;
  }
}
</style>
