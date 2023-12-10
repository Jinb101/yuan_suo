<template>
  <div class="source_page">
    <van-empty v-if="!item.length"></van-empty>
    <section v-for="(i, j) in item"
             :key="j"
             class="flex"
             @click.stop="ondetail(i, j)">
      <div class="logo">
        <v-a></v-a>
      </div>
      <div class="text">
        <div class="status">
          <v-more v-model="i.$open"
                  :item="toTag(i, j)"
                  @change="onTagChange"></v-more>
        </div>
        <div class="btn">
          <van-button size="small"
                      round
                      @click.stop="onTagChange({ ext: i, type: 'classes', index: j })"
                      v-if="state">
            分班
          </van-button>
          <van-button size="small"
                      round
                      @click.stop="onTagChange({ ext: i, type: 'flower', index: j })"
                      v-else>
            点击入学
          </van-button>
        </div>
        <h6>
          {{ i.name }}
          <span class="col_primary"
                @click.stop="onTagChange({ ext: i, type: 'label', index: j })">(备注)</span>
        </h6>
        <p>出生日期：{{ i.birthday }}</p>
        <p>联系方式：{{ i.contact }}</p>
        <p>联系地址：{{ i.address || "测试" }}</p>
        <p>
          录入者：{{ appTimeout(i.entry_time) }}由<b class="col_green">{{
            i.staff_name || "管理员"
          }}</b>录入
        </p>
        <p v-if="i.remarks && i.remarks.length">
          最新备注：{{ i.remarks[0].content }}
          <b v-if="i.remarks[0].picture">[图片]</b>
        </p>
      </div>
    </section>
  </div>
</template>

<script>
import vA from "../../private/avatar.vue";
export default {
  props: {
    value: null,
    state: Boolean,
  },
  data() {
    return {};
  },
  computed: {
    item: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
  },
  components: { vA },
  inject: ["appTimeout"],
  watch: {
    item: {
      handler(v) {
        this.$emit("input", v);
      },
      deep: true,
    },
  },
  methods: {
    toTag(e, index) {
      let a = [13, 15];
      if (this.state) {
        a.push(16);
      } else {
        a.push(14);
      }
      // eslint-disable-next-line
      return demo.siteConfig.text.tag(a, { index, ext: e });
    },
    ondetail(i, j) {
      this.$emit("detail", i, j);
    },
    onTagChange(e) {
      this.$emit("change", e);
    },
  },
  mounted() {
    this.item = this.value;
  },
};
</script>
<style lang='less' scoped>
section {
  padding: 10px;
  background-color: rgba(188, 241, 245, 0.3);
  position: relative;

  &:nth-child(2n) {
    background-color: rgba(250, 241, 192, 0.3);
  }

  align-items: center;

  .logo {
    width: 50px;
    margin-right: 10px;
    height: 50px;
  }

  .text {
    width: calc(100% - 60px);
    font-size: 12px;
    position: relative;
    padding-top: 5px;
    color: #999;

    .status {
      position: absolute;
      right: 0;
      top: 0;
      color: #999;
      font-size: 13px;

      &.send {
        top: 25px;
        font-size: 12px;
      }
    }

    h6 {
      font-weight: 650;
      line-height: 20px;
      margin-bottom: 5px;
      font-size: 15px;
      color: #666;

      span {
        font-size: 13px;
        font-weight: 400;
        padding-left: 10px;
      }
    }

    p+p {
      margin-top: 5px;
    }

    p {
      line-height: 1.2;

      b {
        padding: 0 5px;
      }
    }
  }

  .btn {
    position: absolute;
    right: 8px;
    top: 30px;

    .van-button {
      background-color: transparent;
      border-color: #38f;
      min-width: 60px;
    }
  }
}
</style>
