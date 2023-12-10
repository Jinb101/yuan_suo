<template>
  <v-view header bgc="#f5f8fa">
    <v-v>
      <!-- {{ ext }} -->
    </v-v>
  </v-view>
</template>

<script>
import vV from "../user/my/_atten_clock.vue";
export default {
  data() {
    return {
      ext: {},
    };
  },
  components: { vV },
  methods: {},
  mounted() {
    this.$js.wxshare({}, "geo", (r) => {
      this.ext = r;
      // lng 104.00405
      // lat 30.636559
    });
  },
};
</script>
<style lang='less' scoped>
</style>
