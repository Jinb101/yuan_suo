<template>
  <div class="select_search">
    <transition name="van-slide-down">
      <div v-show="show">
        <van-field label="时间筛选" readonly colon>
          <template #button>
            <div class="flex">
              <span @click="open1 = !open1" :class="{ active: t1 !== '' }">{{
                t1 ? t1 : "开始时间"
              }}</span>
              <b>~</b>
              <span @click="open2 = !open2" :class="{ active: t2 !== '' }">{{
                t2 ? t2 : "结束时间"
              }}</span>
            </div>
          </template>
        </van-field>
        <van-field
          label="选择分类"
          placeholder="请选择分类"
          readonly
          right-icon="arrow"
          colon
          label-width="5em"
          input-align="right"
          @click="open3 = !open3"
          v-model="i1"
        />
        <template v-if="auxiliary">
          <van-field
            label="辅助类别"
            placeholder="请选择辅助类别"
            readonly
            right-icon="arrow"
            colon
            label-width="5em"
            input-align="right"
            @click="open5 = !open5"
            v-model="a4.text"
          />
          <van-field
            :label="a4.text"
            :placeholder="'请选择' + a4.text"
            readonly
            right-icon="arrow"
            colon
            label-width="5em"
            input-align="right"
            required
            @click="onShowauxiliary"
            v-if="a4.text"
            v-model="a5.name"
          />
        </template>
        <van-field
          label="选择账户"
          placeholder="请选择账户"
          readonly
          right-icon="arrow"
          colon
          label-width="5em"
          input-align="right"
          @click="open4 = !open4"
          v-model="i2"
        />
        <van-field label="选择金额" readonly colon>
          <template #button>
            <div class="flex">
              <input type="number" v-model="min" placeholder="最小金额" />
              <b>至</b>
              <input type="number" v-model="max" placeholder="最大金额" />
              <b>元</b>
            </div>
          </template>
        </van-field>
        <div class="btn">
          <van-button block round :color="$js.btnColor" @click="onSub"
            >查询</van-button
          >
        </div>
        <div class="close" @click="show = false"><van-icon name="cross" /></div>
      </div>
    </transition>
    <v-t v-model="t1" :open="open1" ymd max="d_10"></v-t>
    <v-t v-model="t2" :open="open2" ymd max="y_2"></v-t>
    <v-s v-model="a1" :open="open3" :list="def.d" noselect @change="toA1"></v-s>
    <v-s v-model="a2" :open="open4" :list="def.c" text="text"></v-s>
    <v-s v-model="a4" :open="open5" :list="b1" text="text"></v-s>
    <v-s v-model="a5" :open="open6" :list="b2" text="text"></v-s>
  </div>
</template>

<script>
import vT from "../../private/time.vue";
import vS from "../../private/select.vue";
export default {
  props: {
    value: null,
    auxiliary: Boolean,
    open: Boolean,
  },
  data() {
    return {
      show: false,
      t1: "",
      t2: "",
      open1: false,
      open2: false,
      open3: false,
      open4: false,
      open5: false,
      open6: false,
      min: "",
      max: "",
      def: {},
      a1: [],
      a2: {},
      a3: [],
      a4: {},
      a5: {},
      b1: ["客户", "供应商", "职员", "部门"].map((s, v) => {
        return { text: s, value: v + 1 };
      }),
      b2: [],
    };
  },
  components: { vS, vT },
  computed: {
    os: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    i1() {
      if (this.a1.length) {
        return this.a1.join("->");
      }
      return "";
    },
    i2() {
      if (this.a2.account_id) {
        return this.a2.opening_bank;
      }
      return "";
    },
  },
  watch: {
    os: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
    open() {
      this.show = true;
    },
    a4: {
      handler(n) {
        this.b2 = [];
        if (n.value) {
          this.getauxiliary(n.value);
        }
      },
      deep: true,
    },
  },
  methods: {
    getauxiliary(id) {
      this.$api.http(
        "financeauxiliary",
        { auxiliary_category_id: id, start_time: this.t1, end_time: this.t2 },
        (r) => {
          let arr = [];
          switch (id) {
            case 1:
            case 2:
              arr = r.map((s) => {
                return {
                  text: s.label + "(" + s.code + ")",
                  id: s.value,
                  name: s.label,
                };
              });
              break;
            case 4:
              arr = r.map((s) => {
                return {
                  text: s.label,
                  id: s.value,
                  name: s.label,
                };
              });
              break;
            default:
              arr = r.map((s) => {
                return {
                  text: s.name + "(" + s.code + ")",
                  name: s.name,
                  sid: s.id,
                  id: s.staff_id,
                };
              });
          }
          if (arr.length > 0) {
            this.a5 = arr[0];
          }
          this.b2 = JSON.parse(JSON.stringify(arr));
        }
      );
    },
    onShowauxiliary() {
      if (!this.b2.length) return this.$toast("暂无可选择项");
      this.open6 = !this.open6;
    },
    toA1(ids) {
      let a = [ids[0].value, ids[1].classify_id, ids[2].classify_id];
      a = a.map((s) => {
        return +s === 0 ? "" : s;
      });
      this.a3 = a;
    },
    onSub() {
      let os = {
        financial_type: this.a3[0] || "",
        classify_id: this.a3[1] || "",
        level_classify_id: this.a3[2] || "",
        account_id: this.a2.account_id || "",
        start_time: this.t1,
        end_time: this.t2,
        minimum_amount: this.min,
        maximum_amount: this.max,
      };
      if (this.auxiliary) {
        os.auxiliary_category_id = this.a4.value || "";
        os.customer_id = this.a5.id || "";
        os.financial_staff_id = this.a5.sid || "0";
      }
      this.os = os;
      this.$emit("change", os);
      this.$nextTick(() => {
        this.show = false;
      });
    },
    async http(name, data) {
      let ts = this.$api.http;
      return new Promise((resolve, reject) => {
        ts(name, { ...data }, (r) => {
          resolve(r);
        });
      });
    },
    async init() {
      this.onceify();
      let def = {};
      // 获取支出
      await this.http("financeifyget", { classify_type: 2 }).then((e) => {
        // eslint-disable-next-line
        def.a = demo.tree(
          e.map((s) => {
            s.text = s.classify_name;
            return s;
          }),
          "classify_id",
          "pid"
        );
      });
      // 获取收入
      await this.http("financeifyget", { classify_type: 1 }).then((e) => {
        // eslint-disable-next-line
        def.b = demo.tree(
          e.map((s) => {
            s.text = s.classify_name;
            return s;
          }),
          "classify_id",
          "pid"
        );
      });
      // 获取账户
      await this.http("financeaccount", {}).then((e) => {
        def.c = e.map((s) => {
          s.text = [
            "(",
            +s.account_type === 2 ? "私" : "公",
            "户",
            ")~",
            s.account_title,
          ].join("");
          return s;
        });
      });
      // 辅助账户
      if (this.auxiliary) {
      }
      // 分类组合
      def.d = [
        {
          text: "全部",
          value: "0",
          children: [
            {
              text: "全部",
              children: [{ text: "全部", noid: true }],
              noid: true,
            },
          ],
        },
        {
          text: "支出",
          value: "2",
          children: [
            {
              text: "全部",
              children: [{ text: "全部", noid: true }],
              noid: true,
            },
          ].concat(
            def.a.map((s) => {
              if (!s.children) {
                s.children = [{ text: "无", noid: true }];
              } else {
                s.children = [{ text: "全部", noid: true }, ...s.children];
              }
              return s;
            })
          ),
        },
        {
          text: "收入",
          value: "1",
          children: [
            {
              text: "全部",
              children: [{ text: "全部", noid: true }],
              noid: true,
            },
          ].concat(
            def.b.map((s) => {
              if (!s.children) {
                s.children = [{ text: "无", noid: true }];
              } else {
                s.children = [{ text: "全部", noid: true }, ...s.children];
              }
              return s;
            })
          ),
        },
      ];

      this.def = JSON.parse(JSON.stringify(def));
    },
    onceify() {
      this.def.d = ["全部", "支出", "收入"].map((s, v) => {
        return {
          text: s,
          value: v + "",
          children: [
            {
              text: "全部",
              children: [{ text: "全部", noid: true }],
              noid: true,
            },
          ],
        };
      });
    },
  },
  mounted() {
    this.os = this.value;
    this.init();
  },
};
</script>
<style lang='less' scoped>
.select_search {
  position: fixed;
  left: 0;
  width: 100%;
  top: 0;
  z-index: 55;
  > div {
    border-radius: 0 0 50px 50px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding: 10px;
  }
  .btn {
    padding: 10px 10%;
  }
  .close {
    position: absolute;
    right: 0;
    left: 0;
    bottom: -55px;
    width: 45px;
    height: 45px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    color: #fff;
  }
  .flex {
    > input,
    > span {
      background-color: #f7f7f7;
      border: 0;
      width: 80px;
    }
    > span {
      padding: 0 10px;
      width: auto;
      &.active {
        color: #663;
      }
    }
    > b {
      padding: 0 8px;
      &:last-child {
        padding-right: 0;
      }
    }
    > input::placeholder {
      color: #ccc;
    }
  }
}
</style>
