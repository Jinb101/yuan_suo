<template>
  <v-a apiname="babymyout" out :cid="cid" :rid="rid"></v-a>
</template>

<script>
import vA from "./in.vue";
export default {
  props: {
    cid: [String, Number],
    rid: [String, Number],
  },
  data() {
    return {};
  },
  components: { vA },
  methods: {},
  mounted() {},
};
</script>
<style lang='less' scoped>
</style>
