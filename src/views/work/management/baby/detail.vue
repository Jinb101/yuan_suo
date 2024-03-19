<template>
  <div class="baby_detail">
    <template v-if="open">
      <div class="app_top">
        <iframe :src="src + (s ? '&rotate=1' : '')"
                frameborder="0"
                class="play"
                :class="{ auto: s }"
                allowfullscreen="allowfullscreen"
                mozallowfullscreen="mozallowfullscreen"
                msallowfullscreen="msallowfullscreen"
                oallowfullscreen="oallowfullscreen"
                webkitallowfullscreen="webkitallowfullscreen"
                ref="frame"></iframe>
        <div class="tops">

          <div>
            <h3 class="name">{{ detail.video_name }}</h3>
            <div class=" mb_view">{{ detail.viewers }} 人正在观看</div>
            <div class="time">
              开放时间：
              <b>
                {{ detail.morning_start }}~{{ detail.morning_end }}
                {{ detail.afternoon_start }}~{{ detail.afternoon_end }}
              </b>
            </div>
          </div>

          <div class="to_look">
            <van-button round style="font-size: 14px;"
            @click="showDeTails = !showDeTails"
            >观看详情</van-button>
          </div>

        </div>
      </div>
      <div class="view">
        <van-cell :label="totime(i)"
                  is-link
                  v-for="(i, j) in item"
                  :key="j"
                  @click="onDetail(i)">
          <template #title>
            <div>
              <span class="font">{{ i.video_name }}</span>
              <span class="font_viewers">{{ i.viewers }} 人观看</span>
            </div>
          </template>
        </van-cell>
      </div>
    </template>
    <van-empty v-else
               description="未开放"></van-empty>

    <!-- 观看详情 -->
    <van-overlay :show="showDeTails" @click="showDeTails = false" />
    <div
    :class="showDeTails ? 'details' : 'show_details'"
    >

    <div class="details_lose">
      <div class="status_box">
        <div>
          <van-button :disabled="seleTime === 0"  @click="editTime('today')"  type="default">今天</van-button>
          <van-button :disabled="seleTime === 1"  @click="editTime('yeday')" type="default">昨天</van-button>
          <van-button  @click="editTime('time')"  type="default">日期选择</van-button>
        </div>
      </div>
      <van-icon @click="showDeTails = false" name="cross" />
    </div>
          <div :class="showDeTails ? 'watch_list':'show_details'" >
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多家长了"
              @load="onLoad"
            >
            <div v-for="(i, j) in list"
                   :key="j"
                   >
                <div
                class="watch_box"
                >
                  <b
                  :class="i.status == '1'  ? 'status_g' : 'status_gray'"
                  class="view_name">{{ i.user.nickname }} </b>
                  <b class="view_status">{{ i.status == '1' ? '在线' : '离线' }}</b>
                  <b class="viewing">{{dateView(i.viewing_duration)  }}
                  </b>
                </div>
              </div>
            </van-list>

          </div>
    </div>

  <van-popup
    v-model="openTimeSelect"
    position="bottom"
    :style="{ height: '50%' }"
    get-container="#app"
    close-on-popstate
    safe-area-inset-bottom
  >
    <van-datetime-picker
      v-model="dateTime"
      type="date"
      title="选择年月日"
      :max-date="maxDate"
      :formatter="formatter"
      item-height="1.1733rem"
      @confirm="seleTimeChange"
      @cancel="openTimeSelect = false"
      class="app_time"
    />
  </van-popup>

    </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    ids: [Number, String],
    menu: Boolean,
  },
  data() {
    return {
      open: false,
      item: [],
      detail: {},
      pic: "",
      src: "",
      id: "",
      s: false,
      list: [],
      user:{},
      timerID:null,
      isOntime:null,
      showDeTails:false,
      seleTime:0,
      viewTime:'',
      openTimeSelect:false,
      maxDate:new Date(),
      dateTime: new Date(),
      page: 1,
      loading: false,
      finished: false,
    };
  },
  watch: {
    menu(n) {
      this.s = n;
    },
    showDeTails(n){
      if(n){
        this.onPage(1)
      }else{
        this,list = []
      }
    }
  },
  methods: {
    onLoad() {
      if (this.finished) {
        return;
      }
      this.loading = true;
      this.page++;
      this.onPage(this.page);
      console.log(123);
    },
    formatter(type, val) {
      if (type === 'year') {
        return val + '年';
      }
      if (type === 'month') {
        return val + '月';
      }
      if (type === 'day') {
        return val + '日';
      }
      return val;
    },
    seleTimeChange(v){
      //v 转换为年月日
      this.viewTime = v.toLocaleDateString().replace(/\//g, '-')
      this.openTimeSelect = false
      this.seleTime = 2
      this.page = 1
      this.onPage(1)
    },
    editTime(type){
      this.page = 1
      if(type === 'today'){
        this.seleTime = 0
        this.viewTime = new Date().toLocaleDateString().replace(/\//g, '-')
        this.onPage(1)
      }else if(type === 'yeday'){
        // this.viewTime == 年月日
        this.viewTime = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toLocaleDateString().replace(/\//g, '-')
        this.seleTime = 1
        this.onPage(1)
      }else if (type === 'time'){
        this.openTimeSelect = true
        // this.$refs.page.onRefresh()
      }
    },
    dateView(s){
          // 1 小时 = 3600 秒 数字转换为时间  没有一小时 就是分 有一小时 就为 xx 小时 xx 分
            // 计算小时数
        const hours = Math.floor(s / 3600);
        // 剩余秒数
        const secondsLeft = s % 3600;
        // 将剩余秒数转换为分钟
        const minutes = Math.floor(secondsLeft / 60);

        // 根据是否有小时来构造返回的字符串
        if (hours > 0) {
          return `${hours}小时${minutes} 分钟`;
        } else if (minutes > 0) {
          return `${minutes} 分钟`;
        } else {
          return `<1 分钟`;
        }
   },
    totime(e) {
      let a = ["开放时间："];
      if (e.morning_start) {
        a = a.concat([e.morning_start, "~", e.morning_end, " "]);
      }
      if (e.afternoon_start) {
        a = a.concat([e.afternoon_start, "~", e.afternoon_end, " "]);
      }
      return a.join("");
    },
    init() {
      try {
        this.$api.http("babydetail", { baby_id: this.id, page: 1 }, (r) => {
          this.detail = r.video;
          this.item = r.videos || [];
          this.pic = this.detail.video_img;
          let type = +this.detail.device_type === 1;
          let v = demo.$local.get("system-mode");
          let definition = !(v.definition === undefined || !v.definition); // 是否高清 大华
          if (this.detail.device_type === undefined) {
            type = true;
          }
          let a = demo.$session.get("user", {});
          let h5 = demo.es6().encrypt(
            {
              token: type ? this.detail.access_token : this.detail.getkit_token,
              url: this.detail.hd_address,
              time: [
                this.detail.morning_start,
                this.detail.morning_end,
                this.detail.afternoon_start,
                this.detail.afternoon_end,
              ],
              now: this.detail.server_time, // 当前时间 服务器返
              width: this.$refs.frame.clientWidth,
              height: this.$refs.frame.clientHeight,
              type,
              channid: this.detail.channeiid || 0,
              deviceid: this.detail.device_id || "",
              ooo: {
                t: a.phone || "",
                po: a.pay_openid || "",
                b: this.id,
                id: demo.$local.get("nid"),
              },
            },
            "baby",
            "admin"
          );
          // console.log(h5, demo.siteConfig.api.h5, '--------------------------------------------------------');
          this.src =
            demo.siteConfig.api.h5 +
            "surveillance/?h5=" +
            h5 +
            "&definition=" +
            definition;
          console.log(this.src,'------------');
              // 定时器 10s 发送一次观看记录
              this.timerID = setInterval(() => {
            this.sendWatch(2);
          }, 10000);
        });
      } catch (error) {
        this.sendWatch(3);
      }
    },
    onPage(page) {
      if (+page === 1) {
        this.list = [];
      }
      // console.log(this.ids, this.id, page, "-------------------");
      this.$api.http("babyWatchList", { baby_id: this.id || this.ids, page: page,duration:this.viewTime,limit:20}, (r) => {
        this.list = this.list.concat(r.list)
        this.loading = false;
        this.finished = r.list.length === 0 || r.total === this.list.length || r.list.length < 20;
      });
    },
    sendWatch(type = 2) {
      // 2 观看中 3 观看结束
      this.$api.http("babyRecView", { baby_id: this.id, type: type }, (r) => {
        this.$emit("watch", r);
      });
    },
    onDetail(e) {
      this.seleTime = 0
      this.page = 1
      this.list = []
      this.viewTime = new Date()
      this.sendWatch(3)
      clearInterval(this.timerID);
      this.id = e.baby_id;
      this.init();
    },
    getIson(){
      this.$api.http("babyisoff", { baby_id: this.id }, (r) => {
        if (+r.is_on === 1) {
          clearInterval(this.timerID);
          clearInterval(this.isOntime);
          this.sendWatch(3)
          this.$emit("close");
          return this.$toast("该宝贝在线暂未开启");
        }
      });
    },
  },
  mounted() {
   this.viewTime = new Date().toLocaleDateString().replace(/\//g, '-')
   const user = demo.$session.get('user',{})
   this.user = user
    this.$api.http("babyisoff", { baby_id: this.ids }, (r) => {
      if (+r.is_on === 1) {
        this.$emit("close");
        return this.$toast("该宝贝在线暂未开启");
      } else {
        this.open = true;
        this.id = this.ids;
        this.init();
        // 定时 请求
        this.isOntime = setInterval(() => {
          this.getIson()
        }, 20000);
      }
    });

  },
  destroyed() {
    clearInterval(this.timerID);
    clearInterval(this.isOntime);
    this.sendWatch(3)
  },

};
</script>

<style lang='less'
       scoped>
      .play {
        height: 210px;
        display: block;
        width: 100%;
        background-color: #fff;

        &.auto {
          position: fixed;
          left: 0;
          top: 46px;
          width: 100%;
          height: calc(100% - 46px);
          z-index: 55;
        }
      }

      .tops {
        position: relative;
        background-color: #fff;
        z-index: 5;
        display: flex;
        justify-content: space-between;
        .to_look{
          height: 50px;
          margin: auto  0 ;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-left: 10px;
          padding-right: 10px;

        }
        .name {
          padding: 15px 10px 10px;
          font-size: 15px;
          font-weight: 650;
          line-height: 20px;
        }

        .time {
          font-size: 13px;
          color: #999;
          padding: 0 10px;
          line-height: 15px;
          padding-bottom: 10px;
        }


      }

      .view {
        border-top: 8px solid #f5f5f5;
      }

      .watch_box{
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size:  14px !important;
        margin-top: 8px;
        border-bottom: 1px solid #f5f5f5;
        padding-left: 20px;
        padding-bottom: 5px;
        .view_name {
          width: 30%;
          white-space: nowrap; /* 确保文本在一行内显示 */
          overflow: hidden; /* 隐藏溢出的内容 */
          text-overflow: ellipsis; /* 使用省略号表示溢出的文本 */
        }
        .viewing{
          width: 30%;
          text-align: right;
          margin-right: 10px;
        }
      }
      .status_g{
        color: chartreuse;
      }
      .status_gray{
        color: rgba(128, 128, 128, 0.699);
      }
      /deep/ .van-loading__text{
        font-size: 0.3rem !important;
      }
      /deep/  .van-list__finished-text{
        font-size: 0.3rem !important;
      }
      .app_top{
        border-bottom:  1px solid #f5f5f5;
      }
      .details{
        height: 70vh;
        width: 100%;
        position: fixed;
        left: 0;
        bottom: 0;
        background: #fff;
        transition: all .3s;
        z-index: 999;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
      }
      .show_details{
        height: 0;
        width: 100%;
        position: fixed;
        left: 0;
        bottom: -100%;
        transition: all .3s;
      }
      .van-overlay {
        z-index: 999;
      }
      .details_lose{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        padding: 0 10px;
      }
      .status_box{
        display: flex;
      }
        // .watch_list {
        //   min-height: 200px;
        //   height: calc(100% - 60px);
        //   width: 100%;
        //   .watch_title{
        //     font-size: 14px;
        //     font-weight: 500;
        //     color: #999;
        //   }
        // }
        .font_viewers{
          margin-left: 10px;
          font-size:  12px ;
          color: gray;
        }
        .mb_view{
          padding-bottom: 10px;
          margin-left: 10px;
          font-size:  12px ;
          color: gray;
        }
        .van-list {
          overflow-y: auto;
          height: 100%;
        }
        .watch_list{
          height: calc(100% - 60px);
          overflow-y: auto;
        }

    </style>
