<template>
  <div class="album_add">
    <van-cell
      title="选择时间"
      :is-link="!disable"
      :value="year"
      @click="onyear"
    ></van-cell>
    <van-cell title="图片"></van-cell>
    <div class="imgs">
      <v-uploads v-model="imgs">
        <div class="image">
          <v-upload more @on-path="onImage" @on-loading="onImage"></v-upload>
        </div>
      </v-uploads>
    </div>
    <div class="w60">
      <van-button block round :color="$js.btnColor" @click="onsave">{{
        edit ? "编辑" : "添加"
      }}</van-button>
    </div>
    <v-t :open="open" v-model="o" max="m_6"></v-t>
  </div>
</template>

<script>
/* eslint-disable */
import vT from "../../private/time.vue";
export default {
  props: {
    ext: {
      type: Object,
      default: () => {
        return {};
      },
    },
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    cid: [String, Number],
    api: { type: Boolean, default: true },
  },
  components: { vT },
  computed: {
    edit() {
      return this.ext.$edit;
    },
    disable() {
      return this.ext.$disable;
    },
  },
  watch: {
    ext: {
      handler() {
        this.init();
      },
      deep: true,
    },
    o: {
      handler(n) {
        if (n.time && n.obj) {
          this.year = [n.obj.y, n.obj.m, n.obj.d].join("-");
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      year: "",
      imgs: [],
      open: false,
      o: {},
    };
  },
  methods: {
    onyear() {
      if (this.disable) return 0;
      this.open = !this.open;
    },
    init() {
      let time = demo.timeout("", "object");
      if (this.ext.years) {
        this.year = this.ext.years;
      } else {
        this.year = [time.y, time.m, time.d].join("-");
      }

      if (this.ext.list && this.ext.list.length) {
        let a = this.ext.list.map((s, v) => {
          return {
            srcs: s.picture,
            src: s.src,
            base: s.picture,
            old: true,
            cover: "img",
          };
        });
        this.imgs = a;
      }
      if (!this.edit) {
        this.result = [+this.$route.params.id];
      }
    },
    onImage(e, v) {
      this.imgs = v;
    },
    onsave() {
      let imgs = this.imgs.map((s) => {
        return s.src;
      });
      let xh = imgs.length > 1 ? demo.array(imgs).unique() : imgs;
      let os = {
        child_id: this.cid,
        picture: xh.join(","),
        years: this.year,
      };
      if (!this.api) {
        os.class_id = this.cid;
        os.picture = os.picture.split(",");
        try {
          let l = os.picture.filter((r) => {
            return r !== "";
          });
          os.picture = l.length > 1 ? demo.array(l).unique() : l;
        } catch (err) {}
        delete os.child_id;

        if (!os.picture.length) return this.$toast("请添加图片");

        return this.$emit("sub", os);
      }
      let api = "albumadd";
      if (this.edit) {
        api = "albumedit";
        os.term_album_id = this.ext.id;
      }
      // if (this.result.length > 1) {
      //   console.log(this.result);
      //   return 0;
      // }
      if (os.picture === "") return this.$toast("请上传照片");

      this.$api.http(api, os, () => {
        this.$toast((this.edit ? "编辑" : "添加") + "成功");
        this.$emit("end");
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.imgs {
  padding: 10px;
}
.image {
  width: 100px;
  height: 100px;
}
.select_child {
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  > div {
    width: 50%;
    padding: 5px 0;
  }
  .font {
    font-size: 15px;
  }
}
</style>
