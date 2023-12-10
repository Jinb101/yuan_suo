<template>
  <v-view header @on-view="onView">
    <template #menu>
      <span @click="appPath('/info_add')">添加资讯</span>
    </template>
    <v-page ref="page" @on-page="onPage">
      <v-i v-model="item" :del="is_del" @change="onDetail" @edit="onEdit"></v-i>
    </v-page>
    <template #fixed>
      <v-f v-model="open" :footer="false" text="资讯详情" :index="600">
        <template #menu>
          <span @click="edit = true">编辑资讯</span>
        </template>
        <div class="show">
          <h2>{{ ext.title }}</h2>
          <p class="time">{{ appTimeout(ext.create_time, true) }}</p>
          <div class="cont app_frame_content cont" v-html="ext.content"></div>
        </div>
      </v-f>
      <transition name="van-slide-right">
        <div class="app_show_fixed" style="z-index: 610" v-if="edit">
          <v-e :edata="ext" edit @back="edit = false"></v-e>
        </div>
      </transition>
    </template>
  </v-view>
</template>

<script>
import vI from "./item.vue";
import vF from "../../private/fixed.vue";
import vE from "./add.vue";
export default {
  data() {
    return {
      item: [],
      is_del: false,
      id: "",
      open: false,
      ext: {},
      edit: false,
    };
  },
  inject: ["appPath", "appTimeout"],
  components: { vI, vF, vE },
  watch: {
    "$route.params.id"(n) {
      if (+this.id !== +n) {
        this.onDetail(n);
      }
    },
    open(n) {
      if (!n) {
        this.appPath("/info", true);
      }
    },
  },
  methods: {
    onView(e) {
      this.is_del = this.$js.islevel(439, e.level);
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("info", { page, type: 2 }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
    onDetail(e, fn) {
      if (e) {
        this.id = e;
        this.$api.http("infodet", { teachers_id: e }, (res) => {
          this.ext = res;
          if (fn) {
            return fn();
          }
          this.open = true;
        });
      }
    },
    onEdit(e) {
      this.onDetail(e, () => {
        this.edit = true;
      });
    },
  },
  mounted() {
    this.id = this.$route.params.id || "";
    this.onDetail(this.id);
  },
};
</script>
<style lang='less' scoped>
.show {
  font-size: 15px;
  h2 {
    padding: 5px 8px;
    font-weight: 650;
  }
  .time {
    font-size: 12px;
    color: #999;
    margin-bottom: 5px;
    padding-left: 8px;
  }
}
</style>
