<template>
  <div class="medication_detail">
    <h5>
      本人之<span class="col_danger">{{
        child.gender === "男" ? "子" : "女"
      }}</span
      >因<span class="col_danger">{{ item.symptom }}</span
      >症状，特委托<span class="col_danger">{{ title }}</span
      >代喂药
    </h5>
    <div class="list">
      <p>在读班级：{{ item.class_name }}</p>
      <p>幼儿姓名：{{ item.name }}</p>
      <p>服药时间：{{ item.date }}</p>
    </div>
    <van-cell
      title="药品"
      :label="drug.length > 0 ? '有' + drug.length + '项药品' : '暂无药品'"
    ></van-cell>
    <template v-if="drug.length">
      <ul>
        <li v-for="(x, y) in drug" :key="y">
          <h6>
            药品名称：<b>{{ x.drug_name }}</b>
          </h6>
          <h6>
            服用剂量：<b>一次{{ x.metering }}剂量</b>
          </h6>
          <h6 v-if="x.morning" class="flex">
            上午服药时间：<b>{{ x.morning }}</b>
            <b>
              <template v-if="+x.morning_status === 2"> 已喂药 </template>
              <template v-else>
                <van-button
                  size="small"
                  :color="$js.btnColor"
                  round
                  @click="onchange(x, 1, y)"
                  >设置成已喂药</van-button
                >
              </template>
            </b>
          </h6>
          <h6 v-if="x.afternoon" class="flex">
            下午服药时间：<b>{{ x.afternoon }}</b>
            <b>
              <template v-if="+x.afternoon_status === 2"> 已喂药 </template>
              <template v-else>
                <van-button
                  size="small"
                  :color="$js.btnColor"
                  round
                  @click="onchange(x, 2, y)"
                  >设置成已喂药</van-button
                >
              </template>
            </b>
          </h6>
        </li>
      </ul>
    </template>
    <van-cell
      title="附件"
      :value="imgs.length > 0 ? imgs.length + '个附件' : '暂无附件'"
    ></van-cell>
    <div class="imgs flex fw" v-if="imgs.length">
      <div class="img" v-for="(x, y) in imgs" :key="y + 1000">
        <van-image
          :src="x"
          fit="cover"
          @click="appShowImage(imgs, y)"
        ></van-image>
      </div>
    </div>
    <van-cell
      title="家长签字"
      :value="'家长' + (item.sign ? '已' : '未') + '签字'"
    ></van-cell>
    <div class="hands" v-if="item.sign">
      <van-image
        :src="item.sign"
        fit="cover"
        @click="appShowImage(item.sign)"
      ></van-image>
    </div>
    <van-cell
      title="老师签字"
      :value="'老师' + (item.autograph ? '已' : '未') + '签字'"
    ></van-cell>
    <div v-if="!item.autograph">
      <v-hand ref="hand" v-model="hand" @on-save="onsavehand"></v-hand>
    </div>
    <div class="hands" v-else>
      <van-image
        :src="item.autograph"
        fit="cover"
        @click="appShowImage(item.autograph)"
      ></van-image>
    </div>
  </div>
</template>

<script>
import vHand from "../../private/hand.vue";
export default {
  props: {
    value: null,
  },
  data() {
    return {
      title: "",
      hand: {},
    };
  },
  inject: ["appShowImage"],
  components: { vHand },
  computed: {
    item: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    child() {
      return this.item.child || {};
    },
    drug() {
      return this.item.drugs || [];
    },
    cls() {
      return this.item.classes || {};
    },
    imgs() {
      return this.item.picture || [];
    },
    isenddrug() {
      let a = this.drug.map((s) => {
        return [+s.morning_status, +s.afternoon_status].filter((r) => {
          return r !== 2;
        });
      });
      let b = [];
      for (let i = 0; i < a.length; i++) {
        b = b.concat(a[i]);
      }
      return b.length > 0 ? -1 : this.item.$index;
    },
  },
  watch: {
    item: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
  },
  methods: {
    onsavehand(e) {
      this.$js.model("提示", "是否提交签字，提交后不可更改", (r) => {
        if (r) {
          this.$api.http(
            "medicationhand",
            { autograph: e.src, id: this.item.id },
            () => {
              this.$toast("提交成功");
              this.item.autograph = e.src;
            }
          );
        }
      });
    },
    onchange(v, a, y) {
      let type = a === 1 ? "morning_status" : "afternoon_status";

      this.$api.http("medicationsend", { id: v.id, field: type }, () => {
        this.$toast("喂药成功");
        if (a === 1) {
          this.$set(this.item.drugs[y], "morning_status", 2);
        } else {
          this.$set(this.item.drugs[y], "afternoon_status", 2);
        }
        this.$nextTick(() => {
          this.$emit("change", this.isenddrug);
        });
      });
    },
  },
  mounted() {
    this.item = this.value;
    // eslint-disable-next-line
    this.title = demo.$session.get("user").nursery_name;
  },
};
</script>
<style lang='less' scoped>
.medication_detail {
  font-size: 15px;
  padding: 10px;
}
h5 {
  line-height: 1.4;
  span {
    padding: 0 5px;
  }
}
.list {
  padding: 10px;
  line-height: 1.2;
}
li {
  padding: 12px;
  h6 {
    margin-bottom: 8px;
    line-height: 20px;
    b {
      font-weight: 650;
      margin-right: 8px;
      &:nth-child(1) {
        flex: 1;
      }
    }
  }
}
.imgs {
  .img {
    width: 75px;
    height: 75px;
    margin: 0 10px 10px 0;
  }
}
.hands {
  width: 300px;
  height: 150px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  margin: 10px;
}
</style>
