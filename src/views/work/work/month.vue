<template>
  <v-view header :text="title" @on-user="onuser">
    <template #menu>
      <span @click="open = true">{{ selecttitle }}</span>
    </template>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <v-d
        v-model="item"
        :uid="user.s_id"
        @edit="onplanedit"
        @show="onframeshow"
      ></v-d>
    </v-page>
    <div class="bottom">
      <van-button block round :color="$js.btnColor" @click="open2 = true"
        >添加月计划</van-button
      >
    </div>
    <template #fixed>
      <v-f v-model="open" :footer="false" text="选择月份">
        <van-cell
          :title="yeartitle"
          label="若你想添加/查看其他年份的工作数据可以点击这里"
          is-link
          @click="open4 = !open4"
        ></van-cell>
        <p class="desc">
          <template v-if="month > 0"> 当前已选择{{ month }}月 </template>
          <template v-else>
            <b class="col_danger">请选择月份</b>
          </template>
        </p>
        <ul class="flex fw select_month">
          <li
            v-for="i in 12"
            :key="i"
            :class="{ active: i === +month }"
            @click="month = i"
          >
            <p>{{ i }}月</p>
            <span class="year">{{ year }}</span>
          </li>
        </ul>
        <div class="h60"></div>
        <div class="w80">
          <van-button block round color="#99cc33" @click="open = false"
            >点击查看</van-button
          >
        </div>
      </v-f>
      <v-f v-model="open2" :footer="false" text="添加月计划" :index="500">
        <v-c
          v-model="plan"
          month
          @on-submit="onaddplan"
          :monthlist="[year, month]"
        ></v-c>
      </v-f>
      <v-f v-model="open3" :footer="false" text="编辑月计划" :index="501">
        <v-c
          v-model="plan"
          month
          @on-submit="oneditplan"
          edit
          :monthlist="[year, month]"
        ></v-c>
      </v-f>
      <v-s :open="open4" text="label" :list="years" v-model="year_ext"></v-s>
      <v-f v-model="open5" :footer="false" :index="505" text="查看附件">
        <iframe :src="framesrc" frameborder="0" class="db_image"></iframe>
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
      month: 0,
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
    };
  },
  components: { vF, vC, vD, vS },
  computed: {
    title() {
      return [this.year, "年", this.month, "月"].join("");
    },
    selecttitle() {
      if (this.month > 0) {
        return "选择：" + this.month + "月";
      }
      return "选择月份";
    },
    yeartitle() {
      if (this.year > 0) {
        return "已选择[ " + this.year + " ]年";
      }
      return "选择年";
    },
  },
  watch: {
    month() {
      this.onPage(1);
    },
    open2(n) {
      if (n) {
        this.plan = {};
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
    onframeshow(e) {
      this.framesrc = e;
      this.open5 = true;
    },
    onplanedit(e) {
      // 编辑
      this.plan = e;
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
      this.$api.http("monthplanedit", os, () => {
        this.$toast("编辑成功");
        this.onPage(1);
        this.plan = {};
        this.open3 = false;
      });
    },
    onaddplan(e) {
      let m = e.$os || {};
      let os = {
        type: 2,
        semester: m.what_week >= 3 && m.what_week <= 8 ? 2 : 1,
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
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "monthplan",
        { page, type: 2, what_week: this.month, year: this.year },
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
    // eslint-disable-next-line
    let time = demo.timeout("", "array");
    this.year = time[0];
    this.month = time[1];
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
    width: 30%;
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
    font-size: 26px;
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
      padding: 15px 0;
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
