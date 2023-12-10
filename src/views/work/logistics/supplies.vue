<template>
  <v-view header cover>
    <template #menu>
      <span @click="onadd">添加物资</span>
    </template>
    <div class="app_top">
      <v-s v-model="name" @search="onPage(1)"></v-s>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section
        v-for="(i, j) in item"
        :key="j"
        class="van-hairline--bottom flex"
        @click.stop="onDetail(i, j)"
        :class="{ active: cid.indexOf(i.id) >= 0 }"
      >
        <div class="logo">
          <template v-if="i.img">
            <van-image
              :src="i.img"
              fit="cover"
              @click.stop="appShowImage(i.img)"
            ></van-image>
          </template>
          <template v-else>
            <van-image :src="dpic"></van-image>
          </template>
        </div>
        <div class="text">
          <h6>{{ i.name }}</h6>
          <p>编号：{{ i.no }}</p>
          <p>剩余数量：{{ i.num }} {{ i.unit_name }}</p>
          <p>待出库:{{i.pending_approval}} {{ i.unit_name }}</p>
          <p>审批中:{{i.to_be_shipped_out}} {{ i.unit_name }}</p>
        </div>
        <div class="btns">
          <span @click.stop="onedit(i, j)">编辑</span>
          <span @click.stop="ondel(i, j)">删除</span>
        </div>
      </section>
    </v-page>
    <template #fixed>
      <v-f
        :footer="false"
        v-model="open"
        :text="ext.$edit ? '编辑物资' : '添加物资'"
      >
        <v-a :ext="ext" @close="onclosechild" v-model="a"></v-a>
      </v-f>
      <transition name="van-fade">
        <div class="save_btn" v-if="cid.length">
          <van-button block :color="$js.btnColor" round @click="ongoto"
            >批量领用({{ cid.length }})项</van-button
          >
        </div>
      </transition>
    </template>
  </v-view>
</template>

<script>
import vS from "../../private/search.vue";
import vF from "../../private/fixed.vue";
import vA from "./supplies_add.vue";
export default {
  data() {
    return {
      name: "",
      item: [],
      // eslint-disable-next-line
      dpic: demo.siteConfig.icon(5000, "work"),
      open: false,
      ext: {},
      a: {},
      cid: [],
    };
  },
  inject: ["appShowImage", "appPath"],
  components: { vS, vF, vA },
  methods: {
    onclosechild(type, num) {
      this.open = false;
      if (type === "add") {
        this.onPage(1);
      } else {
        if (this.a.num && this.a.name) {
          this.$set(this.item[num], "num", this.a.num);
          this.$set(this.item[num], "name", this.a.name);
        }
      }
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("supplies", { page, name: this.name }, (e) => {
        if (+page === 1) {
          this.item = [];
        }
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
    onDetail(i, j) {
      if (this.cid.indexOf(i.id) >= 0) {
        this.cid = this.cid.filter((r) => {
          return r !== i.id;
        });
      } else {
        this.cid.push(i.id);
      }
    },
    onadd() {
      this.ext = {};
      this.open = true;
    },
    onedit(i, j) {
      this.ext = { $index: j, $edit: true, ...i };
      this.open = true;
    },
    ondel(e) {
      this.$js.modeldel(() => {
        this.$api.http("suppliesdel", { id: e.id }, () => {
          this.$toast("删除成功");
          this.item = this.item.filter((r) => {
            return r.id !== e.id;
          });
        });
      });
    },
    ongoto() {
      this.$js.model(
        "领用提示",
        "是否领用" + this.cid.length + "项物资，点击确认后跳转到领用页进行申请",
        (r) => {
          if (r) {
            let a = this.cid.join(",");
            this.appPath("/approval_send/1&" + a);
          }
        }
      );
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
section {
  padding: 10px;
  margin: 0 10px 10px;
  border-radius: 10px 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  position: relative;
  .logo {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    display: flex;
    font-size: 12px;
    color: #ccc;
  }
  .text {
    width: calc(100% - 60px);
    box-sizing: border-box;
    padding-left: 10px;
    font-size: 14px;
    h6 {
      font-weight: 650;
      padding: 8px 0;
      font-size: 16px;
    }
    p {
      line-height: 1.2;
    }
  }
  .btns {
    position: absolute;
    right: 5px;
    bottom: 5px;
    z-index: 5;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    span {
      padding: 8px 16px;
      box-sizing: border-box;
      border: 1px solid orange;
      border-radius: 5px;
      color: orange;
    }
    span + span {
      margin-top: 8px;
      border-color: tomato;
      color: tomato;
    }
  }
  &.active {
    box-shadow: 0 0 5px rgba(99, 139, 252, 0.863);
  }
}
.save_btn {
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 15px 15%;
  width: 100%;
  box-sizing: border-box;
}
</style>
