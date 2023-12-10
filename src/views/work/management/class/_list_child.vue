<template>
  <div class="list_child">
    <van-cell title="宝宝学号" :value="detail.no"></van-cell>
    <van-cell
      title="家长姓名"
      :value="detail.contact"
      :label="detail.parent_name"
      @click="ontel(detail.contact)"
      is-link
    ></van-cell>
    <div class="app_top">
      <van-tabs v-model="type" title-active-color="#38f" @click="ontab">
        <van-tab
          :title="i.t"
          :name="i.v"
          v-for="(i, j) in tab"
          :key="j"
        ></van-tab>
      </van-tabs>
    </div>
    <template v-if="+type === 1">
      <v-a1 v-model="detail"></v-a1>
    </template>
    <template v-else-if="+type === 3">
      <v-a3 v-model="detail" :ids="id"></v-a3>
    </template>
    <template v-else-if="+type === 4">
      <v-a4 v-model="detail" :ids="id" @end="onend4"></v-a4>
    </template>
    <template v-else-if="+type === 5">
      <v-a5 v-model="detail" :ids="id" @del="$emit('del', id)"></v-a5>
    </template>
    <template v-else-if="+type === 6">
      <div class="rule">
        <p>退学规则</p>
        <p>退学操作不可撤回，请二次确认</p>
        <p>若需退学，请点击下方按钮进行退学申请</p>
      </div>
      <div class="w80">
        <van-button block round :color="$js.btnColor" @click="onagreebtn(1)"
          >我已确认！点击退学</van-button
        >
      </div>
    </template>
    <template v-else-if="+type === 7">
      <div class="rule">
        <p>毕业规则</p>
        <p>毕业操作不可撤回，请二次确认</p>
        <p>若需毕业，请点击下方按钮进行毕业申请</p>
      </div>
      <div class="w80">
        <van-button block round :color="$js.btnColor" @click="onagreebtn(0)"
          >我已确认！点击毕业</van-button
        >
      </div>
    </template>
    <template v-else-if="+type === 8">
      <v-a8 :ids="id"></v-a8>
    </template>
    <template v-else-if="+type === 9">
      <v-a9 :ids="id"></v-a9>
    </template>
  </div>
</template>

<script>
import vA1 from "./lib/1.vue";
import vA3 from "./lib/3.vue";
import vA4 from "./lib/4.vue";
import vA5 from "./lib/5.vue";
import vA8 from "./lib/8.vue";
import vA9 from "./lib/9.vue";
export default {
  data() {
    return {
      id: "",
      detail: {},
      type: "",
      tab: [
        { t: "学生详情", v: "1" },
        { t: "出勤记录", v: "3" },
        { t: "家长考勤头像", v: "9" },
        { t: "宝宝考勤头像", v: "4" },
        { t: "转班", v: "5" },
        { t: "退学", v: "6" },
        { t: "毕业", v: "7" },
        { t: "欠费记录", v: "8" },
      ],
    };
  },
  components: { vA1, vA3, vA4, vA8, vA9, vA5 },
  methods: {
    onagreebtn(n) {
      let api = n === 1 ? "classdropout" : "classgraduate";
      this.$api.http(api, { c_id: this.id }, () => {
        this.$toast("操作成功");
        this.$emit("del", this.id);
      });
    },
    ontab() {},
    ontel(v) {
      // eslint-disable-next-line
      demo.siteConfig.tel(v);
    },
    todet_val(e) {
      let i = JSON.parse(JSON.stringify(e));
      return {
        blood_type: i.blood_type || "", // 血型 ['','A','B','O','AB'] [1-4]
        enrollment_data: i.enrollment_data || "", // 入园日期
        height: i.height || "", // 身高
        weight: i.weight || "", // 体重
        only_child_or_not: i.only_child_or_not || "1", // 是否独生子女  1是 2否
        febrile_convulsion_history: i.febrile_convulsion_history || "2", // 有无高热惊厥史 1:有 2否
        disabled_or_not: i.disabled_or_not || "2", // 是否残疾幼儿
        congenital_disability_history: i.congenital_disability_history || "2", // 有无先天性疾病 1有 2无
        allergic_history: i.allergic_history || "2", // 有无过敏史（过敏源） 1有 2无
        householder: i.householder || "", // 户口本（户主）图片
        hukou_baby: i.hukou_baby || "", // 户口宝宝页 图片
        dad_page: i.dad_page || "", // 户口（爸爸页）图片
        mom_page: i.mom_page || "", // 户口（妈妈页）图片
        inoculum: i.inoculum || "", // 接种本【必填】 图片
        family: i.family || "", // 家庭合影
      };
    },
    init() {
      this.$api.http("classstudentdet", { id: this.id }, (r) => {
        this.detail = r;
        if (!(r.baby_files || {}).child_id) {
          this.detail.baby_files = this.todet_val(r.baby_files || {});
        }
      });
    },
    onend4() {
      this.init();
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.id = this.$route.params.id;
      if (!this.id) {
        return this.$emit("close");
      }
      this.init();
    });
  },
};
</script>
<style lang='less' scoped>
.rule {
  font-size: 14px;
  color: #999;
  padding: 10px;
  line-height: 1.3;
  p + p {
    margin-top: 5px;
  }
}
</style>
