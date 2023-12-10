<template>
  <v-view header @on-user="onuser">
    <van-cell
      title="维修日期"
      is-link
      :value="os.date ? os.date : '选择维修日期'"
      @click="open = !open"
    ></van-cell>
    <van-field
      label="维修物品"
      placeholder="请输入维修物品"
      label-width="5em"
      v-model="os.article"
    />
    <van-field
      rows="1"
      autosize
      label="问题说明"
      type="textarea"
      placeholder="请输入问题说明"
      label-width="5em"
      maxlength="125"
      show-word-limit
      v-model="os.explain"
    />
    <van-cell title="待维修人" value="选择待维修人"></van-cell>
    <v-p v-model="s1" :max="1" changeselect></v-p>
    <van-cell title="上报人" value="选择上报人"></van-cell>
    <v-p v-model="s2" :max="1" changeselect></v-p>
    <div class="btn">
      <van-button block round :color="$js.btnColor" @click="onsubmit"
        >点击申请</van-button
      >
    </div>
    <template #fixed>
      <v-t v-model="s3" max="m_1" :open="open"></v-t>
    </template>
  </v-view>
</template>

<script>
import vT from "../../private/time.vue";
import vP from "../../private/people.vue";
export default {
  data() {
    return {
      s1: [],
      s2: [],
      s3: {},
      user: {},
      os: {
        article: "",
        date: "",
        explain: "",
        repairman: "",
        staff_name: "",
      },
      open: false,
    };
  },
  watch: {
    s1: {
      handler(n) {
        if (n[0] && n[0].id) {
          this.os.repairman = n[0].name;
        }
      },
      deep: true,
    },
    s2: {
      handler(n) {
        if (n[0] && n[0].id) {
          this.os.staff_name = n[0].name;
        }
      },
      deep: true,
    },
    s3: {
      handler(n) {
        if (n.obj) {
          this.os.date = n.ymd.replace(/-/g, "/");
        }
      },
      deep: true,
    },
  },
  components: { vT, vP },
  methods: {
    onuser(e) {
      this.user = e;
      this.s2 = [{ avatar: e.avatar, name: e.nickname, id: e.s_id }];
    },
    onsubmit() {
      if (!this.os.article) return this.$toast("请输入维修物品");
      if (!this.os.explain) return this.$toast("请输入维修原因");
      if (!this.os.repairman) return this.$toast("请选择维修人");
      if (!this.os.staff_name) return this.$toast("请选择上报人");
      if (this.user.s_id === this.s1[0].id) {
        return this.$toast("维修人不可为自己");
      }
      this.$api.http("repairsend", this.os, () => {
        this.$toast("申请成功");
        this.s1 = [];
        this.s2 = [];
        let t = this;
        for (let i in this.os) {
          t.os[i] = "";
        }
        // eslint-disable-next-line
        this.os.date = demo.timeout("", "ymd");
      });
    },
  },
  mounted() {
    // eslint-disable-next-line
    this.os.date = demo.timeout("", "ymd");
  },
};
</script>
<style lang='less' scoped>
.btn {
  margin: 30px 20% 0;
}
</style>
