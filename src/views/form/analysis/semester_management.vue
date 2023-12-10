<template>
  <div class="form_analysis semester_management">
    <div class="box">
      <h5 class="van-hairline--bottom">基本信息</h5>
      <van-field
        v-model="title"
        :readonly="readonly"
        :label="groupname + '名称：'"
        :placeholder="'请输入' + groupname + '名'"
      >
        <template #button>
          <b class="val" v-if="readonly">{{ title || "" }}</b>
        </template>
      </van-field>
      <van-cell
        title="核算期间："
        is-link
        :value="time"
        @click="open = !open"
      ></van-cell>
    </div>
    <div class="box" v-for="(i, j) in item" :key="j">
      <h5 class="van-hairline--bottom">
        <b>{{ i.title }}</b>
        <span class="right">
          <b>总额:{{ i.all }}元/</b>
          <b>总占比:{{ i.mix }}%</b>
        </span>
      </h5>
      <template v-if="i.children && i.children.length">
        <template v-if="i.sum">
          <div class="price" v-for="(x, y) in i.children" :key="y + 'c' + j">
            <template v-if="is_del && i.add">
              <span class="del_btn" @click.stop="ondel(y, j)">
                <van-icon name="delete" />
              </span>
            </template>
            <template v-if="x.new">
              <van-field
                v-model="x.title"
                placeholder="请输入员工类型"
                :readonly="readonly"
                class="price_label"
                :class="{ readonly: readonly }"
              >
                <template #button>
                  <h6 class="val" v-if="readonly">{{ x.title || "" }}</h6>
                </template>
              </van-field>
            </template>
            <h6 v-else>{{ x.title }}</h6>
            <van-field
              v-model="x.num"
              label="人数"
              placeholder="请输入人数"
              :readonly="readonly"
              type="number"
            >
              <template #button>
                <b class="val" v-if="readonly">{{ x.num || 0 }}</b>
                个
              </template>
            </van-field>
            <van-field
              v-model="x.price"
              label="月薪总额"
              placeholder="请输入月薪总额"
              :readonly="readonly"
              type="number"
            >
              <template #button>
                <b class="val" v-if="readonly">{{ x.price || 0 }}</b>
                {{ x.unit }}
              </template>
            </van-field>
          </div>
        </template>
        <template v-else>
          <div class="input" v-for="(x, y) in i.children" :key="y + 'c' + j">
            <template v-if="is_del && i.add && !x.undel">
              <span class="del_btn" @click.stop="ondel(y, j)">
                <van-icon name="delete" />
              </span>
            </template>
            <template v-if="x.new">
              <van-field
                v-model="x.title"
                placeholder="类型名"
                :readonly="readonly"
                class="input_label"
                label=""
              >
                <template #button>
                  <b class="val" v-if="readonly">{{ x.title || "" }}</b>
                </template>
              </van-field>
            </template>
            <van-field
              v-model="x.value"
              :label="x.new ? '' : x.title"
              placeholder="请输入"
              :readonly="readonly"
              type="number"
            >
              <template #button>
                <b class="val" v-if="readonly">{{ x.value || 0 }}</b>
                {{ x.unit }}
              </template>
            </van-field>
          </div>
        </template>
      </template>
      <template v-if="i.add && !readonly">
        <div class="add">
          <van-button
            :color="$js.btnColor"
            block
            round
            size="small"
            @click="onadd(i, j)"
            >添加一项</van-button
          >
        </div>
      </template>
    </div>
    <div class="box">
      <h5>利润分析报告</h5>
      <van-cell
        v-for="(i, j) in sums"
        :key="j + 's'"
        :title="i.title"
        :value="i.value"
      ></van-cell>
      <van-cell :label="toSumTitle" title=""></van-cell>
    </div>
    <div class="save_btn" v-if="!readonly && !is_del">
      <van-button
        block
        round
        :color="$js.btnColor"
        @click="onsubmit"
        :disabled="disabled"
      >
        保存
      </van-button>
      <van-button block round type="primary" @click="onsave">
        生成图片
      </van-button>
    </div>
    <v-s
      :list="years"
      v-model="a1"
      @change="onchangetime"
      :open="open"
      text="text"
      noselect
    ></v-s>
  </div>
</template>

<script>
/**
 功能点：
  1.临时保存
  2.选择时间后计算变化
  3.生成图片
  4.输入框底色 浅灰
  5.用户扫码 进入
 */
import vS from "../../private/select.vue";
import vjs from "../form.js";
export default {
  props: {
    ext: {
      type: Object,
      default: () => {
        return {};
      },
    },
    group: Boolean,
    enum: Boolean,
  },
  inject: ["appShowImage"],
  components: { vS },
  computed: {
    time() {
      if (this.year > 0) {
        return [this.year, +this.semester === 1 ? "春季" : "秋季"].join("年");
      }
      return "点击选择时间";
    },
    toSumTitle() {
      let s = this.sums || [];
      let e = (s[s.length - 1] || {}).value;
      if (e === undefined) {
        return "";
      }
      e = e.replace("元", "");
      let t = "您的" + this.groupname;
      if (e > 0) {
        t += "处于盈利状态，继续保持！";
      } else if (e < 0) {
        t += "处于亏损状态，加油噢！";
      } else {
        t += "收入与支出持平，不亏不盈！";
      }
      return t;
    },
    groupname() {
      return this.group ? "集团" : "幼儿园";
    },
  },
  data() {
    return {
      years: [],
      a1: {},
      open: false,
      year: "",
      semester: "",
      item: [],
      readonly: false, // 保存为图片时 设置 为 true
      sums: [],
      pic: "",
      is_del: false, // 删除管理
      timer: null,
      title: "",
      localname: "formdata-analysis-semeester-manager",
      disabled: false,
    };
  },
  watch: {
    item: {
      handler(n) {
        this.pic = "";
        this.watchitem();
      },
      deep: true,
    },
    enum(n) {
      this.is_del = n;
    },
  },
  methods: {
    timerfn(fn) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        fn();
        clearTimeout(this.timer);
        this.timer = null;
      }, 500);
    },
    watchitem() {
      let ts = this;
      this.sums = vjs.analysis.semester_manag_sum(this.item, (arr) => {
        ts.timerfn(() => {
          // eslint-disable-next-line
          demo.$local.set(ts.localname, ts.togetsave(ts.item));
        });
        arr.forEach((k, v) => {
          ts.$set(ts.item[v], "all", k.all);
          ts.$set(ts.item[v], "mix", k.mix);
        });
      });
      this.disabled = false;
    },
    togetsave(item) {
      return {
        item,
        today: Date.now(),
        version: vjs.version,
        type: vjs.params("by"),
        title: this.title,
        time: this.time,
        year: this.year,
        semester: this.semester,
      };
    },
    onsubmit() {
      this.disabled = true;
      let a = this.togetsave(this.item);
      if (this.group) {
        this.$emit("change", a);
        return 0;
      }
      this.$api.http(
        "table0000",
        {
          data: JSON.stringify(a),
          nursery_name: this.title,
          year: this.year,
          semester: this.semester,
        },
        () => {
          this.clearlocal();
          this.$toast("保存成功");
          this.init();
        }
      );
    },
    totimes(fn) {
      return new Promise((resolve) => {
        if (fn) {
          fn((val) => {
            resolve(val);
          });
          return 0;
        }
        setTimeout(() => {
          resolve();
        }, 500);
      });
    },
    ondel(index, j) {
      this.item[j].children.splice(index, 1);
    },
    onadd(e, j) {
      let os = { value: "" };
      if (e.sum) {
        os = { num: "", price: "" };
      }
      os.unit = "元/学期";
      os.title = "";
      os.new = true;
      this.item[j].children.push(os);
      this.is_del = false;
    },
    async onsave() {
      if (this.pic) {
        return this.appShowImage(this.pic);
      }
      this.readonly = true;
      this.$toast.loading({
        message: "正在生成中",
      });
      let top =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;
      await this.totimes();
      // eslint-disable-next-line
      let img = await demo.es6().tocanvas(".semester_management", { y: top });
      this.pic = img.img;
      this.appShowImage(img.img);
      this.$nextTick(() => {
        this.readonly = false;
      });
    },
    onchangetime(e, v) {
      this.year = e[0].value;
      this.semester = e[1].value;
      this.clearlocal();
      this.item = vjs.analysis.semester_manage();
    },
    clearlocal() {
      this.disabled = false;
      // eslint-disable-next-line
      demo.$local.clear(this.localname);
    },
    async init() {
      // 初始化
      let v = this.$js.def.semester;

      // eslint-disable-next-line
      let olddata = demo.$local.get(this.localname, {});
      if (olddata.version === vjs.version && olddata.today < Date.now()) {
        this.year = olddata.year;
        this.semester = olddata.semester;
        this.title = olddata.title;
        this.item = olddata.item;
      } else {
        this.year = v.year;
        this.semester = v.semester;
        this.item = vjs.analysis.semester_manage();
        this.title = (this.ext.config || {}).name;
      }
    },
  },
  mounted() {
    if (this.group) {
      this.localname += "_group";
    }
    let year = new Date().getFullYear();
    let c = [];
    for (let i = 0; i < 10; i++) {
      let y = year + 3 - i;
      c.push({
        text: y + "年",
        value: y,
        children: [
          { text: "春季", value: 1 },
          { text: "秋季", value: 2 },
        ],
      });
    }
    this.years = c;
    this.init();
  },
};
</script>
