<template>
  <div class="chant_example_list">
    <div class="app_top">
      <v-s v-model="title" @search="onPage(1)" unauto></v-s>
      <van-tabs v-model="status" @click="onPage(1)">
        <van-tab title="全部" name="99"></van-tab>
        <van-tab title="待支付" name="0"></van-tab>
        <van-tab title="已支付" name="1"></van-tab>
      </van-tabs>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <ul>
        <li v-for="(i, j) in item" :key="j" class="flex">
          <div class="logo">
            <van-image :src="i.cover" fit="cover"></van-image>
          </div>
          <div class="text">
            <h2>{{ i.title }}</h2>
            <p class="no">订单号：{{ i.order_sn }}</p>
            <p>
              价格：￥<b class="col_danger">{{ i.price }}</b>
            </p>
            <div class="btn" v-if="+i.status === 0">
              <van-button
                round
                type="info"
                size="small"
                plain
                @click.stop="onpay(i)"
                >去付款</van-button
              >
            </div>
          </div>
        </li>
      </ul>
    </v-page>
  </div>
</template>

<script>
import vS from "../../../private/search.vue";
import vA from "../../../private/avatar.vue";
export default {
  data() {
    return {
      item: [],
      status: "",
      title: "",
    };
  },
  components: { vS, vA },
  methods: {
    onpay(e) {
      let os = this.$js.wxshareh5(
        "chantpay",
        {
          checkcode: true,
          pay: true,
          // eslint-disable-next-line
          token: demo.$local.get("token"),
          id: e.presentation_id,
          path: this.$route.path,
          price: e.price,
        },
        "",
        true
      );
      if (this.$js.env) {
        console.log(os);
        return 0;
      }
      window.location.replace(os);
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page && this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "chantvideomy",
        {
          page,
          status: +this.status === 99 ? "" : this.status,
          title: this.title,
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
  mounted() {},
};
</script>
<style lang='less' scoped>
li {
  background-color: #fff;
  padding: 10px;
  box-sizing: border-box;
  position: relative;
  margin-bottom: 10px;
  font-size: 14px;
  .logo {
    width: 100px;
    height: 100px;
    margin-right: 10px;
  }
  .text {
    width: calc(100% - 110px);
    h2 {
      padding: 10px 0;
      font-weight: 650;
      font-size: 16px;
    }
    p {
      color: #999;
      line-height: 1.3;
      b {
        font-weight: 650;
      }
    }
    .btn {
      text-align: right;
      box-sizing: border-box;
      padding: 5px 10px 0;
      .van-button {
        min-width: 100px;
      }
    }
  }
}
</style>
