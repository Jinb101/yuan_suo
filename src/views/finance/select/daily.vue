<template>
  <v-a sort>
    <div class="daily">
      <h2>{{ title }}</h2>
      <h4>总余额：{{ num }}元</h4>
    </div>
  </v-a>
</template>

<script>
import vA from "./account.vue";
export default {
  data() {
    return {
      num: 0,
      title: "",
    };
  },
  components: { vA },
  methods: {},
  mounted() {
    // eslint-disable-next-line
    let user = demo.$session.get("user", {});
    this.title = user.nursery_name || "";
    this.$api.http("financedaily", {}, (r) => {
      this.num = r;
    });
  },
};
</script>
<style lang='less' scoped>
.daily {
  padding: 10px 10px 0;
  h2 {
    text-align: center;
    padding: 8px 0;
    background: linear-gradient(45deg, #e2ebf2, #f6e2e3);
    border-radius: 5px;
    margin-bottom: 5px;
    font-weight: 650;
    font-size: 16px;
  }
  h4 {
    background-color: #fff;
    padding: 5px 10px;
    font-size: 15px;
  }
}
</style>
