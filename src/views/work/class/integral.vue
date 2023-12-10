<template>
  <v-view header>
    <template #menu>
      <v-c v-model="cls"></v-c>
    </template>
    <slot />
    <v-s v-model="val" @search="onPage(1)" plac="请输入宝宝名字"></v-s>
    <div class="app_top">
      <van-tabs v-model="active" title-active-color="#38f" @click="onPage(1)">
        <van-tab
          :title="i.t"
          :name="i.v"
          v-for="(i, j) in tab"
          :key="j + '-s'"
        ></van-tab>
      </van-tabs>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section v-for="(i, j) in item" :key="j" class="flex">
        <div class="logo">
          <v-a></v-a>
        </div>
        <div class="text">
          <h6>{{ i.chlid_name }}</h6>
          <p>
            奖分：<b class="col_green">+{{ +i.integral }}分</b>
          </p>
          <p v-if="i.describe">
            备注：<b class="col_primary">{{ i.describe }}</b>
          </p>
          <div class="img" v-if="i.photograph">
            <van-image
              :src="i.photograph"
              @click="appShowImage(i.photograph)"
            ></van-image>
          </div>
        </div>
      </section>
    </v-page>
  </v-view>
</template>

<script>
import vC from "../../private/select_class.vue";
import vA from "../../private/avatar.vue";
import vS from "../../private/search.vue";
export default {
  data() {
    return {
      cls: {},
      active: "1",
      val: "",
      tab: [
        { t: "出勤积分", v: "1" },
        { t: "完成作业", v: "2" },
        // { t: "测评积分", v: "3" },
        { t: "老师奖励", v: "4" },
      ],
      item: [],
    };
  },
  watch: {
    "cls.id"() {
      this.onPage(1);
    },
  },
  inject: ["appShowImage"],
  components: { vC, vA, vS },
  methods: {
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "integral",
        {
          page,
          class_id: this.cls.id || "",
          type: this.active,
          name: this.val,
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
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
section {
  padding: 10px;
  background-color: rgba(188, 241, 245, 0.3);
  position: relative;
  &:nth-child(2n) {
    background-color: rgba(250, 241, 192, 0.3);
  }
  align-items: center;
  .logo {
    width: 50px;
    margin-right: 10px;
    height: 50px;
  }
  .text {
    width: calc(100% - 60px);
    font-size: 12px;
    position: relative;
    padding-top: 5px;
    color: #999;
    .status {
      position: absolute;
      right: 0;
      top: 0;
      color: #999;
      font-size: 13px;
      &.send {
        top: 25px;
        font-size: 12px;
      }
    }
    h6 {
      font-weight: 650;
      line-height: 20px;
      margin-bottom: 5px;
      font-size: 15px;
      color: #666;
      span {
        font-size: 13px;
        font-weight: 400;
        padding-left: 10px;
      }
    }
    p + p {
      margin-top: 5px;
    }
  }
  .img {
    width: 50px;
    height: 50px;
    position: absolute;
    right: 8px;
    top: 5px;
    box-sizing: border-box;
    border: 1px solid rgba(51, 136, 255, 0.3);
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
  }
}
</style>
