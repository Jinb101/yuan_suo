<template>
  <v-finance>
    <template #menu>
      <span @click="open = true">添加员工</span>
    </template>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section v-for="(i, j) in item" :key="j" class="flex">
        <div class="avatar">
          <van-icon name="manager-o" />
        </div>
        <div class="strong">
          <h2>{{ i.name }}</h2>
          <template v-if="!i.edit">
            <p>编码：{{ i.code }}</p>
            <p>借款余额：{{ i.balance }}</p>
            <p v-if="[0, 3].indexOf(i.type) > -1">
              员工类型：{{ i.type === 0 ? "系统" : "财务新增" }}
            </p>
            <p>加入时间：{{ appTimeout(i.create_time, true) }}</p>
          </template>
          <template v-else>
            <van-field
              v-model="name"
              label="员工姓名"
              label-width="5em"
              placeholder="请输入员工姓名"
              required
            />
            <van-field
              v-model="code"
              label="编码"
              label-width="5em"
              placeholder="请输入编码(选填)"
            />
            <div class="btn">
              <van-button block type="primary" round @click="onSubmitEdit(i, j)"
                >提交编辑</van-button
              >
            </div>
          </template>
        </div>
        <div class="tag">
          <v-more
            :item="onTag(i, j)"
            v-model="i.open"
            @change="eventchange"
          ></v-more>
        </div>
      </section>
    </v-page>
    <template #fixed>
      <v-f v-model="open" :footer="false" :text="texts">
        <van-field
          v-model="name"
          label="员工姓名"
          label-width="5em"
          placeholder="请输入员工姓名"
          required
        />
        <van-field
          v-model="code"
          label="编码"
          label-width="5em"
          placeholder="请输入编码(选填)"
        />
        <div class="w80">
          <van-button block type="primary" round @click="onSubmitAdd"
            >添加员工</van-button
          >
        </div>
      </v-f>
    </template>
  </v-finance>
</template>

<script>
import vF from "../../private/fixed.vue";
export default {
  data() {
    return {
      item: [],
      det: {},
      open: false,
      name: "",
      code: "",
    };
  },
  inject: ["appTimeout"],
  components: { vF },
  computed: {
    texts() {
      return this.det.$add ? "添加" : "编辑";
    },
  },
  methods: {
    onSubmitAdd() {
      this.$api.http(
        "financestaffadd",
        { name: this.name, code: this.code },
        (r) => {
          this.open = false;
          this.$toast("添加成功");
          this.onPage(1);
        }
      );
    },
    onSubmitEdit(e, j) {
      let os = {
        name: this.name,
        code: this.code,
        id: e.type === 0 ? e.staff_id : e.id,
      };
      this.$api.http("financestaffedit", os, () => {
        this.$toast("变更成功");
        this.$set(this.item[j], "edit", false);
        this.$set(this.item[j], "name", os.name);
        this.$set(this.item[j], "code", os.code);
      });
    },
    eventchange(e) {
      let edata = e.ext;
      switch (e.type) {
        case "edit":
          this.name = edata.name;
          this.code = edata.code;
          this.$set(this.item[e.index], "edit", true);
          break;
        default:
          this.$js.modeldel(() => {
            this.$api.http(
              "financestaffdel",
              { id: edata.type === 0 ? edata.staff_id : edata.id },
              () => {
                this.$toast("删除成功");
                this.item.splice(e.index, 1);
              }
            );
          });
      }
    },
    onTag(e, index) {
      let a = [5];
      if (e.type !== 0) {
        a.push(1);
      }
      // eslint-disable-next-line
      return demo.siteConfig.text.tag(a, { index, ext: e });
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("financestaff", { page }, (e) => {
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
      });
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
section {
  background-color: #fff;
  margin: 10px;
  padding: 10px;
  font-size: 16px;
  border-radius: 15px 5px;
  position: relative;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  .tag {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f7f7f7;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
  }
  .strong {
    width: calc(100% - 40px);
    box-sizing: border-box;
    padding-left: 8px;
    h2 {
      padding: 5px 0;
      font-weight: 650;
    }
    p {
      line-height: 1.5;
      font-size: 14px;
    }
  }
}
</style>
