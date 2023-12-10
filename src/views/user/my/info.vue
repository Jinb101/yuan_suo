<template>
  <v-view header @on-user="onuser" bgc="#fafafa">
    <div class="logo">
      <v-upload-once v-model="img" class="img"></v-upload-once>
    </div>
    <van-field
      v-model="nick"
      label="昵称"
      placeholder="请输入昵称"
      maxlength="15"
      label-width="3em"
    >
      <template #button>
        <span class="col_green" @click="onsetnick">保存昵称</span>
      </template>
    </van-field>
    <div class="box">
      <van-cell title="园所名称" :label="user.nursery_name"></van-cell>
      <van-cell
        title="我的职位"
        :value="[user.auth_group, user.auth_job].join('-')"
      ></van-cell>
      <van-cell title="是否是班主任" :value="isteach"></van-cell>
      <van-cell title="是否是班级老师" :value="isteachs"></van-cell>
      <template v-if="user.multiple_classes === 2 && user.is_teachers === 1">
        <van-cell title="任教班级" :label="classes"></van-cell>
      </template>
      <template v-else>
        <van-cell
          title="所属班级"
          v-if="user.class_name"
          :value="user.class_name"
        ></van-cell>
      </template>
      <van-cell title="是否为园务部" :value="isboss"></van-cell>
      <van-cell title="后台账号" :value="user.account"></van-cell>
      <van-cell
        title="登录手机号"
        :label="user.phone"
        is-link
        value="更换手机号"
        @click="onevent('phone')"
      ></van-cell>
      <van-cell
        title="绑定微信"
        :value="iswx"
        is-link
        @click="onevent('wx')"
      ></van-cell>
    </div>
    <div class="box">
      <van-cell
        title="密码变更"
        is-link
        value="点击修改密码"
        @click="onevent('pwd')"
      ></van-cell>
    </div>
    <template #fixed> </template>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
export default {
  data() {
    return { user: {}, img: {}, nick: "", classes: "" };
  },
  computed: {
    iswx() {
      return (this.user.is_openid === 0 ? "未" : "已") + "绑定";
    },
    isteach() {
      return this.user.is_teacher === 0 ? "否" : "是";
    },
    isteachs() {
      return +this.user.is_teachers === 0 ? "否" : "是";
    },
    isboss() {
      return this.user.is_whether === 0 ? "否" : "是";
    },
  },
  watch: {
    img: {
      handler(n) {
        if (n.url) {
          this.sethead(n.src);
        }
      },
      deep: true,
    },
  },
  inject: ["appPath"],
  components: { vF },
  methods: {
    onevent(type) {
      switch (type) {
        case "phone":
          this.appPath("/my_info_tel");
          break;
        case "wx":
          this.appPath("/event_wx");
          break;
        case "pwd":
          this.appPath("/my_info_pwd");
          break;
        default:
      }
    },
    onuser(e) {
      this.user = e;
      this.img = { image: e.avatar };
      this.nick = e.nickname;
      if (e.multiple_classes === 2 && e.is_teachers === 1) {
        this.$api.http("getclassteach", {}, (r) => {
          let a = r.map((s) => {
            return s.nickname;
          });
          this.classes = a.join("、");
        });
      }
    },
    sethead(src) {
      this.$api.http("userinfologo", { avatar: src }, (r) => {
        this.$toast("修改成功");
        this.user.avatar = r;
        this.onset();
      });
    },
    onsetnick() {
      this.$api.http("userinfonick", { nickname: this.nick }, () => {
        this.$toast("修改成功");
        this.user.nickname = this.nick;
        this.onset();
      });
    },
    onset() {
      // eslint-disable-next-line
      demo.$session.set("user", {
        ...this.user,
        into_time: Date.now() + 30e4,
      });
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.logo {
  padding: 30px 0;
  .img {
    margin: 0 auto;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    overflow: hidden;
  }
}
.box {
  margin-top: 8px;
}
</style>
