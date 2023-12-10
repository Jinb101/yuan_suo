<template>
  <v-finance>
    <template #menu>
      <span class="color" @click="open = !open">筛选凭证</span>
    </template>
    <v-s v-model="search" :open="open" @change="onPage(1)"></v-s>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section v-for="(i, j) in item" :key="j" @click.stop="onDetail(i, j)">
        <div class="tag">
          <v-more
            v-model="i.$open"
            :item="onTag(i, j)"
            @change="eventChange"
          ></v-more>
        </div>
        <div class="head flex">
          <p>记{{ i.voucher_word }}</p>
          <span class="time">{{ toTime(i.record_date) }}</span>
        </div>
        <div class="s_view">
          <div
            v-for="(x, y) in toData(i.finance)"
            :key="y + '-' + j"
            :class="{ status: x.status }"
          >
            <p>分类：{{ x.ify }}</p>
            <p>明细：{{ x.ify2 }}</p>
            <p>
              {{ x.type }}:
              <b :class="'col_' + (x.status ? 'danger' : 'green')">
                {{ x.money }}元
              </b>
            </p>
            <p v-if="x.money" :class="'col_' + (x.status ? 'danger' : 'green')">
              {{ tonum(x.money) }}
            </p>
            <p>账户：{{ x.acc }}</p>
            <p>申请人：{{ x.people || i.name }}</p>
          </div>
        </div>
        <div class="btn flex fw">
          <van-button
            v-for="(q, w) in onTag(i, j)"
            :key="w + 'b' + j"
            :icon="q.icon"
            size="small"
            @click.stop="eventChange(q)"
            :type="q.col"
            plain
          >
            {{ q.text }}
          </van-button>
        </div>
      </section>
    </v-page>
    <template #fixed>
      <v-f :index="120" :footer="false" v-model="open1" text="凭证详细">
        <v-d v-model="det">
          <div class="btn flex fw">
            <van-button
              v-for="(q, w) in onTag(det, det.$index)"
              :key="w + 'd'"
              :icon="q.icon"
              size="small"
              @click.stop="eventChange(q)"
              :type="q.col"
              plain
            >
              {{ q.text }}
            </van-button>
          </div>
        </v-d>
      </v-f>
      <v-f :index="125" :footer="false" v-model="open2" text="编辑凭证">
        <v-e
          v-model="det2"
          :item="items"
          :status="det2.$status"
          @change="onEdit"
          subtext="编辑"
          nodel
        ></v-e>
      </v-f>
    </template>
  </v-finance>
</template>

<script>
import vS from "./_search.vue";
import vD from "./_detail.vue";
import vF from "../../private/fixed.vue";
import vE from "../record/line.vue";
export default {
  data() {
    return {
      search: {},
      open: false,
      open1: false,
      open2: false,
      item: [],
      det: {},
      det2: {},
      items: [],
    };
  },
  components: { vS, vF, vD, vE },
  methods: {
    httpdef(api, data = {}) {
      let t = this;
      return new Promise((resolve, reject) => {
        t.$api.http(api, data, (res) => {
          resolve(res);
        });
      });
    },
    // 类型
    async get1() {
      return this.httpdef("financeifyget", { classify_type: this.type }).then(
        (e) => {
          // eslint-disable-next-line
          let tree = demo.tree(e, "classify_id", "pid");
          this.item.ify = tree;
        }
      );
    },
    async get2() {
      return this.httpdef("financevoucher").then((e) => {
        this.num = e;
      });
    },
    // 账户
    async get3() {
      return this.httpdef("financeaccount").then((e) => {
        this.item.account = e;
      });
    },
    // 客户
    async get4() {
      return this.httpdef("financecustomer", { customer_type: 1 }).then((e) => {
        this.item.customer = e;
      });
    },
    // 供应商
    async get5() {
      return this.httpdef("financecustomer", { customer_type: 2 }).then((e) => {
        this.item.supplier = e;
      });
    },
    // 获取部门
    async get6() {
      return this.httpdef("getGroup").then((e) => {
        this.item.group = e;
      });
    },
    // 获取员工
    async get7() {
      return this.httpdef("financestaffget").then((e) => {
        this.item.staff = e;
      });
    },
    async init_item(fn) {
      if (this.items.time) return fn();
      let load = this.$toast.loading({ duration: 0, forbidClick: true });
      // 获取分类
      await this.get1();
      // 最新凭证号
      await this.get2();
      // 获取账户
      await this.get3();
      // 获取客户
      await this.get4();
      // 获取供应商
      await this.get5();
      // 获取部门
      await this.get6();
      // 获取员工
      await this.get7();
      this.items = { time: Date.now(), ...this.item };
      load.close();
      fn();
    },
    onEdit(e) {
      let os = { ...e, ...this.det2.$obj };
      delete os.status;
      this.$api.http("financevoucheredit", os, () => {
        this.$toast("编辑成功");
        this.open2 = false;
        this.det2 = {};
        this.onPage(1);
      });
    },
    onDetail(e, index) {
      this.det = { ...e, $index: index, $status: +e.status === 1 };
      this.open1 = true;
    },
    tonum(num) {
      // eslint-disable-next-line
      let a = demo.es6().toChinaNum(parseFloat(num), true);
      if (a.indexOf("元") < 0) return a + "元";
      return a;
    },
    toData(arr) {
      if (!arr.length) return [];
      return arr.map((x) => {
        let ify = (x.financial_classify || {}).classify_name;
        let ify2 = (x.level_classify || {}).classify_name;
        let acc = (x.financial_account || {}).account_title;
        if (acc.indexOf("公户") > 0) {
          acc = acc.replace(/\(公户\)/g, "");
          acc = "(公户) " + acc;
        } else if (acc.indexOf("私户") > 0) {
          acc = acc.replace(/\(私户\)/g, "");
          acc = "(私户) " + acc;
        }
        let people =
          (x.applicant_id > 0
            ? (x.staff || {}).name
            : (x.financial_staff || {}).name) || "";

        return {
          ify,
          ify2,
          type: +x.financial_type === 2 ? "支出" : "收入",
          money: +x.amount_money,
          acc,
          people,
          status: +x.financial_type === 2,
        };
      });
    },
    toTime(e) {
      if (isNaN(e)) return e;
      if (e < 1) return "/";
      // eslint-disable-next-line
      let a = demo.timeout(e, "array");
      return [a[0], "年", a[1], "月", a[2], "日"].join("");
    },
    onTag(e, index) {
      let a = [1];
      if (+e.status === 1) {
        // 待审核 可编辑
        a = a.concat(5, 9);
      } else if (+e.status === 2) {
        // 已审核 不可编辑
        a = a.concat(10);
      }
      // eslint-disable-next-line
      return demo.siteConfig.text.tag(a, { index, ext: e });
    },
    eventChange(e) {
      let edata = e.ext || {};
      switch (e.type) {
        case "del":
          this.$js.modeldel(() => {
            let finance_id = edata.voucher_id;
            try {
              finance_id = edata.finance[0].id;
            } catch (err) {}
            this.$api.http("financevoucherdel", { finance_id }, () => {
              this.$toast("删除成功");
              this.open2 = false;
              this.open1 = false;
              this.det = {};
              this.det2 = {};
              this.item.splice(e.index, 1);
            });
          }, "凭证");
          break;
        case "edit":
          let d = (edata.finance || [])[0] || {};
          this.init_item(() => {
            this.det2 = {
              ...d,
              $index: e.index,
              finance_id: d.id,
              financial_voucher: {
                voucher_word: edata.voucher_word,
              },
              $status: +d.financial_type === 1,
              $obj: {
                voucher_id: edata.voucher_id,
                voucher_word: edata.voucher_word,
              },
            };
            this.open2 = true;
          });
          break;
        default:
          let msg = e.type === "check" ? "" : "反";
          let status = msg === "" ? 2 : 1;
          this.$js.model("审核提示", "是否" + msg + "审核？", (r) => {
            if (r) {
              this.$api.http(
                "financevoucherstatus",
                { voucher_id: edata.voucher_id, status },
                () => {
                  this.$toast(msg + "审核成功");
                  try {
                    this.$set(this.item[e.index], "status", status);
                  } catch (err) {
                    this.onPage(1);
                  }
                  this.open2 = false;
                  this.open1 = false;
                  this.det = {};
                  this.det2 = {};
                }
              );
            }
          });
      }
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("financevoucherget", { page, ...this.search }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(
          e.map((s) => {
            s.$open = false;
            return s;
          })
        );
        this.$refs.page.onFinish(e.length < 20);
      });
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.color {
  color: #fff;
  font-weight: 650;
}
section {
  margin: 10px 10px 0;
  background-color: #fff;
  border-radius: 30px 5px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-size: 15px;
  position: relative;
  overflow: hidden;
  .tag {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  & + section {
    margin-top: 20px;
  }
  .head {
    padding: 5px;
    padding-right: 25px;
    .time {
      flex: 1;
      font-size: 13px;
      text-align: right;
    }
  }
  .s_view {
    margin-top: 3px;
    p {
      font-weight: 600;
      line-height: 1.5;
      padding-bottom: 3px;
    }
    > div {
      background: linear-gradient(
        45deg,
        rgba(227, 249, 237, 0.3),
        rgba(202, 235, 240, 0.4)
      );
      padding: 8px;
      border-radius: 8px;
      &.status {
        background: linear-gradient(
          45deg,
          rgba(241, 232, 227, 0.3),
          rgba(244, 199, 193, 0.4)
        );
      }
    }
  }
}
.btn {
  padding: 10px 8px 0 0;
  justify-content: flex-end;
  .van-button {
    margin-left: 15px;
  }
}
</style>
