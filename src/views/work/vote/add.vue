<template>
  <div class="vote_add">
    <template v-if="edit2">
      <van-field
        v-model="os.activity_name"
        label="活动名称"
        label-width="5em"
        readonly
        input-align="right"
      />
      <van-cell
        title="活动开始时间"
        is-link
        :value="os.start_time || '请选择'"
        @click="open1 = !open1"
      ></van-cell>
      <van-cell
        title="活动结束时间"
        is-link
        :value="os.end_time || '请选择'"
        @click="open2 = !open2"
      ></van-cell>
      <div class="btn">
        <van-button block round :color="$js.btnColor" @click="onsaveedit"
          >点击编辑活动</van-button
        >
      </div>
    </template>
    <template v-else>
      <van-field
        v-model="os.activity_name"
        label="活动名称"
        placeholder="请输入活动名称"
        label-width="5em"
        required
      />
      <van-field
        v-model="ftitle"
        label="副标题"
        placeholder="可选"
        label-width="5em"
      />
      <van-field label="活动类型" label-width="5em" readonly>
        <template #button>
          <van-radio-group v-model="os.activity_type" direction="horizontal">
            <van-radio name="1">全园</van-radio>
            <van-radio name="2">班级</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <v-c
        v-model="cls"
        @change="onchangeclass"
        v-if="+os.activity_type === 2"
        label
        :change="!edit"
        :unhis="edit"
      ></v-c>
      <van-cell title="活动封面"></van-cell>
      <v-upload-once
        class="image"
        v-model="img"
        @path="onpath"
        close
      ></v-upload-once>
      <van-cell title="活动内容"></van-cell>
      <van-field
        v-model="os.content"
        rows="2"
        autosize
        type="textarea"
        maxlength="500"
        placeholder="请输入活动内容"
        show-word-limit
        class="text_box"
      />
      <van-cell title="背景音乐" :value="saudio"></van-cell>
      <v-upload-once
        type="audio"
        class="image"
        v-model="audio"
        @path="onaudio"
        close
      ></v-upload-once>
      <van-cell
        title="活动开始时间"
        is-link
        :value="os.start_time || '请选择'"
        @click="open1 = !open1"
      ></van-cell>
      <van-cell
        title="活动结束时间"
        is-link
        :value="os.end_time || '请选择'"
        @click="open2 = !open2"
      ></van-cell>
      <van-field
        v-model="os.number_votes"
        type="digit"
        label="单人每日投票最大数量"
        placeholder="请输入数量，默认1次"
        label-width="11em"
      >
        <template #button> 次 </template>
      </van-field>
      <van-field
        v-model="os.score_per_vote"
        type="digit"
        label="投票得分"
        placeholder="请输入分数，默认3分"
        label-width="11em"
      >
        <template #button> 分 </template>
      </van-field>
      <van-field
        v-model="os.comment_score"
        type="digit"
        label="首次评论得分"
        placeholder="请输入评论得分，默认4分"
        label-width="11em"
      >
        <template #button> 分 </template>
      </van-field>
      <van-field
        v-model="os.completion_score"
        type="digit"
        label="完播率80%以上得分"
        placeholder="请输入完播率得分，默认4分"
        label-width="11em"
      >
        <template #button> 分 </template>
      </van-field>
      <div class="btn">
        <van-button block round :color="$js.btnColor" @click="onsave"
          >点击创建活动</van-button
        >
      </div>
    </template>
    <v-t v-model="os.start_time" :open="open1" ymd max="y_2" min="d_1"></v-t>
    <v-t v-model="os.end_time" :open="open2" ymd max="y_4" min="d_1"></v-t>
  </div>
</template>

<script>
import vT from "../../private/time.vue";
import vC from "../../private/class.vue";
export default {
  props: {
    edit: Boolean,
    edit2: Boolean,
    value: null,
  },
  components: { vT, vC },
  data() {
    return {
      os: {
        activity_name: "",
        class_id: "",
        activity_type: "1",
        cover_image: "",
        content: "",
        music: "",
        start_time: "",
        end_time: "",
        number_votes: "1",
        score_per_vote: "3",
        comment_score: "4",
        completion_score: "4",
      },
      open1: false,
      open2: false,
      img: {},
      audio: {},
      audio_item: [],
      cls: {},
      ftitle: "",
    };
  },
  computed: {
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    saudio() {
      if (this.audio_item.length) {
        return "选择库存音乐";
      }
      return "";
    },
  },
  watch: {
    ext: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
  },
  methods: {
    onchangeclass(e) {
      this.os.class_id = e.id;
    },
    onpath(e) {
      this.os.cover_image = e.src;
    },
    onaudio(e) {
      this.os.music = e.src;
    },
    onsaveedit() {
      this.onsave();
    },
    onsave() {
      if (this.edit) {
        this.os.vote_id = this.ext.vote_id;
      }
      if (+this.os.activity_type === 1) {
        this.os.class_id = "";
      }
      let os = JSON.parse(JSON.stringify(this.os));
      if (this.ftitle) {
        os.activity_name += "/#br#/" + this.ftitle;
      }
      this.$api.http("voteplus", os, (r) => {
        this.$toast((this.edit ? "编辑" : "创建") + "成功");
        this.$emit("end", this.edit, r);
      });
    },
    init() {
      let i = this.ext || {};
      console.log(this.edit, i);
      if (this.edit) {
        let t = (i.activity_name + "").split("/#br#/");
        this.ftitle = t[1] || "";
        this.os = {
          activity_name: t[0] || "",
          class_id: i.class_id,
          activity_type: i.activity_type,
          cover_image: i.cover_images,
          content: i.content,
          music: i.musics,
          // eslint-disable-next-line
          start_time: demo.timeout(i.start_time, "ymd", "-"),
          // eslint-disable-next-line
          end_time: demo.timeout(i.end_time, "ymd", "-"),
          number_votes: this.edit ? i.number_votes : 1,
          score_per_vote: this.edit ? i.score_per_vote : "3",
          comment_score: this.edit ? i.comment_score : "4",
          completion_score: this.edit ? i.completion_score : "4",
        };
        this.img = {
          src: i.cover_images,
          image: i.cover_image,
          cover: "img",
        };
        if (i.musics) {
          this.audio = {
            src: i.musics,
            // eslint-disable-next-line
            image: demo.siteConfig.uploadShow("mp3"),
            cover: "audio",
          };
        }
        if (i.class_id > 0) {
          this.cls = {
            id: i.classes.id,
            name: i.classes.nickname,
          };
        }
      } else {
        // activity_type
        let p = (this.$route.path + "").replace("/vote", "");
        if (+p > 0) {
          this.os.activity_type = p;
        }
      }
    },
  },
  mounted() {
    this.ext = this.value;
    this.init();
  },
};
</script>
<style lang='less' scoped>
.btn {
  margin: 30px auto;
  width: 65%;
}
.image {
  height: 100px;
  width: 178px;
  margin: 10px;
}
.text_box {
  width: calc(100% - 20px);
  margin: 10px;
  border: 1px solid #999;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 5px 10px;
}
</style>
