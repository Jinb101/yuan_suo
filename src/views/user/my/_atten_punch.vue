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
          <b
            >{{ i.status === 1 ? "出勤" : i.status === 3 ? "迟到" : ""
            }}{{ +i.personnel === 2 ? "[外勤]" : "" }}</b
          >
        </p>
        <p v-if="+i.personnel === 2" class="msg">
          外勤备注：{{ i.notes || "无备注" }}
        </p>
        <div class="image" v-if="+i.personnel === 2 && i.field_work_photos">
          <van-image
            :src="i.field_work_photos"
            @click.stop="appShowImage(i.field_work_photos)"
          ></van-image>
        </div>
        <p
          class="msg click"
          v-if="+i.personnel === 2 && showclockdata"
          @click.stop="onshowlocation(i, 1)"
        >
          点击查看外勤上班打卡位置
        </p>
        <p>
          离园时间：{{ i.leave_time ? appTimeout(i.leave_time) : "未打卡" }}
          <b>
            {{
              i.leave_status === 4
                ? "早退"
                : i.leave_status === 6
                ? "离园"
                : ""
            }}{{ +i.off_personnel === 2 ? "[外勤]" : "" }}
          </b>
        </p>
        <p v-if="+i.off_personnel === 2" class="msg">
          外勤备注：{{ i.off_notes || "无备注" }}
        </p>
        <div
          class="image"
          v-if="+i.off_personnel === 2 && i.outside_work_photos"
        >
          <van-image
            :src="i.outside_work_photos"
            @click.stop="appShowImage(i.outside_work_photos)"
          ></van-image>
        </div>
        <p
          class="msg click"
          v-if="+i.off_personnel === 2 && showclockdata"
          @click.stop="onshowlocation(i, 2)"
        >
          点击查看外勤下班打卡位置
        </p>
      </section>
    </v-page>
    <van-popup
      v-model="open"
      round
      close-on-popstate
      closeable
      get-container="#app"
      style="width: 90%; height: 90%"
    >
      <iframe :src="url" class="db_image" frameborder="0"></iframe>
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {
    time: String,
  },
  data() {
    return {
      item: [],
      i: {},
      open: false,
      url: "",
      nid: 0,
    };
  },
  inject: ["appTimeout", "appShowImage"],
  computed: {
    showclockdata() {
      // return +this.nid === 7;
      return false;
    },
  },
  methods: {
    onshowlocation(e, n) {
      // eslint-disable-next-line
      let user = demo.$session.get("user", {});
      let os = {
        image: n === 1 ? e.field_work_photos : e.outside_work_photos,
        lng: "104.00421", // 打卡lng
        lat: "30.630419", // 打卡lat
        title: user.nursery_name,
        username: user.nickname,
        account: user.phone,
        desc: e.notes + "[附：仅供测试使用]",
        time: this.appTimeout(n === 1 ? e.enter_time : e.leave_time),
        lnglat: [this.i.longitude, this.i.latitude],
      };
      // eslint-disable-next-line
      let url = demo.siteConfig.api.clockin(os);
      this.url = url;
      this.open = true;
    },
    init() {
      // eslint-disable-next-line
      this.nid = demo.$local.get("nid");
      this.$api.http("clockinfo", {}, (r) => {
        this.i = r;
      });
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page && this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "usermyattenpunch",
        {
          page,
          year_month: this.time,
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
  .image {
    width: 80px;
    height: 80px;
  }
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
    &.msg {
      line-height: 1.5;
      color: rgb(255, 142, 66);
      height: auto;
      font-size: 12px;
    }
    &.click {
      color: #38f;
      text-align: right;
    }
  }
}
</style>
