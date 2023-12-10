<template>
  <div class="a_my">
    <x-content></x-content>
    <x-content>
      <div class="no flex">
        <p class="num">审批单号：{{ ext.approval_number }}</p>
        <p class="time">{{ ext.apply_time }}</p>
      </div>
    </x-content>
    <x-content class="list">
      <p>
        审批状态：<b :class="'c_' + (ext.status > 0 ? ext.status : '0')">
          {{
            isNaN(ext.status)
              ? ext.status
              : ["", "待审核", "已通过", "已撤销"][ext.status] || "已拒绝"
          }}
        </b>
      </p>
      <p v-if="ext.reasons_refusal">拒绝原因：{{ ext.reasons_refusal }}</p>
    </x-content>
    <x-content class="list">
      <p>
        采购物品 共{{ ext.goods.length }}种，共花费
        <b class="col_danger">{{ allPrice }} </b>元
      </p>
    </x-content>
    <x-content class="list">
      <h6>物品明细</h6>
      <div class="list_box goods">
        <section
          v-for="(i, j) in ext.goods"
          :key="j + 'g'"
          class="van-hairline--bottom"
        >
          <div class="logo" @click="appShowImage(i.img)">
            <van-image :src="i.img" fit="cover"></van-image>
          </div>
          <div class="font">
            <template v-if="isedit">
              <van-field
                label="分类"
                placeholder="请选择分类"
                label-width="3em"
                readonly
                v-model="i.category_name"
                right-icon="arrow"
                @click="onShowSelect(i, 'category_name', j)"
              />
              <van-field
                label="明细"
                placeholder="请选择明细"
                label-width="3em"
                readonly
                v-model="i.goods_name"
                right-icon="arrow"
                @click="onShowSelect(i, 'goods_name', j)"
              />
              <van-field
                label="数量"
                placeholder="请输入数量"
                label-width="3em"
                v-model="i.num"
              >
                <template #button>
                  <span class="unit">{{ i.unit_name }}</span>
                </template>
              </van-field>
              <van-field
                label="单价"
                placeholder="请输入单价"
                label-width="3em"
                v-model="i.price"
              />
            </template>
            <template v-else>
              <p class="type">
                <van-tag type="success">分类</van-tag>{{ i.category_name }}
              </p>
              <p>{{ i.goods_name }} x {{ i.num }}{{ i.unit_name }}</p>
              <p class="price">
                <span class="p">单价：{{ i.price }}</span>
                ￥<b class="col_danger">{{ i.price * i.num }}</b>
              </p>
            </template>
          </div>
        </section>
      </div>
    </x-content>
    <x-content class="list">
      <h6>详细信息</h6>
      <div class="list_box other">
        <template v-if="+child !== 1">
          <p>
            申请部门:<b>{{ ext.apply_group }}</b>
          </p>
          <p>
            申请人:<b>{{ ext.apply_name }}</b>
          </p>
          <p>
            联系电话:<b
              ><a :href="'tel:' + ext.apply_contact">{{
                ext.apply_contact
              }}</a></b
            >
          </p>
        </template>
        <template v-else-if="+child === 1">
          <p>
            审批部门：<b>{{ ext.approval_group }}</b>
          </p>
          <p>
            审批人：<b>{{ ext.approval_name }}</b>
          </p>
          <p>
            联系电话:<b
              ><a :href="'tel:' + ext.approval_contact">{{
                ext.approval_contact
              }}</a></b
            >
          </p>
        </template>
        <p>
          申请时间:<b>{{ ext.apply_time }}</b>
        </p>
        <p>
          知会人:
          <b v-if="ext.inform && ext.inform.length">
            <van-tag
              plain
              type="primary"
              v-for="(i, j) in ext.inform"
              :key="j + 'e'"
            >
              <a :href="'tel:' + i.inform_contact">
                {{ i.inform_name }}-{{ i.inform_contact }}
              </a>
            </van-tag>
          </b>
          <b v-else>无</b>
        </p>
      </div>
    </x-content>
    <x-content class="list">
      <h6>银行信息</h6>
      <div class="list_box other">
        <p>
          开户银行:<b>{{ ext.account_name || "未填写" }}</b>
        </p>
        <p>
          银行账号:<b>{{ ext.bank_no || "未填写" }}</b>
        </p>
        <p>
          开户姓名:<b>{{ ext.bank_name || "未填写" }}</b>
        </p>
      </div>
    </x-content>
    <x-content class="list">
      <h6>审批说明</h6>
      <div class="list_box explain">
        <p v-html="content"></p>
        <div class="image flex fw" v-if="ext.imgs && ext.imgs.length">
          <div
            class="images"
            v-for="(i, j) in ext.imgs"
            :key="j + 'ex'"
            @click="appShowImage(ext.imgs, j)"
          >
            <van-image :src="i" fit="cover"></van-image>
          </div>
        </div>
      </div>
    </x-content>
    <x-content class="list">
      <h6>审批进度</h6>
      <div class="list_box explain">
        <schedule
          :schedule="ext.schedule"
          v-model="isFoot"
          :check="+child === 1"
          @checksub="checksub"
        ></schedule>
      </div>
    </x-content>
    <x-content v-if="isFoot || +child === 1">
      <div class="is_height"></div>
      <div class="cover_footer">
        <template v-if="+child === 0 && +ext.status === 1">
          <slot />
        </template>
        <template v-if="+child === 1 && +ext.status === 1">
          <slot name="footer" />
        </template>
      </div>
    </x-content>
    <x-content></x-content>
    <v-s v-model="b2" :open="open" :list="a1" :keys="k1"></v-s>
    <v-s v-model="b3" :open="open1" :list="a2" :keys="k2"></v-s>
  </div>
</template>

<script>
import schedule from "./schedule.vue";
import vS from "../../../private/select.vue";
export default {
  props: {
    child: [String, Number],
    value: null,
  },
  inject: ["appShowImage"],
  computed: {
    content() {
      let ext = this.ext;
      let v = ext.content
        ? ext.content
        : ext.imgs && ext.imgs.length
        ? ""
        : "无";
      return this.$js.strToHtml(v);
    },
    allPrice() {
      let a = this.ext.goods.map((s) => +s.price * s.num);
      // eslint-disable-next-line
      return demo.array(a).sum(0);
    },
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
    isedit() {
      let a = this.ext.schedule;
      a = a[a.length - 1] || {};
      return +this.mid === +a.id && +this.ext.status === 1;
    },
  },
  watch: {
    ext: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
    b2: {
      handler(n) {
        if (this.$index >= 0) {
          this.$set(this.ext.goods[this.$index], "category_name", n.name);
          this.$set(this.ext.goods[this.$index], "s_id", n.id);
          this.$set(this.ext.goods[this.$index], "goods_name", "");
          this.$set(this.ext.goods[this.$index], "c_id", "");
          this.$set(this.ext.goods[this.$index], "img", "");
          this.$set(this.ext.goods[this.$index], "unit_name", "");
          this.onGetIfys(n.id);
        }
      },
      deep: true,
    },
    b3: {
      handler(n) {
        if (this.$index >= 0) {
          this.$set(this.ext.goods[this.$index], "unit_name", n.unit_name);
          this.$set(this.ext.goods[this.$index], "goods_name", n.name);
          this.$set(this.ext.goods[this.$index], "c_id", n.id);
          this.$set(this.ext.goods[this.$index], "img", n.img);
        }
      },
      deep: true,
    },
  },
  components: { schedule, vS },
  data() {
    return {
      isFoot: false,
      mid: "",
      open: false,
      open1: false,
      a1: [],
      a2: [],
      b1: {},
      b2: {},
      b3: {},
      k1: 0,
      k2: 0,
      $index: 0,
    };
  },
  methods: {
    checksub(e) {
      this.$emit("changesub", { ...e, approval_id: this.ext.id });
    },
    onShowSelect(e, name, index) {
      this.$index = index;
      this.b1 = e;
      if (name === "category_name") {
        this.open = !this.open;
        let v = this.a1.map((s, v) => {
          return s.id === e.s_id ? v : "";
        });
        v = v.filter((r) => {
          return r !== "";
        })[0];
        this.k1 = v;
        if (e.c_id) {
          this.onGetIfys(e.c_id);
        }
      } else {
        let val = this.a2.filter((r) => {
          return r.id === e.id;
        });
        if (val.length) {
          this.open1 = !this.open1;
          let v = this.a2.map((s, v) => {
            return s.id === e.c_id ? v : "";
          });
          v = v.filter((r) => {
            return r !== "";
          })[0];
          this.k2 = v;
          return 0;
        }
        this.onGetIfys(e.c_id, () => {
          this.open1 = !this.open1;
          let v = this.a2.map((s, v) => {
            return s.id === e.c_id ? v : "";
          });
          v = v.filter((r) => {
            return r !== "";
          })[0];
          this.k2 = v;
        });
      }
    },
    onGetIfy() {
      this.$api.http("getGoodsIfy", { approval_type: 1 }, (r) => {
        this.a1 = r;
      });
    },
    onGetIfys(c_id, fn) {
      if (this.a2.length) {
        let v = this.a2.filter((r) => {
          return c_id === r.c_id;
        });
        if (v.length > 0) {
          if (fn) {
            fn();
          }
          return 0;
        }
      }
      if (c_id === "") {
        if (fn) {
          fn();
        }
        return 0;
      }
      this.$api.http("getGoods", { c_id, is_group: 0 }, (r) => {
        this.a2 = r;
        if (fn) {
          fn();
        }
      });
    },
  },
  mounted() {
    // eslint-disable-next-line
    let user = demo.$session.get("user", {});
    this.mid = user.s_id;
    this.ext = this.value;
    if (this.isedit) {
      this.onGetIfy();
    }
  },
};
</script>
<style lang='less' scoped>
.c_1 {
  color: #ffb408 !important;
}
.c_2 {
  color: #99cc33 !important;
}
.c_0 {
  color: #ff0000 !important;
}
.c_3 {
  color: #666666 !important;
}
.list {
  padding: 10px;
  border-radius: 10px;
  background-color: #fff;
  box-sizing: border-box;
  box-shadow: 0 5px 5px rgb(243, 243, 243);
  font-size: 15px;
  color: #333;
  h6 {
    padding: 5px 0 10px;
    font-weight: 650;
    color: #999;
  }
  & > p + p {
    margin-top: 8px;
  }
}
.no {
  font-size: 12px;
  .time {
    flex: 1;
    text-align: right;
  }
}
.goods {
  section {
    box-sizing: border-box;
    padding: 8px 0;
    display: flex;
    .logo {
      height: 80px;
      width: 80px;
      border-radius: 5px;
      overflow: hidden;
    }
    .font {
      width: calc(100% - 80px);
      box-sizing: border-box;
      padding: 8px 0 0 10px;
      p {
        font-size: 14px;
        line-height: 16px;
        height: 16px;
        & + p {
          margin-top: 8px;
        }
      }
      .van-tag {
        vertical-align: middle;
        margin-right: 2px;
      }
      .price {
        text-align: right;
        height: 16px;
        position: relative;
        b {
          font-weight: 650;
          font-size: 16px;
        }
        span {
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
  }
}
.other {
  font-size: 14px;
  p {
    padding: 5px 0;
    color: #999;
    b {
      color: #333;
      font-weight: 650;
      padding-left: 5px;
    }
  }
  .van-tag {
    margin: 0 5px 5px 0;
  }
}
a {
  color: inherit;
}
.explain {
  font-size: 14px;
  p {
    color: #333;
    line-height: 1.2;
  }
  .image {
    padding-top: 8px;
    .images {
      width: 80px;
      height: 80px;
      margin: 0 5px 10px 0;
      &:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
}
.is_height {
  height: 50px;
}
.cover_footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  z-index: 600;
  display: flex;
}
</style>
