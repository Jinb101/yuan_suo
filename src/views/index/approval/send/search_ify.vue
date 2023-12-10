<template>
  <div class="search_box">
    <div ref="sollcBox">
      <form class="box_search_form"
            action="/">
        <van-search v-model="search"
                    shape="round"
                    :value="search"
                    :use-action-slot="true"
                    class="search"
                    placeholder="请输入搜索关键词"
                    @search="onSearch">
        </van-search>
        <div @click="onSearch(search)"
             class="search_btn">
          搜索
          <!-- <van-icon name="search"
                    size="30px"
                    class="icon" /> -->
        </div>
      </form>
      <div v-if="!searchItem.length && search">
        <p class="h6 col_danger">暂无该物品，请添加</p>
        <van-field v-model="search"
                   readonly
                   label="物资名称" />
        <van-field v-model="add.ify"
                   label="物资分类"
                   placeholder="请选择物资分类"
                   right-icon="arrow"
                   readonly
                   input-align="right"
                   @click="onOpen(1)" />
        <van-field v-model="add.job"
                   label="物资单位"
                   placeholder="请选择物资单位"
                   right-icon="arrow"
                   readonly
                   input-align="right"
                   @click="onOpen(2)" />
        <div class="w60">
          <van-button block
                      round
                      :color="$js.btnColor"
                      @click="onAdd">添加</van-button>
        </div>
      </div>
      <van-checkbox-group v-model="searchValue">
        <section v-for="(i, j) in searchItem"
                 :key="j + 's'"
                 class="flex search_list"
                 @click="$refs['searchRadio'][j].toggle()">
          <div class="logo"
               @click.stop="appShowImage(i.img)">
            <x-radius>
              <van-image :src="i.img"
                         fit="cover"></van-image>
            </x-radius>
          </div>
          <div class="font">
            <p class="title">{{ i.name }}</p>
            <p>剩余：{{ i.num }}{{ i.unit_name }}</p>
            <p>单价：{{ i.price }}元</p>
          </div>
          <div class="arrow">
            <van-checkbox :name="i.id"
                          ref="searchRadio"></van-checkbox>
          </div>
        </section>
      </van-checkbox-group>
      <div v-if="showLoding"
           class="loding">
        <van-loading />
      </div>
    </div>
    <transition name="van-fade">
      <div class="w80"
           v-if="searchValue.length && searchItem.length">
        <van-button block
                    :color="$js.btnColor"
                    round
                    @click="onSearchSubmit">确认选中({{ searchValue.length }})</van-button>
      </div>
    </transition>
    <v-s v-model="a"
         :open="open"
         :list="searchIfy"></v-s>
    <v-s v-model="b"
         :open="open1"
         :list="searchCls"></v-s>
  </div>
</template>

<script>
import vS from "../../../private/select.vue";
export default {
  props: {
    value: null,

  },
  components: { vS },
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
  inject: ["appShowImage"],
  data() {
    return {
      page: 1,
      limit: 10,
      notSeach: false,
      showLoding: false,
      search: "",
      timer: null,
      searchItem: [],
      searchValue: [],
      add: { ify: "", job: "", cid: "", jid: "" },
      searchIfy: [],
      searchCls: [],
      open: false,
      open1: false,
      a: {},
      b: {},
    };
  },
  watch: {
    list: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
    search(n) {
      console.log(n);
      if (n === '') {
        this.onGetSearch('', 1, 10)
        return
      }
      // eslint-disable-next-line no-undef, new-cap
      let es6 = new demo.es6()
      // eslint-disable-next-line no-undef
      es6.timeoutFn('searchValue', () => {
        this.load = this.$toast.loading();
        this.onGetSearch(n);
        this.load.close();
      }, 600)
      // this.onSearchTime(() => {
      //   this.onGetSearch(n);
      // });
    },
    showFixed(n) {
      if (n) {
        this.onGetSearch("");
      }
    },
    a: {
      handler(n) {
        this.add.ify = n.name;
        this.add.cid = n.id;
        this.add.job = "";
        this.add.jid = "";
      },
      deep: true,
    },
    b: {
      handler(n) {
        this.add.job = n.name;
        this.add.jid = n.id;
      },
      deep: true,
    },
  },

  methods: {
    onSearch(v) {
      // eslint-disable-next-line no-undef, new-cap
      let es6 = new demo.es6()
      this.load = this.$toast.loading();
      if (v !== '') {
        // eslint-disable-next-line no-undef
        es6.timeoutFn('searchValue', () => {
          this.onGetSearch(v);
          this.load.close();
        }, 600)
      }
    },
    onOpen(index) {
      if (index === 1) {
        this.open = !this.open;
      } else {
        this.open1 = !this.open1;
      }
    },
    onGetGoodAll() {
      if (this.searchIfy.length && this.searchCls.length) return 0;
      this.$api.http("getGoodsAll", {}, (res) => {
        this.searchIfy = res.categories;
        this.searchCls = res.units;
      });
    },
    onAdd() {
      let os = {
        name: this.search,
        categories_id: this.add.cid,
        units_id: this.add.jid,
        num: 0,
        price: 0,
        img: "",
      };
      if (!os.categories_id) return this.$js.message("请选择物资分类");
      if (!os.units_id) return this.$js.message("请选择物资单位");
      this.$api.http("setGoodsAdd", os, (e) => {
        this.list = [this.returnOs(e)];
        this.$js.message("添加成功");
      });
    },
    returnOs(s) {
      return {
        cid: s.c_id,
        jid: s.id,
        ify: s.classify_name || s.category,
        job: s.name,
        price: "",
        num: "",
        unit: s.unit_name,
        logo: s.img,
        ext: s,
      };
    },
    onSearchSubmit() {
      let val = this.searchValue;
      let item = this.searchItem
        .filter((s) => {
          return val.indexOf(s.id) >= 0;
        })
        .map((s) => {
          return this.returnOs(s);
        });

      this.list = JSON.parse(JSON.stringify(item));
    },
    onGetSearch(name, page, size) {
      this.$api.http("getGoodsSearch", { page, limit: size, name }, (res) => {
        if (this.searchItem.length === res.length) {
          this.notSeach = true;
        } else {
          this.notSeach = false;
        }
        this.showLoding = false
        this.searchItem = res;
        if (!res.length) {
          this.onGetGoodAll();
        }
      });
    },
    onSearchTime(fn) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        fn();
        clearTimeout(this.timer);
        this.timer = null;
      }, 500);
    },
    handleScroll() {
      const container = this.$refs.sollcBox;
      const scrollHeight = container.scrollHeight;
      const scrollTop = container.scrollTop;
      const clientHeight = container.clientHeight;
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;
      // eslint-disable-next-line no-undef, new-cap
      let es6 = new demo.es6()

      // 设置滚动条距离部的底距离
      this.scrollBottom = distanceToBottom;
      console.log(distanceToBottom, clientHeight, scrollTop);
      // 判断滚动条距离底部的距离是否满足条件
      if (distanceToBottom <= 30 && scrollTop + clientHeight === scrollHeight) {
        if (this.notSeach) {
          return
        }
        this.showLoding = true;
        es6.timeoutFn('scrollBottom', () => {
          this.limit = this.limit + 10;
          this.onGetSearch("", this.page, this.limit);
        }, 500)
      }
    },
  },
  mounted() {
    this.list = this.value;
    this.onGetSearch("", 1, 10);
    let curBox = document.querySelectorAll('.view')[1]
    curBox.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    // 移除滚动事件的监听器
    let curBox = document.querySelectorAll('.view')[1];
    curBox.removeEventListener('scroll', this.handleScroll);
  },

};
</script>
<style lang='less' scoped>
.search_box {
  position: relative;

  .search {
    position: sticky;
    top: 0;
    z-index: 55;
  }

  .h6 {
    text-align: center;
    font-size: 14px;
    padding: 10px 0;
  }

  .search_list {
    padding: 10px;
    background-color: #fff;
    margin-bottom: 2px;
    font-size: 15px;
    position: relative;

    .font {
      flex: 1;
      padding-left: 10px;
      display: flex;
      justify-content: center;
      flex-direction: column;

      .title {
        font-weight: 650;
      }
    }

    .arrow {
      padding: 0 10px;
      display: flex;
      align-items: center;
    }
  }

  .box_search_form {
    display: flex;
    justify-content: space-between;

    .search {
      width: 85%;
    }

    .search_btn {
      font-size: 14px;
      width: 15%;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      letter-spacing: 0.1em;
      color: #717275;
    }
  }

  .loding {
    height: 2rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

}
</style>
