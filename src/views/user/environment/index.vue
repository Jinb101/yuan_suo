<template>
  <v-view header>
    <template #menu>
      <span @click="appPath('/environment_my')">我的环创</span>
    </template>
    <div class="app_top" v-if="tab.length > 0">
      <van-tabs v-model="type" title-active-color="#38f" @click="ontab">
        <van-tab
          :title="i.title"
          :name="i.id + ''"
          v-for="(i, j) in tab"
          :key="j"
        ></van-tab>
      </van-tabs>
    </div>
    <template v-if="list.length">
      <x-content v-for="(i, j) in list" :key="j + 'c'">
        <van-cell is-link @click="ondetail(i.id)">
          <template #title>
            <span class="bold">{{ i.title }}</span>
          </template>
        </van-cell>
        <template v-if="i.children && i.children.length">
          <div class="menus flex fw">
            <div
              class="menu"
              v-for="(x, y) in i.children"
              :key="y + 'd' + j"
              @click.stop="ondetail(x.id)"
            >
              <div class="logo">
                <van-image :src="x.icon" fit="cover"></van-image>
              </div>
              <p>{{ x.title }}</p>
            </div>
          </div>
        </template>
      </x-content>
    </template>
    <van-empty v-else description="暂无环创"></van-empty>
    <template #fixed>
      <v-f v-model="open" :footer="false" text="环创广场">
        <v-v :ids="id"></v-v>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
import vV from "./list.vue";
export default {
  data() {
    return {
      tab: [],
      type: "",
      list: [],
      id: "",
      open: false,
    };
  },
  watch: {
    open(n) {
      if (!n) {
        this.appPath("/environment/" + this.type, true);
      }
    },
  },
  components: { vF, vV },
  inject: ["appPath"],
  methods: {
    ondetail(id) {
      this.id = id;
      this.appPath("/environment/" + this.type + "&" + id, true);
      this.open = true;
    },
    ontab() {
      let tp = this.type;
      let index = this.tab
        .map((s) => {
          return +s.id === +tp;
        })
        .indexOf(true);
      this.list = this.tab[index].children || [];
      let id = this.$route.params.id || "";
      if (id) {
        this.ondetail(id);
      } else {
        this.appPath("/environment/" + this.type, true);
      }
    },
  },
  mounted() {
    this.$api.http("environmentify", {}, (r) => {
      // eslint-disable-next-line
      this.tab = demo.tree(r, "id", "pid");
      let type = this.$route.params.type || "";
      if (r.length) {
        this.type = type !== "" ? type : this.tab[0].id + "";
        this.ontab();
      }
    });
  },
};
</script>
<style lang='less' scoped>
.bold {
  font-weight: 650;
}
.menus {
  .menu {
    width: 33.3%;
    box-sizing: border-box;
    padding: 10px 5px;
    font-size: 14px;
    text-align: center;
    color: #999;
    cursor: pointer;
    margin-bottom: 5px;
    > p {
      height: 28px;
    }
    .logo {
      height: 60px;
      margin-bottom: 8px;
      border-radius: 3px;
      overflow: hidden;
    }
  }
}
</style>
