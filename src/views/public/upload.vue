<template>
  <div class="app_upload">
    <!-- 底部 -->
    <button class="m_btn file"
            :id="ids"></button>
    <!-- 展示 -->
    <template v-if="$slots.default">
      <div class="db_image"
           @click="onClick">
        <slot />
      </div>
    </template>
    <van-image class="db_image"
               fit="cover"
               loading-icon="plus"
               error-icon="plus"
               @click="onClick"
               v-else
               :src="src"></van-image>
    <!-- 删除按钮 -->
    <span class="delete"
          v-if="close && del"
          @click="onDel"><van-icon name="cross" /></span>
    <!-- 上传 -->
    <div class="up_cover"
         v-if="height > 0">
      <span :style="coverHeight"></span>
      <p>上传中{{ progressnum }}%</p>
    </div>
  </div>
</template>

<script>
import { ImagePreview, Toast } from "vant";

// eslint-disable-next-line
const config = demo.siteConfig;
export default {
  props: {
    ids: { type: String, default: "upload-file" },
    del: { type: Boolean, default: true },
    type: { type: String, default: "img" },
    noshow: Boolean, // 当上传多个时 无效 [不显示]
    wx: { type: Boolean, default: true },
    more: Boolean,
    moreLength: { type: [String, Number], default: 9999 },
    sort: [String, Number],
    noapi: Boolean,
  },
  data() {
    return {
      height: 0,
      close: false,
      src: "",
      lists: [],
      ext: {},
      config: config.uploadType,
      obj: {},
      is_more: false,
      oldList: [],
      name: "upload",
    };
  },
  watch: {
    src(n) {
      this.close = !!n;
    },
    ext: {
      handler(n) {
        if (this.type !== "img") {
          this.src = n.base || "";
        } else {
          this.src = n.srcs || n.base || "";
        }
        this.height = 100 - (n.num || 100);
      },
      deep: true,
    },
    type() {
      this.$nextTick(() => {
        this.initoncedata();
      });
    },
  },
  computed: {
    coverHeight() {
      return { height: this.height + "%" };
    },
    progressnum() {
      let a = 100 - this.height;
      if (a < 0) {
        a = 0;
      }
      return a;
    },
  },
  methods: {
    onclear(flag) {
      this.oldList = [];
      this.lists = [];
      if (flag) {
        this.onClick();
      }
    },
    onCheckOld(v) {
      if (!v.length) return [];
      let a = v.filter((s) => {
        return s.old;
      });
      this.lists = a.map((s) => {
        delete s.old;
        // eslint-disable-next-line
        s.index = demo.$random.vars(12);
        s.ending = true;
        s.num = 100;
        return s;
      });
    },
    onDelCheck(v) {
      this.oldList = this.oldList.filter((r) => {
        return r.src !== v.src;
      });
      this.lists = this.lists.filter((r) => {
        return r.src !== v.src;
      });
    },
    onDel() {
      let src = this.ext.src;
      this.lists = this.lists.filter((r) => {
        return r.src !== src;
      });
      this.ext = {};
    },
    onClick() {
      // 检测是否预览模式
      if (this.close) {
        if (this.type !== "img") {
          // console.log(this.ext);
          return Toast("不支持预览");
        }
        // 自定义预览 (可 旋转图片) ?d={num} 待定
        return ImagePreview([this.src]);
      }
      // 检测类型
      // eslint-disable-next-line
      if (this.type === "img" && this.wx && demo.es6().isWx()) {
        // 检测类型为图片 且 为 微信浏览器 调用微信取图 if(this.wx)
        return this.onWx();
      }
      // 检测是否多选
      let dom = document.getElementById(this.ids);
      console.log(dom);
      dom.querySelector("label").click();
    },
    onWx() {
      let ts = this;
      ts.$toast.loading();
      let toFile = (imgs, fn) => {
        let files = [];
        if (imgs.length) {
          imgs.forEach((s) => {
            // eslint-disable-next-line
            demo.es6().imageCompress(s, { width: 1920, height: 1080 }, (fd) => {
              files.push(fd);
              if (files.length === imgs.length) {
                fn(files);
              }
            });
          });
        }
      };
      let toShow = (key) => {
        ts.$toast.clear();
        // eslint-disable-next-line
        demo.$vx.start(key, (res) => {
          if (res.code) {
            // eslint-disable-next-line
            demo.$vx.imageFile(
              (rej) => {
                let imgs = rej.filter((r) => {
                  return r !== "";
                });
                toFile(imgs, (file) => {
                  let files = file;
                  ts.$nextTick(() => {
                    if (ts.more) {
                      ts.uploads(files, (list) => {
                        ts.lists.forEach((r, index) => {
                          if (r.ending) return 0;
                          ts.exitToevent(
                            r,
                            list.concat(ts.lists),
                            index,
                            true,
                            4
                          );
                        });
                      });
                    } else {
                      ts.upload(files[0]);
                    }
                  });
                });
              },
              ts.more ? (ts.moreLength > 9 ? 9 : ts.moreLength) : 1
            );
          } else {
            let dom = document.getElementById(ts.ids);
            dom.querySelector("label").click();
          }
        });
      };
      // eslint-disable-next-line
      let key = demo.$local.get("app_wx", {});
      if (!key.into_time) {
        ts.$api.http("wx", {}, (res) => {
          // eslint-disable-next-line
          demo.$local.set("app_wx", {
            into_time: Date.now() + 30e6,
            ...res,
          });
          toShow(res);
        });
      } else {
        toShow(key);
      }
    },
    // 多个上传 noshow无效
    uploads(res, fn, name = "small", type = "img") {
      if (this.noapi && type === "img") {
        this.$emit("base64", res);
        return 0;
      }
      let ts = this;
      let obj = ts.obj || {};
      let oldList = JSON.parse(JSON.stringify(ts.lists))
        .filter((s) => s.ending)
        .map((j) => {
          j.v += 1e3;
          return j;
        });
      oldList = ts.oldList.concat(oldList);
      if (oldList.length) {
        // eslint-disable-next-line
        oldList = demo.array(oldList).unique("index");
      }
      ts.$nextTick(() => {
        ts.lists = Array.from(res).map((k, v) => {
          let cover = ts.type;
          let base = obj.src || k.src || "";
          if (cover === "all") {
            if (k.type.indexOf("image") >= 0) {
              cover = "img";
              base = ts.obj.image;
              type = "img";
            } else {
              cover = "pdf";
            }
          }
          return {
            num: 0,
            src: "",
            v,
            srcs: "",
            error: false,
            msg: "",
            ending: false,
            cover,
            base,
            dire: 0,
            // eslint-disable-next-line
            index: demo.$random.vars(10),
          };
        });
        ts.is_more = false;
        if (oldList.length + ts.lists.length >= ts.moreLength) {
          let min = ts.moreLength - oldList.length;
          ts.lists = ts.lists.splice(0, min);
          res = res.splice(0, min);
          ts.is_more = true;
        }
        let upload = ts.$api.upload;
        ts.$nextTick(() => {
          Array.from(res).forEach((k, v) => {
            let imgs = name === "small" ? k.small : k;
            upload(
              { type, imgs },
              (e) => {
                // console.log("success", e);
                ts.$set(ts.lists[v], "src", e.halfway);
                ts.$set(ts.lists[v], "srcs", e.data);
                fn(oldList);
              },
              (e) => {
                ts.$set(ts.lists[v], "error", true);
                ts.$set(ts.lists[v], "msg", e.msg || e.error || "上传失败");
                ts.$set(ts.lists[v], "num", -1);
                fn(oldList);
              },
              (e) => {
                ts.$set(ts.lists[v], "num", e);
                fn(oldList);
                // console.log("progress", e);
              }
            );
          });
        });
      });
    },
    // 单个上传
    upload(res, name = "small", type = "img") {
      console.log(123);
      this.uploads(
        [res],
        () => {
          let ext = {};
          if (this.noshow) {
            // 不展示
            ext = this.lists[0];
          } else {
            this.ext = this.lists[0];
            ext = this.ext;
          }
          this.exitToevent(ext, this.lists, 0, false, 1);
        },
        name,
        type
      );
    },
    // 压缩视频
    compressVideo(file) {
      // const videoPath = URL.createObjectURL(file);
      // const outputPath = 'output.mp4';
      // ffmpeg(videoPath)
      //   .outputOptions('-vf', 'scale=640:480')
      //   .outputOptions('-c:v', 'libx264')
      //   .outputOptions('-crf', '28')
      //   .output(outputPath)
      //   .on('end', () => {
      //     console.log('视频压缩完成');
      //     const compressedFile = new File([outputPath], 'compressed.mp4');
      //     this.upload(compressedFile, 'video');
      //   })
      //   .on('error', (err) => {
      //     console.error('视频压缩失败:', err.message);
      //   })
      //   .run();
    },
    // 上传除图片外得到文件
    uploadOther(res, type) {
      console.log(res, "upload");
      let ts = this;
      if (res.type.startsWith('video/') && res.size > 499 * 1024 * 1024) {
        this.$toast('文件大于500MB');
        return;
        // let newRes = ts.compressVideo(res);
      }
      if (!ts.more) {
        return ts.upload(res, "text", type);
      }
      ts.uploads(
        res,
        (list) => {
          console.log(list);
          ts.lists.forEach((r, index) => {
            if (r.ending) return 0;
            ts.exitToevent(r, ts.lists.concat(list), index, true, 2);
          });
        },
        "text",
        type
      );
    },
    exitToevent(eve, data, index, flag, num) {
      try {
        let ts = this;
        if (eve.num > 99) {
          if (flag) {
            ts.$set(ts.lists[index], "ending", true);
          }
          console.log(data, index, flag, num);
          ts.$emit("on-path", eve, data, index, ts.sort);
          ts.oldList = data;
        } else {
          ts.$emit("on-loading", eve, data, index, ts.sort);
        }
        if (this.$js.env) {
          console.log(num);
        }
      } catch (error) {
        this.$toast('请重试')
        // 刷新页面
        window.location.reload();
      }
    },
    resetsrc() {
      this.src = "";
    },
    initoncedata() {
      let ts = this;
      ts.obj = ts.config[ts.type] || {};
      let flag = ts.type === "img";
      // eslint-disable-next-line
      let isdom = demo.js("#" + ts.ids);
      if (isdom.child && isdom.child().length > 0) {
        // console.warn("error upload btn");
        isdom.html("");
      }
      // eslint-disable-next-line
      demo.js("#" + ts.ids).file(
        (e) => {
          if (flag) {
            // eslint-disable-next-line
            demo
              .es6()
              .imagesCompress(
                e.files,
                { type: "file", width: 1920, height: 1080 },
                (res) => {
                  if (ts.more) {
                    ts.uploads(res, (list) => {
                      ts.lists.forEach((r, index) => {
                        if (r.ending) return 0;
                        ts.exitToevent(
                          r,
                          list.concat(ts.lists),
                          index,
                          true,
                          3
                        );
                      });
                    });
                  } else {
                    ts.upload(res[0]);
                  }
                }
              );
          } else {
            ts.uploadOther(ts.more ? Array.from(e.files) : e.file, ts.obj.type);
          }
        },
        { more: ts.more, ...(ts.obj.accept || {}) },
        true
      );
    },
  },
  mounted() {
    this.initoncedata();
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

.app_upload {
  width: 100%;
  height: 100%;
  display: block;
  position: relative;

  .file {
    transform: translateX(-1000%) translateY(-1000%);
    z-index: -9999;
    position: absolute;
  }

  .delete {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 15;
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

    span {
      .cover();
      background: linear-gradient(#222 60%, rgba(255, 255, 255, 0));
      opacity: 0.5;
      z-index: 13;
      transition: all 0.3s;
    }

    p {
      color: #fff;
      position: relative;
      z-index: 14;
      text-shadow: 0px 2px 2px #333;
      font-weight: 650;
    }
  }
}
</style>
