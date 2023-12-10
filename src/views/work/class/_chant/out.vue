<template>
  <div class="chant_out">
    <template v-if="!pageshow">
      <van-empty description="暂未开课"></van-empty>
    </template>
    <template v-else>
      <v-page ref="page" @on-page="onPage">
        <van-empty v-if="!item.length"></van-empty>
        <div class="app_section">
          <section class="flex" v-for="(i, j) in item" :key="j">
            <div class="logo">
              <v-a :src="(i.base_map || {}).base_map"></v-a>
            </div>
            <div class="text">
              <h6>{{ i.name }}</h6>
              <p>学号：{{ i.no }}</p>
              <div class="btn" v-if="send" @click="tosend(i)">
                <img :src="ico" alt="" />
              </div>
            </div>
          </section>
        </div>
      </v-page>
    </template>
    <div
      class="btn_send"
      v-if="sendicon && item.length > 0"
      @click="tosend({})"
    >
      <img :src="ico" alt="" />
      <b>推送打卡</b>
    </div>
  </div>
</template>

<script>
import vA from "../../../private/avatar.vue";
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
      ico: "",
      pageshow: false,
    };
  },
  components: { vA },
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
    tosend(e) {
      this.$emit("sends", e);
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
        "chantunlist",
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
    // eslint-disable-next-line
    this.ico = demo.siteConfig.icon("7018", "o2");
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
