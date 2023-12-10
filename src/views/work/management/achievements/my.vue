<template>
  <v-view header bgc="#f5f5f5">
    <template #menu>
      <span @click="onhis">{{ history ? "当月" : "历史" }}未考核</span>
    </template>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section
        v-for="(i, j) in item"
        :key="j"
        class="van-hairline--bottom"
        @click="ondetail(i, j)"
      >
        <p class="right">
          <span v-if="!(i.parent_time && i.parent_time > 0)" class="col_danger">
            [待考核]
          </span>
          <span v-else-if="i.status === 0">[已考核未录入工资]</span>
          <span v-else>[已考核]</span>
        </p>
        <p>
          被考核人：<b>{{ i.name }}</b>
        </p>
        <p class="flex">
          <span
            >所属部门：<b>{{ i.group_name }}</b></span
          >
          <span
            >岗位名称：<b>{{ i.job_name }}</b></span
          >
        </p>
        <p>
          考核月份：<b>{{ i.year_month }}</b>
        </p>
        <span
          class="circle"
          v-if="!(i.parent_time && i.parent_time > 0)"
        ></span>
        <p class="desc">请在 {{ toMonth(i.year_month) }} 月1到5日完成考核</p>
      </section>
    </v-page>
    <template #fixed>
      <v-f v-model="open" :footer="false" text="绩效审核自我评分">
        <v-v v-model="det" @change="onchangesub"></v-v>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../../private/fixed.vue";
import vV from "./_my_det.vue";
export default {
  data() {
    return {
      item: [],
      open: false,
      idarr: [],
      type: "0",
      ids: "",
      det: {},
    };
  },
  components: { vF, vV },
  computed: {
    history() {
      return +this.type === 1;
    },
  },
  watch: {
    type() {
      this.onPage(1);
    },
    ids(n) {
      if (n.indexOf(",") > 0) {
        this.appPath(
          "/management_achievements_my/" + this.type + "&" + n,
          true
        );
        this.idarr = n.split(",");
      }
    },
    idarr: {
      handler(n) {
        this.ondetaildata(n);
      },
      deep: true,
    },
    open(n) {
      if (!n) {
        this.appPath("/management_achievements_my", true);
        this.ids = "";
        this.idarr = [];
      }
    },
  },
  inject: ["appPath"],
  methods: {
    onchangesub(e) {
      let os = {
        ...e,
        staff_id: "",
        month_id: this.idarr[1],
      };
      let index = this.idarr[3];
      this.$api.http("achievementsset", os, () => {
        this.$toast("打分成功");
        this.open = false;
        this.$set(this.item[index], "parent_time", Date.now());
      });
    },
    ondetaildata() {
      if (!this.idarr.length) return 0;
      this.$api.http(
        "achievementsmy",
        { staff_id: this.idarr[0], year_month: this.idarr[2] },
        (r) => {
          this.det = r;
          this.open = true;
        }
      );
    },
    onhis() {
      let n = (this.type = this.history ? "0" : "1");
      this.appPath("/management_achievements_my/" + n + "&0", true);
    },
    ondetail(e, j) {
      let id = [e.id, e.month_id, e.year_month, j];
      this.appPath(
        "/management_achievements_my/" + this.type + "&" + id.join(","),
        true
      );
      this.idarr = id;
    },
    toMonth(e) {
      // eslint-disable-next-line
      let t = demo.timeout("", "array");
      let v = (e + "").split("-")[1];

      let s = +v + 1 > 12 ? [t[0] + 1, +v + 1 - 12].join("年") : +v + 1;
      return s;
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "achievementsmylist",
        { page, is_assessed: this.type },
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
    this.type = this.$route.params.type || "0";
    this.ids = this.$route.params.id || "";
  },
};
</script>
<style lang='less' scoped>
section {
  padding: 15px;
  font-size: 15px;
  position: relative;
  margin: 8px;
  border-radius: 15px 5px;
  background-color: rgb(245, 254, 255);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  &:nth-child(2n) {
    background-color: rgb(249, 252, 241);
  }
  p {
    margin-bottom: 5px;
    padding: 2px 0;
    color: #999;
    b {
      color: #666;
      font-weight: 650;
    }
    &.right {
      text-align: right;
      span {
        position: absolute;
        right: 5px;
        top: 5px;
      }
    }
    > span {
      flex: 1;
    }
    &.desc {
      margin-bottom: 0;
      color: tomato;
      font-size: 12px;
    }
  }
  .circle {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: tomato;
    top: 10px;
    left: 10px;
  }
}
</style>
