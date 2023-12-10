<template>
  <v-view
    header
    text="投票"
    index="500"
    bgc="#f8f7fa"
    ref="view"
    @on-user="onuser"
  >
    <template #menu>
      <span @click="open1 = true">投票筛选</span>
    </template>
    <transition name="van-slide-down">
      <div class="vote_search" v-if="open1">
        <van-field
          v-model="search.activity_name"
          label="活动名称"
          placeholder="请输入活动名称,选填"
          label-width="5em"
        />
        <van-field label="活动类型" label-width="5em" readonly>
          <template #button>
            <van-radio-group
              v-model="search.activity_type"
              direction="horizontal"
            >
              <van-radio name="0">全部</van-radio>
              <van-radio name="1">全园</van-radio>
              <van-radio name="2">班级</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <v-c
          v-model="cls"
          @change="onchangeclass"
          v-if="+search.activity_type === 2"
          label
        ></v-c>
        <van-cell title="活动状态"></van-cell>
        <div class="s">
          <van-radio-group v-model="search.type" direction="horizontal">
            <van-radio name="0">全部</van-radio>
            <van-radio name="1">进行中</van-radio>
            <van-radio name="2">未开始</van-radio>
            <van-radio name="3">已结束</van-radio>
          </van-radio-group>
        </div>
        <div class="b">
          <van-button block round :color="$js.btnColor" @click="onPage(1)"
            >点击搜索</van-button
          >
          <van-button block round @click="open1 = false">取消</van-button>
        </div>
      </div>
    </transition>
    <van-notice-bar
      color="#1989fa"
      background="#ecf9ff"
      left-icon="info-o"
      @click="open3 = true"
      v-if="subtitle.msg"
    >
      {{ subtitle.msg }}
    </van-notice-bar>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <ul>
        <li v-for="(i, j) in item" :key="j" class="flex" @click.stop="ondet(i)">
          <div class="logo">
            <img :src="i.cover_image" alt="" class="db_image" />
          </div>
          <div class="text">
            <h2 v-html="totitle(i.activity_name)"></h2>
            <p>
              {{ +i.activity_type === 1 ? "全园" : "班级" }}活动
              <span class="status"
                >（{{ +i.state === 1 ? "待" : "已" }}发布）</span
              >
            </p>
            <p>参与人数：{{ i.number }}人</p>
            <p>总得分：{{ i.total_score }}分</p>
            <p>浏览量：{{ i.visits }}</p>
            <p>活动时间：{{ appTimeout(i.start_time, false, "alls") }}</p>
            <p>{{ appTimeout(i.end_time, false, "alls") }}</p>
            <p>发布人：{{ (i.staff || {}).name }}</p>
            <div class="btn">
              <van-button
                plain
                round
                size="small"
                type="danger"
                @click.stop="ondels(i, j)"
                v-if="ismy(i)"
                >删除投票活动</van-button
              >
              <van-button
                round
                size="small"
                type="info"
                plain
                @click.stop="onsend(i, j)"
                v-if="issendvote(i)"
                >发布活动</van-button
              >
              <van-button
                round
                size="small"
                type="info"
                plain
                @click.stop="onpay(i, j)"
                v-else-if="
                  ismy(i) && (+i.pay_status === 1 || +i.package_type === 4)
                "
                >支付</van-button
              >
            </div>
          </div>
        </li>
      </ul>
    </v-page>
    <div class="bottom_top"></div>
    <div class="bottom">
      <van-button block :color="$js.btnColor" @click="oncreate"
        >创建投票活动</van-button
      >
    </div>
    <template #fixed>
      <v-f v-model="open" :footer="false" text="创建投票活动" :index="502">
        <v-a @end="onendadd"></v-a>
      </v-f>
      <v-f
        v-model="open2"
        :footer="false"
        text="投票活动列表"
        :index="503"
        bgc="#f8f7fa"
      >
        <template #menu>
          <span class="col_danger" @click="ondelext" v-if="ismy(ext)"
            >删除投票活动</span
          >
        </template>
        <v-d v-model="ext" @share="onshare" :sid="user.s_id"></v-d>
      </v-f>
      <v-f v-model="open3" :footer="false" text="投票续费" :index="505">
        <v-p @pay="onpaymoney"></v-p>
      </v-f>
      <v-f v-model="open4" :footer="false" text="支付" :index="504">
        <van-cell :value="buydet.title" title=""></van-cell>
        <van-cell
          title="购买模式"
          :value="+buydet.status === 1 ? '正常购买' : '补差价'"
        ></van-cell>
        <van-cell title="总费用" :value="buydet.price + '元'"></van-cell>
        <van-cell title="参与人数" :value="buydet.number + '人'"></van-cell>
        <van-cell title="投票活动天数" :value="buydet.day + '天'"></van-cell>
        <van-cell
          title="单次购买单价"
          :value="buydet.single_time + '元/每人每日'"
        ></van-cell>
        <van-cell
          title="开始时间"
          :value="appTimeout(buydet.start_time)"
        ></van-cell>
        <van-cell
          title="结束时间"
          :value="appTimeout(buydet.end_time)"
        ></van-cell>
        <van-cell
          title="活动类型"
          :value="+buydet.activity_type === 1 ? '园所活动' : '班级活动'"
        ></van-cell>
        <van-cell
          title="班级名称"
          :value="buydet.class_name"
          v-if="+buydet.activity_type === 2"
        ></van-cell>
        <van-cell title="实际支付金额" :value="buydet.amount + '元'"></van-cell>
        <van-button
          block
          type="primary"
          icon="wechat"
          @click="onpaymoney(buydet)"
          >点击支付({{ buydet.amount }})元</van-button
        >
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
import vC from "../../private/class.vue";
import vA from "./add.vue";
import vD from "./det.vue";
import vP from "./pay.vue";
export default {
  data() {
    return {
      open: false,
      open1: false, // 筛选
      open2: false, // 详情
      open3: false, // 续费
      open4: false, // 购买详情
      item: [],
      search: {
        activity_type: "",
        activity_name: "",
        type: "",
        class_id: "",
      },
      cls: {},
      ext: {},
      user: {},
      paytype: {
        season_card: "季卡",
        monthly_card: "月卡",
        half_year_card: "半年卡",
        annual_pass: "年卡",
      },
      paydet: {},
      buydet: {},
    };
  },
  watch: {
    open2(n) {
      if (!n) {
        this.appPath("/vote", true);
      }
    },
    "$route.path"(n) {
      let s = (n + "").split("/");
      if (s.length <= 2) {
        this.open2 = false;
      }
    },
  },
  computed: {
    subtitle() {
      let v = this.paydet;
      if (v.package_type === "free") {
        return { msg: "", code: 2 };
      }
      if (v.package_type === "") {
        return { msg: "关于投票价格/投票续费", code: 1 };
      }
      let e = this.paytype[v.package_type];
      let code = 2;
      let msg = [
        "您已开通",
        e,
        "。可发布投票活动剩余",
        v.voting_frequency,
        "次，",
        e,
        "到期时间：",
        this.appTimeout(v.voting_expiration_time),
        "。点击此处续费",
      ].join("");
      return { msg, code };
    },
  },
  inject: ["appTimeout", "appPath"],
  components: { vF, vA, vC, vD, vP },
  methods: {
    onpaymoney(e) {
      let os = {
        paytype: e.type,
        price: (e.val || {}).price || "",
      };
      if (e.vote_id) {
        os.vote_id = e.vote_id;
        os.paytype = "single_time";
        os.price = e.amount;
      }
      let url = this.$js.wxshareh5(
        "votepay",
        {
          checkcode: true,
          pay: true,
          // eslint-disable-next-line
          token: demo.$local.get("token"),
          path: this.$route.path,
          ...os,
        },
        "",
        true
      );
      if (this.$js.env) {
        console.log(url);
        return 0;
      }
      window.location.replace(url);
    },
    onpay(e) {
      this.$api.http("votebuys", { vote_id: e.vote_id }, (r) => {
        this.buydet = { ...r, vote_id: e.vote_id };
        this.open4 = true;
      });
    },
    issendvote(i) {
      return (
        +i.state === 1 &&
        this.ismy(i) &&
        +i.pay_status !== 1 &&
        +i.pay_status !== 4
      );
    },
    oncreate() {
      if (this.subtitle.code === 2) {
        this.open = true;
      } else {
        this.$js.model(
          "开通月卡更划算哦!",
          "点击确定去开通。点击取消直接创建",
          (r) => {
            if (r) {
              this.open3 = true;
            } else {
              this.open = true;
            }
          }
        );
      }
    },
    ismy(e) {
      return this.user.s_id === e.staff_id;
    },
    onuser(e) {
      this.user = e;
    },
    ondelext() {
      this.$js.modeldel(() => {
        let vote_id = this.ext.vote_id;
        this.$api.http("votedel", { vote_id }, () => {
          this.$toast("删除成功");
          this.item = this.item.filter((r) => {
            return r.vote_id !== vote_id;
          });
          this.open2 = false;
          this.ext = {};
        });
      });
    },
    ondels(e, index) {
      this.ext = e;
      this.ondelext();
    },
    onsend(e, index) {
      if (+e.state === 2) {
        return this.$toast("您已发布该活动");
      }
      this.$api.http("votesend", { vote_id: e.vote_id }, () => {
        this.$toast("发布成功");
        this.$set(this.item[index], "state", 2);
        if (this.subtitle.code === 2) {
          this.$set(this.item[index], "pay_status", 2);
        }
      });
    },
    totitle(e) {
      if (!e) {
        return "";
      }
      let t = (e + "").split("/#br#/").join("<br>");
      return t;
    },
    onshare() {
      this.$refs.view.$share();
    },
    ondet(e, flag = true) {
      this.ext = e;
      this.open2 = true;
      this.appPath("/vote/" + e.vote_id);
    },
    onchangeclass(e) {
      this.search.class_id = e.id;
    },
    onPage(page, f) {
      this.open1 = false;
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      let os = {
        ...this.search,
      };
      if (+os.activity_type === 0) {
        os.activity_type = "";
      }
      if (+os.type === 0) {
        os.type = "";
      }
      this.$api.http("vote", { page, ...os }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
    onendadd(f, e) {
      this.open = false;
      console.log(this.subtitle, f);
      if (!f && this.subtitle.code !== 2) {
        this.onpay(e);
      }
      this.onPage(1);
    },
    http(name = "", data = {}, fn) {
      this.$api.http("vote" + name, data, (r) => {
        console.log(r);
      });
    },
  },
  mounted() {
    this.$api.http("voteisvip", {}, (r) => {
      this.paydet = r;
    });
    let id = this.$route.params.id;
    if (id) {
      this.ondet({ vote_id: id }, false);
    }
  },
};
</script>
<style lang='less' scoped>
.vote_search {
  position: fixed;
  left: 0;
  top: 50px;
  z-index: 20;
  background-color: #fff;
  width: 100%;
  padding: 10px 0;
  border-radius: 0 0 40px 40px;
  .s {
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
  }
  .b {
    margin: 30px auto 10px;
    width: 65%;
    .van-button + .van-button {
      margin-top: 10px;
    }
  }
}
li {
  width: 96%;
  margin: 0 auto 10px;
  background-color: #fff;
  font-size: 15px;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 10px;
  position: relative;
  .status {
    // position: absolute;
    // right: 0;
    // top: 0;
    font-size: 12px;
  }
  .logo {
    width: 100px;
    height: 100px;
    margin-right: 10px;
    border-radius: 15px 4px 15px 15px;
    overflow: hidden;
  }
  .text {
    width: calc(100% - 110px);
    h2 {
      padding: 8px 0;
      font-weight: 650;
    }
    p {
      line-height: 1.3;
      color: #999;
      font-size: 14px;
    }
  }
  .btn {
    text-align: right;
    margin-top: 5px;
    .van-button {
      width: 100px;
      margin-left: 10px;
    }
  }
}
.bottom_top {
  height: 100px;
}
.bottom {
  position: fixed;
  z-index: 100;
  left: 0;
  bottom: 0;
  width: 100%;
}
</style>
