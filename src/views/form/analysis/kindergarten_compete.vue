<template>
  <div class="form_analysis kindergarten_compete">
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section v-for="(i, j) in item" :key="j" class="sec">
        <van-cell
          :title="(i.staff || {}).name"
          is-link
          :label="appTimeout(i.create_time, true) + '发布'"
          @click="ondet(i)"
          value="点击预览"
        ></van-cell>
        <template v-if="uid === (i.staff || {}).id">
          <div class="btn flex">
            <van-button
              size="small"
              type="warning"
              round
              @click.stop="onedititem(i)"
              >编辑</van-button
            >
            <van-button
              size="small"
              type="danger"
              round
              @click.stop="ondelitem(i)"
              >删除</van-button
            >
          </div>
        </template>
      </section>
    </v-page>
    <v-f
      v-model="add"
      :text="show ? '预览' : os.id ? '编辑' : '发布'"
      :footer="false"
    >
      <div class="box" :class="{ c: show }">
        <van-field label="幼儿园名称" placeholder="请输入" v-model="os.name" />
        <van-field
          label="园长能力值"
          placeholder="请输入,最大10分"
          type="number"
          maxlength="2"
          v-model="os.capability_value"
        >
          <template #button> 分 </template>
        </van-field>
      </div>
      <div class="box" :class="{ c: show }">
        <h5 class="van-hairline--bottom">基本信息</h5>
        <div class="input">
          <van-field label="性质" placeholder="请输入" v-model="os.nature" />
        </div>
        <div class="input">
          <van-field label="距离" placeholder="请输入" v-model="os.distance" />
        </div>
        <div class="input">
          <van-field
            label="最大开班数"
            placeholder="请输入"
            v-model="os.max"
            type="number"
          >
            <template #button> 个 </template>
          </van-field>
        </div>
        <div class="input">
          <van-field
            label="已开班"
            placeholder="请输入"
            v-model="os.class_started"
            type="number"
          >
            <template #button> 个 </template>
          </van-field>
        </div>
        <div class="input">
          <van-field
            label="园所人数"
            placeholder="请输入"
            v-model="os.number"
            type="number"
          >
            <template #button> 个 </template>
          </van-field>
        </div>
        <div class="input">
          <van-field
            label="保教费(定价)"
            placeholder="请输入"
            v-model="os.tuition_pricing"
            type="number"
          >
            <template #button> 元 </template>
          </van-field>
        </div>
        <div class="input">
          <van-field
            label="保教费(实收)"
            placeholder="请输入"
            v-model="os.actual_tuition_fee"
            type="number"
          >
            <template #button> 元 </template>
          </van-field>
        </div>
        <div class="input">
          <van-field
            label="生活费"
            placeholder="请输入"
            v-model="os.living_expenses"
            type="number"
          >
            <template #button> 元 </template>
          </van-field>
        </div>
        <div class="input">
          <van-field label="餐点" placeholder="请输入" v-model="os.food" />
        </div>
        <div class="input">
          <van-field
            label="户外场地"
            placeholder="请输入"
            v-model="os.outdoor_field"
          />
        </div>
        <div class="input">
          <van-field
            label="家长口碑"
            placeholder="请输入"
            v-model="os.opinions"
          />
        </div>
        <div class="input">
          <van-field
            label="外教配置"
            placeholder="请输入"
            v-model="os.foreign_teacher"
          />
        </div>
        <div class="input">
          <van-field
            label="实时监控"
            placeholder="请输入"
            v-model="os.monitor"
          />
        </div>
        <div class="input">
          <van-field
            label="装修"
            placeholder="请输入"
            v-model="os.renovation"
          />
        </div>
        <div class="input">
          <van-field
            label="老师配置"
            placeholder="请输入"
            v-model="os.teacher"
          />
        </div>
        <div class="input">
          <van-cell
            title="开园时间"
            :value="os.opening_hours ? os.opening_hours : '请选择开园时间'"
            @click="open = !open"
            is-link
          ></van-cell>
        </div>
      </div>
      <div class="box" :class="{ c: show }">
        <h5 class="van-hairline--bottom">教育特色</h5>
        <van-field
          rows="2"
          autosize
          type="textarea"
          maxlength="255"
          placeholder="请输入"
          show-word-limit
          v-model="os.characteristic"
        />
      </div>
      <div class="box" :class="{ c: show }">
        <h5 class="van-hairline--bottom">S优势</h5>
        <van-field
          rows="2"
          autosize
          type="textarea"
          maxlength="255"
          placeholder="请输入"
          show-word-limit
          v-model="os.s"
        />
      </div>
      <div class="box" :class="{ c: show }">
        <h5 class="van-hairline--bottom">W劣势</h5>
        <van-field
          rows="2"
          autosize
          type="textarea"
          maxlength="255"
          placeholder="请输入"
          show-word-limit
          v-model="os.w"
        />
      </div>
      <div class="box" :class="{ c: show }">
        <h5 class="van-hairline--bottom">O机会</h5>
        <van-field
          rows="2"
          autosize
          type="textarea"
          maxlength="255"
          placeholder="请输入"
          show-word-limit
          v-model="os.o"
        />
      </div>
      <div class="box" :class="{ c: show }">
        <h5 class="van-hairline--bottom">T威胁</h5>
        <van-field
          rows="2"
          autosize
          type="textarea"
          maxlength="255"
          placeholder="请输入"
          show-word-limit
          v-model="os.t"
        />
      </div>
      <div class="save_btn">
        <van-button block round type="info" @click="onsub" v-if="!show">
          {{ os.id ? "编辑" : "发布" }}
        </van-button>
        <van-button block round type="primary" @click="onsave">
          生成图片
        </van-button>
      </div>
    </v-f>
    <transition name="van-slide-left">
      <div class="app_show_fixed" v-if="readonly">
        <div class="analysis_kinder_cover">
          <table class="table border_default atable">
            <thead>
              <tr>
                <th colspan="8">园所竞争分析表</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="8" class="td">幼儿园名称：{{ os.name }}</td>
              </tr>
              <tr>
                <td colspan="8" class="td">
                  园长能力值（满分10）：{{ os.capability_value }}
                </td>
              </tr>
              <tr>
                <td>性质</td>
                <td>{{ os.nature }}</td>
                <td>距离</td>
                <td>{{ os.distance }}</td>
                <td>最大开班数</td>
                <td>{{ os.max }}</td>
                <td>已开班</td>
                <td>{{ os.class_started }}</td>
              </tr>
              <tr>
                <td>园所人数</td>
                <td>{{ os.number }}</td>
                <td class="td2">保教费（定价）</td>
                <td>{{ os.tuition_pricing }}</td>
                <td class="td2">保教费（实收）</td>
                <td>{{ os.actual_tuition_fee }}</td>
                <td>生活费</td>
                <td>{{ os.living_expenses }}</td>
              </tr>
              <tr>
                <td>餐点</td>
                <td>{{ os.food }}</td>
                <td>户外场地</td>
                <td>{{ os.outdoor_field }}</td>
                <td>家长口碑</td>
                <td>{{ os.opinions }}</td>
                <td>外教配置</td>
                <td>{{ os.foreign_teacher }}</td>
              </tr>
              <tr>
                <td>实时监控</td>
                <td>{{ os.monitor }}</td>
                <td>装修</td>
                <td>{{ os.renovation }}</td>
                <td>老师配置</td>
                <td>{{ os.teacher }}</td>
                <td>开园时间</td>
                <td>{{ os.opening_hours }}</td>
              </tr>
              <tr>
                <td colspan="8" class="td">
                  教育特色：{{ os.characteristic }}
                </td>
              </tr>
              <tr>
                <td colspan="4" class="td">S优势：{{ os.s }}</td>
                <td colspan="4" class="td">W劣势：{{ os.w }}</td>
              </tr>
              <tr>
                <td colspan="4" class="td">O机会：{{ os.o }}</td>
                <td colspan="4" class="td">T威胁：{{ os.t }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </transition>
    <v-t :open="open" v-model="os.opening_hours" ymd></v-t>
  </div>
</template>

<script>
import vT from "../../private/time.vue";
import vF from "../../private/fixed.vue";
export default {
  props: {
    eadd: [String, Number],
  },
  data() {
    return {
      readonly: false,
      pic: "",
      open: false,
      add: false,
      item: [],
      uid: "",
      os: {
        id: "",
        name: "",
        capability_value: "",
        nature: "",
        distance: "",
        max: "",
        class_started: "",
        number: "",
        tuition_pricing: "",
        actual_tuition_fee: "",
        living_expenses: "",
        food: "",
        outdoor_field: "",
        opinions: "",
        foreign_teacher: "",
        monitor: "",
        renovation: "",
        teacher: "",
        opening_hours: "",
        characteristic: "",
        s: "",
        w: "",
        o: "",
        t: "",
      },
      user: {},
      show: false,
    };
  },
  watch: {
    eadd() {
      this.add = true;
    },
    add(n) {
      if (!n) {
        for (let i in this.os) {
          this.os[i] = "";
        }
        // this.os.name = this.user.nursery_name;
        this.show = false;
        this.pic = "";
      }
    },
  },
  components: { vT, vF },
  inject: ["appShowImage", "appTimeout"],
  methods: {
    setos(e) {
      let v = {};
      for (let i in this.os) {
        v[i] = e[i];
      }
      return JSON.parse(JSON.stringify(v));
    },
    onedititem(e) {
      this.os = this.setos(e);
      this.add = true;
    },
    ondelitem(e) {
      this.$js.modeldel(() => {
        this.$api.http("analysiskindergardel", { id: e.id }, () => {
          this.$toast("删除成功");
          this.item = this.item.filter((r) => {
            return r.id !== e.id;
          });
        });
      });
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("analysiskindergar", { page }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
    totimes(fn) {
      return new Promise((resolve) => {
        if (fn) {
          fn((val) => {
            resolve(val);
          });
          return 0;
        }
        setTimeout(() => {
          resolve();
        }, 500);
      });
    },
    async onsave() {
      if (this.pic) {
        return this.appShowImage(this.pic);
      }
      this.readonly = true;
      this.$toast.loading({
        message: "正在生成中",
      });
      let top =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;
      await this.totimes();
      // eslint-disable-next-line
      let img = await demo.es6().tocanvas(".analysis_kinder_cover", { y: top });
      this.pic = img.img;
      this.appShowImage(img.img);
      this.$nextTick(() => {
        this.readonly = false;
      });
    },
    onsub() {
      this.$api.http("analysiskindergaradd", this.os, () => {
        this.$toast("保存成功");
        this.add = false;
        this.onPage(1);
      });
    },
    ondet(e) {
      this.os = this.setos(e);
      this.add = true;
      this.show = true;
    },
  },
  mounted() {
    // eslint-disable-next-line
    let a = demo.$session.get("user");
    this.user = a;
    // this.os.name = a.nursery_name || "";
    this.uid = a.s_id;
  },
};
</script>
<style lang='less' scoped>
.analysis_kinder_cover {
  height: 100%;
  overflow-x: scroll;
}
.atable {
  width: 750px;
  transform: scale(0.5, 0.5) translateX(-50%) translateY(-50%);
}
.td {
  text-align: left;
  padding: 10px;
  line-height: 1.2;
  white-space: pre-wrap;
}
.td2 {
  white-space: pre-wrap;
  line-height: 1.2;
  padding: 5px;
}
.sec {
  margin: 10px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  .btn {
    background-color: #fff;
    padding: 5px 10px;
    flex-direction: row-reverse;
    .van-button {
      min-width: 80px;
      margin-left: 12px;
    }
  }
}
.box {
  position: relative;
  &.c {
    &::after {
      position: absolute;
      content: "";
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 5;
    }
  }
}
</style>
