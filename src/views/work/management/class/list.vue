<template>
  <v-view header bgc="#f5f5f5">
    <template #menu>
      <span @click="onevent('add')">创建班级</span>
    </template>
    <div class="app_top bgc">
      <v-t :num="0"></v-t>
      <div class="flex">
        <v-s v-model="val" @search="onPage(1)" style="flex: 1"></v-s>
        <span class="event" @click.stop="open = !open">
          <van-icon name="filter-o" />
        </span>
      </div>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section v-for="(i, j) in item" :key="j" @click.stop="ondetail(i, j)">
        <v-c-c :title="i.nickname" @tap="onevent('qr', i, j)"></v-c-c>
        <h6>{{ i.nickname }}</h6>
        <p>班主任：{{ i.name || "暂未设置" }}</p>
        <p>班级人数：{{ i.class_number }}</p>
        <p>班级类型：{{ i.type }}</p>
        <div class="tool flex" @click.stop>
          <van-button
            size="small"
            round
            plain
            type="info"
            v-if="i.class_number > 0"
            icon="flower-o"
            @click.stop="onevent('list', i, j)"
            >名单</van-button
          >
          <van-button
            size="small"
            round
            plain
            type="primary"
            icon="qr"
            @click.stop="onevent('qr', i, j)"
            >邀请码</van-button
          >
          <van-button
            size="small"
            round
            plain
            type="warning"
            icon="edit"
            @click.stop="onevent('edit', i, j)"
            >编辑</van-button
          >
        </div>
      </section>
    </v-page>
    <template #fixed>
      <v-f
        v-model="open1"
        :footer="false"
        :text="detail.$type === 'add' ? '添加班级' : '编辑班级'"
      >
        <v-a1 v-model="detail" @end="onend"></v-a1>
      </v-f>
      <v-f v-model="open2" :footer="false" text="班级邀请码" cover>
        <v-a2 v-model="detail" :list="item"></v-a2>
      </v-f>
      <v-f v-model="open3" :footer="false" text="班级详情">
        <v-a3 v-model="detail" @end="onendnum"></v-a3>
      </v-f>
      <v-f
        v-model="open4"
        :footer="false"
        :text="'班级名单(' + detail.class_number + '人)'"
      >
        <v-a4 v-model="detail" @end="onchilddet" ref="o4"></v-a4>
      </v-f>
      <v-f v-model="open5" text="学生操作" :footer="false">
        <v-a5 @close="ondelitem(-1)" @del="ondelitem"></v-a5>
      </v-f>
    </template>
    <v-c v-model="s1" :list="t1" :open="open" @change="onchangeclass"></v-c>
  </v-view>
</template>

<script>
import vF from "../../../private/fixed.vue";
import vS from "../../../private/search.vue";
import vC from "../../../private/select.vue";
import vCC from "../../../private/class_card.vue";
import vA1 from "./_list_add.vue";
import vA2 from "./_list_qr.vue";
import vA3 from "./_list_det.vue";
import vA4 from "./_list_class.vue";
import vA5 from "./_list_child.vue";
import vT from "./_tabmenu.vue";
export default {
  data() {
    return {
      val: "",
      item: [],
      type: "",
      open: false, // 控制筛选
      open1: false, // 控制创建编辑
      open2: false, // 控制显示邀请码
      open3: false, // 控制查看详情
      open4: false, // 控制名单
      open5: false, // 控制名单学生详情
      detail: {},
      t1: [],
      s1: {},
    };
  },
  inject: ["appPath"],
  components: { vF, vS, vC, vCC, vA1, vA2, vA3, vA4, vA5, vT },
  watch: {
    open1(n) {
      this.back(n);
    },
    open2(n) {
      this.back(n);
    },
    open3(n) {
      this.back(n);
    },
    open4(n) {
      this.back(n);
    },
    open5(n) {
      if (!n) {
        this.appPath("/management_classlist/list", true);
      }
    },
  },
  methods: {
    ondelitem(id) {
      this.open5 = false;
      this.open4 = true;
      if (id > 0) {
        this.detail.class_number -= 1;
        this.$nextTick(() => {
          this.$refs.o4.init(true);
        });
      }
    },
    back(n) {
      if (!n) {
        this.appPath("/management_classlist", true);
      }
    },
    onchangeclass() {
      this.onPage(1);
    },
    onend(e, j) {
      if (j < 0) {
        return this.onPage(1);
      }
      let ts = this;
      for (let i in e) {
        ts.$set(ts.item[j], i, e[i]);
      }
      this.open1 = false;
    },
    onendnum(e, j) {
      if (j >= 0) {
        this.$set(this.item[j], "class_number", e);
      }
    },
    onchilddet(e) {
      this.open5 = true;
    },
    // 班级详情
    ondetail(i, j) {
      this.onevent("det", i, j);
    },
    onevent(type, i = {}, j) {
      this.detail = {
        ...i,
        $index: j,
        $type: type,
      };
      this.appPath("/management_classlist/" + type, true);
      switch (type) {
        case "add": // 添加
        case "edit": // 编辑
          this.open1 = true;
          break;
        case "qr": // 邀请码
          this.open2 = true;
          break;
        case "list": // 名单
          this.open4 = true;
          break;
        case "det": // 详情
          this.open3 = true;
          break;
        default:
      }
    },
    initonce(e) {
      if (["add"].indexOf(e) >= 0) {
        this.onevent(e);
      }
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "classeslist",
        { page, name: this.val, type: this.s1.id || "" },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          this.item = this.item.concat(e);
          this.$refs.page.onFinish(e.length < 20);
        }
      );
    },
  },
  mounted() {
    this.t1 = this.$api.classes();
    let type = this.$route.params.type;
    this.initonce(type);
  },
};
</script>
<style lang='less' scoped>
.event {
  width: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
}
section {
  padding: 10px;
  font-size: 14px;
  background-color: #fff;
  margin: 10px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  position: relative;
  color: #999;
  h6 {
    padding: 8px 0;
    font-weight: 650;
    color: #666;
  }
  p {
    margin-top: 5px;
  }
  .tool {
    margin-top: 5px;
    flex-direction: row-reverse;
    .van-button {
      margin-left: 8px;
      min-width: 70px;
    }
  }
}
</style>
