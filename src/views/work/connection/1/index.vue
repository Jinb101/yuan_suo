<template>
  <v-view retreat bgc="#f8f7fa" index="500" ref="view">
    <div class="tmep_con1">
      <div class="app_top">
        <div class="header1 flex">
          <section>
            <v-c v-model="cls" @created="init" db arrow></v-c>
            <!-- <van-icon name="arrow-down" /> -->
          </section>
          <section @click="open = !open">
            {{ time }}
            <van-icon name="arrow-down" />
          </section>
        </div>
        <div class="search flex">
          <div class="s">
            <v-s v-model="val" @search="onPage(1)" unauto></v-s>
          </div>
          <div class="r">
            <span
              class="tap"
              @click="index = 1"
              v-if="+index !== 1"
              :class="{ active: +index !== 0 }"
              >次数升序</span
            >
            <span
              class="tap"
              @click="index = 2"
              v-else
              :class="{ active: +index !== 0 }"
              >次数降序</span
            >
            <span
              class="tap"
              @click="index = 0"
              :class="{ active: +index === 0 }"
              >最近更新</span
            >
          </div>
        </div>
      </div>
      <v-page ref="page" @on-page="onPage">
        <van-empty v-if="!item.length"></van-empty>
        <ul>
          <li
            v-for="(i, j) in item"
            :key="j"
            class="flex"
            @click.stop="ondet(i)"
          >
            <div class="logo">
              <v-a :src="i.base_map" :sex="i.gender" size="1.5466rem"></v-a>
            </div>
            <div class="text">
              <h2>
                {{ i.name }}<b class="col_green">{{ i.number }} 次</b>
              </h2>
              <p>
                {{
                  [
                    +i.gender === 1 ? "男" : +i.gender === 2 ? "女" : "",
                    i.age,
                  ].join(" ")
                }}
              </p>
              <p>最后更新：{{ appTimeout(i.modification_time) }}</p>
            </div>
            <div class="add flex" @click.stop="onadd(i)">
              <van-icon name="add-o" />
              <b>添加记录</b>
            </div>
          </li>
        </ul>
      </v-page>
    </div>
    <template #fixed>
      <v-t v-model="time" ymd ym :open="open" max="d_0" type="year-month"></v-t>
      <v-f v-model="open1" :footer="false" text="发布观察记录" bgc="#f8f7fa">
        <v-pa v-model="ext" @end="onPage(1)"></v-pa>
      </v-f>
      <v-f v-model="open2" :footer="false" text="观察记录" bgc="#f8f7fa">
        <v-pc v-model="ext" @end="onPage(1)" @share="onshare"></v-pc>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vC from "../../../private/select_class.vue";
import vS from "../../../private/search.vue";
import vA from "../../../private/avatar.vue";
import vT from "../../../private/time.vue";
import vF from "../../../private/fixed.vue";
import vPa from "./add.vue";
import vPc from "./child.vue";
export default {
  data() {
    return {
      cls: {},
      item: [],
      time: "",
      open: false, // 控制时间
      val: "",
      index: 2,
      open1: false, // 控制发布
      open2: false, // 控制查看单一宝宝
      ext: {},
      typeid: "",
    };
  },
  watch: {
    "cls.id"() {
      this.onPage(1);
    },
    index() {
      this.onPage(1);
    },
    time() {
      this.onPage(1);
    },
    open2(n) {
      if (!n) {
        this.appPath("/connection/" + this.typeid, true);
      }
    },
  },
  inject: ["appTimeout", "appPath"],
  components: { vC, vS, vA, vT, vF, vPa, vPc },
  methods: {
    onshare(e) {
      this.$refs.view.$share();
      this.$js.wxshareh5(
        "observe",
        { id: e.his, path: this.$route.path },
        "您的好友分享给你宝宝观察记录"
      );
    },
    ondet(e) {
      this.ext = e;
      this.open2 = true;
      this.appPath("/connection/" + this.typeid + "&" + e.id, true);
    },
    onadd(e) {
      this.ext = e;
      this.open1 = true;
    },
    onPage(page, f) {
      this.open1 = false;
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      if (!this.cls.id) return 0;
      this.$api.http(
        "contact40",
        {
          page,
          class_id: this.cls.id,
          years: this.time,
          name: this.val,
          order: this.index,
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
    init() {},
  },
  mounted() {
    this.typeid = this.$route.params.type;
    let id = this.$route.params.id;
    if (id) {
      this.ondet({ id });
    }
    if (this.time === "") {
      // eslint-disable-next-line
      let t = demo.timeout("", "object");
      this.time = [t.y, t.m].join("-");
    }
  },
};
</script>
<style lang='less' scoped>
.tmep_con1 {
  .header1 {
    height: 50px;
    margin-bottom: 8px;
    background-color: #fff;
    box-sizing: border-box;
    padding-left: 80px;
    section {
      width: 50%;
      box-sizing: border-box;
      position: relative;
      text-align: center;
      font-size: 14px;
      line-height: 50px;
      &:first-child {
        border-right: 1px solid #f8f7fa;
      }
      .van-icon {
        position: absolute;
        right: 5px;
        top: 0;
        bottom: 0;
        margin: auto;
        font-size: 14px;
        color: #999;
        height: 14px;
      }
    }
  }
  .search {
    height: 54px;
    background-color: #fff;
    box-sizing: border-box;
    .s {
      width: calc(100% - 100px);
    }
    .r {
      padding-left: 12px;
      width: 85px;
      font-size: 14px;
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
      span {
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 16px;
        padding: 4px 0;
        box-sizing: border-box;
        color: #999;
        letter-spacing: 2px;
        & + span {
          margin-right: 5px;
        }
        &.active {
          color: #666;
          text-decoration: underline;
        }
      }
    }
  }
  ul {
    padding: 8px 0;
    li {
      background-color: #fff;
      margin-bottom: 8px;
      box-sizing: border-box;
      height: 90px;
      box-sizing: border-box;
      position: relative;
      padding: 15px 0 0 20px;
      .logo {
        width: 58px;
        height: 58px;
        margin-right: 12px;
      }
      .text {
        width: calc(100% - 70px);
        box-sizing: border-box;
        position: relative;
        z-index: 10;
        font-size: 12px;
        h2 {
          font-weight: 650;
          font-size: 16px;
          line-height: 24px;
          padding: 4px 0;
          b {
            padding-left: 8px;
          }
        }
        p {
          margin-bottom: 4px;
          &:last-child {
            color: #999;
          }
        }
      }
      .add {
        position: absolute;
        width: 72px;
        height: 100%;
        box-sizing: border-box;
        top: 0;
        right: 0;
        z-index: 22;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        .van-icon {
          font-size: 35px;
          color: #99cc33;
          margin-bottom: 8px;
        }
        &::before {
          position: absolute;
          content: "";
          left: 0;
          top: 20%;
          height: 60%;
          width: 1px;
          background-color: #f8f7fa;
        }
      }
    }
  }
}
</style>
