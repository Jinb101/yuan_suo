<template>
  <div class="plan_add">
    <h6>上传文件<b>(图片/Word/Excel/PDF)</b></h6>
    <x-content>
      <v-us v-model="imgs">
        <div class="images">
          <v-u
            more
            @on-loading="onPath"
            @on-path="onPath"
            type="all"
            moreLength="9"
          ></v-u>
        </div>
      </v-us>
    </x-content>
    <h6>重点工作<b>(期间重点工作安排)</b></h6>
    <div class="list" :style="styls">
      <section v-for="(i, j) in item" :key="j" class="flex">
        <van-field
          v-model="i.t"
          :label="j + 1"
          placeholder="请输入重点工作"
          label-width="0.3rem"
        >
          <template #button>
            <van-button
              size="mini"
              round
              icon="plus"
              v-if="j === item.length - 1"
              @click="addItem(j)"
            ></van-button>
            <van-button
              size="mini"
              round
              icon="minus"
              v-if="j > 0"
              @click="delItem(j)"
            ></van-button>
          </template>
        </van-field>
      </section>
    </div>
    <div class="btn">
      <van-button block :color="bgc" round @click="onSub">{{
        btnText
      }}</van-button>
    </div>
  </div>
</template>

<script>
import vU from "../public/upload.vue";
import vUs from "../public/uploads.vue";
export default {
  props: {
    value: null,
    bgc: { type: String, default: "#18bc9c" },
    edit: Boolean,
  },
  data() {
    return {
      imgs: [],
      item: [{ t: "" }],
    };
  },
  watch: {
    ext: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
  },
  computed: {
    styls() {
      if (this.bgc) {
        // eslint-disable-next-line
        return { background: demo.$alg.gradients(this.bgc, "#fff") };
      }
      return "";
    },
    btnText() {
      return this.edit ? "编辑" : "添加";
    },
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
  },
  components: { vU, vUs },
  methods: {
    onPath(e, list) {
      this.imgs = list;
    },
    addItem(j) {
      this.item.push({ t: "" });
    },
    delItem(j) {
      this.item = this.item.filter((r, v) => {
        return v !== j;
      });
    },
    onSub() {
      let img = this.imgs.map((s) => {
        return {
          type: s.cover,
          path: s.src,
        };
      });
      let list = this.item.filter((s) => {
        return s.t !== "";
      });
      console.log(img, list, this.ext);
    },
  },
  mounted() {
    this.ext = this.value;
  },
};
</script>
<style lang='less' scoped>
.images {
  width: 108px;
  height: 108px;
}
h6 {
  font-size: 15px;
  font-weight: 650;
  padding: 10px;
  b {
    padding-left: 8px;
    font-weight: 400;
    font-size: 12px;
    color: #929292;
  }
}
.list {
  padding: 10px;
  box-sizing: border-box;
  background: linear-gradient(#fff, rgb(212, 195, 172));
  section {
    border-radius: 10px;
    overflow: hidden;
  }
  section + section {
    margin-top: 8px;
  }
}
.btn {
  margin: 45px auto 10px;
  width: 140px;
}
</style>
