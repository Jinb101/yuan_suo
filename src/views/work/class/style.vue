<template>
  <v-view header
          text="班级风采"
          bgc="#f5f5f5">
    <template #menu>
      <v-c v-model="cls"
           @created="init"></v-c>
    </template>
    <div class=" page"
         :style="active > 0 ? { height: '100%' } : {}">
      <van-checkbox-group v-model="checked"
                          shape="square">
        <van-tabs v-model="active">
          <van-tab title="相处">
            <div v-for="img in list"
                 :key="img.class_style_id"
                 class=" imgs">
              <img :src="img.picture"
                   alt="">
              <div
                   style=" height: 100%; width: 40%; display: flex; justify-content: end; align-items: center;padding-right: 1em;">
                <van-checkbox :name="img"></van-checkbox>
              </div>
            </div>
          </van-tab>
          <van-tab title="视频">
            <div class=" video"
                 v-if="videoData.length > 0">
              <VidePlay :src="videoSrc"></VidePlay>
            </div>
          </van-tab>
        </van-tabs>
      </van-checkbox-group>
      <div class=" btn"
           v-if="active === 0">
        <van-button :disabled="checked.length === 0"
                    plain
                    @click="delStyle"
                    type="warning"
                    round>删除</van-button>
        <van-button plain
                    to="/add_work_style"
                    type="primary"
                    round>新增</van-button>
      </div>
    </div>
  </v-view>
</template>

<script>
import vC from "../../private/select_class.vue";
import * as seleApi from 'public/api/selfApi.js'
import VidePlay from '../../../components/video/VideoPay.vue'
export default {
  data() {
    return {
      cls: {},
      active: 0,
      list: [],
      videoSrc: '',
      videoData: [],
      // 选中对象
      checked: [],
    };
  },
  inject: ["appPath"],
  components: { vC, VidePlay },
  watch: {
    "cls.id"() {
      this.init();
    },
    active() {
      this.init();
    },
  },
  methods: {
    async init() {
      const { data } = await seleApi.post('classEle', { class_id: this.cls.id, class_type: this.active + 1 })
      if (this.active === 0) {
        this.list = data;
      } else if (this.active === 1) {
        this.videoData = data;
        this.videoSrc = data[0].picture;
      }
    },
    async delStyle() {
      try {
        this.$js.modeldel(() => {
          const classStyleIds = this.checked.map((item) => item.class_style_id).join(',');

          seleApi.post('delClassEle', { class_id: this.cls.id, class_style_id: classStyleIds });
          this.$toast("删除成功");
        }, '相处图片');
      } catch (error) {

      }
    },
  },
  mounted() {
  },
};

</script>
<style lang="less" scope>
.page {
  height: 90%;
  width: 100%;
  overflow-y: auto;
  background-color: white;
}

.imgs {
  height: 3rem;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(128, 128, 128, 0.295);

  img {
    height: 3rem;
    width: 3rem;
  }
}

.btn {
  position: absolute;
  width: 100%;
  height: 10%;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: white;
  border-top: 1px solid rgba(128, 128, 128, 0.295);
}

.video {
  height: 100%;
  width: 100%;
  padding: 10px 0;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
