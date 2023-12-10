<template>
  <div class="management_achievements_wait_det">
    <template v-if="staff.id">
      <section class="head">
        <p class="right">
          <span
            v-if="!(items.parent_time && items.parent_time > 0)"
            class="col_danger"
          >
            [待考核]
          </span>
          <span v-else-if="staff.status === 0">[已考核未录入工资]</span>
          <span v-else>[已考核]</span>
        </p>
        <p>
          被考核人：<b>{{ staff.name }}</b>
        </p>
        <p class="flex">
          <span
            >所属部门：<b>{{ staff.group_name }}</b></span
          >
          <span
            >岗位名称：<b>{{ staff.job_name }}</b></span
          >
        </p>
        <p>
          考核月份：<b>{{ items.year_month }}</b>
        </p>
        <span
          class="circle"
          v-if="!(items.parent_time && items.parent_time > 0)"
        ></span>
        <p class="desc">
          请在 {{ toMonth(items.year_month) }} 月1到5日完成考核
        </p>
      </section>
      <van-divider content-position="left">绩效考核表</van-divider>
      <van-empty v-if="!item.length" description="暂无考核内容"></van-empty>
      <van-collapse v-model="activeNames">
        <van-collapse-item :name="i.id" v-for="(i, j) in item" :key="j">
          <template #title>
            <div class="h6">
              指标{{ j + 1 }}
              <van-tag
                type="primary"
                round
                :color="i.pay > 0 ? '#99cc33' : '#999'"
              >
                {{ i.pay }}
              </van-tag>
            </div>
          </template>
          <section class="sec">
            <h5>绩效指标KPI</h5>
            <p>{{ i.kpi }}</p>
            <h5>绩效目标</h5>
            <p>{{ i.goals }}</p>
            <h5>评分标准</h5>
            <p>{{ i.scoring }}</p>
            <h5>
              权重值：<b :class="{ col_ash: i.weight > 0 }">{{
                i.weight || "暂无"
              }}</b>
            </h5>
            <h5>
              自我评分：<b :class="{ col_danger: i.self_score > 0 }">{{
                i.self_score || "暂未评分"
              }}</b>
            </h5>
            <h5>
              上级评分：<b :class="{ col_warning: i.pay > 0 }">{{
                i.pay || "暂未评分"
              }}</b>
            </h5>
            <van-field
              v-model="i.pay"
              type="number"
              label="绩效评分"
              maxlength="5"
              :error="i.pay > i.weight"
              :error-message="i.pay > i.weight ? '绩效评分不能大于权重值' : ''"
              :readonly="!isbtn"
              label-width="5em"
            >
              <template #button> 分 </template>
            </van-field>
          </section>
        </van-collapse-item>
      </van-collapse>
      <div class="footer flex">
        <p>
          考核月份：<b>{{ items.year_month }}</b>
        </p>
        <van-button block :color="$js.btnColor" v-if="isbtn" @click="onsubmit"
          >确认评分(共{{ allpay }}分)</van-button
        >
      </div>
    </template>
    <van-empty v-else description="暂无考核内容"></van-empty>
  </div>
</template>

<script>
export default {
  props: {
    value: null,
  },
  computed: {
    detail: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    staff() {
      return this.detail.staff || {};
    },
    items() {
      return this.detail.performance || {};
    },
    list() {
      return this.items.indicators || [];
    },
    isbtn() {
      return this.staff.id && this.staff.id > 0;
    },
    allpay() {
      let a = this.item.map((s) => {
        return s.pay || 0;
      });
      // eslint-disable-next-line
      return demo.array(a).sum(0);
    },
  },
  watch: {
    detail: {
      handler(v) {
        this.$emit("input", v);
      },
      deep: true,
    },
  },
  data() {
    return {
      item: [],
      activeNames: [],
    };
  },
  methods: {
    toMonth(e) {
      // eslint-disable-next-line
      let t = demo.timeout("", "array");
      let v = (e + "").split("-")[1];

      let s = +v + 1 > 12 ? [t[0] + 1, +v + 1 - 12].join("年") : +v + 1;
      return s;
    },
    init() {
      let a = this.list.map((s) => {
        s.pay = s.score <= 0 ? "" : s.score;
        return s;
      });
      this.item = JSON.parse(JSON.stringify(a));
      this.activeNames = this.item.map((s) => {
        return s.id;
      });
    },
    onsubmit() {
      let a = this.item.filter((r) => {
        return r.pay > r.weight;
      });
      if (a.length) return this.$toast("评分不可大于权重值");
      let b = this.item.filter((r) => {
        return r.pay === "";
      });
      if (b.length) return this.$toast("请完成所有绩效评分");
      let c = this.item.map((s) => {
        return { id: s.id, score: s.pay };
      });
      let os = {
        year_month: this.items.year_month,
        score_json: JSON.stringify(c),
      };
      this.$emit("change", os);
    },
  },
  mounted() {
    this.detail = this.value;
    this.$nextTick(() => {
      this.init();
    });
  },
};
</script>
<style lang="less">
.management_achievements_wait_det {
  .van-collapse-item__content {
    background-color: #f5f5f5;
  }
  .van-field__control {
    background-color: #fff;
  }
}
</style>
<style lang='less' scoped>
.management_achievements_wait_det {
  font-size: 15px;
}
.sec {
  padding: 15px 0;
  line-height: 1.2;
  h5 {
    font-weight: 650;
    color: #666;
    & + h5 {
      margin-top: 5px;
    }
  }
  p {
    padding: 5px 0;
    color: #999;
  }
  .van-cell {
    background: transparent;
  }
}
.head {
  padding: 15px;
  font-size: 15px;
  position: relative;
  background-color: #f5feff;
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
        right: 10px;
        top: 10px;
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
.footer {
  position: sticky;
  bottom: 0;
  z-index: 5;
  margin-top: 30px;
  background-color: #fff;
  box-shadow: 0 -1px 1px rgba(0, 0, 0, 0.1);
  .van-button {
    width: 150px;
  }
  > p {
    flex: 1;
    line-height: 44px;
    font-size: 15px;
    font-weight: 650;
    padding-left: 15px;
    b {
      font-weight: 400;
    }
  }
}
</style>
