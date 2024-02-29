<template>
  <div class="add_page">
    <van-field
      v-model="val.name"
      label="宝宝姓名"
      placeholder="请输入宝宝姓名"
      label-width="5em"
      required
    />
    <van-field label="性别" readonly label-width="5em" required>
      <template #button>
        <van-radio-group v-model="val.gender" direction="horizontal">
          <van-radio name="1">男</van-radio>
          <van-radio name="2">女</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <van-field
      v-model="val.birthday"
      label="出生日期"
      placeholder="请选择出生日期"
      label-width="5em"
      required
      right-icon="arrow"
      readonly
      input-align="right"
      @click="open = !open"
    />
    <van-field
      v-model="val.parent_name"
      label="家长姓名"
      placeholder="请输入家长姓名"
      label-width="5em"
      required
    />
    <van-field
      v-model="val.contact"
      label="联系方式"
      placeholder="请输入联系方式"
      label-width="5em"
      required
    />
    <van-field
      v-model="val.address"
      label="联系地址"
      placeholder="请输入联系地址"
      label-width="5em"
      required
    />
    <van-field label="生源类型" readonly label-width="5em" required>
      <template #button>
        <van-radio-group v-model="val.source_type" direction="horizontal">
          <van-radio name="1">A 类</van-radio>
          <van-radio name="2">B 类</van-radio>
          <van-radio name="3">C 类</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <div class="btns">
      <van-button block round :color="$js.btnColor" @click="onsubmit">{{
        btntext
      }}</van-button>
    </div>
    <template v-if="qr">
      <h6>招生二维码</h6>
      <div class="qr">
        <van-image :src="image" @click="appShowImage(image)"></van-image>
      </div>
    </template>
    <v-t :open="open" max="d_1" v-model="val.birthday" ymd></v-t>
  </div>
</template>

<script>
import vT from "../../private/time.vue";
export default {
  props: {
    qr: Boolean,
    edit: Boolean,
    value: null,
  },
  data() {
    return {
      val: {
        gender: "1",
        birthday: "",
        parent_name: "",
        contact: "",
        address: "",
        name: "",
        source_type: "1",
      },
      open: false,
      image: "",
    };
  },
  inject: ["appShowImage"],
  components: { vT },
  computed: {
    os: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    btntext() {
      return this.edit ? "编辑" : "提交";
    },
  },
  watch: {
    os: {
      handler(v) {
        this.$emit("input", v);
      },
      deep: true,
    },
  },
  methods: {
    onsubmit() {
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.val.contact)) {
        return this.$toast("手机号错误");
      }
      let api = this.edit ? "recruitedit" : "recruitadd";
      let os = {
        ...this.val,
      };
      let r = {
        ...this.os,
        ...os,
      };
      if (this.edit) {
        os.c_id = this.os.id;
      }
      this.$api.http(api, os, () => {
        this.$toast(this.btntext + "成功");
        if (!this.edit) {
          this.clear();
        } else {
          this.os = r;
          this.$emit("change", os);
        }
      });
    },
    clear() {
      this.val = {
        gender: "1",
        birthday: "",
        parent_name: "",
        contact: "",
        address: "",
        name: "",
        source_type: "1",
      };
    },
    onqr() {
      this.$api.http("recruitcode", {}, (r) => {
        this.image = r;
      });
    },
    init() {
      if (this.edit && this.os.id) {
        this.val = {
          gender: this.os.gender + "",
          birthday: this.os.birthday,
          parent_name: this.os.parent_name,
          contact: this.os.contact,
          address: this.os.address,
          name: this.os.name,
          source_type: this.os.source_type + "",
        };
      }
    },
  },
  mounted() {
    this.os = this.value;
    if (this.qr) {
      this.onqr();
    }
    this.init();
  },
};
</script>
<style lang='less' scoped>
.btns {
  padding: 30px 25%;
}
h6 {
  font-size: 15px;
  font-weight: 650;
  text-align: center;
  letter-spacing: 2px;
  padding: 10px 0;
}
.qr {
  width: 300px;
  height: 300px;
  margin: 0 auto 30px;
  padding: 10px;
  box-sizing: border-box;
  background: linear-gradient(#fff, #6943f2);
  border-radius: 0 0 10px 10px;
}
</style>
