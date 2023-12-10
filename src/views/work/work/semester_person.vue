<template>
  <v-view header bgc="#f5f5f5" @on-user="onuser">
    <template #menu>
      <span @click="open1 = true">发布学期工作</span>
    </template>
    <div class="app_top">
      <van-cell
        is-link
        title="时间选择"
        @click="open = !open"
        :value="ytext"
      ></van-cell>
      <van-notice-bar
        color="#1989fa"
        background="#ecf9ff"
        left-icon="info-o"
        @click="ontoold"
      >
        学期工作功能已更新，访问旧版请点击这里
      </van-notice-bar>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section v-for="(i, j) in item" :key="j" @click.stop="ondetail(i)">
        <h6>{{ i.name }}</h6>
        <p>{{ [i.group_name, i.job_name].join("-") }}</p>
        <p class="time">{{ appTimeout(i.create_time, true) }}发布</p>
        <p
          v-if="user.s_id === i.staff_id"
          class="edit col_warning"
          @click.stop="onedit(i)"
        >
          编辑
        </p>
      </section>
    </v-page>
    <template #fixed>
      <v-s
        v-model="a1"
        :list="years"
        :open="open"
        noselect
        @change="ona1"
      ></v-s>
      <v-f v-model="open1" :footer="false" text="发布">
        <v-add :years="[years, year, semester, ytext]" @end="onPage(1)"></v-add>
      </v-f>
      <v-f v-model="open2" :footer="false" text="编辑">
        <v-add
          :years="[years, year, semester, ytext]"
          @end="onPage(1)"
          edit
          v-model="ext"
        ></v-add>
      </v-f>
      <v-f v-model="open3" :footer="false" :text="child.name + '的学期计划'">
        <v-child :child="child"></v-child>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vS from "../../private/select.vue";
import vF from "../../private/fixed.vue";
import vAdd from "./semester_person_add.vue";
import vChild from "./semester_person_child.vue";
export default {
  data() {
    return {
      item: [],
      semester: "1",
      year: new Date().getFullYear(),
      open: false, // 控制选择时间
      open1: false, // 控制发布
      open2: false, // 控制编辑
      open3: false,
      a1: [],
      years: [],
      ytext: new Date().getFullYear() + "年春季学期",
      user: {},
      ext: {},
      child: {},
    };
  },
  watch: {
    open2(n) {
      if (!n) {
        this.ext = {};
      }
    },
  },
  inject: ["appTimeout", "appPath"],
  components: { vS, vF, vAdd, vChild },
  methods: {
    ontoold() {
      this.appPath("/work_semester");
    },
    onuser(e) {
      this.user = e;
    },
    onedit(e) {
      this.ext = e;
      this.open2 = true;
    },
    ona1(e, v) {
      this.year = e[0].value;
      this.semester = e[1].value;
      this.ytext = v.e.join("");
      this.onPage(1);
    },
    onPage(page, f) {
      this.open1 = false;
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "semesterpersonlist",
        { page, semester: this.semester, year: this.year },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          this.item = this.item.concat(e);
          this.$refs.page.onFinish(e.length < 20);
        }
      );
    },
    ondetail(e) {
      this.$api.http("semesterpersondet", { id: e.id }, (r) => {
        this.child = r;
        this.open3 = true;
      });
    },
  },
  mounted() {
    this.years = this.$js.def.record.year2;
  },
};
</script>
<style lang='less' scoped>
section {
  margin: 10px;
  box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  background-color: #fff;
  position: relative;
  .edit {
    position: absolute;
    right: 0;
    top: 0;
    padding: 5px 10px;
    font-size: 14px;
  }
  h6 {
    font-weight: 650;
    padding: 8px 0;
  }
  p {
    font-size: 15px;
    line-height: 1.2;
  }
  .time {
    text-align: right;
    color: #999;
    font-size: 14px;
  }
}
</style>
