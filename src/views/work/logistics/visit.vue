<template>
  <v-view header cover>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section v-for="(i, j) in item" :key="j" @click="ondetail(i)">
        <p>
          入园时间：<b>{{ i.date }}</b
          ><b class="col_green">{{ i.admission_time }}</b>
        </p>
        <p v-if="i.departure_time">
          离园时间：<b>{{ i.date }}</b
          ><b class="col_danger">{{ i.departure_time }}</b>
        </p>
        <p>
          姓名：<b>{{ i.full_name }}</b
          ><b class="col_info">{{ i.telephone }}</b>
        </p>
        <p>
          身份证号：<b>{{ i.id_number }}</b>
        </p>
        <p>
          体温：<b>{{ +i.temperature }}</b>
        </p>
        <p>
          被访人：<b>{{ i.interviewees }}</b>
        </p>
        <p>
          事由：<b>{{ i.other }}</b>
        </p>
        <p>
          备注：<b>{{ i.remarks }}</b>
        </p>
      </section>
    </v-page>
  </v-view>
</template>

<script>
export default {
  data() {
    return {
      item: [],
    };
  },
  methods: {
    ondetail(e) {
      if (e.telephone) {
        // eslint-disable-next-line
        demo.siteConfig.tel(e.telephone);
      }
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("visit", { page }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
section {
  padding: 10px;
  margin: 0 10px 10px;
  border-radius: 20px 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  font-size: 14px;
  color: #999;
  line-height: 1.3;
  b {
    font-weight: 650;
    color: #666;
    padding-right: 10px;
  }
}
</style>
