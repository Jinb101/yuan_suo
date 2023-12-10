<template>
  <v-view header @on-view="onView" bgc="#f5f5f5">
    <template #menu>
      <span @click="onsave">保存设置</span>
    </template>
    <transition name="van-slide-down">
      <div class="app_top top" v-if="!searchlist.length">
        <van-field
          v-model="os.contacts"
          label="联系人"
          placeholder="请输入联系人"
          label-width="5em"
        />
        <van-field
          v-model="os.contact"
          label="联系电话"
          placeholder="请输入联系电话"
          label-width="5em"
        />
        <van-field
          v-model="os.localization"
          label="园所地址"
          placeholder="请选择位置"
          label-width="5em"
          rows="3"
          type="textarea"
          readonly
        />
      </div>
    </transition>
    <transition name="van-slide-right">
      <div class="list" v-if="searchlist.length">
        <ul>
          <li
            v-for="(i, j) in searchlist"
            :key="j"
            class="van-ellipsis"
            @click="onlocation(i)"
          >
            <van-icon name="location-o" />{{ i.name }}
          </li>
        </ul>
      </div>
    </transition>
    <div id="map-address" class="map"></div>
    <div class="search">
      <v-s v-model="search" @search="onSearch"></v-s>
    </div>
  </v-view>
</template>

<script>
import vS from "../../private/search.vue";
export default {
  data() {
    return {
      os: {
        contacts: "",
        contact: "",
        longitude: "",
        latitude: "",
        address: "",
        localization: "",
      },
      address: "",
      map: null,
      amap: null,
      path: [],
      search: "",
      searchlist: [],
    };
  },
  components: { vS },
  watch: {
    path: {
      handler(n) {
        if (n.length === 2) {
          this.center(n);
        }
      },
      deep: true,
    },
  },
  methods: {
    onsave() {
      this.$js.model("提示", "是否保存设置", (r) => {
        if (r) {
          this.$api.http("kindergartenaddressset", this.os, () => {
            this.$toast("设置成功");
          });
        }
      });
    },
    onView(e) {
      this.address = (e.config || {}).name || "";
    },
    onSearch() {
      if (this.search === "") return 0;
      this.map.poi({ search: this.search }, (e) => {
        if (e.code) {
          let ext = e.data || {};
          this.searchlist = ext.list || [];
          try {
            this.center([ext.list[0].lng, ext.list[0].lat]);
          } catch (err) {
            console.log(err);
          }
        } else {
          this.$toast("搜索次数上限,请第二天重试");
        }
      });
    },
    onlocation(e) {
      this.path = [e.lng, e.lat];
      this.searchlist = [];
    },
    center(path) {
      this.map.center(path[0], path[1]);
      this.amap.setZoom(15);
      // 创建点
      this.map.circleDel("circle");
      this.map.circle({ lng: path[0], lat: path[1], type: "circle" });
      this.map.address({ path }, (e) => {
        if (e.code) {
          let v = e.data;
          this.os.localization = v.address;
          this.os.longitude = v.path[0];
          this.os.latitude = v.path[1];
          console.log(v);
        }
      });
    },
    async initmap() {
      let ts = this;
      // let c = this.center;
      // eslint-disable-next-line
      // this.map = await demo.map().init("map-address", this.os);

      // eslint-disable-next-line
      ts.map = new demo.$map("#map-address", { layer: [], zoom: 12 }, (e) => {
        ts.amap = e.data.map;
        ts.amap.on("click", function (ss) {
          ts.path = [ss.lnglat.getLng(), ss.lnglat.getLat()];
          ts.search = "";
          ts.searchlist = [];
        });
        if (this.os.longitude > 0 && this.os.latitude > 0) {
          ts.path = [this.os.longitude, this.os.latitude];
        }
      });
    },
    init() {
      this.$api.http("kindergartenaddress", {}, (e) => {
        this.os = {
          contacts: e.contacts,
          contact: e.contact,
          longitude: +e.longitude,
          latitude: +e.latitude,
          address: e.address || this.address,
          localization: e.localization,
        };
        this.initmap();
      });
    },
  },
  mounted() {
    this.init();
  },
  destroyed() {
    this.amap && this.amap.destroy();
  },
};
</script>
<style lang='less' scoped>
.top {
  margin: 5px;
  border-radius: 15px;
  overflow: hidden;
  .van-cell {
    background-color: rgba(255, 255, 255, 0.8);
  }
}
.map {
  position: absolute;
  z-index: 5;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.search {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 60;
}
.list {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 45%;
  z-index: 55;
  font-size: 14px;
  li {
    padding: 5px;
    background: linear-gradient(90deg, rgb(99, 155, 233), rgba(0, 0, 0, 0));
    color: #fff;
    margin-bottom: 5px;
    border-radius: 15px 0 0 15px;
    display: flex;
    align-items: center;
    &:first-child {
      background: linear-gradient(90deg, rgb(146, 248, 209), rgba(0, 0, 0, 0));
    }
  }
}
</style>
