<template>
  <v-view
    bgc="#f5f5f5"
    header
    cover
    cover-bgc="linear-gradient(#c1b0ff, #f5f5f5)"
    index="400"
  >
    <!-- 功能区 -->
    <template v-if="version">
      <v-a6 v-if="+id === 0" v-model="list"></v-a6>
      <v-a7 v-else-if="+id === 1" v-model="list"></v-a7>
      <v-a8 v-else-if="+id === 3" v-model="list"></v-a8>
    </template>
    <template v-else>
      <v-a1 v-if="+id === 0" v-model="list"></v-a1>
      <v-a2 v-else-if="+id === 1" v-model="list"></v-a2>
      <v-a4 v-else-if="+id === 3" v-model="list"></v-a4>
    </template>
    <v-a3 v-if="+id === 2" v-model="list"></v-a3>
    <v-a5 v-else-if="+id === 4" v-model="list"></v-a5>

    <div class="change_line top">
      <h6>选择审批人({{ a.length }})</h6>
      <v-p v-model="a" all></v-p>
    </div>
    <div class="change_line">
      <h6>选择知会人({{ b.length }})</h6>
      <v-p v-model="b" all></v-p>
    </div>
    <!-- bank -->
    <div class="change_line top" v-if="isBank">
      <van-field
        v-model="bank.account_name"
        label="开户行名"
        placeholder="请输入开户行名"
        label-width="5em"
      />
      <van-field
        v-model="bank.bank_no"
        label="银行账号"
        placeholder="请输入银行账号"
        type="digit"
        label-width="5em"
      />
      <van-field
        v-model="bank.bank_name"
        label="开户姓名"
        placeholder="请输入开户姓名"
        label-width="5em"
      />
    </div>
    <div class="change_line top">
      <h6>申请说明</h6>
      <van-field
        v-model="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="200"
        placeholder="请输入内容"
        show-word-limit
      />
    </div>
    <div class="change_line">
      <h6>添加图片</h6>
      <x-content>
        <v-is v-model="image">
          <div class="image">
            <v-i
              more
              @on-loading="onImageLoading"
              @on-path="onImagePath"
              ids="u1-file"
            ></v-i>
          </div>
        </v-is>
      </x-content>
    </div>
    <div class="change_line" v-if="+id === 3">
      <h6>{{ toState }}</h6>
      <x-content>
        <v-is v-model="image2">
          <div class="image">
            <v-i
              more
              @on-loading="onImageLoading2"
              @on-path="onImagePath2"
              type="all"
              ids="u2-file"
            ></v-i>
          </div>
        </v-is>
      </x-content>
    </div>
    <div class="foot_btn top"></div>
    <div class="approval_cvoer"></div>
    <div class="page_fixed flex">
      <template v-if="+id === 0">
        <div class="submit_price">
          <p>
            合计价格：<span class="col_danger">￥{{ allPrice }}</span>
          </p>
        </div>
      </template>
      <van-button
        class="submit_btn"
        :color="$js.btnColor"
        block
        @click="onSendSubmit"
        >提交审核</van-button
      >
    </div>
  </v-view>
</template>

<script>
import vP from "../../private/people_task.vue";
import vIs from "../../public/uploads.vue";
import vI from "../../public/upload.vue";
import vA1 from "./send/1.vue"; // 6.vue 老版本
import vA2 from "./send/2.vue"; // 7.vue 老版本
import vA3 from "./send/3.vue";
import vA4 from "./send/4.vue"; // 8.vue 老版本
import vA5 from "./send/5.vue";
import vA6 from "./send/6.vue";
import vA7 from "./send/7.vue";
import vA8 from "./send/8.vue";
export default {
  data() {
    return {
      menu: [],
      a: [],
      b: [],
      bank: {
        bank_name: "",
        bank_no: "",
        account_name: "",
      },
      message: "",
      image: [],
      id: "",
      list: [],
      image2: [],
      version: false,
    };
  },
  components: { vP, vI, vIs, vA1, vA2, vA3, vA4, vA5, vA6, vA7, vA8 },
  computed: {
    isBank() {
      return ["1", "4"].indexOf(this.id) < 0;
    },
    allPrice() {
      if (+this.id === 0 && this.list.length) {
        let arr = this.list.map((s) => {
          return s.jid >= 0 ? +s.price * +s.num : 0;
        });
        // eslint-disable-next-line
        return demo.array(arr).sum(0);
      }
      return 0;
    },
    toState() {
      return "添加附件 (PDF文档/Word/Excel)";
    },
  },
  methods: {
    recombinationData() {
      let ext = {};
      let api = "";
      switch (+this.id) {
        case 0:
          ext = this.recombination0();
          api = "approvalSendGood";
          break;
        case 1:
          ext = this.recombination1();
          api = "approvalSendUse";
          break;
        case 2:
          ext = this.recombination2();
          api = "approvalSendCost";
          break;
        case 3:
          ext = this.recombination3();
          api = "approvalSendReim";
          break;
        case 4:
          ext = this.recombination4();
          api = "approvalSendAtten";
          break;
        default:
      }
      if (!ext) {
        return {};
      }
      if (!this.a.length) {
        this.$toast("请选择审批人");
        return {};
      }
      ext = {
        ...ext,
        content: this.message,
        imgs: this.image.map((s) => s.src),
        principal_id: this.a
          .map((r) => {
            return r.id;
          })
          .join(","),
        center_inform_ids: "",
        nursery_inform_ids: this.b
          .map((r) => {
            return r.id;
          })
          .join(","),
      };
      if (+this.id === 3) {
        ext.imgs = ext.imgs.concat(this.image2.map((s) => s.src));
      }
      if (this.isBank) {
        ext = {
          ...ext,
          ...this.bank,
        };
      }
      return { ext, api };
    },
    recombination0() {
      let val = this.list
        .map((s) => {
          return s.job;
        })
        .filter((r) => {
          return r !== "";
        });
      let item = this.list.map((r) => {
        return {
          s_id: r.jid,
          sc_id: r.cid,
          price: r.price,
          num: r.num,
        };
      });
      item = item.filter((r) => {
        return r.s_id !== "";
      });
      if (!item.length) {
        this.$toast("请添加采购物品");
        return false;
      }
      for (let i = 0; i < item.length; i++) {
        if (item[i].price === "") {
          this.$toast("采购物品[" + val[i] + "]请添加单价");
          return false;
        }
        if (item[i].num === "") {
          this.$toast("采购物品[" + val[i] + "]请添加数量");
          return false;
        }
      }
      return {
        supplies: JSON.stringify(item),
        principal_type: 1,
        supplier_id: "",
        amount: this.allPrice,
      };
    },
    recombination1() {
      let val = this.list
        .map((s) => {
          return s.job;
        })
        .filter((r) => {
          return r !== "";
        });
      let item = this.list.map((r) => {
        return {
          s_id: r.jid,
          sc_id: r.cid,
          is_return: r.ret,
          num: r.num,
          all: r.ext.num,
        };
      });
      item = item.filter((r) => {
        return r.s_id !== "";
      });
      if (!item.length) {
        this.$toast("请添加领用物品");
        return false;
      }
      for (let i = 0; i < item.length; i++) {
        if (item[i].num === "") {
          this.$toast("领用物品[" + val[i] + "]请添加数量");
          return false;
        }
        if (item[i].num > item[i].all) {
          this.$toast("领用物品[" + val[i] + "]超出库存数量");
          return false;
        }
        if (item[i].num < 1) {
          this.$toast("领用物品[" + val[i] + "]数量至少领用1样");
          return false;
        }
      }
      return {
        supplies: JSON.stringify(
          item.map((s) => {
            delete s.all;
            return s;
          })
        ),
        center_inform_ids: "",
      };
    },
    recombination2() {
      if (this.list.length) {
        return { amount: this.list[0], principal_type: 1 };
      }
      return false;
    },
    recombination3() {
      let val = this.list.map((s) => {
        return {
          amount: s.price,
          classify_id: s.cid,
          level_classify_id: s.jid,
          receipt_type: 0,
        };
      });
      let flag = this.list.filter((r) => {
        return r.jid !== "";
      });
      if (!flag.length) {
        this.$js.message("请添加报销");
        return false;
      }
      let flag1 = this.list.filter((s) => {
        return s.price === "";
      });
      if (flag1.length) {
        let r = flag1[0];
        this.$js.message([r.ify, r.job].join("-") + "未设置报销金额");
        return false;
      }
      return {
        receipt_data: JSON.stringify(val),
        principal_type: 1,
        center_inform_ids: "",
      };
    },
    recombination4() {
      if (this.list.length) {
        let val = this.list[0];
        if (!val.attendance_type) {
          this.$js.message("请选择出勤类别");
          return false;
        }
        if (!val.begin_date || !val.end_date) {
          this.$js.message("请选择出勤时间");
          return false;
        }
        return { ...val, principal_type: 1, center_inform_ids: "" };
      }
      this.$js.message("请选择出勤类别");
      return false;
    },
    init() {
      this.list = [];
      let val = this.menu[this.id];
      let title =
        val.text.replace("借款", "费用").replace("请假", "出勤") + "审批";
      // eslint-disable-next-line
      demo.title(title);
      // eslint-disable-next-line
      let bank = demo.$local.get("approval-bank", {});
      // eslint-disable-next-line
      let ver = demo.$local.get("system-mode", {});
      this.version = !!ver.approval;
      if (bank.time) {
        delete bank.time;
        this.bank = bank;
      }
      this.$api.http("getApproval", { approval_type: val.type }, (res) => {
        this.a = res
          .filter((s) => +s.inform_type === 1)
          .map((s) => {
            return {
              avatar: s.avatar,
              id: s.id,
              name: s.name,
            };
          });
        this.b = res
          .filter((s) => +s.inform_type !== 1)
          .map((s) => {
            return {
              avatar: s.avatar,
              id: s.id,
              name: s.name,
            };
          });
      });
    },
    onImageLoading(ext, list, index) {
      this.image = list;
    },
    onImagePath(ext, list, index) {
      this.image = list;
    },
    onImageLoading2(ext, list, index) {
      this.image2 = list;
    },
    onImagePath2(ext, list, index) {
      this.image2 = list;
    },
    onSendSubmit() {
      let item = this.recombinationData();
      if (item.api) {
        this.$api.http(item.api, item.ext, () => {
          this.$js.message("发起成功");
          // eslint-disable-next-line
          demo.$local.set("approval-bank", { time: Date.now(), ...this.bank });
          this.$router.back();
        });
      }
    },
  },
  mounted() {
    let bar = this.$js.def.index.approval;
    this.id = this.$route.params.id || "0";
    this.menu = bar[0];
    this.init();
  },
};
</script>
<style lang='less' scoped>
.approval_cvoer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 200px;
  z-index: -1;
  background: linear-gradient(#c1b0ff, #f5f5f5);
}
.change_line {
  background-color: #fff;
  padding: 8px 0 10px;
  h6 {
    font-size: 14px;
    font-weight: 650;
    padding: 10px;
    color: #999;
  }
}
.top {
  margin-top: 10px;
}
.image {
  width: 100px;
  height: 100px;
}
.foot_btn {
  height: 60px;
}
.page_fixed {
  height: 60px;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 55;
}
.submit_btn {
  height: 60px;
  flex: 1;
}
.submit_price {
  width: 240px;
  background-color: #fff;
  box-sizing: border-box;
  font-size: 14px;
  padding: 32px 0 0 12px;
  span {
    font-weight: 650;
    font-size: 18px;
  }
}
</style>
