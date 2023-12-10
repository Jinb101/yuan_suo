<template>
  <div class="record_line">
    <div class="times flex">
      <template v-if="list.finance_id && !nodel">
        <span class="dels">
          <v-more
            v-model="open13"
            :item="toTagDel()"
            @change="onDelThis"
            dire="right"
          ></v-more>
        </span>
      </template>
      <div class="sort">
        <b>记</b>
        <input type="number" v-model="num" />
      </div>
      <span class="time rtf" @click="onOpen('open')">
        <b>{{ time }}</b>
        <van-icon name="arrow" />
      </span>
    </div>
    <section class="flex">
      <p class="label">分类：</p>
      <div class="search rtf">
        <van-icon name="search" />
        <van-popover
          v-model="open11"
          theme="dark"
          trigger="click"
          :actions="b1"
          @select="onIfySelect"
        >
          <template #reference>
            <input type="text" placeholder="请输入分类" v-model="s1" />
          </template>
        </van-popover>
      </div>
      <div
        class="cell rtf"
        @click="onOpen('open2')"
        :class="{ active: a1.text }"
      >
        <b>{{ a1.text ? a1.text : "请选择分类" }}</b>
        <van-icon name="arrow-down" />
      </div>
    </section>
    <section class="flex">
      <p class="label">明细：</p>
      <div class="search rtf">
        <van-icon name="search" />
        <van-popover
          v-model="open12"
          theme="dark"
          trigger="click"
          :actions="b2"
          @select="onIfychildSelect"
        >
          <template #reference>
            <input type="text" placeholder="请输入明细" v-model="s2" />
          </template>
        </van-popover>
      </div>
      <div
        class="cell rtf"
        @click="onOpen('open3', !!a1.text, '请先选择分类')"
        :class="{ active: a2.text }"
      >
        <b>{{ a2.text ? a2.text : "请选择明细" }}</b>
        <van-icon name="arrow-down" />
      </div>
    </section>
    <section class="flex">
      <p class="label">{{ text }}：</p>
      <div class="input">
        <input
          type="number"
          :placeholder="'请输入' + text"
          v-model="os.income"
        />
        <b>元</b>
      </div>
    </section>
    <div class="money col_danger" v-if="os.income > 0">
      {{ tonum(os.income) }}
    </div>
    <van-field label="状态" readonly>
      <template #button>
        <van-radio-group v-model="type" direction="horizontal">
          <van-radio name="2">待{{ text2 }}款</van-radio>
          <van-radio name="1">已{{ text2 }}款</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <van-field
      label="选择账户"
      label-width="5em"
      placeholder="请选择账户"
      right-icon="arrow"
      readonly
      colon
      required
      input-align="right"
      @click="onOpen('open4')"
      v-model="a3.opening_bank"
    />
    <van-field
      label="选择客户"
      label-width="5em"
      placeholder="请选择客户"
      right-icon="arrow"
      readonly
      colon
      input-align="right"
      @click="onOpen('open5')"
      v-model="a4.customer_name"
    />
    <van-field
      label="选择部门"
      label-width="5em"
      placeholder="请选择部门"
      right-icon="arrow"
      readonly
      colon
      input-align="right"
      @click="onOpen('open6')"
      v-model="a5.name"
    />
    <van-field
      label="选择供应商"
      label-width="6em"
      placeholder="请选择供应商"
      right-icon="arrow"
      readonly
      colon
      input-align="right"
      @click="onOpen('open7')"
      v-model="a6.customer_name"
    />
    <van-field
      label="选择员工"
      label-width="5em"
      placeholder="请选择员工"
      right-icon="arrow"
      readonly
      colon
      input-align="right"
      @click="onOpen('open8')"
      v-model="a7.name"
    />
    <van-field label="分摊时间" readonly colon>
      <template #button>
        <div class="ftime flex">
          <span @click="onOpen('open9')">{{ time1 ? time1 : "开始时间" }}</span>
          <b>~</b>
          <span @click="onOpen('open10', !!time1, '请先选择分摊开始时间')">{{
            time2 ? time2 : "结束时间"
          }}</span>
        </div>
      </template>
    </van-field>
    <van-field
      rows="2"
      autosize
      label="备注"
      type="textarea"
      maxlength="600"
      placeholder="请输入备注"
      show-word-limit
      label-width="3em"
      v-model="os.remarks"
    />
    <van-cell title="附件" label="仅支持图片格式，最大限制9张"></van-cell>
    <div class="files">
      <v-us v-model="img">
        <div class="image">
          <v-u
            @on-path="setImg"
            @on-loading="setImg"
            more
            moreLength="9"
            :ids="ids"
          ></v-u>
        </div>
      </v-us>
    </div>
    <div class="btns">
      <van-button block round :color="$js.btnColor" @click="onSub">{{
        subtext ? subtext : "录入"
      }}</van-button>
    </div>
    <v-t v-model="time" :open="open" ymd></v-t>
    <v-s v-model="a1" :open="open2" text="classify_name" :list="itemify"></v-s>
    <v-s v-model="a2" :open="open3" text="classify_name" :list="itemifys"></v-s>
    <v-s v-model="a3" :open="open4" text="text" :list="itemaccount"></v-s>
    <v-s
      v-model="a4"
      :open="open5"
      text="customer_name"
      :list="item.customer"
    ></v-s>
    <v-s v-model="a5" :open="open6" text="name" :list="item.group"></v-s>
    <v-s
      v-model="a6"
      :open="open7"
      text="customer_name"
      :list="item.supplier"
    ></v-s>
    <v-s v-model="a7" :open="open8" text="name" :list="item.staff"></v-s>
    <v-t v-model="time1" :open="open9" ymd max="d_30"></v-t>
    <v-t v-model="time2" :open="open10" ymd max="m_6"></v-t>
  </div>
</template>

<script>
import vU from "../../public/upload.vue";
import vUs from "../../public/uploads.vue";
import vT from "../../private/time.vue";
import vS from "../../private/select.vue";
export default {
  props: {
    value: null,
    status: Boolean,
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
    indexnum: [String, Number],
    subtext: String,
    nodel: Boolean,
  },
  data() {
    return {
      // eslint-disable-next-line
      ids: "file_" + demo.$random.vars(6),
      num: 0,
      type: "2",
      img: [],
      time: "",
      time1: "",
      time2: "",
      os: {
        finance_id: "",
        classify_id: "",
        account_id: "",
        income: "",
        expenditure: "",
        level_classify_id: "",
        remarks: "",
        allocation_start_time: "",
        allocation_end_time: "",
        customer_id: "",
        supplier_id: "",
        department_id: "",
        applicant_id: "",
        financial_staff_id: "",
        enclosure: "",
        voucher_word: "",
      },
      open: false,
      open2: false,
      open3: false,
      open4: false,
      open5: false,
      open6: false,
      open7: false,
      open8: false,
      open9: false,
      open10: false,
      open11: false,
      open12: false,
      open13: false,
      itemifys: [],
      a1: {},
      a2: {},
      a3: {},
      a4: {},
      a5: {},
      a6: {},
      a7: {},
      b1: [],
      b2: [],
      s1: "",
      s2: "",
    };
  },
  components: {
    vU,
    vUs,
    vT,
    vS,
  },
  computed: {
    list: {
      get: function get() {
        return this.value;
      },
      set: function set(n) {
        this.$emit("input", n);
      },
    },
    text() {
      return this.status ? "收入" : "支出";
    },
    text2() {
      return this.status ? "收" : "付";
    },
    itemify() {
      return JSON.parse(JSON.stringify(this.item.ify || [])).map((s) => {
        s.text = s.classify_name;
        delete s.children;
        return s;
      });
    },
    itemaccount() {
      return JSON.parse(JSON.stringify(this.item.account || [])).map((s) => {
        s.text = [
          "(",
          +s.account_type === 2 ? "私" : "公",
          "户",
          ")~",
          s.account_title,
        ].join("");
        return s;
      });
    },
  },
  watch: {
    list: {
      handler(n) {
        if (n.$reload) {
          this.resetload();
        }
        this.$emit("input", n);
      },
      deep: true,
    },
    item: {
      handler() {
        this.init();
      },
      deep: true,
    },
    a1: {
      handler(n) {
        let val = this.item.ify.filter((r) => {
          return r.classify_id === n.classify_id;
        });
        if (val.length) {
          this.itemifys = val[0].children || [];
          this.b2 = this.itemifys.map((s) => {
            s.text = s.classify_name;
            return s;
          });
        }
        this.a2 = {};
        this.os.classify_id = n.classify_id || "";
      },
      deep: true,
    },
    a2: {
      handler(n) {
        this.os.level_classify_id = n.classify_id || "";
      },
      deep: true,
    },
    a3: {
      handler(n) {
        this.os.account_id = n.account_id || "";
      },
      deep: true,
    },
    a4: {
      handler(n) {
        this.resetAext(n, "5,6,7", 4);
      },
      deep: true,
    },
    a5: {
      handler(n) {
        this.resetAext(n, "4,6,7", 5);
      },
      deep: true,
    },
    a6: {
      handler(n) {
        this.resetAext(n, "4,5,7", 6);
      },
      deep: true,
    },
    a7: {
      handler(n) {
        this.resetAext(n, "4,5,6", 7);
      },
      deep: true,
    },
    s1(n) {
      if (n !== "") {
        this.b1 = this.itemify.filter((r) => {
          return r.text.indexOf(n) >= 0;
        });
      } else {
        this.b1 = this.itemify;
      }
    },
    s2(n) {
      if (n !== "") {
        this.b2 = this.itemifys.filter((r) => {
          return r.text.indexOf(n) >= 0;
        });
      } else {
        this.b2 = this.itemifys;
      }
    },
    indexnum(n) {
      if (n > 0) {
        this.num = n;
      }
    },
    time(n) {
      let a = this.list.financial_voucher || {};
      let t = a.record_date || "";
      // eslint-disable-next-line
      let d = demo.timeout(t, "ymd", "-");
      // console.log(n, 421, this.list.finance_id);
      if (d !== n) {
        let tm = new Date(n.replace(/-/g, "/")).getTime() / 1000;
        if (tm > 0) {
          this.$api.http(
            "financevoucher",
            { record_date: parseInt(tm) },
            (r) => {
              this.num = r;
            }
          );
        }
      }
    },
  },
  methods: {
    toTagDel() {
      // eslint-disable-next-line
      return demo.siteConfig.text.tag([1]);
    },
    onDelThis() {
      this.$emit("del", this.list);
    },
    resetload() {
      let o = {
        img: [],
        time: "",
        time1: "",
        time2: "",
        os: {
          finance_id: "",
          classify_id: "",
          account_id: "",
          income: "",
          expenditure: "",
          level_classify_id: "",
          remarks: "",
          allocation_start_time: "",
          allocation_end_time: "",
          customer_id: "",
          supplier_id: "",
          department_id: "",
          applicant_id: "",
          financial_staff_id: "",
          enclosure: "",
          voucher_word: "",
        },
        itemifys: [],
        a1: {},
        a2: {},
        a3: {},
        a4: {},
        a5: {},
        a6: {},
        a7: {},
        b1: [],
        b2: [],
        s1: "",
        s2: "",
      };
      let t = this;
      Object.keys(o).forEach((k) => {
        t[k] = o[k];
      });
    },
    onSub() {
      let obj = {
        record_date: this.time,
        status: this.type,
        data: {
          ...this.os,
          enclosure: this.img
            .map((s) => {
              return s.src;
            })
            .join(","),
          allocation_start_time: this.time1,
          allocation_end_time: this.time2,
          voucher_word: this.num,
          finance_id: this.list.finance_id || "",
        },
      };
      let money = obj.data.income;
      if (!money || money <= 0) {
        return this.$toast("请正确输入" + this.text + "金额");
      }
      if (!obj.data.account_id) {
        return this.$toast("请选择账户");
      }
      if (!this.status) {
        obj.data.expenditure = money;
        obj.data.income = "";
      }
      this.$emit(
        "change",
        JSON.parse(JSON.stringify(obj)),
        !!this.list.finance_id
      );
    },
    onIfychildSelect(e) {
      this.a2 = e;
    },
    onIfySelect(e) {
      this.a1 = e;
    },
    resetAext(val, n, num) {
      if (typeof val !== "object") {
        val = {};
      }
      switch (num) {
        case 4:
          this.os.customer_id = val.customer_id || "";
          break;
        case 5:
          this.os.department_id = val.id || "";
          break;
        case 6:
          this.os.supplier_id = val.customer_id || "";
          break;
        default:
          this.os.applicant_id = val.staff_id || "";
          this.os.financial_staff_id = val.id || "";
      }
      if (!val.text) return 0;
      let a = n.split(",").map((s) => {
        return "a" + s;
      });
      let ts = this;
      a.forEach((k) => {
        if (ts[k]) {
          ts[k] = {};
        }
      });
    },
    onOpen(e, v, msg = "") {
      if (typeof v === "boolean") {
        if (!v) {
          if (msg) {
            this.$toast(msg);
          }
          return 0;
        }
      }
      if (typeof this[e] === "boolean") {
        this[e] = !this[e];
      }
    },
    setImg(e, v) {
      this.img = v;
    },
    tonum(num) {
      // eslint-disable-next-line
      let a = demo.es6().toChinaNum(parseFloat(num), true);
      if (a.indexOf("元") < 0) return a + "元";
      return a;
    },
    init() {
      // eslint-disable-next-line
      this.time = demo.timeout("", "ymd", "-");
      if (this.item.time) {
        // 基础数据
        this.b1 = this.itemify;
      }

      if (this.list.finance_id) {
        let val = this.list;
        let vou = val.financial_voucher || {};
        let ify = val.financial_classify || {};
        let ify2 = val.level_classify || {};
        // 编辑模式
        this.num = vou.voucher_word;
        // eslint-disable-next-line
        this.time = demo.timeout(vou.record_date, "ymd", "-");
        this.a1 = { ...ify, text: ify.classify_name };

        this.os.income = +val.amount_money;
        this.type = +val.whether_pay === 3 ? "1" : val.whether_pay;

        this.a3 = val.financial_account || {};
        this.a4 = val.financial_customer || {};
        this.a5 = val.department || {};
        this.a6 = val.supplier || {};

        // eslint-disable-next-line
        this.time1 = demo.timeout(val.allocation_start_time, "ymd", "-");
        // eslint-disable-next-line
        this.time2 = demo.timeout(val.allocation_end_time, "ymd", "-");

        this.os.remarks = val.remarks || "";

        let sid = {};
        if (val.applicant_id && val.applicant_id > 0) {
          sid.name = (val.financial_staff || {}).name;
          sid.id = (val.financial_staff || {}).id;
        }
        if (val.financial_staff_id && val.financial_staff_id > 0) {
          sid.name = (val.staff || {}).name;
          sid.staff_id = (val.staff || {}).id;
        }
        this.a7 = sid;

        let img = (val.enclosure + "").split(",");
        img = img.filter((r) => {
          return r !== "" && r !== "undefined";
        });
        if (img.length) {
          img = img.map((s) => {
            return {
              src: s,
              srcs: val.picture_domain_name + s,
              cover: "img",
              old: true,
            };
          });
        }
        this.img = img;

        this.$nextTick(() => {
          this.a2 = { ...ify2, text: ify2.classify_name };
        });
      }

      if (this.list.$reload) {
        this.resetload();
      }
    },
  },
  mounted() {
    this.list = this.value;
    this.init();
  },
};
</script>
<style lang='less' scoped>
.record_line {
  background-color: #fff;
  border-radius: 8px;
  margin: 10px;
  box-shadow: 0 0 10px rgba(35, 35, 35, 0.2);
  font-size: 16px;
  padding: 10px 0;
  input {
    border: 0;
    &::placeholder {
      color: #ccc;
    }
  }
  .times {
    padding: 0 8px;
    line-height: 30px;
    .sort {
      width: 110px;
      display: flex;
      font-weight: 650;
      input {
        margin-left: 2px;
        &:focus {
          background-color: #f7f7f7;
        }
      }
    }
    .time {
      flex: 1;
    }
  }
  > section {
    padding: 8px 12px;
    .cell {
      flex: 1;
      color: #999;
      font-size: 14px;
      &.active {
        color: #333;
      }
    }
    .search {
      width: 120px;
      display: flex;
      input {
        background-color: #f7f7f7;
        margin-left: 5px;
        width: 100%;
      }
    }
    .input {
      flex: 1;
      display: flex;
      padding-right: 5px;
      input {
        flex: 1;
        margin-right: 5px;
        background-color: #f7f7f7;
      }
    }
  }
  .rtf {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    i {
      margin-left: 3px;
      color: #999;
    }
  }
  .money {
    padding: 8px 12px;
    font-weight: 650;
    font-size: 13px;
    letter-spacing: 2px;
  }
  .ftime {
    span {
      padding: 0 10px;
    }
    b {
      padding: 0 5px;
    }
  }
  .files {
    padding: 8px;
  }
  .image {
    width: 80px;
    height: 80px;
  }
  .btns {
    padding: 20px 10%;
  }
}
.dels {
  margin-right: 6px;
}
</style>
