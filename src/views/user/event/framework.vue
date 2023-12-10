<template>
  <v-view header>
    <van-empty v-if="!list.length" description="暂无"></van-empty>
    <div class="images" v-for="(i, j) in list" :key="j + 'f'">
      <van-image
        :src="i.url"
        fit="cover"
        @click="appShowImage(list, j, 'url')"
      ></van-image>
    </div>
  </v-view>
</template>

<script>
export default {
  data() {
    return { list: [] };
  },
  inject: ["appShowImage"],
  methods: {},
  mounted() {
    this.$api.http("userorg", { type: 2 }, (r) => {
      this.list = r;
    });
  },
};
</script>
<style lang='less' scoped>
.images {
  height: 190px;
  margin: 10px;
  border-radius: 25px 5px;
  overflow: hidden;
}
</style>
