<template>
  <div class="answer">
    <van-field
      v-model="content"
      rows="3"
      autosize
      label="留言"
      type="textarea"
      maxlength="500"
      placeholder="请输入留言"
      show-word-limit
      label-width="3em"
    />
    <x-content>
      <h6>图片</h6>
      <v-uploads v-model="image">
        <div class="ans_image">
          <v-upload
            more
            moreLength="9"
            @on-path="onanswerimage"
            @on-loading="onanswerimage"
            :ids="'upload-image-' + idr"
          ></v-upload>
        </div>
      </v-uploads>
    </x-content>
    <x-content>
      <h6>附件</h6>
      <v-uploads v-model="files">
        <div class="ans_image">
          <v-upload
            more
            moreLength="9"
            @on-path="onanswerfile"
            @on-loading="onanswerfile"
            :ids="'upload-file-' + idr"
            type="all"
          ></v-upload>
        </div>
      </v-uploads>
    </x-content>
    <div class="btn">
      <van-button block round type="primary" @click="save">{{
        savebtn
      }}</van-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    edit: Boolean,
    value: null,
  },
  data() {
    return {
      content: "",
      image: [],
      files: [],
      // eslint-disable-next-line
      idr: demo.$random.vars(6),
    };
  },
  computed: {
    savebtn() {
      return this.edit ? "确定修改提交" : "回复";
    },
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(n) {
        this.$emit("input", n);
      },
    },
  },
  watch: {
    ext: {
      handler(n) {
        this.setExt();
        this.$emit("input", n);
      },
      deep: true,
    },
  },
  methods: {
    onreset() {
      this.image = this.files = [];
      this.content = "";
    },
    onanswerfile(e, v) {
      this.files = v;
    },
    onanswerimage(s, v) {
      this.image = v;
    },
    save() {
      let img = this.files.concat(this.image).map((s) => {
        return s.src;
      });
      let os = {
        content: this.content,
        file: img.join(","),
      };
      if (this.edit) {
        os = {
          approval_content: this.content,
          approval_file: img,
        };
      }
      this.$emit("change", os);
    },
    setExt() {
      if (this.edit && this.ext.a_id) {
        this.content = this.ext.content;
        let img = this.toImages(this.ext.imgs, this.ext.imgs_url);
        this.image = img.filter((r) => {
          return r.cover === "img";
        });
        this.files = img.filter((r) => {
          return r.cover !== "img";
        });
      }
    },
    toImages(i, baseurl) {
      return JSON.parse(JSON.stringify(i)).map((s) => {
        let x = s.split(".");
        x = x[x.length - 1];
        let os = {
          srcs: s,
          src: s.replace(baseurl, ""),
          cover: "img",
          old: true,
        };
        switch (x) {
          case "docx":
          case "doc":
          case "pdf":
          case "xls":
          case "xlsx":
            // eslint-disable-next-line
            os.base = demo.siteConfig.uploadShow(x);
            os.cover = "pdf";
            break;
          default:
        }
        return os;
      });
    },
  },
  mounted() {
    this.ext = this.value;
    this.setExt();
  },
};
</script>
<style lang='less' scoped>
.ans_image {
  width: 95px;
  height: 95px;
  margin: 0 8px 8px 0;
}
h6 {
  font-size: 15px;
  padding: 8px;
}
.btn {
  margin: 10px 20%;
}
</style>
