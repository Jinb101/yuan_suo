<template>
  <div class="app_hand">
    <template v-if="$slots.default">
      <slot />
    </template>
    <template v-else>
      <div class="box"
           ref="box">
        <span @click="clear"><van-icon name="edit" />点击签名</span>
        <v-c :w="w"
             :h="h"
             ref="canvas"
             @on-save="onSaveImage"></v-c>
      </div>
    </template>
    <v-f :index="600"
         text="签字"
         v-model="open"
         ref="fixed"
         overflow
         :footer="false">
      <div class="box_big">
        <div class="boxs"
             ref="boxBig">
          <v-c :w="w1"
               :h="h1"
               ref="canvas2"
               @on-save="onSaveImage2"></v-c>
        </div>
        <div class="tool">
          <!-- <span @click="clear"><van-icon name="delete-o" />点击签名</span> -->
          <span v-if="!open"
                @click="toggle"><van-icon name="expand-o" />全屏</span>
          <span v-else
                @click="toggle"><van-icon name="shrink" />取消全屏</span>
          <span @click="submit"><van-icon name="upgrade" />保存签名</span>
          <span @click="clear"><van-icon name="delete-o" />重签</span>
        </div>
      </div>
    </v-f>
    <div class="tool">
      <!-- <span @click="clear"><van-icon name="delete-o" />点击签名</span> -->
      <span v-if="!open"
            @click="toggle"><van-icon name="expand-o" />全屏</span>
      <span v-else
            @click="toggle"><van-icon name="shrink" />取消全屏</span>
      <span @click="clear"><van-icon name="delete-o" />重签</span>
      <span v-if="mode"
            @click="onshowmodel"><van-icon name="label" />签名模板</span>
      <span @click="submit"
            v-else><van-icon name="upgrade" />保存签名</span>
    </div>
    <!-- <p class="tips">
      提示：若手写不成功或者手写板出现异常，可尝试点击 [<b class="col_green"
        >清除</b
      >] 重试或者点击 [<b class="col_green">全屏</b>] 进行手写
    </p> -->
  </div>
</template>

<script>
import vF from "./fixed.vue";
import vC from "./canvas.vue";
export default {
  props: {
    value: null,
    api: Boolean,
    mode: Boolean,
  },
  data() {
    return {
      open: false,
      w: 0,
      h: 0,
      w1: 0,
      h1: 0,
    };
  },
  watch: {
    open(n) {
      if (n) {
        this.init();
      }
    },
    ext: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
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
  components: { vF, vC },
  methods: {
    onshowmodel() {
      this.$emit("onmode");
    },
    toggle() {
      this.clear();
      this.open = !this.open;
    },
    initCanvas() {
      let box = this.$refs.box;
      this.w = box.clientWidth;
      this.h = box.clientHeight;
    },
    init() {
      if (this.open) {
        setTimeout(() => {
          let a = this.$refs.boxBig;
          this.w1 = a.clientWidth;
          this.h1 = a.clientHeight;
          this.$nextTick(() => {
            this.$refs.canvas2.init();
          });
        }, 200);
      }
    },
    clear() {
      this.$refs.canvas.clear();
      if (this.$refs.canvas2) {
        this.$refs.canvas2.clear();
      }
      this.$refs.canvas.init();
      this.ext = {};
    },
    submit() {
      this.$nextTick(() => {
        this.$refs.canvas.commit();
        if (this.$refs.canvas2) {
          this.$refs.canvas2.commit();
        }
      })
      setTimeout(() => {
        // 通过类名获取元素
        const element = document.querySelector('.w60');
        // 移动视角到元素
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    },
    onSaveImage(e) {
      if (this.open) return 0;
      // eslint-disable-next-line
      demo.es6().imageRotate(e, {}, (res) => {
        if (this.api) {
          this.toApi(res);
        } else {
          this.ext = res;
          this.$emit("on-save", res);
        }
      });
    },
    onSaveImage2(e) {
      // eslint-disable-next-line
      demo.es6().imageRotate(e, { index: 3 }, (res) => {
        if (this.api) {
          this.toApi(res);
        } else {
          this.ext = res;
          this.$emit("on-save", res);
        }
      });
    },
    toApi(res) {
      this.$toast.loading({ duration: 0 });
      this.$api.upload(
        { type: "img", imgs: res.small },
        (rej) => {
          this.ext = rej;
          this.$emit("on-save", rej);
          this.$toast.clear();
        },
        () => {
          this.$toast.clear();
          this.$toast("上传出错");
        },
        () => { }
      );
    },
  },
  mounted() {
    console.log(this.open);
    this.ext = this.value;
    if (!this.$slots.default) {
      this.initCanvas();
    }
  },
};
</script>
<style lang='less' scoped>
.app_hand {
  padding-bottom: 40px;
  position: relative;

  .tool {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 40px;
    font-size: 14px;

    .van-icon {
      vertical-align: middle;
      font-size: 16px;
    }

    span {
      padding: 0 5px;
      height: 30px;
      line-height: 28px;
      border-radius: 5px;
      background-image: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
      color: #fff;
      min-width: 80px;
      text-align: center;

      &+span {
        margin-left: 8px;
      }
    }

    display: flex;
    align-items: center;
  }

  .box {
    position: relative;
    font-size: 14px;

    span {
      position: absolute;
      right: 0;
      top: 0;
      padding: 0 5px;
      height: 30px;
      line-height: 28px;
      border-radius: 5px;
      background-image: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
      color: #fff;
      min-width: 80px;
      text-align: center;
    }
  }

  .box,
  .boxs {
    width: 100%;
    border: 1px dashed #ccc;
    box-sizing: border-box;
    height: 200px;
  }

  .boxs {
    height: 100%;
  }

  .box_big {
    position: relative;
    height: 100%;

    .tool {
      padding: 0 10px;
      position: absolute;
      left: 0;
      top: 0;
      transform: rotate(90deg) translateY(-100%);
      transform-origin: 0 0;
    }
  }

  .tips {
    font-size: 12px;
    padding: 5px 0;
    color: #ccc;
    line-height: 1.2;
    letter-spacing: 1px;
  }
}
</style>
