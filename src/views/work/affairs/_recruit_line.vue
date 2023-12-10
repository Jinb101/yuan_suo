<template>
  <div class="recruit_line">
    <h5 class="head" :class="{ small: small }">
      {{ title }}
      <template v-if="add">
        <div class="r">
          <slot name="add" />
        </div>
      </template>
    </h5>
    <div class="box">
      <slot />
      <template v-if="!open">
        <div class="more" v-if="more" @click="open = true">查看更多</div>
      </template>
      <transition name="van-slide-down">
        <div class="more_box" v-if="open">
          <slot name="more" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    more: Boolean,
    title: String,
    add: Boolean,
    small: Boolean,
  },
  data() {
    return {
      open: false,
    };
  },
  methods: {},
  mounted() {},
};
</script>
<style lang='less' scoped>
.recruit_line {
  padding: 0 10px 15px;
  .head {
    padding: 10px 0;
    margin-bottom: 5px;
    border-bottom: 1px solid rgb(228, 228, 228);
    font-weight: 650;
    font-size: 16px;
    position: relative;
    .r {
      position: absolute;
      right: 5px;
      top: 10px;
      z-index: 5;
    }
    &.small {
      font-size: 14px;
    }
  }
  .box {
    position: relative;
    font-size: 14px;
    line-height: 1.2;
    color: rgb(119, 119, 119);
    overflow: hidden;
    p {
      margin-top: 5px;
    }
    .more_box {
      margin-top: 5px;
    }
  }
  .more {
    text-align: center;
    color: #38f;
    padding: 5px 0;
    margin-top: 5px;
  }
}
</style>
