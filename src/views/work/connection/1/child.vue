<template>
  <div class="child">
    <template v-if="ext.id">
      <div class="header flex">
        <div class="cover">
          <img :src="covrimg"
               class="db_image"
               alt=""
               style="object-fit: cover" />
        </div>
        <div class="logo">
          <v-a :src="child.base_map"
               :sex="child.gender === '男' ? 1 : 2"></v-a>
        </div>
        <div class="text">
          <h2>
            {{ child.name }} <b>{{ [child.gender, child.age].join(" ") }}</b>
          </h2>
          <p>{{ child.class_name }}</p>
        </div>
      </div>
      <v-page ref="page"
              @on-page="onPage">
        <ul>
          <li v-for="(i, j) in item"
              :key="j"
              @click.stop="oneve(3, i)">
            <div class="h">
              <div class="tag"
                   v-if="i.observation_library"
                   :class="setclass(i.observation_library)">
                {{ i.observation_library.title }}
              </div>
              <div class="f1"></div>
              <div class="status"
                   :class="{ col_green: +i.state === 2 }"
                   v-if="+i.status !== 1">
                家长{{ +i.state === 1 ? "未" : "已" }}读
              </div>
              <div class="status col_ash"
                   v-else>草稿</div>
            </div>
            <h6>
              观察时间<b>{{ appTimeout(i.observation_time) }}</b>
            </h6>
            <h6>
              工作内容<b>{{ i.work }}</b>
            </h6>
            <div class="tool van-hairline--top flex">
              <div class="time">{{ appTimeout(i.create_time) }} 发布</div>
              <div class="btns">
                <span class="col_danger"
                      @click.stop="oneve(0, i)">删除</span>
                <span class="col_warning"
                      @click.stop="oneve(1, i)">编辑</span>
                <span class="col_primary"
                      @click.stop="oneve(2, i)"
                      v-if="+i.status !== 1">分享</span>
              </div>
            </div>
          </li>
          <li class="add"
              @click.stop="adds">
            <van-icon name="add-o" />
            <b>添加观察记录</b>
          </li>
        </ul>
      </v-page>
    </template>
    <van-empty v-else
               description="暂无"></van-empty>
    <v-f v-model="open"
         :footer="false"
         :index="600"
         bgc="#f8f7fa">
      <v-e edit
           v-model="det"
           @end="onendedit"></v-e>
    </v-f>
    <v-f v-model="open3"
         :footer="false"
         :index="601"
         bgc="#f8f7fa">
      <v-e v-model="ext3"
           @end="onPage(1)"></v-e>
    </v-f>
    <v-f v-model="open1"
         :footer="false"
         :index="600"
         text="观察记录"
         bgc="#f8f7fa">
      <v-d v-model="ext2"
           @share="onshare"></v-d>
    </v-f>
  </div>
</template>

<script>
import vA from "../../../private/avatar.vue";
import vE from "./add.vue";
import vD from "./det.vue";
import vF from "../../../private/fixed.vue";
export default {
  props: {
    value: null,
  },
  data() {
    return {
      item: [],
      val: {},
      cls: [
        "bgc_green",
        "bgc_primary",
        "bgc_purple",
        "bgc_info",
        "bgc_warning",
        "bgc_danger",
        "bgc_pink",
      ],
      clstext: [],
      status: false,
      det: {},
      open: false,
      open1: false,
      open3: false,
      params: {},
      ext2: {},
      ext3: {},
      // eslint-disable-next-line
      covrimg: demo.siteConfig.icon("banner1", "player"),
    };
  },
  inject: ["appTimeout", "appPath"],
  computed: {
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(n) {
        this.$emit("input", n);
      },
    },
    child() {
      return { ...this.ext, ...this.val };
    },
  },
  watch: {
    ext: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
    open1(n) {
      if (!n) {
        this.appPath(
          "/connection/" + [this.params.type, this.params.id].join("&"),
          true
        );
      }
    },
  },
  components: { vA, vE, vF, vD },
  methods: {
    adds() {
      this.ext3 = this.child;
      this.open3 = true;
    },
    onshare(e) {
      this.$emit("share", e);
    },
    onendedit() {
      this.onPage(1);
      this.open = false;
    },
    ondet(observe_id) {
      if (this.open1) return 0;
      this.appPath(
        "/connection/" +
        [this.params.type, this.params.id, observe_id].join("&"),
        true
      );
      this.$api.http(
        "contact40det",
        { observe_id, child_id: this.params.id, open_id: "" },
        (r) => {
          this.open1 = true;
          this.ext2 = r;
        }
      );
    },
    oneve(index, i) {
      switch (index) {
        case 0: // 删除
          this.$js.model("删除", "是否删除这条记录？", (r) => {
            if (r) {
              this.$api.http(
                "contact40del",
                { observe_id: i.observe_id },
                () => {
                  this.item = this.item.filter((r) => {
                    return r.observe_id !== i.observe_id;
                  });
                  this.$toast("删除成功");
                  this.status = true;
                }
              );
            }
          });
          break;
        case 1: // 编辑
          this.$api.http(
            "contact40det",
            { observe_id: i.observe_id, child_id: this.ext.id, open_id: "" },
            (r) => {
              if (r.child && !r.child.name) {
                r.child.name = this.child.name;
              }
              this.det = { ...r, $save: +i.status === 1 };
              this.open = true;
            }
          );
          break;
        case 3:
          if (+i.status === 1) {
            this.oneve(1, i);
            return 0;
          }
          this.ondet(i.observe_id);
          break;
        default:
          // 分享一次
          this.onshare({
            ...this.$route.params,
            his: i.observe_id,
          });
          this.$api.http("contact40share", { observe_id: i.observe_id }, () => {
            // this.$toast("分享成功");
          });
        //
      }
    },
    setclass(e = {}) {
      if (!e.title) return "";
      if (this.clstext.indexOf(e.title) < 0) {
        this.clstext.push(e.title);
      }
      let n = this.clstext.indexOf(e.title);
      return this.cls[n] || "";
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "contact40list",
        {
          page,
          child_id: this.ext.id,
          type: 1,
        },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          this.item = this.item.concat(e.list);
          this.val = e.child || {};
          this.$refs.page.onFinish(e.list.length < 20);

          this.$nextTick(() => {
            if (this.params.his) {
              this.ondet(this.params.his);
            }
          });
        }
      );
    },
  },
  mounted() {
    this.params = this.$route.params;
    this.ext = this.value;
  },
  destroyed() {
    if (this.status) {
      this.$emit("end");
    }
  },
};
</script>
<style lang='less' scoped>
.child {
  .header {
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    color: #fff;

    .cover {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      background-color: #38f;
    }

    .logo,
    .text {
      position: relative;
      z-index: 5;
    }

    .text {
      width: calc(100% - 50px);
      box-sizing: border-box;
      padding: 5px 10px;

      h2 {
        font-weight: 650;
        font-size: 16px;
        padding: 5px 0;

        b {
          padding-left: 5px;
          font-size: 14px;
          font-weight: 400;
        }
      }

      p {
        font-size: 14px;
      }
    }
  }

  ul {
    padding-bottom: 130px;
  }

  li {
    padding: 20px 15px 8px;
    background-color: #fff;
    margin-bottom: 8px;
    font-size: 15px;

    .h {
      height: 24px;
      margin-bottom: 15px;
      line-height: 24px;
      display: flex;
      font-size: 14px;

      .tag {
        padding: 0 10px;
        color: #fff;
        line-height: 24px;
      }

      .f1 {
        flex: 1;
      }

      .status {
        color: tomato;
      }
    }

    h6 {
      padding: 5px 0;
      margin-bottom: 3px;
      font-weight: 650;

      b {
        font-weight: 400;
        padding-left: 8px;
        color: #999;
      }
    }

    .tool {
      font-size: 14px;
      align-items: center;

      .btns {
        flex: 1;
        display: flex;
        flex-direction: row-reverse;

        span {
          padding: 15px 0 15px 10px;
          margin-left: 10px;
          cursor: pointer;
        }
      }
    }

    &.add {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      align-items: center;
      justify-content: center;
      padding: 30px 0;
      color: #18bc9c;
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      margin: 0;

      .van-icon {
        font-size: 40px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
