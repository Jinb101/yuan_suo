<template>
  <v-view header bgc="#f5f5f5">
    <template #menu>
      <span @click="onclickmenu">更换成{{ istitle }}订单</span>
    </template>
    <div class="app_top">
      <van-tabs
        v-model="statusid"
        @click="onclicktab"
        title-active-color="#38f"
      >
        <van-tab
          :title="x.s"
          :name="x.id"
          v-for="(x, y) in status"
          :key="y + 's'"
        ></van-tab>
      </van-tabs>
      <transition name="van-slide-right">
        <div class="search_top" v-if="isopen">
          <van-search
            v-model="val"
            placeholder="请输入搜索订单号"
            shape="round"
            show-action
            @search="onPage(1)"
          >
            <template #action>
              <span @click="isopen = false">关闭筛选</span>
            </template>
          </van-search>
          <van-cell title="下单日期" is-link @click="open1 = !open1"></van-cell>
        </div>
      </transition>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <div class="a10" v-else></div>
      <section v-for="(i, j) in item" :key="j" class="sec">
        <h6>
          {{ i.order_date }}<span>星期{{ i.week }}</span>
        </h6>
        <template v-if="i.order && i.order.length">
          <ul>
            <li
              v-for="(x, y) in i.order"
              :key="y + '-' + j"
              @click="ondetail(x)"
            >
              <p>
                订单号：<span>{{ x.order_no }}</span>
              </p>
              <p>
                下单时间：<span>{{ appTimeout(x.time) }}</span>
              </p>
              <p>
                下单人：<span @click.stop="ontel(x.contact_number)">
                  {{ x.contacts }}
                  <b class="col_primary">{{ x.contact_number }}</b>
                </span>
              </p>
              <p v-if="x.v2_merchant">
                供应商：<span>{{ x.v2_merchant.merchant_name }}</span>
              </p>
              <p>
                订单总价<b class="r">{{ +x.total_price }}元</b>
              </p>
            </li>
          </ul>
        </template>
      </section>
    </v-page>
    <template #fixed>
      <v-f v-model="open" text="订单详情" :footer="false">
        <div class="foodorder">
          <div class="box_line">
            <template v-if="goods.length">
              <div class="flex lis">
                <span>食材名称</span>
                <span>下单量</span>
                <span>确认量</span>
              </div>
              <ul>
                <li v-for="(x, y) in goods" :key="y + 'g'" class="flex">
                  <span>{{ x.goods_name }}</span>
                  <template v-if="+statusid === 1">
                    <div class="q">
                      <van-field
                        v-model="x.number"
                        type="digit"
                        readonly
                        input-align="center"
                      />
                    </div>
                    <div class="q qs">
                      <van-field
                        v-model="x.num"
                        type="digit"
                        placeholder="请输入"
                        :readonly="+x.status === 2"
                        input-align="center"
                      >
                        <template #button>
                          <b class="col_danger">{{
                            +x.status === 2 ? "缺货" : ""
                          }}</b>
                        </template>
                      </van-field>
                    </div>
                  </template>
                  <template v-else>
                    <span>{{ +x.number }}</span>
                    <span>{{ +x.number }}</span>
                  </template>
                </li>
              </ul>
            </template>
            <van-empty v-else description="暂无"></van-empty>
          </div>
          <div class="cont_view">
            <p>
              订单状态：{{
                ["提交", "已采购", "验收完成", "已评价"][+det.status]
              }}
            </p>
            <p>提交时间：{{ det.order_date }}</p>
            <p v-if="type > 1">配送时间：{{ det.delivery_specific_date }}</p>
            <p>联系人：{{ det.contacts }}</p>
            <p>
              联系人电话：<b
                class="col_primary"
                @click.stop="ontel(det.contact_number)"
                >{{ det.contact_number }}</b
              >
            </p>
            <p>配送地址：{{ det.delivery_address }}</p>
            <p>
              订单总额：<b class="col_danger">{{ allprice }}元</b>
            </p>
          </div>
          <div class="tips">
            <h6>提示/Tips</h6>
            <div class="tip_li" v-for="(q, w) in goods" :key="w + 'w'">
              <b class="name">{{ q.goods_name }}</b>
              所属分类为<span>{{ q.class_name }}</span
              >单价<span>{{ +q.price }}元/{{ q.unit }}</span>
              <van-tag
                type="danger"
                round
                text-color="#fff"
                v-if="q.status === 2"
                >缺货</van-tag
              >
              <p v-if="q.characteristic">
                特性：<span class="col_primary">{{ q.characteristic }}</span>
              </p>
            </div>
          </div>
        </div>
        <div class="w80" v-if="+statusid === 1">
          <van-button block round :color="$js.btnColor" @click="onsub"
            >提交</van-button
          >
        </div>
        <div class="h50"></div>
      </v-f>
      <transition name="van-slide-right">
        <div class="btn_event" v-if="!isopen" @click="isopen = true">筛选</div>
      </transition>
      <v-t v-model="a1" :open="open1" max="d_1"></v-t>
    </template>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
import vT from "../../private/time.vue";
export default {
  data() {
    return {
      params: {},
      type: "", // 幼儿 老师
      statusid: "", // 配送状态
      id: "", // 详情id
      val: "", // 搜索订单号
      time: "",
      status: ["待配送", "已配送", "已拒绝"].map((s, v) => {
        return { s, id: v + 1 + "" };
      }),
      item: [],
      open: false,
      det: {},
      goods: [],
      isopen: false,
      open1: false, // 控制时间
      a1: {},
    };
  },
  components: { vF, vT },
  inject: ["appPath", "appTimeout"],
  watch: {
    open(n) {
      if (!n) {
        this.onclicktab(false);
      }
    },
    a1: {
      handler(n) {
        if (n.ymd) {
          this.time = n.ymd.replace(/-/g, "/");
          this.onPage(1);
        }
      },
      deep: true,
    },
    isopen(n) {
      if (!n) {
        if (this.time !== "" || this.val !== "") {
          this.time = "";
          this.val = "";
          this.onPage(1);
        }
      }
    },
  },
  computed: {
    istitle() {
      return +this.type === 1 ? "老师" : "幼儿";
    },
    istitleid() {
      return +this.type === 1 ? "2" : "1";
    },
    allprice() {
      let tp = +this.statusid === 1;
      if (this.goods.length) {
        let a = this.goods.map((r) => {
          return (tp ? +r.num : +r.number) * +r.price;
        });
        // eslint-disable-next-line
        return demo.array(a).sum(0);
      }
      return 0;
    },
  },
  methods: {
    onclicktab(n) {
      this.appPath("/work_foodorder/" + this.type + "&" + this.statusid, true);
      this.id = "";
      this.val = "";
      if (!n) {
        return 0;
      }
      this.onPage(1);
    },
    onclickmenu() {
      this.appPath("/work_foodorder/" + this.istitleid, true);
      this.type = this.istitleid;
      this.statusid = "1";
      this.id = "";
      this.val = "";
      this.onPage(1);
    },
    ontel(tel) {
      // eslint-disable-next-line
      demo.siteConfig.tel(tel);
    },
    ondetail(e) {
      this.appPath(
        "/work_foodorder/" + this.type + "&" + this.statusid + "&" + e.id,
        true
      );
      this.id = e.id;
      this.open = true;
      this.$api.http("foodorderdet", { id: e.id }, (r) => {
        this.det = r;
        let tp = +this.statusid === 1;
        this.goods = (r.goods || []).map((s) => {
          if (tp) {
            s.num = +s.status === 2 ? 0 : s.number;
          }
          return s;
        });
      });
    },
    onsub() {
      let os = (this.goods || []).map((s) => {
        return { id: s.id, number: s.num ? s.num : s.number };
      });
      this.$api.http(
        "foodordersub",
        {
          id: this.det.id,
          total_amount: this.allprice,
          food_json: JSON.stringify(os),
        },
        () => {
          this.$toast("提交成功");
          this.open = false;
          this.$nextTick(() => {
            this.onPage(1);
          });
        }
      );
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "foodorder",
        {
          page,
          name: this.name,
          cookbook_type: this.type,
          status: this.statusid,
          dates: this.time,
          keywords: this.val,
        },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          this.item = this.item.concat(e);
          this.$refs.page.onFinish(e.length < 20);
        }
      );
    },
  },
  mounted() {
    this.params = this.$route.params;
    this.type = this.params.type || "1";
    this.statusid = this.params.status || "1";
    if (this.params.id) {
      this.ondetail(this.params);
    }
  },
};
</script>
<style lang="less">
.foodorder .qs .van-field__control {
  background-color: rgba(199, 199, 199, 0.1);
}
</style>
<style lang='less' scoped>
.sec {
  margin: 0 10px 10px;
  position: relative;
  box-sizing: border-box;
  border-radius: 30px 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  font-size: 15px;
  overflow: hidden;
  h6 {
    padding: 10px 18px 8px;
    font-weight: 650;
    position: relative;
    span {
      position: absolute;
      font-size: 12px;
      color: #ccc;
      right: 10px;
      top: 10px;
    }
  }
  li {
    padding: 15px;
    line-height: 1.2;
    & + li {
      margin-top: 5px;
    }
    background-color: rgba(248, 253, 202, 0.2);
    &:nth-child(2n) {
      background-color: rgba(218, 251, 255, 0.2);
    }
    p + p {
      margin-top: 5px;
    }
    p {
      position: relative;
      color: #999;
      font-size: 13px;
      vertical-align: middle;
      span {
        font-size: 15px;
        color: #333;
        font-weight: 500;
      }
      b {
        padding-left: 5px;
      }
    }
    .r {
      position: absolute;
      right: 0;
      bottom: 0;
      text-align: right;
      font-size: 18px;
      color: tomato;
      letter-spacing: 1px;
    }
  }
}
.a10 {
  height: 10px;
}
.cont_view {
  padding: 10px;
  font-size: 14px;
  p {
    line-height: 1.2;
    margin-bottom: 5px;
  }
}
.foodorder {
  .lis {
    text-align: center;
    padding: 10px 0;
    font-weight: 650;
    font-size: 14px;
    span {
      flex: 1;
    }
  }
  li {
    font-size: 15px;
    line-height: 24px;
    text-align: center;
    background-color: rgba(230, 250, 255, 0.5);
    &:nth-child(2n) {
      background-color: rgba(255, 252, 205, 0.5);
    }
    span,
    .q {
      flex: 1;
    }
    span:first-child {
      padding: 10px 0;
      & + span {
        padding: 10px 0;
        & + span {
          padding: 10px 0;
        }
      }
    }
    .van-cell {
      background: transparent !important;
    }
  }
  .tips {
    padding: 10px;
    font-size: 12px;
    color: #ccc;
    h6 {
      padding: 5px 0;
    }
    .tip_li {
      padding: 2px 0;
      line-height: 17px;
      letter-spacing: 1px;
      .name {
        font-weight: 650;
        font-size: 15px;
        color: rgb(189, 189, 189);
      }
      span {
        padding: 0 2px;
        color: rgb(189, 189, 189);
      }
    }
  }
}
.btn_event {
  position: fixed;
  right: 10px;
  bottom: 10px;
  font-size: 13px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.2);
  color: #fff;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
.h50 {
  height: 120px;
}
</style>
