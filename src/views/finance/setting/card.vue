<template>
  <v-finance>
    <template #menu>
      <span @click="add">添加账户</span>
    </template>
    <van-empty v-if="!item.length"></van-empty>
    <section
      v-for="(i, j) in item"
      :key="j"
      @click="eventChange({ ext: i, index: j, type: 'card' })"
    >
      <div class="icon">
        <van-icon name="card" />
      </div>
      <div class="tags">
        <v-more
          v-model="i.$open"
          :item="onTag(i, j)"
          @change="eventChange"
        ></v-more>
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
    </section>
    <div class="add">
      <van-button block type="primary" plain @click="add">添加账户</van-button>
    </div>
    <template #fixed>
      <v-f v-model="open" :footer="false">
        <template v-if="!ext.$add">
          <div class="vw">
            <p>余额：{{ ext.balance }}</p>
            <p>总收入：{{ ext.total_revenue }}</p>
            <p>总支出：{{ ext.total_expenditure }}</p>
            <p>初始余额：{{ ext.initial_balance }}</p>
          </div>
        </template>
        <template>
          <van-field
            v-model="ext.account_title"
            label="账户名称"
            label-width="5em"
            placeholder="请输入账户名称"
            maxlength="25"
          />
          <van-field
            v-model="ext.account_number"
            label="账号"
            label-width="5em"
            placeholder="请输入账号"
            maxlength="60"
          />
          <van-field
            v-model="ext.opening_bank"
            label="开户银行"
            label-width="5em"
            placeholder="请输入开户银行"
            maxlength="25"
          />
          <van-field
            v-model="ext.initial_balance"
            label="初始余额"
            label-width="5em"
            placeholder="请输入初始余额"
            type="number"
          />
          <van-field label="类型" readonly>
            <template #button>
              <van-radio-group
                v-model="ext.account_type"
                direction="horizontal"
              >
                <van-radio name="1">公户</van-radio>
                <van-radio name="2">私户</van-radio>
              </van-radio-group>
            </template>
          </van-field>
        </template>
        <div class="btn">
          <van-button block round type="info" @click="onEditCard">{{
            ext.$add ? "添加" : "编辑"
          }}</van-button>
        </div>
      </v-f>
    </template>
  </v-finance>
</template>

<script>
import vF from "../../private/fixed.vue";
export default {
  data() {
    return {
      item: [],
      open: false,
      ext: {},
    };
  },
  components: { vF },
  methods: {
    add() {
      this.eventChange({ type: "card", ext: { $add: true }, index: -1 });
    },
    onTag(e, index) {
      // eslint-disable-next-line
      return demo.siteConfig.text.tag([11, 12], { index, ext: e });
    },
    eventChange(e) {
      switch (e.type) {
        case "crosscard":
          this.$js.model("解绑提示", "是否解除绑定", (r) => {
            if (r) {
              this.$api.http(
                "financeaccountdel",
                { account_id: e.ext.account_id },
                () => {
                  this.$toast("解除成功");
                  this.item.splice(e.index, 1);
                }
              );
            }
          });
          break;
        default:
          this.open = true;
          this.ext = { ...e.ext, $index: e.index };
      }
    },
    onEditCard() {
      let api = this.ext.$add ? "financeaccountadd" : "financeaccountedit";
      this.$api.http(api, this.ext, () => {
        this.$toast((this.ext.$add ? "添加" : "编辑") + "成功");
        this.open = false;
        this.$nextTick(() => {
          this.ext = {};
        });
        this.init();
      });
    },
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
        this.item = r.map((s) => {
          s.$open = false;
          return s;
        });
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
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
}
.add {
  padding: 10px;
  position: sticky;
  bottom: 0;
  z-index: 55;
  background-color: #fff;
}
.vw {
  margin: 10px;
  font-size: 15px;
  p {
    padding: 5px 0;
  }
}
.btn {
  padding: 20px 15%;
}
</style>
