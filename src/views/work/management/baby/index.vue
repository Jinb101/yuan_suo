<template>
  <v-view header>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <van-cell
        :label="totime(i)"
        is-link
        v-for="(i, j) in item"
        :key="j"
        @click="ondetail(i)"
      >
        <template #title>
          <span class="font">{{ i.video_name }}</span>
          <span class="font_viewers">{{ i.viewers }} 人正在观看</span>
        </template>
      </van-cell>
    </v-page>
    <template #fixed>
      <v-f v-model="open" :footer="false" text="宝贝在线详情">
        <template #menu>
          <span @click="open1 = !open1">{{ open1 ? "取消" : "" }}大屏</span>
        </template>
        <v-d :ids="id" :menu="open1"></v-d>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../../private/fixed.vue";
import vD from "./detail.vue";
export default {
  data() {
    return {
      item: [],
      open: false,
      id: "",
      open1: false,
    };
  },
  components: { vF, vD },
  inject: ["appPath"],
  methods: {
    ondetail(e) {
      this.appPath("/management_baby/" + e.baby_id, true);
      this.id = e.baby_id;
      this.open = true;
    },
    totime(e) {
      let a = ["开放时间："];
      if (e.morning_start) {
        a = a.concat([e.morning_start, "~", e.morning_end, " "]);
      }
      if (e.afternoon_start) {
        a = a.concat([e.afternoon_start, "~", e.afternoon_end, " "]);
      }
      return a.join("");
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("baby", { page }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(
          e.map((s) => {
            s.open = false;
            return s;
          })
        );
        this.$refs.page.onFinish(e.length < 20);
      });
    },
  },
  mounted() {
    console.log(this.$route.params.id, "this.$route.params.id");
    this.id = this.$route.params.id || "";
    if (this.id) {
      this.ondetail({ baby_id: this.id });
    }
  },
};
</script>
<style lang='less' scoped>
.font {
  font-weight: 650;
  font-size: 15px;
}
.font_viewers{
          margin-left: 10px;
          font-size:  12px ;
          color: gray;
}
</style>
