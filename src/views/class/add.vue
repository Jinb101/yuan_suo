<template>
  <v-view header
          @on-user="onUser">
    <van-field label="发布类型"
               readonly>
      <template #button>
        <van-radio-group v-model="radio"
                         direction="horizontal">
          <van-radio name="1">图文</van-radio>
          <van-radio name="2">视频</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <div class="emoji_class_box">
      <div id="emoji-class"
           class="class_input"></div>
      <div class="class_upload flex fw">
        <template v-if="+radio === 1">
          <van-cell title="添加图片" />
          <!-- <van-cell title="添加图片" label="最大限制 30 张" /> -->
          <v-uploads v-model="pio">
            <div class="pic">
              <v-upload more
                        @on-loading="onImagePath"
                        @on-path="onImagePath"></v-upload>
            </div>
          </v-uploads>
        </template>
        <template v-else>
          <van-cell title="添加视频"
                    label="横屏拍摄效果佳!视频最长30秒" />
          <v-upload-once class="pic2"
                         type="video"
                         v-model="vio"></v-upload-once>
        </template>
      </div>
    </div>
    <div class="lines"
         v-if="is_change_class">
      <!-- <van-cell title="所在位置" icon="location-o" is-link value=""></van-cell> -->
      <van-cell title="谁可以看"
                icon="user-o"
                is-link
                :value="class_text"
                @click="onChangeClass"></van-cell>
    </div>
    <van-cell title="推送给老师"
              icon="friends-o"></van-cell>
    <v-p api
         v-model="allPeople"></v-p>
    <div class="emoji_box">
      <div class="emoji_box_line">
        <span class="emoji_icon"
              @click.stop="onEmoji">
          <i class="van-icon van-icon-smile-o"
             v-if="!open"></i>
          <i class="van-icon van-icon-ascending"
             v-else></i>
        </span>
      </div>
      <div class="emoji_change demo_scrollbar"
           v-if="open">
        <div class="emoji_line"
             v-for="(i, j) in icon"
             :key="j">
          <h5>{{ i.text }}</h5>
          <ul class="flex fw">
            <li v-for="x in i.count"
                :key="x + '-' + j"
                @click="getEmoji(i.name, x, i.suffix)">
              <van-image :src="toIcon(i.name, x, i.suffix)"></van-image>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="submit_btn">
      <van-button block
                  round
                  :color="$js.btnColor"
                  @click="onSub">发布</van-button>
    </div>
    <template #fixed>
      <v-f :footer="false"
           v-model="class_open">
        <van-radio-group v-model="class_check">
          <van-cell-group>
            <van-cell title="全部班级"
                      clickable
                      @click="class_check = '1'">
              <template #right-icon><van-radio name="1" /></template>
            </van-cell>
            <van-cell title="部分班级"
                      clickable
                      @click="class_check = '2'">
              <template #right-icon><van-radio name="2" /></template>
            </van-cell>
            <template v-if="class_check === '2'">
              <div class="select_class">
                <van-button type="info"
                            size="small"
                            @click="$refs.checkboxs.toggleAll(true)">全选</van-button>
                <van-checkbox-group v-model="class_checkbox"
                                    ref="checkboxs">
                  <van-cell-group>
                    <van-cell :title="x.nickname"
                              clickable
                              v-for="(x, y) in class_list"
                              :key="y + 'c'"
                              @click="toggleClass(y)">
                      <template #right-icon>
                        <van-checkbox :name="x.id"
                                      shape="square"
                                      ref="checkbox" />
                      </template>
                    </van-cell>
                  </van-cell-group>
                </van-checkbox-group>
              </div>
            </template>
            <van-cell title="当前班级"
                      clickable
                      @click="class_check = '3'">
              <template #right-icon><van-radio name="3" /></template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
        <div class="end_btn">
          <van-button block
                      round
                      type="primary"
                      @click="class_open = false">确认选中</van-button>
        </div>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../private/fixed.vue";
import vP from "../private/people.vue";
export default {
  data() {
    return {
      text: "",
      radio: "1",
      // eslint-disable-next-line
      icon: demo.siteConfig.text.emoji,
      open: false,
      open2: false,
      tinymce: null,
      pio: [],
      vio: {},
      class_list: [],
      class_open: false,
      class_check: "3",
      class_checkbox: [],
      is_change_class: false,
      allPeople: [],
      unos: false,
    };
  },
  components: { vF, vP },
  watch: {
    radio() {
      this.pio = [];
      this.vio = {};
    },
    tmpos: {
      handler(n) {
        if (!this.unos) {
          // eslint-disable-next-line
          demo.siteConfig.tempdata("class", n);
        }
      },
      deep: true,
    },
  },
  computed: {
    class_text() {
      return ["", "全部", "部分", "当前"][+this.class_check] + "班级";
    },
    class_ids() {
      let tp = +this.class_check;
      let id = this.$route.params.id || "";
      switch (tp) {
        case 1:
          id = this.class_list
            .map((s) => {
              return s.id;
            })
            .join(",");
          break;
        case 2:
          id = this.class_checkbox.join(",");
          break;
        default:
      }
      return id;
    },
    tmpos() {
      return {
        radio: this.radio,
        text: this.text,
        class_list: this.class_list,
        pio: this.pio,
        vio: this.vio,
        class_check: this.class_check,
      };
    },
  },
  methods: {
    init() {
      // eslint-disable-next-line
      let v = demo.siteConfig.tempdata("class");
      if (v.$time) {
        for (let i in v.data) {
          if (typeof this[i] !== "undefined") {
            this[i] = v.data[i];
          }
        }
        if (v.data.text) {
          if (!this.tinymce) {
            return
          }
          this.tinymce.setContent(v.data.text);
        }
      }
    },
    onUser(e) {
      this.is_change_class = e.is_whether === 1;
    },
    onSub() {
      // console.log(this.class_ids);
      let os = {
        type: this.radio,
        content: this.text.replace(/<p>&nbsp;<\/p>\n<p>&nbsp;<\/p>\n/g, "\n"),
        class_id: this.class_ids,
        push_teacher: this.allPeople
          .map((s) => {
            return s.id;
          })
          .join(","),
      };
      if (+this.radio === 1) {
        // image
        os.imgs = this.pio
          .map((s) => {
            return s.src;
          })
          .join(",");
      } else {
        // video
        os.imgs = this.vio.src || "";
        if (os.imgs === "") return this.$toast("请传入视频");
      }
      this.$api.http("classadd", os, () => {
        this.$toast("添加成功");
        this.tinymce.setContent("");
        // eslint-disable-next-line
        demo.$local.set("class-add-teacher", this.allPeople);
        // eslint-disable-next-line no-undef
        const seLoc = demo.$local.get('PioImgList', {})
        if (seLoc) {
          // eslint-disable-next-line no-undef
          demo.$local.clear('PioImgList')
        }
        // eslint-disable-next-line
        demo.siteConfig.tempdata("class", null, "clear");
        this.$router.back();
      });
      this.open = false;
    },
    onImagePath(e, v) {
      this.unos = true;
      this.pio = v;
      setTimeout(() => {
        this.unos = false;
      }, 2000);
    },
    toIcon(name, index, suffix) {
      // eslint-disable-next-line
      return demo.siteConfig.icon([name, index].join("/"), "emoji", suffix);
    },
    onEmoji() {
      this.open = !this.open;
    },
    getEmoji(name, index, suffix) {
      let src = this.toIcon(name, index, suffix);
      let img = `<img src="${src}" style="width:0.53rem;height:0.53rem">`;
      this.tinymce.insertContent(img);
      // eslint-disable-next-line
      demo.js("#emoji-class").dom().blur();
      this.$nextTick(() => {
        this.onInputs();
      });
    },
    onInputs() {
      this.text = this.tinymce.getContent();
    },
    onChangeClass() {
      if (this.class_list.length) return (this.class_open = true);
      this.$api.http("getClass", {}, (res) => {
        this.class_list = res;
        this.class_open = true;
      });
    },
    toggleClass(index) {
      this.$refs.checkbox[index].toggle();
    },
  },
  mounted() {
    // eslint-disable-next-line no-undef
    const seLoc = demo.$local.get('PioImgList', {})
    console.log(seLoc);
    if (seLoc) {
      this.pio = seLoc
    }
    let that = this;
    console.log(this.ids);
    // eslint-disable-next-line
    let p = demo.$local.get("class-add-teacher", []);
    if (p.length > 0) {
      this.allPeople = p;
    }
    // eslint-disable-next-line
    tinymce.init({
      selector: "#emoji-class",
      inline: true,
      toolbar: false,
      menubar: false,
      placeholder: "这一刻您的想法",
      auto_focus: true,
      init_instance_callback: function (editor) {
        // eslint-disable-next-line no-undef
        that.tinymce = editor;
        editor.on("input", () => {
          that.onInputs();
        });
        editor.on("click", () => {
          that.open = false;
        });
        that.init();
      },
    });
  },
  destroyed() {
    if (this.pio.length > 0) {
      // eslint-disable-next-line no-undef
      demo.$local.set('PioImgList', this.pio)
    } else {
      // eslint-disable-next-line no-undef
      demo.$local.clear('PioImgList')
    }
    this.tinymce && this.tinymce.destroy();
  },
};
</script>
<style lang='less' scoped>
.emoji_class_box {
  padding: 8px;

  .class_input {
    outline: none;
    line-height: 1.5;
    vertical-align: bottom;
    min-height: 60px;
    padding: 6px;
    margin-bottom: 0;
    background-color: #f8f8f8;

    * {
      word-break: break-all;
    }
  }

  .class_upload {
    padding: 6px;
    margin-bottom: 10px;

    >.van-cell {
      margin-bottom: 10px;
    }
  }

  .pic {
    width: 100px;
    height: 100px;
  }

  .pic2 {
    width: 160px;
    height: 90px;
  }

  .emoji_change {
    max-height: 300px;
    padding-bottom: 10px;
    box-sizing: border-box;
  }
}

.emoji_box {
  position: fixed;
  z-index: 200;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #f7f7f7;
  transition: all 0.3s;
}

.emoji_icon {
  width: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: #999;
  cursor: pointer;
}

.emoji_box_line {
  padding: 8px;
}

.emoji_line {
  padding: 0 8px;

  h5 {
    font-size: 14px;
    padding: 5px;
    margin-bottom: 5px;
  }

  li {
    width: 30px;
    height: 30px;
    margin: 4px;
  }
}

.mce-content-body:not([dir="rtl"])[data-mce-placeholder]:not(.mce-visualblocks)::before {
  top: 6px !important;
  font-size: 15px !important;
}

.submit_btn {
  margin: 30px 15% 60px;
  padding-bottom: 80px;
}

.select_class {
  padding: 10px;
  background-color: #f7f7f7;
  padding-bottom: 60px;

  >.van-button {
    margin-bottom: 8px;
    width: 80px;
  }
}

.end_btn {
  position: sticky;
  padding: 10px 15%;
  z-index: 55;
  bottom: 0;
}
</style>
