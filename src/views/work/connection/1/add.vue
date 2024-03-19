<template>
  <div class="add">
    <div class="head">
      <h2>{{ extchild.name }}</h2>
      <p>
        {{
          [
            +extchild.gender === 1
              ? "男"
              : +extchild.gender === 2
              ? "女"
              : isNaN(extchild.gender)
              ? extchild.gender
              : "",
            extchild.age,
          ].join(" ")
        }}
      </p>
      <p v-if="extchild.class_name">{{ extchild.class_name }}</p>
      <p v-else>学号：{{ extchild.no }}</p>
      <div class="btn" @click="open = !open" v-if="!edit">选用发布过的记录</div>
    </div>
    <div class="cont">
      <h4>观察时间</h4>
      <van-field
        v-model="os.observation_time"
        left-icon="clock-o"
        right-icon="arrow-down"
        placeholder="请选择观察时间"
        readonly
        @click="open3 = !open3"
      />
      <h4>工作主题 <span @click="open5 = true">从库里选择工作</span></h4>
      <van-field
        v-model="library"
        left-icon="clock-o"
        right-icon="arrow-down"
        placeholder="请选择工作主题"
        readonly
        @click="open4 = !open4"
      />
      <h4>工作内容</h4>
      <van-field
        v-model="os.work"
        rows="3"
        autosize
        type="textarea"
        placeholder="请输入工作内容"
        maxlength="300"
      />
      <h4>工作目的</h4>
      <van-field
        v-model="os.purpose"
        rows="3"
        autosize
        type="textarea"
        placeholder="请输入工作目的"
        maxlength="300"
      />
      <h4>工作时间 (分钟)</h4>
      <van-field
        v-model="os.working_hours"
        type="digit"
        placeholder="请输入工作时间"
      />
      <h4>专注时间 (分钟)</h4>
      <van-field
        v-model="os.focus_time"
        type="digit"
        placeholder="非必填，请输入专注时间"
      />
      <h4>工作情况记录 (最多选 2 项)</h4>
      <van-checkbox-group v-model="result" max="2">
        <van-cell-group>
          <van-cell
            v-for="(i, j) in menu"
            clickable
            :key="j"
            :title="i.name"
            @click="toggleresult(j, i.des)"
          >
            <template #right-icon>
              <van-checkbox
                :name="i.id"
                ref="checkboxes"
                :disabled="tocheckboxdis(i.des)"
              />
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
      <h4>工作瞬间 (照片/视频)</h4>
      <div class="images_box flex fw">
        <div class="image_list" v-for="(i, j) in imgs" :key="j + 's'">
          <span class="close" @click.stop="imgs.splice(j, 1)"
            ><van-icon name="cross"
          /></span>
          <img
            :src="i.base"
            alt=""
            class="db_image"
            @click.stop="onshowimage(i)"
          />
          <div
            class="poster"
            v-if="i.cover !== 'img'"
            @click.stop="onshowimage(i)"
          >
            <van-icon name="play-circle-o" />
          </div>
        </div>
        <div class="image_add" @click="open1 = true">
          <van-icon name="plus" />
          <b>点击上传</b>
        </div>
      </div>
      <h4>工作描述</h4>
      <van-field
        v-model="os.description"
        rows="3"
        autosize
        type="textarea"
        placeholder="请输入工作描述(600个字以内)"
        maxlength="600"
        show-word-limit
      />
      <h4>建议采取行动</h4>
      <van-field
        v-model="os.suggest_action"
        rows="3"
        autosize
        type="textarea"
        placeholder="请输入建议采取行动(500个字以内)"
        maxlength="500"
        show-word-limit
      />
    </div>
    <div class="footer_btn flex">
      <van-button
        type="warning"
        block
        @click="onsave(1)"
        v-if="!edit || savebtn"
        >保存</van-button
      >
      <van-button type="primary" block @click="onsave(2)">发布</van-button>
    </div>
    <van-popup v-model="open" closeable get-container="#app" round>
      <div class="his_temp">
        <h6>点击一键使用记录</h6>
        <div class="list_box demo_scrollbar">
          <van-empty description="暂无记录" v-if="!his_list.length"></van-empty>
          <ul>
            <li v-for="(i, j) in his_list" :key="j" @click.stop="onusethis(i)">
              <span>{{ (i.child || {}).name || "宝宝" }}</span
              ><span>{{ (i.observation_library || {}).title }}</span
              ><span class="col_green">{{ appTimeout(i.create_time) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </van-popup>
    <van-action-sheet
      v-model="open1"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onselectupload"
    />
    <div class="hidden_upload" v-if="open2">
      <v-u
        :type="u_type"
        :more="u_type === 'img'"
        moreLength="9"
        :del="false"
        noshow
        @on-path="onupload"
        @on-loading="onuploadload"
        ref="upload"
      ></v-u>
    </div>
    <v-t v-model="times" :open="open3" type="datetime" max="d_1"></v-t>
    <v-s v-model="a4" :open="open4" :list="themeonce"></v-s>
    <v-f v-model="open5" :index="600" :footer="false">
      <van-empty v-if="!theme.length" description="暂无"></van-empty>
      <template v-else>
        <van-tabs v-model="a5" sticky offset-top="1.33rem">
          <van-tab :title="i.title" v-for="(i, j) in theme" :key="j">
            <template v-if="i.children && i.children.length">
              <van-collapse v-model="i.types" accordion>
                <van-collapse-item
                  :title="x.title"
                  :name="x.library_id"
                  v-for="(x, y) in i.children"
                  :key="y + '-' + j"
                >
                  <template v-if="x.children && x.children.length">
                    <van-cell
                      is-link
                      :title="q.title"
                      v-for="(q, w) in x.children"
                      :key="w + '-' + y + '-' + j"
                      @click.stop="onsetlibary(q, x, i)"
                    ></van-cell>
                  </template>
                </van-collapse-item>
              </van-collapse>
              <!-- <div class="l">
                  <section v-for="(x, y) in i.children" :key="y + '-' + j">
                    {{ x.title }}
                  </section>
                </div>
                <div class="r"></div> -->
            </template>
            <van-empty v-else></van-empty>
          </van-tab>
        </van-tabs>
      </template>
    </v-f>
  </div>
</template>

<script>
/* eslint-disable */
import vU from "../../../public/upload.vue";
import vT from "../../../private/time.vue";
import vS from "../../../private/select.vue";
import vF from "../../../private/fixed.vue";
export default {
  props: {
    value: null,
    edit: Boolean,
  },
  data() {
    return {
      value1: "",
      open: false, // 历史发布记录
      open1: false, // 上传
      open2: false, // 控制显示上传控件
      open3: false, // 控制选择时间
      open4: false, // 工作主题
      open5: false,
      menu: [],
      result: [],
      actions: [
        { name: "上传图片", v: "img" },
        { name: "上传视频", v: "video" },
      ],
      u_type: "img",
      imgs: [],
      theme: [],
      times: {},
      os: {
        observation_time: "",
        library_id: "",
        work: "",
        purpose: "",
        working_hours: "",
        focus_time: "",
        work_record: "",
        working_moments: "",
        description: "",
        suggest_action: "",
        status: "",
      },
      library: "",
      a4: {},
      a5: "",
      his_list: [],
      savebtn: false,
    };
  },
  computed: {
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(n) {
        this.$emit("input", n);
      },
    },
    themeonce() {
      return this.theme
        .map((s) => {
          return {
            id: s.library_id,
            name: s.title,
          };
        })
        .concat({ id: 0, name: "其他" });
    },
    extchild() {
      if (this.ext.child && this.ext.child.id) {
        return this.ext.child;
      }
      return this.ext;
    },
    tmpos() {
      return {
        os: this.os,
        u_type: this.u_type,
        imgs: this.imgs,
        result: this.result,
        $lid: this.ext.id,
        library: this.library,
      };
    },
  },
  components: { vU, vT, vS, vF },
  watch: {
    ext: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
    open1(n) {
      if (n) {
        this.open2 = false;
      }
    },
    times: {
      handler(n) {
        if (n.obj) {
          this.os.observation_time = [
            n.obj.y,
            "-",
            n.obj.m,
            "-",
            n.obj.d,
            " ",
            n.obj.h,
            ":",
            n.obj.i,
          ].join("");
        }
      },
      deep: true,
    },
    a4: {
      handler(n) {
        if (n.id || JSON.stringify(n.id + "").indexOf("0") >= 0) {
          this.os.library_id = n.id;
          this.library = n.name;
        }
      },
      deep: true,
    },
    open(n) {
      if (n && !this.his_list.length) {
        this.$api.http(
          "contact40list",
          { page: 1, limit: 200, child_id: this.ext.id, type: 2 },
          (r) => {
            this.his_list = r.list || [];
          }
        );
      }
    },
    tmpos: {
      handler(n) {
        demo.siteConfig.tempdata("child", n);
      },
      deep: true,
    },
  },
  inject: ["appShowImage", "appTimeout"],
  methods: {
    onusethis(e) {
      this.open = false;
      this.$api.http(
        "contact40det",
        { observe_id: e.observe_id, child_id: this.ext.id, open_id: "" },
        (r) => {
          this.seteditdata(r.observe, true);
        }
      );
    },
    tocheckboxdis(e) {
      if (e.length) {
        if (e.length === 1) {
          return this.result.indexOf(e[0]) >= 0;
        }
        let t = this.result;
        let n = e.filter((r) => {
          return t.indexOf(r) >= 0;
        });
        return n.length > 0;
      }
      return false;
    },
    onsave(index) {
      this.os.status = index;
      let img = this.imgs.map((s) => {
        return {
          type: s.cover === "img" ? 1 : 2,
          url: s.src,
        };
      });
      // eslint-disable-next-line
      img = img.length > 1 ? demo.array(img).unique("url") : img;
      let os = {
        ...this.os,
        child_id: this.ext.id,
        work_record: this.result.join(","),
        working_moments: JSON.stringify(img),
      };
      let t = +os.status === 1 ? "保存" : "发布";
      if (!os.child_id) {
        os.child_id = this.ext.child.id;
      }
      if (this.edit) {
        os.observe_id = this.ext.observe.observe_id;
      }
      this.$api.http("contact40add", os, () => {
        this.$toast(t + "成功");
        // eslint-disable-next-line
        demo.siteConfig.tempdata("child", this.ext.id, "clear");
        this.$emit("end");
      });
    },
    onsetlibary(a, b, c) {
      this.os.purpose = a.content;
      this.os.work = [b.title, a.title].join(" ");
      this.os.library_id = c.library_id;
      this.library = c.title;
      this.open5 = false;
    },
    onshowimage(e) {
      if (e.cover === "img") {
        return this.appShowImage(e.base);
      }
      this.$store.dispatch("setH5", {
        type: "video",
        url: e.srcs,
        event: "video",
        time: Date.now(),
      });
    },
    onupload(e) {
      this.$nextTick(() => {
        this.imgs.push(e);
        this.open2 = false;
        this.imgs =
          this.imgs.length > 1
            ? demo.array(this.imgs).unique("base")
            : this.imgs;
      });
    },
    onuploadload(e) {
      if (e.cover === "img") {
        this.imgs.push(e);
        this.imgs =
          this.imgs.length > 1
            ? demo.array(this.imgs).unique("base")
            : this.imgs;
      }
    },
    onselectupload(e) {
      this.u_type = e.v;
      this.open2 = true;
      this.$nextTick(() => {
        this.$refs.upload.onClick();
      });
    },
    toggleresult(index, e) {
      let s = this.tocheckboxdis(e);
      if (s) {
        return this.$toast("不可选择");
      }
      this.$refs.checkboxes[index].toggle();
    },
    seteditdata(obj, flag) {
      let i = this.ext.observe || {};
      if (flag) {
        i = obj || {};
      }
      if (i.child_id) {
        this.os = {
          observation_time: i.observation_time,
          library_id: i.library_id,
          work: i.work,
          purpose: i.purpose,
          working_hours: i.working_hours,
          focus_time: i.focus_time,
          work_record: "",
          working_moments: "",
          description: i.description,
          suggest_action: i.suggest_action,
          status: i.status,
          // observe_id: i.observe_id,
          // child_id: i.child_id,
        };
        if (+i.status === 1) {
          this.os.observe_id = i.observe_id;
        }
        this.library = i.library_title;
        this.result = (i.work_record + "").split(",").map((s) => {
          return +s;
        });
        this.imgs = i.working_moments.map((s) => {
          return {
            cover: +s.type === 1 ? "img" : "video",
            // eslint-disable-next-line
            base: s.type === 1 ? s.urls : demo.siteConfig.uploadShow("mp4"),
            src: s.url,
            srcs: s.urls,
          };
        });
        this.$nextTick(() => {
          // eslint-disable-next-line
          this.times = { obj: demo.timeout(i.observation_time, "object") };
        });
      }
      this.savebtn = this.ext.$save;
    },
    init() {
      if (this.edit) {
        this.seteditdata();
      } else {
        // eslint-disable-next-line
        let v = demo.siteConfig.tempdata("child", this.ext.id);
        if (v.$lid) {
          for (let i in v) {
            if (typeof this[i] !== "undefined") {
              this[i] = v[i];
            }
          }
        }
      }
      // eslint-disable-next-line
      this.times = { obj: demo.timeout("", "object") };
      // 获取历史记录
      // 获取库
      this.$api.http("contact40temp", {}, (r) => {
        this.theme = r.map((s) => {
          s.types = "";
          return s;
        });
      });
      this.$api.http("contact40type", {}, (r) => {
        this.menu = r.map((k, v) => {
          return {
            id: v,
            name: k.title,
            des: k.cannot_combine || [],
          };
        });
      });
    },
  },
  mounted() {
    this.ext = this.value;
    this.init();
  },
};
</script>
<style lang='less' scoped>
.add {
  padding-bottom: 80px;
  .head {
    background-color: #fff;
    height: 84px;
    margin-bottom: 8px;
    box-sizing: border-box;
    padding: 12px;
    position: relative;
    margin-top: 2px;
    .btn {
      position: absolute;
      top: 24px;
      right: 12px;
      width: 134px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background-color: #e6f3e1;
      color: #94ba77;
      font-size: 13px;
      z-index: 30;
    }
    h2 {
      font-size: 15px;
      line-height: 24px;
      font-weight: 650;
      padding: 4px 0;
    }
    p {
      font-size: 12px;
      color: #999;
      & + p {
        margin-top: 4px;
      }
    }
  }
  .cont {
    background-color: #fff;
    box-sizing: border-box;
    padding: 10px 15px 40px;
    > .van-cell {
      padding: 0;
      margin: 10px 0;
      padding: 10px;
      border: 1px solid #eee;
      border-radius: 5px;
    }
  }
  .footer_btn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 80;
    height: 44px;
  }
  h4 {
    font-size: 16px;
    font-weight: 650;
    padding: 10px 0 4px;
    position: relative;
    span {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      font-size: 12px;
      font-weight: 400;
      color: #38f;
      text-decoration: underline;
      padding: 5px;
      margin: auto;
      height: 15px;
      line-height: 15px;
      z-index: 33;
    }
  }
  .image_list,
  .image_add {
    width: 100px;
    height: 100px;
    background-color: #f8f7fa;
    position: relative;
    margin: 0 10px 10px 0;
    img {
      object-fit: cover;
    }
  }
  .image_list {
    .close {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 44;
      width: 25px;
      height: 25px;
      background-color: rgba(34, 34, 34, 0.5);
      color: #fff;
      border-radius: 0 0 0 100%;
      text-align: center;
      line-height: 25px;
      padding-left: 5px;
      box-sizing: border-box;
      font-size: 14px;
    }
    .poster {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      width: 35px;
      height: 35px;
      z-index: 43;
      color: #fff;
      font-size: 35px;
    }
  }
  .image_add {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    flex-direction: column;
    color: #ccc;
    .van-icon {
      font-size: 35px;
      margin-bottom: 8px;
    }
  }
}
.his_temp {
  width: 300px;
  height: 452px;
  max-height: 70%;
  background-color: #fff;
  box-sizing: border-box;
  h6 {
    text-align: center;
    padding: 35px 0 26px;
    font-size: 20px;
    font-weight: 650;
  }
  .list_box {
    height: calc(100% - 81px);
    padding: 0 12px;
    box-sizing: border-box;
    li {
      display: flex;
      height: 34px;
      background-color: #f4f4f4;
      margin-bottom: 10px;
      line-height: 34px;
      span {
        width: 83px;
        text-align: center;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 1px;
        &:last-child {
          letter-spacing: 0;
          width: 110px;
          font-weight: 400;
        }
      }
    }
  }
}
.hidden_upload {
  position: fixed;
  z-index: -1;
  left: 0;
  bottom: 0;
  transform: scale(0);
  width: 1px;
  height: 1px;
}
</style>
