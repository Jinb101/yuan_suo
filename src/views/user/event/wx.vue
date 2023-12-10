<template>
  <v-view @on-user="onuser" header cover :coverBgc="bgc">
    <div class="wx">
      <template v-if="isopen">
        <h5>您还未绑定微信，请点击下方按钮开通微信通知服务</h5>
      </template>
      <template v-else>
        <h5>您已绑定微信，可点击下方按钮进行切换绑定</h5>
      </template>
      <div class="box">
        <div class="icons flex">
          <div class="icon">
            <van-image :src="avatar" fit="cover"></van-image>
          </div>
          <div class="icon bgc_green"><van-icon name="wechat" /></div>
        </div>
        <h6>绑定无需再用手机号登录、更便捷</h6>
        <div class="btn">
          <van-button
            block
            round
            :color="$js.btnColor"
            icon="wechat"
            @click="onsubmit"
            >{{ isopen ? "点击" : "更改" }}绑定微信</van-button
          >
        </div>
      </div>
      <div class="tips">
        <h6>Tips/提示</h6>
        <p>
          绑定微信后公众号可向您推送本园的审核与通知信息，以便于第一时间查看
        </p>
        <p>绑定成功后可直接使用微信一键登录方式，方便又快捷</p>
      </div>
    </div>
  </v-view>
</template>

<script>
export default {
  data() {
    return {
      user: {},
    };
  },
  computed: {
    isopen() {
      return this.user.is_openid === 0;
    },
    bgc() {
      return "linear-gradient(#05b10f,rgba(0,0,0,0))";
    },
    avatar() {
      // eslint-disable-next-line
      return this.user.avatar || demo.siteConfig.icon("5", "people");
    },
  },
  methods: {
    onuser(e) {
      this.user = e;
    },
    onsubmit() {
      this.$js.wxcode("event_bind");
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.wx {
  height: 100%;
  // background: linear-gradient(rgba(0, 0, 0, 0), #8fff95);
  color: #fff;
}
.tips {
  font-size: 14px;
  line-height: 1.2;
  padding: 10px;
  color: #666;
  margin-top: 20px;
  h6 {
    font-weight: 650;
    padding: 5px 0;
  }
}
.box {
  background-color: #fff;
  margin: 10px 3%;
  border-radius: 10px;
  padding: 20px 10px;
  box-sizing: border-box;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  h6 {
    font-weight: 650;
    text-align: center;
    font-size: 14px;
    padding: 15px 0;
    color: #666;
  }
  .icons {
    justify-content: center;
    .icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      & + .icon {
        margin-left: 10px;
      }
    }
  }
}
.btn {
  // position: sticky;
  // bottom: 0;
  // z-index: 5;
  margin-top: 10px;
  padding: 0 18%;
}
h5 {
  text-align: center;
  padding: 10% 0;
  font-size: 15px;
}
</style>
