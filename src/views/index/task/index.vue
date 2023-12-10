<template>
  <v-view bar bgc="#f9f9f9" index="499">
    <template #footer>
      <van-tabbar v-model="active">
        <van-tabbar-item v-for="(i, j) in bar" :key="j" :dot="i.num > 0">
          <span>{{ i.text }}</span>
          <template #icon>
            <img :src="$js.config.icon(i.icon, 'index')" alt="" />
          </template>
        </van-tabbar-item>
      </van-tabbar>
    </template>
    <v-t v-model="child" :dot="dot">
      <v-page ref="page" @on-page="onPage">
        <x-content></x-content>
        <van-empty v-if="!item.length"></van-empty>
        <x-content v-for="(i, j) in item" :key="j + 's'">
          <div class="list" @click="onDetail(i)">
            <div class="cover">
              <van-image
                :src="$js.config.icon(202, 'index')"
                class="db_image"
              ></van-image>
            </div>
            <h5>
              <van-tag plain type="primary">任务名称</van-tag
              >{{ i.mission_name }}
            </h5>
            <div class="font">
              <template v-if="+id !== 1">
                <p>
                  <van-tag color="#ffe1e1" text-color="#ad0000"
                    >发布人：</van-tag
                  >
                  {{ i.sender_name }}
                </p>
                <p>
                  <van-tag color="#ffe1e1" text-color="#ad0000"
                    >发布人联系方式：</van-tag
                  >
                  <a :href="'tel:' + toTel(i)" @click.stop>{{ toTel(i) }}</a>
                </p></template
              >
              <p>
                <van-tag color="#ffe1e1" text-color="#ad0000"
                  >发布时间：</van-tag
                >
                {{ i.create_date }}
              </p>
              <p>
                <van-tag color="#ffe1e1" text-color="#ad0000"
                  >结束时间：</van-tag
                >
                {{ i.end_time }}
              </p>
              <template v-if="i.principal_name && +id !== 1">
                <p>
                  <van-tag color="#ffe1e1" text-color="#ad0000"
                    >委托人：</van-tag
                  >
                  {{ i.principal_name }}
                </p>
                <p>
                  <van-tag color="#ffe1e1" text-color="#ad0000"
                    >委托人联系方式：</van-tag
                  >
                  <a :href="'tel:' + i.principal_contact" @click.stop>{{
                    i.principal_contact
                  }}</a>
                </p>
              </template>
              <p v-if="i.budget > 0">
                <van-tag color="#ffe1e1" text-color="#ad0000">预算：</van-tag>
                {{ i.budget }}元
              </p>
            </div>
            <div class="btns flex" v-if="+id === 0">
              <template v-if="+child === 0">
                <van-button
                  size="small"
                  round
                  :color="$js.btnColor"
                  @click.stop="onStatus(1, i)"
                  >接受</van-button
                >
              </template>
              <template v-else-if="+child === 1">
                <van-button
                  size="small"
                  round
                  :color="$js.btnColor"
                  @click.stop="onStatus(2, i)"
                  >完成</van-button
                >
                <van-button
                  size="small"
                  round
                  color="#999"
                  @click.stop="onStatus(3, i)"
                  >取消</van-button
                >
              </template>
            </div>
          </div>
        </x-content>
      </v-page>
    </v-t>
    <template #fixed>
      <v-f :index="500" v-model="open" text="任务详情" :footer="false">
        <x-content class="detail">
          <h6>任务名称</h6>
          <p>{{ ext.mission_name || ext.name }}</p>
          <h6>任务开始时间</h6>
          <p>{{ ext.create_date }}</p>
          <h6>任务结束时间</h6>
          <p>{{ ext.end_time }}</p>
          <h6>任务内容</h6>
          <p v-html="$js.strToHtml(ext.content)" v-if="ext.content"></p>
          <p v-else>无</p>
          <template v-if="ext.target">
            <h6>任务说明</h6>
            <p v-html="$js.strToHtml(ext.target)"></p>
          </template>
          <template v-if="ext.budget > 0">
            <h6>任务预算</h6>
            <p>{{ ext.budget }}元</p>
          </template>
          <template v-if="ext.principal">
            <h6>负责人</h6>
            <p>{{ ext.principal }}</p>
            <h6>负责人联系方式</h6>
            <p>
              <a :href="'tel:' + ext.phone">{{ ext.phone }}</a>
            </p>
          </template>
          <template v-if="ext.inform && ext.inform.length">
            <h6>知会人</h6>
            <p class="flex fw">
              <van-tag
                plain
                type="primary"
                v-for="(i, j) in ext.inform"
                :key="j"
                >{{ i }}</van-tag
              >
            </p>
          </template>
          <template v-if="ext.sender_name">
            <h6>发布人</h6>
            <p>{{ ext.sender_name }}</p>
            <h6>发布人联系方式</h6>
            <p>
              <a :href="'tel:' + ext.contact" v-if="ext.contact">{{
                ext.contact
              }}</a>
              <a
                :href="'tel:' + ext.sender_contact"
                v-else-if="ext.sender_contact"
                >{{ ext.sender_contact }}</a
              >
            </p>
          </template>
          <template v-if="ext.principal_name">
            <h6>委托人</h6>
            <p>{{ ext.principal_name }}</p>
            <h6>委托人联系方式</h6>
            <p>
              <a :href="'tel:' + ext.principal_contact">{{
                ext.principal_contact
              }}</a>
            </p>
          </template>
        </x-content>
        <template v-if="+id === 0">
          <div class="w80 flex">
            <template v-if="+child === 0">
              <van-button
                block
                round
                :color="$js.btnColor"
                @click.stop="onStatus(1, ext)"
                >接受任务</van-button
              >
            </template>
            <template v-else-if="+child === 1">
              <van-button
                block
                round
                color="#999"
                @click.stop="onStatus(3, ext)"
                >取消任务</van-button
              >
              <van-button
                block
                round
                :color="$js.btnColor"
                @click.stop="onStatus(2, ext)"
                >完成任务</van-button
              >
            </template>
          </div>
        </template>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vT from "./_task.vue";
import vF from "../../private/fixed.vue";
export default {
  data() {
    return {
      active: "",
      bar: [
        {
          text: "待我处理",
          icon: "204",
          num: 0,
          path: "",
          api: "task1",
          det: "task1Detail",
        },
        {
          text: "我发起的",
          icon: "202",
          num: 0,
          path: "",
          api: "task3",
          det: "task3Detail",
        },
        { text: "发布任务", icon: "203", num: 0, path: "/task_add" },
        {
          text: "知会我的",
          icon: "201",
          num: 0,
          path: "",
          api: "task2",
          det: "task2Detail",
        },
        { text: "返回主页", icon: "200", num: 0, home: true },
      ],
      child: "0",
      id: "",
      sid: "",
      obj: {},
      item: [],
      dot: 0,
      ext: {},
      open: false,
    };
  },
  watch: {
    active(n) {
      this.onActive(n);
    },
    id(n) {
      this.child = "0";
      this.obj = this.bar[n];
      this.open = false;
      this.onPage(1);
    },
    child() {
      this.onPage(1);
    },
  },
  components: { vT, vF },
  inject: ["appPath", "appReplace"],
  methods: {
    toTel(e) {
      return e.contact || e.sender_contact;
    },
    onDetail(e) {
      let api = this.obj.det;
      let os = {
        id: e.id,
        m_id: e.m_id,
      };
      this.$api.http(api, os, (res) => {
        this.ext = res;
        this.open = true;
      });
    },
    // 更改状态
    onStatus(status, ext) {
      this.$api.http(
        "taskStatus",
        { m_id: ext.m_id, status, id: ext.id },
        () => {
          this.$js.message("成功");
          // 检测未读数量
          this.onGotNum();
          this.open = false;
          this.item = this.item.filter((r) => {
            return r.id !== ext.id;
          });
        }
      );
    },
    onActive(e) {
      let val = this.bar[e];
      if (val.home) {
        return this.appPath("/");
      } else if (val.path) {
        this.appPath(val.path);
      } else {
        // eslint-disable-next-line
        demo.title(this.$route.meta.title + "-" + val.text);
        this.appReplace("/task/" + e);
        this.id = e;
      }
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (this.sid === this.id) return 0;
      this.sid = this.id;
      setTimeout(() => {
        this.sid = "";
      }, 200);
      let api = this.obj.api;
      if (page === 1) {
        this.item = [];
      }
      if (api) {
        this.$api.http(api, { page, limit: 20, status: this.child }, (res) => {
          if (+page === 1) {
            this.item = [];
          }
          this.item = this.item.concat(res);
          this.$refs.page.onFinish(res.length < 20);
        });
      }
    },
    onGotNum() {
      if (+this.id !== 0) return 0;
      this.$api.http("taskDot", {}, (res) => {
        this.$set(this.bar[0], "num", res);
        this.dot = res;
      });
    },
  },
  mounted() {
    this.id = this.$route.params.num || "0";
    if (this.active === "") {
      this.active = +this.id;
    }
    this.onGotNum();
  },
};
</script>
<style lang='less' scoped>
a {
  color: inherit;
  display: inline-block;
}
.list {
  background-color: #fff;
  padding: 10px;
  box-sizing: border-box;
  font-size: 16px;
  border-radius: 8px;
  position: relative;
  min-height: 150px;
  .cover {
    position: absolute;
    right: 0;
    top: 0;
    width: 100px;
    height: 100px;
    opacity: 0.2;
  }
  .van-tag {
    font-weight: 400;
    margin-right: 5px;
  }
  h5 {
    padding: 10px 0;
    font-weight: 650;
    line-height: 1.2;
    position: relative;
    z-index: 5;
  }
  .font {
    color: #333;
    font-size: 14px;
    p {
      padding: 2px 0;
    }
  }
  .btns {
    padding-top: 10px;
    flex-direction: row-reverse;
    .van-button {
      margin-left: 5px;
      min-width: 80px;
    }
  }
}
.detail {
  h6 {
    font-size: 15px;
    color: #999;
    & + p {
      color: #222;
      padding: 10px;
      font-size: 14px;
      line-height: 1.2;
      font-weight: 650;
    }
  }
  .van-tag {
    margin: 0 5px 5px 0;
  }
}
</style>
