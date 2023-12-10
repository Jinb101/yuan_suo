<template>
  <div>
    <van-steps
      direction="vertical"
      :active="index"
      active-icon="more"
      center
      :active-color="$js.color"
    >
      <van-step v-for="(i, j) in schedule" :key="j + 's'">
        <div class="users flex" :class="{ opa: index > j && +i.status === 2 }">
          <div class="logo">
            <x-radius size="40">
              <van-image :src="i.avatar" fit="cover"></van-image>
            </x-radius>
          </div>
          <div class="font" @click.stop="oncheckpeople(i)">
            <p class="time">{{ i.time }}</p>
            <p class="name">
              {{ i.approval_name }}{{ ismy(i.id)
              }}<b>{{ toStatus(i.status) }}</b>
            </p>
            <span v-if="+i.status === 2 && check" class="th">
              替换<van-icon name="arrow" />
            </span>
          </div>
        </div>
      </van-step>
    </van-steps>
    <van-popup v-model="open6" round get-container="#app">
      <div class="c_p">
        <div class="app_top">
          <div class="h flex">
            <div class="logo">
              <x-radius size="40">
                <van-image :src="e6.avatar" fit="cover"></van-image>
              </x-radius>
            </div>
            <div class="text">
              <p>{{ e6.approval_name }}</p>
              <p class="col_danger">请选择替换人</p>
              <div class="c">
                <van-icon name="cross" @click="open6 = false" />
              </div>
            </div>
          </div>
          <v-s v-model="search"></v-s>
        </div>
        <div class="list">
          <van-radio-group v-model="radio">
            <van-collapse v-model="activeNames">
              <van-collapse-item title="集团" name="1">
                <div
                  class="h flex"
                  v-for="(x, y) in group"
                  :key="y + '-l'"
                  @click.stop="radio = x.id"
                >
                  <div class="logo">
                    <x-radius size="40">
                      <van-image :src="x.avatar" fit="cover"></van-image>
                    </x-radius>
                  </div>
                  <div class="text">
                    <p>{{ x.name }}</p>
                    <p>{{ [x.group_name, x.job_name].join("-") }}</p>
                    <div class="c">
                      <van-radio :name="x.id"></van-radio>
                    </div>
                  </div>
                </div>
              </van-collapse-item>
              <van-collapse-item title="园所" name="2">
                <div
                  class="h flex"
                  v-for="(x, y) in item"
                  :key="y + '-ls'"
                  @click.stop="radio = x.id"
                >
                  <div class="logo">
                    <x-radius size="40">
                      <van-image :src="x.avatar" fit="cover"></van-image>
                    </x-radius>
                  </div>
                  <div class="text">
                    <p>{{ x.name }}</p>
                    <p>{{ x.job_name }}</p>
                    <div class="c">
                      <van-radio :name="x.id"></van-radio>
                    </div>
                  </div>
                </div>
              </van-collapse-item>
            </van-collapse>
          </van-radio-group>
        </div>
        <div class="btn">
          <van-button
            block
            round
            type="info"
            :disabled="radio === ''"
            @click="onsubcheck"
            >确认替换</van-button
          >
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import vS from "../../../private/search.vue";
export default {
  props: { schedule: Array, value: null, check: Boolean },
  data() {
    return {
      mid: "",
      open6: false,
      e6: {},
      radio: "",
      item: [],
      group: [],
      search: "",
      activeNames: ["1", "2"],
      ext: {
        item: [],
        group: [],
      },
    };
  },
  components: { vS },
  computed: {
    index() {
      let s = this.schedule.map((s) => +s.status);
      let n = s.indexOf(2);
      let m = s.indexOf(1);
      let r = s.indexOf(3);
      let min = 0;
      if (n > -1) {
        min = n;
      }
      if (m > 0) {
        if (m > n) {
          min = m;
        }
      }
      if (r > -1) {
        min = r;
      }
      return min > 0 ? min : 0;
    },
    isEvent() {
      let val = this.schedule[this.index] || {};
      return val.id === this.mid;
    },
    open: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
    list() {
      return this.item.concat(this.group);
    },
  },
  watch: {
    open(n) {
      this.$emit("input", n);
    },
    isEvent(n) {
      this.open = n;
    },
    open6(n) {
      if (!n) {
        this.e6 = {};
      } else {
        this.init();
      }
    },
    search(v) {
      // contact
      if (v === "") {
        this.item = this.ext.item;
        this.group = this.ext.group;
      } else {
        this.item = this.ext.item.filter((r) => {
          return r.name.indexOf(v) >= 0;
        });
        this.group = this.ext.group.filter((r) => {
          return r.name.indexOf(v) >= 0;
        });
      }
    },
  },
  methods: {
    http(name, data) {
      let a = this.$api.http;
      return new Promise((resolve, reject) => {
        a(name, { ...data, rand: Math.random() }, (r) => {
          resolve(r);
        });
      });
    },
    async init() {
      if (this.list.length) {
        return 0;
      }
      let a = this.$toast.loading({ duration: 0 });
      this.ext.item = this.item = await this.http("getAllStaff", {
        type: 0,
        group_id: "",
      });
      this.ext.group = this.group = await this.http("getAllGroup", { type: 1 });
      a.clear && a.clear();
      setTimeout(() => {
        a.clear && a.clear();
      }, 8e3);
    },
    onsubcheck() {
      this.open6 = false;
      console.log(this.schedule);
      let oid = this.schedule.map((s) => {
        return s.id;
      });
      if (oid.indexOf(+this.radio) >= 0) {
        this.$toast("不能选择重复审批人");
        return 0;
      }
      this.$emit("checksub", {
        staff_id: this.radio,
        schedule_staff_id: this.e6.id,
        inform_type: 1,
      });
    },
    oncheckpeople(e) {
      if (+e.status === 2 && this.check) {
        this.open6 = true;
        this.e6 = e;
      }
    },
    ismy(id) {
      return this.mid === id ? "[自己]" : "";
    },
    toStatus(status) {
      if (status === undefined) return "发起审批";
      return ["未处理", "已处理", "待处理", "已撤销"][+status] || "已拒绝";
    },
  },
  mounted() {
    // eslint-disable-next-line
    let user = demo.$session.get("user", {});
    this.mid = user.s_id;
    this.open = this.value;
  },
};
</script>
<style lang='less' scoped>
.c_p {
  width: 320px;
  height: 500px;
  max-height: 80%;
  font-size: 14px;
  box-sizing: border-box;
  padding: 10px;
  position: relative;
  overflow-y: scroll;
  .h {
    padding: 5px 0;
    background-color: #fff;
    .logo {
      width: 40px;
      margin-right: 10px;
    }
    .text {
      width: calc(100% - 50px);
      line-height: 1.2;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
    }
    .c {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      height: 20px;
    }
  }
  .list {
    padding-bottom: 15px;
  }
  .btn {
    position: sticky;
    bottom: 10px;
    z-index: 50;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 15%;
  }
}
.users {
  &.opa {
    opacity: 0.7;
    filter: blur(2px);
  }
  .font {
    flex: 1;
    position: relative;
    box-sizing: border-box;
    padding: 5px 8px;
    color: #999;
    .th {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      font-size: 12px;
      padding-left: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .time {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 12px;
    }
    .name {
      line-height: 1.2;
      display: flex;
      align-items: center;
      height: 30px;
      flex-wrap: wrap;
    }
    b {
      color: #333;
      font-weight: 650;
      padding-left: 5px;
    }
  }
}
</style>
