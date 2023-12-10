<template>
  <v-view header cover @on-dot="ondot">
    <div class="app_top">
      <v-s v-model="name" @search="onPage(1)"></v-s>
    </div>
    <div class="tab">
      <van-tabs v-model="type" title-active-color="#38f" @click="onPage(1)">
        <van-tab title="待出库" name="1" :dot="dot > 0"></van-tab>
        <van-tab title="待还库" name="2"></van-tab>
        <van-tab title="已还库" name="3"></van-tab>
        <van-tab title="无需还库" name="4"></van-tab>
      </van-tabs>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section
        v-for="(i, j) in item"
        :key="j"
        class="van-hairline--bottom"
        @click="onDetail(i, j)"
      >
        <h6 class="name">{{ i.name }}</h6>
        <div class="text flex fw">
          <span>数量：{{ i.num }}{{ i.unit_name }}</span>
          <span>单价：{{ i.price }}元</span>
          <span>总价：{{ i.amount }}元</span>
          <span>分类：{{ i.category_name }}</span>
          <span>申请人：{{ i.staff_name }}</span>
          <span>申请部门：{{ i.group_name }}</span>
        </div>
        <p class="time">审批时间：{{ appTimeout(i.apply_time, true) }}</p>
      </section>
    </v-page>
    <template #fixed>
      <v-f :footer="false" v-model="open" :text="det.name">
        <van-cell title="状态" :value="status"></van-cell>
        <van-cell
          title="审批时间"
          :value="appTimeout(det.apply_time, true)"
        ></van-cell>
        <van-cell title="分类" :value="det.category_name"></van-cell>
        <van-cell title="名字" :value="det.name"></van-cell>
        <van-cell title="数量" :value="det.num"></van-cell>
        <van-cell title="单位" :value="det.unit_name"></van-cell>
        <van-cell title="单价" :value="det.price + '元'"></van-cell>
        <van-cell title="总价" :value="det.amount + '元'"></van-cell>
        <van-cell title="申请人" :value="det.staff_name"></van-cell>
        <van-cell title="申请部门" :value="det.group_name"></van-cell>
        <van-cell
          title="联系方式"
          :value="det.contact"
          label="点击可联系申请人"
          is-link
          @click="onTel"
        ></van-cell>
        <template v-if="type === '1'">
          <div class="w80 flex">
            <van-button block round :color="$js.btnColor" @click="onEnter"
              >确认领用</van-button
            >
          </div>
        </template>
        <template v-else-if="type === '2'">
          <div class="w80 flex">
            <van-button block round :color="$js.btnColor" @click="onRet"
              >归还</van-button
            >
            <van-button block round type="info" @click="onUnret"
              >无需还库</van-button
            >
          </div>
        </template>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vS from "../../private/search.vue";
import vF from "../../private/fixed.vue";
export default {
  data() {
    return {
      item: [],
      type: "1",
      name: "",
      open: false,
      det: {},
      price: "",
      amount: "",
      dot: 0,
      isevent: false,
    };
  },
  components: { vS, vF },
  inject: ["appTimeout", "appPath"],
  computed: {
    status() {
      return ["", "待出库", "待还库", "已还库", "无需还库"][+this.type];
    },
  },
  watch: {
    amount(n) {
      try {
        let p = (n / this.det.num).toFixed(2) * 1;
        this.price = p;
      } catch (e) {}
    },
    type(n) {
      if (n > 0) {
        this.appPath("/work_receive/" + n, true);
      } else {
        this.appPath("/work_receive", true);
      }
    },
  },
  methods: {
    ondot(e) {
      this.dot = e.receive;
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "receive",
        { page, name: this.name, type: this.type },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          this.item = this.item.concat(e);
          this.$refs.page.onFinish(e.length < 20);
        }
      );
    },
    onDetail(i, j) {
      this.det = { ...i, $index: j };
      this.open = true;
      this.price = +i.price;
      this.amount = +i.amount;
    },
    onUnret() {
      this.$js.model(
        "提示",
        "是否操作" + this.det.name + "设置为无需归还？",
        (r) => {
          if (r) {
            let receive_id = this.det.receive_id;
            this.$api.http("receiveunret", { receive_id }, () => {
              this.$toast("设置成功");
              this.open = false;
              this.item = this.item.filter((r) => {
                return r.receive_id !== receive_id;
              });
            });
          }
        }
      );
    },
    onRet() {
      this.$js.model("归还提示", "是否归还" + this.det.name + "？", (r) => {
        if (r) {
          let receive_id = this.det.receive_id;
          this.$api.http("receiveret", { receive_id }, () => {
            this.$toast("归还成功");
            this.open = false;
            this.item = this.item.filter((r) => {
              return r.receive_id !== receive_id;
            });
          });
        }
      });
    },
    onEnter() {
      this.$js.model("领用确认", "是否领用," + this.det.name, (r) => {
        if (r) {
          let receive_id = this.det.receive_id;
          this.$api.http("receivesub", { receive_id }, () => {
            this.$toast("领用成功");
            this.dot -= 1;
            this.open = false;
            this.isevent = true;
            this.item = this.item.filter((r) => {
              return r.receive_id !== receive_id;
            });
          });
        }
      });
    },
    onTel() {
      // eslint-disable-next-line
      demo.siteConfig.tel(this.det.contact);
    },
  },
  mounted() {
    this.type = this.$route.params.type || "1";
  },
  destroyed() {
    if (this.isevent) {
      // eslint-disable-next-line
      demo.$session.clear("worknum");
    }
  },
};
</script>
<style lang='less' scoped>
section {
  padding: 15px;
  font-size: 15px;
  background-color: #fff;
  margin: 10px 5px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  .name {
    font-weight: 650;
    margin-bottom: 10px;
  }
  .text {
    color: #666;
    span {
      width: 33%;
      font-size: 13px;
      padding: 5px 1px;
      box-sizing: border-box;
      &:nth-child(3n) {
        text-align: right;
      }
    }
  }
  .time {
    color: #666;
    font-size: 13px;
    padding: 5px 1px;
  }
}
.edit {
  padding: 10px;
  background-color: rgba(172, 172, 172, 0.1);
}
.msg {
  text-align: center;
  font-size: 12px;
  padding: 30px 0;
  color: #ccc;
}
</style>
