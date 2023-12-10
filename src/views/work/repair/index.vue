<template>
  <v-view header>
    <template #menu>
      <span @click="open = !open">{{ time ? time : "历史申报" }}</span>
    </template>
    <div class="app_top">
      <van-tabs v-model="type"
                title-active-color="#38f"
                @click="onPage(1)">
        <van-tab :title="i.t"
                 :name="i.v"
                 v-for="(i, j) in tab"
                 :key="j"></van-tab>
      </van-tabs>
    </div>
    <v-page ref="page"
            @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <div class="app_section even">
        <section v-for="(i, j) in item"
                 :key="j + 'i'"
                 class="flex"
                 @click="ondetail(i)">
          <div class="logo">
            <v-a teacher></v-a>
          </div>
          <div class="text">
            <span class="status"
                  :class="i.completion_time ? 'col_green' : 'col_danger'">
              {{ i.completion_time ? "已维修" : "待维修" }}
            </span>
            <h6>{{ i.staff_name }}</h6>
            <p>{{ i.dpartment }}</p>
            <p>{{ i.date }}</p>
          </div>
        </section>
      </div>
    </v-page>
    <template #fixed>
      <v-t v-model="time"
           ymd
           :open="open"></v-t>
      <v-f v-model="open1"
           :footer="false"
           text="维修详情">
        <van-cell title="申请日期"
                  :value="det.date"></van-cell>
        <van-cell title="部门"
                  :value="det.dpartment"></van-cell>
        <van-cell title="上报人"
                  :value="det.staff_name"></van-cell>
        <van-cell title="维修物品"
                  :value="det.article"></van-cell>
        <van-cell title="物品描述"
                  :value="det.explain"></van-cell>
        <van-cell title="维修人"
                  :value="det.repairman"></van-cell>
        <template v-if="det.completion_time">
          <van-cell title="维修时间"
                    :value="det.completion_time"></van-cell>
        </template>
        <template v-if="+type === 1 || det.approval_url === ''">
          <van-cell title="领导审批签名"
                    is-link
                    value="点击签名"
                    @click="open3 = true"></van-cell>
          <v-h v-if="open3"
               v-model="h1"></v-h>
        </template>
        <template v-else>
          <van-cell title="领导已审批签字"></van-cell>
          <div class="hands">
            <van-image :src="det.approval_url"
                       @click="appShowImage(det.approval_url)"></van-image>
          </div>
        </template>
        <template v-if="+type === 3">
          <van-cell title="维修时间"
                    is-link
                    :value="timetext"
                    @click="open5 = !open5"
                    v-if="det.approval_url"></van-cell>
          <van-cell v-else
                    title="验证人暂时无法签字,请先通知领导审批"></van-cell>
          <van-cell title="验证人签名"
                    is-link
                    value="点击签名"
                    v-if="det.approval_url"
                    @click="open4 = true"></van-cell>
          <v-h v-if="open4"
               v-model="h2"></v-h>
        </template>
        <template v-else-if="det.approval_url">
          <van-cell title="验证人已审批签字"></van-cell>
          <div class="hands">
            <van-image :src="det.verifier_url"
                       @click="appShowImage(det.verifier_url)"></van-image>
          </div>
        </template>
        <div class="w60"
             v-if="isbtn">
          <van-button block
                      round
                      :color="$js.btnColor"
                      @click="onsubmit">提交</van-button>
        </div>
        <v-t v-model="time2"
             :open="open5"
             ymd
             max="y_1"></v-t>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
import vT from "../../private/time.vue";
import vA from "../../private/avatar.vue";
import vH from "../../private/hand.vue";
export default {
  data() {
    return {
      tab: [
        { t: "待审批", v: "1" },
        { t: "已审批", v: "2" },
        { t: "待签字", v: "3" },
        { t: "已签字", v: "4" },
      ],
      type: "",
      item: [],
      open: false,
      time: "",
      id: "",
      open1: false,
      det: {},
      open3: false,
      open4: false,
      open5: false,
      h1: {},
      h2: {},
      time2: "",
    };
  },
  watch: {
    type(n) {
      console.log(n);
      this.appPath("/work_repair/" + n, true);
    },
    time() {
      this.onPage(1);
    },
    open1(n) {
      if (!n) {
        console.log(this.open4, this.open5);
        this.appPath("/work_repair/" + this.type, true);
        this.det = {};
        this.h1 = {};
        this.h2 = {};
        this.time2 = {};
        this.open4 = false
        this.open5 = false;
      }
    },
  },
  computed: {
    isbtn() {
      let a = this.h1;
      let b = this.h2;
      return a.src || b.src;
    },
    timetext() {
      let s = "选择维修时间";
      if (typeof this.time2 === "string") {
        s = this.time2;
      }
      return s;
    },
  },
  inject: ["appPath", "appShowImage"],
  components: { vF, vT, vA, vH },
  methods: {
    onsubmit() {
      let os = {
        id: this.det.id,
        picture: "",
        completion_time: "",
        type: this.type,
      };
      if (+this.type === 1) {
        os.picture = this.h1.src;
      } else if (+this.type === 3) {
        os.picture = this.h2.src;
        os.completion_time = this.time2;
        if (os.completion_time === "") return this.$toast("请选择维修时间");
      }
      if (os.picture === "") return this.$toast("请签字");
      this.$api.http("repairhand", os, () => {
        this.$nextTick(() => {
          this.open = false;
          this.open1 = false;
          this.open5 = false;
          this.$toast("提交成功");
          this.onPage(1);
        })
      });
    },
    ondetail(e) {
      this.det = e;
      this.appPath("/work_repair/" + this.type + "&" + e.id, true);
      this.open1 = true;
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "repair",
        { page, date: this.time, department_id: "", type: this.type },
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
  mounted() {
    this.type = this.$route.params.type || "1";
    this.id = this.$route.params.id || "";
  },
};
</script>
<style lang='less' scoped>
.hands {
  width: 300px;
  height: 180px;
  margin: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
</style>
