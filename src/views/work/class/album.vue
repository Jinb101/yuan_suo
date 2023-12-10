<template>
  <v-view header :text="childid ? '宝贝相册' : ''">
    <template #menu>
      <span v-if="childid" @click="open = true">更换宝宝</span>
    </template>
    <template v-if="childid">
      <!-- <div class="app_top">
        <van-cell
          title="选择学期"
          is-link
          @click="open2 = true"
          :value="yeartext"
        ></van-cell>
      </div> -->
      <v-page ref="page" @on-page="onPage">
        <van-empty v-if="!item.length"></van-empty>
        <section v-for="(i, j) in item" :key="j">
          <van-cell
            :title="i.time"
            :value="i.age"
            @click="onedit(i)"
          ></van-cell>
          <div class="list">
            <div class="i" v-for="(x, y) in i.list" :key="y + '-' + j">
              <span class="close" @click.stop="ondelimgs(y, j)"
                ><van-icon name="cross"></van-icon
              ></span>
              <van-image
                :src="x.picture"
                fit="cover"
                @click.stop="appShowImage(i.list, y, 'picture')"
              ></van-image>
            </div>
          </div>
        </section>
      </v-page>
      <div class="app_btn_add b20" @click="open1 = true">
        <div class="add_cover"><van-icon name="plus" /></div>
        <p>添加</p>
      </div>
    </template>
    <template v-else>
      <van-empty description="请先选择宝宝">
        <van-button
          :color="$js.btnColor"
          @click="open = true"
          round
          block
          size="small"
          class="a_btn"
          >点击选择宝宝</van-button
        >
      </van-empty>
    </template>
    <template #fixed>
      <v-f v-model="open" :footer="false" cover text="选择宝宝">
        <template #menu>
          <v-cs v-model="cls"></v-cs>
        </template>
        <v-c
          :cid="cls.id + ''"
          v-model="childid"
          @change="onchangechild"
          @list="onlistchild"
        ></v-c>
        <div class="w80">
          <van-button block round :color="$js.btnColor" @click="open3 = true"
            >添加相册/自动识别</van-button
          >
        </div>
      </v-f>
      <v-f v-model="open1" :footer="false" :text="ext1.$edit ? '编辑' : '发布'">
        <v-a
          :ext="ext1"
          :cid="childid"
          @end="onPage(1)"
          :list="childitem"
        ></v-a>
      </v-f>
      <v-f v-model="open2" :footer="false" text="选择学期">
        <v-y v-model="ext2" @change="onPage(1)"></v-y>
      </v-f>
      <v-f v-model="open3" :footer="false" text="添加至相册">
        <v-a :cid="cls.id" :api="false" @sub="onsuball"></v-a>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
import vC from "./_class_roster.vue";
import vCs from "../../private/select_class.vue";
import vA from "./_album_add.vue";
import vY from "./_album_year.vue";
export default {
  data() {
    return {
      open: false, // 选择宝宝
      open1: false, // 发布/编辑
      open2: false, // 选择学期
      open3: false, // 自动添加
      cls: {},
      childid: "",
      item: [],
      ext1: {},
      ext2: {},
      childitem: [],
    };
  },
  computed: {
    yeartext() {
      if (this.ext2.year) {
        return [
          this.ext2.year,
          "年",
          this.ext2.semester === 1 ? "春" : "秋",
          "季学期",
        ].join("");
      }
      if (this.ext2.start_time) {
        return [this.ext2.start_time, this.ext2.end_time].join("~");
      }
      return "";
    },
  },
  watch: {
    open1(n) {
      if (!n) {
        this.ext1 = {};
      }
    },
    open3(n) {
      this.open = false;
      if (!n && !this.childid) {
        this.open = true;
      }
    },
  },
  inject: ["appPath", "appShowImage"],
  components: { vF, vC, vCs, vA, vY },
  methods: {
    onsuball(e) {
      this.$api.http("albumadds", e, () => {
        this.open3 = false;
        this.open = true;
        this.$toast("添加成功");
      });
    },
    ondelimgs(j, y) {
      this.$js.modeldel(() => {
        let list = this.item[y].list;
        let data = list[j];
        let os = {
          term_album_id: this.item[y].id,
          term_album_picture_id:
            list.length > 1 ? [data.term_album_picture_id] : [],
          child_id: data.child_id,
        };
        this.$api.http("albumdel", os, () => {
          this.$toast("删除成功");
          this.item[y].list = list.filter((r) => {
            return r.term_album_picture_id !== data.term_album_picture_id;
          });
          if (this.item[y].list.length < 1) {
            this.item.splice(y, 1);
          }
        });
      });
    },
    onadd(e) {
      this.ext1 = { $disable: true, years: e.years };
      this.open1 = true;
    },
    onedit(e) {
      this.ext1 = { ...e, $edit: true, $disable: true };
      this.open1 = true;
    },
    onchangechild(n) {
      this.open = false;
      if (n) {
        this.appPath("/work_album/" + n, true);
      } else {
        this.appPath("/work_album", true);
      }
      this.onPage(1);
    },
    onlistchild(e) {
      this.childitem = e;
    },
    onPage(page, f) {
      this.open = false;
      this.open1 = false;
      this.open2 = false;
      if (!f) {
        return this.$refs.page && this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      let os = {
        end_time: "",
        semester: "",
        start_time: "",
        year: "",
        child_id: this.childid,
        page,
        ...this.ext2,
      };
      this.$api.http("album", os, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        let es = e.map((s) => {
          let thumb = s.term_album_picture || [];
          let list = thumb.map((k) => {
            let index = k.picture.split("/uploads/")[1];
            k.src = "/uploads/" + index;
            return k;
          });
          let os = {
            time: s.years,
            age: s.age,
            id: s.id,
            list,
          };
          return os;
        });
        es = es.filter((r) => {
          return r.list.length > 0;
        });
        this.item = this.item.concat(es);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
  },
  mounted() {
    let params = this.$route.params;
    if (params.id) {
      this.childid = params.id;
      this.onchangechild(this.childid);
    }
    this.open = this.childid === "";
  },
};
</script>
<style lang='less' scoped>
.a_btn {
  min-width: 100px;
}
section {
  margin: 8px 8px 0;
  box-sizing: border-box;
  position: relative;
  font-size: 15px;
  .van-cell {
    background: transparent;
  }
  .list {
    padding: 15px 0;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    .i {
      width: 119px;
      height: 119px;
      box-sizing: border-box;
      padding: 1px;
      position: relative;
    }
    .close {
      position: absolute;
      right: 1px;
      top: 1px;
      width: 24px;
      height: 24px;
      display: flex;
      font-size: 18px;
      justify-content: center;
      color: #fff;
      background-color: tomato;
      z-index: 5;
      border-radius: 0 0 0 100%;
      overflow: hidden;
    }
  }
}
</style>
