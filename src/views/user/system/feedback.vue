<template>
  <div class="feedback">
    <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o">
      提交您对本系统的看法或建议
    </van-notice-bar>
    <x-content></x-content>
    <x-content>
      <van-field
        v-model="message"
        rows="3"
        autosize
        type="textarea"
        maxlength="255"
        placeholder="请输入看法或建议,如需要哪些改进都可以在这里说哦"
        show-word-limit
      />
    </x-content>
    <van-divider
      :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
      content-position="left"
    >
      您对本系统的满意度(0-5颗星)
    </van-divider>
    <x-content>
      <div class="box">
        <van-rate
          v-model="value"
          :size="25"
          color="#ffd21e"
          void-icon="star"
          void-color="#eee"
        />
      </div>
    </x-content>
    <div class="w60">
      <van-button :color="$js.btnColor" block round @click="onsubmit"
        >提交</van-button
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "",
      value: 5,
    };
  },
  methods: {
    onsubmit() {
      if (this.$js.env) return this.$toast("测试无法使用本功能");
      if (this.message === "") return this.$toast("您可以说一些对本系统的看法");
      let obj = {
        message: this.message,
        grade: this.value,
        by: "我的-设置-用户反馈",
      };
      // eslint-disable-next-line
      demo.$err.setMsg(obj);
      // eslint-disable-next-line
      demo.$err.uploadinfo((r) => {
        if (r > 0) {
          this.$toast("提交成功");
          this.message = "";
        }
      });
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.box {
  background-color: #fff;
  padding: 10px;
}
</style>
