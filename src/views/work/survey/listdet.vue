<template>
  <div class="work_survey_info">
    <div class="head">
      <h6>{{ head.name }}</h6>
      <p class="time">{{ appTimeout(head.create_time, true) }}</p>
      <transition name="fade">
        <p class="desc">{{ head.description }}</p>
      </transition>
    </div>
    <h5>
      调研题目：<b>共{{ head.count }}题</b>
    </h5>
    <section v-for="(i, j) in list" :key="j + '-s'">
      <h3>
        <span>{{ i.status ? "问答题" : "选择题" }}</span>
        {{ i.name }}
      </h3>
      <div class="cont" v-if="i.status">
        <span class="col_info" @click="onShowCount(i)"
          >{{ i.count }}人回答</span
        >
      </div>
      <ul class="cont" v-else>
        <li v-for="(x, y) in i.item" :key="y + '-lis'" class="flex">
          <span>{{ x.t }}</span>
          <b>{{ x.v }}</b>
          <span class="col_info" @click="onShowCount(i, x)"
            >{{ x.n }}人回答</span
          >
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    fid: [String, Number],
    rid: [String, Number],
  },
  data() {
    return {
      detail: {},
      head: {},
      list: [],
    };
  },
  inject: ["appTimeout"],
  methods: {
    onShowCount(e, v) {
      if (e.status) {
        if (e.count < 0) return this.$toast("还没有人回答哦！");
      } else {
        if (v.n < 1) return this.$toast("还没有人回答哦！");
      }
      this.$api.http(
        "feedbackanswer",
        {
          f_id: e.fid,
          t_id: e.id,
          answer: e.status ? "" : v.t.toLowerCase(),
          type: e.status ? 2 : 1,
        },
        (res) => {
          this.$emit("child", res);
        }
      );
    },
    init() {
      this.$api.http(
        "feedbacklist",
        { f_id: this.fid, r_id: this.rid },
        (e) => {
          this.detail = e;
          this.head = e.feedback_info || {};
          this.list = (e.feedback_topic_list || []).map((r) => {
            let os = {
              name: r.name,
              status: r.type === 2,
              id: r.id,
              fid: r.f_id,
              rid: r.r_id,
              item: [],
              count: 0,
            };
            if (os.status) {
              os.count = r.answerCount;
            } else {
              if (r.a) {
                os.item.push({ t: "A", v: r.a, n: r.aA });
              }
              if (r.b) {
                os.item.push({ t: "B", v: r.b, n: r.bB });
              }
              if (r.c) {
                os.item.push({ t: "C", v: r.c, n: r.cC });
              }
              if (r.d) {
                os.item.push({ t: "D", v: r.d, n: r.dD });
              }
            }
            return os;
          });
        }
      );
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.work_survey_info {
  overflow-y: scroll;
  font-size: 15px;
  padding-bottom: 50px;
  .head {
    padding: 10px;
  }
  h6 {
    font-weight: 650;
    text-align: center;
    line-height: 1.2;
    margin-bottom: 5px;
  }
  .time {
    font-size: 13px;
    color: #999;
    margin-bottom: 5px;
    text-align: right;
  }
  .desc {
    color: #666;
    line-height: 1.3;
    font-size: 13px;
  }
  h5 {
    padding: 10px;
    position: relative;
    font-weight: 650;
    background-color: rgb(230, 230, 230);
    color: #666;
  }
  section {
    padding: 10px;
    li {
      height: 30px;
      line-height: 30px;
      margin-bottom: 5px;
      b {
        padding: 0 5px;
      }
      span:first-child {
        border-radius: 50%;
        color: #fff;
        background: #99cc33;
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        font-weight: 600;
        transform: scale(0.7);
      }
    }
    h3 {
      font-weight: 650;
      line-height: 20px;
      margin-bottom: 5px;
      span {
        font-weight: 400;
        background: orange;
        color: #fff;
        font-size: 13px;
        padding: 2px 5px;
        border-radius: 3px;
        transform: scale(0.8);
        display: inline-block;
      }
    }
  }
  .vc {
    section {
      .ava {
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }
      .text {
        width: calc(100% - 50px);
        padding-top: 4px;
        p {
          color: #999;
          margin-bottom: 5px;
        }
        .name {
          color: #666;
          font-weight: 650;
        }
      }
    }
  }
}
</style>
