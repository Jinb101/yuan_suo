<template>
  <div class="s_detail">
    <van-cell
      title="考核时间"
      is-link
      :value="os.year_month ? os.year_month : '请选择考核时间'"
      @click="open = !open"
    ></van-cell>
    <van-cell title="考核人" is-link value="请选择考核人"></van-cell>
    <v-p v-model="s2" :max="1"></v-p>
    <div class="app_top">
      <van-field
        v-model="os.assessment_name"
        label="考核表名称"
        placeholder="请输入考核表名称"
        label-width="6em"
      />
      <div class="flex">
        <van-button block type="info" @click="open2 = true" icon="orders-o"
          >导入KPL指标</van-button
        >
        <van-button block type="primary" icon="plus" @click="onaddgrade"
          >自定义KPL指标</van-button
        >
      </div>
    </div>
    <van-empty v-if="!grade.length" description="暂无配置KPL指标，您可以">
      <van-button size="small" color="#99cc33" @click="onaddgrade"
        >添加一个</van-button
      >
    </van-empty>
    <section v-for="(i, j) in grade" :key="j">
      <span class="delete" @click="ondel(j)"><van-icon name="cross" /></span>
      <van-field
        v-model="i.kpi"
        rows="1"
        autosize
        label="绩效指标KPL"
        type="textarea"
        label-width="7em"
        placeholder="请输入绩效指标KPL"
      />
      <van-field
        v-model="i.goals"
        rows="1"
        autosize
        label="绩效目标"
        type="textarea"
        label-width="7em"
        placeholder="请输入绩效目标"
      />
      <van-field
        v-model="i.weight"
        label="权重值"
        placeholder="请输入权重值"
        label-width="7em"
        type="number"
        max="100"
      >
        <template #button>
          <span>
            分,<b v-if="grade_num.more"
              >还可分配<i class="col_danger">{{ grade_num.num }}</i
              >分</b
            ><b v-else
              >已超出分配<i class="col_danger">{{ grade_num.num }}</i
              >分</b
            >
          </span>
        </template>
      </van-field>
      <van-field
        v-model="i.scoring"
        rows="1"
        autosize
        label="评分标准"
        type="textarea"
        label-width="7em"
        placeholder="请输入评分标准"
      />
      <van-field
        v-model="i.remarks"
        rows="1"
        autosize
        label="备注"
        type="textarea"
        label-width="7em"
        placeholder="请输入备注"
      />
    </section>
    <div class="foot" v-if="grade.length">
      <van-button block round :color="$js.btnColor" @click="onsubmit"
        >确认提交</van-button
      >
    </div>
    <v-t v-model="s1" :open="open" type="year-month" max="m_1"></v-t>
    <v-f v-model="open2" :footer="false" text="KPL指标库">
      <div class="app_top" v-if="tab.length > 0">
        <van-tabs
          v-model="department_id"
          title-active-color="#38f"
          @click="onPage(1)"
        >
          <van-tab
            :title="i.department_name"
            :name="i.department_id"
            v-for="(i, j) in tab"
            :key="j + 'n'"
          ></van-tab>
        </van-tabs>
      </div>
      <v-page ref="page" @on-page="onPage">
        <van-empty v-if="!item.length"></van-empty>
        <van-checkbox-group v-model="result">
          <section
            v-for="(i, j) in item"
            :key="j + 's'"
            class="sec"
            @click.stop="onchecktoggle(i.achievements_id, i)"
          >
            <div class="check" @click.stop>
              <van-checkbox :name="i.achievements_id"></van-checkbox>
            </div>
            <h6>KPI:{{ i.kpi }}</h6>
            <p>参考目标：{{ i.target }}</p>
            <p>参考评分：{{ i.scoring_standard }}</p>
          </section>
        </van-checkbox-group>
      </v-page>
      <div class="w90">
        <van-button
          block
          round
          :color="$js.btnColor"
          :disabled="!result.length"
          @click="onsaveresult"
          >确认选中{{ result.length }}个</van-button
        >
      </div>
    </v-f>
  </div>
</template>

<script>
import vT from "../../../private/time.vue";
import vF from "../../../private/fixed.vue";
import vP from "../../../private/people.vue";
export default {
  props: {
    ids: [Number, String],
    user: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      detail: {},
      grade: [],
      os: {
        year_month: "",
        parent_s_id: "",
        assessment_name: "",
        assessment_id: "",
      },
      parent_name: "",
      open: false, // 时间
      open2: false, // 指标库
      s1: {},
      s2: [],
      item: [],
      tab: [],
      department_id: "",
      result: [],
      resultlen: [],
    };
  },
  components: { vT, vF, vP },
  computed: {
    grade_num() {
      let a = this.grade
        .map((s) => {
          return +s.weight;
        })
        .concat(0);
      // eslint-disable-next-line
      let sum = demo.array(a).sum(0);
      if (sum > 100) {
        return {
          more: false,
          num: sum - 100,
        };
      }
      return {
        more: true,
        num: 100 - sum,
      };
    },
    ispay() {
      return this.detail.score_or_not === 2;
    },
  },
  watch: {
    s1: {
      handler(n) {
        if (n.obj) {
          this.os.year_month = [n.obj.y, n.obj.m].join("-");
        } else {
          this.os.year_month = "";
        }
      },
      deep: true,
    },
    s2: {
      handler(n) {
        if (n[0] && n[0].name) {
          this.os.parent_s_id = n[0].id;
          this.parent_name = n[0].name;
        }
      },
      deep: true,
    },
  },
  methods: {
    onsaveresult() {
      let a = this.result;
      let b = this.resultlen.filter((r) => {
        return a.indexOf(r.achievements_id) >= 0;
      });
      // if (b.length > 0) {
      //   // eslint-disable-next-line
      //   b = demo.array(b).unique("achievements_id");
      // }
      let o = this.once;
      this.grade = this.grade.concat(
        b.map((r) => {
          return o(r);
        })
      );
      this.result = [];
      this.resultlen = [];
      this.open2 = false;
    },
    onchecktoggle(i, d) {
      if (this.result.indexOf(i) >= 0) {
        this.result = this.result.filter((r) => {
          return r !== i;
        });
      } else {
        this.result.push(i);
        this.resultlen.push(d);
      }
    },
    ondel(j) {
      this.grade.splice(j, 1);
    },
    once(r = {}) {
      return {
        goals: r.target || "",
        kpi: r.kpi || "",
        remarks: "",
        scoring: r.scoring_standard || "",
        weight: "",
        aid: r.achievements_id || "",
        id: "",
      };
    },
    onaddgrade() {
      this.grade.push(this.once());
    },
    onsubmit() {
      if (this.ispay) {
        return this.$toast("已录入工资无法再次评分");
      }
      let os = {
        ...this.os,
        id: this.ids,
        data: this.grade,
      };
      this.$api.http("achievementsedit", os, () => {
        this.$toast("设置成功");
        this.$emit("end");
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
        "achievementsdata",
        { page, department_id: this.department_id, limit: 100 },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          if (!this.tab.length) {
            this.tab = e.performance_department || [];
          }
          this.item = this.item.concat(e.list);
          this.$refs.page.onFinish(e.list.length < 20);
        }
      );
    },
    init() {
      // eslint-disable-next-line
      let today = demo.timeout("", "array");
      if (this.user.account) {
        this.s2 = [
          {
            id: this.user.s_id,
            name: this.user.nickname,
            avatar: this.user.avatar,
          },
        ];
      }
      this.os.year_month = [today[0], today[1]].join("-");
      this.os.assessment_name = this.detail.assessment_name;
      this.os.assessment_id = this.detail.assessment_id;
    },
  },
  mounted() {
    this.$api.http("achievementsdet", { id: this.ids }, (r) => {
      this.detail = r;
      this.grade = r.indicators.length > 0 ? r.indicators : [];
      this.init();
    });
  },
};
</script>
<style lang='less' scoped>
section {
  padding: 5px 0;
  background-color: rgba(195, 221, 247, 0.2);
  position: relative;
  box-sizing: border-box;
  .delete {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 5;
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: tomato;
  }
  &:nth-child(2n) {
    background-color: rgba(197, 248, 244, 0.2);
  }
  .van-cell {
    background-color: transparent;
  }
}
.sec {
  font-size: 15px;
  line-height: 1.2;
  padding: 10px;
  color: #999;
  .check {
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 20px;
    height: 20px;
  }
  h6 {
    font-weight: 650;
    color: #333;
  }
  p {
    padding-right: 20px;
    font-size: 14px;
    margin-top: 5px;
  }
}
.foot {
  position: sticky;
  bottom: 0;
  padding: 20px 15%;
}
</style>
