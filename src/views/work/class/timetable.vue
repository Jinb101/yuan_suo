<template>
  <v-view header @on-user="onuser">
    <template #menu>
      <v-c v-model="cls"></v-c>
    </template>
    <van-empty
      v-if="!item.length && !isempty"
      description="暂未上传"
    ></van-empty>
    <div class="flex fw">
      <section v-for="(i, j) in item" :key="j">
        <div class="img" @click.stop="appShowImage(item, j, 'img_url')">
          <van-image :src="i.img_url" fit="cover"></van-image>
        </div>
        <p>发布时间：{{ appTimeout(i.created_time) }}</p>
        <span class="close" @click.stop="ondel(i)"
          ><van-icon name="cross"></van-icon
        ></span>
      </section>
      <section v-if="isempty">
        <v-upload-once v-model="img" class="img"></v-upload-once>
        <p class="center">点击添加</p>
      </section>
    </div>
  </v-view>
</template>

<script>
import vC from "../../private/select_class.vue";
export default {
  data() {
    return {
      cls: {},
      item: [],
      img: {},
      user: {},
      classes: [],
    };
  },
  inject: ["appTimeout", "appShowImage"],
  components: { vC },
  watch: {
    "img.src"() {
      this.onadd();
    },
    "cls.id"() {
      this.init();
    },
  },
  computed: {
    isadd() {
      // 是不是班级老师 or 班主任
      return +this.user.is_teachers === 1 || +this.user.is_teacher === 1;
    },
    isadd2() {
      if (this.classes.length && this.cls.id) {
        return this.classes.indexOf(this.cls.id) >= 0;
      }
      return false;
    },
    isempty() {
      // return this.isadd && this.isadd2;
      return true;
    },
  },
  methods: {
    onuser(e) {
      this.user = e;
      if (this.isadd) {
        this.$api.http("getclassteach", {}, (r) => {
          this.classes = r.map((s) => {
            return s.id;
          });
        });
      }
    },
    init() {
      this.$api.http("timetable", { class_id: this.cls.id || "" }, (r) => {
        this.item = r;
      });
    },
    ondel(i) {
      this.$js.modeldel(() => {
        this.$api.http("timetabledel", { plan_id: i.id }, () => {
          this.$toast("删除成功");
          this.item = this.item.filter((r) => {
            return r.id !== i.id;
          });
        });
      });
    },
    onadd() {
      if (!this.img.src) return 0;
      this.$api.http("timetableadd", { imgs: this.img.src }, () => {
        this.$toast("添加成功");
        this.img = { $reset: true };
        this.init();
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
};
</script>
<style lang='less' scoped>
section {
  width: 50%;
  box-sizing: border-box;
  padding: 10px;
  position: relative;
  .img {
    height: 95px;
    border-radius: 5px;
    overflow: hidden;
  }
  > p {
    font-size: 12px;
    padding: 5px 0;
    color: #ccc;
    &.center {
      text-align: center;
    }
  }
  .close {
    position: absolute;
    right: 10px;
    top: 10px;
    padding: 5px;
    color: #fff;
    background-color: tomato;
    font-size: 14px;
    border-radius: 0 5px 0 15px;
    cursor: pointer;
  }
}
</style>
