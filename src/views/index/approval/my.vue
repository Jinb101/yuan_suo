<template>
  <v-view
    bar
    bgc="#f5f5f5"
    header
    cover
    cover-bgc="linear-gradient(#c1b0ff, #f5f5f5)"
    index="400"
  >
    <template #menu>
      <span class="bold" @click="openFilter = true"
        ><van-icon name="filter-o" />筛选</span
      >
    </template>
    <template #footer>
      <van-tabbar v-model="active">
        <van-tabbar-item v-for="(i, j) in menu" :key="j" :dot="i.num > 0">
          <span>{{ i.text }}</span>
          <template #icon>
            <img :src="$js.config.icon(i.icon, 'index')" alt="" />
          </template>
        </van-tabbar-item>
      </van-tabbar>
    </template>
    <template #fixed>
      <v-f :index="500" v-model="openFilter" text="筛选" :footer="false">
        <van-field
          label="状态"
          placeholder="请选择状态"
          input-align="right"
          readonly
          right-icon="arrow-down"
        />
        <x-content>
          <van-radio-group v-model="search.status">
            <van-cell-group>
              <van-cell
                :title="i.t"
                clickable
                @click="search.status = i.v"
                v-for="(i, j) in radio"
                :key="j + 'r'"
              >
                <template #right-icon>
                  <van-radio :name="i.v" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </x-content>
        <van-field
          label="时间区间开始"
          placeholder="请选择开始时间"
          input-align="right"
          readonly
          right-icon="arrow"
          @click="openStartTime = !openStartTime"
          v-model="search.begin_date"
        />
        <van-field
          label="时间区间结束"
          placeholder="请选择结束时间"
          input-align="right"
          readonly
          right-icon="arrow"
          @click="openEndTime = !openEndTime"
          v-model="search.end_date"
        />
        <div class="w60">
          <van-button block round :color="$js.btnColor" @click="onPage(1)"
            >搜索</van-button
          >
        </div>
      </v-f>
      <v-time :open="openStartTime" v-model="search.begin_date" ymd></v-time>
      <v-time :open="openEndTime" v-model="search.end_date" ymd></v-time>
      <v-f
        :index="501"
        v-model="openDetail"
        text="详情"
        bgc="#f5f5f5"
        :footer="false"
      >
        <!-- 拒绝需要写理由 弹框 -->
        <v-p1
          v-if="+id === 0"
          v-model="ext"
          :child="child"
          @changesub="changesub"
        >
          <van-button class="btns" color="tomato" @click="onSend(3)"
            >拒绝</van-button
          >
          <van-button class="btns" :color="$js.btnColor" @click="onSend(1)"
            >同意</van-button
          >
          <template #footer>
            <van-button class="btns" :color="$js.btnColor" @click="onSend(2)"
              >撤销</van-button
            >
          </template>
        </v-p1>
        <v-p2
          v-else-if="+id === 1"
          v-model="ext"
          :child="child"
          @changesub="changesub"
        >
          <van-button class="btns" color="tomato" @click="onSend(3)"
            >拒绝</van-button
          >
          <van-button class="btns" :color="$js.btnColor" @click="onSend(1)"
            >同意</van-button
          >
          <template #footer>
            <van-button class="btns" :color="$js.btnColor" @click="onSend(2)"
              >撤销</van-button
            >
          </template>
        </v-p2>
        <v-p3
          v-else-if="+id === 2"
          v-model="ext"
          :child="child"
          @reset="onDetail"
          @changesub="changesub"
        >
          <van-button class="btns" color="tomato" @click="onSend(3)"
            >拒绝</van-button
          >
          <van-button class="btns" :color="$js.btnColor" @click="onSend(1)"
            >同意</van-button
          >
          <template #footer>
            <van-button class="btns" :color="$js.btnColor" @click="onSend(2)"
              >撤销</van-button
            >
          </template>
        </v-p3>
        <v-p4
          v-else-if="+id === 3"
          v-model="ext"
          :child="child"
          @changesub="changesub"
        >
          <van-button class="btns" color="tomato" @click="onSend(3)"
            >拒绝</van-button
          >
          <van-button class="btns" :color="$js.btnColor" @click="onSend(1)"
            >同意</van-button
          >
          <template #footer>
            <van-button class="btns" :color="$js.btnColor" @click="onSend(2)"
              >撤销</van-button
            >
          </template>
        </v-p4>
        <v-p5
          v-else-if="+id === 4"
          v-model="ext"
          :child="child"
          @changesub="changesub"
        >
          <van-button class="btns" color="tomato" @click="onSend(3)"
            >拒绝</van-button
          >
          <van-button class="btns" :color="$js.btnColor" @click="onSend(1)"
            >同意</van-button
          >
          <template #footer>
            <van-button class="btns" :color="$js.btnColor" @click="onSend(2)"
              >撤销</van-button
            >
          </template>
        </v-p5>
      </v-f>
      <van-dialog
        v-model="show"
        title="是否拒绝审批"
        show-cancel-button
        @confirm="onSend(0)"
      >
        <van-field
          v-model="refuse"
          label="拒绝原因"
          placeholder="请输入拒绝原因"
          type="textarea"
          autosize
          row="2"
        />
      </van-dialog>
    </template>
    <div class="approval_cvoer"></div>
    <v-t v-model="child" :notice="dot.inform" :dot="dot.approval">
      <v-page ref="page" @on-page="onPage">
        <van-empty v-if="!item.length"></van-empty>
        <x-content></x-content>
        <x-content v-for="(i, j) in item" :key="j">
          <section class="list" @click="onDetail(i, j)">
            <div class="cover" v-if="toIcon(i.status)">
              <van-image :src="toIcon(i.status)" class="db_image"></van-image>
            </div>
            <span class="num">
              {{ j > 999 ? j : ((j + 1) / 100 + "").replace(".", "") }}
            </span>
            <p v-if="i.apply_name">
              申请人：<b>{{ i.apply_name }}</b>
            </p>
            <p>
              申请时间：<b>{{ i.apply_time }}</b>
            </p>
            <p>
              状态：<b :class="'s' + toIcon(i.status, true)">{{
                toStatus(i.status)
              }}</b>
            </p>
            <template v-if="+id === 2">
              <p v-if="i.content">审批说明：{{ i.content }}</p>
            </template>
            <template v-if="i.have_seen >= 0">
              <p>
                是否查看：
                <b :class="{ s9004: +i.have_seen !== 1 }"
                  >{{ +i.have_seen === 1 ? "已" : "未" }}读</b
                >
              </p>
              <span class="status"> </span>
            </template>
          </section>
        </x-content>
      </v-page>
    </v-t>
  </v-view>
</template>

<script>
import vT from "./_my.vue";
import vF from "../../private/fixed.vue";
import vTime from "../../private/time.vue";
import vP1 from "./my/1.vue";
import vP2 from "./my/2.vue";
import vP3 from "./my/3.vue";
import vP4 from "./my/4.vue";
import vP5 from "./my/5.vue";
export default {
  data() {
    return {
      id: "",
      detailid: "",
      menu: [],
      active: "",
      child: "",
      dot: {},
      item: [],
      api: "",
      openFilter: false,
      search: { status: "9999", begin_date: "", end_date: "" },
      radio: [
        { t: "全部", v: "9999" },
        { t: "待审核", v: "1" },
        { t: "已通过", v: "2" },
        { t: "已撤销", v: "3" },
        { t: "未通过", v: "-1" },
      ],
      openStartTime: false,
      openEndTime: false,
      openDetail: false,
      ext: {},
      show: false,
      refuse: "",
    };
  },
  components: { vT, vF, vTime, vP1, vP2, vP3, vP4, vP5 },
  watch: {
    "$route.path"(n) {
      if (this.openDetail && n.indexOf("max") > 0) {
        this.openDetail = false;
      }
      this.init();
    },
    active(n) {
      this.onActive(n);
    },
    child(n) {
      this.api = ["approvalMyWait", "approvalMySend", "approvalMyNotice"][n];
      this.onPage(1);
    },
    detailid(n) {
      if (n === "") {
        return this.appPath(
          "/approval_my/" + this.id + "&max&" + this.child,
          true
        );
      }
      this.appPath("/approval_my/" + this.id + "&" + n + "&" + this.child);
      this.$nextTick(() => {
        if (!this.openDetail) {
          this.onDetail({ id: n });
        }
      });
    },
    openDetail(n) {
      if (!n) {
        this.detailid = "";
        this.$api.http(
          "approvalMyDot",
          { approval_type: this.id + 1 },
          (res) => {
            this.dot = res;
          }
        );
      }
    },
  },
  inject: ["appPath"],
  methods: {
    changesub(e) {
      this.$api.http("approvalcheck", e, () => {
        this.$toast("替换成功");
        this.onDetail({ id: this.ext.id });
      });
    },
    onStatus(status, obj = {}) {
      let aid = status === 3 ? this.ext.id : this.ext.a_id;
      let os = { status, ...obj, id: this.ext.id };
      let val = this.item.map((s) => s.id === aid);
      let index = val.indexOf(true);
      if (+this.ext.status === 2 && +this.id === 4 && status === 3) {
        this.$api.http("approvalMyrevoke", { approval_id: os.id }, () => {
          this.$js.message("撤销成功");
          this.openDetail = false;
          if (index >= 0) {
            this.$set(this.item[index], "status", 3);
          }
        });
        // 新撤销
        return 0;
      }
      this.$api.http("approvalMyStatus", os, () => {
        this.$js.message("设置成功");
        this.openDetail = false;
        if (index >= 0) {
          this.$set(this.item[index], "status", status);
        }
      });
    },
    onSend(num) {
      switch (+num) {
        case 0:
          this.onStatus(-1, { reasons_refusal: this.refuse });
          break;
        case 1: // 同意
          // 报销审批宣传入  银行信息 与 receipt
          // 采购 最后一个人 可改物品明细
          let os = {};
          if (+this.id === 0) {
            os = {
              goods: JSON.stringify(
                this.ext.goods.map((s) => {
                  return {
                    id: s.id,
                    c_id: s.c_id,
                    s_id: s.s_id,
                    price: s.price,
                    num: s.num,
                  };
                })
              ),
            };
          }
          if (+this.id === 2) {
            os = {
              account_name: this.ext.account_name,
              bank_no: this.ext.bank_no,
              bank_name: this.ext.bank_name,
              receipt: JSON.stringify(
                this.ext.receipt.map((s) => {
                  return {
                    id: s.id,
                    classify_id: s.classify_id,
                    level_classify_id: s.level_classify_id,
                    remarks: s.remarks,
                  };
                })
              ),
            };
          }
          this.$dialog
            .confirm({
              message: "是否同意审批",
            })
            .then(() => {
              this.onStatus(2, os);
            })
            .catch(() => {});
          break;
        case 2: // 撤销
          this.$dialog
            .confirm({
              message: "是否撤销审批",
            })
            .then(() => {
              this.onStatus(
                3,
                +this.id === 2
                  ? { receipt: JSON.stringify(this.ext.receipt) }
                  : {}
              );
            })
            .catch(() => {});
          break;
        case 3:
          this.show = true;
          break;
        default:
      }
    },
    toIcon(s, flag) {
      let n = isNaN(s) ? 0 : s < 0 ? 4 : ["", 0, 3, 2][+s];
      let icon = n >= 0 ? n + 9000 : "";
      if (flag) return icon;
      return icon ? this.$js.config.icon(icon, "index") : "";
    },
    toStatus(s) {
      return isNaN(s)
        ? s
        : s < 0
        ? "已拒绝"
        : ["", "待审核", "已通过", "已撤销"][+s];
    },
    onDetail(e, index) {
      let api = this.api + "Detail";
      let flag = !isNaN(e.have_seen);
      this.detailid = e.id;
      this.$api.http(api, { type: this.id + 1, a_id: e.id }, (res) => {
        this.ext = res;
        this.openDetail = true;
        if (flag) {
          this.$set(this.item[index], "have_seen", 1);
        }
      });
    },
    onActive(e) {
      let val = this.menu[e];
      if (this.id !== e) {
        this.appPath("/approval_my/" + e + "&max&" + this.child, true);
        this.id = e;
      }
      this.$api.http("approvalMyDot", { approval_type: this.id + 1 }, (res) => {
        this.dot = res;
      });
      // eslint-disable-next-line
      demo.title(
        this.$route.meta.title +
          "-" +
          (val.text === "借款" ? "费用" : val.text) +
          "详情"
      );
      this.onPage(1);
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      this.openFilter = false;
      if (page === 1) {
        this.item = [];
      }
      let status = this.search.status > 9 ? "" : this.search.status;
      this.$api.http(
        this.api,
        {
          page,
          limit: 20,
          type: this.id + 1,
          status,
          end_date: this.search.end_date,
          begin_date: this.search.begin_date,
        },
        (res) => {
          if (+page === 1) {
            this.item = [];
          }
          this.item = this.item.concat(res);
          this.$refs.page.onFinish(res.length < 20);
        }
      );
    },
    init() {
      // let time = Date.now();
      // eslint-disable-next-line
      // let data = demo.$session.get("index-dot", {});
      // if (data.time && data.time > time) {
      //   this.onDot(data.list);
      //   return 0;
      // }
      this.$api.http("approvalDot", {}, (res) => {
        let os = [res.attendance, res.cost, res.goods, res.receipt, res.use];
        // eslint-disable-next-line
        // demo.$session.set("index-dot", { time: time + 6e4, list: os });
        this.onDot(os);
      });
    },
    onDot(e) {
      // eslint-disable-next-line
      // let n = demo.siteConfig.hide.index.approval;
      this.$set(this.menu[0], "num", e[2]);
      this.$set(this.menu[1], "num", e[4]);
      this.$set(this.menu[2], "num", e[3]);
      this.$set(this.menu[3], "num", e[1]);
      this.$set(this.menu[4], "num", e[0]);
    },
  },
  mounted() {
    let bar = this.$js.def.index.approval;
    this.id = this.$route.params.id || "0";
    let did = this.$route.params.did || "";
    this.child = this.$route.params.child || "";
    // 若等于 max 显示 分页数据 反之显示 详情页
    this.detailid = did === "max" ? "" : did;
    this.menu = bar[1];
    if (this.active === "") {
      this.active = +this.id;
    }
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
.tab {
  z-index: 5;
  position: relative;
}
.list {
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 0 8px rgb(233, 233, 233);
  font-size: 15px;
  position: relative;
  .cover {
    position: absolute;
    right: 0;
    top: 0;
    width: 60px;
    height: 60px;
    opacity: 0.2;
  }
  .num {
    font-size: 12px;
    color: #ccc;
  }
  p {
    padding: 5px 0;
    color: #999;
    line-height: 1.2;
    b {
      font-weight: 650;
      color: #222;
    }
    .s9000 {
      color: #ffb408;
    }
    .s9002 {
      color: #666;
    }
    .s9003 {
      color: #99cc33;
    }
    .s9004 {
      color: tomato;
    }
  }
}
.van-radio {
  padding: 10px;
}
.btns {
  flex: 1;
  height: 50px;
}
</style>
