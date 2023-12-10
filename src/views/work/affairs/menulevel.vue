<template>
  <v-view header text="关闭右侧按钮会关闭对应功能" @on-view="onview">
    <van-tabs v-model="type" @click="init">
      <van-tab title="园所端控制" name="2"></van-tab>
      <van-tab title="家长端控制" name="1"></van-tab>
      <van-tab title="家园联系册模板" name="3"></van-tab>
    </van-tabs>
    <template v-if="+type === 3">
      <van-cell @click="onsavetemp(1)" is-link>
        <template #title>
          模板1(默认)
          <van-tag v-if="+indextype3 === 1" type="primary"
            >当前使用</van-tag
          ></template
        >
      </van-cell>
      <van-cell @click="onsavetemp(2)" is-link>
        <template #title>
          模板2(蒙氏)
          <van-tag v-if="+indextype3 === 2" type="primary"
            >当前使用</van-tag
          ></template
        >
      </van-cell>
    </template>
    <template v-else-if="item.length">
      <van-cell
        center
        :title="['(', j + 1, ')', ' '].join('') + i.name"
        v-for="(i, j) in item"
        :key="j"
        @click.stop="onchange(!i.open, j, true)"
      >
        <template #right-icon>
          <van-switch
            v-model="i.open"
            size="20"
            :loading="i.load"
            @change="onchange($event, j)"
            @click.stop
          />
        </template>
      </van-cell>
    </template>
    <van-empty v-else description="暂无配置"></van-empty>
  </v-view>
</template>

<script>
export default {
  data() {
    return {
      item: [],
      type: "",
      indextype3: "",
    };
  },
  methods: {
    onchange(e, i, flag) {
      this.$set(this.item[i], "load", true);
      let status = e ? 0 : 1;
      this.$api.http(
        "viewlevelmenuset",
        { type: this.item[i].type, show: status, menu_type: this.type },
        () => {
          this.$toast("变更成功");
          this.$set(this.item[i], "load", false);
          if (flag) {
            this.$set(this.item[i], "open", e);
          }
        }
      );
    },
    onsavetemp(e) {
      this.$api.http("contact40settype", { type: e }, () => {
        this.$toast("变更成功");
        this.indextype3 = e;
      });
    },
    init() {
      this.item = [];
      if (+this.type === 3) {
        this.$api.http("contact40gettype", {}, (r) => {
          this.indextype3 = r;
        });
        return 0;
      }
      this.$api.http("viewlevelmenu", { t: 1, menu_type: this.type }, (r) => {
        this.item = r.map((s) => {
          s.open = +s.is_show === 0;
          s.load = false;
          return s;
        });
      });
    },
    onview() {},
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  destroyed() {
    // eslint-disable-next-line
    demo.$session.clear("view_menu_level");
  },
};
</script>
<style lang='less' scoped>
</style>
