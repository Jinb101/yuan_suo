<template>
  <v-view header
          cover>
    <template #menu>
      <v-c v-model="cls"
           @created="init"></v-c>
    </template>
    <div class="app_top">
      <van-tabs v-model="type"
                @change="init"
                title-active-color="#38f">
        <van-tab v-for="(i, j) in tab"
                 :key="j + '-t'"
                 :name="i.v">
          <template #title>
            <template v-if="i.n > 0">
              {{ i.name }}
              <span class="van-badge poa">{{ i.n }}</span>
            </template>
            <b v-else>{{ i.name }}</b>
          </template>
        </van-tab>
      </van-tabs>
    </div>
    <van-empty v-if="!item.length"
               description="暂无宝宝"></van-empty>
    <template v-else>
      <div class="more_btn"
           v-if="ismore">
        <van-button size="small"
                    type="info"
                    @click="onmoreselect">全选</van-button>
        <van-button size="small"
                    type="primary"
                    @click="onunmoreselect"
                    v-if="cid.length">取消选择</van-button>
      </div>
    </template>
    <section v-for="(i, j) in item"
             :key="j"
             class="flex"
             @click.stop="ondetail(i, j)"
             :class="{
               active:
                 (cid.indexOf(i.id) > -1 && +type === 3) ||
                 (cid.indexOf(i.attendance_id) > -1 && +type === 1),
             }">
      <div class="check"
           v-if="cid.indexOf(i.id) > -1">已选中</div>
      <div class="logo"
           @click.stop>
        <v-a v-model="i.base_map"
             :sex="i.gender"></v-a>
      </div>
      <div class="text">
        <h5>{{ i.name }}</h5>
        <template v-if="+type === 3">
          <p>未打卡</p>
          <div class="btns"
               v-if="!cid.length">
            <van-button size="small"
                        :color="$js.btnColor"
                        @click.stop="onsend(i, j)">设为已到</van-button>
            <van-button size="small"
                        plain
                        type="info"
                        @click.stop="onleave(i, j)">请假备注</van-button>
            <van-button size="small"
                        plain
                        type="primary"
                        v-if="i.phone"
                        @click.stop="ontel(i.phone)">联系家长</van-button>
          </div>
        </template>
        <template v-else-if="+type === 1">
          <p>打卡时间：{{ appTimeout(i.enter_time) }}</p>
          <div class="btns"
               v-if="!cid.length">
            <template v-if="!i.leave_time">
              <van-button size="small"
                          :color="$js.btnColor"
                          @click.stop="onleaveout(i, j)">点击离园</van-button>
              <van-button size="small"
                          plain
                          type="info"
                          @click.stop="oncancel(i, j)">撤销</van-button>
            </template>
            <van-button size="small"
                        plain
                        type="primary"
                        v-if="i.phone"
                        @click.stop="ontel(i.phone)">联系家长</van-button>
          </div>
        </template>
        <template v-else-if="+type === 4">
          <p>请假理由：{{ i.caption }}</p>
          <div class="btns">
            <van-button size="small"
                        plain
                        type="primary"
                        v-if="i.phone"
                        @click.stop="ontel(i.phone)">联系家长</van-button>
            <van-button size="small"
                        plain
                        type="info"
                        @click.stop="oncancelleave(i)">撤销请假</van-button>
          </div>
        </template>
        <template v-else-if="+type === 5">
          <p>打卡时间：{{ appTimeout(i.enter_time) }}</p>
          <div class="btns">
            <van-button size="small"
                        plain
                        type="primary"
                        v-if="i.phone"
                        @click.stop="ontel(i.phone)">联系家长</van-button>
          </div>
        </template>
        <template v-else-if="+type === 6">
          <p>
            入园时间：<b class="col_green">{{ appTimeout(i.enter_time) }}</b>
          </p>
          <p>
            离园时间：<b class="col_primary">{{ appTimeout(i.leave_time) }}</b>
          </p>
          <div class="btns">
            <van-button size="small"
                        plain
                        type="primary"
                        v-if="i.phone"
                        @click.stop="ontel(i.phone)">联系家长</van-button>
          </div>
        </template>
      </div>
    </section>
    <div class="nulls"></div>
    <div class="f_btns flex"
         v-if="cid.length">
      <template v-if="+type === 3">
        <van-button size="normal"
                    type="info"
                    @click="onleaves">批量请假({{ cid.length }})</van-button>
        <van-button size="normal"
                    :color="$js.btnColor"
                    @click="onsends()">批量设为已到({{ cid.length }})</van-button>
      </template>
      <template v-else-if="+type === 1">
        <van-button size="normal"
                    type="info"
                    @click="oncancels()">批量撤销({{ cid.length }})</van-button>
        <van-button size="normal"
                    :color="$js.btnColor"
                    @click="onleaveouts()">批量离园({{ cid.length }})</van-button>
      </template>
    </div>
    <div class="footers">
      <van-cell title="考勤时间选择"
                :value="time"
                is-link
                @click="open1 = !open1"></van-cell>
    </div>
    <template #fixed>
      <v-f :footer="false"
           v-model="open"
           text="请假/备注">
        <template v-if="!ext.$more">
          <van-cell title="请假人"
                    :value="ext.name"></van-cell>
          <template v-if="ext.phone">
            <van-cell title="家长"
                      :value="ext.nickname"></van-cell>
            <van-cell title="家长联系方式"
                      :value="ext.phone"
                      is-link
                      @click="ontel(ext.phone)"></van-cell>
          </template>
        </template>
        <van-field label="请假类型：">
          <template #button>
            <van-radio-group direction="horizontal"
                             v-model="userqj.type">
              <van-radio name="2">事假</van-radio>
              <van-radio name="1">病假</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field rows="2"
                   autosize
                   label="请假备注："
                   type="textarea"
                   placeholder="请输入请假备注"
                   v-model="userqj.text"
                   maxlength="500"
                   show-word-limit />
        <div class="w60">
          <van-button block
                      :color="$js.btnColor"
                      round
                      @click="onsaveleave">提交请假</van-button>
        </div>
      </v-f>
      <v-t :open="open1"
           v-model="times"></v-t>
    </template>
  </v-view>
</template>

<script>
import vC from "../../private/select_class.vue";
import vA from "../../private/avatar.vue";
import vF from "../../private/fixed.vue";
import vT from "../../private/time.vue";
export default {
  data() {
    return {
      tab: [
        { name: "未考勤", v: "3", n: 0 },
        { name: "已考勤", v: "1", n: 0 },
        { name: "迟到", v: "5", n: 0 },
        { name: "离园", v: "6", n: 0 },
        { name: "请假", v: "4", n: 0 },
      ],
      type: "3",
      cls: {},
      item: [],
      cid: [],
      open: false,
      open1: false,
      ext: {},
      userqj: {
        type: "1",
        text: "",
      },
      time: "",
      times: {},
      datetime: "",
    };
  },
  inject: ["appTimeout", "appPath"],
  components: { vC, vA, vF, vT },
  watch: {
    "cls.id"() {
      this.init();
    },
    times: {
      handler(n) {
        this.setday(n);
      },
      deep: true,
    },
    type(n) {
      this.onunmoreselect();
      this.appPath("/work_attendance/" + n, true);
    },
  },
  computed: {
    ismore() {
      return [1, 3].indexOf(+this.type) > -1;
    },
  },
  methods: {
    // 拨打电话
    ontel(t) {
      // eslint-disable-next-line
      demo.siteConfig.tel(t);
    },
    // 离园
    onleaveout(i, j) {
      this.onleaveouts(i.attendance_id);
    },
    // 批量离园
    onleaveouts(id) {
      let cid = this.cid.length ? this.cid : [id];
      this.$js.model("提示", "是否对其提交离园操作", (r) => {
        if (r) {
          this.$api.http("attenleaveout", { attendance_id: cid }, () => {
            this.$toast("设置成功");
            this.cid = [];
            this.open = false;
            this.init();
          });
        }
      });
    },
    // 撤销
    oncancel(i, j) {
      this.oncancels(i.attendance_id);
    },
    // 批量撤销
    oncancels(id) {
      let cid = this.cid.length ? this.cid : [id];
      this.$js.model("提示", "是否对其提交撤销操作", (r) => {
        if (r) {
          this.$api.http("attencancel", { attendance_id: cid }, () => {
            this.$toast("设置成功");
            this.cid = [];
            this.open = false;
            this.init();
          });
        }
      });
    },
    // 设为已到
    onsend(i, j) {
      this.onsends(i.id);
    },
    // 批量设为已到
    onsends(id) {
      let cid = this.cid.length ? this.cid : [id];
      this.$api.http("attensend", { c_id: cid, time: this.datetime }, () => {
        this.$toast("设置成功");
        this.cid = [];
        this.open = false;
        this.init();
        // eslint-disable-next-line
        demo.$session.clear("index");
      });
    },
    // 请假
    onleave(i, j) {
      this.ext = { ...i, $index: j };
      this.open = true;
    },
    // 批量请假
    onleaves() {
      this.ext = { $more: true };
      this.open = true;
    },
    // 提交请假
    onsaveleave() {
      let val = this.userqj;
      let data = [];
      if (this.cid.length) {
        data = this.cid.map((k) => {
          return { child_id: k, date: this.time, type: val.type, caption: val.text };
        });
      } else {
        data = [{ child_id: this.ext.id, date: this.time, type: val.type, caption: val.text }];
      }
      data = JSON.stringify(data);
      this.$api.http("attenleave", { data }, (r) => {
        this.$toast("提交请假成功");
        this.cid = [];
        this.open = false;
        this.init();
        // eslint-disable-next-line
        demo.$session.clear("index");
      });
    },
    // 撤销请假
    oncancelleave(e) {
      this.$js.model(
        "撤销确认",
        "是否撤销对宝宝【" + e.name + "】的请假",
        (r) => {
          if (r) {
            this.$api.http("attenleavecancel", { child_id: e.id }, () => {
              this.$toast("撤销成功");
              this.item = this.item.filter((r) => {
                return r.id !== e.id;
              });
              this.init();
              // dot未干掉
            });
          }
        }
      );
    },
    // 全选操作
    onmoreselect() {
      let n = +this.type === 3 ? "id" : "attendance_id";
      this.cid = this.item
        .filter((s) => {
          return !s.leave_time;
        })
        .map((s) => {
          return s[n];
        });
    },
    // 取消选择
    onunmoreselect() {
      this.cid = [];
    },
    // 详情
    ondetail(i, j) {
      if (this.ismore) {
        let n = +this.type === 3 ? "id" : "attendance_id";
        if (i.leave_time) return 0;
        if (this.cid.indexOf(i[n]) > -1) {
          this.cid = this.cid.filter((r) => {
            return r !== i[n];
          });
        } else {
          this.cid.push(i[n]);
        }
        return 0;
      } else {
        console.log(i, j);
      }
    },
    // 设置时间
    setday(n) {
      this.time = n.ymd;
      this.datetime = n.time;
      this.init();
    },
    init() {
      this.item = [];
      this.$api.http(
        "atten",
        {
          class_id: this.cls.id || "",
          datetime: this.datetime,
          status: this.type,
        },
        (r) => {
          this.item = r.list;
          this.setsnum(r.count);
        }
      );
    },
    setsnum(v) {
      this.$set(this.tab[0], "n", v.leave_count);
      this.$set(this.tab[1], "n", v.arrive_count);
      this.$set(this.tab[2], "n", v.dont_count);
      this.$set(this.tab[3], "n", v.leaving_count);
      this.$set(this.tab[4], "n", v.leave_number);
    },
  },
  mounted() {
    // eslint-disable-next-line
    let time = demo.timeout("", "object");
    this.time = [time.y, time.m, time.d].join("-");
    this.datetime = time.default;
    let id = this.$route.params.id;
    if (id) {
      this.type = id;
    }
  },
};
</script>
<style lang='less' scoped>
section {
  position: relative;
  background-color: #fff;
  margin: 8px 5px 0;
  padding: 10px;
  border-radius: 10px;
  font-size: 15px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;

  &.active {
    box-shadow: 0 0 5px rgba(66, 157, 241, 0.7);
  }

  .check {
    position: absolute;
    right: 12px;
    top: 0;
    bottom: 0;
    margin: auto;
    font-size: 13px;
    color: rgb(102, 230, 159);
    height: 15px;
  }

  .logo {
    width: 50px;
    height: 50px;
  }

  .text {
    width: calc(100% - 50px);
    box-sizing: border-box;
    padding-left: 10px;
    color: #999;

    p {
      line-height: 1.2;
    }
  }

  h5 {
    padding: 5px 0;
    font-weight: 650;
    font-size: 16px;
  }

  .btns {
    margin-top: 5px;
    display: flex;
    flex-direction: row-reverse;

    .van-button {
      margin-left: 8px;
      min-width: 60px;
    }
  }
}

.more_btn {
  padding: 10px 10px 0;

  .van-button {
    width: 100px;
    margin-right: 10px;
  }
}

.nulls {
  height: 140px;
}

.footers {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  z-index: 12;
}

.f_btns {
  position: fixed;
  left: 0;
  bottom: 40px;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;

  .van-button {
    flex: 1;

    &+.van-button {
      margin-left: 8px;
    }
  }
}

.poa {
  position: absolute;
}
</style>
