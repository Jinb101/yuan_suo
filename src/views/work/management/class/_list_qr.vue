<template>
  <div class="list_qr" ref="listqr">
    <h6>{{ class_name }}</h6>
    <div class="image">
      <van-image :src="pic"></van-image>
    </div>
    <div class="pad">
      <h4>班主任</h4>
      <van-cell
        :title="name"
        :value="tel"
        is-link
        @click="ontel(tel)"
      ></van-cell>
      <h4>班级老师</h4>
      <van-cell
        :title="i.name || '暂无'"
        :value="i.contact"
        is-link
        v-for="(i, j) in staff"
        :key="j"
        @click="ontel(i.contact)"
      ></van-cell>
    </div>
    <div class="more">
      <van-divider content-position="left">其他班级</van-divider>
      <van-cell
        :title="i.nickname"
        v-for="(i, j) in item"
        :key="j + '-c'"
        :value="i.contact"
        :label="'班主任：' + (i.name || '暂无')"
        is-link
        @click.stop="init(i)"
      ></van-cell>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: null,
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      pic: "",
      staff: [],
      name: "",
      tel: "",
      class_name: "",
      id: "",
    };
  },
  computed: {
    detail: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    item() {
      let id = +this.id;
      return this.list.filter((r) => {
        return r.id !== id;
      });
    },
  },
  watch: {
    detail: {
      handler(v) {
        this.$emit("input", v);
      },
      deep: true,
    },
  },
  methods: {
    ontel(e) {
      // eslint-disable-next-line
      demo.siteConfig.tel(e);
    },
    init(val = {}) {
      try {
        this.$refs.listqr.parentNode.scrollTop = 0;
      } catch (e) {}
      this.pic = val.class_qr_code;
      this.staff = val.staff || [];
      this.name = val.name;
      this.tel = val.contact;
      this.class_name = val.nickname;
      this.id = val.id;
    },
  },
  mounted() {
    this.detail = this.value;
    this.init(this.detail);
  },
};
</script>
<style lang='less' scoped>
.list_qr {
  padding: 30px 0;
  h6 {
    padding: 5px 0;
    text-align: center;
    font-size: 15px;
    font-weight: 650;
  }
  h4 {
    font-size: 14px;
    color: #999;
  }
  .image {
    width: 200px;
    height: 200px;
    margin: 10px auto;
    background-color: #fff;
  }
  .more {
    margin-top: 30px;
  }
  .pad {
    padding: 0 12%;
  }
}
</style>
