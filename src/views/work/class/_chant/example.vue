<template>
  <div class="chant_example">
    <div class="app_top">
      <van-tabs v-model="search.type" @click="onPage(1)">
        <van-tab title="示范课列表" name="1"></van-tab>
        <van-tab title="我的示范课" name="2"></van-tab>
      </van-tabs>
      <div class="vhi flex">
        <div class="search">
          <v-s v-model="search.title" @search="onPage(1)" unauto></v-s>
        </div>
        <div class="tool_menu" v-if="+search.type === 2" @click="open = !open">
          <van-icon name="filter-o" />筛选
        </div>
      </div>
      <transition name="van-fade">
        <div class="show_top" v-if="open">
          <van-field label="上下架" label-align="4em">
            <template #button>
              <van-radio-group v-model="search.status" direction="horizontal">
                <van-radio name="1">上架</van-radio>
                <van-radio name="2">下架</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field label="状态" label-align="4em">
            <template #button>
              <van-radio-group v-model="search.examine" direction="horizontal">
                <van-radio name="1">待审核</van-radio>
                <van-radio name="2">通过</van-radio>
                <van-radio name="3">驳回</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <div class="btn">
            <van-button block round :color="$js.btnColor" @click="onPage(1)"
              >搜索</van-button
            >
          </div>
        </div>
      </transition>
    </div>
    <div class="app_btn_add" @click="onadd">
      <div class="add_cover"><van-icon name="plus" /></div>
      <p>发布</p>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <ul>
        <li
          v-for="(i, j) in item"
          :key="j"
          class="flex van-hairline--bottom"
          @click.stop="ondet(i.presentation_id)"
        >
          <div class="logo">
            <van-image :src="i.cover"></van-image>
          </div>
          <div class="text">
            <h5>{{ i.title }}</h5>
            <template v-if="+search.type === 1">
              <p class="price" v-if="+i.is_purchase === 1">
                <b class="col_green">已购买</b>
              </p>
              <template v-else>
                <p class="un">原价：￥{{ i.original_price }}</p>
                <p class="price">
                  优惠价：￥<b class="col_danger">{{ i.price }}</b>
                </p>
              </template>
            </template>
            <template v-else>
              <p class="un">原价：￥{{ i.original_price }}</p>
              <p class="price">
                优惠价：￥<b class="col_danger">{{ i.price }}</b>
              </p>
              <p>状态：{{ +i.status === 1 ? "上" : "下" }}架</p>
              <span class="status">
                {{ ["未知", "待审核", "通过", "驳回"][i.examine] }}
              </span>
            </template>
            <p>发布时间：{{ appTimeout(i.create_time, true) }}</p>
            <p>销量：{{ i.sales_volume }}</p>
          </div>
        </li>
      </ul>
    </v-page>
    <v-f v-model="open1" :footer="false">
      <v-add @end="onendadd"></v-add>
    </v-f>
    <v-f v-model="open2" :footer="false">
      <v-det
        :ids="id"
        @end="onPage(1)"
        @close="
          open2 = false;
          onPage(1);
        "
      ></v-det>
    </v-f>
    <v-f v-model="open3" :footer="false" text="我的示范课订单" bgc="#f8f7fa">
      <v-list></v-list>
    </v-f>
  </div>
</template>

<script>
import vS from "../../../private/search.vue";
import vF from "../../../private/fixed.vue";
import vAdd from "./example_add.vue";
import vDet from "./example_det.vue";
import vList from "./example_list.vue";
export default {
  props: {
    child: Boolean,
  },
  data() {
    return {
      item: [],
      search: {
        title: "",
        type: "1",
        status: "",
        examine: "",
      },
      open: false,
      open1: false,
      open2: false,
      params: {},
      id: "",
      reset: false,
      open3: false, // 我的订单
    };
  },
  inject: ["appTimeout", "appPath"],
  watch: {
    open2(n) {
      if (!n && !this.child) {
        this.appPath("/work_chant_video", true);
      }
    },
  },
  components: { vS, vF, vAdd, vDet, vList },
  methods: {
    ondet(id, type) {
      this.id = [id, type || this.search.type].join("_");
      if (!this.child) {
        this.appPath("/work_chant_video/" + this.id, true);
      }
      this.open2 = true;
    },
    onendadd() {
      this.open1 = false;
      if (+this.search.type === 2) {
        this.onPage(1);
      }
    },
    onadd() {
      this.open1 = true;
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page && this.$refs.page.onRefresh();
      }
      this.open = false;
      if (+page === 1) {
        this.item = [];
      }
      if (+this.search.type === 1) {
        this.search.status = "1";
        this.search.examine = "2";
      }
      this.$api.http(
        "chantvideo",
        {
          page,
          ...this.search,
        },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          this.item = this.item.concat(e);
          this.$refs.page.onFinish(e.length < 20);
        }
      );
    },
  },
  mounted() {
    this.params = this.$route.params;
    if (this.params.id && !this.child) {
      let val = (this.params.id + "").split("_");
      this.ondet(val[0], val[1]);
    }
  },
};
</script>
<style lang='less' scoped>
.chant_example {
  .vhi {
    background-color: #fff;
    .search {
      flex: 1;
    }
    .tool_menu {
      padding: 0 30px 0 20px;
      font-size: 14px;
      color: #999;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
  .show_top {
    .btn {
      margin: 10px auto 20px;
      width: 65%;
    }
  }
  li {
    box-sizing: border-box;
    background-color: #fff;
    padding: 10px;
    .logo {
      width: 100px;
      height: 100px;
      margin-right: 10px;
    }
    .text {
      width: calc(100% - 110px);
      font-size: 14px;
      position: relative;
      .status {
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 12px;
        color: #999;
        transform: rotate(25deg);
      }
      h5 {
        padding: 5px 0;
        font-weight: 650;
      }
      p {
        line-height: 1.2;
        margin-top: 5px;
        color: #999;
        b {
          font-weight: 650;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
