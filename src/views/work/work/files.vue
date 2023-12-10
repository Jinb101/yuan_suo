<template>
  <div class="plan_add">
    <template v-if="month">
      <van-cell title="选择年月"
                :value="month_val"
                is-link
                @click="month_open = !month_open"></van-cell>
    </template>
    <template v-else-if="week">
      <van-cell :title="week_val"
                label="点击选择第几周"
                is-link
                @click="week_open = !week_open"></van-cell>
    </template>
    <van-cell title="上传图片"
              label="最大可上传9张"></van-cell>
    <x-content>
      <v-uploads v-model="imgs">
        <div class="images">
          <v-upload more
                    @on-loading="onPath2"
                    @on-path="onPath2"
                    moreLength="9"
                    ids="upload-imgs-1"></v-upload>
        </div>
      </v-uploads>
    </x-content>
    <van-cell title="上传文件"
              label="最大可上传9张（Word/Excel/PDF）"></van-cell>
    <x-content>
      <v-uploads v-model="text"
                 type="text"
                 :lists="text2">
        <div class="images">
          <v-upload more
                    @on-loading="onPath"
                    @on-path="onPath"
                    type="all"
                    moreLength="9"></v-upload>
        </div>
      </v-uploads>
    </x-content>
    <template v-if="!nowork">
      <h6>重点工作<b>(期间重点工作安排)</b></h6>
      <div class="list"
           :style="styls">
        <section v-for="(i, j) in item"
                 :key="j"
                 class="flex">
          <van-field v-model="i.t"
                     :label="j + 1"
                     placeholder="请输入重点工作"
                     label-width="2em">
            <template #button>
              <van-button size="mini"
                          round
                          icon="plus"
                          v-if="j === item.length - 1"
                          @click="addItem(j)"></van-button>
              <van-button size="mini"
                          round
                          icon="minus"
                          v-if="j > 0"
                          @click="delItem(j)"></van-button>
            </template>
          </van-field>
        </section>
      </div>
    </template>
    <div class="btn">
      <van-button block
                  :color="bgc"
                  round
                  @click="onSub">{{
                    btnText
                  }}</van-button>
    </div>
    <v-t v-model="month_ext"
         :open="month_open"
         type="year-month"
         max="y_5"
         min="y_10"></v-t>
    <v-s v-model="week_ext"
         :list="week_list"
         :open="week_open"
         text="text"
         @change="onweekchange"
         noselect></v-s>
  </div>
</template>

<script>
import vT from "../../private/time.vue";
import vS from "../../private/select.vue";
// eslint-disable-next-line
const config = demo.siteConfig;
export default {
  props: {
    value: null,
    bgc: { type: String, default: "#18bc9c" },
    edit: Boolean,
    nowork: Boolean,
    month: Boolean,
    week: Boolean,
    monthlist: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      imgs: [],
      text: [],
      text2: [],
      item: [{ t: "" }],
      month_open: false,
      month_ext: {},
      week_open: false,
      week_ext: {},
      week_list: [],
      week_val: "点击选择第几周",
    };
  },
  watch: {
    ext: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
  },
  computed: {
    styls() {
      if (this.bgc) {
        // eslint-disable-next-line
        return { background: demo.$alg.gradients(this.bgc, "#fff") };
      }
      return "";
    },
    btnText() {
      return this.edit ? "编辑" : "添加";
    },
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
    month_val() {
      if (this.month_ext.ymd) {
        return [this.month_ext.obj.y, this.month_ext.obj.m].join("/");
      }
      return "选择年月";
    },
  },
  components: { vT, vS },
  methods: {
    onweekchange(e, v) {
      this.week_val = v.e.join("");
      this.ext.year = e[0].value;
      this.ext.semester = e[1].value;
      this.ext.week = e[2].value;
    },
    onPath(e, list) {
      console.log(list, '----------------------');
      this.text = list;
    },
    onPath2(e, list) {
      this.imgs = list
      console.log(list, this.imgs, '----------------------');
    },
    addItem(j) {
      this.item.push({ t: "" });
    },
    delItem(j) {
      this.item = this.item.filter((r, v) => {
        return v !== j;
      });
    },
    onSub() {
      console.log(this.imgs);
      let img = this.imgs.map((s) => {
        console.log(s);
        return s.src;
      });
      let curImgs = this.imgs.map((s) => {
        console.log(s);
        return s.srcs;
      });
      console.log(this.text, '0-----');
      if (this.text.length) {
        img = img.concat(
          this.text.map((s) => {
            return s.src;
          })
        );
        curImgs = img.concat(
          this.text.map((s) => {
            return s.srcs;
          })
        );
      }
      let list = this.item
        .filter((s) => {
          return s.t !== "";
        })
        .map((r) => {
          return r.t;
        });

      let os = {};
      if (this.month) {
        os.year = this.month_ext.obj.y || "";
        os.what_week = this.month_ext.obj.m || "";
      }
      if (this.week) {
        os.year = this.ext.year || "";
        os.what_week = this.ext.week || "";
        os.semester = this.ext.semester || "";
      }
      this.ext = { ...this.ext, img, curImgs, list, edit: this.edit, type: "btn" };
      console.log(os);
      this.$emit("on-submit", { ...this.ext, $os: os });
    },
    setExt() {
      // eslint-disable-next-line
      let times = demo.timeout("", "object");
      if (this.month) {
        if (this.monthlist.length === 2) {
          // eslint-disable-next-line
          times = demo.timeout(
            new Date(
              [this.monthlist[0], this.monthlist[1], "1"].join("/")
            ).getTime(),
            "object"
          );
        }
        this.month_ext = {
          obj: times,
          ymd: 1,
        };
      }
      if (this.week) {
        let w = [];
        for (let i = 1; i <= 25; i++) {
          w.push({ text: "第" + i + "周", value: i });
        }
        let v = [
          { text: "春季", value: "2", children: w },
          { text: "秋季", value: "1", children: w },
        ];
        let n = [];
        for (let j = 0; j < 20; j++) {
          let s = times.y + 3 - j;

          n.push({ text: s + "年", value: s, children: v });
        }
        this.week_list = JSON.parse(JSON.stringify(n));
        if (this.monthlist.length === 3) {
          this.ext.year = this.monthlist[0];
          this.ext.semester = this.monthlist[1];
          this.ext.week = this.monthlist[2];
        }
        this.week_val = [
          this.ext.year,
          "年",
          +this.ext.semester === 1 ? "秋" : "春",
          "季第",
          this.ext.week,
          "周",
        ].join("");
      }
      if (this.edit) {
        let val = this.ext;
        try {
          if (!this.nowork) {
            this.item = JSON.parse(val.target)
              .map((t) => {
                return { t };
              })
              .concat({ t: "" });
          }
          let fns = (data, flag) => {
            let ex = ["doc", "docx", "xls", "xlsx", "pdf"];
            if (!data || !data.length) return [];
            let arr = data.filter((s) => {
              let v = s.split(".");
              if (flag) {
                return ex.indexOf(v[v.length - 1]) < 0;
              }
              return ex.indexOf(v[v.length - 1]) > -1;
            });
            return arr;
          };
          let text = fns(val.srcs).map((r, v) => {
            let e = r.split(".");
            e = e[e.length - 1];
            let base = "";
            switch (e) {
              case "doc":
              case "docx":
                base = config.uploadType.word.src;
                break;
              case "xls":
              case "xlsx":
                base = config.uploadType.excel.src;
                break;
              case "pdf":
                base = config.uploadType.pdf.src;
                break;
              default:
                base = config.uploadType.all.src;
            }
            return {
              srcs: r,
              src: fns(val.src)[v],
              base,
              old: true,
              cover: base === "" ? "img" : "pdf",
            };
          });
          let imgs = fns(val.srcs, true).map((r, v) => {
            return {
              srcs: r,
              src: fns(val.src, true)[v],
              cover: "img",
              old: true,
            };
          });
          this.text = this.text2 = text;
          this.imgs = imgs;
          console.log(this.imgs, text);
        } catch (e) {
          console.log(e + "");
        }
      }
    },
  },
  mounted() {
    console.log(this.value);
    this.ext = this.value;
    this.setExt();
  },
};
</script>
<style lang='less' scoped>
.images {
  width: 108px;
  height: 108px;
}

h6 {
  font-size: 15px;
  font-weight: 650;
  padding: 10px;

  b {
    padding-left: 8px;
    font-weight: 400;
    font-size: 12px;
    color: #929292;
  }
}

.list {
  padding: 10px;
  box-sizing: border-box;
  background: linear-gradient(#fff, rgb(212, 195, 172));

  section {
    border-radius: 10px;
    overflow: hidden;
  }

  section+section {
    margin-top: 8px;
  }
}

.btn {
  margin: 45px auto 10px;
  width: 140px;
}

.van-cell {
  margin-bottom: 8px;
}
</style>
