<template>
  <div class="info_item">
    <van-empty v-if="!item.length" description="暂无园所资讯"></van-empty>
    <section
      v-for="(i, j) in list"
      :key="j"
      class="flex van-hairline--bottom"
      @click="onDet(i, j)"
      :class="{ pad: pad }"
    >
      <div class="avatar">
        <van-image
          :src="i.image[0]"
          fit="cover"
          @click.stop="appShowImage(i.image[0])"
          lazy-load
        ></van-image>
      </div>
      <div class="strong">
        <h2 class="van-multi-ellipsis--l2">{{ i.title }}</h2>
        <p class="desc van-multi-ellipsis--l2" v-html="i.content"></p>
        <span class="time">{{ appTimeout(i.create_time, true) }}</span>
      </div>
      <v-more
        v-model="i.open"
        class="tag_up"
        :item="toTag(i, j)"
        @change="onTagChange"
      ></v-more>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    value: null,
    del: Boolean,
    pad: Boolean,
    watch: Boolean,
  },
  data() {
    return {
      list: [],
      player: [],
    };
  },
  inject: ["appTimeout", "appPath", "appShowImage"],
  computed: {
    item: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
  },
  watch: {
    item: {
      handler(n) {
        this.init();
        this.$emit("input", n);
      },
      deep: true,
    },
  },
  methods: {
    toTag(e, index) {
      let a = [4, 5];
      if (this.del) {
        a.push(1);
      }
      // eslint-disable-next-line
      return demo.siteConfig.text.tag(a, { index, ext: e });
    },
    onDet(e, i) {
      this.onTagChange({ type: "view", ext: e, index: i });
    },
    onTagChange(e) {
      let edata = e.ext;
      switch (e.type) {
        case "view":
          this.appPath("/info/" + edata.id, !this.watch);
          this.$emit("change", edata.id);
          break;
        case "edit":
          this.$emit("edit", edata.id);
          break;
        case "del":
          this.$js.model("删除确认", "是否删除园所资讯", (res) => {
            if (res) {
              this.$api.http("infodel", { id: edata.id }, () => {
                this.list.splice(e.index, 1);
                this.$toast("删除成功");
              });
            }
          });
          break;
        default:
      }
    },
    init() {
      let a = JSON.parse(JSON.stringify(this.item));
      this.list = a.map((s) => {
        s.open = false;
        return s;
      });
    },
  },
  mounted() {
    this.item = this.value;
    this.init();
  },
};
</script>
<style lang='less' scoped>
section {
  position: relative;
  padding: 10px 0;
  background-color: #fff;
  margin: 0 10px;
  &.pad {
    margin: 0;
  }
  .avatar {
    width: 100px;
    height: 100px;
    background-color: #f7f7f7;
    border-radius: 5px;
    overflow: hidden;
  }
  .strong {
    width: calc(100% - 100px);
    box-sizing: border-box;
    padding-left: 10px;
    font-size: 15px;
  }
  .desc {
    line-height: 15px;
    font-size: 14px;
    height: 30px;
    color: #999;
  }
  h2 {
    padding: 5px 0;
    line-height: 18px;
    height: 36px;
    font-weight: 650;
  }
  .time {
    position: absolute;
    bottom: 5px;
    left: 110px;
    font-size: 12px;
    color: #999;
  }
}
.tag_up {
  right: 10px;
  bottom: 5px;
  position: absolute !important;
}
</style>
