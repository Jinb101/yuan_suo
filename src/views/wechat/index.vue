<template>
  <v-view> <van-button @click="onClick">12</van-button> </v-view>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      token: "",
      id: "",
      ext: {},
    };
  },
  methods: {
    createFile(fn, more) {
      let id = "file_" + demo.$random.vars(10);
      let isDom = demo.js(".btn_file");
      let dom = demo.js("body");
      if (!isDom.dom) {
        let div = demo._div("div", "btn_file");
        dom.appendChild(div);
        div = null;
      }
      let btn = demo._div("button", "m_btn");
      btn.id = id;
      let box = demo.js(".btn_file");
      if (box.child().length) {
        box.child().forEach((k) => {
          demo.js(k, 0).remove();
        });
      }
      let destory = (src) => {
        fn(src);
        setTimeout(() => {
          let isdiv = demo.js("#" + id);
          if (isdiv.dom) {
            isdiv.remove();
          }
        }, 500);
      };
      box.appendChild(btn);
      console.log('压缩');
      let obj = { more: !!more };
      demo.js("#" + id).file((res) => {
        if (more) {
          demo
            .es6()
            .imagesCompress(
              res.files,
              { type: "file", width: 3e3, height: 2e4 },
              (src) => {
                destory(src);
              }
            );
        } else {
          demo
            .es6()
            .imageCompress(
              res.file,
              { type: "file", width: 3e3, height: 2e4 },
              (src) => {
                destory(src);
              }
            );
        }
      }, obj);
      setTimeout(() => {
        demo.js("#" + id + " label").click();
      }, 500);
    },
    upload(file, fn, error, progress) {
      let url = "com/common/uploadImage";
      demo
        .ajax(window.location.origin + "/api/" + url)
        .upload({ type: "img", imgs: file }, (e) => {
          if (e.code === 2) {
            progress ? progress(e.progress * 100) : null;
          } else if (e.code === 200) {
            fn(e.data);
          } else {
            error ? error(e) : null;
          }
        });
    },
    onClick() {
      this.createFile((res) => {
        this.upload(res.small, (rej) => {
          console.log(rej);
        });
      });
    },
  },
  mounted() { },
};
</script>
<style lang='less' scoped></style>
