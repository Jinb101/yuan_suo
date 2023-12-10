<template>
  <v-view header>
    <template #menu>
      <span v-if="childid" @click="open = true">更换宝宝</span>
    </template>
    <template v-if="childid">
      <slot />
      <van-cell title="宝宝名字" :value="title" v-if="title"></van-cell>
      <van-field
        label="奖励积分"
        placeholder="请输入奖励积分"
        type="number"
        v-model="num"
      />
      <van-field
        rows="2"
        autosize
        label="奖励原因"
        type="textarea"
        maxlength="125"
        placeholder="请输入奖励原因"
        show-word-limit
        v-model="val"
      />
      <van-cell title="奖励拍照"> </van-cell>
      <v-upload-once v-model="img" class="image"></v-upload-once>
      <div class="btn">
        <van-button
          block
          round
          :color="$js.btnColor"
          @click="onsave"
          :disabled="disable"
          >添加</van-button
        >
      </div>
    </template>
    <template v-else>
      <van-empty description="请先选择宝宝">
        <van-button
          :color="$js.btnColor"
          @click="open = true"
          round
          block
          size="small"
          class="a_btn"
          >点击选择宝宝</van-button
        >
      </van-empty>
    </template>
    <template #fixed>
      <v-f v-model="open" :footer="false" cover text="选择宝宝">
        <template #menu>
          <v-cs v-model="cls"></v-cs>
        </template>
        <v-c :cid="cls.id + ''" v-model="childid" @change="onchangechild"></v-c>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
import vC from "./_class_roster.vue";
import vCs from "../../private/select_class.vue";
export default {
  props: {
    path: Boolean,
  },
  data() {
    return {
      open: false, // 选择宝宝
      cls: {},
      childid: "",
      item: [],
      title: "",
      img: {},
      num: "",
      val: "",
      disable: false,
    };
  },
  inject: ["appPath", "reload"],
  components: { vF, vC, vCs },
  methods: {
    onchangechild(n, e = {}) {
      this.open = false;
      if (this.path) {
        this.$emit("change", n);
      } else {
        if (n) {
          this.appPath("/work_reward/" + n, true);
        } else {
          this.appPath("/work_reward", true);
        }
      }
      this.title = e.name;
    },
    onsave() {
      if (this.num === "") return this.$toast("请输入分数");
      let os = {
        child_id: this.childid,
        integral: this.num,
        describe: this.val,
        photograph: this.img.src,
      };
      this.disable = true;

      this.$api.http("reward", os, () => {
        this.$toast("奖分成功");
        this.disable = false;
        this.num = "";
        this.val = "";
        this.img = { $reset: true };
      });
    },
  },
  mounted() {
    let params = this.$route.params;
    if (params.id) {
      this.childid = params.id;
      this.onchangechild(this.childid);
    }
    this.open = this.childid === "";
  },
};
</script>
<style lang='less' scoped>
.image {
  margin: 10px;
  width: 100px;
  height: 100px;
}
.btn {
  width: 60%;
  margin: 30px auto;
}
</style>
