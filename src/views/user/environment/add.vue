<template>
  <div class="add">
    <van-cell
      title="环创分类"
      is-link
      :value="t1s ? t1s : '选择分类'"
      @click="open = !open"
    ></van-cell>
    <v-e v-model="os" title avatar auto :edata="edata">
      <div class="btn">
        <van-button block round :color="$js.btnColor" @click="onsubmit">{{
          text
        }}</van-button>
      </div>
    </v-e>
    <v-s :open="open" :list="menu" noselect v-model="t1" @change="ont1"></v-s>
  </div>
</template>

<script>
import vE from "../../editor/index.vue";
import vS from "../../private/select.vue";
export default {
  props: {
    value: null,
  },
  components: { vE, vS },
  data() {
    return {
      os: {
        title: "",
        pic: "",
        text: "",
      },
      img: {},
      type: "",
      menu: [],
      open: false,
      t1: [],
      t1s: "",
      edata: {},
    };
  },
  computed: {
    detail: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    text() {
      return this.detail.$edit ? "编辑" : "发布";
    },
  },
  watch: {
    detail: {
      handler(v) {
        this.$emit("input", v);
      },
      deep: true,
    },
  },
  methods: {
    ont1(e, v) {
      let i = e.filter((r) => {
        return r.id !== "";
      });
      this.type = i[i.length - 1].id;
      this.t1s = i[i.length - 1].text;
    },
    onsubmit() {
      if (!this.os.title) return this.$toast("请输入环创标题");
      if (!this.os.pic) return this.$toast("请上传环创封面");
      if (this.type === "") return this.$toast("请选择环创类型");
      let os = {
        title: this.os.title,
        cover: this.os.pic,
        content: this.os.text,
        classify_id: this.type,
      };
      let api = "environmentadd";
      if (this.detail.$edit) {
        os.id = this.detail.id;
        api = "environmentedit";
      }
      this.$api.http(api, os, () => {
        this.$toast(this.text + "成功");
        this.$emit("end", os);
      });
    },
    init() {
      this.$nextTick(() => {
        if (this.detail.$edit) {
          this.edata = {
            pic: this.detail.covers,
            text: this.detail.content,
            title: this.detail.title,
            url: this.detail.cover,
            edit: true,
          };
          this.type = this.detail.classify_id;
          this.t1s = this.detail.classify_title;
        }
      });
      this.$api.http("environmentify", {}, (r) => {
        // eslint-disable-next-line
        let a = demo.tree(
          r.map((s) => {
            s.text = s.title;
            return s;
          }),
          "id",
          "pid"
        );
        let once = { id: "", text: "全部" };
        a = a.map((s) => {
          if (s.children && s.children.length) {
            s.children = [{ ...once, children: [once] }].concat(
              s.children.map((k) => {
                if (k.children && k.children.length) {
                  k.children = [once].concat(k.children);
                } else {
                  k.children = [once];
                }
                return k;
              })
            );
          } else {
            s.children = [{ ...once, children: [once] }];
          }
          return s;
        });
        this.menu = a;
      });
    },
  },
  mounted() {
    this.detail = this.value;
    this.init();
  },
};
</script>
<style lang='less' scoped>
.btn {
  padding: 0 20%;
}
</style>
