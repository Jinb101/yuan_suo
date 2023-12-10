<template>
  <v-view header :text="title" @on-view="onView" @on-user="onuser">
    <template #menu>
      <span @click="open = !open" v-if="[3, 5, 6].indexOf(+active) < 0"
        >{{ open ? "取消" : "" }}筛选</span
      >
    </template>
    <div class="app_top bgc">
      <van-tabs v-model="active" title-active-color="#38f" @click="onclicktype">
        <van-tab
          :title="i.t"
          :name="i.v"
          v-for="(i, j) in tab"
          :key="j"
        ></van-tab>
      </van-tabs>
      <transition name="van-slide-down">
        <div v-if="open">
          <template v-if="+active === 1 || +active === 4">
            <v-s v-model="os1.name" @search="onPage(1)"></v-s>
            <div class="times flex">
              <span @click="open1 = !open1">{{ time1 }}</span>
              <b>~</b>
              <span @click="open2 = !open2">{{ time2 }}</span>
            </div>
            <van-tabs
              v-model="os1.source_type"
              title-active-color="#6943f2"
              color="#38f"
              v-if="+active === 1"
            >
              <van-tab
                :title="i.t"
                :name="i.v"
                v-for="(i, j) in tab2"
                :key="j + 5"
              ></van-tab>
            </van-tabs>
          </template>
          <template v-else-if="+active === 2">
            <v-s v-model="os2.search" @search="onPage2(1)"></v-s>
            <van-tabs
              v-model="active2"
              title-active-color="#6943f2"
              color="#38f"
              @click="onPage2(1)"
            >
              <van-tab
                :title="i.t"
                :name="i.v"
                v-for="(i, j) in tab3"
                :key="j + 15"
              ></van-tab>
            </van-tabs>
          </template>
          <template v-else-if="+active === 3"> </template>
        </div>
      </transition>
    </div>
    <template v-if="+active === 1 || +active === 4">
      <v-page ref="page" @on-page="onPage">
        <v-page1
          v-model="item"
          @change="onTagChange"
          @detail="ondetail"
          :state="+active === 4"
        ></v-page1>
      </v-page>
    </template>
    <template v-else-if="+active === 2">
      <v-page ref="page2" @on-page="onPage2">
        <v-page2 v-model="item2" @detail="ondetail2"></v-page2>
      </v-page>
    </template>
    <template v-else-if="+active === 3">
      <v-page3 qr></v-page3>
    </template>
    <template v-else-if="+active === 5">
      <v-page4 :user="user"></v-page4>
    </template>
    <template v-else-if="+active === 6">
      <van-cell title="生源分析表" is-link @click="open7 = true"></van-cell>
      <van-cell title="园所竞争分析表" is-link @click="open8 = true"></van-cell>
    </template>
    <template #fixed>
      <v-t v-model="t1" :open="open1" max="d_5"></v-t>
      <v-t v-model="t2" :open="open2" max="d_15"></v-t>
      <v-f v-model="open3" :footer="false" text="生源信息详情">
        <template #menu>
          <span @click="open6 = true">编辑</span>
        </template>
        <van-cell title="宝宝姓名" :value="detail.name"></van-cell>
        <van-cell
          title="性别"
          :value="+detail.gender === 1 ? '男' : '女'"
        ></van-cell>
        <van-cell title="出生日期" :value="detail.birthday"></van-cell>
        <van-cell title="家长姓名" :value="detail.parent_name"></van-cell>
        <van-cell
          title="联系方式"
          :value="detail.contact"
          is-link
          @click="ontel(detail.contact)"
        ></van-cell>
        <van-cell title="联系地址" :value="detail.address"></van-cell>
        <van-cell
          title="录入时间"
          :value="appTimeout(detail.create_time)"
        ></van-cell>
        <van-cell title="添加人" :value="detail.staff_name"></van-cell>
        <van-cell
          title="类型"
          :value="['', 'A', 'B', 'C'][detail.source_type] + '类'"
        ></van-cell>
        <div class="w60" v-if="isdel">
          <van-button block round :color="$js.btnColor" @click="ondeldetail"
            >删除</van-button
          >
        </div>
      </v-f>
      <v-f v-model="open4" text="备注" :footer="false">
        <v-l :ids="id"></v-l>
      </v-f>
      <v-f v-model="open5" text="定位详情" :footer="false">
        <van-cell title="宝宝姓名" :value="detail2.name"></van-cell>
        <van-cell
          title="宝宝性别"
          :value="+detail2.gender === 1 ? '男' : '女'"
        ></van-cell>
        <van-cell title="出生日期" :value="detail2.birthday"></van-cell>
        <van-cell title="家长姓名" :value="detail2.parent_name"></van-cell>
        <van-cell
          title="联系方式"
          :value="detail2.contact"
          is-link
          @click="ontel(detail.contact)"
        ></van-cell>
        <van-cell title="联系地址" :value="detail2.address"></van-cell>
        <van-cell title="缴费时间" :value="appTimeout(detail2.time)"></van-cell>
        <van-cell title="缴费金额" :value="+detail2.amount + '元'"></van-cell>
        <div class="w60">
          <van-button block round :color="$js.btnColor" @click="open5 = false"
            >关闭</van-button
          >
        </div>
      </v-f>
      <v-f v-model="open6" text="编辑信息" :footer="false">
        <v-page3 v-model="detail" edit @change="open6 = false"></v-page3>
      </v-f>
      <v-f v-model="open7" text="生源分析表" :footer="false" bgc="#f9f9f9">
        <v-page5s></v-page5s>
      </v-f>
      <v-f v-model="open8" text="园所竞争分析表" :footer="false" bgc="#f9f9f9">
        <template #menu>
          <span @click="num8++">发布</span>
        </template>
        <v-page5k :eadd="num8"></v-page5k>
      </v-f>
      <v-f v-model="open9" :footer="false" text="分班操作">
        <van-cell title="宝宝姓名" :value="detail.name"></van-cell>
        <van-cell
          title="年级"
          is-link
          :value="class1"
          @click="open10 = !open10"
        ></van-cell>
        <van-cell
          title="班级"
          is-link
          :value="class2"
          @click="onclass"
        ></van-cell>
        <div class="w60">
          <van-button
            block
            round
            :color="$js.btnColor"
            :disabled="!a2.id"
            @click="onsubmit"
            >确认转入</van-button
          >
        </div>
      </v-f>
      <v-c v-model="a1" :list="t3" text="name" :open="open10"></v-c>
      <v-c v-model="a2" :list="t4" text="nickname" :open="open11"></v-c>
    </template>
  </v-view>
</template>

<script>
import vS from "../../private/search.vue";
import vT from "../../private/time.vue";
import vA from "../../private/avatar.vue";
import vF from "../../private/fixed.vue";
import vL from "./_label.vue";
import vC from "../../private/select.vue";
import vPage1 from "./_source_page.vue";
import vPage2 from "./_locate_page.vue";
import vPage3 from "./_add_page.vue";
import vPage4 from "./_poster.vue";
import vPage5s from "../../form/analysis/student.vue";
import vPage5k from "../../form/analysis/kindergarten_compete.vue";
export default {
  data() {
    return {
      num: 0,
      tab: [
        { t: "生源信息", v: "1" },
        // { t: "定位信息", v: "2" },
        { t: "添加信息", v: "3" },
        { t: "已入学", v: "4" },
        { t: "招生海报", v: "5" },
        { t: "辅助工具", v: "6" },
      ],
      tab2: ["A", "B", "C"].map((s, v) => {
        return { t: s + "类", v: v + 1 };
      }),
      tab3: [
        { t: "已缴定位费", v: "0", a: "recruitlocate" },
        { t: "定位待审核", v: "1", a: "recruitlocatestatus" },
        { t: "已取消", v: "2", a: "recruitlocatecancel" },
      ],
      active: "1",
      active2: "0",
      open: false,
      os1: {
        source_type: "1",
        name: "",
        end_date: "",
        start_date: "",
        status: "0",
      },
      os2: { search: "" },
      open1: false, // 控制时间 active===1,4 开始时间
      open2: false, // 控制时间 active===1,4 结束时间
      open3: false, // 控制详情 active===1,4
      open4: false, // 控制备注 active===1,4
      open5: false, // 控制定位详情 active===2
      open6: false, // 控制编辑 active===1,4
      open7: false, // 控制生源分析表
      open8: false, // 控制竞争表
      open9: false, // 分班
      open10: false, // 控制年级 分班
      open11: false, // 控制班级 分班
      t1: {},
      t2: {},
      t3: [],
      t4: [],
      item: [],
      item2: [], // active===2
      id: "",
      detail: {},
      detail2: {},
      isdel: false, // 控制详情 active===1,4 删除
      a1: {},
      a2: {},
      num8: 0,
      user: {},
      menulevel: [],
    };
  },
  inject: ["appTimeout", "appPath"],
  watch: {
    t1: {
      handler(n) {
        this.os1.start_date = n.ymd ? n.ymd.replace(/-/g, "/") : "";
      },
      deep: true,
    },
    t2: {
      handler(n) {
        this.os1.end_date = n.ymd ? n.ymd.replace(/-/g, "/") : "";
      },
      deep: true,
    },
    os1: {
      handler(n) {
        this.onPage(1);
      },
      deep: true,
    },
    open3(n) {
      if (!n) {
        this.id = "";
        this.detail = {};
        this.appPath("/work_recruit/" + this.active, true);
      }
    },
    open4(n) {
      if (!n) {
        this.id = "";
        this.detail = {};
        this.appPath("/work_recruit/" + this.active, true);
      }
    },
    open5(n) {
      if (!n) {
        this.id = "";
        this.detail2 = {};
        this.appPath("/work_recruit/" + this.active, true);
      }
    },
    a1: {
      handler(n) {
        this.a2 = {};
        this.t4 = [];
        this.$api.http("getclassonce", { g_id: n.id }, (r) => {
          this.t4 = r;
        });
      },
      deep: true,
    },
  },
  components: {
    vS,
    vT,
    vA,
    vF,
    vL,
    vC,
    vPage1,
    vPage2,
    vPage3,
    vPage4,
    vPage5s,
    vPage5k,
  },
  computed: {
    title() {
      let n = +this.active;
      if (n === 1 || n === 4) {
        return "生源信息(" + this.num + ")";
      }
      return "招生工作";
    },
    time1() {
      return this.os1.start_date ? this.os1.start_date : "选择开始时间";
    },
    time2() {
      return this.os1.end_date ? this.os1.end_date : "选择结束时间";
    },
    class1() {
      return this.a1.id ? this.a1.name : "请选择年级";
    },
    class2() {
      return this.a2.id ? this.a2.nickname : "请选择班级";
    },
  },
  methods: {
    onuser(e) {
      this.user = e;
    },
    onsubmit() {
      let os = {
        group_id: this.a1.id,
        class_id: this.a2.id,
        c_id: this.detail.id,
        base_map: "",
      };
      this.$api.http("classsplit", os, () => {
        this.$toast("成功分班");
        this.open = false;
        this.item = this.item.filter((r) => {
          return r.id !== os.c_id;
        });
        this.a1 = this.a2 = {};
        this.open9 = false;
        this.detail = {};
      });
    },
    onclass() {
      if (!this.a1.id) return this.$toast("请先选择年级");
      this.open11 = !this.open11;
    },
    onView(e = {}) {
      let a = [];
      if (e.level && e.level.length) {
        a = e.level.filter((r) => {
          return r.id === 749;
        });
      }
      this.isdel = a.length > 0;
      this.menulevel = (e.menulevel || {}).close || [];
      if (this.menulevel.length && this.menulevel.indexOf(1000) >= 0) {
        this.tab = this.tab.filter((r) => {
          return +r.v !== 5;
        });
      }
    },
    // 查看定位详情
    ondetail2(i) {
      this.id = i.charge_id;
      this.appPath("/work_recruit/" + this.active + "&" + i.charge_id, true);
      this.$api.http(
        "recruitlocatedetail",
        {
          charge_id: i.charge_id,
        },
        (r) => {
          this.detail2 = r;
          this.open5 = true;
        }
      );
    },
    // 查看生源详情
    ondetail(e, j) {
      this.appPath("/work_recruit/" + this.active + "&" + e.id, true);
      this.id = e.id;
      this.$api.http("recruitdet", { child_id: e.id }, (r) => {
        this.detail = r;
        this.open3 = true;
      });
    },
    // 删除生源信息
    ondeldetail() {
      this.$js.modeldel(() => {
        this.$api.http("recruitdel", { c_id: this.detail.id }, () => {
          this.$toast("删除成功");
          let id = this.detail.id;
          this.item = this.item.filter((s) => {
            return s.id !== id;
          });
          this.open3 = false;
        });
      });
    },
    // 生源event
    onTagChange(e) {
      let edata = e.ext;
      switch (e.type) {
        case "flower": // 点击入学
          this.$js.model("入学提示", "是否办理入学？", (r) => {
            if (r) {
              this.$api.http(
                "recruitschool",
                { child_id: edata.id, status: 12 },
                () => {
                  this.item = this.item.filter((r) => {
                    return r.id !== edata.id;
                  });
                  this.$toast("办理入学成功");
                }
              );
            }
          });
          break;
        case "tel": // 拨打电话
          this.ontel(edata.contact);
          break;
        case "label": // 备注
          this.appPath("/work_recruit/" + this.active + "&" + edata.id, true);
          this.id = edata.id;
          this.open4 = true;
          break;
        case "classes": // 分班
          this.detail = edata;
          this.open9 = true;
          // this.appPath("/management_classnot/" + edata.id);
          // this.$js.model("分班提示", "是否进行分班操作", (r) => {
          //   if (r) {
          //     this.$api.http(
          //       "recruitschool",
          //       { child_id: edata.id, status: 1 },
          //       () => {
          //         this.item = this.item.filter((r) => {
          //           return r.id !== edata.id;
          //         });
          //         this.$toast("分班成功");
          //         // 跳转至分班页
          //         // this.appPath('/')
          //       }
          //     );
          //   }
          // });
          break;
        default:
      }
    },
    // 拨打电话
    ontel(v) {
      // eslint-disable-next-line
      demo.siteConfig.tel(v);
    },
    // 点击tab
    onclicktype() {
      this.item = [];
      this.item2 = [];
      this.open = false;
      this.appPath("/work_recruit/" + this.active, true);
      if (+this.active === 1 || +this.active === 4) {
        this.onPage(1, true);
      } else if (+this.active === 2) {
        this.onPage2(1, true);
      }
    },
    // 生源分页
    onPage(page, f) {
      if (!f) {
        return this.$refs.page && this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      if (+this.active === 4) {
        this.os1.source_type = "";
      } else {
        this.os1.source_type = this.os1.source_type || 1;
      }
      this.$api.http(
        "recruit",
        {
          page,
          ...this.os1,
          status: +this.active === 1 ? "0" : "12",
        },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          let ev = (e.data || []).map((s) => {
            s.$open = false;
            return s;
          });
          this.item = this.item.concat(ev);
          this.$refs.page.onFinish(ev.length < 20);
          this.num = e.total || 0;
        }
      );
    },
    onPage2(page, f) {
      if (!f) {
        return this.$refs.page2 && this.$refs.page2.onRefresh();
      }
      if (+page === 1) {
        this.item2 = [];
      }
      let api = this.tab3[this.active2].a;
      this.$api.http(
        api,
        {
          page,
          ...this.os2,
        },
        (e) => {
          this.item2 = this.item.concat(e);
          this.$refs.page2.onFinish(e.length < 20);
        }
      );
    },
  },
  mounted() {
    this.t3 = this.$api.classes();
    this.active = this.$route.params.type || "1";
    if (this.active > 1) {
      this.onclicktype();
    }
  },
};
</script>
<style lang='less' scoped>
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
</style>
