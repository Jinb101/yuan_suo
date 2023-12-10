<template>
  <div class="addify">
    <van-field v-model="ext.ify" label="物品分类" readonly />
    <van-field
      v-model="job"
      label="物品名称"
      placeholder="请输入物品名称"
      required
    />
    <van-field
      v-model="price"
      label="单价"
      placeholder="请输入单价"
      type="number"
      required
    >
      <template #button> 元 </template>
    </van-field>
    <van-field
      v-model="num"
      label="数量"
      placeholder="请输入数量"
      type="digit"
      required
    >
      <template #button>
        {{ unit }}
      </template>
    </van-field>
    <van-field
      v-model="unit"
      label="物品单位"
      readonly
      right-icon="arrow"
      input-align="right"
      required
      @click="open = !open"
    />
    <div class="btn">
      <van-button type="primary" block round @click="onAdd">添加</van-button>
    </div>
    <v-s v-model="unitobj" :open="open" :list="units"></v-s>
  </div>
</template>

<script>
import vS from "../../../private/select.vue";
export default {
  props: {
    value: null,
  },
  components: { vS },
  data() {
    return {
      unit: "",
      job: "",
      price: "",
      num: "",
      units: [],
      unitobj: {},
      open: false,
      unit_id: "",
    };
  },
  computed: {
    ext: {
      set: function set(n) {
        this.$emit("input", n);
      },
      get: function get() {
        return this.value;
      },
    },
  },
  watch: {
    ext: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
    unitobj: {
      handler(n) {
        this.unit = n.name;
        this.unit_id = n.value;
      },
      deep: true,
    },
  },
  methods: {
    init() {
      // 获取单位
      this.$api.http("getGoodsAll", {}, (res) => {
        this.units = (res.units || []).map((s) => {
          return { name: s.name, value: s.id };
        });
      });

      this.job = this.ext.job;
    },
    onAdd() {
      let os = {
        name: this.job,
        categories_id: this.ext.cid,
        units_id: this.unit_id,
        num: this.num,
        price: this.price,
        img: "",
      };
      if (!os.categories_id) return this.$js.message("请选择物资分类");
      if (!os.units_id) return this.$js.message("请选择物资单位");
      this.$api.http("setGoodsAdd", os, (r) => {
        this.$js.message("添加成功");
        this.$emit("on-add", r);
      });
    },
  },
  mounted() {
    this.ext = this.value;
    this.init();
  },
};
</script>
<style lang='less' scoped>
.btn {
  margin: 40px auto;
  width: 60%;
}
</style>
