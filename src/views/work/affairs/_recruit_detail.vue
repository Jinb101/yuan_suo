<template>
  <div class="recruit_detail">
    <!-- 头像区 -->
    <v-a class="avatar_head" teacher :src="info.avater"></v-a>
    <v-l title="基本信息" more>
      <p>姓名：{{ info.name }}</p>
      <p>性别：{{ +info.sex === 1 ? "男" : "女" }}</p>
      <p>应聘职位：{{ info.job }}</p>
      <p>年龄：{{ info.age }}</p>
      <p>
        联系电话：<b class="col_primary" @click="ontel(info.phone)">{{
          info.phone
        }}</b>
      </p>
      <template #more>
        <p>招聘途径：{{ info.approach }}</p>
        <p>婚姻状况：{{ toStatus(info.marital_status) }}</p>
        <p>填表日期：{{ info.date }}</p>
        <p>籍贯：{{ info.origin }}</p>
        <p>身份证号：{{ info.id_card }}</p>
        <p>户籍地址：{{ info.origin_address }}</p>
        <p>现住址：{{ info.now_address }}</p>
      </template>
    </v-l>
    <v-l title="学历状况" more>
      <p>最高学历：{{ toStatus(info.education, "school") }}</p>
      <!-- <p>职称：{{ info.job_title || "/" }}</p> -->
      <p>所学专业：{{ info.professional }}</p>
      <template #more>
        <p>毕业院校：{{ info.school }}</p>
        <p>毕业时间：{{ info.graduation_time }}</p>
        <p>参加工作时间：{{ info.work_time }}</p>
      </template>
    </v-l>
    <v-l title="专业证书" v-if="false"></v-l>
    <v-l title="爱好特长" v-if="false"></v-l>
    <v-l title="个人能力" v-if="false"></v-l>
    <v-l title="教育背景" v-if="edu.length">
      <article v-for="(i, j) in edu" :key="j + '-ar'">
        <p>学校名称：{{ i.school_name }}</p>
        <p>专业：{{ i.professional }}</p>
        <p>起止时间：{{ i.time }}</p>
        <p>取得文聘/资格证书：</p>
        <div class="imgs" @click="appShowImage(i.diploma)" v-if="i.diploma">
          <van-image :src="i.diploma" fit="cover"></van-image>
        </div>
      </article>
    </v-l>
    <v-l title="薪资要求">
      <p>期望薪资待遇：{{ info.max_wage }}</p>
      <p>最低工资要求：{{ info.min_wage }}</p>
    </v-l>
    <v-l title="工作经验" v-if="works.length">
      <article v-for="(i, j) in works" :key="j + '-w'">
        <p>单位名称：{{ i.company }}</p>
        <p>职位：{{ i.job }}</p>
        <p>起止时间：{{ i.time }}</p>
        <p>收入：{{ i.wage }}</p>
        <p>证明人：{{ i.witness }}</p>
        <p>电话：{{ i.phone }}</p>
      </article>
    </v-l>
    <v-l title="家庭信息" v-if="people.length">
      <article v-for="(i, j) in people" :key="j + '-p'">
        <p>姓名：{{ i.name }}</p>
        <p>年龄：{{ i.age }}</p>
        <p>与本人关系：{{ i.relationship }}</p>
        <p>职业：{{ i.job }}</p>
        <p>详细地址：{{ i.address }}</p>
        <p>电话：{{ i.phone }}</p>
      </article>
    </v-l>
    <v-l title="其他/附件" v-if="false"> {{ info.enclosures }}</v-l>
    <div class="w60">
      <van-button block round :color="$js.btnColor" @click="ontel(info.phone)"
        >联系Ta</van-button
      >
    </div>
  </div>
</template>

<script>
import vL from "./_recruit_line.vue";
import vA from "../../private/avatar.vue";
export default {
  props: {
    value: null,
  },
  data() {
    return {};
  },
  components: { vL, vA },
  computed: {
    detail: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    info() {
      return this.detail.resume_info || {};
    },
    edu() {
      return this.detail.resume_education || [];
    },
    works() {
      return this.detail.resume_experience || [];
    },
    people() {
      return this.detail.resume_member || [];
    },
  },
  inject: ["appShowImage"],
  watch: {
    detail: {
      handler(v) {
        this.$emit("input", v);
      },
      deep: true,
    },
  },
  methods: {
    toStatus(index, name) {
      let val = [];
      switch (name) {
        case "school":
          val = [
            "小学",
            "初中",
            "高中",
            "大学专科",
            "大学本科",
            "硕士研究生",
            "博士研究生",
          ];
          break;
        default:
          val = ["未婚", "已婚", "离异"];
      }
      return val[+index - 1];
    },
    ontel(v) {
      // eslint-disable-next-line
      demo.siteConfig.tel(v);
    },
  },
  mounted() {
    this.detail = this.value;
  },
};
</script>
<style lang='less' scoped>
.recruit_detail {
  font-size: 15px;
  overflow: hidden;
  padding-bottom: 40px;

  .avatar_head {
    width: 200px;
    height: 200px;
    margin: 0 auto;
    padding: 20px 0;
  }
  .imgs {
    width: 100px;
    height: 100px;
    margin-top: 5px;
  }
  p + p {
    margin-top: 5px;
  }
  article {
    padding: 8px;
    border-radius: 5px;
    &:nth-child(2n) {
      background-color: rgba(134, 247, 232, 0.1);
    }
    & + article {
      margin-top: 5px;
    }
  }
}
</style>
