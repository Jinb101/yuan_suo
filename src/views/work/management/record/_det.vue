<template>
  <div class="record_det">
    <div class="app_top">
      <van-cell
        title="选择编辑学期"
        is-link
        @click="open1 = !open1"
        :value="titletext"
      ></van-cell>
    </div>
    <section v-for="(i, j) in item" :key="j" class="flex">
      <p class="time">{{ i.title }}</p>
      <div class="input" v-if="i.company">
        <van-field v-model="i.value2" type="number" placeholder="请输入">
          <template #button>
            {{ i.company }}
          </template>
        </van-field>
      </div>
      <div class="input">
        <van-field v-model="i.value" type="number" placeholder="请输入">
          <template #button> 元 </template>
        </van-field>
      </div>
    </section>
    <div class="w60">
      <van-button block round :color="$js.btnColor" @click="onsub"
        >保存</van-button
      >
    </div>
    <v-s v-model="s1" :open="open1" :list="t1" noselect @change="ons1"></v-s>
  </div>
</template>

<script>
import vS from "../../../private/select.vue";
export default {
  props: {
    tp: [String, Number],
  },
  components: { vS },
  data() {
    return {
      t1: [],
      s1: [],
      open1: false,
      os: {
        semester: "",
        year: "",
      },
      // eslint-disable-next-line
      date: demo.timeout("", "object"),
      item: [],
    };
  },
  computed: {
    titletext() {
      if (this.s1text) return this.s1text;
      let os = {
        m: +this.date.m,
        y: this.date.y,
        s: "秋",
      };
      if (os.m > 0 && os.m < 2) {
        os.y -= 1;
      }
      if (os.m >= 2 && os.m < 8) {
        os.s = "春";
      }
      return [os.y, "年", os.s, "季学期"].join("");
    },
    s1text() {
      return this.s1.join("");
    },
  },
  methods: {
    onsub() {
      let a = this.item.filter((r) => {
        if (r.company) {
          return r.value >= 0 && r.value2 >= 0;
        }
        return r.value >= 0;
      });
      a = a.map((s) => {
        return {
          chain: s.value || 0,
          deploy: s.value2 || 0,
          date: s.title,
          type: s.type,
        };
      });
      this.$api.http("recordadjadd", { data: JSON.stringify(a) }, () => {
        this.$toast("保存成功");
        this.$emit("end", this.tp);
      });
    },
    ons1(e) {
      this.os = {
        semester: e[1].value,
        year: e[0].value,
      };
      this.init();
    },
    init() {
      let type = this.tp;
      this.$api.http("recordadj", { ...this.os, type }, (r) => {
        this.item = Object.keys(r).map((k, v) => {
          return {
            title: k,
            value: +r[k].chain || "",
            value2: +r[k].deploy || "",
            status: r[k].status,
            type,
            index: v,
            company: r[k].company || "", // value2
          };
        });
      });
    },
  },
  mounted() {
    this.t1 = this.$js.def.record.year;
    this.os.year = this.titletext.split("年")[0];
    this.os.semester = this.titletext.indexOf("春") > 0 ? 1 : 2;
    this.init();
  },
};
</script>
<style lang='less' scoped>
section {
  padding: 8px 10px;
  line-height: 44px;
  font-size: 14px;
  background-color: rgba(253, 255, 224, 0.5);
  &:nth-child(2n) {
    background-color: rgba(236, 255, 234, 0.5);
  }
  .input {
    flex: 1;
  }
  .van-cell {
    background: transparent;
  }
}
</style>
