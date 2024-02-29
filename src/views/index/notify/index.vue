<template>
  <v-view header
          text="消息中心">
    <template #menu>
      <span @click="active = '3'"
            class="bold">发通知</span>
      <!-- <span v-if="+active === 1">全部已读</span>
      <span v-else-if="+active === 2">管理</span> -->
    </template>
    <x-content></x-content>
    <div class="tabs">
      <van-tabs v-model="active"
                :color="$js.color"
                :title-active-color="$js.color">
        <van-tab title="接收的通知"
                 name="1"></van-tab>
        <van-tab title="我发的通知"
                 name="2"></van-tab>
        <!-- <van-tab title="发通知" name="3"></van-tab> -->
      </van-tabs>
    </div>
    <v-page @on-page="onPage"
            ref="page">
      <x-content></x-content>
      <template v-for="(i, j) in item">
        <x-content :key="j">
          <div class="line flex van-hairline--bottom"
               @click="detailId = i.id">
            <div class="logo">
              <x-radius center
                        :color="radiusColor(+i.status === 1)"
                        bgc>
                <van-icon name="chat"
                          size="25" />
              </x-radius>
            </div>
            <div class="font">
              <p class="title">{{ i.title }}</p>
              <p class="desc">{{ $js.timeout(i.time, true) }}</p>
            </div>
            <template v-if="+active === 1">
              <span class="status"
                    :class="{ col_danger: +i.status !== 1 }">
                {{ +i.status === 1 ? "已" : "未" }}读
              </span>
            </template>
            <template v-else>
              <span class="status">已读{{ i.read }}人/未读{{ i.unread }}人</span>
            </template>
            <div class="btn"
                 :style="{ background: $js.btnColor }"
                 @click.stop="
                   readId = i.id;
                 iswrite = +i.is_sign === 1;
                 ">
              已读人员
            </div>
            <span class="arrow">
              <van-icon name="arrow"
                        color="#ccc"
                        size="14" />
            </span>
          </div>
        </x-content>
      </template>
    </v-page>
    <template #fixed>
      <!-- 详情 -->
      <transition name="van-slide-left">
        <div class="app_show_fixed"
             v-if="detailId">
          <v-d @on-close="detailId = ''"
               :my="+active === 2"
               :detailid="detailId"></v-d>
        </div>
      </transition>
    </template>
    <v-f :index="560"
         :text="(readType ? '园所' : '家长') + '已读人员'"
         v-model="readId"
         :footer="false"
         bgc="#f8f7fa">
      <template #menu>
        <span @click="readType = !readType"
              class="col_ash bold">{{ readType ? "家长" : "园所" }}已读</span>
      </template>
      <van-empty v-if="!reads.length"
                 description="暂无"></van-empty>
      <section v-for="(i, j) in reads"
               :key="j + 's'"
               class="flex reads van-hairline--bottom">
        <x-radius size="40">
          <van-image :src="i.avatar"
                     lazy-load
                     fit="cover"></van-image>
        </x-radius>
        <div class="font">
          <p class="name">{{ i.nickname || i.name }}</p>
          <p v-if="i.group_name">{{ i.group_name }}</p>
        </div>
        <div class="sign"
             v-if="i.sign">
          <van-image lazy-load
                     :src="i.sign"
                     fit="cover"
                     class="db_image"
                     @click="showImage(i.sign)"></van-image>
        </div>
        <span class="status"
              :class="{ col_danger: !i.sign }"
              v-if="iswrite">{{ i.sign ? "已" : "未" }}签名</span>
      </section>
    </v-f>
  </v-view>
</template>

<script>
// 管理 打开后 显示 复选框 可进行 批量删除 操作
import vD from "./detail.vue";
import vF from "../../private/fixed.vue";
export default {
  data() {
    return {
      active: "1",
      detailId: "",
      readId: "",
      item: [],
      readType: false,
      reads: [],
      iswrite: false,
    };
  },
  watch: {
    active(n) {
      if (+n === 3) {
        this.appPath("/notify_add");
      } else {
        if (this.detailId) {
          return 0;
        }
        this.onPage(1);
      }
    },
    detailId(n) {
      if (n) {
        this.appReplace("/notify/" + n + "&" + this.active);
      } else {
        this.appReplace("/notify");
      }
    },
    readId(n) {
      n && this.onGetReads();
    },
    readType() {
      this.onGetReads();
    },
  },
  inject: ["appPath", "appReplace", "appShowImage"],
  components: { vD, vF },
  methods: {
    showImage(e) {
      this.appShowImage(e);
    },
    // 获取已读
    onGetReads() {
      let api = this.readType ? "noticeUnread1" : "noticeUnread2";
      this.$api.http(api, { notice_id: this.readId, status: "1" }, (res) => {
        this.reads = res;
      });
    },
    radiusColor(flag) {
      if (+this.active === 2) {
        return ["#38f"];
      }
      return flag ? ["#31d4a1", "#7ee5e2"] : ["#ff2b11", "#fdb8b7"];
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page && this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      let api = +this.active === 1 ? "notice" : "noticeMy";
      this.$api.http(api, { page, limit: 20 }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
  },
  mounted() {
    let obj = this.$route.params;
    if (obj.id) {
      this.detailId = obj.id;
      this.active = obj.type;
    }
  },
};
</script>
<style lang='less' scoped>
.tabs {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 33;
}

.line {
  position: relative;

  .status {
    position: absolute;
    right: 18px;
    top: 8px;
    font-size: 12px;
    color: #ccc;
  }

  .arrow {
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  .btn {
    width: 15%;
    position: absolute;
    right: 18px;
    bottom: 8px;
    font-size: 12px;
    padding: 5px 10px;
    border-radius: 5px;
    color: #fff;
  }

  .font {
    width: calc(100% - 50px);
    box-sizing: border-box;
    padding: 4px 8px;
    font-size: 14px;
    color: #999;

    .title {
      font-weight: 650;
      margin-bottom: 3px;
      font-size: 16px;
      color: #333;
      box-sizing: border-box;
      padding-right: 110px;
      line-height: 1.2;
    }

    p {
      padding: 2px 0;
    }
  }
}

.reads {
  padding: 10px;
  background-color: #fff;

  .font {
    font-size: 12px;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    padding-left: 10px;

    .name {
      font-weight: 650;
      font-size: 15px;

      &+p {
        margin-top: 5px;
        color: #999;
      }
    }
  }

  .sign {
    width: 70px;
    background-color: rgb(248, 248, 248);
    box-shadow: 0 0 5px rgb(221, 221, 221) inset;
    margin-right: 5px;
    border-radius: 5px;
    height: 40px;
  }

  .status {
    font-size: 12px;
    color: #999;
  }
}
</style>
