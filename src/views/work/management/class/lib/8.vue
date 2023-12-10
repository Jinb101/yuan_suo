<template>
  <div class="class_8">
    <van-empty v-if="!item.length" description="暂无欠费记录"></van-empty>
    <section v-for="(i, j) in item" :key="j">
      <p>费用项目：{{ i.name }}</p>
      <p>付费金额：{{ i.amount }}元</p>
      <p v-if="i.expire_date">到期时间：{{ i.expire_date }}</p>
      <p>
        欠费天数：<b class="col_danger">{{ i.numberOfDays }}天</b>
      </p>
      <p>欠费基准费用：{{ i.penalty }}元/天</p>
      <div class="tool flex">
        <van-button
          size="small"
          round
          plain
          type="primary"
          @click="ongetsmoney(i, j)"
          >收款</van-button
        >
        <van-button size="small" round plain type="info" @click.stop="onsets(i)"
          >催款</van-button
        >
      </div>
    </section>
    <v-f v-model="open" :footer="false" text="收款确认">
      <van-cell
        title="应付金额"
        :value="+det.amount + '元'"
        :label="det.name"
      ></van-cell>
      <van-field v-model="number" type="number" label="收款金额" required>
        <template #button> 元 </template>
      </van-field>
      <van-field
        v-model="time"
        label="到期时间"
        required
        readonly
        @click="open1 = !open1"
        right-icon="arrow"
        input-align="right"
        placeholder="请选择到期时间"
      />
      <div class="w80">
        <van-button block round :color="$js.btnColor" @click="ongets"
          >确认收款</van-button
        >
      </div>
    </v-f>
    <v-t :open="open1" v-model="time" ymd max="y_5"></v-t>
  </div>
</template>

<script>
import vF from "../../../../private/fixed.vue";
import vT from "../../../../private/time.vue";
export default {
  props: {
    ids: [String, Number],
  },
  data() {
    return {
      item: [],
      open: false,
      det: {},
      number: "",
      time: "",
      open1: false,
    };
  },
  watch: {
    open1(n) {
      if (!n) {
        this.det = {};
        this.number = "";
        this.time = "";
      }
    },
  },
  components: { vF, vT },
  methods: {
    ongetsmoney(e, j) {
      this.det = { ...e, $index: j };
      this.open = true;
    },
    onsets(e) {
      this.$js.model("催款提示", "是否发起催款？", (r) => {
        if (r) {
          this.$api.http("classesarrearageset", {
            child_id: this.ids,
            item_name: e.name,
          });
        }
      });
    },
    ongets() {
      // 收款金额+到期时间
      let os = {
        money: this.number,
        expire_time: this.time,
        i_id: this.det.i_id,
        c_id: this.ids,
      };
      this.$api.http("classesarrearageget", os, () => {
        this.$toast("收款提交成功");
        this.open1 = false;
        this.init();
      });
    },
    init() {
      this.$api.http("classesarrearage", { child_id: this.ids }, (r) => {
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
section {
  margin: 10px;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 10px;
  font-size: 15px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  color: #666;
  p {
    margin-bottom: 5px;
  }
  .tool {
    flex-direction: row-reverse;
    .van-button {
      margin-left: 8px;
      min-width: 70px;
    }
  }
}
</style>
