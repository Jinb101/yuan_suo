<template>
  <v-view header text="发通知" @on-user="onview">
    <van-field
      v-model="title"
      label="标题"
      placeholder="请输入通知标题"
      maxlength="50"
      label-width="3em"
      required
    />
    <van-field
      v-model="desc"
      rows="2"
      autosize
      label="内容"
      type="textarea"
      label-width="3em"
      placeholder="请输入通知内容"
      maxlength="600"
      show-word-limit
      required
    />
    <van-field label="发送给员工" label-width="6em" readonly v-if="!unboss">
      <template #button>
        <van-radio-group v-model="staff" direction="horizontal">
          <van-radio name="all">全部</van-radio>
          <van-radio name="2">选择</van-radio>
          <van-radio name="3">无</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <transition name="van-fade">
      <v-people
        api
        type="staffs"
        v-model="allStaff"
        v-if="staff === '2'"
        open
      ></v-people>
    </transition>
    <van-field label="发送给家长" label-width="6em" readonly>
      <template #button>
        <van-radio-group v-model="parent" direction="horizontal">
          <van-radio name="all">全部</van-radio>
          <van-radio name="2">选择</van-radio>
          <van-radio name="3">无</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <transition name="van-fade">
      <v-people
        api
        type="parents"
        v-model="allPeople"
        v-if="parent === '2'"
        open
      ></v-people>
    </transition>
    <van-field label="签名" label-width="6em" readonly>
      <template #button>
        <van-radio-group v-model="write" direction="horizontal">
          <van-radio name="1">是</van-radio>
          <van-radio name="0">否</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <h6 class="app_title6">添加图片</h6>
    <x-content>
      <v-uploads v-model="image">
        <div class="image">
          <v-upload
            more
            @on-loading="onImageLoading"
            @on-path="onImagePath"
          ></v-upload>
        </div>
      </v-uploads>
    </x-content>
    <h6 class="app_title6">添加附件</h6>
    <x-content>
      <v-uploads v-model="list">
        <div class="image">
          <v-upload
            ids="a1"
            more
            @on-loading="onTextLoading"
            @on-path="onTextPath"
            type="text"
          ></v-upload>
        </div>
      </v-uploads>
    </x-content>
    <x-content>
      <div class="btns">
        <van-button block round :color="$js.btnColor" @click="onSubmit"
          >发送通知</van-button
        >
      </div>
    </x-content>
  </v-view>
</template>

<script>
import vPeople from "../../private/people.vue";
export default {
  data() {
    return {
      a: "",
      image: [],
      list: [],
      allStaff: [],
      allPeople: [],
      title: "",
      desc: "",
      write: "0",
      staff: "all",
      parent: "all",
      unboss: true,
    };
  },
  components: { vPeople },
  computed: {
    tmpos() {
      return {
        image: this.image,
        list: this.list,
        title: this.title,
        desc: this.desc,
        allStaff: this.allStaff,
        allPeople: this.allPeople,
        staff: this.staff,
        parent: this.parent,
        write: this.write,
      };
    },
  },
  watch: {
    tmpos: {
      handler(n) {
        // eslint-disable-next-line
        demo.siteConfig.tempdata("notify", n);
      },
      deep: true,
    },
  },
  methods: {
    onview(e) {
      this.unboss = +e.is_whether === 0;
    },
    onImageLoading(e, list) {
      this.image = list;
    },
    onImagePath(e, list) {
      this.image = list;
    },
    onTextLoading(e, list) {
      this.list = list;
    },
    onTextPath(e, list) {
      this.list = list;
    },
    init() {
      // eslint-disable-next-line
      let v = demo.siteConfig.tempdata("notify");
      if (v.$time) {
        for (let i in v.data) {
          if (typeof this[i] !== "undefined") {
            this[i] = v.data[i];
          }
        }
      }
    },
    // 发送通知
    onSubmit() {
      if (!this.title) return this.$js.message("请输入标题");
      if (!this.desc) return this.$js.message("请输入发送内容");
      let os = {
        title: this.title,
        content: this.desc,
        imgs: this.image.map((s) => s.src).filter((s) => !!s),
        staff_id:
          this.staff === "all"
            ? "all"
            : this.staff === "3"
            ? ""
            : this.allStaff.map((s) => s.id).join(","),
        parent_id:
          this.parent === "all"
            ? "all"
            : this.parent === "3"
            ? ""
            : this.allPeople.map((s) => s.id).join(","),
        file: this.list
          .map((s) => s.src)
          .filter((s) => !!s)
          .join(","),
        is_sign: this.write,
      };
      if (this.unboss) {
        os.staff_id = "";
      }
      this.$api.http("noticeSend", os, () => {
        this.$js.message("发送成功");
        // eslint-disable-next-line
        demo.siteConfig.tempdata("notify", null, "clear");
        this.$router.back();
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.image {
  width: 100px;
  height: 100px;
}
.btns {
  padding: 30px 10%;
}
</style>
