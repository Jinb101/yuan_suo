<template>
  <x-content>
    <section v-for="(i, j) in image" :key="j" class="s">
      {{ i.v }} / {{ i.index }}
    </section>
    <h6>图片</h6>
    <v-is v-model="image">
      <div class="image">
        <v-i
          more
          @on-loading="onImageLoading"
          @on-path="onImagePath"
          ids="u1-file"
        ></v-i>
      </div>
    </v-is>
    <section v-for="(i, j) in image2" :key="j + 'w'" class="s">
      {{ i.v }} / {{ i.index }}
    </section>
    <h6>pdf/word/excel</h6>
    <v-is v-model="image2">
      <div class="image">
        <v-i
          more
          @on-loading="onImageLoading2"
          @on-path="onImageLoading2"
          ids="u2-file"
          type="all"
        ></v-i>
      </div>
    </v-is>
  </x-content>
</template>

<script>
import vI from "../public/upload.vue";
import vIs from "../public/uploads.vue";

// eslint-disable-next-line
if (VConsole) {
  // eslint-disable-next-line
  new VConsole();
}

export default {
  data() {
    return {
      image: [],
      image2: [],
    };
  },
  components: { vI, vIs },
  methods: {
    onImageLoading(ext, list, index) {
      this.image = list;
    },
    onImagePath(ext, list, index) {
      this.image = list;
    },
    onImageLoading2(a, b) {
      this.image2 = b;
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.image {
  width: 100px;
  height: 100px;
}
.s {
  margin-bottom: 5px;
  border: 1px solid #38f;
  padding: 10px;
  font-size: 14px;
  box-sizing: border-box;
  width: 300px;
}
</style>
