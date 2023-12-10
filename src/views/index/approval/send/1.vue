<template>
  <div class="approval_send">
    <div class="lists">
      <section v-for="(i, j) in list" :key="j" class="van-hairline--bottom">
        <div class="header flex">
          <b>{{ toNum(j + 1) }} </b>
          <span class="del col_danger" @click="onDel(j)">
            <van-icon name="delete-o" />删除
          </span>
        </div>
        <van-cell title="选择物品">
          <span class="search col_warning" @click.stop="onSearchList(j)">
            <van-icon name="search" />点击搜索
          </span>
        </van-cell>
        <div class="app_section" v-if="i.cid">
          <section class="flex">
            <div class="logo">
              <v-logo :src="i.logo" v-if="i.logo"></v-logo>
            </div>
            <div class="text">
              <h6>{{ i.job }}</h6>
              <p>物品分类：{{ i.ify }}</p>
              <template v-if="i.ext">
                <p>物品剩余：{{ i.ext.num }} {{ i.ext.unit_name }}</p>
                <p>历史采购单价：{{ i.ext.price }}元</p>
              </template>
            </div>
          </section>
        </div>
        <van-field
          v-model="i.price"
          label="单价"
          placeholder="请输入单价"
          type="number"
          label-width="3em"
        >
          <template #right-icon>
            <div>元</div>
          </template>
        </van-field>
        <van-field
          v-model="i.num"
          label="数量"
          placeholder="请输入数量"
          type="digit"
          label-width="3em"
        >
          <template #right-icon>
            <div>{{ i.unit }}</div>
          </template>
        </van-field>
      </section>
      <div class="add_btns">
        <van-button block :color="$js.btnColor" @click="pushs"
          >添加采购物品</van-button
        >
      </div>
    </div>
    <v-f
      :index="501"
      v-model="showFixed"
      text="搜索采购物品"
      bgc="#f5f5f5"
      :footer="false"
    >
      <v-search v-model="searchList"></v-search>
    </v-f>
    <v-f
      :index="502"
      v-model="showAdd"
      text="添加物品"
      bgc="#f5f5f5"
      :footer="false"
    >
      <v-a v-model="showAddExt" @on-add="onAddJobSuccess"></v-a>
    </v-f>
  </div>
</template>

<script>
import vF from "../../../private/fixed.vue";
import vSearch from "./search_ify.vue";
import vA from "./add_ify.vue";
import vLogo from "../../../private/avatar.vue";
export default {
  props: {
    value: null,
  },
  data() {
    return {
      select_index: 0,
      showFixed: false,
      searchList: [],
      check: false,
      showAdd: false,
      showAddExt: {},
    };
  },
  components: { vF, vSearch, vA, vLogo },
  inject: ["appShowImage"],
  computed: {
    list: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
  },
  watch: {
    list: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
    searchList: {
      handler(n) {
        if (n.length) {
          this.list.splice(this.select_index, 0, ...n);
          // eslint-disable-next-line
          this.list = demo.array(this.list).unique("jid");
          this.showFixed = false;
        }
      },
      deep: true,
    },
    showAdd(n) {
      if (!n) {
        this.$set(this.list[this.select_index], "job", "");
      }
    },
  },
  methods: {
    onAddJobSuccess(val) {
      this.showAdd = false;
      this.$set(this.list[this.select_index], "price", val.price);
      this.$set(this.list[this.select_index], "num", val.num);
      this.$set(this.list[this.select_index], "unit", val.unit_name);
      this.$set(this.list[this.select_index], "ify", val.category);
      this.$set(this.list[this.select_index], "cid", val.c_id);
      this.$set(this.list[this.select_index], "jid", val.id);
      this.$set(this.list[this.select_index], "ext", val);
      this.$nextTick(() => {
        this.$set(this.list[this.select_index], "job", val.name);
      });
    },
    onSearchList(index) {
      this.select_index = index;
      this.showFixed = true;
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
        logo: "",
        price: "",
        num: "",
        unit: "个",
        ify: "",
        job: "",
        cid: "", // 分类id
        jid: "", // 明细id
        ext: {},
      };
    },
    pushs() {
      this.check = false;
      let flag = this.list.filter((r) => !r.jid);
      if (flag.length) {
        this.check = true;
        return this.$js.message("请先完善已添加物品");
      }
      this.list.push(this.objs());
    },
    once() {
      this.$nextTick(() => {
        if (!this.list.length) {
          this.list = [this.objs()];
        }
      });
    },
    init() {},
  },
  mounted() {
    this.list = this.value;
    this.init();
    this.once();
  },
};
</script>
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
  section + section {
    margin-top: 4px;
  }
  section {
    background-color: #fff;
    position: relative;
  }
  .search {
    font-size: 14px;
    padding: 0 8px;
    margin-left: 12px;
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
  .searchs {
    position: relative;
    .search_job {
      position: absolute;
      right: 10px;
      top: 0;
      background-color: #fff;
      z-index: 5;
      width: 50%;
      box-shadow: 0 5px 5px #999;
      overflow-y: scroll;
      max-height: 200px;
      border-radius: 8px;
      box-sizing: border-box;
      li {
        padding: 0 10px;
        height: 40px;
        line-height: 40px;
        font-size: 12px;
        color: #999;
        position: relative;
        &.none {
          justify-content: center;
          color: #333;
          text-align: center;
        }
        background-color: rgb(255, 245, 255);
        &:nth-child(2n) {
          background-color: rgb(255, 252, 247);
        }
        .pro {
          position: absolute;
          top: 0;
          left: 4px;
          width: 4px;
          height: 4px;
          bottom: 0;
          margin: auto;
          border-radius: 50%;
          background-color: tomato;
          &.success {
            background-color: rgb(71, 241, 71);
          }
        }
        b {
          flex: 1;
          font-size: 14px;
          color: #333;
        }
      }
    }
  }
}
.add_btns {
  padding: 10px 10px 0 60%;
  box-sizing: border-box;
}
</style>
