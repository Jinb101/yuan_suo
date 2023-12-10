<template>
  <div class="form_analysis student">
    <div class="h10" :class="{ app_top: !readonly }">
      <div class="box">
        <!-- <van-cell
          :title="s1.text ? s1.text : '选择年份'"
          is-link
          @click="open = !open"
        ></van-cell> -->
        <van-cell
          title="添加小区"
          value="点击添加小区"
          is-link
          @click="add"
          v-if="!readonly"
        ></van-cell>
        <van-cell
          title="目标信息统计"
          :label="alltext"
          v-if="item.length"
        ></van-cell>
      </div>
    </div>
    <v-page ref="page" @on-page="onPage">
      <div class="box" v-for="(i, j) in item" :key="j">
        <h5 class="van-hairline--bottom">
          <b>{{ i.cell_name ? i.cell_name : "小区" + (j + 1) }}</b>
          <span class="right">
            <b>实际住户:{{ i.actual }}/</b>
            <b>目标信息:{{ i.target }}</b>
          </span>
        </h5>
        <div class="input" v-if="!readonly">
          <van-field
            v-model="i.cell_name"
            label="小区名称"
            placeholder="请输入"
          >
            <template #button>
              <span
                class="col_danger"
                @click.stop="ondels(i, j)"
                v-if="i.id > 0"
                >删除</span
              >
            </template>
          </van-field>
        </div>
        <div class="input">
          <van-field
            v-model="i.total"
            label="规划户数"
            placeholder="请输入"
            :readonly="readonly"
            type="number"
          >
            <template #button>
              <b class="val" v-if="readonly">{{ i.total || 0 }}</b>
              户
            </template>
          </van-field>
        </div>
        <div class="input">
          <van-field
            v-model="i.occupancy"
            label="入住率"
            placeholder="请输入"
            :readonly="readonly"
            type="number"
          >
            <template #button>
              <b class="val" v-if="readonly">{{ i.occupancy || 0 }}</b>
              %
            </template>
          </van-field>
        </div>
        <div class="input">
          <van-field
            v-model="i.birth_rate"
            label="出生率"
            placeholder="请输入"
            :readonly="readonly"
            type="number"
          >
            <template #button>
              <b class="val" v-if="readonly">{{ i.birth_rate || 0 }}</b>
              %
            </template>
          </van-field>
        </div>
        <div class="input last" v-if="!readonly">
          <van-button block round :color="$js.btnColor" @click="onsub(i)">
            {{ i.id ? "编辑" : "保存" }}
          </van-button>
        </div>
      </div>
    </v-page>
    <div class="save_btn" v-if="!readonly && item.length">
      <van-button block round type="primary" @click="onsave">
        生成图片
      </van-button>
    </div>
    <!-- <v-s noselect :list="years" v-model="s1" :open="open"></v-s> -->
  </div>
</template>

<script>
import vS from "../../private/select.vue";
export default {
  data() {
    return {
      item: [],
      readonly: false,
      pic: "",
      year: "",
      // years: [],
      // open: false,
      // s1: {},
      list: [],
      head: {},
    };
  },
  watch: {
    item: {
      handler() {
        this.pic = "";
      },
      deep: true,
    },
    // s1: {
    //   handler(n) {
    //     this.year = n.value;
    //     this.onPage(1);
    //   },
    //   deep: true,
    // },
  },
  components: { vS },
  inject: ["appShowImage"],
  computed: {
    alltext() {
      let a = this.head;
      return [
        "规划户数：",
        a.total || 0,
        " 实际住户：",
        a.actual || 0,
        " 目标信息：",
        a.target || 0,
      ].join("");
    },
  },
  methods: {
    ondels(i, j) {
      this.$js.modeldel(() => {
        this.$api.http("analysisstudentdel", { id: i.id }, () => {
          this.$toast("删除成功");
          this.item = this.item.filter((r) => {
            return r.id !== i.id;
          });
        });
      });
    },
    add() {
      this.item.unshift(this.todatas());
    },
    totimes(fn) {
      return new Promise((resolve) => {
        if (fn) {
          fn((val) => {
            resolve(val);
          });
          return 0;
        }
        setTimeout(() => {
          resolve();
        }, 500);
      });
    },
    async onsave() {
      if (this.pic) {
        return this.appShowImage(this.pic);
      }
      this.readonly = true;
      this.$toast.loading({
        message: "正在生成中",
      });
      let top =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;
      await this.totimes();
      // eslint-disable-next-line
      let img = await demo.es6().tocanvas(".student", { y: top });
      this.pic = img.img;
      this.appShowImage(img.img);
      this.$nextTick(() => {
        this.readonly = false;
      });
    },
    onsub(e) {
      let os = {
        year: e.year,
        cell_name: e.cell_name,
        total: e.total,
        actual: e.occupancy,
        birth_rate: e.birth_rate,
      };
      if (e.id) {
        os.id = e.id;
      }
      this.$api.http("analysisstudentadd", os, () => {
        this.$toast((os.id ? "编辑" : "保存") + "成功");
        this.onPage(1);
      });
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      let a = this.todatas;
      this.$api.http("analysisstudent", { page, year: this.year }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        let es = (e.list || []).map((r) => {
          return a(r);
        });
        this.head = e.statistics || {};
        this.item = this.item.concat(es);
        this.$refs.page.onFinish(es.length < 20);
      });
    },
    todatas(a = {}) {
      return {
        year: a.year || this.year || "",
        // year: "",
        id: a.id || "",
        cell_name: a.cell_name || "",
        total: a.total || "",
        actual: a.actual || "",
        birth_rate: +(a.birth_rate || ""),
        target: a.target || "",
        occupancy: +(a.occupancy || ""),
        // eslint-disable-next-line
        index: demo.$random.vars(8),
      };
    },
  },
  mounted() {
    // let y = [];
    // eslint-disable-next-line
    let d = demo.timeout("", "object");
    this.year = d.y;
    // this.s1 = { text: d.y + "年", value: d.y };
    // for (let i = 0; i < 10; i++) {
    //   y.push({ text: d.y - i + "年", value: d.y - i });
    // }
    // this.years = y;
  },
};
</script>
<style lang='less' scoped>
.student {
  overflow: visible;
}
.add {
  margin: 30px auto;
  width: 50%;
}
.box {
  padding-bottom: 0;
  .input.last {
    padding: 15px 20%;
  }
}
</style>
