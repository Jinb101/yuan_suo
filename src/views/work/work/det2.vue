<template>
  <div class="det">
    <section class="new_box"
             v-for="(x, y) in item"
             :key="y + '-sw'">
      <h3>发布人：{{ x.name }}</h3>
      <h6>{{ x.group_name }}-{{ x.job_name }}</h6>
      <span class="time">{{ times(x) }}</span>
      <ul class="text">
        <li>重点工作安排：</li>
        <li v-for="(q, w) in toTarget(x.target)"
            :key="w + 's' + y">
          {{ w + 1 }}、{{ q }}
        </li>
        <li v-if="x.target === ''">暂无</li>
      </ul>
      <p class="desc">附件:</p>
      <div class="flex fw">
        <div class="imgs"
             v-for="(q, w) in toImages(x.url)"
             :key="w + 'sim'"
             @click.stop="onWatchData(q)">
          <van-image :src="q.src"></van-image>
        </div>
      </div>
      <p class="descs"
         v-if="x.url && x.url.length">附件点击即可预览</p>
      <div class="tool flex">
        <template v-if="+uid === +x.staff_id">
          <span class="col_warning"
                @click.stop="onEdit(x)">编辑</span>
          <span class="col_danger"
                @click.stop="onDel(x)">删除</span>
        </template>
        <span class="col_green"
              @click.stop="onDown(x.url)"
              v-if="x.url && x.url.length">下载附件</span>
        <!-- <span class="col_primary" @click.stop="ondown(x)">下载</span> -->
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    value: null,
    uid: [String, Number],
  },
  data() {
    return {};
  },
  computed: {
    item: {
      get: function get() {
        return this.value;
      },
      set: function set(n) {
        this.$emit("input", n);
      },
    },
  },
  watch: {
    item: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
  },
  inject: ["appTimeout", "appShowImage"],
  methods: {
    onDown(x) {
      // eslint-disable-next-line
      demo.siteConfig.downfiledata(x, this.$js.env);
    },
    toTarget(s) {
      let a = [];
      try {
        a = JSON.parse(s);
      } catch (e) { }
      return a;
    },
    onEdit(e) {
      console.log(e);
      this.$emit("edit", {
        target: e.target,
        type: "edit",
        src: e.url,
        srcs: e.urls,
        id: e.id,
      });
    },
    onDel(e) {
      this.$js.modeldel(() => {
        this.$api.http("monthplandel", { weekly_plan_id: e.id }, () => {
          this.$toast("删除成功");
          this.item = this.item.filter((r) => {
            return r.id !== e.id;
          });
        });
      });
    },
    onWatchData(v) {
      if (v.type === "") return this.appShowImage(v.url);
      // eslint-disable-next-line
      let url = demo.siteConfig.api.see + "?t=" + v.url;
      this.$emit("show", url);
    },
    times(v) {
      let x = v.update_time > 0 ? v.update_time : v.create_time;
      return "发布时间：" + this.appTimeout(x, true);
    },
    toImages(v) {
      if (!v.length) return [];
      return v.map((s) => {
        let e = s.split(".");
        let type = "";
        let base = "";
        // eslint-disable-next-line
        let config = demo.siteConfig.uploadType;
        switch (e[e.length - 1]) {
          case "doc":
          case "docx":
            type = "word";
            base = config.word.src;
            break;
          case "xls":
          case "xlsx":
            type = "excel";
            base = config.excel.src;
            break;
          case "pdf":
            type = "pdf";
            base = config.pdf.src;
            break;
          default:
            base = config.all.src;
        }
        return {
          // eslint-disable-next-line
          src: type === "" ? s : base,
          type,
          url: s,
        };
      });
    },
  },
  mounted() {
    this.item = this.value;
  },
};
</script>
<style lang='less' scoped>
.new_box {
  margin: 0 8px 10px;
  background-color: #fff;
  box-shadow: 0 5px 5px rgb(226, 226, 226);
  border-radius: 10px;
  overflow: hidden;
  box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
  position: relative;

  h3 {
    font-weight: 650;
    padding: 5px 0;
    font-size: 14px;
  }

  h6 {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 12px;
    color: rgb(173, 173, 173);
    line-height: 24px;
  }

  .time {
    font-size: 12px;
    padding-bottom: 5px;
    color: #999;
    display: inline-block;
  }

  .lst {
    padding: 5px;

    p {
      font-size: 13px;
      line-height: 18px;
    }
  }

  .imgs {
    width: 75px;
    height: 75px;
    margin: 0 8px 8px 0;
    border-radius: 5px;
    overflow: hidden;

    &:nth-child(4n) {
      margin-right: 0;
    }
  }

  .tool {
    padding: 8px 10px 0;
    border-top: 1px solid rgb(230, 230, 230);
    flex-direction: row-reverse;

    span {
      padding: 5px 10px;
      margin-left: 15px;
      color: #999;
      border: 1px solid rgb(245, 245, 245);
      border-radius: 5px;
    }
  }

  .descs {
    padding: 8px 0;
    line-height: 12px;
    font-size: 12px;
    color: rgb(238, 52, 19);
    opacity: 0.5;
    transform: translateY(-4px) scale(0.8) translateX(-10%);
  }
}

ul.text {
  padding: 8px 0;

  li {
    font-size: 14px;
    line-height: 1.5;

    &:first-child {
      font-weight: 650;
      color: #ccc;
    }
  }
}

.desc {
  font-weight: 650;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 8px;
  color: #ccc;
}
</style>
