<template>
  <div class="add_banner">
    <v-e title avatar v-model="os" ref="edit" :edata="list"></v-e>
  </div>
</template>

<script>
import vE from "../../editor/index.vue";
export default {
  props: {
    edit: Boolean,
    value: null,
  },
  data() {
    return {
      title: "",
      img: {},
      os: {},
      list: {},
    };
  },
  computed: {
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(n) {
        this.$emit("input", n);
      },
    },
  },
  watch: {
    ext: {
      handler(n) {
        this.setExt();
        this.$emit("input", n);
      },
      deep: true,
    },
  },
  components: { vE },
  methods: {
    save() {
      this.$refs.edit.submit();
      this.$nextTick(() => {
        this.$emit("save", this.os);
      });
    },
    setExt() {
      if (this.edit) {
        this.list = {
          title: this.ext.title,
          pic: this.ext.images,
          text: this.ext.content,
          url: this.ext.image,
          edit: true,
        };
      }
    },
  },
  mounted() {
    this.ext = this.value;
    this.setExt();
  },
};
</script>
<style lang='less' scoped>
.add_banner {
  .image {
    width: 200px;
    height: 115px;
    margin: 10px;
  }
}
</style>
