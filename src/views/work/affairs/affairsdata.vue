<template>
  <v-view cover header>
    <x-content></x-content>
    <x-content>
      <!-- <van-field readonly label="园所数据链接财务" label-width="9em">
        <template #button>
          <van-switch
            v-model="checked"
            :active-color="color"
            inactive-color="#dcdee0"
            size="18px"
            @change="onchange"
            :loading="load"
          />
        </template>
      </van-field> -->
      <van-cell
        title="园所数据来源"
        label="水、电、气、幼儿伙食费、员工伙食费、工资、社保"
      ></van-cell>
      <div class="box">
        <van-radio-group
          v-model="type"
          direction="horizontal"
          @change="onchange"
        >
          <van-radio name="1" :checked-color="color"
            ><div class="font">自行填写</div></van-radio
          >
          <van-radio name="2" :checked-color="color"
            ><div class="font">财务控制</div></van-radio
          >
        </van-radio-group>
      </div>
    </x-content>
    <x-content></x-content>
  </v-view>
</template>

<script>
export default {
  data() {
    return {
      type: "",
      // eslint-disable-next-line
      color: demo.siteConfig.theme.color,
      load: true,
    };
  },
  methods: {
    onchange() {
      if (this.load) return 0;
      this.$api.http("recordsettype", { park_data: this.type }, () => {
        this.$toast("设置成功");
      });
    },
  },
  mounted() {
    this.$api.http("recordgettype", {}, (r) => {
      this.type = r;
      this.$nextTick(() => {
        this.load = false;
      });
    });
  },
};
</script>
<style lang='less' scoped>
.box {
  background-color: #fff;
  padding: 10px;
  .font {
    font-size: 15px;
  }
}
</style>
