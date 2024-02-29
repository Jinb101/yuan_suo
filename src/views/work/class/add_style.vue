<template>
  <v-view header
          text="班级风采"
          bgc="#f5f5f5">
    <template #menu>
      <v-c v-model="cls"
           @created="init"></v-c>
    </template>

    <van-field label="发布类型"
               readonly>
      <template #button>
        <van-radio-group v-model="radio"
                         direction="horizontal">
          <van-radio name="1">图文</van-radio>
          <van-radio name="2">视频</van-radio>
        </van-radio-group>
      </template>
    </van-field>

    <div class="emoji_class_box">
      <div class="class_upload flex fw">
        <template v-if="+radio === 1">
          <van-cell title="添加图片" />
          <!-- <van-cell title="添加图片" label="最大限制 30 张" /> -->
          <v-uploads v-model="pio">
            <div class="pic">
              <v-upload more
                        @on-loading="onImagePath"
                        @on-path="onImagePath"></v-upload>
            </div>
          </v-uploads>
        </template>
        <template v-else>
          <van-cell title="添加视频"
                    label="横屏拍摄效果佳!视频最长30秒" />
          <v-upload-once class="pic2"
                         type="video"
                         v-model="vio"></v-upload-once>
        </template>
      </div>
    </div>

    <div class="submit_btn">
      <van-button block
                  round
                  :color="$js.btnColor"
                  @click="onSub">发布</van-button>
    </div>

  </v-view>
</template>

<script>
import vC from "../../private/select_class.vue";
import * as seleApi from 'public/api/selfApi.js'
export default {
  data() {
    return {
      cls: {},
      radio: "1",
      pio: [],
      vio: {},
    };
  },
  inject: ["appPath"],
  components: { vC },
  watch: {
    "cls.id"() {
      // this.init();
    },
  },
  methods: {
    init() {

    },
    onImagePath(e, v) {
      this.pio = v;
    },
    onSub() {
      let curUrl = ''
      if (this.radio === '1') {
        if (this.pio.length === 0) {
          this.$toast('请上传图片')
          return
        }
      } else if (this.radio === '2') {
        if (!this.vio.src) {
          this.$toast('请上传视频')
          return
        }
      }
      console.log(this.pio, this.vio);
      let curData = {
        class_id: this.cls.id,
      }
      if (this.radio === '1') {
        curData.picture = this.pio.map(item => item.src).join(',')
      } else {
        curData.picture = this.vio.src
      }
      curUrl = this.radio === '1' ? 'addEleImg' : 'addEleVideo'
      console.log(this.radio, curUrl);
      console.log(this.vio, seleApi, seleApi.post);
      seleApi.post(curUrl, curData).then(res => {
        console.log(res);
        this.$toast('发布成功')
        this.vio = {}
        this.pio = []
        this.$router.go(-1)
      }).catch(err => {
        console.log(err);
      })
    },
  },
  mounted() {

  },
};
</script>
<style lang='less' scoped>
.emoji_class_box {
  padding: 8px;
  background-color: white;

  .class_upload {
    padding: 6px;
    margin-bottom: 10px;

    >.van-cell {
      margin-bottom: 10px;
    }
  }

  .pic {
    width: 100px;
    height: 100px;
  }

  .pic2 {
    width: 160px;
    height: 90px;
  }

  .emoji_change {
    max-height: 300px;
    padding-bottom: 10px;
    box-sizing: border-box;
  }
}

.submit_btn {
  margin: 40% 15% 30px;
}
</style>
