<template>
  <v-view header :text="allnum">
    <section class="list">
      <van-field
        v-model="cnum"
        type="digit"
        label="已开班"
        placeholder="请输入开班人数"
        maxlength="2"
        @blur="onSaveNums"
        colon
      >
        <template #button> 在读：{{ num }} </template>
      </van-field>
    </section>
    <section class="flex list">
      <span>部门</span>
      <span>定编</span>
      <span>在编</span>
      <span>缺编</span>
      <span>超编</span>
      <span></span>
    </section>
    <van-empty description="暂无" v-if="!item.length" />
    <section v-for="(i, j) in item" :key="j + '-r'" class="flex list">
      <span class="van-ellipsis">{{ i.name }}</span>
      <span>
        <van-field
          type="digit"
          @blur="onSetNum($event, i)"
          v-model="i.number"
        ></van-field>
      </span>
      <span>{{ i.staff_count }}</span>
      <span>{{ i.min }}</span>
      <span :class="{ col_danger: i.max > 0 }">{{ i.max }}</span>
      <span class="col_green" @click.stop="onDetail(i)">详情</span>
    </section>
    <template #fixed>
      <v-f v-model="open" :footer="false" :text="childtext">
        <v-page ref="page" @on-page="onPage">
          <van-empty v-if="!list.length"></van-empty>
          <van-checkbox-group v-model="result">
            <section
              v-for="(i, j) in list"
              :key="j"
              class="flex child"
              @click.stop="toggle(j)"
            >
              <div class="status">
                <van-checkbox :name="i.id" ref="checkboxes" />
              </div>
              <div class="logo">
                <v-a :src="i.avatar"></v-a>
              </div>
              <div class="text">
                <h6>{{ i.name }}</h6>
                <p>{{ i.group_name }}-{{ i.job_name }}</p>
                <p>
                  联系方式：<b
                    class="col_primary"
                    @click.stop="ontel(i.contact)"
                    >{{ i.contact }}</b
                  >
                </p>
              </div>
            </section>
          </van-checkbox-group>
        </v-page>
        <div class="w80">
          <van-button
            block
            round
            :color="$js.btnColor"
            :disabled="result.length < 1"
            @click="ondelall"
            >删除选中({{ result.length }})</van-button
          >
        </div>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import { Notify } from "vant";
import vF from "../../private/fixed.vue";
import vA from "../../private/avatar.vue";
export default {
  data() {
    return {
      num: 0,
      cnum: 0,
      item: [],
      id: "",
      open: false,
      detail: {},
      list: [],
      result: [],
    };
  },
  components: { vF, vA },
  computed: {
    allnum() {
      let a = this.item.map((s) => {
        return s.staff_count;
      });
      let num = 0;
      if (a.length) {
        // eslint-disable-next-line
        num = demo.array(a).sum(0);
      }
      return "总编制(" + num + ")人";
    },
    childtext() {
      return (this.detail.name || "") + "岗位员工";
    },
  },
  watch: {
    open(n) {
      if (!n) {
        this.appPath("/work_organization", true);
        this.id = "";
        this.detail = {};
        this.result = [];
        this.list = [];
      }
    },
  },
  inject: ["appPath"],
  methods: {
    ondelall() {
      let res = this.result;
      this.$js.model("删除提示", "是否删除选中？", (r) => {
        if (r) {
          this.$api.http(
            "kindergartenorganstaffdels",
            { staff_id: res.join(",") },
            () => {
              this.$toast("删除成功");
              this.list = this.list.filter((r) => {
                return res.indexOf(r.id) < 0;
              });
              this.result = [];
            }
          );
        }
      });
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    ontel(v) {
      // eslint-disable-next-line
      demo.siteConfig.tel(v);
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.list = [];
      }
      this.$api.http("kindergartenorganstaff", { page, g_id: this.id }, (e) => {
        if (+page === 1) {
          this.list = [];
        }
        this.list = this.list.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
    init() {
      this.$api.http("getGroup", {}, (r) => {
        this.item = r.map((s) => {
          s.max = s.staff_count - s.number;
          s.max = s.max > 0 ? s.max : 0;
          s.min = s.number - s.staff_count;
          s.min = s.min > 0 ? s.min : 0;
          return s;
        });
      });
      if (this.id && !this.detail.id) {
        this.onDetail({ id: this.id });
      }
    },
    onSaveNums() {
      if (this.cnum < 1) return this.$toast("开班数量不可小于1");
      this.$api.http(
        "kindergartenorganset",
        { shift_started: this.cnum },
        () => {}
      );
    },
    onDetail(e) {
      this.detail = e;
      this.id = e.id;
      this.appPath("/work_organization/" + e.id, true);
      this.$nextTick(() => {
        this.open = true;
      });
    },
    onSetNum(e, i) {
      this.$nextTick(() => {
        this.$api.http(
          "kindergartenorgansetnum",
          { group_id: i.id, number: i.number },
          () => {
            Notify({
              message: "设置成功",
              type: "success",
              duration: 1500,
            });
            this.init();
          }
        );
      });
    },
  },
  mounted() {
    this.id = this.$route.params.id || "";
    this.$api.http("kindergartenorgan", {}, (r) => {
      this.num = r.all_count || 0;
      this.cnum = r.shift_started || 0;
    });
    this.init();
  },
};
</script>
<style lang='less' scoped>
.list {
  padding: 10px;
  background-color: rgba(216, 233, 255, 0.5);
  &:nth-child(2n) {
    background-color: rgba(233, 255, 255, 0.5);
  }
  .van-cell {
    background: transparent;
  }
  &.flex {
    span {
      flex: 1;
      font-size: 14px;
      text-align: center;
      font-weight: 650;
      line-height: 44px;
      .van-cell {
        background: rgba(204, 204, 204, 0.4);
        border-radius: 5px;
      }
    }
  }
}
.child {
  padding: 10px;
  background-color: rgba(188, 241, 245, 0.3);
  position: relative;
  align-items: center;
  &:nth-child(2n) {
    background-color: rgba(250, 241, 192, 0.3);
  }
  .logo {
    width: 50px;
    margin-right: 10px;
    height: 50px;
  }
  .status {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    z-index: 5;
    margin: auto;
  }
  .text {
    width: calc(100% - 60px);
    font-size: 12px;
    position: relative;
    padding-top: 5px;
    color: #999;
    h6 {
      font-weight: 650;
      line-height: 20px;
      margin-bottom: 5px;
      font-size: 15px;
      color: #666;
    }
    p + p {
      margin-top: 5px;
    }
  }
}
</style>
