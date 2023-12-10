<template>
  <v-view header bar index="499">
    <template #menu>
      <span @click="open = !open">{{ open ? "关闭" : "" }}筛选</span>
    </template>
    <div class="app_top">
      <van-tabs v-model="active" title-active-color="#38f">
        <van-tab
          :title="i.t"
          :name="j + ''"
          v-for="(i, j) in tab"
          :key="j"
        ></van-tab>
      </van-tabs>
      <transition name="van-slide-down">
        <div class="search_box" v-if="open">
          <template v-if="+active === 0">
            <van-cell
              title="选择月份"
              is-link
              @click="open1 = !open1"
              :value="search[0].year_month"
            ></van-cell>
          </template>
          <template v-else-if="+active === 1">
            <van-cell
              title="选择学期"
              is-link
              @click="open2 = !open2"
              :value="s2.join('')"
            ></van-cell>
          </template>
          <template v-else-if="+active === 2">
            <van-cell
              title="选择学年"
              is-link
              @click="open3 = !open3"
              :value="s3.text"
            ></van-cell>
          </template>
          <template v-else-if="+active === 3">
            <van-cell
              title="选择开始时间"
              is-link
              @click="open4 = !open4"
              :value="search[3].start_time"
            ></van-cell>
            <van-cell
              title="选择结束时间"
              is-link
              @click="open5 = !open5"
              :value="search[3].end_time"
            ></van-cell>
          </template>
          <div class="btn">
            <van-button
              size="small"
              block
              round
              :color="$js.btnColor"
              @click="onsubmit"
              >点击搜索</van-button
            >
          </div>
        </div>
      </transition>
    </div>
    <template v-if="+active === 0">
      <div class="modal">
        <p>
          加分：<b class="col_green">+{{ item1.reward }}分</b>
        </p>
        <p>
          扣分：<b class="col_danger">-{{ item1.deduction }}分</b>
        </p>
        <p>
          绩效分：<b class="col_warning">+{{ item1.achievements || 0 }}分</b>
        </p>
      </div>
    </template>
    <template v-else>
      <ul>
        <li>
          <span>日期</span>
          <span>加分</span>
          <span>扣分</span>
          <span>绩效分</span>
        </li>
        <li v-for="(i, j) in item2" :key="j + 's'">
          <span>{{ i.name }}</span>
          <span>{{ i.reward }}分</span>
          <span>{{ i.deduction }}分</span>
          <span>{{ i.achievements || 0 }}分</span>
        </li>
        <li>
          <span>合计</span>
          <span>{{ tomax(item2, "reward") }}分</span>
          <span>{{ tomax(item2, "deduction") }}分</span>
          <span>{{ tomax(item2, "achievements") }}分</span>
        </li>
      </ul>
    </template>
    <template #footer>
      <div class="flex foot">
        <p>
          我的总积分: <b class="col_danger">{{ max }}</b
          >分
        </p>
        <span @click="open6 = true">积分明细查询</span>
      </div>
    </template>
    <template #fixed>
      <v-t v-model="s1" :open="open1" type="year-month" max="m_1"></v-t>
      <v-s v-model="s2" :open="open2" :list="t3" noselect @change="ons2"></v-s>
      <v-s v-model="s3" :open="open3" :list="t4" noselect @change="ons3"></v-s>
      <v-t v-model="s4" :open="open4" type="year-month" max="d_1"></v-t>
      <v-t v-model="s5" :open="open5" type="year-month" max="m_1"></v-t>
      <v-t v-model="s7" :open="open7" type="year-month" max="m_1"></v-t>
      <v-f v-model="open6" :footer="false" text="积分明细查询" index="501">
        <template #menu>
          <span @click="open7 = !open7">{{
            s7.time > 0 ? search[4].year_month : "选择时间"
          }}</span>
        </template>
        <div class="app_top">
          <van-tabs
            v-model="search[4].type"
            title-active-color="#38f"
            @click="onPage(1)"
          >
            <van-tab title="奖分" name="1"></van-tab>
            <van-tab title="扣分" name="2"></van-tab>
          </van-tabs>
        </div>
        <v-page ref="page" @on-page="onPage">
          <van-empty v-if="!item.length"></van-empty>
          <section
            v-for="(i, y) in item"
            :key="y + 'w'"
            class="van-hairline--bottom"
          >
            <p class="name">项目名：{{ i.program }}</p>
            <p>规则：{{ i.malformed }}</p>
            <p>
              分值：<b
                :class="+search[4].type === 1 ? 'col_green' : 'col_danger'"
              >
                {{ +search[4].type === 1 ? "+" : "-" }}{{ i.minutes }}分
              </b>
            </p>
            <p>评分人：{{ i.rater_name }}</p>
            <p>评分时间：{{ appTimeout(i.create_time, false, "ymd") }}</p>
            <div v-if="i.picture" class="img">
              <van-image
                :src="i.picture"
                fit="cover"
                round
                @click="appShowImage(i.picture)"
              ></van-image>
            </div>
          </section>
        </v-page>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vT from "../../../private/time.vue";
import vF from "../../../private/fixed.vue";
import vS from "../../../private/select.vue";
export default {
  data() {
    return {
      max: 0,
      tab: [{ t: "月度" }, { t: "学期" }, { t: "年度" }, { t: "自定义" }],
      active: "",
      search: [
        { year_month: "" },
        { semester: "", year: "" },
        { year: new Date().getFullYear() - 1 },
        { start_time: "", end_time: "" },
        { year_month: "", type: "" },
      ],
      open: false,
      open1: false,
      open2: false,
      open3: false,
      open4: false,
      open5: false,
      open6: false,
      open7: false,
      t3: [],
      t4: [],
      s1: {},
      s2: [],
      s3: {},
      s4: {},
      s5: {},
      s7: {},
      item: [],
      item1: {},
      item2: [],
    };
  },
  inject: ["appTimeout", "appShowImage"],
  watch: {
    active() {
      this.init();
    },
    s1: {
      handler(n) {
        if (n.obj) {
          this.search[0].year_month = [n.obj.y, n.obj.m].join("-");
        } else {
          this.search[0].year_month = "";
        }
      },
      deep: true,
    },
    s4: {
      handler(n) {
        if (n.obj) {
          this.search[3].start_time = [n.obj.y, n.obj.m].join("-");
        } else {
          this.search[3].start_time = "";
        }
      },
      deep: true,
    },
    s5: {
      handler(n) {
        if (n.obj) {
          this.search[3].end_time = [n.obj.y, n.obj.m].join("-");
        } else {
          this.search[3].end_time = "";
        }
      },
      deep: true,
    },
    s7: {
      handler(n) {
        if (n.obj) {
          this.search[4].year_month = [n.obj.y, n.obj.m].join("-");
        } else {
          this.search[4].year_month = "";
        }
        this.onPage(1);
      },
      deep: true,
    },
  },
  components: { vT, vF, vS },
  methods: {
    ons2(e, v) {
      this.search[1].year = e[0].id;
      this.search[1].semester = e[1].id;
    },
    ons3(e, v) {
      this.search[2].year = v.id;
    },
    onsubmit() {
      this.init();
    },
    tomax(v, name) {
      if (!v.length) return 0;
      let a = v.map((s) => {
        return +s[name];
      });
      // eslint-disable-next-line
      return demo.array(a).sum(0);
    },
    init() {
      let o = this.search[this.active];
      if (+this.active === 0) {
        this.$api.http("integralmym", { ...o }, (r) => {
          this.item1 = r;
        });
      } else {
        this.$api.http("integralmya", { ...o }, (r) => {
          this.item2 = Object.keys(r).map((s, v) => {
            return {
              name: s,
              ...r[s],
              index: v,
            };
          });
        });
      }
    },
    initonce() {
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
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("integralmylist", { page, ...this.search[4] }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
  },
  mounted() {
    this.$api.http("integralmys", {}, (r) => {
      this.max = r.total_points || 0;
    });
    this.initonce();
  },
};
</script>
<style lang='less' scoped>
.foot {
  font-size: 14px;
  padding: 0 10px;
  height: 50px;
  line-height: 50px;
  color: #999;
  p {
    flex: 1;
  }
}
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
.modal {
  padding: 20px 10px;
  font-size: 15px;
  line-height: 1.5;
}
li {
  display: flex;
  margin-top: 5px;
  &:first-child {
    font-weight: 650;
  }
  span {
    width: 25%;
    font-size: 14px;
    text-align: center;
    padding: 8px 5px;
    &:nth-child(2) {
      background-color: rgb(210, 255, 230);
    }
    &:nth-child(3) {
      background-color: rgb(253, 198, 185);
    }
    &:nth-child(4) {
      background-color: rgb(189, 199, 255);
    }
  }
}
.img {
  width: 80px;
  height: 80px;
}
section {
  position: relative;
  padding: 15px;
  box-sizing: border-box;
  font-size: 14px;
  .name {
    font-weight: 650;
    color: #333;
  }
  p {
    line-height: 1.2;
    margin-bottom: 5px;
    color: #999;
  }
}
</style>
