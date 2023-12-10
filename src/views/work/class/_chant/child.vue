<template>
  <div class="chant_out">
    <template v-if="!pageshow">
      <van-empty description="暂未开课"></van-empty>
    </template>
    <template v-else>
      <v-page ref="page" @on-page="onPage">
        <van-empty v-if="!item.length"></van-empty>
        <div class="app_section">
          <section
            class="flex"
            v-for="(i, j) in item"
            :key="j"
            @click="ondet(i)"
          >
            <div class="logo">
              <v-a :src="(i.base_map || {}).base_map"></v-a>
            </div>
            <div class="text">
              <h6>{{ i.name }}</h6>
              <p>学号：{{ i.no }}</p>
              <p>宝宝打卡：{{ i.student_clock }}次</p>
              <p>家长打卡：{{ i.parents_clock }}次</p>
            </div>
          </section>
        </div>
      </v-page>
    </template>
    <v-f v-model="open" :footer="false">
      <v-d :ids="ids" :cid="childid" v-model="a" @share="onshare"></v-d>
    </v-f>
  </div>
</template>

<script>
import vA from "../../../private/avatar.vue";
import vF from "../../../private/fixed.vue";
import vD from "./child_det.vue";
export default {
  props: {
    value: null,
    send: Boolean,
    sendicon: Boolean,
    ids: [String, Number],
    cid: [String, Number],
  },
  data() {
    return {
      pageshow: false,
      open: false,
      childid: "",
      a: [],
    };
  },
  components: { vA, vF, vD },
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
  watch: {
    item: {
      handler(v) {
        this.$emit("input", v);
      },
      deep: true,
    },
  },
  methods: {
    onshare(e) {
      this.$emit("share", e);
    },
    ondet(e) {
      this.childid = e.id;
      this.open = true;
      // this.$api.http(
      //   "chantchilddet",
      //   { country_study_id: this.ids, child_id: e.id },
      //   (r) => {
      //     console.log(r);
      //   }
      // );
    },
    init() {
      if (this.ids > 0) {
        this.pageshow = true;
      }
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page && this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "chantchildlist",
        {
          page,
          class_schedule_country_id: this.ids,
          class_id: this.cid,
        },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          this.item = this.item.concat(e.list);
          this.$refs.page.onFinish(e.list.length < 20);
        }
      );
    },
  },
  mounted() {
    this.item = this.value;
    this.init();
  },
};
</script>
<style lang='less' scoped>
.btn {
  position: absolute;
  right: 10px;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 40px;
  height: 40px;
}
img {
  display: block;
  width: 100%;
  height: 100%;
}
.btn_send {
  position: fixed;
  right: 0;
  bottom: 0;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-direction: column;
  background-color: #fff;
  z-index: 66;
  transform: scale(0.8);
  img {
    width: 40px;
    height: 40px;
  }
}
</style>
