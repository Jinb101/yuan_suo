<template>
  <div class="supplies_add">
    <van-field
      label="物资名称"
      placeholder="请输入物资名称"
      required
      label-width="5em"
      v-model="os.name"
    />
    <van-field
      label="物资单价"
      placeholder="请输入物资单价"
      required
      label-width="5em"
      v-model="os.price"
    >
      <template #button> 元 </template>
    </van-field>
    <van-field label="物资数量" required label-width="5em" readonly>
      <template #button>
        <van-stepper
          v-model="os.num"
          min="0"
          max="99999"
          integer
          input-width="80px"
        />
      </template>
    </van-field>
    <van-field
      label="物资分类"
      placeholder="请选择物资分类"
      required
      input-align="right"
      is-link
      label-width="5em"
      readonly
      @click="open1 = !open1"
      v-model="ify"
    />
    <van-field
      label="物资单位"
      placeholder="请选择物资单位"
      required
      input-align="right"
      is-link
      label-width="5em"
      readonly
      @click="open2 = !open2"
      v-model="unit"
    />
    <van-field
      label="物资总价"
      input-align="right"
      label-width="5em"
      readonly
      :value="max"
      ><template #button> 元 </template></van-field
    >
    <van-cell title="封面"></van-cell>
    <v-upload-once v-model="img" class="image"></v-upload-once>
    <div class="w60">
      <van-button block round :color="$js.btnColor" @click="onsave">{{
        subtext
      }}</van-button>
    </div>
    <div class="tips">
      <h5>小提示！</h5>
      <p>物资总价为物资单价与物资数量相乘的值，系统自动计算，无法手动输入</p>
      <p>
        物资数量可点击左右增减按钮进行数量微调，也可以直接点击输入框进行输入物资总数
      </p>
    </div>
    <v-s :list="a1" text="name" v-model="o1" :open="open1"></v-s>
    <v-s :list="a2" text="name" v-model="o2" :open="open2"></v-s>
  </div>
</template>

<script>
import vS from "../../private/select.vue";
export default {
  props: {
    value: null,
    ext: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: { vS },
  data() {
    return {
      v: 1,
      img: {},
      a1: [],
      a2: [],
      o1: {},
      o2: {},
      open1: false,
      open2: false,
      os: {
        categories_id: "",
        units_id: "",
        price: "",
        num: "",
        name: "",
        img: "",
      },
      ify: "",
      unit: "",
    };
  },
  computed: {
    val: {
      get: function get() {
        return this.value;
      },
      set: function set(n) {
        this.$emit("input", n);
      },
    },
    subtext() {
      return (this.edit ? "编辑" : "添加") + "物资";
    },
    max() {
      if (this.os.price > 0 && this.os.num > 0) {
        return +this.os.price * +this.os.num;
      }
      return 0;
    },
    edit() {
      return this.ext.$edit;
    },
  },
  watch: {
    val: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
    o1: {
      handler(n) {
        this.ify = n.name;
        this.os.categories_id = n.id;
      },
      deep: true,
    },
    o2: {
      handler(n) {
        this.unit = n.name;
        this.os.units_id = n.id;
      },
      deep: true,
    },
    ext: {
      handler() {
        this.init();
      },
      deep: true,
    },
  },
  methods: {
    onsave() {
      let os = {
        ...this.os,
        img: this.img.src || "",
      };
      let api = "suppliesadd";
      if (this.edit) {
        api = "suppliesedit";
        os.id = this.ext.id;
      }
      this.$api.http(api, os, () => {
        if (this.edit) {
          this.val = os;
        }
        this.$toast((this.edit ? "编辑" : "添加") + "成功");
        this.$nextTick(() => {
          this.$emit("close", this.edit ? "edit" : "add", this.ext.$index);
        });
      });
    },
    init() {
      if (this.edit) {
        this.$api.http("suppliesdet", { id: this.ext.id }, (r) => {
          this.os = {
            categories_id: r.c_id,
            units_id: r.u_id,
            price: +r.price,
            num: +r.num,
            name: r.name,
            img: r.imgs,
          };
          this.ify = r.category;
          this.unit = r.unit;
          this.img = { image: r.img, src: r.imgs };
        });
      }
    },
  },
  mounted() {
    this.val = this.value;
    this.$api.http("suppliesunit", {}, (r) => {
      this.a1 = r.categories || [];
      this.a2 = r.units || [];
    });
    this.init();
  },
};
</script>
<style lang='less' scoped>
.tips {
  padding: 10px;
  font-size: 14px;
  line-height: 1.2;
  color: #ccc;
  h5 {
    font-weight: 650;
    padding: 8px 0;
    color: #999;
  }
  p + p {
    margin-top: 5px;
  }
}
.image {
  margin: 10px;
  width: 100px;
  height: 100px;
}
</style>
