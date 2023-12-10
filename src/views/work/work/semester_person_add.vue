<template>
  <div class="seemester_person_add">
    <van-cell :title="cvalue" is-link @click="onopen1"></van-cell>
    <div class="conts">
      <van-collapse v-model="activeNames" accordion>
        <van-collapse-item title="学期指标目标" name="1">
          <section
            v-for="(i, j) in item.index"
            :key="j + '-line'"
            class="box van-hairline--bottom"
          >
            <span class="num">{{ j + 1 }}</span>
            <span class="btn" @click="onDelItem(i)"
              ><van-icon name="delete-o"
            /></span>
            <van-field
              v-model="i.key"
              label="重点指标"
              placeholder="请输入重点指标"
              maxlength="125"
            />
            <van-field
              v-model="i.target"
              label="保底目标"
              placeholder="请输入保底目标"
              maxlength="125"
            />
            <van-field
              v-model="i.spurt"
              label="冲刺目标"
              placeholder="请输入冲刺目标"
              maxlength="125"
            />
          </section>
          <div class="add">
            <van-button
              block
              round
              icon="plus"
              :color="$js.btnColor"
              size="small"
              @click="onAddItem"
            >
              添加
            </van-button>
          </div>
        </van-collapse-item>
        <van-collapse-item title="学期重点工作" name="2">
          <van-empty
            v-if="!item.work.length"
            description="请选择时间"
          ></van-empty>
          <section
            class="lines van-hairline--bottom"
            v-for="(i, j) in item.work"
            :key="j + '-lin'"
          >
            <h6>{{ i.year }}年{{ i.month }}月重点工作</h6>
            <van-field
              v-model="x.val"
              placeholder="请输入重点工作"
              v-for="(x, y) in i.work"
              :key="y + '-w'"
              maxlength="125"
            >
              <template #button>
                <template>
                  <van-icon
                    name="plus"
                    size="20"
                    v-if="y === i.work.length - 1"
                    @click="onAddList(i, j)"
                  ></van-icon>
                  <van-icon
                    name="minus"
                    size="20"
                    color="tomato"
                    v-else
                    @click="onDelList(j, y)"
                  ></van-icon>
                </template>
              </template>
            </van-field>
          </section>
        </van-collapse-item>
      </van-collapse>
    </div>
    <div class="bottom_h"></div>
    <div class="w60">
      <van-button block round :color="$js.btnColor" @click="onsave"
        >{{ etext }}学期计划</van-button
      >
    </div>
    <v-s
      v-model="a1"
      :list="yearlist"
      :open="open1"
      noselect
      @change="ona1"
    ></v-s>
  </div>
</template>

<script>
import vS from "../../private/select.vue";
export default {
  props: {
    years: {
      type: Array,
      default: () => {
        return [];
      },
    },
    edit: Boolean,
    value: null,
  },
  data() {
    return {
      activeNames: "1",
      item: {
        index: [],
        work: [],
      },
      yearlist: [],
      year: "",
      semester: "",
      ytext: "",
      open1: false,
      a1: [],
    };
  },
  components: { vS },
  computed: {
    etext() {
      return this.edit ? "编辑" : "发布";
    },
    cvalue() {
      if (this.ytext) {
        return "正在" + this.etext + this.ytext + "计划";
      }
      return "选择发布时间";
    },
    det: {
      get: function () {
        return this.value;
      },
      set: function (v) {
        this.$emit("input", v);
      },
    },
  },
  watch: {
    det: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
  },
  methods: {
    onopen1() {
      if (this.edit) return 0;
      this.open1 = !this.open1;
    },
    ona1(e, v) {
      this.year = e[0].value;
      this.semester = e[1].value;
      this.ytext = v.e.join("");
      this.setwork();
    },
    once() {
      this.yearlist = this.years[0];
      if (this.years[1] > 0) {
        this.year = this.years[1];
        this.semester = this.years[2];
        this.ytext = this.years[3];
        this.setwork();
      }
      this.$nextTick(() => {
        this.setext();
      });
    },
    setext() {
      if (!this.edit) return 0;
      let r = this.det;
      let work = r.key_work;
      let index = r.semester_index;
      try {
        work = JSON.parse(work).map((s) => {
          if (s.work && s.work.length) {
            s.work = s.work.map((q) => {
              return { val: q };
            });
          } else {
            s.work = [{ val: "" }];
          }
          return s;
        });
        index = JSON.parse(index);
      } catch (e) {
        work = [];
        index = [];
      }
      this.item = { index, work };
    },
    setwork() {
      let m = ["3,4,5,6,7,8", "9,10,11,12,1,2"];
      let y = this.year;
      let w = m[this.semester - 1].split(",").map((r) => {
        return {
          year: ["1", "2"].indexOf(r) >= 0 ? y + 1 : y,
          month: r,
          work: [{ val: "" }],
        };
      });
      // month year work.val
      this.item.work = w;
    },
    onsave() {
      if (!this.semester) return this.$toast("请先选择时间");
      let work = JSON.parse(JSON.stringify(this.item.work)).map((s) => {
        s.work = (s.work || []).map((r) => {
          return r.val || "";
        });
        return s;
      });
      let index = this.item.index;
      this.$api.http(
        "semesterpersonadd",
        {
          semester_index: JSON.stringify(index),
          key_work: JSON.stringify(work),
          semester: this.semester,
          year: this.year,
        },
        () => {
          this.$toast("操作成功");
          this.$emit("end");
        }
      );
    },
    onDelItem(i) {
      this.item.index = this.item.index.filter((r) => {
        return r.id !== i.id;
      });
    },
    onAddItem() {
      this.item.index.push({
        key: "",
        target: "",
        spurt: "",
        // eslint-disable-next-line
        id: demo.$random.vars(8),
      });
    },
    onAddList(i, j) {
      let len = this.item.work[j].work.filter((s) => {
        return !s.val;
      }).length;
      if (len > 0) {
        return this.$toast("请先完整填写" + i.month + "月重点工作");
      }
      this.item.work[j].work.push({ t: "" });
    },
    onDelList(i, j) {
      this.item.work[i].work = this.item.work[i].work.filter((r, v) => {
        return v !== j;
      });
    },
  },
  mounted() {
    this.once();
  },
};
</script>
<style lang='less' scoped>
.add {
  margin: 20px auto;
  width: 60%;
}
.box {
  position: relative;
  padding-right: 40px;
  margin-bottom: 5px;
  &::before {
    position: absolute;
    left: 0;
    top: 0;
    transform: scale(1.1, 1);
    width: 100%;
    height: 100%;
    background-color: #c3ddf7;
    content: "";
    opacity: 0.2;
  }
  &:nth-child(2n)::before {
    background-color: #c5f8f4;
  }
  .van-cell {
    background: transparent;
  }
  .btn,
  .num {
    position: absolute;
    right: -5px;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 20px;
    color: #999;
  }
  .num {
    top: 0;
    transform: scale(0.7);
    border-radius: 50%;
    border: 1px solid #222;
    color: #333;
  }
  .btn {
    bottom: 30px;
    font-size: 25px;
    color: tomato;
    z-index: 15;
  }
}
.bottom_h {
  height: 60px;
}
</style>
