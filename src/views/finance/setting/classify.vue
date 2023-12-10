<template>
  <v-finance>
    <template #menu>
      <span @click="open = !open">添加分类</span>
    </template>
    <div class="top">
      <van-tabs v-model="type" color="#38f" title-active-color="#38f">
        <van-tab
          :title="i.s"
          :name="i.v"
          v-for="(i, j) in bar"
          :key="j + 'c'"
        ></van-tab>
      </van-tabs>
    </div>
    <div class="tp">
      <transition name="van-fade">
        <div class="add add_ify" v-if="open">
          <van-field
            label="分类名"
            placeholder="请添加分类名字"
            label-width="5em"
            v-model="ify"
          >
            <template #button>
              <span class="col_green" @click="onAdd">添加分类</span>
            </template>
          </van-field>
        </div>
      </transition>
      <van-collapse v-model="a" accordion>
        <van-collapse-item
          :title="i.classify_name"
          :name="i.classify_id"
          v-for="(i, j) in list"
          :key="j"
        >
          <div class="add">
            <van-field
              label="分类明细"
              placeholder="请添加分类明细"
              label-width="5em"
              v-model="ify2"
            >
              <template #button>
                <span class="col_green" @click="onAddIfy(i, j)">添加明细</span>
              </template>
            </van-field>
          </div>
          <template v-if="i.children && i.children.length">
            <van-cell-group v-for="(x, y) in i.children" :key="y + 'c' + j">
              <van-field
                placeholder="请输入分类明细"
                v-model="x.classify_name"
                :readonly="x.$open"
                :class="{ focus: !x.$open }"
              >
                <template #button>
                  <div class="flex ab">
                    <template v-if="!x.$open">
                      <span class="col_green" @click.stop="onEdit(x, y, j)"
                        >确认编辑</span
                      >
                    </template>
                    <template v-else>
                      <span class="col_warning" @click.stop="x.$open = false"
                        >编辑</span
                      >
                      <span
                        class="col_danger"
                        @click.stop="onDel(x, y, j)"
                        v-if="+x.is_loan === 0"
                        >删除</span
                      >
                    </template>
                  </div>
                </template>
              </van-field>
            </van-cell-group>
          </template>
          <div class="dels" v-else>
            <van-button block plain type="danger" round @click="onDelMax(i, j)"
              >删除分类({{ i.classify_name }})</van-button
            >
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </v-finance>
</template>

<script>
export default {
  data() {
    return {
      type: "1",
      list: [],
      bar: ["收入", "支出"].map((s, v) => {
        return { s, v: v + 1 };
      }),
      a: "",
      open: false,
      ify: "",
      ify2: "",
    };
  },
  watch: {
    type() {
      this.open = false;
      this.ify = "";
      this.init();
    },
    open(n) {
      if (n) {
        this.a = "";
      }
    },
    a() {
      this.ify2 = "";
    },
  },
  methods: {
    onEdit(e, j, index) {
      this.$api.http(
        "financeifyedit",
        { ...e, classify_type: this.type },
        () => {
          this.$toast("编辑成功");
          this.$set(this.list[index].children[j], "$open", true);
        }
      );
    },
    onDel(e, j, index) {
      this.$js.modeldel(() => {
        this.$api.http("financeifydel", { classify_id: e.classify_id }, () => {
          this.$toast("删除成功");
          this.list[index].children.splice(j, 1);
        });
      });
    },
    onDelMax(e, j) {
      this.$js.model(
        "删除提示！",
        "是否删除分类" + e.classify_name + "？",
        (r) => {
          if (r) {
            this.$api.http(
              "financeifydel",
              { classify_id: e.classify_id },
              () => {
                this.$toast("删除成功");
                this.list.splice(j, 1);
              }
            );
          }
        }
      );
    },
    onAdd() {
      let os = {
        classify_name: this.ify,
        classify_type: this.type,
        pid: 0,
        accounting_type: "",
      };
      this.$api.http("financeifyadd", os, () => {
        this.$toast("添加成功");
        this.ify = "";
        this.open = false;
        this.init();
      });
    },
    onAddIfy(i, j) {
      let os = {
        classify_name: this.ify2,
        classify_type: this.type,
        pid: i.classify_id,
        accounting_type: i.accounting_type,
      };
      this.$api.http("financeifyadd", os, () => {
        this.$toast("添加成功");
        this.ify = "";
        this.open = false;
        let d = { ...os, $open: true, is_loan: 0 };
        if (this.list[j].children) {
          this.list[j].children.push(d);
        } else {
          this.list[j].children = [d];
        }
        this.ify2 = "";
      });
    },
    init() {
      this.$api.http("financeifyget", { classify_type: this.type }, (r) => {
        // eslint-disable-next-line
        this.list = demo.tree(
          r.map((s) => {
            s.$open = true;
            return s;
          }),
          "classify_id",
          "pid"
        );
        this.a = (this.list[0] || {}).classify_id;
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.top {
  position: sticky;
  top: 0;
  z-index: 50;
}
.ab {
  span {
    padding: 0 5px;
    & + span {
      margin-left: 7px;
    }
  }
}
.focus {
  background-color: rgb(243, 243, 243);
}
.van-cell-group + .van-cell-group {
  margin-top: 2px;
}
.tp {
  padding: 8px;
}
.add {
  padding: 8px;
  background: linear-gradient(#86cacb, #a8dee0);
  border-radius: 15px 5px;
  margin-bottom: 15px;
}
.add_ify {
  border-radius: 5px;
}
.dels {
  padding: 20px 15%;
}
</style>
