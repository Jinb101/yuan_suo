<template>
  <div class="list_det">
    <van-divider content-position="left">班级信息</van-divider>
    <van-cell title="班级名字" :value="detail.nickname"></van-cell>
    <van-cell title="班级类型" :value="detail.type"></van-cell>
    <van-cell
      title="班级人数与容量"
      :value="detail.class_number + '人/' + detail.capacity + '人'"
    ></van-cell>
    <van-cell
      title="班主任"
      :value="detail.name || '暂未设置班主任'"
    ></van-cell>
    <van-cell
      title="班主任联系方式"
      :value="detail.contact"
      is-link
      v-if="detail.contact"
      @click="ontel(detail.contact)"
    ></van-cell>
    <van-divider content-position="left">老师信息</van-divider>
    <van-empty
      v-if="!detail.staff.length"
      description="班级暂无老师"
    ></van-empty>
    <template v-else>
      <van-cell
        v-for="(i, j) in detail.staff"
        :key="j"
        :title="i.name"
        :value="i.contact"
        @click="ontel(i.contact)"
        is-link
      ></van-cell>
    </template>
    <van-divider content-position="left">班级邀请码</van-divider>
    <van-empty
      v-if="!detail.class_qr_code"
      description="暂未设置邀请码"
    ></van-empty>
    <div class="image" v-else>
      <van-image :src="detail.class_qr_code"></van-image>
    </div>
    <template v-if="detail.class_number > 0">
      <van-divider content-position="left">班级学生批量操作</van-divider>
      <div class="app_section">
        <van-checkbox-group v-model="result">
          <section
            v-for="(i, j) in item"
            :key="j + '-c'"
            class="flex"
            @click="ontoggle(j)"
          >
            <div class="logo">
              <v-a :src="i.base_map" :sex="i.gender"></v-a>
            </div>
            <div class="text">
              <span class="status">
                <van-checkbox :name="i.id" ref="check"></van-checkbox>
              </span>
              <h6>{{ i.name }}</h6>
              <p>学号：{{ i.no }}</p>
            </div>
          </section>
        </van-checkbox-group>
      </div>
      <div class="w80 flex" v-if="result.length > 0">
        <van-button block round type="primary" @click="onbiye"
          >批量毕业({{ result.length }})</van-button
        >
        <van-button block round type="info" @click="open = !open"
          >批量转班({{ result.length }})</van-button
        >
      </div>
    </template>
    <v-s
      v-model="s1"
      :open="open"
      :list="classes"
      noselect
      @change="onchange"
    ></v-s>
  </div>
</template>

<script>
import vA from "../../../private/avatar.vue";
import vS from "../../../private/select.vue";
export default {
  props: {
    value: null,
  },
  data() {
    return {
      item: [],
      result: [],
      classes: [],
      open: false,
      s1: [],
    };
  },
  components: { vA, vS },
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
  watch: {
    detail: {
      handler(v) {
        this.$emit("input", v);
      },
      deep: true,
    },
    open(n) {
      if (n) {
        this.ongetclass();
      }
    },
  },
  methods: {
    onchange(e, j) {
      let val = e[1] || {};
      let text = "是否转入至" + j.e.join("-");
      let msg = [
        "当前班主任为:",
        val.name,
        "!\n",
        "班级人数为",
        val.num,
        "人。\n",
        "班级容量为",
        val.max,
        "人。\n",
        "是否确认转入？",
      ].join("");
      this.$js.model(text, msg, (r) => {
        if (r) {
          let os = {
            class_id: val.id,
            group_id: val.gid,
            c_id: this.result.join(","),
          };
          this.$api.http("classesbatch", os, () => {
            this.$toast("转入成功");
            let a = this.result;
            this.item = this.item.filter((r) => {
              return a.indexOf(r.id) < 0;
            });
            this.$emit("end", this.detail.class_number - a.length);
            this.result = [];
          });
        }
      });
    },
    onbiye() {
      this.$js.model("毕业提示", "是否对选中的宝宝执行毕业操作？", (r) => {
        if (r) {
          this.$api.http(
            "classesgraduation",
            { child_id: this.result.join(",") },
            () => {
              this.$toast("提交毕业成功");
              let a = this.result;
              this.item = this.item.filter((r) => {
                return a.indexOf(r.id) < 0;
              });
              this.$emit(
                "end",
                this.detail.class_number - a.length,
                this.detail.$index
              );
              this.result = [];
            }
          );
        }
      });
    },
    ontoggle(j) {
      this.$refs.check[j].toggle();
    },
    ontel(e) {
      // eslint-disable-next-line
      demo.siteConfig.tel(e);
    },
    init() {
      if (this.detail.class_number > 0) {
        this.$api.http(
          "classesstudent",
          {
            page: 1,
            limit: this.detail.class_number + 1,
            class_id: this.detail.id,
          },
          (r) => {
            this.item = r;
          }
        );
      }
    },
    ongetclass() {
      if (this.classes.length) return 0;
      this.$api.http("classeslist", { page: 1, limit: 100 }, (r) => {
        let arr = r.map((s) => {
          return {
            type: s.type,
            text: s.nickname,
            name: s.name || "暂无",
            tel: s.contact,
            num: s.class_number,
            max: s.capacity,
            id: s.id,
            gid: s.class_type,
          };
        });
        // eslint-disable-next-line
        let a2 = demo.array(arr).agg("type");
        let a3 = [];
        Object.keys(a2).forEach((k, v) => {
          a3.push({ text: k, id: v + 1, children: a2[k] });
        });
        this.classes = a3;
      });
    },
  },
  mounted() {
    this.detail = this.value;
    this.init();
  },
};
</script>
<style lang='less' scoped>
.list_det {
  padding-bottom: 80px;
  font-size: 14px;
  .image {
    width: 200px;
    height: 200px;
    margin: 10px;
  }
}
</style>
