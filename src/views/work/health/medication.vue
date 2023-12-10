<template>
  <v-view header @on-view="onview">
    <template #menu>
      <v-s v-model="cls" all></v-s>
    </template>
    <div class="tab flex app_top">
      <span @click="open1 = !open1"
        >{{ time ? time : "时间选择" }} <van-icon name="arrow" size="15"
      /></span>
      <span @click="open2 = !open2"
        >{{ text1 }} <van-icon name="arrow" size="15"
      /></span>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section
        v-for="(i, j) in item"
        :key="j"
        class="van-hairline--bottom"
        @click="ondetail(i, j)"
      >
        <p>{{ i.class_nickname }}</p>
        <p class="name">{{ i.child_name }}</p>
        <p class="time">{{ appTimeout(i.update_time) }}</p>
        <span class="status" :class="i.status ? 'col_danger' : 'col_green'">
          {{ i.status ? "未" : "已" }}喂药
        </span>
      </section>
    </v-page>
    <template #fixed>
      <v-t :open="open1" v-model="time" ymd @change="onPage(1)"></v-t>
      <v-c
        :open="open2"
        v-model="a1"
        text="text"
        :list="list"
        noselect
        @change="onchanges"
      ></v-c>
      <v-f v-model="open3" :footer="false" text="喂药详情">
        <v-d v-model="ext" @change="onchangechild"></v-d>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vS from "../../private/select_class.vue";
import vT from "../../private/time.vue";
import vC from "../../private/select.vue";
import vF from "../../private/fixed.vue";
import vD from "./_medication_detail.vue";
export default {
  data() {
    return {
      item: [],
      cls: {},
      open1: false,
      open2: false,
      open3: false,
      time: "",
      a1: [],
      list: [],
      mid: "",
      aid: "",
      ext: {},
      id: "",
      send: false,
      isajax: false,
    };
  },
  watch: {
    "cls.id"() {
      this.onPage(1);
    },
    open3(n) {
      if (!n) {
        this.appPath("/work_medication", true);
      }
    },
  },
  inject: ["appTimeout", "appPath"],
  computed: {
    text1() {
      let v = this.a1;
      if (v.length === 2) {
        if (v[0] === v[1]) {
          return "全部";
        }
        return v
          .filter((r) => {
            return r !== "全部";
          })
          .join("-");
      }
      return "喂药状态选择";
    },
  },
  components: { vS, vT, vC, vF, vD },
  methods: {
    onview(e) {
      // let a = (e.level || []).filter((r) => {
      //   return +r.id === 272;
      // });
      // if (!a.length && e.level.length > 0) {
      //   this.$toast("无法访问,没有权限");
      //   this.$route.back();
      //   return 0;
      // }
      this.id = this.$route.params.id;
      // eslint-disable-next-line
      this.time = demo.timeout("", "ymd", "-");
      if (this.id) {
        this.ondetail({ id: this.id }, -1);
      }
      this.$nextTick(() => {
        this.send = true;
        setTimeout(() => {
          if (!this.isajax) {
            this.onPage(1);
          }
        }, 2000);
      });
    },
    ondetail(e, j) {
      this.appPath("/work_medication/" + e.id, true);
      this.id = e.id;
      this.$api.http("medicationdet", { id: this.id }, (r) => {
        this.ext = { ...r, $index: j };
        this.open3 = true;
      });
    },
    onchanges(e, v) {
      this.mid = v.v[0];
      this.aid = v.v[1];
      this.onPage(1);
    },
    onchangechild(index) {
      if (index >= 0) {
        this.$set(this.item[index], "status", false);
      }
      this.open3 = false;
    },
    onPage(page, f) {
      if (!this.send) return 0;
      this.isajax = true;
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      let os = {
        afternoon_status: this.aid,
        class_id: this.cls.id,
        date: this.time,
        morning_status: this.mid,
      };
      this.$api.http("medication", { page, ...os }, (e) => {
        if (+page === 1) {
          this.item = e;
        } else {
          this.item = this.item.concat(e);
        }
        this.$refs.page.onFinish(e.length < 20);
      });
    },
  },
  mounted() {
    this.list = ["全部", "上午未喂药", "上午已喂药"].map((e, w) => {
      let q = {
        id: w + 1,
        text: e,
        children: ["全部", "下午未喂药", "下午已喂药"].map((s, v) => {
          return {
            id: w + 1 + "0" + v,
            text: s,
          };
        }),
      };
      return q;
    });
  },
};
</script>
<style lang='less' scoped>
.tab {
  align-items: center;
  justify-content: center;
  background-color: #fff;
  span {
    flex: 1;
    padding: 10px 0;
    text-align: center;
    font-size: 15px;
  }
}

section {
  padding: 15px;
  position: relative;
  font-size: 15px;
  p {
    margin-bottom: 5px;
    line-height: 1.2;
  }
  .name {
    font-weight: 650;
    padding: 4px 0;
  }
  .time {
    font-size: 13px;
    color: #999;
    position: absolute;
    right: 15px;
    top: 38px;
  }
  .status {
    position: absolute;
    right: 15px;
    top: 15px;
  }
}
</style>
