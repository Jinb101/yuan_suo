<template>
  <v-view header>
    <template #menu>
      <span @click="open = !open">{{ open ? "关闭" : "" }}筛选</span>
    </template>
    <div class="app_top">
      <van-tabs v-model="active" title-active-color="#38f" @click="ontab">
        <van-tab
          :title="i.t"
          :name="i.index"
          v-for="(i, j) in tab"
          :key="j"
        ></van-tab>
      </van-tabs>
      <transition name="van-slide-down">
        <div class="search_box" v-if="open">
          <van-cell
            title="岗位/积分类型"
            is-link
            @click="open1 = !open1"
            :value="s1.join('/')"
          ></van-cell>
          <van-cell
            v-if="typesId"
            title="选择搜索职位"
            is-link
            @click="open7 = !open7"
            :value="s7.text"
          ></van-cell>
          <template v-if="+active === 0">
            <van-cell
              title="选择查询月份"
              is-link
              @click="open2 = !open2"
              :value="search1[0].year_month"
            ></van-cell>
          </template>
          <template v-else-if="+active === 1">
            <van-cell
              title="选择查询学期"
              is-link
              @click="open3 = !open3"
              :value="s3.join('')"
            ></van-cell>
          </template>
          <template v-else-if="+active === 2">
            <van-cell
              title="选择查询学年"
              is-link
              @click="open4 = !open4"
              :value="s4.text"
            ></van-cell>
          </template>
          <template v-else-if="+active === 4">
            <van-cell
              title="选择查询开始时间"
              is-link
              @click="open5 = !open5"
              :value="search1[4].start_time"
            ></van-cell>
            <van-cell
              title="选择结束开始时间"
              is-link
              @click="open6 = !open6"
              :value="search1[4].end_time"
            ></van-cell>
          </template>
          <div class="btn">
            <van-button
              block
              round
              :color="$js.btnColor"
              size="small"
              @click="onsearch"
              >点击搜索</van-button
            >
          </div>
        </div>
      </transition>
    </div>
    <!-- 筛选 岗位/积分类型 通用 -->
    <!-- 月份：选择月份
    学期：选择学期
    年度：选择年
    总积分：无
    自定义：选择开始时间 选择结束时间 -->
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <div class="app_section">
        <section v-for="(i, j) in item" :key="j" class="flex">
          <div class="logo">
            <v-a :src="i.avatar"></v-a>
          </div>
          <div class="text">
            <span class="status">{{ i.job_name }}</span>
            <h6>{{ i.name }}</h6>
            <p>总积分：{{ toMax(i) }}分</p>
            <p>行为积分：{{ i.behavioral_integral }}分</p>
            <p v-if="i.bonus_points > 0">行为加分：{{ i.bonus_points }}分</p>
            <p v-if="i.deducted > 0">行为扣分：{{ i.deducted }}分</p>
            <p>绩效积分：{{ i.performance_score }}分</p>
          </div>
        </section>
      </div>
    </v-page>
    <template #fixed>
      <v-s v-model="s1" :list="t1" :open="open1" noselect @change="ons1"></v-s>
      <v-t v-model="s2" :open="open2" type="year-month" max="m_1"></v-t>
      <v-s v-model="s3" :list="t3" :open="open3" noselect @change="ons3"></v-s>
      <v-s v-model="s4" :list="t4" :open="open4" noselect @change="ons4"></v-s>
      <v-t v-model="s5" :open="open5" type="year-month" max="d_1"></v-t>
      <v-t v-model="s6" :open="open6" type="year-month" max="m_1"></v-t>
      <v-s v-model="s7" :list="t2" :open="open7" noselect @change="ons7"></v-s>
    </template>
  </v-view>
</template>

<script>
import vA from "../../../private/avatar.vue";
import vF from "../../../private/fixed.vue";
import vT from "../../../private/time.vue";
import vS from "../../../private/select.vue";
export default {
  data() {
    return {
      item: [],
      tab: [
        { t: "月度积分", a: 0 },
        { t: "学期积分", a: 1 },
        { t: "年度积分", a: 1 },
        { t: "总积分", a: 2 },
        { t: "自定义", a: 1 },
      ].map((s, v) => {
        s.index = v + "";
        return s;
      }),
      search: {
        j_id: "",
        type: "",
      },
      search1: [
        { year_month: "" },
        { year: "", semester: "" },
        { year: "" },
        {},
        { start_time: "", end_time: "" },
      ],
      api: ["m", "y", "a"],
      apis: "integrallevel",
      active: "",
      typesId: "", // 积分类型 配合筛选搜索使用显示
      open: false,
      open1: false, // 控制岗位/积分类型
      open2: false, // 控制选择月份
      open3: false,
      open4: false,
      open5: false,
      open6: false,
      open7: false, // 控制职位
      t1: [], // 岗位/积分类型
      t2: [], // 职位
      t3: [], // 学期
      t4: [], // 学年
      s1: [],
      s2: {},
      s3: [],
      s4: {},
      s5: {},
      s6: {},
      s7: {},
    };
  },
  watch: {
    open(n) {
      if (n) {
        this.initonce();
      }
    },
    typesId(n) {
      if (n) {
        this.$api.http("getjob", { g_id: n }, (r) => {
          this.t2 = r.map((s) => {
            return {
              text: s.name,
              id: s.id,
            };
          });
        });
      }
    },
    s2: {
      handler(n) {
        if (n.obj) {
          this.search1[0].year_month = [n.obj.y, n.obj.m].join("-");
        } else {
          this.search1[0].year_month = "";
        }
      },
      deep: true,
    },
    s5: {
      handler(n) {
        if (n.obj) {
          this.search1[4].start_time = [n.obj.y, n.obj.m].join("-");
        } else {
          this.search1[4].start_time = "";
        }
      },
      deep: true,
    },
    s6: {
      handler(n) {
        if (n.obj) {
          this.search1[4].end_time = [n.obj.y, n.obj.m].join("-");
        } else {
          this.search1[4].end_time = "";
        }
      },
      deep: true,
    },
  },
  components: { vA, vF, vT, vS },
  inject: ["appPath"],
  methods: {
    ons1(e, v) {
      this.typesId = e[0].id;
      this.search.type = e[1].id > 99 ? "" : e[1].id;
    },
    ons3(e, v) {
      this.search1[1].year = e[0].id;
      this.search1[1].semester = e[1].id;
    },
    ons4(e, v) {
      this.search1[2].year = v.id;
    },
    ons7(e, v) {
      this.search.j_id = v.id;
    },
    onsearch() {
      this.onPage(1);
    },
    toMax(i) {
      let num = this.typesId || 0;
      let s = 0;
      switch (+num) {
        case 1:
          s = i.behavioral_integral;
          break;
        case 2:
          s = i.performance_score;
          break;
        default:
          s = i.integral;
      }
      return s;
    },
    ontab() {
      this.appPath("/management_integral_level/" + this.active, true);
      this.onPage(1);
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      let api = this.tab[this.active].a;
      let o = { ...this.search, ...this.search1[this.active] };
      this.$api.http(this.apis + this.api[api], { page, ...o }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
    init() {
      let a = ["春", "秋"];
      let y = new Date().getFullYear();
      let arr = [];
      for (let i = 0; i < 20; i++) {
        arr.push({
          text: y - i + "年",
          id: y - i,
        });
      }
      this.t4 = arr;
      this.t3 = JSON.parse(JSON.stringify(arr)).map((s) => {
        s.children = a.map((k, v) => {
          return { text: k + "季学期", id: v + 1 };
        });
        return s;
      });
    },
    initonce() {
      if (this.t1.length) return 0;
      let a = ["总", "行为", "绩效"];
      this.$api.http("getGroup", {}, (r) => {
        this.t1 = r.map((s) => {
          return {
            text: s.name,
            id: s.id,
            children: [{ id: 9999, text: "全部" }].concat(
              a.map((k, v) => {
                return { id: v, text: k + "积分" };
              })
            ),
          };
        });
      });
    },
  },
  mounted() {
    this.active = this.$route.params.type || "0";
    this.init();
  },
};
</script>
<style lang='less' scoped>
.search_box {
  background-color: #fff;
  box-sizing: border-box;
  border-radius: 0 0 50px 50px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  .btn {
    padding: 25px 20%;
  }
}
</style>
