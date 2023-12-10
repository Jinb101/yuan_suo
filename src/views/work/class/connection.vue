<template>
  <v-view header index="500">
    <template #menu>
      <v-c v-model="cls"></v-c>
    </template>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section
        v-for="(i, j) in item"
        :key="j"
        class="flex"
        @click="ondetail(i)"
      >
        <div class="logo">
          <v-a :sex="i.gender === '男' ? 1 : 2"></v-a>
        </div>
        <div class="text">
          <div class="status" :class="{ col_danger: +i.is_enter === 1 }">
            {{ toStatus(i) }}
          </div>
          <!-- <div class="status send" v-if="i.status > 0">
            {{ +i.status === 2 ? "已" : "未" }}发送
          </div> -->
          <h6>
            {{ i.name }}<span>{{ i.birthday }}</span>
          </h6>
          <p>
            {{ i.type }}<span v-if="i.nickname">-{{ i.nickname }}</span>
          </p>
        </div>
      </section>
    </v-page>
    <div class="all_div" v-if="isallsend"></div>
    <transition name="van-fade">
      <div class="all_add flex" v-if="isallsend">
        <van-button block round type="info" @click="open1 = true"
          >点击发送(历史)</van-button
        >
        <van-button block round :color="$js.btnColor" @click="onsenddate(true)"
          >点击发送(今日)</van-button
        >
      </div>
    </transition>
    <template #fixed>
      <v-f
        v-model="open"
        :footer="false"
        cover
        :coverBgc="coverBgc"
        :index="501"
      >
        <template #menu>
          <span @click="open2 = true">录入记录</span>
        </template>
        <v-d :ids="id" @close="onclosedetail"></v-d>
      </v-f>
      <v-f v-model="open1" :footer="false" text="统一发送" :index="502">
        <van-empty v-if="!sendday.length">
          <van-button
            type="primary"
            @click="open1 = false"
            size="small"
            style="width: 80px"
            >关闭</van-button
          >
        </van-empty>
        <template v-else>
          <van-cell title="请选择发送日期"></van-cell>
          <van-checkbox-group v-model="sendresult">
            <van-cell-group>
              <van-cell
                v-for="(i, j) in sendday"
                clickable
                :key="j + 'c'"
                :title="i"
                @click="toggle(j)"
              >
                <template #right-icon>
                  <van-checkbox :name="i" ref="checkboxes" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
          <div class="w80">
            <van-button
              block
              round
              :color="$js.btnColor"
              :disabled="sendresult.length < 1"
              @click="onsenddate()"
              >点击批量发送</van-button
            >
          </div>
        </template>
      </v-f>
      <v-f v-model="open2" :footer="false" text="录入记录" :index="503">
        <v-child :ids="id" @open="onopendetail"></v-child>
      </v-f>
      <v-f v-model="open3" :footer="false" text="记录详情" :index="504">
        <v-d :ids="id" @close="onclosedetail" :timeout="timeout"></v-d>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vC from "../../private/select_class.vue";
import vF from "../../private/fixed.vue";
import vA from "../../private/avatar.vue";
import vD from "./_connection_detail.vue";
import vChild from "./_connection_child.vue";
export default {
  data() {
    return {
      item: [],
      cls: {},
      open: false, // 控制详情
      open1: false, // 控制统一发送
      open2: false, // 录入记录
      open3: false, // 记录详情
      id: "",
      coverBgc:
        "linear-gradient(rgba(253, 220, 159, 0.6) 20%,rgba(0, 0, 0, 0))",
      sendday: [],
      sendresult: [],
      timeout: "",
    };
  },
  watch: {
    "cls.id"() {
      this.onPage(1);
    },
    open(n) {
      if (!n) {
        // eslint-disable-next-line
        demo.title("");
        this.appPath("/work_connection", true);
      }
    },
    open1(n) {
      if (n) {
        this.$api.http(
          "connectionday",
          { class_id: this.cls.id || "" },
          (r) => {
            this.sendday = r;
          }
        );
      } else {
        this.sendresult = [];
      }
    },
    open2(n) {
      if (n) {
        let t = this.timeout || "0";
        this.appPath("/work_connection/" + this.id + "&" + t, true);
      } else {
        this.timeout = "";
        this.appPath("/work_connection/" + this.id, true);
      }
    },
  },
  computed: {
    isallsend() {
      if (!this.item.length) return false;
      let len = this.item.filter((r) => {
        return +r.status === 1;
      });
      return len.length > 0;
    },
  },
  inject: ["appPath"],
  components: { vC, vF, vA, vD, vChild },
  methods: {
    onopendetail(time, id) {
      this.timeout = time;
      this.open3 = true;
    },
    onsenddate(day) {
      let v = this.sendresult.join(",");
      if (day) {
        // eslint-disable-next-line
        v = demo.timeout("", "ymd", "-");
      }
      this.$api.http(
        "connectionsend",
        { class_id: this.cls.id || "", date: v },
        () => {
          this.$toast("发送成功");
          this.open1 = false;
          if (day) {
            this.onPage(1);
          }
        }
      );
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    onclosedetail(e) {
      // eslint-disable-next-line
      let zero = demo.timeout("", "zero");
      let time = new Date(e.replace(/-/g, "/")).getTime() >= zero;
      if (time) {
        // let index = this.item.map((s) => {
        //   return +s.id;
        // });

        // index = index.indexOf(+this.id);
        // if (index > -1) {
        //   this.$set(this.item[index], "status", "1");
        // }
        this.onPage(1);
      }
      if (this.timeout) {
        this.open3 = false;
      } else {
        this.open = false;
      }
    },
    toStatus(v) {
      let msg = "已录入";
      if (+v.is_enter === 1) {
        return "未录入";
      }
      if (+v.status !== 2) {
        return "未发送";
      }
      if (+v.read_unread === 1) {
        return "已发送/未读";
      } else {
        msg = "已发送/已读";
      }
      if (+v.is_reply === 1) {
        return "已发送/未回复";
      } else {
        msg = "已发送/已回复";
      }
      return msg;
    },
    ondetail(e) {
      this.appPath("/work_connection/" + e.id, true);
      this.id = e.id;
      this.open = true;
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "connection",
        { page, class_id: this.cls.id || "" },
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
    this.id = this.$route.params.id || "";
    let his = this.$route.params.his || "";
    if (this.id) {
      if (his) {
        this.timeout = his;
        this.open2 = true;
        if (his > 0) {
          this.onopendetail(his);
        }
      } else {
        this.ondetail({ id: this.id });
      }
    }
  },
};
</script>
<style lang='less' scoped>
section {
  padding: 10px;
  background-color: rgba(188, 241, 245, 0.3);
  &:nth-child(2n) {
    background-color: rgba(250, 241, 192, 0.3);
  }
  align-items: center;
  .logo {
    width: 50px;
    margin-right: 10px;
    height: 50px;
  }
  .text {
    width: calc(100% - 60px);
    font-size: 12px;
    position: relative;
    padding-top: 5px;
    color: #999;
    .status {
      position: absolute;
      right: 0;
      top: 0;
      color: #999;
      font-size: 13px;
      &.send {
        top: 25px;
        font-size: 12px;
      }
    }
    h6 {
      font-weight: 650;
      line-height: 20px;
      margin-bottom: 5px;
      font-size: 15px;
      color: #666;
      span {
        font-size: 13px;
        font-weight: 400;
        padding-left: 10px;
      }
    }
    p + p {
      margin-top: 5px;
    }
  }
}
.all_add {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 20px;
  margin: auto;
  width: 80%;
  .van-button + .van-button {
    margin-left: 12px;
  }
}
.all_div {
  height: 60px;
}
</style>
