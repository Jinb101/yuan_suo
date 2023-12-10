<template>
  <v-view header bgc="#f7f7f7">
    <template #menu>
      <span @click="appPath('/work_survey_list')">调研记录</span>
    </template>
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
      <section v-for="(i, j) in item" :key="j + '-w'" @click.stop="onDetail(i)">
        <div class="box">
          <p class="name">
            <b>{{ i.name }}</b>
          </p>
          <p>
            选择题：<b class="col_primary">{{ i.choice }}道</b>
          </p>
          <p>
            问答题：<b class="col_primary">{{ i.ask_and_answer }}道</b>
          </p>
          <p>发布时间：{{ appTimeout(i.create_time, true) }}</p>
          <span class="status" v-if="+i.status === 1">
            <van-image :src="pic"></van-image>
          </span>
          <van-button
            v-else
            round
            size="small"
            :color="$js.btnColor"
            @click.stop="onSend(i, j)"
          >
            去答题
          </van-button>
        </div>
      </section>
    </v-page>
    <template #fixed>
      <v-f v-model="open" text="查看已填写" :footer="false" :index="500">
        <v-a det :fid="fid" :rid="rid"></v-a>
      </v-f>
      <v-f v-model="open1" text="填写调研表" :footer="false" :index="501">
        <v-a :fid="fid" :rid="rid" @close="onclose"></v-a>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
import vA from "./add.vue";
export default {
  data() {
    return {
      tab: [
        { t: "员工调研表", v: "2" },
        { t: "胜任力调研表", v: "3" },
      ],
      type: "2",
      item: [],
      // eslint-disable-next-line
      pic: demo.siteConfig.icon(1, "status"),
      open: false,
      open1: false,
      index: -1,
      fid: "",
      rid: "",
    };
  },
  components: { vF, vA },
  inject: ["appTimeout", "appPath"],
  methods: {
    onclose() {
      this.open1 = false;
      if (this.index > -1) {
        this.$set(this.item[this.index], "status", 1);
      }
    },
    onDetail(e) {
      if (!e.status) return 0;
      this.fid = e.id;
      this.rid = e.r_id;
      this.index = -1;
      this.open = true;
    },
    onSend(e, index) {
      this.fid = e.id;
      this.rid = e.r_id;
      this.index = index;
      this.open1 = true;
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("feedback", { page, type: this.type }, (e) => {
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
  padding: 8px 15px;
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
</style>
