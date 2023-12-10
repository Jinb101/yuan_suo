<template>
  <canvas ref="canvas"
          :width="w"
          :height="h"
          @touchstart="touchStart"
          @touchmove="touchMove"
          @touchend="touchEnd"
          @mousedown="mouseDown"
          @mousemove="mouseMove"
          @mouseup="mouseUp">
    您的浏览器不支持 HTML5 canvas 标签。
  </canvas>
</template>

<script>
export default {
  props: {
    w: { type: [String, Number], default: 300 },
    h: { type: [String, Number], default: 100 },
  },
  data() {
    return {
      canvasImg: "", // 签名图片地址
      ctx: null, // 画板
      stage_info: null, // 移动端按下点到屏幕的偏差
      isDown: false, // 是否按下
      points: [], // 按下点组合
      startX: 0, // 起始点x坐标
      startY: 0, // 起始点y坐标
      canvas: null,
    };
  },
  watch: {
    w(n) {
      if (n > 0) {
        this.init();
      }
    },
  },
  methods: {
    init() {
      if (this.ctx) {
        this.ctx = null;
      }
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext("2d");
      this.ctx.fillStyle = "rgb(255,255,255)"; // bgc
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.strokeStyle = "#000";
      this.ctx.lineWidth = 2;
      this.ctx.lineCap = "round";
      this.stage_info = this.canvas.getBoundingClientRect();
      setTimeout(() => {
        this.stage_info = this.canvas.getBoundingClientRect();
      }, 1200);
    },
    // pc
    mouseDown(ev) {
      let e = ev || event;
      e.preventDefault();
      this.isDown = true;
      let obj = {
        x: e.offsetX,
        y: e.offsetY,
      };
      this.startX = obj.x;
      this.startY = obj.y;
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(obj.x, obj.y);
      this.ctx.stroke();
      this.ctx.closePath();
      this.points.push(obj);
    },
    mouseMove(ev) {
      let e = ev || event;
      e.preventDefault();
      if (this.isDown) {
        let obj = {
          x: e.offsetX,
          y: e.offsetY,
        };
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(obj.x, obj.y);
        this.ctx.stroke();
        this.ctx.closePath();
        this.startY = obj.y;
        this.startX = obj.x;
        this.points.push(obj);
      }
    },
    mouseUp(ev) {
      let e = ev || event;
      e.preventDefault();
      if (this.isDown) {
        let obj = {
          x: ev.offsetX,
          y: ev.offsetY,
        };
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(obj.x, obj.y);
        this.ctx.stroke();
        this.ctx.closePath();
        this.points.push(obj);
        this.points.push({ x: -1, y: -1 });
        this.isDown = false;
      }
    },
    // mobile
    touchStart(ev) {
      let e = ev || event;
      e.preventDefault();
      if (e.touches.length === 1) {
        let target = e.target;
        if (target !== this.canvas) {
          return;
        }
        this.isDown = true;
        let obj = {
          x: e.targetTouches[0].clientX - this.canvas.getBoundingClientRect().left,
          y: e.targetTouches[0].clientY - this.canvas.getBoundingClientRect().top
        };
        this.startX = obj.x;
        this.startY = obj.y;
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(obj.x, obj.y);
        this.points.push(obj);
      }
    },
    touchMove(ev) {
      let e = ev || event;
      e.preventDefault();
      if (e.touches.length === 1 && this.isDown) {
        let obj = {
          x: e.targetTouches[0].clientX - this.canvas.getBoundingClientRect().left,
          y: e.targetTouches[0].clientY - this.canvas.getBoundingClientRect().top
        };
        if (obj.y < 1) {
          return
        }
        // this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(obj.x, obj.y);
        this.ctx.stroke();
        // this.ctx.closePath();
        this.startX = obj.x;
        this.startY = obj.y;
        this.points.push(obj);
      }
    },
    touchEnd(ev) {
      this.$nextTick()
      let e = ev || event;
      e.preventDefault();
      if (e.touches.length === 1 && this.isDown) {
        let obj = {
          x: e.targetTouches[0].clientX - this.canvas.getBoundingClientRect().left,
          y: e.targetTouches[0].clientY - this.canvas.getBoundingClientRect().top
        };
        this.startX = obj.x;
        this.startY = obj.y;
        // this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(obj.x, obj.y);
        // this.ctx.stroke();
        // this.ctx.closePath();
        this.points.push(obj);
        this.isDown = false;
      }
    }, // 清空
    clear() {
      this.ctx.fillStyle = "rgb(255,255,255)"; // bgc
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.points = [];
    },
    // 提交签名
    commit() {
      if (!this.points.length) return this.$toast("请签名");
      this.canvasImg = this.canvas.toDataURL(); // 签名img
      // console.log(this.canvasImg); // 保存签名的base64字符串
      this.$emit("on-save", this.canvasImg);
    },
  },
  mounted() {
    if (this.w > 0 && this.h > 0) {
      this.init();
    }
  },
};
</script>
<style lang='less' scoped></style>
