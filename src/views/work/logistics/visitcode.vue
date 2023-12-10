<template>
  <v-view header :text="text">
    <template #menu>
      <span v-if="+id === 1" @click="onto(0)">离园码</span>
      <span v-else @click="onto(1)">入园码</span>
    </template>
    <template>
      <div class="src" @click.stop="onshow" ref="src">
        <div id="qr-code-visits"></div>
      </div>
    </template>
  </v-view>
</template>

<script>
export default {
  data() {
    return { list: [], id: "", qr: null };
  },
  inject: ["appPath", "appShowImage"],
  computed: {
    text() {
      return (+this.id === 1 ? "入" : "离") + "园二维码";
    },
  },
  methods: {
    onto(n) {
      this.appPath("/work_visitcode/" + n, true);
      this.id = n;
      this.init();
    },
    onshow() {
      let src = this.$refs.src;
      // eslint-disable-next-line
      let om = demo.js(src, 0);
      try {
        let img = om.dom().querySelector("img");
        let pic = img.getAttribute("src");
        if (!pic) {
          // eslint-disable-next-line
          let idiv = demo.$.dom("#qr-code-visits canvas");
          pic = idiv.toDataURL("image/png");
        }
        this.appShowImage(pic);
      } catch (e) {
        console.log(e);
      }
    },
    init() {
      let qr = this.$js.def.qrcode;
      let url = +this.id === 0 ? qr.leave() : qr.info();
      if (this.qr) {
        this.qr.clear();
        this.qr.makeCode(url);
        return 0;
      }
      this.$nextTick(() => {
        // eslint-disable-next-line
        this.qr = new QRCode(demo.$.id("qr-code-visits"), {
          text: url,
          width: 250,
          height: 250,
        });
      });
    },
  },
  mounted() {
    this.id = this.$route.params.id || "";
    this.init();
  },
};
</script>
<style lang='less' scoped>
.src {
  width: 250px;
  height: 250px;
  margin: 35px auto;
  // background-color: #f5f5f5;
}
</style>
