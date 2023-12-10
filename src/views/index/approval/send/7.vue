<template>
  <div class="approval_send">
    <div class="tops">
      <van-cell
        title="领用物品"
        value="增加领用物品"
        is-link
        @click="pushs"
      ></van-cell>
    </div>
    <div class="lists">
      <section v-for="(i, j) in list" :key="j" class="van-hairline--bottom">
        <div class="header flex">
          <div class="logo">
            <x-radius size="38" v-if="i.logo" :cover="false">
              <van-image
                :src="i.logo"
                fit="cover"
                @click="appShowImage(i.logo)"
              ></van-image>
            </x-radius>
          </div>
          <b
            >{{ toNum(j + 1) }}
            <span v-if="check && i.jid === ''" class="col_danger"
              >(未选择物品)</span
            ></b
          >
          <span class="del col_danger" @click="onDel(j)"
            ><van-icon name="delete-o" />删除</span
          >
        </div>
        <van-field
          v-model="i.ify"
          label="分类"
          placeholder="请选择分类"
          right-icon="arrow"
          readonly
          input-align="right"
          @click="onOpen(0, j)"
        />
        <!-- <van-field
          v-model="i.job"
          label="物品"
          placeholder="请选择物品"
          right-icon="arrow"
          readonly
          input-align="right"
          @click="onOpen(1, j)"
        /> -->
        <van-field
          v-model="i.job"
          placeholder="请选择/输入物品"
          right-icon="arrow-down"
          input-align="right"
          label-width="10em"
          @focus="onShowFocus(i, j)"
          @blur="onShowBlur(i, j)"
          @input="onShowInput(i, j)"
        >
          <template #label>
            <b>物品</b>
            <span class="search col_warning" @click.stop="onSearchList(j)">
              <van-icon name="search" />搜索
            </span>
          </template>
        </van-field>
        <div class="searchs">
          <div class="search_job" v-if="+i.show_search === 1">
            <ul>
              <template v-if="i.search && i.search.length">
                <li
                  v-for="(q, w) in i.search"
                  :key="w + 's'"
                  class="flex"
                  @click.stop="onChangeToJob(q, j)"
                >
                  <div class="pro" :class="{ success: q.num > 0 }"></div>
                  <b>{{ q.name }}</b>
                  <span>余{{ q.num }}{{ q.unit_name }}</span>
                </li>
              </template>
            </ul>
          </div>
        </div>
        <van-field label="剩余数量" type="number" label-width="5em" readonly>
          <template #right-icon>
            <div>
              <b :class="{ col_danger: i.num > i.ext.num }">{{ i.ext.num }}</b
              >{{ i.unit }}
            </div>
          </template>
        </van-field>
        <van-field
          v-model="i.num"
          label="领用数量"
          placeholder="请输入数量"
          type="digit"
          label-width="5em"
        >
          <template #right-icon>
            <div>{{ i.unit }}</div>
          </template>
        </van-field>
        <van-field label="是否归还" label-width="5em" readonly>
          <template #button>
            <van-radio-group v-model="i.ret" direction="horizontal">
              <van-radio name="2">否</van-radio>
              <van-radio name="1">是</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </section>
    </div>
    <v-s :open="open" :list="ify" v-model="ifys"></v-s>
    <v-s :open="open1" :list="cls" v-model="clss"></v-s>
    <v-f
      :index="501"
      v-model="showFixed"
      text="搜索领用物品"
      bgc="#f5f5f5"
      :footer="false"
    >
      <v-search v-model="searchList"></v-search>
    </v-f>
  </div>
</template>

<script>
import vS from "../../../private/select.vue";
import vF from "../../../private/fixed.vue";
import vSearch from "./search_ify.vue";
export default {
  props: {
    value: null,
  },
  data() {
    return {
      open: false,
      open1: false,
      ify: [], // 分类
      ifys: {},
      select_index: 0,
      cls: [], // 明细
      clss: {},
      showFixed: false,
      searchList: [],
      check: false, // 检测
    };
  },
  components: { vS, vF, vSearch },
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
    ifys: {
      handler(n) {
        if (!n.id) return 0;
        // this.onGetCls(n.id);
        this.$set(this.list[this.select_index], "ify", n.text);
        this.$set(this.list[this.select_index], "cid", n.id);
        this.$set(this.list[this.select_index], "job", "");
        this.$set(this.list[this.select_index], "jid", "");
        this.$set(this.list[this.select_index], "logo", "");
        this.$set(this.list[this.select_index], "unit", "个");
        this.$set(this.list[this.select_index], "search", []);
        this.$set(this.list[this.select_index], "searchs", []);
        this.onGetCls(n.id, () => {
          this.$set(this.list[this.select_index], "search", this.cls);
          this.$set(this.list[this.select_index], "searchs", this.cls);
        });
      },
      deep: true,
    },
    clss: {
      handler(n) {
        this.toJob(n, this.select_index);
      },
      deep: true,
    },
    searchList: {
      handler(n) {
        if (n.length) {
          let l = n.map((s) => {
            if (s.ret === undefined) {
              s.ret = "2";
            }
            return s;
          });
          this.list.splice(this.select_index, 0, ...l);
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
    toJob(n, index) {
      if (!n.id) return 0;
      this.$set(this.list[index], "job", n.name);
      this.$set(this.list[index], "jid", n.id);
      this.$set(this.list[index], "unit", n.unit_name);
      this.$set(this.list[index], "logo", n.img);
      this.$set(this.list[index], "ext", n);
      this.$set(this.list[index], "show_search", "0");
      this.ifys = {};
    },
    onChangeToJob(i, j) {
      this.$set(this.list[j], "is_click", true);
      if (i.num < 1) {
        return this.$js.message("【" + i.name + "】数量不足");
      }
      this.toJob(i, j);
    },
    onShowInput(i, j) {
      this.$set(this.list[j], "show_search", "1");
      let val = i.job;
      let sea = i.searchs.filter((r) => {
        return r.name.indexOf(val) > -1;
      });
      this.$set(this.list[j], "search", sea);
      this.$set(this.list[j], "jid", "");
    },
    onShowFocus(i, j) {
      // new
      this.$set(this.list[j], "show_search", "1");
      this.$set(this.list[j], "is_click", false);
    },
    onShowBlur(i, j) {
      // new
      setTimeout(() => {
        if (!i.is_click) {
          this.$set(this.list[j], "show_search", "0");
        }
      }, 200);
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
    onOpen(e, index) {
      this.select_index = index;
      if (e === 0) {
        this.open = !this.open;
      } else {
        let id = this.list[index].cid;
        if (!id) {
          return this.$js.message("请选择分类");
        } else {
          this.onGetCls(this.list[index].cid, () => {
            this.open1 = !this.open1;
          });
        }
      }
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
        ret: "2",
        ext: {},
        search: [], // 搜素
        searchs: [],
        show_search: "0",
        is_click: false,
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
      if (!this.list.length) {
        this.list = [this.objs()];
      }
    },
    init() {
      this.$api.http("getGoodsIfy", { is_group: 0 }, (res) => {
        this.ify = res;
      });
    },
    onGetCls(c_id, fn) {
      if (!c_id) return 0;
      this.$api.http("getGoods", { c_id, is_group: 0 }, (res) => {
        this.cls = res;
        // console.log(res);
        // eslint-disable-next-line
        fn ? fn() : null;
      });
    },
    http(id) {
      return new Promise((resolve, reject) => {
        this.$api.http("suppliesdet", { id }, (r, v) => {
          let o = {
            sort: v,
            logo: r.img,
            price: r.price,
            num: r.num,
            unit: r.unit,
            ify: r.category,
            job: r.name,
            cid: r.c_id, // 分类id
            jid: r.u_id, // 明细id
            ret: "2",
            ext: {},
            search: [], // 搜素
            searchs: [],
            show_search: "0",
            is_click: false,
          };
          resolve(o);
        });
      });
    },
    async ongetids(str) {
      this.$toast.loading({ duration: 0 });
      let id = (str + "").split(",");
      id = id.filter((r) => {
        return r !== "";
      });
      let tarr = [];
      let t = this.http;
      for (let i = 0; i < id.length; i++) {
        let v = await t(id[i]);
        tarr.push(v);
      }
      this.list = tarr;
      this.$toast.clear();
      tarr = null;
    },
  },
  mounted() {
    let ids = this.$route.params.ids;
    this.list = this.value;
    this.init();
    if (ids) {
      this.ongetids(ids);
    } else {
      this.once();
    }
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
  margin-top: 8px;
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
</style>
