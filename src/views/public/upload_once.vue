<template>
  <div class="upload_once">
    <span class="img_close" v-if="close && ext.src" @click="ondel"
      ><van-icon name="cross"></van-icon
    ></span>
    <v-u
      :type="type"
      :ids="ids"
      @on-path="onPath"
      ref="upload"
      :noapi="noapi"
      @base64="base64"
    >
      <template v-if="ext.image">
        <van-image :src="ext.image" fit="cover" class="img_cover"></van-image>
      </template>
    </v-u>
  </div>
</template>

<script>
import vU from "./upload";
export default {
  props: {
    value: null,
    type: String,
    close: Boolean,
    noapi: Boolean,
  },
  data() {
    return {
      // eslint-disable-next-line
      ids: "file-" + demo.$random.vars(6),
    };
  },
  computed: {
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
  },
  watch: {
    ext: {
      handler(n) {
        if (n.$reset && this.$refs.upload) {
          this.$refs.upload.resetsrc();
        }
        this.$emit("input", n);
      },
      deep: true,
    },
  },
  components: { vU },
  methods: {
    base64(e) {
      this.$emit("base64", e);
    },
    ondel() {
      this.ext = {};
      this.$emit("path", {}, this.$refs.upload);
    },
    onPath(a) {
      let os = {
        url: a.srcs,
        src: a.src,
        pic: a.cover === "img" ? a.srcs : a.base,
        progress: a.num,
      };
      this.ext = os;
      this.$emit("path", os, this.$refs.upload);
      // this.$refs.upload.close = false;
    },
  },
  mounted() {
    this.ext = this.value;
  },
};
</script>
<style lang='less' scoped>
.upload_once {
  position: relative;
  .img_cover {
    z-index: -1;
    position: static;
  }
  .img_close {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 10;
    border-radius: 0 0 0 20px;
    width: 20px;
    height: 20px;
    background-color: #222;
    color: #fff;
    font-size: 15px;
    text-align: center;
  }
}
</style>
