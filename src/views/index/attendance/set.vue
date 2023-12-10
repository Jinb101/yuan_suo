<template>
  <v-view header bgc="#f8f7fa" index="500">
    <van-cell
      title="上班时间(入园)"
      is-link
      :value="os.work_hours"
      @click="open1 = !open1"
    ></van-cell>
    <van-cell
      title="下班时间(离园)"
      is-link
      :value="os.closing_time"
      @click="open2 = !open2"
    ></van-cell>
    <van-cell
      title="旷工时间"
      label="设定时间未打卡视为旷工"
      is-link
      :value="os.absenteeism_time"
      @click="open3 = !open3"
    ></van-cell>
    <van-field
      v-model="os.distance"
      type="number"
      label="打卡距离(半径)"
      label-width="12em"
      placeholder="请输入打卡半径"
    >
      <template #button> 米 </template>
    </van-field>
    <van-cell
      title="打卡地址(点击地图选点)"
      is-link
      @click="open6 = true"
    ></van-cell>
    <div class="btn">
      <van-button block round :color="$js.btnColor" @click="onsavesys"
        >保存设置</van-button
      >
    </div>
    <template #fixed>
      <v-t v-model="os.work_hours" :open="open1" type="time"></v-t>
      <v-t v-model="os.closing_time" :open="open2" type="time"></v-t>
      <v-t v-model="os.absenteeism_time" :open="open3" type="time"></v-t>
      <v-f :footer="false" text="选择打卡地址" v-model="open6">
        <template #menu>
          <span @click="onsubmap">确定选择</span>
        </template>
        <div class="map">
          <div class="search_map">
            <v-s v-model="search" @search="onchangemap" unauto></v-s>
          </div>
          <div class="search_list" v-if="searchlist.length > 0">
            <van-cell
              v-for="(x, y) in searchlist"
              :key="y + 's'"
              :title="x.title || x.name"
              :label="x.address"
              @click="onchangeaddress(x)"
              is-link
            ></van-cell>
          </div>
          <div class="left_menu">
            <div class="tap" @click="zoom++"><van-icon name="plus" /></div>
            <div class="tap" @click="zoom--"><van-icon name="minus" /></div>
            <div class="tap" @click="setuserCenter">
              <van-icon name="location" />
            </div>
          </div>
          <div id="map-clock-atten-set" class="amap_box"></div>
        </div>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vT from "../../private/time.vue";
import vF from "../../private/fixed.vue";
import vS from "../../private/search.vue";
export default {
  data() {
    return {
      ext: {},
      os: {
        work_hours: "",
        closing_time: "",
        absenteeism_time: "",
        longitude: "",
        latitude: "",
        distance: "",
      },
      open1: false,
      open2: false,
      open3: false,
      open6: false,
      map: null,
      amap: null,
      zoom: 15,
      search: "",
      radius: 50,
      searchlist: [],
    };
  },
  watch: {
    open6(n) {
      if (n) {
        this.$nextTick(() => {
          this.mapinit();
        });
      } else {
        this.clearmap();
      }
    },
    zoom() {
      this.zooms();
    },
  },
  components: { vT, vF, vS },
  methods: {
    onsavesys() {
      this.$api.http("clockset", this.os, () => {
        this.$toast("考勤设置已变更");
      });
    },
    onsubmap() {
      let path = this.amap.getCenter();
      this.os.longitude = path.lng;
      this.os.latitude = path.lat;
      this.$toast("已选中，请点击保存");
      this.$nextTick(() => {
        this.open6 = false;
      });
    },
    zooms() {
      if (this.amap) {
        this.amap.setZoom(this.zoom);
      }
    },
    setuserCenter() {
      this.setcenter([this.os.longitude, this.os.latitude]);
    },
    onchangemap(e) {
      if (!this.search) {
        return this.$toast("请输入");
      }
      if (this.map) {
        this.map.poi({ search: this.search }, (e) => {
          if (e.code) {
            let ext = e.data || {};
            let list = ext.list || [];
            this.searchlist = list;
            try {
              this.setcenter([ext.list[0].lng, ext.list[0].lat]);
            } catch (err) {
              console.log(err);
            }
          } else {
            this.$toast("搜索次数上限,请第二天重试");
          }
        });
      }
    },
    onchangeaddress(e) {
      this.setcenter([e.lng, e.lat]);
      this.searchlist = [];
    },
    clearmap() {
      if (this.amap && this.amap.destroy) {
        this.amap.destroy();
      }
      this.amap = null;
      this.map = null;
    },
    setcenter(path) {
      if (this.map) {
        this.map.center(path[0], path[1]);
        // 创建点
        this.map.circleDel("circle");
        this.map.circle({ lng: path[0], lat: path[1], type: "circle" });
        // 圆环
        this.map.circularDelAll();
        this.map.circular(
          { lng: path[0], lat: path[1], radius: this.radius },
          (ee) => {
            this.map.circularEnd({ id: ee.data.id });
          }
        );
      }
    },
    mapinit() {
      // eslint-disable-next-line
      this.map = new demo.$map(
        "map-clock-atten-set",
        {
          layer: false,
          zoom: 15,
        },
        (e) => {
          this.amap = e.data.map;
          this.zoom = 18;

          this.amap.on("click", (e) => {
            let p = [e.lnglat.getLng(), e.lnglat.getLat()];
            this.setcenter(p);
          });
          if (this.os.longitude === "" || this.os.latitude === "") {
            this.geo((r, s) => {
              this.setcenter([r, s]);
            });
          } else {
            this.setcenter([this.os.longitude, this.os.latitude]);
          }
        }
      );
    },
    geo(callback) {
      // eslint-disable-next-line
      if (demo.es6().isWx()) {
        this.$js.wxshare({}, "geo", (r) => {
          // 创建地图
          if (!(r.lng && r.lat)) {
            return this.$toast("定位错误，请重试");
          }
          // lng 104.00405
          // lat 30.636559
          if (callback) {
            callback(r.lng, r.lat);
          }
        });
      }
    },
    init() {
      this.$api.http("clockinfo", { type: 2 }, (r) => {
        this.ext = r;
        this.os = {
          work_hours: [r.first_hour, r.first_minute].join(":"),
          closing_time: [r.second_hour, r.second_minute].join(":"),
          absenteeism_time: [r.half_day_hour, r.half_day_minutes].join(":"),
          longitude: r.longitude,
          latitude: r.latitude,
          distance: r.distance,
        };
        this.radius = r.distance || 50;
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.map {
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  .amap_box {
    width: 100%;
    height: 100%;
  }
  .search_map {
    position: absolute;
    left: 0;
    bottom: 10px;
    width: 100%;
    z-index: 50;
  }
}
.left_menu {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 40px;
  z-index: 35;
  .tap {
    width: 40px;
    height: 40px;
    margin-bottom: 10px;
    border-radius: 10px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }
}
.search_list {
  position: absolute;
  left: 10px;
  width: calc(100% - 60px);
  z-index: 55;
  max-height: 60%;
  overflow-y: scroll;
  top: 10px;
}
.btn {
  margin: 30px auto;
  width: 70%;
}
</style>
