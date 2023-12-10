<template>
  <v-view header>
    <template #menu>
      <span @click="open = true" class="col_green">添加政务通讯</span>
    </template>
    <div class="top">
      <van-search
        v-model="search"
        placeholder="请输入搜索关键词"
        shape="round"
      />
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section
        v-for="(i, j) in item"
        :key="j"
        class="flex"
        @click.stop="onTel(i)"
      >
        <v-more
          tag
          v-model="i.open"
          :item="toTag(i, j)"
          @change="eventchange"
        ></v-more>
        <div class="logo">
          <van-image :src="pic" lazy-load></van-image>
        </div>
        <div class="f1">
          <template v-if="i.edit">
            <van-field
              v-model="i.unit_name"
              label="单位名称"
              label-width="5em"
              placeholder="请输入单位名称"
            />
            <van-field
              v-model="i.contacts"
              label="姓名"
              label-width="5em"
              placeholder="请输入姓名"
            />
            <van-field
              v-model="i.telephone"
              label="电话"
              label-width="5em"
              placeholder="请输入电话"
            />
            <van-field
              v-model="i.post"
              label="职位"
              label-width="5em"
              placeholder="请输入职位"
            />
            <van-field
              v-model="i.remarks"
              label="备注"
              label-width="5em"
              placeholder="请输入备注"
              type="textarea"
              maxlength="125"
              show-word-limit
              role="2"
            />
            <van-button
              block
              :color="$js.btnColor"
              round
              size="small"
              @click.stop="onedit(i, j)"
              >保存</van-button
            >
          </template>
          <template v-else>
            <p>单位名称：{{ i.unit_name }}</p>
            <h6>姓名：{{ i.contacts }}</h6>
            <p>电话：{{ i.telephone }}</p>
            <p>职位：{{ i.post }}</p>
            <p>备注：{{ i.remarks }}</p>
          </template>
        </div>
        <van-icon name="phone" v-if="!i.edit"></van-icon>
        <div class="btn" v-if="!i.edit && !i.open">
          <van-button
            size="small"
            v-for="(x, y) in toTag(i, j)"
            :key="y + 'c' + j"
            :icon="x.icon"
            plain
            :type="x.col"
            @click.stop="eventchange(x)"
            >{{ x.text }}</van-button
          >
        </div>
      </section>
    </v-page>
    <template #fixed>
      <v-f v-model="open" index="600" :footer="false" text="添加政务通讯">
        <van-field
          v-model="ir.unit_name"
          label="单位名称"
          label-width="5em"
          placeholder="请输入单位名称"
        />
        <van-field
          v-model="ir.contacts"
          label="姓名"
          label-width="5em"
          placeholder="请输入姓名"
        />
        <van-field
          v-model="ir.telephone"
          label="电话"
          label-width="5em"
          placeholder="请输入电话"
        />
        <van-field
          v-model="ir.post"
          label="职位"
          label-width="5em"
          placeholder="请输入职位"
        />
        <van-field
          v-model="ir.remarks"
          label="备注"
          label-width="5em"
          placeholder="请输入备注"
          type="textarea"
          maxlength="125"
          show-word-limit
          role="2"
        />
        <div class="w60">
          <van-button block :color="$js.btnColor" round @click.stop="onadd"
            >保存</van-button
          >
        </div>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
export default {
  data() {
    return {
      item: [],
      search: "",
      // eslint-disable-next-line
      pic: demo.siteConfig.icon(10022, "people"),
      open: false,
      ir: {
        unit_name: "",
        contacts: "",
        telephone: "",
        post: "",
        remarks: "",
      },
    };
  },
  components: { vF },
  watch: {
    search() {
      this.$timefn(() => {
        this.onPage(1);
      });
    },
  },
  methods: {
    toTag(e, index) {
      // eslint-disable-next-line
      return demo.siteConfig.text.tag([1, 5], { ext: e, index });
    },
    eventchange(e) {
      switch (e.type) {
        case "edit":
          this.$set(this.item[e.index], "edit", true);
          break;
        default:
          this.$js.modeldel(() => {
            this.$api.http("userphonegovernmentdel", { id: e.ext.id }, () => {
              this.$toast("删除成功");
              this.item.splice(e.index, 1);
            });
          });
      }
    },
    onadd() {
      this.$api.http("userphonegovernmentadd", this.ir, () => {
        this.$toast("添加成功");
        this.onPage(1);
        this.open = false;
        this.ir = {
          unit_name: "",
          contacts: "",
          telephone: "",
          post: "",
          remarks: "",
        };
      });
    },
    onedit(e, j) {
      let os = { ...e };
      delete os.open;
      delete os.edit;
      this.$api.http("userphonegovernmentedit", os, () => {
        this.$toast("保存成功");
        this.$set(this.item[j], "edit", false);
      });
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "userphonegovernment",
        { page, name: this.search },
        (e) => {
          if (+page === 1) {
            this.item = [];
          }
          this.item = this.item.concat(
            e.map((s) => {
              s.open = false;
              s.edit = false;
              return s;
            })
          );
          this.$refs.page.onFinish(e.length < 20);
        }
      );
    },
    onTel(e) {
      if (e.edit) return 0;
      // eslint-disable-next-line
      demo.siteConfig.tel(e.telephone);
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.top {
  position: sticky;
  top: 0;
  z-index: 55;
}
section {
  padding: 5px 15px 45px;
  align-items: center;
  margin-bottom: 5px;
  box-sizing: border-box;
  position: relative;
  > .van-icon {
    position: absolute;
    right: 20px;
    top: 0;
    bottom: 40px;
    margin: auto;
    font-size: 18px;
    color: #ccc;
    height: 20px;
  }
  .logo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f7f7f7;
  }
  .f1 {
    width: calc(100% - 40px);
    font-size: 15px;
    box-sizing: border-box;
    padding-left: 10px;
    h6 {
      padding: 5px 0;
      font-weight: 650;
    }
    p {
      line-height: 1.2;
      &:last-child {
        color: #999;
      }
    }
  }
  .btn {
    position: absolute;
    bottom: 0;
    right: 10px;
    height: 40px;
    .van-button {
      margin-left: 8px;
      min-width: 60px;
    }
  }
}
</style>
