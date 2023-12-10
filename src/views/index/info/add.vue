<template>
  <v-view header :text="subtext + '资讯'" :back="edit" @on-back="onBack">
    <v-e title avatar v-model="ext" ref="editor" :edata="list">
      <template #head>
        <van-cell title="推送方式" label="推送给公众号每月最大限制4条" />
        <div class="radio">
          <van-radio-group v-model="radio" direction="horizontal">
            <van-radio name="0">全园</van-radio>
            <van-radio name="1">公众号</van-radio>
          </van-radio-group>
        </div>
      </template>
      <div class="btn">
        <van-button :color="$js.btnColor" block round @click="onAdd">{{
          subtext
        }}</van-button>
      </div>
    </v-e>
    <template #fixed>
      <v-c v-model="open" :edit="edit" :text="subtext + '成功'"></v-c>
    </template>
  </v-view>
</template>

<script>
import vE from "../../editor/index.vue";
import vC from "../../private/send_status.vue";
export default {
  props: {
    edit: Boolean,
    edata: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      ext: {},
      radio: "0",
      open: false,
      list: {},
    };
  },
  inject: ["reload"],
  watch: {
    open(n) {
      if (!n) {
        this.reload();
      }
    },
    edata: {
      handler() {
        this.setExt();
      },
      deep: true,
    },
    tmpos: {
      handler(n) {
        // eslint-disable-next-line
        demo.siteConfig.tempdata("info", n);
      },
      deep: true,
    },
  },
  computed: {
    subtext() {
      return this.edit ? "编辑" : "添加";
    },
    tmpos() {
      return {
        ext: this.ext,
        radio: this.radio,
      };
    },
  },
  components: { vE, vC },
  methods: {
    onAdd() {
      this.$refs.editor.submit();
      this.$nextTick(() => {
        let os = {
          title: this.ext.title,
          image: this.ext.pic,
          content: this.ext.text,
          is_push: this.radio,
        };
        if (this.edit) {
          os.id = this.edata.id;
          this.$api.http("infoedit", os, () => {
            this.$toast("编辑成功");
            // eslint-disable-next-line
            demo.siteConfig.tempdata("info", null, "clear");
            this.open = true;
          });
          return this.$emit("submit", os);
        }
        this.$api.http("infoadd", os, () => {
          this.$toast("添加成功");
          // eslint-disable-next-line
          demo.siteConfig.tempdata("info", null, "clear");
          this.open = true;
        });
      });
    },
    setExt() {
      if (this.edit) {
        this.list = {
          title: this.edata.title,
          pic: this.edata.images,
          text: this.edata.content,
          url: this.edata.image,
          edit: true,
        };
      } else {
        // eslint-disable-next-line
        let v = demo.siteConfig.tempdata("info");
        if (v.$time) {
          for (let i in v.data) {
            if (typeof this[i] !== "undefined") {
              this[i] = v.data[i];
            }
          }
        }
        // eslint-disable-next-line
        this.ext.rand = demo.rand(4);
      }
    },
    onBack() {
      this.$emit("back");
    },
  },
  mounted() {
    this.setExt();
  },
};
</script>
<style lang='less' scoped>
.van-radio {
  font-size: 15px;
}
.radio {
  padding: 10px 10px 20px;
}
.btn {
  padding: 20px 10%;
}
</style>
