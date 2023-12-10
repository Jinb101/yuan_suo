<template>
  <div class="list_class">
    <div class="app_section">
      <section
        v-for="(i, j) in item"
        :key="j"
        class="flex"
        @click="ondet(i.id)"
      >
        <div class="logo" @click.stop>
          <v-a
            :src="i.base_map"
            :sex="i.gender"
            eve
            @on-eve="onchangelogo($event, j)"
          ></v-a>
        </div>
        <div class="text">
          <span
            class="status"
            :class="i.user_count > 0 ? 'col_green' : 'col_danger'"
          >
            {{ i.user_count > 0 ? "已" : "未" }}绑定
          </span>
          <h6>{{ i.name }}</h6>
          <p>学号：{{ i.no }}</p>
        </div>
      </section>
    </div>
    <van-action-sheet
      v-model="show"
      :actions="actions"
      cancel-text="取消"
      :description="'宝宝：' + ext.name"
      close-on-click-action
      @select="onselect"
    ></van-action-sheet>
    <v-f v-model="open" :footer="false" text="考勤识别图">
      <v-l v-model="ext" :ids="ext.id" @end="onendlogo"></v-l>
    </v-f>
  </div>
</template>

<script>
import vA from "../../../private/avatar.vue";
import vF from "../../../private/fixed.vue";
import vL from "./lib/4.vue";
export default {
  props: {
    value: null,
  },
  data() {
    return {
      item: [],
      show: false,
      actions: [
        { name: "预览", type: "show" },
        { name: "更换考勤底图", type: "pic" },
      ],
      ext: {},
      open: false,
    };
  },
  inject: ["appPath", "appShowImage"],
  components: { vA, vF, vL },
  computed: {
    detail: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
  },
  watch: {
    detail: {
      handler(v) {
        this.$emit("input", v);
      },
      deep: true,
    },
  },
  methods: {
    onendlogo() {
      this.open = false;
      let index = this.ext.$index;
      if (index >= 0) {
        this.$set(this.item[index], "base_map", this.ext.base_maps);
      }
    },
    onselect(e) {
      switch (e.type) {
        case "pic":
          this.open = true;
          this.ext.base_maps = this.ext.base_map;
          break;
        case "show":
          this.appShowImage(this.ext.base_map);
          break;
        default:
      }
    },
    onchangelogo(e, index) {
      let a = this.item[index];
      this.ext = { ...a, $index: index };
      this.show = true;
    },
    ondet(e) {
      this.appPath("/management_classlist/child&" + e, true);
      this.$nextTick(() => {
        this.$emit("end", e);
      });
    },
    init() {
      let id = this.$route.params.id || "";
      if (id) {
        this.ondet(id);
      }
      this.$api.http(
        "classesstudent",
        {
          page: 1,
          limit: this.detail.class_number + 1,
          class_id: this.detail.id,
        },
        (r) => {
          this.item = r;
        }
      );
    },
  },
  mounted() {
    this.detail = this.value;
    this.init();
  },
};
</script>
<style lang='less' scoped>
.list_class {
  font-size: 14px;
}
</style>
