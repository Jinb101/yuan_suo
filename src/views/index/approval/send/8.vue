<template>
  <div class="approval_send">
    <div class="tops">
      <van-cell
        title="发起报销"
        value="增加发起报销"
        is-link
        @click="pushs"
      ></van-cell>
    </div>
    <div class="lists">
      <section v-for="(i, j) in list" :key="j" class="van-hairline--bottom">
        <div class="header flex">
          <b>{{ toNum(j + 1) }}</b>
          <span class="del col_danger" @click="onDel(j)"
            ><van-icon name="delete-o" />删除</span
          >
        </div>
        <van-field
          v-model="i.ify"
          label="报销类型"
          placeholder="请选择报销类型"
          right-icon="arrow"
          readonly
          input-align="right"
          @click="onOpen(0, j)"
        />
        <van-field
          v-model="i.job"
          label="报销明细"
          placeholder="请选择报销明细"
          right-icon="arrow"
          readonly
          input-align="right"
          @click="onOpen(1, j)"
        />
        <van-field
          v-model="i.price"
          label="报销金额"
          placeholder="请输入报销金额"
          type="number"
          label-width="5em"
        >
          <template #right-icon>
            <div>元</div>
          </template>
        </van-field>
      </section>
    </div>
    <v-f :index="501" v-model="open" text="选择分类" :footer="false">
      <van-empty v-if="!ify.length" description="暂无分类"></van-empty>
      <!-- {{ child }}/{{ radio }} -->
      <van-radio-group v-model="child">
        <van-collapse v-model="radio" accordion>
          <van-collapse-item
            :name="i.classify_id"
            v-for="(i, j) in ify"
            :key="j + 'f'"
          >
            <template #title>
              <div class="fonts">{{ i.classify_name }}</div>
            </template>
            <van-cell-group>
              <van-cell
                :title="x.classify_name"
                clickable
                @click="child = child === x.classify_id ? '' : x.classify_id"
                v-for="(x, y) in i.children"
                :key="y + 'f' + j"
              >
                <template #right-icon>
                  <van-radio :name="x.classify_id" />
                </template>
              </van-cell>
              <van-cell title="其他" @click="child = child === -1 ? '' : -1">
                <template #right-icon>
                  <van-radio :name="-1" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-collapse-item>
        </van-collapse>
        <div class="none12"></div>
        <!-- <div class="flex fw" v-if="false">
          <section
            class="select_list"
            v-for="(i, j) in ify"
            :key="j + 'f'"
            :style="toZindex(i.classify_id)"
          >
            <div class="head flex" @click="$refs.radio[j].toggle()">
              <p class="name">{{ i.classify_name }}</p>
              <div class="radio">
                <van-radio :name="i.classify_id" ref="radio"></van-radio>
              </div>
            </div>
            <transition name="van-fade">
              <div
                v-if="i.classify_id === radio"
                class="select_child"
                :class="{ right: j % 2 === 0 }"
                ref="child"
              >
                <div class="line" :style="toStyle()"></div>
                <div class="poa" ref="poa">
                  <van-radio-group v-model="child">
                    <div class="flex fw">
                      <template v-if="i.children && i.children.length">
                        <section
                          class="select_child_list"
                          v-for="(x, y) in i.children"
                          :key="y + 'c'"
                          @click.stop="child = x.classify_id"
                        >
                          <p>{{ x.classify_name }}</p>
                          <div class="radio">
                            <van-radio
                              :name="x.classify_id"
                              icon-size="16"
                            ></van-radio>
                          </div>
                        </section>
                      </template>
                      <section
                        class="select_child_list"
                        @click.stop="child = '-1'"
                      >
                        <p>无</p>
                        <div class="radio">
                          <van-radio name="-1" icon-size="16"></van-radio>
                        </div>
                      </section>
                    </div>
                  </van-radio-group>
                </div>
              </div>
            </transition>
          </section>
        </div> -->
      </van-radio-group>
      <div class="w80">
        <van-button block round :color="$js.btnColor" @click="onSelectRadio">{{
          subtext
        }}</van-button>
      </div>
    </v-f>
  </div>
</template>

<script>
import vF from "../../../private/fixed.vue";
export default {
  props: {
    value: null,
  },
  data() {
    return {
      open: false,
      radio: "",
      child: "",
      ify: [],
      index: 0,
      select_index: 0,
      a: "",
    };
  },
  components: { vF },
  computed: {
    list: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
    subtext() {
      if (this.child) {
        return "确认选择";
      }
      if (this.radio) {
        let id = this.radio;
        let t = "该分类";
        try {
          let v = this.ify.filter((r) => {
            return r.classify_id === id;
          })[0];
          t = ["【", v.classify_name, "】"].join("");
        } catch (e) {}
        return "选择" + t;
      }
      return "取消选择";
    },
  },
  watch: {
    list: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
    radio() {
      this.child = "";
    },
  },
  methods: {
    onSelectRadio() {
      this.open = false;
      let id = this.radio;
      let val = this.ify.filter((r) => +r.classify_id === +id);
      if (val.length) {
        val = val[0];
        this.$set(this.list[this.index], "ify", val.classify_name);
        this.$set(this.list[this.index], "cid", val.classify_id);
        let jid = this.child;
        if (+jid === -1) {
          this.$set(this.list[this.index], "job", "其他");
          this.$set(this.list[this.index], "jid", "-1");
          return 0;
        }
        let child =
          (val.children || []).filter((s) => {
            return +s.classify_id === +jid;
          })[0] || {};
        this.$set(this.list[this.index], "job", child.classify_name);
        this.$set(this.list[this.index], "jid", child.classify_id);
      } else {
        console.log("取消选择");
        this.$set(this.list[this.index], "ify", "");
        this.$set(this.list[this.index], "cid", "");
        this.$set(this.list[this.index], "job", "");
        this.$set(this.list[this.index], "jid", "");
      }
    },
    toZindex(id) {
      return { "z-index": this.radio === id ? "5" : 4 };
    },
    toStyle() {
      this.$nextTick(() => {
        let poa = this.$refs.poa[0];
        let line = this.$refs.child[0];
        if (poa && line) {
          line.style.height = poa.clientHeight + 10 + "px";
        }
      });
      return {};
    },
    onOpen(i, j) {
      let os = this.list[j];
      this.open = true;
      this.index = j;
      this.select_index = i;
      this.radio = os.cid || "";
      this.$nextTick(() => {
        this.child = os.jid || "";
      });
    },
    onDel(index) {
      let length = this.list.length;
      if (length <= 1) {
        return this.$js.message("至少留下一项");
      }
      this.$js.model("删除", "是否删除？", (res) => {
        if (res) {
          let val = this.list[index];
          this.list = this.list.filter((r) => {
            if (val.sort !== undefined) {
              return val.sort !== r.sort;
            } else {
              return JSON.stringify(val) !== JSON.stringify(r);
            }
          });
        }
      });
    },
    toNum(n) {
      return n > 100 ? n : (n / 100 + "").replace(".", "");
    },
    objs() {
      let sort = this.list.length;
      return {
        sort,
        price: "",
        ify: "",
        job: "",
        cid: "", // 分类id
        jid: "", // 明细id
        ext: {},
      };
    },
    pushs() {
      let flag = this.list.filter((r) => !r.jid);
      if (flag.length) return this.$js.message("请先完善已添加物品");
      this.list.push(this.objs());
    },
    once() {
      this.$nextTick(() => {
        if (!this.list.length) {
          this.list = [this.objs()];
        }
      });
    },
    init() {
      this.$api.http("financeifyget", { classify_type: 2 }, (res) => {
        // eslint-disable-next-line
        this.ify = demo.tree(res, "classify_id", "pid");
      });
    },
  },
  mounted() {
    this.list = this.value;
    this.init();
    this.once();
  },
};
</script>
<style lang="less">
.approval_send {
  .van-collapse-item__content {
    background-color: rgba(176, 216, 248, 0.5);
  }
  .van-collapse-item__wrapper {
    .van-cell {
      background-color: rgba(255, 255, 255, 0.9);
      color: #1f5f61;
      & + .van-cell {
        margin-top: 2px;
      }
    }
  }
  .van-cell-group {
    background: transparent;
  }
}
</style>
<style lang='less' scoped>
.approval_send {
  position: relative;
}
.tops {
  position: sticky;
  top: 0;
  z-index: 15;
}
.lists {
  margin-top: 8px;
  section + section {
    margin-top: 4px;
  }
  section {
    background-color: #fff;
    position: relative;
  }
  .search {
    position: absolute;
    top: 88px;
    height: 44px;
    line-height: 44px;
    left: 80px;
    z-index: 5;
    font-size: 14px;
    padding: 0 8px;
    .van-icon {
      vertical-align: middle;
    }
  }
  .del {
    font-size: 14px;
    padding: 0 10px;
  }
  .header {
    height: 44px;
    line-height: 44px;
    font-size: 12px;
    .logo {
      padding: 3px;
    }
    b {
      flex: 1;
      padding-left: 10px;
      color: #666;
    }
    .van-icon {
      vertical-align: middle;
    }
  }
}
.select_list {
  width: 50%;
  box-sizing: border-box;
  font-size: 16px;
  margin-bottom: 5px;
  position: relative;
  .head {
    font-weight: 650;
    padding: 8px;
    box-sizing: border-box;
    p {
      flex: 1;
    }
  }
  .select_child {
    position: relative;
    &.right {
      .poa {
        left: 0;
      }
    }
    .poa {
      position: absolute;
      top: 0;
      left: -100%;
      width: 200%;
      box-sizing: border-box;
      padding: 8px;
      background-color: rgb(239, 255, 254);
      font-size: 14px;
      .select_child_list {
        width: 50%;
        padding: 8px;
        box-sizing: border-box;
        display: flex;
        p {
          flex: 1;
        }
      }
    }
  }
}
.dwn {
  vertical-align: middle;
  line-height: 24px;
  padding-left: 10px;
  color: rgb(184, 184, 184);
}
.fonts {
  font-weight: 650;
  font-size: 16px;
}
.none12 {
  padding-bottom: 120px;
}
</style>
