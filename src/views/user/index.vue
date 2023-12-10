<template>
  <v-view
    bar
    cover
    bgc="#f7f7f7"
    @on-view="onView"
    ref="view"
    @foodstatus="foodstatus"
  >
    <x-content></x-content>
    <x-content>
      <div class="user_box head flex" @click.stop="appPath('/my_info')">
        <span class="tag">
          {{ user.nursery_name }}
        </span>
        <div class="avatar">
          <van-image :src="user.avatar"></van-image>
        </div>
        <div class="strong">
          <h2>
            {{ user.nickname }}<b>{{ user.auth_group }}-{{ user.auth_job }}</b>
          </h2>
          <p class="account">{{ user.phone }}</p>
        </div>
        <div class="head_cover" :style="headcover"></div>
      </div>
    </x-content>
    <x-content v-if="groups.id && groups.status === 1">
      <div class="user_box">
        <van-cell
          :title="'【集团】' + groups.application_center.center_name"
        ></van-cell>
      </div>
    </x-content>
    <x-content v-else-if="groups.status === 0">
      <div class="user_box">
        <van-cell
          title="集团审核中"
          value="等待审核"
          is-link
          @click="ongroup(2)"
        ></van-cell>
      </div>
    </x-content>
    <x-content v-else>
      <div class="user_box">
        <van-cell
          title="加入集团"
          value="点击申请"
          is-link
          @click="ongroup(1)"
        ></van-cell>
      </div>
    </x-content>
    <x-content v-if="menus.length">
      <div class="user_box menu">
        <van-swipe
          :loop="false"
          :show-indicators="menulist.length > 1"
          @change="onswipechange"
        >
          <template #indicator>
            <div class="swipe_dot">
              <span
                v-for="(s, w) in menulist"
                :key="w + '-dot'"
                :class="{ active: swipeindex === w }"
              >
              </span>
            </div>
          </template>
          <van-swipe-item v-for="(x, y) in menulist" :key="y + 'y'">
            <v-m v-model="menulist[y]" @change="onMenu"></v-m>
          </van-swipe-item>
        </van-swipe>
      </div>
    </x-content>
    <x-content>
      <div class="user_box lines">
        <van-cell
          title="我的积分"
          value="提现"
          is-link
          icon="balance-o"
          @click="appPath('/my_integral')"
          v-if="
            user.integral > 0 || user.is_partner > 0 || +user.is_studies !== 0
          "
        ></van-cell>
        <van-cell
          title="联系客服"
          :value="config.tel"
          icon="phone"
          is-link
          @click="onTel"
        ></van-cell>
        <van-cell
          title="设置"
          is-link
          icon="setting"
          @click="appPath('/system')"
        ></van-cell>
      </div>
    </x-content>
    <x-content>
      <div class="user_box exit">
        <van-button block @click="onexit"
          ><span class="col_danger">退出登录</span></van-button
        >
      </div>
    </x-content>
    <x-content></x-content>
  </v-view>
</template>

<script>
import vM from "../private/menu.vue";
export default {
  data() {
    return {
      config: {},
      user: {},
      wx: {},
      levl: [],
      menus: [],
      status: false,
      menulevel: [],
      swipeindex: 0,
      val: {},
    };
  },
  components: { vM },
  inject: ["appPath"],
  computed: {
    headcover() {
      // eslint-disable-next-line
      let bg = demo.siteConfig.staticicon(1);
      return {
        background: 'url("' + bg + '") no-repeat left/cover',
      };
    },
    menulist() {
      if (this.menus.length > 12) {
        // eslint-disable-next-line
        return demo.array(JSON.parse(JSON.stringify(this.menus))).chunk(12);
      }
      return [this.menus];
    },
    groups() {
      return this.user.join_group || {};
    },
  },
  methods: {
    onswipechange(e) {
      this.swipeindex = e;
    },
    foodstatus(e) {
      this.status = e;
    },
    ongroup(num) {
      if (this.menulevel.indexOf(1002) >= 0) {
        return this.$js.modelmenuclose();
      }

      if (num === 1) {
        this.appPath("/event_apply");
      } else {
        // eslint-disable-next-line
        demo.$session.clear("user");
        this.$nextTick(() => {
          this.$refs.view.init();
        });
        this.$toast("已为您刷新进度");
      }
    },
    onView(e) {
      this.config = e.config || {};
      this.level = e.level || [];
      this.user = e.user || {};
      this.wx = e.wx || {};
      this.menulevel = (e.menulevel || {}).close || [];
      this.val = e.validate;
      let a = this.$js.def.user();
      if (!this.status) {
        a = a.filter((r) => {
          return !r.food;
        });
      }
      let noopen = this.val.noopen || [];
      if (noopen.length) {
        a = a.filter((r) => {
          return noopen.indexOf(r.id + "") < 0;
        });
      }
      this.menus = a;
    },
    onTel() {
      // eslint-disable-next-line
      demo.siteConfig.tel(this.config.tel);
    },
    onMenu(e) {
      if (e.path) {
        this.appPath(e.path);
      }
    },
    onexit() {
      this.$js.model("退出提示", "是否确认退出", (r) => {
        if (r) {
          // eslint-disable-next-line
          demo.siteConfig.tktoggle("clear");
          // eslint-disable-next-line
          demo.$session.reset();
          this.$toast("退出成功");
          this.appPath("/login");
        }
      });
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.user_box {
  background-color: #fff;
  border-radius: 8px;
  position: relative;
  font-size: 16px;
  overflow: hidden;
}
.head {
  padding: 30px 10px;
  .avatar {
    width: 65px;
    height: 65px;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 0 10px #f7f7f7;
  }
  .strong {
    width: calc(100% - 65px);
    padding-left: 10px;
    padding-top: 8px;
    box-sizing: border-box;
    h2 {
      padding: 5px 0;
      font-weight: 650;
      color: #232323;
      b {
        font-weight: 400;
        font-size: 12px;
        padding-left: 8px;
        color: #999;
      }
    }
    .account {
      font-weight: 650;
      padding: 5px 0;
      font-size: 15px;
    }
  }
  .tag {
    position: absolute;
    font-size: 12px;
    padding: 5px;
    color: #fff;
    background: linear-gradient(45deg, rgb(105, 67, 242), rgb(199, 181, 243));
    right: 0;
    top: 10px;
    border-radius: 10px 0 0 10px;
  }
  .head_cover {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
  }
}
.menu {
  padding: 10px 0;
}
.swipe_dot {
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    width: 10px;
    height: 5px;
    transition: all 0.5s;
    background-color: #f0f0f0;
    border-radius: 5px;
    &.active {
      background-color: #6943f2;
    }
  }
}
</style>
