<template>
  <v-view header bar :index="499">
    <template #menu>
      <span @click="more = true">群{{ text }}</span>
    </template>
    <div class="app_top">
      <v-s v-model="search" @search="onsearch"></v-s>
    </div>
    <section class="sec" v-for="(i, j) in item" :key="j">
      <div class="flex">
        <div class="logo">
          <van-image :src="i.logo"></van-image>
        </div>
        <div class="text">{{ i.name }}</div>
      </div>
      <span class="status" @click="i.change = !i.change"
        >切换成{{ i.change ? "选择" : "输入" }}模式</span
      >
      <div class="box">
        <van-field
          v-model="i.ext.program"
          :label="text + '类型'"
          :placeholder="todesc(i.change, '类型')"
          label-width="5em"
          :readonly="!i.change"
          @click.stop="onshowchange('program', j, i.change)"
        />
        <van-field
          v-model="i.ext.malformed"
          :label="text + '事项'"
          :placeholder="todesc(i.change, '事项')"
          label-width="5em"
          :readonly="!i.change"
          @click.stop="onshowchange('malformed', j, i.change)"
        />
        <van-field
          v-model="i.ext.minutes"
          :label="text"
          :placeholder="'请输入' + text"
          label-width="5em"
          type="number"
        >
          <template #button>
            <span v-if="i.max < 9999">可分配{{ i.max }}分</span>
          </template>
        </van-field>
        <van-cell
          title="图片记录/缘由"
          label="点击下方上传，仅可传一张"
        ></van-cell>
        <v-upload-once v-model="i.pic" class="img"></v-upload-once>
      </div>
    </section>
    <template #footer>
      <van-button block :color="$js.btnColor" class="h50" @click="onsubmit"
        >提交</van-button
      >
    </template>
    <template #fixed>
      <v-f
        v-model="more"
        :text="'群' + text + '选择考核人'"
        :index="502"
        :footer="false"
      >
        <div class="app_section">
          <van-checkbox-group v-model="changearr">
            <section
              v-for="(i, j) in item"
              :key="j + 'c'"
              class="flex"
              @click="toggle(j)"
            >
              <div class="logo">
                <v-a teacher :src="i.logo"></v-a>
              </div>
              <div class="text">
                <span class="status">
                  <van-checkbox
                    :name="i.ext.staff_id"
                    ref="check"
                  ></van-checkbox>
                </span>
                <h6>{{ i.name }}</h6>
              </div>
            </section>
          </van-checkbox-group>
        </div>
        <div class="w80">
          <van-button
            block
            round
            :color="$js.btnColor"
            :disabled="!changearr.length"
            @click="open = true"
            >确认选中</van-button
          >
        </div>
      </v-f>
      <v-f v-model="open" :footer="false" :text="'批量' + text" :index="505">
        <template #menu>
          <span @click="oschange = !oschange"
            >切换成{{ oschange ? "选择" : "输入" }}模式</span
          >
        </template>
        <section>
          <div class="box">
            <van-field
              v-model="os.program"
              :label="text + '类型'"
              :placeholder="todesc(oschange, '类型')"
              label-width="5em"
              :readonly="!oschange"
              @click.stop="onshowchange('program', -1, oschange)"
            />
            <van-field
              v-model="os.malformed"
              :label="text + '事项'"
              :placeholder="todesc(oschange, '事项')"
              label-width="5em"
              :readonly="!oschange"
              @click.stop="onshowchange('malformed', -1, oschange)"
            />
            <van-field
              v-model="os.minutes"
              :label="text"
              :placeholder="'请输入' + text"
              label-width="5em"
              type="number"
            >
              <template #button>
                <span>可分配{{ osmax }}分</span>
              </template>
            </van-field>
            <van-cell
              title="图片记录/缘由"
              label="点击下方上传，仅可传一张"
            ></van-cell>
            <v-upload-once v-model="ospic" class="img"></v-upload-once>
          </div>
        </section>
        <div class="w80">
          <van-button block round :color="$js.btnColor" @click="onsubmitmore"
            >提交</van-button
          >
        </div>
        <van-divider content-position="left">被选中考核人</van-divider>
        <div class="app_section">
          <section v-for="(i, j) in ositem" :key="j + 'd'" class="flex">
            <div class="logo">
              <v-a teacher :src="i.logo"></v-a>
            </div>
            <div class="text">
              <h6>{{ i.name }}</h6>
            </div>
          </section>
        </div>
      </v-f>
      <van-popup
        v-model="show"
        position="bottom"
        :style="{ height: '60%' }"
        closeable
        round
      >
        <div class="new_type">
          <section v-for="(i, j) in ify" :key="j + '-col'">
            <h6>{{ i.text }}</h6>
            <article>
              <p
                v-for="(x, y) in i.children"
                :key="y + '-e'"
                @click="onConfirm([i.text, x.title], [j, y])"
              >
                {{ x.text }}
              </p>
            </article>
          </section>
        </div>
      </van-popup>
    </template>
  </v-view>
</template>

<script>
import vS from "../../../private/search.vue";
import vF from "../../../private/fixed.vue";
import vA from "../../../private/avatar.vue";
export default {
  data() {
    return {
      type: "",
      search: "",
      item: [],
      ify: [],
      more: false,
      changearr: [],
      open: false,
      os: {
        program: "", // 类型
        malformed: "", // 事项
        minutes: "", // 分数
        picture: "", // 图片
        remarks: "", // 备注
      },
      oschange: false,
      ospic: {},
      show: false,
      osshow: { name: "", index: 0 },
      load: null,
    };
  },
  computed: {
    text() {
      return +this.type === 1 ? "奖分" : "扣分";
    },
    osmax() {
      if (this.changearr.length) {
        let a = this.changearr[0];
        let b = this.item.filter((r) => {
          return r.ext.staff_id === a;
        });
        if (b[0]) {
          return b[0].max;
        }
      }
      return 0;
    },
    ositem() {
      if (this.changearr.length) {
        let a = this.changearr;
        let b = this.item.filter((r) => {
          return a.indexOf(r.ext.staff_id) >= 0;
        });
        return b;
      }
      return [];
    },
  },
  watch: {
    open(n) {
      if (!n) {
        this.more = false;
      }
    },
  },
  inject: ["reload"],
  components: { vS, vF, vA },
  methods: {
    onConfirm(e, j) {
      let index = this.osshow.index;
      if (index === -1) {
        this.os.program = e[0];
        this.os.malformed = e[1];
      } else {
        this.$set(this.item[index].ext, "program", e[0]);
        this.$set(this.item[index].ext, "malformed", e[1] || "其他");
      }
      this.show = false;
    },
    onshowchange(name, index, status) {
      if (status) return 0;
      this.osshow = { name, index };
      this.show = true;
    },
    onsubmitmore() {
      let os = {
        ...this.os,
        type: this.type,
        staff_id: JSON.stringify(this.changearr),
      };
      let flag = os.malformed !== "" && os.minutes !== "" && os.program !== "";
      if (!flag) {
        return this.$toast("请正确输入考核");
      }
      if (this.ospic.src) {
        os.picture = this.ospic.src;
      }
      this.$api.http("integraladds", os, () => {
        this.$toast(this.text + "成功");
        setTimeout(() => {
          this.open = false;
          this.reload();
        }, 500);
      });
    },
    http(os) {
      return new Promise((resolve, reject) => {
        this.$api.http("integraladd", os, () => {
          resolve(os);
        });
      });
    },
    async onsubmit() {
      let a = this.item.map((s) => {
        let e = s.ext;
        let p = s.pic;
        if (p.src) {
          e.picture = p.src;
        }
        return e;
      });
      a = a.filter((r) => {
        return r.malformed !== "" && r.minutes !== "" && r.program !== "";
      });
      if (!a.length) return this.$toast("请正确输入考核");
      if (this.load) {
        try {
          this.load.clear();
        } catch (e) {}
      }
      this.load = this.$toast.loading({ duration: 0 });
      for (let i = 0; i < a.length; i++) {
        await this.http(a[i]);
      }
      this.$toast.clear();
      this.load = null;
      this.$toast(this.text + "成功");
      setTimeout(() => {
        this.open = false;
        this.reload();
      }, 500);
    },
    toggle(index) {
      this.$refs.check[index].toggle();
    },
    todesc(change, text) {
      return "请" + (change ? "输入" : "选择") + this.text + text;
    },
    onsearch() {
      this.getdata();
    },
    init() {
      this.getify();
      this.getdata();
    },
    getify() {
      this.$api.http("integralify", { type: this.type }, (e) => {
        this.ify = e.map((r) => {
          let a = r.actions.map((v) => {
            return {
              text: v.malformed + "(" + v.minutes + "分)",
              title: v.malformed,
              sub: v.minutes,
              id: v.actions_type_id,
            };
          });
          if (!a.length) {
            a = [{ text: "其他", title: "", sub: "", id: "" }];
          }
          return {
            children: a,
            text: r.actions_name,
            id: r.id,
          };
        });
      });
    },
    getdata() {
      this.$api.http("integralget", { name: this.search }, (r) => {
        let type = this.type;
        this.item = r.map((s) => {
          return {
            name: s.name,
            logo: s.avatar,
            id: s.id,
            max: type === 1 ? s.bonus_points : s.deduct_points,
            change: false,
            pic: {},
            ext: {
              staff_id: s.staff_id,
              program: "", // 类型
              malformed: "", // 事项
              minutes: "", // 分数
              picture: "", // 图片
              remarks: "", // 备注
              type, // 奖分扣分
            },
          };
        });
      });
    },
  },
  mounted() {
    this.type = this.$route.params.id || "1";
    this.init();
  },
};
</script>
<style lang='less' scoped>
.sec {
  padding: 10px;
  margin: 10px;
  box-sizing: border-box;
  position: relative;
  .status {
    position: absolute;
    right: 5px;
    top: 5px;
    padding: 5px 10px;
    font-size: 12px;
    color: #99a0c7;
    letter-spacing: 1px;
    font-weight: 650;
  }
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  .logo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    background-color: rgb(235, 235, 235);
  }
  .text {
    width: calc(100% - 50px);
    line-height: 50px;
    padding-left: 10px;
    box-sizing: border-box;
    font-size: 15px;
    font-weight: 650;
  }
  .box {
    padding: 10px 0;
    font-size: 14px;
  }
}
.img {
  width: 100px;
  height: 100px;
  margin: 10px 0 0 10px;
}
.h50 {
  height: 50px;
}
.new_type {
  padding: 10px 10px 20px;
  font-size: 15px;
  overflow-y: scroll;
  height: 100%;
  box-sizing: border-box;
  section {
    margin-bottom: 10px;
    h6 {
      line-height: 35px;
      font-weight: 650;
    }
    p {
      line-height: 25px;
      margin-bottom: 5px;
      color: #18bc9c;
    }
  }
  h2 {
    text-align: center;
    padding: 5px 0 10px;
  }
}
</style>
