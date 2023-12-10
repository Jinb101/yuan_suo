<template>
  <v-view header bgc="#f8f7fa">
    <template #menu>
      <span class="col_green" @click="open = true">添加设备</span>
    </template>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section v-for="(i, j) in item" :key="j + '-s'">
        <div class="h flex">
          <div class="logo">
            <van-icon name="graphic" />
          </div>
          <div class="text">
            <h6>{{ i.device_serial }}</h6>
            <p>{{ totype(i, "a2") }}</p>
          </div>
          <div class="btn">
            <van-button
              round
              plain
              type="info"
              block
              size="small"
              @click="ondet(i)"
              >设备管理</van-button
            >
          </div>
        </div>
        <ul class="v flex van-hairline--top">
          <li>
            <p>{{ i.title }}</p>
            <b>设备名称</b>
          </li>
          <li>
            <p>{{ totype(i, "a1") }}</p>
            <b>设备状态</b>
          </li>
          <li>
            <p>{{ totype(i, "a3") }}</p>
            <b>设备功能</b>
          </li>
        </ul>
      </section>
    </v-page>
    <template #fixed>
      <v-f v-model="open" text="添加设备" :footer="false">
        <v-a @end="onPage(1)"></v-a>
      </v-f>
      <v-f v-model="open1" :text="ext.title" :footer="false">
        <v-d
          v-model="ext"
          @end="onPage(1)"
          @change="ondetchange"
          @close="open1 = false"
        ></v-d>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
import vA from "./_device_add.vue";
import vD from "./_device_detail.vue";
export default {
  data() {
    return {
      item: [],
      open: false,
      ext: {},
      open1: false,
      detchange: "",
    };
  },
  watch: {
    open1(n) {
      if (!n) {
        this.ext = {};
        this.detchange = "";
      }
    },
  },
  components: { vF, vA, vD },
  methods: {
    ondetchange(e) {
      this.detchange = e;
    },
    ondet(e) {
      this.ext = e;
      this.open1 = true;
    },
    totype(data, type) {
      let a = "";
      switch (type) {
        case "a1":
          a = ["离线", "在线"][data.status];
          break;
        case "a2":
          a = ["", "签到帮手", "超声波体检机"][data.equipment_type];
          break;
        case "a3":
          a = ["人脸识别", "人脸识别/身高体重"][data.start_type];
          break;
        default:
      }
      return a || "/";
    },
    onPage(page, f) {
      this.open = false;
      if (!f) {
        return this.$refs.page && this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("device", { page }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
        if (this.detchange && this.open1) {
          let id = this.detchange;
          let v = this.item.map((s) => {
            return +s.id === +id;
          });
          v = v.indexOf(true);
          if (v >= 0) {
            this.ondet(this.item[v]);
          }
        }
      });
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
section {
  background-color: #fff;
  box-sizing: border-box;
  margin: 10px;
  border-radius: 10px;
  font-size: 15px;
  box-shadow: 0 0 5px #e2e2e2;
  margin-bottom: 15px;
  .h,
  .v {
    box-sizing: border-box;
    padding: 12px;
    position: relative;
  }
  .h {
    align-items: center;
  }
  .logo {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
    background-color: #dcebff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    color: #fff;
  }
  .text {
    width: calc(100% - 40px);
  }
  h6,
  li > p {
    font-weight: 650;
    padding: 5px 0;
  }
  .text p,
  li > b {
    color: #999;
    font-size: 14px;
  }
  li {
    width: 33.33%;
    &:nth-child(2) {
      text-align: center;
    }
    &:last-child {
      text-align: right;
    }
  }
  .btn {
    position: absolute;
    right: 0;
    top: 5px;
    padding: 12px;
    width: 80px;
  }
}
</style>
