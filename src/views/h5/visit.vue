<template>
  <v-view @on-view="onview" cover bgc="#f5f5f5">
    <template v-if="wx.url">
      <x-content></x-content>
      <x-content>
        <van-field
          label="访问日期"
          placeholder="请选择访问日期"
          input-align="right"
          right-icon="arrow"
          readonly
          required
          label-width="5em"
          v-model="os.date"
          @click="open1 = !open1"
        />
      </x-content>
      <x-content>
        <van-field
          label="入园时间"
          placeholder="请选择入园时间"
          input-align="right"
          right-icon="arrow"
          readonly
          required
          label-width="5em"
          v-model="os.admission_time"
          @click="open2 = !open2"
        />
      </x-content>
      <x-content>
        <van-field
          label="姓名"
          placeholder="请输入姓名"
          required
          label-width="5em"
          v-model="os.full_name"
        />
      </x-content>
      <x-content>
        <van-field
          label="联系方式"
          placeholder="请输入联系方式"
          required
          label-width="5em"
          type="number"
          v-model="os.telephone"
        />
      </x-content>
      <x-content>
        <van-field
          label="身份证号"
          placeholder="请输入身份证号"
          required
          label-width="5em"
          v-model="os.id_number"
        />
      </x-content>
      <x-content>
        <van-field
          label="被访人"
          placeholder="请输入被访人"
          required
          label-width="5em"
          v-model="os.interviewees"
        />
      </x-content>
      <x-content>
        <van-field
          label="事由"
          placeholder="请选择事由"
          input-align="right"
          right-icon="arrow"
          readonly
          required
          label-width="5em"
          v-model="a.name"
          @click="open3 = !open3"
        />
      </x-content>
      <x-content v-if="a.value === 0">
        <van-field
          label=""
          placeholder="请输入事由"
          label-width="5em"
          v-model="os.other"
        />
      </x-content>
      <x-content>
        <van-field label="体温" label-width="5em" input-align="right">
          <template #button>
            <van-stepper
              v-model="os.temperature"
              min="34"
              max="40"
              step="0.1"
              :decimal-length="1"
              input-width="5em"
            />
          </template>
        </van-field>
      </x-content>
      <!-- <x-content>
        <van-field
          label="离园时间"
          placeholder="请选择预计离园时间"
          input-align="right"
          right-icon="arrow"
          readonly
          required
          label-width="5em"
          v-model="os.departure_time"
          @click="open4 = !open4"
        />
      </x-content> -->
      <x-content>
        <van-field
          rows="2"
          autosize
          label="备注"
          type="textarea"
          maxlength="255"
          placeholder="请输入备注"
          show-word-limit
          v-model="os.remarks"
        />
      </x-content>
      <x-content></x-content>
      <div class="app_bottom tran">
        <van-button
          block
          round
          :color="$js.btnColor"
          @click="onsub"
          :disabled="disabled"
          >提交</van-button
        >
      </div>
    </template>
    <template v-else>
      <van-empty description="请使用微信扫码进入" image="error"></van-empty>
      <div class="qrcode">
        <div id="qr-code-visit"></div>
      </div>
    </template>
    <template #fixed>
      <!-- <v-f v-model="open" :footer="false" cover :header="false"></v-f> -->
      <v-t v-model="os.date" :open="open1" ymd max="m_6"></v-t>
      <v-t v-model="os.admission_time" :open="open2" type="time"></v-t>
      <v-s v-model="a" :list="other" :open="open3"></v-s>
    </template>
  </v-view>
</template>

<script>
import vF from "../private/fixed.vue";
import vT from "../private/time.vue";
import vS from "../private/select.vue";
export default {
  data() {
    return {
      wx: {},
      qr: "",
      os: {
        date: "",
        admission_time: "",
        full_name: "",
        id_number: "",
        interviewees: "",
        subject_matter: "4",
        other: "",
        telephone: "",
        temperature: 36.5,
        departure_time: "",
        remarks: "",
        openid: "",
      },
      open: !false,
      open1: false,
      open2: false,
      open3: false,
      open4: false,
      a: {},
      other: ["其他", "参观", "学习", "交流"]
        .map((s, v) => {
          return { name: s, value: v };
        })
        .reverse(),
      disabled: false,
      openid: "",
    };
  },
  components: { vF, vT, vS },
  methods: {
    onview(e) {
      this.wx = e.wx;
    },
    init() {
      /* eslint-disable */
      let params = demo.getUrl();
      if (params.code) {
        let t = demo.timeout("", "array");
        this.os.date = [t[0], t[1], t[2]].join("-");
        this.os.admission_time = [t[3], t[4]].join(":");
        this.$api.http("openid", { type: 1, js_code: params.code }, (r) => {
          try {
            this.openid = r.openid;
          } catch (e) {
            console.log("err", e);
          }
        });
      } else {
        this.$js.wxcode("visit");
      }
    },
    openqr() {
      this.qr = this.$js.def.qrcode.info();
      this.$nextTick(() => {
        // eslint-disable-next-line
        new QRCode(demo.$.id("qr-code-visit"), {
          text: this.qr,
          width: 200,
          height: 200,
        });
      });
    },
    onsub() {
      this.$toast.loading();
      this.disabled = true;

      if (this.a.value > 0) {
        this.os.subject_matter = this.a.value;
        if (this.os.other === "") {
          this.os.other = this.a.name;
        }
      }
      this.os.openid = this.openid;
      this.$api.http("visitset", this.os, () => {
        this.$toast.clear();
        this.$toast("提交成功");
        this.os = {
          date: "",
          admission_time: "",
          full_name: "",
          id_number: "",
          interviewees: "",
          subject_matter: "4",
          other: "",
          telephone: "",
          temperature: 36.5,
          departure_time: "",
          remarks: "",
          openid: "",
        };
        // this.open = true;
        setTimeout(() => {
          this.disabled = false;
        }, 500);
      });
    },
  },
  mounted() {
    // eslint-disable-next-line
    let wx = demo.es6().isWx();
    if (!wx) {
      this.openqr();
      return this.$toast("请使用微信扫码打开");
    } else {
      this.init();
    }
  },
};
</script>
<style lang='less' scoped>
.qrcode {
  width: 200px;
  height: 200px;
  margin: 0 auto;
}
</style>
