<template>
  <v-view header
          bgc="#f7f7f7">
    <template #menu>
      <span @click="open3 = true">添加</span>
    </template>
    <v-page ref="page"
            @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section v-for="(i, j) in item"
               :key="j"
               class="flex"
               @click.stop="ondetail(i)">
        <div class="logo"
             @click.stop="appShowImage(i.picture)">
          <van-image :src="i.picture"
                     lazy-load
                     fit="cover"></van-image>
        </div>
        <div class="f1">
          <div class="van-ellipsis">{{ i.describe }}</div>
          <p class="time">发表时间：{{ appTimeout(i.create_time, true) }}</p>
          <div class="btn">
            <van-button v-for="(x, y) in toTag(i, j)"
                        :key="y + 'c' + j"
                        size="small"
                        :type="x.col"
                        plain
                        @click.stop="onTagChange(x)">
              {{ x.text }}
            </van-button>
          </div>
        </div>
        <div class="tag">
          <v-more :item="toTag(i, j)"
                  @change="onTagChange"
                  v-model="i.open"></v-more>
        </div>
      </section>
    </v-page>
    <template #fixed>
      <v-f :footer="false"
           v-model="open"
           text="编辑轮播图"
           :index="501">
        <v-a edit
             v-model="os"
             @save="oneditbanner"
             ref="edit"></v-a>
        <div class="h80"></div>
        <div class="w80">
          <van-button block
                      :color="$js.btnColor"
                      round
                      @click="$refs.edit.save()">编辑</van-button>
        </div>
      </v-f>
      <v-f :footer="false"
           v-model="open2"
           text="查看轮播图"
           :index="500">
        <v-d v-model="showext"></v-d>
      </v-f>
      <v-f :footer="false"
           v-model="open3"
           text="添加轮播图"
           :index="502">
        <v-a ref="add"
             @save="onaddbanner"></v-a>
        <div class="h80"></div>
        <div class="w80">
          <van-button block
                      :color="$js.btnColor"
                      round
                      @click="$refs.add.save()">添加</van-button>
        </div>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
import vA from "./add.vue";
import vD from "./det.vue";
export default {
  data() {
    return {
      item: [],
      open: false,
      open2: false,
      open3: false,
      os: {},
      showext: {},
    };
  },
  components: { vF, vD, vA },
  inject: ["appTimeout", "appShowImage"],
  methods: {
    onaddbanner(e) {
      let os = {
        describe: e.title || "新的",
        picture: e.pic,
        content: e.text,
        sort: 1,
      };
      this.$api.http("banneradd", os, () => {
        this.$toast("添加成功");
        this.open3 = false;
        this.onPage(1);
      });
    },
    oneditbanner(e) {
      let os = {
        describe: e.title || "新的",
        picture: e.pic,
        content: e.text,
        sort: this.os.sort,
        id: this.os.id,
      };
      this.$api.http("banneredit", os, () => {
        this.$toast("编辑成功");
        this.open = false;
        this.onPage(1);
      });
    },
    toTag(e, index) {
      // eslint-disable-next-line
      return demo.siteConfig.text.tag([1, 5], { index, ext: e });
    },
    onTagChange(e) {
      let ext = e.ext;
      switch (e.type) {
        case "edit":
          this.$api.http("bannerdet", { banner_id: ext.id }, (r) => {
            this.os = {
              content: r.content,
              id: r.id,
              title: r.describe,
              images: r.pictures,
              image: r.picture,
              sort: r.sort,
            };
            this.open = true;
          });
          break;
        default:
          this.$js.modeldel(() => {
            this.$api.http("bannerdel", { banner_id: ext.id }, () => {
              this.$toast("删除成功");
              this.item.splice(e.index, 1);
            });
          });
      }
    },
    ondetail(e) {
      this.showext = e;
      this.open2 = true;
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("banner", { page }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(
          e.map((s) => {
            s.open = false;
            return s;
          })
        );
        this.$refs.page.onFinish(e.length < 20);
      });
    },
  },
  mounted() { },
};
</script>
<style lang='less' scoped>
section {
  background-color: #fff;
  position: relative;
  margin: 10px;
  font-size: 15px;
  border-radius: 30px 0;
  overflow: hidden;

  .logo {
    height: 70px;
    width: 100px;
  }

  .f1 {
    width: calc(100% - 100px);
    box-sizing: border-box;
    padding-left: 10px;
  }

  .van-ellipsis {
    font-weight: 650;
    padding: 8px 0;
    padding-right: 40px;
  }

  .time {
    font-size: 12px;
    color: #ccc;
    margin-bottom: 5px;
  }

  .tag {
    position: absolute;
    right: 15px;
    top: 5px;
  }

  .btn {
    padding: 5px 20px 8px 0;
    height: 32px;
    text-align: right;

    .van-button {
      margin-left: 5px;
      min-width: 60px;
    }
  }
}

.h80 {
  height: 50px;
}
</style>
