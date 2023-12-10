<template>
  <div class="box">
    <h5 class="flex">
      <b>{{ title }}</b>
      <p v-if="unittitle.length" class="unit">
        (<span v-for="(i, j) in unittitle" :key="j" :style="{ color: i.v }">
          {{ i.t }}
        </span>
        )
      </p>
      <span class="btns" v-if="$slots.right" @click.stop="onclick">
        <slot name="right" />
      </span>
      <span class="status" v-else-if="finance">配合财务功能使用</span>
    </h5>
    <div class="view_box">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    unit: {
      type: Array,
      default: () => {
        return [];
      },
    },
    finance: Boolean,
  },
  computed: {
    unittitle() {
      let c = this.c;
      return this.unit.map((k, v) => {
        return {
          t: k,
          v: c[v],
        };
      });
    },
  },
  data() {
    return {
      c: ["#99cc33", "#38f", "tomato"],
    };
  },
  methods: {
    onclick(i) {
      this.$emit("tap", this.title);
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.box {
  font-size: 15px;
  padding: 10px;
  background-color: #fff;
  & + .box {
    margin-top: 8px;
  }
  h5 {
    position: relative;
    line-height: 35px;
    height: 35px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 5px;
    // padding: 10px 0;
    b {
      font-weight: 650;
    }
    .btns {
      color: orange;
      text-decoration: underline;
      font-size: 13px;
      padding: 0 5px;
    }
    .status {
      font-size: 13px;
      color: #ccc;
    }
    .unit {
      padding-left: 5px;
      flex: 1;
      font-size: 14px;
      span {
        position: relative;
        & + span {
          margin-left: 7px;
          &::before {
            position: absolute;
            content: "/";
            left: -7px;
            top: -9px;
            color: #999;
          }
        }
      }
    }
  }
  .view_box {
    position: relative;
    padding: 10px 0;
  }
}
</style>
