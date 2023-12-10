<template>
  <v-finance>
    <template #menu>
      <span @click="open = true">添加{{ texts }}</span>
    </template>
    <div class="search">
      <van-search
        v-model="val"
        shape="round"
        background="rgba(0,0,0,0)"
        placeholder="请输入搜索关键词"
        @input="onInput"
      />
    </div>
    <transition name="van-slide-down">
      <div class="add" v-if="open">
        <van-field
          :label="texts + '名称'"
          placeholder="请输入名称"
          required
          label-width="6em"
          v-model="os.customer_name"
        />
        <van-field
          label="编码"
          placeholder="请输入编码"
          label-width="6em"
          v-model="os.customer_code"
        />
        <div class="btn">
          <van-button block plain round type="info" @click="onAdd"
            >提交</van-button
          >
        </div>
        <span class="close" @click="open = false">
          <van-icon name="cross" />
        </span>
      </div>
    </transition>
    <div class="item">
      <van-empty v-if="!item.length"></van-empty>
      <section v-for="(i, j) in item" :key="j" class="sec">
        <van-cell :title="i.customer_name" :label="i.customer_code">
          <span class="col_warning" @click="onCheckEdit(i, j)">编辑</span>
          <span class="col_danger" @click="onDel(i, j)">删除</span>
        </van-cell>
      </section>
    </div>
  </v-finance>
</template>

<script>
export default {
  props: {
    type: { type: String, default: "1" },
  },
  data() {
    return {
      val: "",
      item: [],
      open: false,
      os: {
        customer_name: "",
        customer_code: "",
      },
      timer: null,
    };
  },
  computed: {
    texts() {
      return this.type === "1" ? "客户" : "供应商";
    },
  },
  watch: {
    open(n) {
      if (!n) {
        this.os = { customer_name: "", customer_code: "" };
      }
    },
  },
  methods: {
    onInput() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.init();
        clearTimeout(this.timer);
        this.timer = null;
      }, 500);
    },
    onAdd() {
      let os = {
        customer_type: this.type,
        ...this.os,
      };
      if (os.customer_name === "") {
        return this.$toast("请输入" + this.texts + "名称");
      }
      let index = os.index !== undefined ? os.index : -1;
      let api = "financecustomeradd";
      if (index > -1) {
        delete os.index;
        api = "financecustomeredit";
      }
      this.$api.http(api, os, () => {
        this.$toast((index > -1 ? "编辑" : "添加") + "成功");
        if (index > -1) {
          this.item.splice(index, 1, os);
        } else {
          this.init();
        }
        this.open = false;
      });
    },
    onCheckEdit(e, j) {
      this.os = { ...e, index: j };
      this.open = true;
    },
    onDel(e, j) {
      this.$js.modeldel(() => {
        this.$api.http(
          "financecustomerdel",
          { customer_id: e.customer_id },
          () => {
            this.$toast("删除成功");
            this.item.splice(j, 1);
          }
        );
      });
    },
    init() {
      this.$api.http(
        "financecustomer",
        { customer_type: this.type, customer_name: this.val },
        (r) => {
          this.item = r;
        }
      );
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.search {
  top: 0;
  position: sticky;
  z-index: 50;
}
.add {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 55;
  background-color: #fdfdfd;
  height: 200px;
  border-radius: 0 0 50px 50px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  padding: 10px;
  .btn {
    padding: 20px 20% 0;
  }
  .close {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #f7f7f7;
    font-size: 20px;
    bottom: -70px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
}
.sec {
  background-color: #fff;
  margin-bottom: 10px;
  margin: 10px;
  overflow: hidden;
  border-radius: 10px 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  span[class^="col_"] {
    padding: 0 8px;
  }
}
</style>
