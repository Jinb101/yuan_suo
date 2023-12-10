<template>
  <div class="child_add">
    <van-cell is-link @click="onselctchild" :value="child_name">
      <template #title>
        <span class="col_danger font_bold">请选择宝宝</span>
      </template>
    </van-cell>
    <div class="c_box">
      <h2>作品名称</h2>
      <van-field v-model="os.name" placeholder="请输入作品名称" />
      <h2>内容</h2>
      <van-field
        v-model="os.content"
        rows="2"
        autosize
        type="textarea"
        maxlength="500"
        placeholder="请输入内容"
        show-word-limit
      />
      <h2>封面</h2>
      <v-uploads v-model="imgs" :lists="img2" type="img">
        <div class="image">
          <v-upload
            more
            @on-loading="onImagePath"
            @on-path="onImagePath"
          ></v-upload>
        </div>
      </v-uploads>
      <h2>上传作品</h2>
      <v-upload-once
        v-model="vio"
        type="video"
        class="image"
        @path="onvideo"
        close
      ></v-upload-once>
    </div>
    <div class="w60">
      <van-button block round :color="$js.btnColor" @click="onsave"
        >完成添加</van-button
      >
    </div>
    <v-c
      v-model="cls"
      :open="open"
      :list="childs"
      @change="onchangeclasschild"
    ></v-c>
  </div>
</template>

<script>
import vC from "../../private/select.vue";
export default {
  props: {
    edit: Boolean,
    value: null,
    exts: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      vio: {},
      imgs: [],
      img2: [],
      os: {
        name: "",
        content: "",
        picture: "",
        video: "",
        child_id: "",
      },
      childs: [],
      open: false,
      cls: {},
      child_name: "",
    };
  },
  components: { vC },
  computed: {
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    cid() {
      return this.exts.class_id || "";
    },
  },
  watch: {
    ext: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
  },
  methods: {
    onchangeclasschild(e, v) {
      // eslint-disable-next-line
      let f = demo.$obj(e, 1) === 4;
      let a = f ? this.childs[e[0]].children[e[1]] : this.childs[e];
      this.os.child_id = a.id;
      this.child_name = a.name;
    },
    onselctchild() {
      this.init(() => {
        this.open = !this.open;
      });
    },
    onImagePath(e, v) {
      this.imgs = v;
    },
    onvideo(e) {
      this.os.video = e.src;
    },
    onsave() {
      let os = {
        ...this.os,
        vote_id: this.exts.vote_id,
        picture: this.imgs
          .map((s) => {
            return s.src;
          })
          .join(","),
      };
      if (this.edit) {
        os.voters_id = "";
      }
      this.$api.http("voteadd", os, () => {
        this.$toast("发布成功");
        this.$emit("end", this.edit);
      });
    },
    getchild(class_id, limit = 300) {
      let http = this.$api.http;
      return new Promise((resolve, reject) => {
        http("classesstudent", { page: 1, limit, class_id }, (r) => {
          resolve(r);
        });
      });
    },
    async init(callback) {
      if (this.childs.length > 0) {
        if (callback) {
          callback();
        }
        return 0;
      }
      let fn = this.getchild;
      if (this.cid > 0) {
        this.childs = await fn(this.cid);
        if (callback) {
          callback();
        }
      } else {
        // eslint-disable-next-line
        let items = demo.$session.get("votetochilds", {});
        if (items.time > Date.now() && items.item.length) {
          this.childs = items.item;
          if (callback) {
            callback();
          }
          return 0;
        }
        let load = this.$toast.loading({ duration: 0 });
        this.$api.http("classeslist", { page: 1, limit: 100 }, async (r) => {
          let b = [];
          for (let i = 0; i < r.length; i++) {
            let c = await fn(r[i].id, r[i].class_number + 1);
            b.push({
              id: r[i].id,
              name: r[i].nickname,
              children: c,
              disabled: r[i].class_number < 1,
            });
          }
          this.childs = b;
          // eslint-disable-next-line
          demo.$session.set("votetochilds", {
            item: b,
            time: Date.now() + 36e5,
          });
          if (load) {
            load.clear();
            load = null;
          }
          if (callback) {
            callback();
          }
        });
        setTimeout(() => {
          if (load) {
            load.clear();
            load = null;
          }
        }, 8e3);
      }
    },
    once() {
      let i = this.ext || {};

      if (this.edit) {
        this.$api.http("votedetail", { voters_id: i.voters_id }, (r) => {
          this.os = {
            name: r.name,
            content: r.content,
            picture: r.pictures.join(","),
            video: r.videos,
            child_id: r.child_id,
          };
          this.child_name = r.full_name;
          this.$nextTick(() => {
            this.vio = {
              image: r.video ? r.video_picture : "",
              src: r.videos || "",
            };
            this.imgs = this.img2 = r.picture.map((s, v) => {
              return {
                src: r.pictures[v],
                srcs: s,
                cover: "img",
                old: true,
              };
            });
          });
        });
      }
    },
  },
  mounted() {
    this.ext = this.value;
    this.once();
  },
};
</script>
<style lang='less' scoped>
.child_add {
  > .van-cell {
    margin-bottom: 10px;
  }
  .image {
    width: 100px;
    height: 100px;
    margin: 0 10px 10px 0;
  }
  .c_box {
    padding: 10px;
    background-color: #fff;
    h2 {
      font-weight: 650;
      padding: 10px 0;
      font-size: 15px;
    }
    .van-cell {
      padding: 10px;
      border: 1px solid #999;
      border-radius: 5px;
    }
  }
}
</style>
