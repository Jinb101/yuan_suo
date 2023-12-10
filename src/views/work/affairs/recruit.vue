<template>
  <v-view header>
    <template #menu>
      <span @click="open2 = true">招聘二维码</span>
    </template>

    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section
        v-for="(i, j) in item"
        :key="j"
        class="van-hairline--bottom"
        @click.stop="ondetail(i)"
      >
        <p class="name">
          <b>{{ i.name }}</b>
        </p>
        <p>
          应聘职位：<b>{{ i.job }}</b>
        </p>
        <p>
          联系电话：<b class="col_primary" @click.stop="ontel(i.phone)">{{
            i.phone
          }}</b>
        </p>
        <p>
          提交时间：<b>{{ i.create_time }}</b>
        </p>
      </section>
    </v-page>
    <template #fixed>
      <v-f v-model="open" :footer="false" text="简历详情">
        <template #menu>
          <span @click="ondeldetail">删除简历</span>
        </template>
        <v-d v-model="detail"></v-d>
      </v-f>
      <v-f v-model="open2" :footer="false" text="招聘二维码">
        <h4></h4>
        <div class="qr_img">
          <van-image :src="img"></van-image>
        </div>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
import vD from "./_recruit_detail.vue";
export default {
  data() {
    return {
      item: [],
      open: false,
      detail: {},
      open2: false,
      img: "",
    };
  },
  watch: {
    open(n) {
      if (!n) {
        this.detail = {};
        this.appPath("/work_recruitteach", true);
      }
    },
    open2(n) {
      if (n && this.img === "") {
        this.$api.http("kindergartenrecruitqr", {}, (r) => {
          this.img = r.url;
        });
      }
    },
  },
  components: { vF, vD },
  inject: ["appPath"],
  methods: {
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("kindergartenrecruit", { page, type: 1 }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
    ontel(v) {
      // eslint-disable-next-line
      demo.siteConfig.tel(v);
    },
    ondeldetail() {
      this.$js.modeldel(() => {
        let resume_id = this.detail.resume_info.id;
        this.$api.http("kindergartenrecruitdel", { resume_id }, () => {
          this.$toast("删除成功");
          this.item = this.item.filter((r) => {
            return r.id !== resume_id;
          });
          this.open = false;
        });
      });
    },
    ondetail(e) {
      this.id = e.id;
      this.appPath("/work_recruitteach/" + e.id, true);
      this.$api.http(
        "kindergartenrecruitdet",
        {
          resume_id: e.id,
          staff_id: "",
        },
        (r) => {
          this.detail = r;
          this.open = true;
        }
      );
    },
  },
  mounted() {
    this.id = this.$route.params.id || "";
    if (this.id) {
      this.ondetail({ id: this.id });
    }
  },
};
</script>
<style lang='less' scoped>
section {
  padding: 15px;
  position: relative;
  font-size: 15px;
  p {
    line-height: 1.2;
    color: #888;
    margin-bottom: 5px;
    b {
      color: #333;
    }
  }
  .name {
    font-weight: 650;
  }
}
h4 {
  margin-bottom: 40px;
}
.qr_img {
  width: 280px;
  height: 280px;
  margin: 0 auto;
}
</style>
