<template>
  <div class="editor">
    <div class="head">
      <template v-if="title">
        <van-cell title="标题" />
        <van-field v-model="os.title" placeholder="请输入标题" />
      </template>
      <template v-if="avatar">
        <van-cell title="封面" label="建议传入16:9横屏图片" />
        <x-content>
          <v-upload-once v-model="pic" class="image"></v-upload-once>
        </x-content>
      </template>
      <template v-if="$slots.head">
        <slot name="head" />
      </template>
    </div>
    <div class="ed">
      <div id="editor-view" class="editor_view"></div>
    </div>
    <div class="foot">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: Boolean,
    avatar: Boolean,
    value: null,
    edata: {
      type: Object,
      default: () => {
        return {};
      },
    },
    auto: Boolean,
  },
  data() {
    return {
      text: "",
      open: false,
      item: [],
      tinymce: null,
      os: { title: "" },
      pic: {},
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
        if (n.rand > 999) {
          this.setExt2();
        }
        this.$emit("input", n);
      },
      deep: true,
    },
    edata: {
      handler() {
        this.setExt();
      },
      deep: true,
    },
    "pic.src"() {
      if (this.auto) {
        this.submit();
      }
    },
    "os.title"() {
      if (this.auto) {
        this.submit();
      }
    },
  },
  methods: {
    onInputs() {
      this.text = this.tinymce.getContent();
      this.$nextTick(() => {
        this.submit();
      });
    },
    submit() {
      let obj = {
        ...this.os,
        pic: this.pic.src || "",
        text: this.text,
        pics: this.pic.url || "",
      };
      this.ext = obj;
    },
    setExt() {
      if (this.edata.edit) {
        this.pic = {
          src: this.edata.pic,
          image: this.edata.url,
        };
        this.text = this.edata.text;
        this.os.title = this.edata.title;
      }
    },
    setExt2() {
      this.pic = {
        src: this.ext.pic,
        image: this.ext.pics,
      };
      this.text = this.ext.text;
      this.os.title = this.ext.title;
    },
  },
  mounted() {
    let that = this;
    that.ext = this.value;
    that.setExt();
    let css = that.$js.env ? "../../../static/css/" : "./static/css/";
    // eslint-disable-next-line
    tinymce.init({
      selector: "#editor-view",
      plugins: "image table hr autosave indent2em formatpainter link",
      toolbar: [
        "image indent2em undo redo",
        "underline strikethrough link",
        "alignleft aligncenter alignright",
        "table hr",
        "forecolor backcolor",
        "bullist numlist",
        "lineheight formatpainter searchreplace",
      ].join("|"),
      language: "zh_CN",
      auto_focus: true,
      elementpath: false,
      branding: false,
      placeholder: "这一刻的想法",
      content_css: [css + "base.min.css"],
      init_instance_callback: function (editor) {
        that.tinymce = editor;
        if (that.edata.text && that.edata.edit) {
          editor.setContent(that.edata.text);
        }
        if (that.text) {
          editor.setContent(that.text);
        }
        editor.on("input", () => {
          that.onInputs();
        });
      },
      images_upload_handler: function (data, callback) {
        let file = data.blob();
        // eslint-disable-next-line
        demo
          .es6()
          .imageCompress(
            file,
            { type: "file", width: 1500, height: 2e4 },
            (res) => {
              that.$api.upload({ type: "img", imgs: res.small }, (r) => {
                callback(r.data);
              });
            }
          );
      },
    });
  },
  destroyed() {
    this.tinymce && this.tinymce.destroy();
  },
};
</script>
<style lang="less">
.tox .tox-statusbar {
  display: none !important;
}
</style>
<style lang='less' scoped>
.editor {
  height: 100%;
}
.editor_view {
  outline: none;
  min-height: 70vh;
}
.ed {
  padding: 8px 8px 40px;
}
.image {
  width: 160px;
  height: 90px;
  margin: 10px 0;
}
.head {
  padding-bottom: 10px;
}
.foot {
  padding: 10px;
}
</style>
