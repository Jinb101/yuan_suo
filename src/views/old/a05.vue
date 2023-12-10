<template>
  <v-view header text="食材小店">
    <iframe :src="src" frameborder="0" class="frame"></iframe>
  </v-view>
</template>

<script>
export default {
  data() {
    return {
      src: "",
    };
  },
  methods: {
    init() {
      let ext = this.$route.params.id;
      let spt = (ext + "").split("____");
      let opt = [
        "type=yuansuo",
        "frame=1",
        // eslint-disable-next-line
        "token=" + demo.siteConfig.tktoggle(),
        // eslint-disable-next-line
        "id=" + demo.$local.get("nid"),
        "api=api",
      ];
      if (spt.length === 1) {
        if (spt[0] > 0) {
          opt.push("detail=detail____" + spt[0]);
        }
      } else if (spt.length === 2) {
        opt.push("detail=" + spt[0] + "____" + spt[1]);
      }
      opt = opt.filter((r) => !!r);
      // eslint-disable-next-line
      this.src = demo.siteConfig.api.h5 + "delivery/?" + opt.join("&");
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
iframe {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
