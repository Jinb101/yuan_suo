<template>
  <v-view header
          bgc="#f5f5f5">
    <template #menu>
      <span @click="open = !open">{{ open ? "取消" : "" }}筛选</span>
    </template>
    <div class="app_top bgc">
      <van-tabs v-model="active"
                title-active-color="#38f"
                @click="ontab">
        <van-tab :title="i.t"
                 :name="i.v"
                 v-for="(i, j) in tab"
                 :key="j"></van-tab>
      </van-tabs>
      <transition name="van-slide-down">
        <div v-if="open">
          <v-s v-model="os.name"
               @search="onPage(1)"
               plac="请输入搜索名字"></v-s>
          <v-s v-model="os.contact"
               @search="onPage(1)"
               plac="请输入搜索手机号"></v-s>
          <div class="times flex">
            <span @click="open1 = !open1">{{ time1 }}</span>
            <b>~</b>
            <span @click="open2 = !open2">{{ time2 }}</span>
          </div>
        </div>
      </transition>
    </div>
    <v-page ref="page"
            @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section v-for="(i, j) in item"
               :key="j"
               class="flex"
               @click.stop="ondetail(i)">
        <div class="status">
          <van-image :src="imgs[active]"></van-image>
        </div>
        <div class="logo">
          <v-a teacher
               :sex="i.gender"
               :src="i.avatar"></v-a>
        </div>
        <div class="text">
          <div class=" text_header">
            <h6>{{ i.name }}</h6>
            <p>手机号：{{ i.contact }}</p>
            <p>
              部门岗位：{{ i.group_name }}-<b>{{ i.job_name }}</b>
            </p>
          </div>
          <div class="text_btn flex">
            <van-button size="mini"
                        round
                        plain
                        type="danger"
                        @click.stop="onevent('del', i)">删除</van-button>
            <template v-if="+i.examine === 2">
              <van-button size="mini"
                          round
                          plain
                          type="info"
                          @click.stop="onevent('ok', i)">通过</van-button>
              <van-button size="mini"
                          round
                          plain
                          type="warning"
                          @click.stop="onevent('err', i)">驳回</van-button>
            </template>
          </div>
        </div>
      </section>
    </v-page>
    <template #fixed>
      <v-t v-model="os.start_time"
           :open="open1"
           max="d_5"
           ymd></v-t>
      <v-t v-model="os.end_time"
           :open="open2"
           max="d_15"
           ymd></v-t>
      <v-f v-model="open3"
           :footer="false"
           text="老师详情">
        <van-cell title="姓名："
                  :value="detail.name"></van-cell>
        <van-cell title="昵称："
                  :value="detail.nickname"></van-cell>
        <van-cell title="手机号："
                  :value="detail.contact"
                  is-link
                  @click="ontel(detail.contact)"></van-cell>
        <van-cell title="注册手机号："
                  :value="detail.phone"
                  is-link
                  @click="ontel(detail.phone)"></van-cell>
        <van-cell title="账号："
                  :value="detail.account"></van-cell>
        <van-cell title="部门："
                  :value="detail.group_name"></van-cell>
        <van-cell title="岗位："
                  :value="detail.job_name"></van-cell>
        <van-cell title="状态："
                  :value="status"></van-cell>
        <van-cell title="提交时间："
                  :value="appTimeout(detail.create_time)"></van-cell>
        <van-cell title="审批时间："
                  :value="appTimeout(detail.approval_time)"></van-cell>
        <van-cell title="备注："
                  :label="detail.remarks || '无'"></van-cell>
        <div class="w80 flex">
          <van-button round
                      type="danger"
                      block
                      @click.stop="onevent('del', detail)">删除</van-button>
          <template v-if="+detail.examine === 2">
            <van-button round
                        type="warning"
                        block
                        @click.stop="onevent('err', detail)">驳回</van-button>
            <van-button round
                        type="info"
                        block
                        @click.stop="onevent('ok', detail)">通过</van-button>
          </template>
        </div>
      </v-f>
      <v-f v-model="open4"
           :footer="false"
           text="驳回申请"
           bgc="#f5f5f5">
        <van-field v-model="brief"
                   rows="3"
                   autosize
                   label="驳回理由"
                   type="textarea"
                   maxlength="125"
                   placeholder="请输入驳回理由"
                   label-width="5em"
                   show-word-limit />
        <div class="w60">
          <van-button block
                      :color="$js.btnColor"
                      round
                      @click="onevent('error', detail)">点击驳回</van-button>
        </div>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vS from "../../private/search.vue";
import vT from "../../private/time.vue";
import vA from "../../private/avatar.vue";
import vF from "../../private/fixed.vue";
const icons = (name) => {
  // eslint-disable-next-line
  return demo.siteConfig.icon(name, "index");
};
export default {
  data() {
    return {
      tab: [
        { t: "待审核", v: "2" },
        { t: "通过", v: "1" },
        { t: "驳回", v: "3" },
      ],
      active: "2",
      item: [],
      open: false,
      open1: false,
      open2: false,
      os: {
        name: "",
        contact: "",
        end_time: "",
        start_time: "",
      },
      imgs: ["", icons(9003), icons(9000), icons(9001)],
      detail: {},
      open3: false,
      open4: false,
      brief: "",
    };
  },
  components: { vS, vT, vA, vF },
  watch: {
    os: {
      handler() {
        this.onPage(1);
      },
      deep: true,
    },
    open3(n) {
      if (!n) {
        this.detail = {};
      }
    },
    open4(n) {
      if (!n) {
        this.detail = {};
        this.brief = "";
      }
    },
  },
  computed: {
    time1() {
      return this.os.start_time ? this.os.start_time : "选择开始时间";
    },
    time2() {
      return this.os.end_time ? this.os.end_time : "选择结束时间";
    },
    status() {
      let a = ["已驳回", "已通过", "待审核"];
      return a[this.detail.examine] || a[0];
    },
  },
  inject: ["appPath", "appTimeout"],
  methods: {
    onevent(type, ext) {
      switch (type) {
        case "ok":
          // { teacher_id: i.id, status: 1, remarks: "" }
          this.$js.model("通过提示", ext.name + "的申请是否通过？", (r) => {
            if (r) {
              this.$api.http(
                "kindergartentachstatus",
                {
                  teacher_id: ext.id,
                  status: 1,
                  remarks: "",
                },
                () => {
                  this.$toast("成功通过");
                  this.open3 = false;
                  this.item = this.item.filter((r) => {
                    return r.id !== ext.id;
                  });
                }
              );
            }
          });
          break;
        case "err":
          this.open4 = true;
          this.detail = ext;
          break;
        case "error":
          if (this.brief === "") return this.$toast("请输入驳回理由");
          this.$js.model(
            "驳回提示",
            "是否驳回" + ext.name + "的申请？",
            (r) => {
              if (r) {
                this.$api.http(
                  "kindergartentachstatus",
                  {
                    teacher_id: ext.id,
                    status: 3,
                    remarks: this.brief,
                  },
                  () => {
                    this.$toast("驳回成功");
                    this.open4 = false;
                    this.item = this.item.filter((r) => {
                      return r.id !== ext.id;
                    });
                  }
                );
              }
            }
          );
          break;
        default:
          this.$js.modeldel(() => {
            this.$api.http(
              "kindergartentachdel",
              { teacher_id: ext.id },
              () => {
                this.open3 = false;
                this.$toast("删除成功");
                this.item = this.item.filter((r) => {
                  return r.id !== ext.id;
                });
              }
            );
          });
      }
    },
    ontel(v) {
      // eslint-disable-next-line
      demo.siteConfig.tel(v);
    },
    ontab() {
      this.appPath("/work_teacher/" + this.active, true);
      this.open = false;
      this.onPage(1, true);
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "kindergartentach",
        { page, examine: this.active, ...this.os },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          this.item = this.item.concat(e);
          this.$refs.page.onFinish(e.length < 20);
        }
      );
    },
    ondetail(e) {
      this.detail = e;
      this.open3 = true;
    },
  },
  mounted() {
    this.active = this.$route.params.type || "2";
    if (this.active > 0) {
      this.ontab();
    }
  },
};
</script>
<style scoped lang='less'  >
.times {
  line-height: 40px;
  height: 40px;
  font-size: 15px;

  span {
    flex: 1;
    text-align: center;
    cursor: pointer;
  }

  b {
    padding: 0 5px;
  }
}

section {
  padding: 10px;
  background-color: rgba(188, 241, 245, 0.3);
  position: relative;

  &:nth-child(2n) {
    background-color: rgba(250, 241, 192, 0.3);
  }

  .status {
    position: absolute;
    right: 0;
    top: 5px;
    width: 60px;
    height: 60px;
    opacity: 0.3;
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

    .text_header {
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

      p+p {
        margin-top: 5px;
      }
    }

    // .btn {
    //   min-height: 25px;
    // }

    .text_btn {
      margin-top: 8px;
      display: flex;
      justify-content: end;

      .van-button {
        min-width: 60px;
        background-color: transparent;
        margin-left: 15px;
      }
    }
  }
}
</style>
