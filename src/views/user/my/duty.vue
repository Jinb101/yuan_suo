<template>
  <v-view @on-user="onUser" header :back="staff > 0" @on-back="onBack">
    <van-field
      rows="2"
      autosize
      label="职责描述"
      type="textarea"
      maxlength="125"
      placeholder="请输入职责描述"
      show-word-limit
      v-model="os.duty"
    />
    <van-field
      rows="2"
      autosize
      label="每天"
      type="textarea"
      maxlength="125"
      placeholder="请输入每天的职责描述"
      show-word-limit
      v-model="os.every_day"
    />
    <van-field
      rows="2"
      autosize
      label="每周"
      type="textarea"
      maxlength="125"
      placeholder="请输入每周的职责描述"
      show-word-limit
      v-model="os.weekly"
    />
    <van-field
      rows="2"
      autosize
      label="每月"
      type="textarea"
      maxlength="125"
      placeholder="请输入每月的职责描述"
      show-word-limit
      v-model="os.monthly"
    />
    <van-field
      rows="2"
      autosize
      label="每学期"
      type="textarea"
      maxlength="125"
      placeholder="请输入每学期的职责描述"
      show-word-limit
      v-model="os.semester"
    />
    <van-field
      rows="2"
      autosize
      label="每年"
      type="textarea"
      maxlength="125"
      placeholder="请输入每年的职责描述"
      show-word-limit
      v-model="os.annually"
    />
    <div class="btn">
      <van-button block round :color="$js.btnColor" @click="save"
        >保存</van-button
      >
    </div>
  </v-view>
</template>

<script>
export default {
  props: {
    staff: [Number, String],
  },
  data() {
    return {
      os: {},
      id: "",
    };
  },
  methods: {
    onBack() {
      this.$emit("back");
    },
    onUser(e) {
      this.$nextTick(() => {
        if (this.staff > 0) return 0;
        this.init(e.s_id);
      });
    },
    save() {
      let os = {
        j_id: this.id,
        duty: JSON.stringify(this.os),
      };
      this.$api.http("userdutyset", os, () => {
        this.$toast("保存成功");
      });
    },
    init(staff_id) {
      this.$api.http("userduty", { staff_id }, (r) => {
        this.id = r.j_id;
        this.os = r.duty || {};
      });
    },
  },
  mounted() {
    if (this.staff > 0) {
      this.init(this.staff);
    }
  },
};
</script>
<style lang='less' scoped>
.btn {
  margin: 30px 20%;
}
</style>
