<template>
  <v-view header>
    <van-field
      v-model="os.name"
      label="任务名称"
      placeholder="请输入任务名称"
      required
    />
    <van-field
      v-model="os.end_time"
      label="完成时间"
      placeholder="请选择完成时间"
      readonly
      required
      input-align="right"
      right-icon="arrow"
      @click="openTime = !openTime"
    />
    <van-field
      v-model="os.budget"
      label="任务预算"
      placeholder="请输入任务预算"
      type="number"
    >
      <template #button> 元 </template>
    </van-field>
    <van-field
      v-model="os.target"
      label="任务目标"
      placeholder="请输入任务目标"
      rows="2"
      autosize
      type="textarea"
      maxlength="400"
      show-word-limit
    />
    <van-field
      v-model="os.content"
      label="任务说明"
      placeholder="请输入任务说明"
      rows="3"
      autosize
      type="textarea"
      maxlength="600"
      show-word-limit
    />
    <van-field
      label="选择负责人"
      placeholder="请选择负责人"
      readonly
      input-align="right"
      right-icon="arrow"
      @click="$refs.p1.showAdd = true"
    />
    <v-p v-model="list" max="1" ref="p1"></v-p>
    <van-field
      label="选择知会人"
      placeholder="请选择知会人"
      readonly
      input-align="right"
      right-icon="arrow"
      @click="$refs.p2.showAdd = true"
    />
    <v-p v-model="list2" ref="p2"></v-p>
    <div class="btns">
      <van-button block round :color="$js.btnColor" @click="onSend"
        >发布任务</van-button
      >
    </div>
    <template #fixed>
      <v-t :open="openTime" v-model="os.end_time" ymd></v-t>
    </template>
  </v-view>
</template>

<script>
import vT from "../../private/time.vue";
import vP from "../../private/people_task.vue";
export default {
  data() {
    return {
      os: {
        name: "",
        end_time: "",
        principal_id: "",
        inform_id: "",
        content: "",
        target: "",
        budget: "",
      },
      openTime: false,
      list: [],
      list2: [],
    };
  },
  components: { vT, vP },
  methods: {
    onSend() {
      if (!this.list.length) return this.$js.message("请选择负责人");
      if (!this.list2.length) return this.$js.message("请选择知会人");
      if (!this.os.name) return this.$js.message("请输入任务名称");
      if (!this.os.end_time) return this.$js.message("请选择完成时间");
      this.os.principal_id = this.list.map((s) => s.id).join(",");
      this.os.inform_id = this.list2.map((s) => s.id).join(",");
      this.$api.http("task", this.os, () => {
        this.$js.message("发布成功");
        this.$router.back();
      });
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.btns {
  width: 65%;
  margin: 40px auto;
}
</style>
