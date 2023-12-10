<template>
  <div class="chant_example_add">
    <van-field
      v-model="os.title"
      label="标题"
      placeholder="请输入示范课标题"
      label-align="3em"
    />
    <van-cell title="示范课视频" label="请传入示范课视频,建议横屏"></van-cell>
    <v-upload-once class="image2" type="video" v-model="vio"></v-upload-once>
    <van-cell title="示范课封面"></van-cell>
    <!-- <van-cell
      title="示范课封面"
      label="可选，默认示范课视频第一帧作为封面"
    ></van-cell> -->
    <v-upload-once class="image" v-model="img"></v-upload-once>
    <van-field label="观看模式">
      <template #button>
        <van-radio-group v-model="type" direction="horizontal">
          <van-radio name="1">免费</van-radio>
          <van-radio name="2">收费</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <template v-if="+type === 2">
      <van-field
        v-model="os.original_price"
        type="number"
        label="价格"
        placeholder="请输入原价"
      />
      <van-field
        v-model="os.price"
        type="number"
        label="优惠价"
        placeholder="请输入实际价格"
      />
    </template>
    <div class="w60">
      <van-button block round :color="$js.btnColor" @click="add">{{
        btntext
      }}</van-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    edit: Boolean,
    value: null,
  },
  data() {
    return {
      os: {
        title: "",
        cover: "",
        video: "",
        price: "",
        original_price: "",
      },
      type: "2",
      vio: {},
      img: {},
    };
  },
  computed: {
    btntext() {
      return this.edit ? "编辑" : "发布";
    },
    val: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
  },
  watch: {
    val: {
      handler(v) {
        this.$emit("input", v);
      },
      deep: true,
    },
  },
  methods: {
    add() {
      if (+this.type === 1) {
        this.os.price = this.os.original_price = 0;
      }
      let os = {
        ...this.os,
        video: this.vio.src || "",
        cover: this.img.src || "",
      };
      if (this.edit) {
        os.presentation_id = this.val.presentation_id;
      }
      this.$api.http("chantvideoadd", os, (r) => {
        this.$toast(this.btntext + "成功");
        this.$emit("end");
      });
    },
    init() {
      if (this.edit) {
        this.os = {
          title: this.val.title,
          cover: this.val.covers,
          video: this.val.videos,
          price: this.val.price,
          original_price: this.val.original_price,
        };
        this.type = this.val.price > 0 ? "2" : "1";
        this.vio = {
          // eslint-disable-next-line
          image: demo.siteConfig.uploadShow("mp4"),
          src: this.val.videos,
        };
        this.img = { image: this.val.cover, src: this.val.covers };
      }
    },
  },
  mounted() {
    this.val = this.value;
    this.init();
  },
};
</script>
<style lang='less' scoped>
.chant_example_add {
  .image {
    width: 100px;
    height: 100px;
    margin: 10px;
  }
  .image2 {
    margin: 10px;
    width: 200px;
    height: 120px;
  }
}
</style>
