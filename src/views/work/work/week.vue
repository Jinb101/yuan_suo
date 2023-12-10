<template>
  <v-view header
          :text="title"
          @on-user="onuser">
    <template #menu>
      <span @click="open = true">{{ selecttitle }}</span>
    </template>
    <v-page ref="page"
            @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <v-d v-model="item"
           :uid="user.s_id"
           @edit="onplanedit"
           @show="onframeshow"></v-d>
    </v-page>
    <div class="bottom">
      <van-button block
                  round
                  :color="$js.btnColor"
                  @click="addWeek">{{ foundElement ? ' 编辑周计划' : '添加周计划' }}</van-button>
    </div>
    <template #fixed>
      <v-f v-model="open"
           :footer="false"
           text="选择第几周">
        <van-cell :title="yeartitle"
                  label="若你想添加/查看其他年份的工作数据可以点击这里"
                  is-link
                  @click="open4 = !open4"></van-cell>
        <van-tabs v-model="semester"
                  color="#99cc33"
                  title-active-color="#99cc33">
          <van-tab title="春季"
                   name="2"></van-tab>
          <van-tab title="秋季"
                   name="1"></van-tab>
        </van-tabs>
        <p class="desc">
          <template v-if="week > 0">
            当前已选择{{ +semester === 1 ? "秋" : "春" }}季第{{ week }}周
          </template>
          <template v-else>
            <b class="col_danger">请选择第几周</b>
          </template>
        </p>
        <ul class="flex fw select_month">
          <li v-for="i in 25"
              :key="i"
              :class="{ active: i === +week }"
              @click="week = i">
            <p>{{ i }}周</p>
            <span class="year">{{ year }}</span>
          </li>
        </ul>
        <div class="h60"></div>
        <div class="w80">
          <van-button block
                      round
                      color="#99cc33"
                      @click="open = false">点击查看</van-button>
        </div>
      </v-f>
      <v-f v-model="open2"
           :footer="false"
           text="添加周计划"
           :index="500">
        <v-c v-model="plan"
             week
             @on-submit="onaddplan"
             :monthlist="[year, semester, week]"></v-c>
      </v-f>
      <v-f v-model="open3"
           :footer="false"
           text="编辑周计划"
           :index="501">
        <v-c v-model="plan"
             week
             @on-submit="oneditplan"
             edit
             :monthlist="[year, semester, week]"></v-c>
      </v-f>
      <v-s :open="open4"
           text="label"
           :list="years"
           v-model="year_ext"></v-s>
      <v-f v-model="open5"
           :footer="false"
           :index="505"
           text="查看附件">
        <iframe :src="framesrc"
                frameborder="0"
                class="db_image"></iframe>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
import vC from "./files.vue";
import vD from "./det2.vue";
import vS from "../../private/select.vue";
export default {
  data() {
    return {
      year: 0,
      week: 0,
      semester: "",
      years: [],
      open: false,
      open2: false,
      open3: false,
      open4: false,
      item: [],
      plan: {},
      user: {},
      year_ext: {},
      framesrc: "",
      open5: false,
      foundElement: false,
    };
  },
  components: { vF, vC, vD, vS },
  computed: {
    title() {
      let q = +this.semester === 1 ? "秋季" : "春季";
      return [this.year, "年", q, "第", this.week, "周"].join("");
    },
    selecttitle() {
      let q = +this.semester === 1 ? "秋季" : "春季";
      if (this.week > 0) {
        return q + "第" + this.week + "周";
      }
      return "选择第几周";
    },
    yeartitle() {
      if (this.year > 0) {
        return "已选择[ " + this.year + " ]年";
      }
      return "选择年";
    },
  },
  watch: {
    'item.length'() {
      this.wheMyreder()
    },
    week() {
      this.onPage(1);
    },
    semester() {
      this.onPage(1);
    },
    open2(n) {
      if (n) {
        this.plan = {
          week: this.week,
          year: this.year,
          semester: this.semester,
        };
      }
    },
    year_ext: {
      handler(n) {
        this.year = n.value;
        this.onPage(1);
      },
      deep: true,
    },
    open5(n) {
      if (!n) {
        this.framesrc = "";
      }
    },
  },
  methods: {
    // 是否有我的计划
    wheMyreder() {
      // eslint-disable-next-line no-undef
      let user = demo.$session.get('user', {})
      console.log(this.item);
      this.foundElement = this.item.some(element => element.staff_id === user.s_id);
      console.log(this.foundElement, 'this.foundElement');
    },
    // 添加 编辑周计划
    addWeek() {
      console.log(this.foundElement, this.item);
      if (this.foundElement) {
        // eslint-disable-next-line no-undef
        let user = demo.$session.get('user', {})
        // 在 this.item 在到j_id相同的 拿到那一位
        let curItem = this.item.find(i => i.j_id === user.j_id)
        this.plan = {
          src: curItem.urls,
          srcs: curItem.url,
          ...curItem,
        }
        console.log(this.plan);
        this.open3 = true
      } else {
        this.open2 = true
      }
    },
    onframeshow(e) {
      this.framesrc = e;
      this.open5 = true;
    },
    onplanedit(e) {
      console.log(e);
      // 编辑
      this.plan = {
        ...e,
        src: e.srcs,
        srcs: e.src
      };
      console.log(this.plan);
      this.open3 = true;
    },
    onuser(e) {
      this.user = e;
    },
    oneditplan(e) {
      let os = {
        weekly_plan_id: this.plan.id,
        url: this.plan.img.join(","),
        target: JSON.stringify(this.plan.list),
        ...e.$os,
      };
      console.log(this.plan, os);
      this.$api.http("monthplanedit", os, () => {
        this.$toast("编辑成功");
        this.onPage(1);
        this.plan = {};
        this.open3 = false;
      });
    },
    onaddplan(e) {
      console.log(e);
      let m = e.$os || {};
      console.log(m, this.plan, this.foundElement);
      let os = {
        type: 1,
        url: this.plan.img.join(","),
        target: JSON.stringify(this.plan.list),
        ...m,
      };
      this.$api.http("monthplanadd", os, () => {
        this.$toast("添加成功");
        this.onPage(1);
        this.open2 = false;
      });
    },
    onPage(page, f) {
      try {
        if (!f) {
          return this.$refs.page.onRefresh();
        }
        if (+page === 1) {
          this.item = [];
        }
        this.$api.http(
          "monthplan",
          {
            page,
            type: 1,
            what_week: this.week,
            year: this.year,
            semester: this.semester,
          },
          (e) => {
            if (+page === 1) {
              this.item = [];
            }
            this.item = this.item.concat(e);
            console.log(this.item);
            // eslint-disable-next-line no-undef
            this.$refs.page.onFinish(e.length < 20);
          }
        );
      } catch (error) {
        this.onPage(1);
      }
    },
  },
  mounted() {
    // eslint-disable-next-line
    let time = demo.timeout("", "array");
    let month = +time[1];
    this.year = month > 0 && month < 2 ? time[0] - 1 : time[0];
    this.semester = month >= 3 && month <= 8 ? "2" : "1";
    this.week = 1;
    let year = [];
    for (let i = 0; i < 20; i++) {
      year.push(time[0] + 3 - i);
    }
    this.years = year.map((s) => {
      return { label: s + "年", value: s };
    });
  },
};
</script>
<style lang='less' scoped>
.select_month {
  padding: 10px;
  justify-content: space-between;

  li {
    width: 23%;
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 20px 8px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    margin-bottom: 15px;
    flex-direction: column;
    font-size: 20px;
    color: #99cc33;
    transition: all 0.3s;

    span {
      font-size: 12px;
      position: absolute;
      right: 5px;
      top: 5px;
      opacity: 0.5;
    }

    p {
      padding: 10px 0;
    }

    &.active {
      box-shadow: 0 0 10px #99cc33;
    }
  }
}

.desc {
  padding: 20px 0;
  text-align: center;
  font-size: 14px;
  letter-spacing: 1px;
  color: #999;
}

.bottom {
  position: sticky;
  bottom: 0;
  z-index: 50;
  background-color: #fff;
  padding: 10px 15%;
}

.h60 {
  height: 60px;
}
</style>
