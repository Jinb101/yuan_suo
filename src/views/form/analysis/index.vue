<template>
  <v-view header :text="subtitle" @on-view="onconfig">
    <van-cell
      v-for="(i, j) in item"
      :key="j"
      is-link
      :icon="i.icon"
      :label="'点击查看' + i.text"
      @click="onclick(i)"
    >
      <template #title>
        {{ i.text }}
      </template>
    </van-cell>
    <template #fixed>
      <v-f :index="500" :footer="false" v-model="open" :text="list.text" cover>
        <template #menu>
          <span v-if="list.del" @click.stop="onevents">{{
            eventstatus ? "退出管理" : "删除管理"
          }}</span>
          <span v-if="list.add" @click.stop="oneventsadd">发布</span>
        </template>
        <component
          :is="mycomponent"
          v-if="mycomponent"
          :ext="config"
          :enum="eventstatus"
          :eadd="eventadd"
        ></component>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
export default {
  data() {
    return {
      item: [],
      det: {},
      open: false,
      list: {},
      config: {},
      eventstatus: false,
      eventadd: 0,
    };
  },
  inject: ["appPath"],
  components: { vF },
  watch: {
    open(n) {
      if (!n) {
        this.appPath("/form_analysis", true);
        this.eventstatus = false;
      }
    },
  },
  computed: {
    subtitle() {
      return this.det.text || "";
    },
    mycomponent() {
      let name = this.list.path;
      if (name) {
        return () => import("@/views/form/analysis" + name + ".vue");
      } else {
        return null;
      }
    },
  },
  methods: {
    onevents() {
      this.eventstatus = !this.eventstatus;
    },
    oneventsadd() {
      this.eventadd++;
    },
    onconfig(e) {
      this.config = e;
    },
    onclick(e) {
      this.appPath("/form_analysis" + e.path, true);
      this.list = e;
      this.open = true;
    },
  },
  mounted() {
    let path = this.$route.path;
    let v = {};
    try {
      v = this.$js.def.form(path.split("/")[1])[0];
    } catch (e) {}
    this.det = v;
    this.item = v.children || [];
    let id = this.$route.params.id || "";
    if (id && this.item.length) {
      let list = this.item.filter((r) => {
        return r.path.indexOf(id) >= 0;
      })[0];
      if (list.path) {
        this.list = list;
        this.open = true;
      }
    }
  },
};
</script>
<style lang='less' scoped>
</style>
