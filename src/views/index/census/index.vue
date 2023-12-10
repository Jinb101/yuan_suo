<template>
  <v-view header
          bar
          :text="api.text"
          :index="400">
    <template #menu>
      <span v-if="!noPage"
            @click="show = true">{{
              dates ? dates : "选择日期"
            }}</span>
      <v-c v-else-if="noPage && showClass"
           v-model="class_ext"></v-c>
    </template>
    <template #footer>
      <van-tabbar v-model="active">
        <van-tabbar-item v-for="(i, j) in apis"
                         :key="j"
                         :name="i.id">
          <span>{{ i.text }}</span>
        </van-tabbar-item>
      </van-tabbar>
    </template>
    <template #fixed>
      <van-calendar v-model="show"
                    @confirm="onConfirm"
                    :color="$js.color"
                    :min-date="min_date"
                    :max-date="max_date" />
    </template>
    <v-page ref="page"
            @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section v-for="(i, j) in item"
               :key="j"
               class="list van-hairline--bottom">
        <template v-if="+id === 1 || +id === 2 || +id === 6">
          <a class="flex l1"
             :href="i.phone ? 'tel:' + i.phone : 'javascript:;'">
            <v-a :src="i.avatar"
                 :sex="i.gender"></v-a>
            <div class="font">
              <p class="name">
                {{ i.name }}
                <van-tag v-if="+i.status === 4"
                         type="primary">请假</van-tag>
              </p>
              <p>{{ i.class_name }}</p>
              <p>家长：{{ i.nickname || "暂无绑定家长" }} {{ i.phone }}</p>
            </div>
            <van-icon name="phone-o"
                      :color="$js.color"
                      v-if="i.phone" />
          </a>
        </template>
        <template v-else-if="+id === 4 || +id === 5">
          <a :href="i.contact ? 'tel:' + i.contact : 'javascript:;'"
             class="flex l1">
            <v-a :src="i.avatar"></v-a>
            <div class="font">
              <p class="name">{{ i.name }}</p>
              <p>{{ [i.group_name, i.job_name].join("-") }}</p>
              <p>联系方式：{{ i.contact }}</p>
            </div>
            <van-icon name="phone-o"
                      :color="$js.color"
                      v-if="i.contact" />
          </a>
        </template>
        <template v-else>
          <span class="h2 van-ellipsis">{{ toClass(i.type) }}-{{ i.nickname }}</span>
          <p>班主任：{{ i.staff_name ? i.staff_name : "暂无" }}</p>
          <p>出勤人数：{{ i.attendance }}/{{ i.class_size }}</p>
          <p>出勤率：{{ i.attendance_rate }}%</p>
          <div class="circles">
            <van-image :src="toBgc()"
                       lazy-load
                       fit="cover"></van-image>
          </div>
        </template>
      </section>
    </v-page>
  </v-view>
</template>

<script>
import vC from "../../private/select_class.vue";
import vA from "../../private/avatar.vue";
// eslint-disable-next-line
const cls = demo.siteConfig.classification;
export default {
  data() {
    return {
      id: "",
      apis: [
        { text: "出勤幼儿", api: "censusChild", id: 1, type: 1 },
        { text: "缺勤幼儿", api: "censusChild", id: 2, type: 6 },
        { text: "幼儿出勤率", api: "censusChilds", id: 3 },
        // { text: "幼儿请假", api: "censusChild", id: 6, type: 3 },
        { text: "出勤教师", api: "censusTeach", id: 4, type: 1 },
        { text: "缺勤教师", api: "censusTeach", id: 5, type: 2 },
      ],
      active: "",
      showClass: false,
      show: false,
      item: [],
      max_date: new Date(),
      min_date: new Date(),
      dates: "",
      class_ext: {},
      gradientColor: {
        "0%": "#3fecff",
        "100%": "#6149f6",
      },
    };
  },
  components: { vC, vA },
  inject: ["appReplace"],
  computed: {
    api() {
      let a = this.id;
      return this.apis.filter((r) => r.id === +a)[0] || {};
    },
    noPage() {
      return [1, 2, 6].indexOf(+this.id) > -1;
    },
    cid() {
      return this.class_ext.id || "";
    },
  },
  watch: {
    active(n) {
      this.appReplace("/census/" + n);
      this.id = n;
      this.dates = "";
      this.onPage(1);
    },
    cid() {
      this.onPage(1);
    },
  },
  methods: {
    toBgc() {
      // eslint-disable-next-line
      return demo.siteConfig.icon(202, "index");
    },
    toClass(v) {
      return cls[v];
    },
    onConfirm(e) {
      if (e) {
        try {
          let s = e.getTime();
          // eslint-disable-next-line
          this.dates = demo.timeout(s, "ymd", "-");
          this.onPage(1);
        } catch (e) {
          this.$js.message("时间错误请重试", 2);
        }
      }
      this.show = false;
    },
    init() { },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      this.show = false;
      if (page === 1) {
        this.item = [];
      }
      this.$api.http(
        this.api.api,
        {
          page,
          limit: 20,
          status: this.api.type,
          class_id: this.showClass ? this.cid : "",
          date: this.dates,
          datetime: this.dates,
        },
        (res, code) => {
          if (+page === 1) {
            this.item = [];
          }
          // console.log(res, code);
          if (code === 250) {
            this.showClass = true;
            return false;
          }
          if (this.noPage) {
            this.item = res.list;
            this.$refs.page.onFinish(true);
          } else {
            this.item = this.item.concat(res);
            this.$refs.page.onFinish(res.length < 20);
          }
        },
        "post",
        false,
        [200, 250]
      );
    },
  },
  mounted() {
    this.id = this.$route.params.id || "1";
    this.init();
    if (this.active === "") {
      this.active = +this.id;
    }
    // eslint-disable-next-line
    let s = demo.timeout(Date.now() - 180 * 864e5, "zero");
    // eslint-disable-next-line
    let e = new Date(demo.timeout("", "array")[0], 0, 1);
    this.min_date = s < e.getTime() ? new Date(s) : e;
  },
};
</script>
<style lang='less' scoped>
.list {
  padding: 10px;
  font-size: 16px;
  box-sizing: border-box;

  .l1 {
    position: relative;

    .font {
      width: calc(100% - 50px);
      box-sizing: border-box;
      padding-left: 10px;
      font-size: 14px;
      color: #999;

      p {
        padding: 2px 0;
      }

      .name {
        font-weight: 650;
        color: #333;
      }
    }

    .van-icon {
      position: absolute;
      right: 5px;
      top: 0;
      bottom: 0;
      margin: auto;
      font-size: 30px;
      height: 30px;
      opacity: 0.5;
    }
  }

  .h2 {
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    font-weight: 650;
    text-indent: 10px;
    position: relative;
    display: block;
    letter-spacing: 1px;

    &::before {
      position: absolute;
      content: "";
      left: 0;
      top: 0;
      bottom: 0;
      width: 2px;
      height: 12px;
      background-color: #99cc33;
      margin: auto;
    }
  }

  >p {
    line-height: 1.5;
    font-size: 15px;
    color: #888;
  }

  .circles {
    position: absolute;
    right: 10px;
    top: 10px;
    height: 93px;
    width: 93px;
    opacity: 0.3;
  }
}
</style>
