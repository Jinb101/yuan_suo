<template>
  <div class="det">
    <h2>{{ detail.title }}</h2>
    <div class="app_section">
      <section class="flex">
        <div class="logo"><v-a :src="detail.avatar" teacher></v-a></div>
        <div class="text">
          <span class="status" v-if="!my">阅读量：{{ detail.views }}</span>
          <h6>{{ detail.staff_name }}</h6>
          <p>发表时间：{{ detail.create_time }}</p>
          <template v-if="my">
            <p>阅读量：{{ detail.views }}</p>
            <p>点赞数：{{ detail.likes }}</p>
          </template>
        </div>
      </section>
    </div>
    <div class="cover" @click="appShowImage(detail.cover)">
      <van-image :src="detail.cover" fit="cover"></van-image>
    </div>
    <template v-if="detail.content">
      <van-divider content-position="left">环创详情</van-divider>
      <div class="app_frame_content" v-html="detail.content"></div>
    </template>
    <div class="foot" v-if="!my">
      <div
        class="btn"
        :class="{ a: +detail.likes_count === 0 }"
        @click="onlike"
      >
        <div class="loo">
          <van-image :src="like"></van-image>
        </div>
        <p>
          <template v-if="+detail.likes_count === 0"> 为Ta点赞 </template>
          <template v-else> 取消点赞 </template>
          ({{ detail.likes }})
        </p>
      </div>
    </div>
    <div class="foot flex" v-else>
      <van-button block round type="danger" size="small" @click="ondel"
        >删除</van-button
      >
      <van-button block round type="warning" size="small" @click="onedit"
        >编辑</van-button
      >
    </div>
  </div>
</template>

<script>
import vA from "../../private/avatar.vue";
export default {
  props: {
    value: null,
    my: Boolean,
  },
  data() {
    return {
      // eslint-disable-next-line
      like: demo.siteConfig.icon("good", "private"),
    };
  },
  components: { vA },
  computed: {
    detail: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
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
    onlike() {
      let nolike = +this.detail.likes_count === 0;
      let num = this.detail.likes;
      this.$api.http("environmentlike", { id: this.detail.id }, () => {
        this.$set(this.detail, "likes_count", nolike ? 1 : 0);
        this.$set(this.detail, "likes", nolike ? num + 1 : num - 1);
      });
    },
    ondel() {
      this.$emit("del", this.detail);
    },
    onedit() {
      this.$emit("edit", this.detail);
    },
  },
  mounted() {
    this.detail = this.value;
  },
};
</script>
<style lang='less' scoped>
.det {
  font-size: 15px;
  padding-bottom: 55px;
  h2 {
    font-weight: 650;
    line-height: 1.5;
    font-size: 18px;
    padding: 10px 10%;
    text-align: center;
  }
  .cover {
    height: 210px;
    padding: 8px;
    box-sizing: border-box;
  }
  .foot {
    position: sticky;
    bottom: 20px;
    z-index: 5;
    margin-top: 50px;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    > .van-button {
      max-width: 100px;
      + .van-button {
        margin-left: 10px;
      }
    }
  }
  .loo {
    width: 80px;
    height: 80px;
  }
  .btn {
    font-size: 15px;
    text-align: center;
    &.a {
      filter: grayscale(100%);
    }
  }
}
</style>
