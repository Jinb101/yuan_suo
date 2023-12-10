<template>
  <div class="mode">
    <x-content></x-content>
    <x-content>
      <van-field label="签名模板大图模式" label-width="9em" readonly>
        <template #button>
          <van-switch v-model="os.write" size="22" />
        </template>
      </van-field>
    </x-content>
    <x-content>
      <van-field label="审批功能常规版" label-width="9em" readonly>
        <template #button>
          <van-switch v-model="os.approval" size="22" />
        </template>
      </van-field>
    </x-content>
    <x-content>
      <van-field label="登录显示logo" label-width="9em" readonly>
        <template #button>
          <van-switch v-model="os.loginlogo" size="22" />
        </template>
      </van-field>
    </x-content>
    <x-content>
      <van-field label="启用草稿箱" label-width="9em" readonly>
        <template #button>
          <van-switch v-model="os.tempdata" size="22" />
        </template>
      </van-field>
    </x-content>
    <x-content>
      <van-field label="宝贝在线高清模式[大华设备]" label-width="9em" readonly>
        <template #button>
          <van-switch v-model="os.definition" size="22" />
        </template>
      </van-field>
    </x-content>
    <x-content></x-content>
    <x-content></x-content>
    <x-content></x-content>
    <x-content></x-content>
    <x-content></x-content>
    <x-content></x-content>
  </div>
</template>

<script>
export default {
  data() {
    return {
      os: {
        write: false,
        approval: false,
        loginlogo: false,
        tempdata: true,
        definition: false,
      },
    };
  },
  watch: {
    os: {
      handler(n) {
        // eslint-disable-next-line
        demo.$local.set("system-mode", { ...n, time: Date.now() });
      },
      deep: true,
    },
  },
  methods: {
    init() {},
  },
  mounted() {
    // eslint-disable-next-line
    let a = demo.$local.get("system-mode", {});
    if (a.time) {
      this.os = a;
    }
    this.init();
  },
};
</script>
<style lang='less' scoped>
</style>
