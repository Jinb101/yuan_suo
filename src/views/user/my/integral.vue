<template>
  <v-view header @on-user="onuser" cover ref="vview">
    <div class="box menu_box">
      {{ num }}
      <p class="desc">可使用积分</p>
    </div>
    <div class="menu_box">
      <v-m v-model="menu" @change="onchange" :column="3"></v-m>
    </div>
    <template #fixed>
      <v-f v-model="open1" :footer="false" text="积分记录" viewbgc="#f8f7fa">
        <v-a1></v-a1>
      </v-f>
      <v-f
        v-model="open2"
        :footer="false"
        text="积分提现"
        cover
        viewbgc="#f8f7fa"
      >
        <v-a2
          v-model="num"
          :openid="user.pay_openid"
          @end="open2 = false"
        ></v-a2>
      </v-f>
      <v-f
        v-model="open3"
        :footer="false"
        text="积分提现记录"
        viewbgc="#f8f7fa"
      >
        <v-a3></v-a3
      ></v-f>
    </template>
  </v-view>
</template>

<script>
import vM from "../../private/menu.vue";
import vF from "../../private/fixed.vue";
import vA1 from "./_integral_jf.vue";
import vA2 from "./_integral_tx.vue";
import vA3 from "./_integral_txjl.vue";
export default {
  data() {
    return {
      user: {},
      menu: [],
      open1: false, // 积分记录
      open2: false, // 积分提现
      open3: false, // 积分提现记录
      num: 0,
    };
  },
  computed: {
    grade() {
      return +this.user.integral || 0;
    },
  },
  watch: {
    open2(n) {
      if (!n) {
        this.$refs.vview.ongettouser(3e5);
      }
    },
  },
  components: { vM, vF, vA1, vA2, vA3 },
  methods: {
    onchange(e) {
      let type = e.path.replace("/to:", "");
      switch (type) {
        case "in":
          this.open1 = true;
          break;
        case "tx":
          if (this.num > 0) {
            this.open2 = true;
          } else {
            this.$toast("积分不足，无法提现");
          }
          break;
        case "jl":
          this.open3 = true;
          break;
        default:
      }
    },
    onuser(e) {
      this.user = e;
      this.$nextTick(() => {
        this.num = this.grade;
      });
    },
  },
  mounted() {
    this.menu = this.$js.def.works.integral;
  },
  destroyed() {
    // eslint-disable-next-line
    demo.$session.clear("user");
  },
};
</script>
<style lang='less' scoped>
.box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  font-size: 35px;
  font-weight: 650;
  .desc {
    font-weight: 400;
    font-size: 12px;
    color: #999;
    margin-top: 5px;
    transform: scale(0.8);
  }
}
.menu_box {
  padding: 10px;
  margin: 20px auto;
  width: 90%;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 0 8px #f0f0f0;
  box-sizing: border-box;
}
</style>
