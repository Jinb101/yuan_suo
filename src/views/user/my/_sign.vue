<template>
  <div class="sign_onename">
    <van-radio-group v-model="radio">
      <div class="flex fw">
        <section v-for="(i, j) in list" :key="j" :class="type">
          <div class="tool f" v-if="i.id">
            <!-- 删除 -->
            <span class="close f" v-if="del" @click.stop="ondel(i)"
              ><van-icon name="cross"
            /></span>
            <span class="check f" v-else-if="check">
              <van-radio :name="i.id"></van-radio>
            </span>
            <!-- 选择 -->
          </div>
          <div
            class="image f"
            :class="{ show: i.id }"
            @click.stop="onopenshow(i)"
          >
            <van-image v-if="i.id" :src="i.url" fit="cover"></van-image>
            <div class="plus" v-else>
              <van-icon name="plus"></van-icon>
            </div>
          </div>
        </section>
      </div>
      <div class="bottom" v-if="check">
        <van-button
          block
          round
          :color="$js.btnColor"
          :disabled="radio === ''"
          @click="onchangewrite"
        >
          {{ radio !== "" ? "确认选择" : "请选择签名" }}
        </van-button>
      </div>
    </van-radio-group>
    <v-f v-model="add" :footer="false" text="签字">
      <v-h v-model="s1" @on-save="onchange" api></v-h>
    </v-f>
  </div>
</template>

<script>
import vH from "../../private/hand.vue";
import vF from "../../private/fixed.vue";
export default {
  props: {
    del: Boolean,
    check: Boolean,
  },
  data() {
    return {
      list: [],
      max: 0,
      type: "",
      item: [],
      radio: "",
      add: false,
      ext: {},
      s1: {},
    };
  },
  components: { vF, vH },
  inject: ["appShowImage"],
  methods: {
    onchange(e) {
      this.$api.http("usermysignadd", { sign: this.s1.halfway }, () => {
        this.$toast("添加成功");
        this.add = false;
        this.s1 = {};
        this.init();
      });
    },
    onchangewrite() {
      let a = +this.radio;
      let ext =
        this.item.filter((r) => {
          return a === +r.sign_id;
        })[0] || {};
      this.$emit("change", ext, this.radio);
    },
    onopenshow(e) {
      if (e.url) {
        if (this.check) {
          this.radio = e.id;
          return 0;
        }
        return this.appShowImage(e.url);
      }
      this.add = true;
    },
    init() {
      this.$api.http("usermysign", {}, (r) => {
        this.item = r;
        this.once();
      });
    },
    once() {
      let a = [];
      if (this.item.length > this.max) {
        a = this.item.splice(0, this.max);
      } else {
        a = this.item;
      }
      let num = this.max - a.length;
      let c = a.map((s) => {
        return {
          id: s.sign_id,
          url: s.sign,
        };
      });
      if (num > 0) {
        for (let i = 0; i < num; i++) {
          c.push({});
        }
      }
      this.list = c;
    },
    ondel(i) {
      this.$js.modeldel(() => {
        this.$api.http("usermysigndel", { sign_id: i.id }, () => {
          this.$toast("删除成功");
          this.item = this.item.filter((r) => {
            return r.sign_id !== i.id;
          });
          this.once();
        });
      });
    },
  },
  mounted() {
    // eslint-disable-next-line
    let a = demo.siteConfig.hide.write;
    this.max = a.num;
    this.type = a.type;
    // eslint-disable-next-line
    let s = demo.$local.get("system-mode", {});
    if (s.write) {
      this.type = "big";
    }
    this.$nextTick(() => {
      this.init();
    });
  },
};
</script>
<style lang='less' scoped>
.sign_onename {
  section {
    margin: 5px;
    position: relative;
    background-color: #f7f8fa;
    &.small {
      width: calc(50% - 10px);
      height: 100px;
    }
    &.big {
      width: calc(100% - 10px);
      height: 205px;
    }
    .tool {
      position: absolute;
      right: 0;
      top: 0;
      width: 30px;
      height: 30px;
      z-index: 5;
      .close {
        display: flex;
        width: 100%;
        height: 100%;
        color: #fff;
        background-color: tomato;
        font-size: 20px;
        border-radius: 0 0 0 15px;
      }
    }
    .image {
      width: 100%;
      height: 100%;
      &.show {
        background-color: #fff;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
      }
    }
    .f {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .plus {
      color: #ccc;
      font-size: 35px;
      height: 35px;
      width: 35px;
    }
  }
}
.bottom {
  margin: 20px 20%;
}
</style>
