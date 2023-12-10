<template>
  <v-view header bgc="#f7f7f7">
    <div class="app_top">
      <van-tabs
        v-model="type"
        color="#99cc33"
        title-active-color="#99cc33"
        @change="onPage(1)"
      >
        <van-tab
          :title="i.t"
          v-for="(i, j) in tab"
          :key="j + '-t'"
          :name="i.v"
        ></van-tab>
      </van-tabs>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length" />
      <section v-for="(i, j) in item" :key="j + '-w'">
        <p class="time">{{ appTimeout(i.feedback_info.create_time, true) }}</p>
        <div class="box">
          <p class="name">
            <b>{{ i.feedback_info.name }}</b>
          </p>
          <p>
            选择题：
            <b class="col_primary">{{ i.feedback_info.xuanze_count }}题</b>
          </p>
          <p>
            问答题：
            <b class="col_primary">{{ i.feedback_info.wenda_count }}题</b>
          </p>
          <p>
            参与人数：<b>{{ i.answer }}人</b>
          </p>
          <p>
            总分：<b>{{ i.totalScore }}分</b>
          </p>
          <p>
            平均分：<b class="col_green">{{ i.averageScore }}分</b>
          </p>
          <p>
            满分：<b>{{ i.total_points }}分</b>
          </p>
          <van-button
            round
            size="small"
            :color="$js.btnColor"
            v-if="i.answer > 0"
            @click="onshow(i)"
          >
            去看看
          </van-button>
        </div>
      </section>
    </v-page>
    <template #fixed>
      <v-f v-model="open" :footer="false" text="查看" :index="500">
        <v-l :fid="fid" :rid="rid" @child="onshowchild"></v-l>
      </v-f>
      <v-f v-model="open2" :footer="false" text="已回答人" :index="501">
        <ul class="child">
          <li
            v-for="(i, j) in child"
            :key="j + 'c'"
            class="flex"
            @click.stop="ontel(i.phone)"
          >
            <div class="logo">
              <van-image :src="i.avatar"></van-image>
            </div>
            <div class="f1">
              <van-cell
                :title="i.nickname"
                :label="i.classname"
                :value="i.phone"
                is-link
              ></van-cell>
              <template v-if="i.ques_type === 2">
                <p class="desc">
                  {{ i.answer }}
                </p>
              </template>
            </div>
          </li>
        </ul>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
import vL from "./listdet.vue";
export default {
  data() {
    return {
      tab: [
        { t: "家长满意度调研表", v: "1" },
        { t: "员工调研表", v: "2" },
        { t: "胜任力调研表", v: "3" },
      ],
      type: "1",
      item: [],
      open: false,
      fid: "",
      rid: "",
      open2: false,
      child: [],
    };
  },
  components: { vF, vL },
  inject: ["appTimeout"],
  methods: {
    onshowchild(e) {
      this.child = e;
      this.open2 = true;
    },
    onshow(e) {
      this.fid = e.f_id;
      this.rid = e.feedback_info.r_id;
      this.open = true;
    },
    ontel(e) {
      // eslint-disable-next-line
      demo.siteConfig.tel(e);
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("feedbacklists", { page, type: this.type }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
section {
  padding: 15px;
  font-size: 15px;
  .time {
    padding: 5px 10px;
    margin: 0 auto 10px;
    background-color: #dfdfdf;
    color: #fff;
    text-align: center;
    width: 120px;
    border-radius: 5px;
    transform: scale(0.8);
  }
  .box {
    background-color: #fff;
    padding: 15px 10px;
    position: relative;
    border-radius: 2px;
    .name {
      font-weight: 650;
      color: #333;
    }
    .status {
      position: absolute;
      right: 0;
      top: 0;
      width: 66px;
      height: 58px;
    }
    .van-button {
      position: absolute;
      right: 10px;
      bottom: 10px;
      min-width: 75px;
    }
    p {
      line-height: 1.2;
      margin-bottom: 5px;
      color: #888;
      b {
        font-weight: 600;
      }
    }
  }
}
.child {
  li {
    padding: 0 10px;
    .logo {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #f7f7f7;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      margin-top: 10px;
    }
    .f1 {
      width: calc(100% - 40px);
      box-sizing: border-box;
    }
  }
  .desc {
    font-size: 14px;
    line-height: 1.2;
    padding: 8px;
    word-break: break-all;
    color: #999;
  }
}
</style>
