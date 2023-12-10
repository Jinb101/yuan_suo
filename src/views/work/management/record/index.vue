<template>
  <v-view header bgc="#f5f5f5" :text="titletext">
    <template #menu>
      <span @click="open = !open">{{ open ? "关闭" : "时间" }}筛选</span>
    </template>
    <transition name="van-slide-down">
      <div class="app_top bgc" v-if="open" style="overflow: hidden">
        <van-cell
          title="选择学期"
          :value="s1text || '点击选择学期'"
          is-link
          @click="open1 = !open1"
        ></van-cell>
        <van-divider content-position="left">自定义时间选择</van-divider>
        <div class="time flex">
          <span @click="open2 = !open2">{{
            search.start_time ? search.start_time : "选择开始时间"
          }}</span>
          <b>~~</b>
          <span @click="open3 = !open3">{{
            search.end_time ? search.end_time : "选择结束时间"
          }}</span>
        </div>
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
    <v-b
      v-for="(i, j) in tab"
      :key="j"
      :title="i.t"
      :unit="i.c"
      :finance="i.f"
      @tap="ontap($event, i)"
    >
      <template v-if="i.e" #right>
        {{ i.e }}
      </template>
      <div class="chart">
        <iframe :src="i.url" frameborder="0" class="db_image"></iframe>
      </div>
    </v-b>
    <template #fixed>
      <v-s v-model="s1" :open="open1" :list="t1" noselect @change="ons1"></v-s>
      <v-t v-model="s2" :open="open2" max="y_1" type="year-month"></v-t>
      <v-t v-model="s3" :open="open3" max="y_1" type="year-month"></v-t>
      <v-s v-model="s4" :open="open4" :list="t2" noselect @change="ons4"></v-s>
      <v-f v-model="open5" :footer="false" :text="'编辑' + det5.$name">
        <v-d :tp="det5.tp" @end="ondet5end"></v-d>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vB from "./_box.vue";
import vF from "../../../private/fixed.vue";
import vT from "../../../private/time.vue";
import vS from "../../../private/select.vue";
import vD from "./_det.vue";
export default {
  data() {
    return {
      tab: [],
      api: [],
      date: {},
      open: false,
      search: {
        end_time: "",
        semester: "",
        start_time: "",
        year: "",
      },
      t1: [],
      t2: [],
      open1: false, // 控制学期选择
      open2: false, // 控制开始时间
      open3: false, // 控制结束时间
      open4: false, // 控制选择班级
      open5: false, // 控制详情
      s1: [],
      s2: {},
      s3: {},
      s4: {},
      timer: null,
      det5: {},
    };
  },
  computed: {
    apilen() {
      let a = this.api;
      return this.tab.map((s) => {
        return {
          type: s.type,
          ext: {
            type: s.tp || "",
          },
          api: a[s.a],
        };
      });
    },
    titletext() {
      if (this.s1text) return this.s1text;
      if (this.search.start_time && this.search.end_time) {
        return [this.search.start_time, "至", this.search.end_time].join("");
      }
      let os = {
        m: +this.date.m,
        y: this.date.y,
        s: "秋",
      };
      if (os.m > 0 && os.m < 2) {
        os.y -= 1;
      }
      if (os.m >= 2 && os.m < 8) {
        os.s = "春";
      }
      return [os.y, "年", os.s, "季学期"].join("");
    },
    s1text() {
      return this.s1.join("");
    },
  },
  watch: {
    s2: {
      handler(n) {
        if (n.obj) {
          this.search.start_time = [n.obj.y, n.obj.m].join("-");
          this.search.semester = "";
          this.search.year = "";
          this.s1 = [];
        } else {
          this.search.start_time = "";
        }
      },
      deep: true,
    },
    s3: {
      handler(n) {
        if (n.obj) {
          this.search.end_time = [n.obj.y, n.obj.m].join("-");
          this.search.semester = "";
          this.search.year = "";
          this.s1 = [];
        } else {
          this.search.end_time = "";
        }
      },
      deep: true,
    },
  },
  components: { vB, vF, vT, vS, vD },
  methods: {
    tocharturl(d, type) {
      let c =
        this.tab.filter((r) => {
          return r.type === type;
        })[0] || {};
      let data = { type, item: d, old: c.c.length > 1 };
      // eslint-disable-next-line
      let url = demo.siteConfig.api.chart + "?type=a_record&h5=";
      // eslint-disable-next-line
      return url + demo.es6().encrypt(data, "chart");
    },
    ontap(e, j) {
      switch (j.type) {
        case "3": // 出勤率
          if (!this.t2.length) {
            this.$api.http("getClass", {}, (r) => {
              this.t2 = r.map((s) => {
                s.text = s.name = s.nickname;
                return s;
              });
              this.open4 = !this.open4;
            });
          } else {
            this.open4 = !this.open4;
          }
          break;
        default:
          this.det5 = { ...j, $name: e };
          this.$nextTick(() => {
            this.open5 = true;
          });
      }
    },
    async ondet5end() {
      let v = this.det5.type;
      let index = this.apilen.map((r) => {
        return r.type === v;
      });
      index = index.indexOf(true);
      if (index && this.apilen[index]) {
        let val = this.apilen[index];
        let d = await this.http(val.api, val.ext);
        this.$set(this.tab[index], "data", d);
        this.$set(this.tab[index], "url", this.tocharturl(d, val.type));
      }
      this.open5 = false;
      this.det5 = {};
    },
    ons1(e, j) {
      this.search = {
        end_time: "",
        semester: e[1].value,
        start_time: "",
        year: e[0].value,
      };
    },
    async ons4(e, j) {
      let d = await this.http("recordatten", { class_id: j.id });
      this.$set(this.tab[2], "e", j.text);
      this.$set(this.tab[2], "data", d);
      this.$set(this.tab[2], "url", this.tocharturl(d, "3"));
    },
    onsearch() {
      this.open = false;
      this.init();
    },
    http(name, data) {
      let ts = this.$api.http;
      let s = this.search;
      if (s.year === "") {
        let os = {
          m: +this.date.m,
          y: this.date.y,
          s: 2,
        };
        if (os.m > 0 && os.m < 2) {
          os.y -= 1;
        }
        if (os.m >= 2 && os.m < 8) {
          os.s = 1;
        }
        s.year = os.y;
        s.semester = os.s;
      }
      return new Promise((resolve, reject) => {
        ts(name, { ...data, ...s }, (r) => {
          resolve(r);
        });
      });
    },
    async init() {
      let ts = this;
      ts.$toast.loading({ duration: 0 });
      for (let i in ts.apilen) {
        let val = ts.apilen[i];
        ts.totime(i);
        let d = await ts.http(val.api, val.ext);
        ts.$set(ts.tab[i], "data", d);
        ts.$set(ts.tab[i], "url", ts.tocharturl(d, val.type));
      }
      ts.$toast.clear();
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
    totime(num) {
      let ts = this;
      if (ts.timer) {
        clearTimeout(ts.timer);
        ts.timer = null;
      }
      ts.timer = setTimeout(() => {
        console.log(ts.tab[num].t + "获取超时");
        ts.$toast("获取超时，正在为您重试！请稍后！");
        this.init();
        clearTimeout(ts.timer);
        ts.timer = null;
      }, 9000);
    },
  },
  mounted() {
    let r = this.$js.def.record;
    this.tab = r.tab;
    this.api = r.api;
    this.t1 = r.year;
    // eslint-disable-next-line
    this.date = demo.timeout("", "object");
    this.init();
  },
};
</script>
<style lang='less' scoped>
.time {
  line-height: 35px;
  font-size: 13px;
  text-align: center;
  span {
    flex: 1;
  }
  b {
    padding: 0 8px;
  }
}
.btn {
  margin: 20px 25%;
}
.chart {
  height: 210px;
  position: relative;
  &::before {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    content: "";
  }
}
</style>
