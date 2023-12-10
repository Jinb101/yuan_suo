<template>
  <div class="approval_send">
    <van-field
      v-model="tp.name"
      label="出勤类别"
      placeholder="请选择出勤类别"
      right-icon="arrow"
      input-align="right"
      readonly
      @click="onOpen(0)"
    />
    <van-field
      v-model="ct"
      label="开始时间"
      placeholder="请选择开始时间"
      right-icon="arrow"
      input-align="right"
      readonly
      @click="onOpen(1)"
    />
    <van-field
      v-model="et"
      label="结束时间"
      placeholder="请选择结束时间"
      right-icon="arrow"
      input-align="right"
      readonly
      @click="onOpen(2)"
    />
    <template v-if="ct === et && ct !== ''">
      <van-field label="请假时间段" readonly label-width="6em">
        <template #button>
          <van-radio-group v-model="day" direction="horizontal">
            <van-radio name="1">上午</van-radio>
            <van-radio name="2">下午</van-radio>
            <van-radio name="0">一天</van-radio>
          </van-radio-group>
        </template>
      </van-field>
    </template>
    <v-t v-model="time" :open="open"></v-t>
    <v-s :list="types" v-model="tp" :open="open1"></v-s>
  </div>
</template>

<script>
import vT from "../../../private/time.vue";
import vS from "../../../private/select.vue";
export default {
  props: {
    value: null,
  },
  data() {
    return {
      type: "",
      ct: "",
      et: "",
      time: "",
      open: false,
      open1: false,
      index: 0,
      day: "0",
      types: [
        { name: "事假", id: 1 },
        { name: "病假", id: 2 },
        { name: "其他", id: 3 },
      ],
      tp: {},
    };
  },
  components: { vT, vS },
  computed: {
    list: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
  },
  watch: {
    list: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
    time: {
      handler(n) {
        if (this.index === 1) {
          this.ct = n.ymd;
        } else {
          this.et = n.ymd;
        }
      },
      deep: true,
    },
    "tp.id"() {
      this.onRet();
    },
    ct() {
      this.onRet();
    },
    et() {
      this.onRet();
    },
    day() {
      this.onRet();
    },
  },
  methods: {
    onOpen(e) {
      this.index = e;
      if (e === 0) {
        this.open1 = !this.open1;
      } else {
        this.open = !this.open;
      }
    },
    onRet() {
      let os = {
        attendance_type: this.tp.id || "",
        begin_date: this.ct,
        end_date: this.et,
        types: this.day,
      };
      this.list = [os];
    },
  },
  mounted() {
    this.list = this.value;
  },
};
</script>
<style lang='less' scoped>
</style>
