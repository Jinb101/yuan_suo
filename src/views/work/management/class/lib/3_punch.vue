<template>
  <div class="class_3_punch">
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section
        class="van-hairline--bottom"
        v-for="(i, j) in item"
        :key="j + '-s'"
      >
        <p>{{ i.date }}</p>
        <p>
          入园时间：{{ i.enter_time ? appTimeout(i.enter_time) : "未打卡" }}
          <b>{{ i.status === 1 ? "出勤" : i.status === 3 ? "迟到" : "" }}</b>
        </p>
        <p>
          离园时间：{{ i.leave_time ? appTimeout(i.leave_time) : "未打卡" }}
          <b>
            {{
              i.leave_status === 4 ? "早退" : i.leave_status === 6 ? "离园" : ""
            }}
          </b>
        </p>
      </section>
    </v-page>
  </div>
</template>

<script>
export default {
  props: {
    ids: [String, Number],
    time: String,
  },
  data() {
    return {
      item: [],
    };
  },
  inject: ["appTimeout"],
  methods: {
    init() {},
    onPage(page, f) {
      if (!f) {
        return this.$refs.page && this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "classstudentpunch",
        {
          page,
          year_month: this.time,
          c_id: this.ids,
        },
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
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
section {
  background-color: #fff;
  padding: 10px;
  margin-bottom: 5px;
  p {
    font-size: 14px;
    line-height: 30px;
    height: 30px;
    position: relative;
    b {
      position: absolute;
      right: 0;
      top: 0;
      color: #999;
    }
    &:first-child {
      font-weight: 650;
    }
  }
}
</style>
