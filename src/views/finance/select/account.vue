<template>
  <v-finance>
    <div class="top" v-if="!sort">
      <p class="p">总余额：{{ toAllPrice }}</p>
      <div class="p flex">
        <p>总收入：{{ toAllGet }}</p>
        <p>总支出：{{ toAllSet }}</p>
      </div>
    </div>
    <template v-if="$slots.default">
      <slot />
    </template>
    <van-empty v-if="!item.length"></van-empty>
    <section v-for="(i, j) in item" :key="j">
      <div class="icon">
        <van-icon name="card" />
      </div>
      <h2>
        {{ i.opening_bank }}
        <span class="tag">{{ +i.account_type === 2 ? "私" : "公" }}户</span>
      </h2>
      <p>{{ i.account_title }}</p>
      <div class="num">
        <span v-for="(x, y) in toCard(i.account_number)" :key="y + 'c' + j">
          {{ x }}
        </span>
      </div>
      <div class="nums">
        <p class="p">初始余额：{{ i.initial_balance }}</p>
        <p class="p">账户余额：{{ i.balance }}</p>
        <div class="p flex">
          <p>总收入：{{ i.total_revenue }}</p>
          <p>总支出：{{ i.total_expenditure }}</p>
        </div>
      </div>
    </section>
  </v-finance>
</template>

<script>
export default {
  props: {
    sort: Boolean,
  },
  data() {
    return {
      item: [],
    };
  },
  computed: {
    toAllPrice() {
      let e = this.item.map((s) => +s.balance);
      // eslint-disable-next-line
      return e.length ? demo.array(e).sum(0) : 0;
    },
    toAllGet() {
      let e = this.item.map((s) => +s.total_revenue);
      // eslint-disable-next-line
      return e.length ? demo.array(e).sum(0) : 0;
    },
    toAllSet() {
      let e = this.item.map((s) => +s.total_expenditure);
      // eslint-disable-next-line
      return e.length ? demo.array(e).sum(0) : 0;
    },
  },
  methods: {
    toCard(n) {
      let arr = n.split("");
      // eslint-disable-next-line
      let v = demo.array(arr).chunk(4);
      v = v.map((s) => {
        return s.join("");
      });
      if (v.length > 3) {
        v = v.map((s, y) => {
          if (y > 0 && y < v.length - 1) {
            return "****";
          }
          return s;
        });
      }
      return v;
    },
    init() {
      this.$api.http("financeaccount", {}, (r) => {
        this.item = r;
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.top {
  position: sticky;
  top: 0;
  z-index: 50;
  margin: 10px;
  border-radius: 5px 15px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  line-height: 1.2;
  font-size: 15px;
  font-weight: 650;
}
section {
  margin: 10px;
  box-sizing: border-box;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: linear-gradient(45deg, #19cb91, #0c8163);
  border-radius: 5px;
  position: relative;
  color: #fff;
  // height: 100px;
  padding: 10px;
  font-size: 15px;
  .icon {
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
  }
  .tags {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  h2 {
    padding-top: 8px;
    padding-left: 60px;
    font-weight: 650;
    font-size: 16px;
    span {
      font-weight: 400;
      font-size: 12px;
      margin-left: 8px;
      padding: 4px 8px;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 50% 0;
      transform: translateY(-2px);
      box-sizing: border-box;
      display: inline-block;
    }
    & + p {
      padding-left: 60px;
      // color: #999;
    }
  }
  .num {
    padding: 30px 0;
    text-align: center;
    font-size: 20px;
    span {
      padding: 0 8px;
    }
  }
  .nums {
    line-height: 1.2;
  }
}
.p > p {
  flex: 1;
}
.p + .p {
  margin-top: 5px;
}
</style>
