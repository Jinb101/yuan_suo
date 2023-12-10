<template>
  <div class="device_detail">
    <div class="cover"></div>
    <div class="head">
      <h6>{{ item.title }}</h6>
      <p class="status" :class="{ no: +item.status === 0 }">
        {{ totype("a1") }}
      </p>
      <p class="line">设备名称：{{ item.title }}</p>
      <p class="line">设备类型：{{ totype("a2") }}</p>
      <p class="line">设备功能：{{ totype("a3") }}</p>
      <div class="logo">
        <img :src="logo" alt="" />
      </div>
    </div>
    <div class="tab">
      <van-tabs v-model="type">
        <van-tab :title="i.t" :name="i.v" v-for="(i, j) in tab" :key="j">
          <template v-if="+type === 1">
            <van-cell title="设备编号" :value="item.device_serial"></van-cell>
          </template>
          <template v-else-if="+type === 2">
            <template v-if="+item.equipment_type === 2">
              <van-cell
                title="重置设备人脸"
                is-link
                value="点击重置"
                @click="onevent('reset')"
              ></van-cell>
              <van-cell
                title="人脸识别身高体重"
                value="点击设置"
                label="设备功能"
                is-link
                v-if="+item.start_type === 0"
                @click="onevent('set1')"
              ></van-cell>
              <van-cell
                title="人脸识别"
                value="点击设置"
                label="设备功能"
                is-link
                v-else
                @click="onevent('set2')"
              ></van-cell>
            </template>
            <template v-else>
              <van-cell
                title="同步信息"
                is-link
                value="点击同步"
                @click="onevent('reload')"
              ></van-cell>
            </template>
          </template>
          <template v-else-if="+type === 3">
            <v-a edit :ext="item" @change="onedit"></v-a>
          </template>
          <template v-else-if="+type === 4">
            <p class="error">是否删除该设备！注意：删除后不可恢复</p>
            <div class="del_btn">
              <van-button block round type="danger" plain @click="ondel"
                >执行删除</van-button
              >
            </div>
          </template>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import vA from "./_device_add.vue";
export default {
  props: {
    value: null,
  },
  components: { vA },
  data() {
    return {
      type: "",
      tab: [
        { t: "设备概况", v: 1 },
        { t: "设备控制", v: 2 },
        { t: "设备配置", v: 3 },
        { t: "设备删除", v: 4 },
      ],
      // eslint-disable-next-line
      logo: demo.siteConfig.icon(5001, "work"),
    };
  },
  computed: {
    item: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
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
  methods: {
    tochange() {
      this.$emit("change", this.item.id);
      this.$nextTick(() => {
        this.$emit("end");
      });
    },
    onevent(v) {
      switch (v) {
        case "reload":
        case "reset":
          this.$api.http("devicesync", { id: this.item.id }, () => {
            this.$toast("重置成功");
            this.tochange();
          });
          break;
        case "set2":
        case "set1":
          this.$api.http(
            "devicetype",
            { id: this.item.id, start_type: v === "set2" ? 0 : 1 },
            () => {
              this.$toast("设置成功");
              this.tochange();
            }
          );
          break;
        default:
      }
    },
    ondel() {
      this.$api.http("devicedel", { id: this.item.id }, () => {
        this.$toast("删除成功");
        this.$emit("end");
        this.$emit("close");
      });
    },
    onedit(e) {
      this.$api.http("deviceedit", { ...e, id: this.item.id }, () => {
        this.$toast("变更成功");
        this.tochange();
        for (let i in e) {
          this.item[i] = e[i];
        }
      });
    },
    totype(type) {
      let data = this.item;
      let a = "";
      switch (type) {
        case "a1":
          a = ["离线", "运行中"][data.status];
          break;
        case "a2":
          a = ["", "签到帮手", "超声波体检机"][data.equipment_type];
          break;
        case "a3":
          a = ["人脸识别", "人脸识别/身高体重"][data.start_type];
          break;
        default:
      }
      return a || "/";
    },
  },
  mounted() {
    this.item = this.value;
  },
};
</script>
<style lang='less' scoped>
.cover {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  height: 200px;
  width: 100%;
  background: linear-gradient(#fff, rgb(214, 231, 255));
}
.tab {
  position: relative;
  z-index: 12;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
}
.head {
  box-sizing: border-box;
  padding-bottom: 10px;
  position: relative;
  z-index: 10;
  h6 {
    font-size: 22px;
    padding: 20px 30px;
    font-weight: 650;
  }
  p {
    font-size: 14px;
    padding: 0 15px;
    box-sizing: border-box;
    margin-bottom: 5px;
    position: relative;
    line-height: 1.2;
    color: #999;
  }
  .status {
    color: #18bc9c;
    text-indent: 10px;
    &::before {
      position: absolute;
      content: "";
      left: 15px;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 5px;
      height: 5px;
      background-color: #18bc9c;
      border-radius: 50%;
    }
    &.no {
      color: tomato;
      &::before {
        background-color: tomato;
      }
    }
  }
  .logo {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 80px;
    height: 80px;
    z-index: 12;
    transform: translateX(-5%) translateY(5%);
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
.error {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 16px;
}
.del_btn {
  padding: 20px 20%;
}
</style>
