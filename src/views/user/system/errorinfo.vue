<template>
  <div class="errorinfo">
    <van-empty v-if="!item.length" description="暂无"></van-empty>
    <section v-for="(i, j) in item" :key="j" @click="oncopy(i)">
      <h5>请求接口</h5>
      <h6>{{ i["接口"] }}</h6>
      <h5>发送数据</h5>
      <pre class="code">{{ i["发送数据"] }}</pre>
      <h5>返回信息</h5>
      <pre class="msg">{{ i["返回信息"] }}</pre>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: [],
    };
  },
  methods: {
    oncopy(e) {
      // eslint-disable-next-line
      demo.$ctrl.c("", JSON.stringify(e));
    },
  },
  mounted() {
    // eslint-disable-next-line
    this.item = demo.$error;
  },
};
</script>
<style lang='less' scoped>
.errorinfo {
  section {
    margin: 10px;
    padding: 10px;
    box-sizing: border-box;
    position: relative;
    background-color: #fff;
    border-radius: 10px;
    font-size: 13px;
  }
  h5 {
    font-weight: 650;
    padding: 10px 0;
  }
  h6 {
    color: tomato;
  }
  pre {
    color: #fff;
    background-color: #222;
    border-radius: 8px;
    padding: 5px;
    white-space: pre-wrap;
    word-break: break-all;
  }
  .code {
  }
  .msg {
  }
}
</style>
