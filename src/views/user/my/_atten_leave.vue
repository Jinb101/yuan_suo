<template>
  <div class="class_3_leave">
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section
        class="van-hairline--bottom"
        v-for="(i, j) in item"
        :key="j + '-s'"
      >
        <p>请假类型：{{ toType(i.type) }}</p>
        <p>开始时间：{{ appTimeout(i.begin_date) }}</p>
        <p>
          结束时间：{{ appTimeout(i.end_date) }}
          <b v-if="i.begin_date === i.end_date">
            请假{{ ["全天", "上午", "下午"][i.types] }}
          </b>
        </p>
        <p>状态：{{ +i.status === 1 ? "待确认" : "已同意" }}</p>
        <p v-if="i.caption">说明：{{ i.caption }}</p>
        <p v-if="i.imgs && i.imgs.length">附件：</p>
        <div class="flex fw" v-if="i.imgs && i.imgs.length">
          <div class="ava" v-for="(x, y) in i.imgs" :key="y + '-ss'">
            <van-image
              :src="x"
              fit="cover"
              @click="appShowImage(i.imgs, y)"
            ></van-image>
          </div>
        </div>
        <div class="tool flex" v-if="+i.status === 1">
          <van-button size="small" type="primary" @click="onSub(i, j)"
            >同意请假</van-button
          >
        </div>
      </section>
    </v-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: [],
    };
  },
  inject: ["appTimeout", "appShowImage"],
  methods: {
    toType(id) {
      let a = [
        { name: "事假", id: 1 },
        { name: "病假", id: 2 },
        { name: "其他", id: 3 },
      ].filter((r) => {
        return r.id !== id;
      });
      if (a.length) return a[0].name;
      return "";
    },
    onSub(e, j) {
      this.$js.model("是否同意请假？", "", (res) => {
        if (res) {
          this.$api.http("classstudentleavein", { id: e.id }, () => {
            this.$toast("已同意");
            this.$set(this.item[j], "status", "2");
          });
        }
      });
    },
    init() {},
    onPage(page, f) {
      if (!f) {
        return this.$refs.page && this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "usermyattenleave",
        {
          page,
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
  padding: 10px;
  margin-bottom: 5px;
  background-color: #fff;
  p {
    font-size: 14px;
    line-height: 30px;
    height: 30px;
    &:first-child {
      font-weight: 650;
    }
  }
  .tool {
    flex-direction: row-reverse;
  }
  .ava {
    width: 83px;
    height: 83px;
    margin: 0 5px 5px 0;
  }
}
</style>
