<template>
  <div class="app_image">
    <div class="flex fw">
      <div class="img" v-for="(i, j) in list" :key="j + '-img'" :style="styls">
        <template v-if="i.srcs">
          <van-image
            :src="i.cover === 'img' ? i.srcs : i.base"
            class="db_image"
            fit="cover"
            @click="onShow(i, j)"
          ></van-image>
          <!-- 删除按钮 -->
          <span class="delete" @click="onDel(i)" v-if="del"
            ><van-icon name="cross"
          /></span>
        </template>
        <template v-else>
          <van-image :src="i.base" class="db_image" fit="cover"></van-image>
        </template>
        <!-- 上传 -->
        <div class="up_cover" v-if="i.num < 100" @click="onDelError(i)">
          <template v-if="i.num > -1">
            <span :style="{ height: 100 - i.num + '%' }"></span>
            <p>上传中{{ i.num }}%</p>
          </template>
          <template v-else>
            <van-icon name="close" color="#fff" />
            <span style="height: 100%"></span>
            <p>{{ i.msg }}</p>
          </template>
        </div>
      </div>
      <slot />
    </div>
  </div>
</template>

<script>
import { ImagePreview, Toast } from "vant";

/**
 * 初始数据
 * srcs: r,
  src:,
  base:,
  old: true,
  cover:''
 */

export default {
  props: {
    value: Array,
    del: { type: Boolean, default: true },
    type: String,
    lists: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    styls() {
      return {
        height: this.height + "px",
        width: this.width + "px",
      };
    },
    list: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
  },
  data() {
    return {
      width: 0,
      height: 0,
      initlist: false,
    };
  },
  watch: {
    list: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
    lists: {
      handler(n) {
        if (n.length && this.type) {
          this.onCheckList(n);
          this.initlist = true;
        }
      },
    },
  },
  methods: {
    onCheckList(arr) {
      if (this.initlist) return 0;
      let varr = arr.filter((r) => {
        return r.dire === undefined;
      });
      if (varr.length < arr.length) {
        return 0;
      }
      this.$nextTick(() => {
        let child = this.$children;
        child = child.filter((r) => {
          return !!r.obj;
        });
        if (child[0] && child[0].name === "upload") {
          child[0].onCheckOld(arr);
        }
      });
    },
    onShow(e, index) {
      if (e.cover === "img") {
        if (this.list.length > 1) {
          ImagePreview({
            images: this.list.map((s) => s.srcs),
            startPosition: index,
          });
        } else {
          ImagePreview([e.srcs]);
        }
      } else {
        let s = e.srcs.split(".");
        s = s[s.length - 1];
        if (["pdf", "xlsx", "xls", "doc", "docx", "ppt"].indexOf(s) > -1) {
          this.$store.dispatch("setH5", {
            type: s,
            url: e.srcs,
            event: "see",
            time: Date.now(),
          });
        } else {
          Toast("不支持预览");
        }
      }
    },
    onDel(e) {
      this.list = this.list.filter((r) => {
        return r.src !== e.src;
      });
      this.$nextTick(() => {
        let ref = this.$children[0];
        ref.is_more = ref.moreLength > this.list.length;
        if (ref.name === "upload") {
          ref.onDelCheck(e);
        }
      });
    },
    onDelError(e) {
      if (e.num > -1) return 0;
      this.onDel(e);
    },
  },
  mounted() {
    try {
      let a = this.$slots.default[0].elm;
      this.width = a.clientWidth;
      this.height = a.clientHeight;
    } catch (e) {
      this.width = this.height = 100;
    }
    this.$nextTick(() => {
      this.list = this.value;
      this.onCheckList(this.list);
    });
  },
};
</script>
<style lang='less' scoped>
.cover() {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.img {
  margin: 0 10px 10px 0;
  position: relative;

  .delete {
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
  .up_cover {
    .cover();
    font-size: 12px;
    z-index: 11;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    overflow: hidden;
    span {
      .cover();
      background: linear-gradient(#222 60%, rgba(255, 255, 255, 0));
      opacity: 0.5;
      z-index: 13;
      transition: all 0.3s;
    }
    .van-icon {
      font-size: 24px;
      margin-bottom: 5px;
      z-index: 15;
      position: relative;
    }
    p {
      color: #fff;
      position: relative;
      z-index: 14;
      text-shadow: 0px 2px 2px #333;
      font-weight: 650;
      padding: 0 10px;
      text-align: center;
    }
  }
}
</style>
