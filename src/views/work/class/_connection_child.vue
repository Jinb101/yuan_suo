<template>
  <div class="connection_child">
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section
        v-for="(i, j) in item"
        :key="j"
        class="flex"
        @click="ondetail(i)"
      >
        <div class="logo">
          <v-a :sex="i.gender"></v-a>
        </div>
        <div class="text">
          <div class="status" :class="{ col_danger: +i.is_enter === 1 }">
            {{ toStatus(i) }}
          </div>
          <h6>
            {{ i.name }}<span>{{ i.birthday }}</span>
          </h6>
          <p>录入老师：{{ i.staff_name }}</p>
          <p>录入时间：{{ totime(i.record_date) }}</p>
        </div>
      </section>
    </v-page>
  </div>
</template>

<script>
import vA from "../../private/avatar.vue";
export default {
  props: {
    ids: [String, Number],
  },
  data() {
    return {
      item: [],
    };
  },
  inject: ["appPath"],
  components: { vA },
  methods: {
    toStatus(v) {
      let msg = "已录入";
      if (+v.is_enter === 1) {
        return "未录入";
      }
      if (+v.status !== 2) {
        return "未发送";
      }
      if (+v.read_unread === 1) {
        return "已发送/未读";
      } else {
        msg = "已发送/已读";
      }
      if (+v.is_reply === 1) {
        return "已发送/未回复";
      } else {
        msg = "已发送/已回复";
      }
      return msg;
    },
    totime(v) {
      // eslint-disable-next-line
      return demo.timeout(v, "ymd");
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("connectionbaby", { page, child_id: this.ids }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
    ondetail(e) {
      this.appPath("/work_connection/" + this.ids + "&" + e.record_date, true);
      this.$emit("open", e.record_date, e.child_id);
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
section {
  padding: 10px;
  background-color: rgba(188, 241, 245, 0.3);
  &:nth-child(2n) {
    background-color: rgba(250, 241, 192, 0.3);
  }
  align-items: center;
  .logo {
    width: 50px;
    margin-right: 10px;
    height: 50px;
  }
  .text {
    width: calc(100% - 60px);
    font-size: 12px;
    position: relative;
    padding-top: 5px;
    color: #999;
    .status {
      position: absolute;
      right: 0;
      top: 0;
      color: #999;
      font-size: 13px;
      &.send {
        top: 25px;
        font-size: 12px;
      }
    }
    h6 {
      font-weight: 650;
      line-height: 20px;
      margin-bottom: 5px;
      font-size: 15px;
      color: #666;
      span {
        font-size: 13px;
        font-weight: 400;
        padding-left: 10px;
      }
    }
    p + p {
      margin-top: 5px;
    }
  }
}
</style>
