<template>
  <v-view header overflow :back="$frameview" @on-back="appOnBackOld">
    <div class="flex approval">
      <div class="box">
        <h6 class="bgc_green">发起审批</h6>
        <div class="a_view flex fw">
          <section v-for="(i, j) in bar" :key="j" @click="onDetail(i, 1, j)">
            <div class="avatar">
              <van-image
                fit="cover"
                class="db_image"
                :src="$js.config.icon(i.icon, 'index')"
              ></van-image>
            </div>
            <template v-if="i.num > 0">
              <van-badge :content="i.num">
                <p>{{ i.text }}</p>
              </van-badge>
            </template>
            <template v-else>
              <p>{{ i.text }}</p>
            </template>
          </section>
        </div>
      </div>
      <div class="box">
        <h6 class="bgc_warning">我的审批</h6>
        <div class="a_view flex fw">
          <section
            v-for="(i, j) in bar2"
            :key="j + 100"
            @click="onDetail(i, 2, j)"
          >
            <div class="avatar">
              <van-image
                fit="cover"
                class="db_image"
                :src="$js.config.icon(i.icon, 'index')"
              ></van-image>
            </div>
            <template v-if="i.num > 0">
              <van-badge :content="i.num">
                <p>{{ i.text }}</p>
              </van-badge>
            </template>
            <template v-else>
              <p>{{ i.text }}</p>
            </template>
          </section>
        </div>
      </div>
    </div>
  </v-view>
</template>

<script>
// eslint-disable-next-line
// const toNum = demo.siteConfig.hide.index.approval; // 2022-08-24 隐藏 采购/领用 两项
export default {
  data() {
    return {
      bar: [],
      bar2: [],
    };
  },
  inject: ["appPath", "appOnBackOld"],
  methods: {
    onDetail(e, index, num) {
      if (index === 2) {
        this.appPath("/approval_my/" + num + "&max&0");
      } else {
        this.appPath("/approval_send/" + num);
      }
    },
    init() {
      // let time = Date.now();
      // eslint-disable-next-line
      // let data = demo.$session.get("index-dot", {});
      // if (data.time && data.time > time) {
      //   this.onDot(data.list);
      //   return 0;
      // }
      this.$api.http("approvalDot", {}, (res) => {
        let os = [res.attendance, res.cost, res.goods, res.receipt, res.use];
        // eslint-disable-next-line
        // demo.$session.set("index-dot", { time: time + 6e4, list: os });
        this.onDot(os);
      });
    },
    onDot(e) {
      this.$set(this.bar2[0], "num", e[2]);
      this.$set(this.bar2[1], "num", e[4]);
      this.$set(this.bar2[2], "num", e[3]);
      this.$set(this.bar2[3], "num", e[1]);
      this.$set(this.bar2[4], "num", e[0]);
    },
  },
  mounted() {
    let bar = this.$js.def.index.approval;
    this.bar = bar[0];
    this.bar2 = bar[1];
    this.init();
  },
};
</script>
<style lang='less' scoped>
.approval {
  flex-direction: column;
  height: 100%;
  overflow-y: scroll;
  .box {
    flex: 1;
    box-sizing: border-box;
    padding: 10px;
  }
  h6 {
    font-size: 16px;
    font-weight: 700;
    padding: 0 10px;
    line-height: 30px;
    height: 30px;
    display: inline-block;
    color: #fff;
    border-radius: 5px;
  }
  .a_view {
    height: calc(100% - 30px);
    box-sizing: border-box;
    padding: 20px 0;
    section {
      width: 108px;
      margin-right: 14px;
      box-sizing: border-box;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100px;
      background-color: rgba(232, 255, 250, 0.1);
      border-radius: 5px;
      &:nth-child(3n) {
        margin-right: 0;
      }
      .avatar {
        height: 44px;
        width: 44px;
        margin-bottom: 6px;
      }
      p {
        line-height: 14px;
        font-weight: 650;
        font-size: 13px;
        padding: 0 5px;
      }
    }
  }
}
</style>
