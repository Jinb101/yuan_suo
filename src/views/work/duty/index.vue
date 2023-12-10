<template>
  <v-view header>
    <template #menu>
      <span @click="open2 = true">组织架构</span>
    </template>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <van-cell
        :title="i.name"
        :label="i.group_name + '-' + i.job_name"
        v-for="(i, j) in item"
        :key="j"
        is-link
        value="点击编辑"
        @click="onshow(i)"
      ></van-cell>
    </v-page>
    <template #fixed>
      <transition name="van-slide-right">
        <div class="app_show_fixed" v-if="open">
          <v-d :staff="id" @back="open = false"></v-d>
        </div>
      </transition>
      <v-f v-model="open2" :footer="false" text="组织架构">
        <van-empty v-if="!list.length" description="暂无"></van-empty>
        <div class="images" v-for="(i, j) in list" :key="j + 'f'">
          <van-image
            :src="i.url"
            fit="cover"
            @click="appShowImage(list, j, 'url')"
          ></van-image>
        </div>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
import vD from "../../user/my/duty.vue";
export default {
  data() {
    return {
      item: [],
      open: false,
      open2: false,
      id: "",
      list: [],
    };
  },
  watch: {
    open(n) {
      if (!n) {
        this.appPath("/work_duty", true);
      }
    },
    open2(n) {
      if (n) {
        this.oninit();
      }
    },
  },
  inject: ["appPath", "appShowImage"],
  components: { vF, vD },
  methods: {
    oninit() {
      if (this.list.length) return 0;
      this.$api.http("userorg", { type: 2 }, (r) => {
        this.list = r;
      });
    },
    onshow(e) {
      this.id = e.id;
      this.open = true;
      this.appPath("/work_duty/" + this.id, true);
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("userdutys", { page }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
  },
  mounted() {
    this.id = this.$route.params.id || "";
    this.open = this.id > 0;
  },
};
</script>
<style lang='less' scoped>
.images {
  height: 190px;
  margin: 10px;
  border-radius: 25px 5px;
  overflow: hidden;
}
</style>
