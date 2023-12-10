<template>
  <v-view header cover>
    <template #menu>
      <v-c v-model="cls" @created="init"></v-c>
    </template>
    <div class="app_top">
      <van-tabs v-model="active" @change="init" title-active-color="#38f">
        <van-tab
          v-for="(i, j) in tab"
          :key="j + '-t'"
          :name="i.v"
          :title="i.name"
        ></van-tab>
      </van-tabs>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <div class="app_section">
        <section v-for="(i, j) in item" :key="j" class="flex">
          <div class="logo">
            <v-a></v-a>
          </div>
          <div class="text">
            <span class="status">
              <van-tag :type="+i.type === 1 ? 'success' : 'primary'">
                {{ +i.type === 1 ? "病" : "事" }}假
              </van-tag>
            </span>
            <h6>
              {{ i.name }}
            </h6>
            <p>学号：{{ i.no }}</p>
            <p v-if="i.parent_name">家长：{{ i.parent_name }}</p>
            <p v-if="i.caption">请假原因：{{ i.caption }}</p>
            <p>请假时间：{{ times([i.begin_date, i.end_date]) }}</p>
            <div class="btns">
              <template v-if="+i.status === 1 && +active === 1">
                <van-button size="small" type="info" @click="onsubmit(i)"
                  >同意请假</van-button
                >
              </template>
              <van-button
                v-if="i.phone"
                size="small"
                type="primary"
                @click="ontel(i.phone)"
                >联系家长</van-button
              >
            </div>
          </div>
        </section>
      </div>
    </v-page>
  </v-view>
</template>

<script>
import vC from "../../private/select_class.vue";
import vA from "../../private/avatar.vue";
export default {
  data() {
    return {
      cls: {},
      item: [],
      active: "1",
      tab: [
        { name: "待确认", v: "1" },
        { name: "已确认", v: "2" },
      ],
    };
  },
  watch: {
    "cls.id"() {
      this.init();
    },
  },
  inject: ["appTimeout"],
  components: { vC, vA },
  methods: {
    onsubmit(e) {
      this.$api.http("leaveagree", { id: e.id }, () => {
        this.$toast("处理成功");
        this.item = this.item.filter((r) => {
          return r.id !== e.id;
        });
      });
    },
    ontel(e) {
      // eslint-disable-next-line
      demo.siteConfig.tel(e);
    },
    times(a) {
      let tm = this.appTimeout;
      let s = a
        .map((s) => {
          return tm(s);
        })
        .join("~~");
      return s;
    },
    init() {
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
      this.$api.http(
        "leave",
        { page, class_id: this.cls.id || "", type: this.active },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          this.item = this.item.concat(e);
          this.$refs.page.onFinish(e.length < 20);
        }
      );
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.btns {
  display: flex;
  flex-direction: row-reverse;
  .van-button {
    margin-right: 10px;
    margin-top: 10px;
  }
}
</style>
