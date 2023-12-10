<template>
  <div class="device_add">
    <van-field
      v-model="title"
      label="设备名称"
      placeholder="请输入设备名称"
      label-width="5em"
    />
    <van-field
      v-model="no"
      label="设备编号"
      placeholder="请输入设备编号"
      label-width="5em"
    />
    <van-field label="设置类型" readonly label-width="5em">
      <template #button>
        <van-radio-group v-model="type" direction="horizontal">
          <van-radio name="1">签到帮手</van-radio>
          <van-radio name="2">超声波体检机</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <div class="w60">
      <van-button block round :color="$js.btnColor" @click="sub">{{
        edit ? "变更配置" : "添加绑定"
      }}</van-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    edit: Boolean,
    ext: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      type: "1",
      title: "",
      no: "",
    };
  },
  watch: {
    ext: {
      handler() {
        this.init();
      },
      deep: true,
    },
  },
  methods: {
    init() {
      if (this.ext.id && this.edit) {
        this.type = this.ext.equipment_type;
        this.title = this.ext.title;
        this.no = this.ext.device_serial;
      }
    },
    sub() {
      if (!this.no) return this.$toast("请输入设备编号");
      if (!this.title) return this.$toast("请输入设备名称");
      let os = {
        equipment_type: this.type,
        title: this.title,
        device_serial: this.no,
      };
      if (this.edit) {
        this.$emit("change", os);
        return 0;
      }
      this.$api.http("deviceadd", os, () => {
        this.$toast("添加成功");
        this.$emit("end");
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
</style>
