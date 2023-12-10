<template>
  <div class="atten_map">
    <div class="map" id="map-clock-atten"></div>
    <div class="left_menu">
      <div class="tap" @click="zoom++"><van-icon name="plus" /></div>
      <div class="tap" @click="zoom--"><van-icon name="minus" /></div>
      <div class="tap" @click="setCenter"><van-icon name="wap-home" /></div>
      <div class="tap" @click="setuserCenter"><van-icon name="location" /></div>
      <div class="tap" @click="init"><van-icon name="replay" /></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: null,
    uc: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      lng: "",
      lat: "",
      radius: 0,
      map: null,
      amap: null,
      usercenter: [],
      zoom: 15,
    };
  },
  computed: {
    i: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    center() {
      return [this.lng, this.lat];
    },
  },
  watch: {
    i: {
      handler(v) {
        this.$emit("input", v);
      },
      deep: true,
    },
    zoom() {
      this.zooms();
    },
    uc: {
      handler(e) {
        this.setUc(e);
      },
      deep: true,
    },
  },
  methods: {
    setUc(e = []) {
      if (e.length === 2) {
        if (this.map) {
          this.usercenter = e;
          this.setuserCenter();
        } else {
          setTimeout(() => {
            this.setUc(e);
          }, 300);
        }
      }
    },
    zooms() {
      if (this.amap) {
        this.amap.setZoom(this.zoom);
      }
    },
    setCenter() {
      if (this.center.length && this.map) {
        this.map.center(this.center[0], this.center[1]);
        this.zoom = 18;
      }
    },
    setuserCenter() {
      if (this.usercenter.length && this.map) {
        // console.log(this.map.option);
        // 创建点
        this.map.circleDel("circle_user");
        this.map.circle({
          lng: this.usercenter[0],
          lat: this.usercenter[1],
          type: "circle_user",
          iconName: "a1",
          pointer: true,
        });
        this.map.center(this.usercenter[0], this.usercenter[1]);
        this.zoom = 18;
        this.usercenter = [];
      } else {
        // 获取
        this.$js.wxshare({}, "geo", (r) => {
          // 创建地图
          if (!(r.lng && r.lat)) {
            return this.$toast("定位错误，请重试");
          }
          this.usercenter = [r.lng, r.lat];
          // lng 104.00405
          // lat 30.636559
          this.setuserCenter();
        });
      }
    },
    init() {
      this.$api.http("clockinfo", {}, (r) => {
        this.lng = r.longitude;
        this.lat = r.latitude;
        this.radius = r.distance;
        let path = this.center;

        // eslint-disable-next-line
        this.map = new demo.$map(
          "map-clock-atten",
          {
            layer: false,
            zoom: 15,
            icons: [
              {
                name: "a1",
                offset: [-20, -31],
                // eslint-disable-next-line
                icon: demo.siteConfig.icon("mapcircle", "private"),
                type: "circle",
              },
            ],
          },
          (e) => {
            this.amap = e.data.map;

            this.map.center(path[0], path[1]);
            this.zoom = 18;
            // 创建点
            this.map.circleDel("circle");
            this.map.circle({ lng: path[0], lat: path[1], type: "circle" });
            // 圆环
            this.map.circular(
              { lng: path[0], lat: path[1], radius: this.radius },
              (ee) => {
                this.map.circularEnd({ id: ee.data.id });
              }
            );

            this.$nextTick(() => {
              this.setUc(this.uc);
            });
          }
        );
      });
    },
  },
  mounted() {
    this.i = this.value;
    this.init();
  },
};
</script>
<style lang='less' scoped>
.atten_map,
.map {
  height: 100%;
  position: relative;
  z-index: 30;
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
</style>
