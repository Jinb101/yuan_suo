<template>
  <v-view header>
    <template #menu>
      <v-c v-model="cls"></v-c>
    </template>
    <v-s v-model="val"
         @search="onPage(1)"
         plac="请输入宝宝名字"></v-s>
    <div class="app_top">
      <van-tabs v-model="active"
                title-active-color="#38f"
                @click="onPage(1)">
        <van-tab :title="i.t"
                 :name="i.v"
                 v-for="(i, j) in tab"
                 :key="j + '-s'"></van-tab>
      </van-tabs>
    </div>
    <v-page ref="page"
            @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <div class="app_section">
        <section v-for="(i, j) in item"
                 :key="j"
                 class="flex"
                 @click.stop="ondetail(i)">
          <div class="logo">
            <v-a :sex="i.sex"
                 :src="i.base_map || i.avatar"></v-a>
          </div>
          <div class="text">
            <span class="status"
                  :class="['', '', 'col_green', 'col_danger'][+i.examine_status]">
              {{ ["", "待审核", "核验通过", "核验驳回"][+i.examine_status] }}
            </span>
            <h6>
              {{ i.name }}
            </h6>
            <p>学号：{{ i.no }}</p>
            <p>家长姓名：{{ i.parent_name }}</p>
            <p>
              家长联系方式：<b class="col_primary"
                 @click.stop="ontel(i.contact)">{{ i.contact }}</b>
            </p>
            <p>联系地址：{{ i.address }}</p>
            <p>
              申请时间：{{
                appTimeout(
                  +active === 1 ? i.trial_time : i.examine_time,
                  false,
                  "ymd"
                )
              }}
            </p>
            <p>申请人：{{ i.nickname }}[{{ i.relevance }}]</p>
            <p>
              申请人号码：<b @click.stop="ontel(i.phone)">{{ i.phone }}</b>
            </p>
          </div>
        </section>
      </div>
    </v-page>
    <template #fixed>
      <v-f v-model="open"
           :footer="false"
           :text="detail.name">
        <section class="flex">
          <div class="logo">
            <v-a :src="detail.base_map || detail.avatar"
                 :sex="detail.sex"></v-a>
          </div>
          <div class="text">
            <h6>{{ detail.name }}</h6>
            <p :class="['', '', 'col_green', 'col_danger'][+detail.examine_status]
              ">
              {{
                ["", "待审核", "核验通过", "核验驳回"][+detail.examine_status]
              }}
            </p>
          </div>
        </section>
        <van-cell title="学号"
                  :value="detail.no"></van-cell>
        <van-cell title="家长姓名"
                  :value="detail.parent_name"></van-cell>
        <van-cell title="家长联系方式"
                  :value="detail.contact"
                  is-link
                  @click="ontel(detail.contact)"></van-cell>
        <van-cell title="联系地址"
                  :value="detail.address"></van-cell>
        <van-cell title="提交时间"
                  :value="appTimeout(detail.trial_time)"></van-cell>
        <van-cell title="申请人"
                  :value="parentname"></van-cell>
        <van-cell title="申请人联系方式"
                  :value="detail.phone"
                  is-link
                  @click="ontel(detail.phone)"></van-cell>
        <template v-if="+detail.examine_status > 1">
          <van-divider content-position="left">处理状态</van-divider>
          <template v-if="+detail.examine_status === 3">
            <van-cell title="驳回原因"
                      :label="detail.reject || '无'"></van-cell>
          </template>
          <van-cell title="处理人"
                    :value="detail.staff_name"></van-cell>
          <van-cell title="处理时间"
                    :value="appTimeout(detail.examine_time)"></van-cell>
        </template>
        <div class="w80 flex"
             v-if="+detail.examine_status === 1">
          <van-button block
                      round
                      type="danger"
                      @click="open1 = true">驳回</van-button>
          <van-button block
                      round
                      :color="$js.btnColor"
                      @click="onsubmit(1)">通过</van-button>
        </div>
      </v-f>
      <v-f v-model="open1"
           :footer="false"
           :text="'驳回' + detail.name"
           cover>
        <van-field v-model="brief"
                   rows="3"
                   autosize
                   type="textarea"
                   placeholder="请输入驳回理由"
                   maxlength="100"
                   show-word-limit />
        <div class="w60">
          <van-button block
                      round
                      :color="$js.btnColor"
                      @click="onconfim">提交驳回</van-button>
        </div>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vC from "../../private/select_class.vue";
import vF from "../../private/fixed.vue";
import vS from "../../private/search.vue";
import vA from "../../private/avatar.vue";
export default {
  data() {
    return {
      active: "1",
      val: "",
      tab: [
        { t: "待核验", v: "1" },
        { t: "已核验", v: "2" },
      ],
      item: [],
      open: false,
      detail: {},
      id: "",
      open1: false,
      brief: "",
      cls: {},
    };
  },
  inject: ["appTimeout", "appPath"],
  components: { vF, vS, vA, vC },
  computed: {
    parentname() {
      if (this.detail && this.detail.nickname) {
        let name = this.detail.relevance
          ? ["[", this.detail.relevance, "]"]
          : [];
        return this.detail.nickname + name.join("");
      }
      return "";
    },
  },
  watch: {
    open(n) {
      if (!n) {
        this.appPath("/work_parent", true);
      }
    },
    "cls.id"(v) {
      console.log(v);
      this.$nextTick(() => {
        this.onPage();
      });
    },
  },
  methods: {
    onconfim() {
      if (this.brief === "") return this.$toast("请输入驳回理由");
      this.onsubmit(2, this.brief);
    },
    onsubmit(status, message = "") {
      let os = { id: this.id, status };
      if (status === 2) {
        os.reject = message;
      }
      this.$api.http("parentsend", os, () => {
        this.$toast("操作成功");
        this.open = false;
        this.open1 = false;
        this.item = this.item.filter((r) => {
          return r.id !== os.id;
        });
      });
    },
    ondetail(e) {
      this.$api.http("parentdet", { id: e.id }, (r) => {
        this.detail = r;
        if (r.sex === "") {
          this.detail.sex = e.sex || "";
        }
        this.open = true;
        this.id = e.id;
        this.appPath("/work_parent/" + e.id, true);
      });
    },
    ontel(e) {
      // eslint-disable-next-line
      demo.siteConfig.tel(e);
    },
    onPage(page, f) {
      console.log(page);
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "parent",
        {
          page,
          examine_status: this.active,
          name: this.val,
          class_id: this.cls.id || "",
        },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          console.log(e, this.$refs.page);
          this.item = this.item.concat(e);
          this.$refs.page.onFinish(e.length < 20);
          this.$nextTick()
        }
      );
    },
  },
  mounted() {
    this.id = this.$route.params.id || "";
    if (this.id) {
      this.ondetail({ id: this.id });
    }
  },
};
</script>
<style lang='less' scoped></style>
