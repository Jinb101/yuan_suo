<template>
  <v-view header @on-user="onuser">
    <van-radio-group v-model="radio">
      <van-cell
        v-for="(i, j) in g"
        :key="j"
        :title="i.text"
        @click="radio = i.id"
      >
        <template #right-icon>
          <van-radio :name="i.id" />
        </template>
      </van-cell>
    </van-radio-group>
    <div class="foot_btn">
      <van-button
        block
        round
        :color="$js.btnColor"
        :disabled="nid === radio"
        @click="onsave"
        >点击切换园所</van-button
      >
    </div>
  </v-view>
</template>

<script>
export default {
  data() {
    return {
      g: [],
      radio: "",
      nid: "",
    };
  },
  methods: {
    onuser(e) {
      // eslint-disable-next-line
      this.nid = this.radio = demo.$local.get("nid", "") + "";
      this.$api.http("getys", { phone: e.phone, type: 1 }, (r) => {
        this.g = r.map((s) => {
          let a = s.nursery || {};
          return {
            id: a.id + "",
            text: a.name,
          };
        });
      });
    },
    onsave() {
      let id = this.radio;
      let a = this.g.filter((r) => {
        return r.id === id;
      })[0];
      this.$js.model(
        "切换提示",
        "确认切换至" + a.text + "？切换后需重新登录",
        (r) => {
          if (r) {
            // eslint-disable-next-line
            demo.siteConfig.tktoggle("clear");
            // eslint-disable-next-line
            demo.$session.reset();
            // eslint-disable-next-line
            demo.$local.set("select-nid", a);
            this.appPath("/login");
          }
        }
      );
    },
  },
  mounted() {
    // this.$api.http('')
  },
};
</script>
<style lang='less' scoped>
.foot_btn {
  position: sticky;
  bottom: 0;
  padding: 10px;
  margin: 35px 22%;
}
</style>
