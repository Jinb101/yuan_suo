<template>
  <div class="class_roster">
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section
        v-for="(i, j) in item"
        :key="j"
        class="flex"
        @click="ondetail(i)"
        :class="{ active: +childid === +i.id }"
      >
        <div class="logo" @click.stop>
          <v-a
            :sex="i.gender === '男' ? 1 : 2"
            :src="tosrc(i)"
            eve
            @on-eve="oneve($event, j)"
          ></v-a>
        </div>
        <div class="text">
          <h5>{{ i.name }}</h5>
        </div>
        <span class="change col_green" v-if="+childid === +i.id">当前选择</span>
      </section>
    </v-page>
    <van-action-sheet
      v-model="show"
      :actions="actions"
      cancel-text="取消"
      :description="'宝宝：' + ext.name"
      close-on-click-action
      @select="onselect"
    ></van-action-sheet>
    <v-f v-model="open" :footer="false" text="考勤识别图" :index="600">
      <v-l v-model="ext" :ids="ext.id" @end="onendlogo"></v-l>
    </v-f>
  </div>
</template>

<script>
import vA from "../../private/avatar.vue";
import vL from "../management/class/lib/4.vue";
import vF from "../../private/fixed.vue";
export default {
  props: {
    value: null,
    cid: [String, Number],
  },
  components: { vA, vL, vF },
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
  inject: ["appShowImage"],
  computed: {
    childid: {
      get: function get() {
        return this.value;
      },
      set: function set(n) {
        this.$emit("input", n);
      },
    },
  },
  watch: {
    childid(n) {
      this.$emit("input", n);
    },
    cid() {
      this.init();
    },
  },
  methods: {
    onendlogo() {
      this.open = false;
      let index = this.ext.$index;
      if (index >= 0) {
        this.$set(this.item[index].base_map, "base_map", this.ext.base_maps);
      }
    },
    onselect(e) {
      switch (e.type) {
        case "pic":
          this.open = true;
          this.ext.base_maps = this.ext.base_map;
          break;
        case "show":
          if (this.tosrc(this.ext) === "") {
            return this.$toast("暂无底图");
          }
          this.appShowImage(this.tosrc(this.ext));
          break;
        default:
      }
    },
    oneve(e, index) {
      let a = this.item[index];
      this.ext = {
        ...a,
        $index: index,
        base_map: (a.base_map || {}).base_map || "",
      };
      this.show = true;
    },
    tosrc(e) {
      if (e.base_map && e.base_map.base_map) {
        return e.base_map.base_map || "";
      }
      return "";
    },
    ondetail(e) {
      this.childid = e.id;
      this.$emit("change", e.id, e);
    },
    init() {
      if (this.cid === "undefined") {
        return 0;
      }
      this.onPage(1);
    },
    onPage(page, f) {
      this.open = false;
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      let class_id = (this.cid === "undefined" ? "" : this.cid) || "";
      this.$api.http("classroster", { page, class_id, limit: 50 }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(
          e.map((s) => {
            if (!s.base_map) {
              s.base_map = {};
            }
            return s;
          })
        );
        this.$refs.page.onFinish(e.length < 50);
        this.$emit("list", this.item);
      });
    },
  },
  mounted() {
    this.childid = this.value;
  },
};
</script>
<style lang='less' scoped>
section {
  background-color: #fff;
  margin: 8px 5px 0;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 10px 5px;
  align-items: center;
  font-size: 15px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  position: relative;
  .change {
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    margin: auto;
    font-size: 12px;
    height: 12px;
  }
  &.active {
    box-shadow: 0 0 5px rgba(78, 209, 226, 0.7);
  }
  .logo {
    margin-right: 10px;
    width: 50px;
    height: 50px;
  }
}
</style>
