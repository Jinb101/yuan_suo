<template>
  <v-view header>
    <van-field
      label="姓名"
      placeholder="请输入姓名"
      label-width="4em"
      required
      v-model="os.title"
    >
      <template #button>
        <span>{{ os.suffix }}</span>
      </template>
    </van-field>
    <van-field
      label="称号"
      placeholder="请输入称号,默认(老师)"
      label-width="4em"
      v-model="os.suffix"
    ></van-field>
    <div class="pic">
      <h6>风采照片<b>最多9张</b></h6>
      <v-uploads v-model="img">
        <div class="image">
          <v-upload
            more
            moreLength="9"
            @on-path="onPath"
            @on-loading="onPath"
          ></v-upload>
        </div>
      </v-uploads>
    </div>
    <van-field
      rows="2"
      autosize
      label="教育宣言"
      type="textarea"
      maxlength="125"
      placeholder="请输入我的教育宣言"
      show-word-limit
      v-model="os.declaration"
    />
    <van-field
      rows="2"
      autosize
      label="简介"
      type="textarea"
      maxlength="125"
      placeholder="请输入简介"
      show-word-limit
      v-model="os.content"
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
  data() {
    return {
      img: [],
      os: {
        title: "",
        suffix: "",
        declaration: "",
        content: "",
      },
    };
  },
  methods: {
    onPath(e, i) {
      this.img = i;
    },
    save() {
      if (this.os.title === "") return this.$toast("请输入姓名");
      let os = {
        content: "",
        ...this.os,
        image: this.img
          .map((s) => {
            return s.src;
          })
          .join(","),
      };
      if (os.suffix === "") {
        os.suffix = "(老师)";
        os.title += os.suffix;
      }
      this.$api.http("usermybriefset", os, () => {
        this.$toast("保存成功");
      });
    },
  },
  mounted() {
    this.$api.http("usermybrief", {}, (r) => {
      let title = r.title;
      if (r.suffix) {
        title = (r.title + "").replace(r.suffix, "");
      }
      this.os = {
        title,
        suffix: r.suffix || "",
        declaration: r.declaration || "",
        content: r.content || "",
      };
      this.img = (r.image || []).map((s) => {
        return {
          src: s.replace(r.url, ""),
          srcs: s,
          old: true,
          cover: "img",
        };
      });
    });
  },
};
</script>
<style lang='less' scoped>
.pic {
  padding: 10px;
  font-size: 15px;
  h6 {
    padding: 5px 0;
    margin-bottom: 8px;
    b {
      font-size: 12px;
      color: #ccc;
      padding-left: 5px;
    }
  }
}
.image {
  width: 100px;
  height: 100px;
  margin: 0 10px 10px 0;
}
.btn {
  margin: 30px 20%;
}
</style>
