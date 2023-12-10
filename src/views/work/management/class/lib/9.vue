<template>
  <div class="class_9">
    <ul class="flex fw">
      <li v-for="(i, j) in list" :key="j">
        <van-image
          :src="i.base_map"
          fit="cover"
          @click.stop="appShowImage(list, j, 'base_map')"
        ></van-image>
        <div class="close" @click.stop="onclosepic(i, j)">
          <van-icon name="cross"></van-icon>
        </div>
      </li>
      <li>
        <v-upload-once
          v-model="imgs"
          class="db_image"
          @path="onpath"
        ></v-upload-once>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    ids: [String, Number],
  },
  data() {
    return {
      imgs: {},
      list: [],
    };
  },
  inject: ["appShowImage"],
  methods: {
    onclosepic(i, j) {
      this.$js.modeldel(() => {
        this.$toast.loading({ duration: 0 });
        this.$api.http("classeschildpicdel", { base_map_id: i.id }, () => {
          this.$toast.clear();
          this.$toast("成功");
          this.init();
        });
      });
    },
    onpath(e) {
      this.$nextTick(() => {
        this.imgs = { $reset: true, image: "", url: "" };
      });
      if (!e.src) return 0;
      this.$toast.loading({ duration: 0 });
      this.$api.http(
        "classeschildpicadd",
        { child_id: this.ids, base_map: e.src },
        () => {
          this.$toast.clear();
          this.$toast("成功");
          this.init();
        }
      );
    },
    init() {
      this.$api.http("classeschildpicget", { id: this.ids }, (r) => {
        this.list = r;
      });
    },
  },
  mounted() {
    this.init();
  },
  destroyed() {
    this.$toast.clear();
  },
};
</script>
<style lang='less' scoped>
.class_9 {
  padding: 15px;
  li {
    width: 105px;
    height: 105px;
    margin: 0 15px 15px 0;
    box-sizing: border-box;
    position: relative;
    &:nth-child(3n) {
      margin-right: 0;
    }
    .close {
      position: absolute;
      right: 0;
      top: 0;
      width: 25px;
      height: 25px;
      background-color: rgb(253, 86, 86);
      color: #fff;
      border-radius: 0 0 0 20px;
      text-align: center;
      line-height: 25px;
    }
  }
}
</style>
