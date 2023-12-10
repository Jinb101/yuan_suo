<template>
  <div class="recruit_label">
    <transition name="van-slide-down">
      <div class="add_box" v-if="open">
        <van-field
          v-model="message"
          rows="3"
          autosize
          label="备注"
          type="textarea"
          maxlength="125"
          placeholder="请输入备注"
          show-word-limit
          label-width="3em"
          required
        />
        <van-cell title="附加照片(0-9张)"></van-cell>
        <br />
        <v-uploads v-model="imgs">
          <div class="image">
            <v-upload
              more
              moreLength="9"
              @on-path="onPath"
              @on-loading="onPath"
            ></v-upload>
          </div>
        </v-uploads>
        <div class="btns">
          <van-button :color="$js.btnColor" block round @click="onsubmit"
            >添加</van-button
          >
        </div>
        <div class="close" @click="open = false">
          <van-icon name="cross" />
        </div>
      </div>
    </transition>
    <v-page ref="page" @on-page="onPage">
      <van-empty
        v-if="!item.length"
        description="暂无备注，你可以试着添加一条"
      ></van-empty>
      <section v-for="(i, j) in item" :key="j">
        <van-cell title="备注内容" :label="i.content"></van-cell>
        <span class="del" @click="ondel(i)">点击删除</span>
        <template v-if="i.picture && i.picture.length">
          <div class="flex fw pic">
            <div class="image" v-for="(x, y) in i.picture" :key="y + '-' + j">
              <van-image
                :src="x"
                fit="cover"
                @click="appShowImage(i.picture, y)"
              ></van-image>
            </div>
          </div>
        </template>
        <p class="time">
          {{ i.date }}<b>{{ i.week }}</b
          >备注
        </p>
      </section>
    </v-page>
    <div class="w80" v-if="!open">
      <van-button block round :color="$js.btnColor" @click="open = true"
        >添加备注</van-button
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ids: [String, Number],
  },
  data() {
    return {
      item: [],
      open: false,
      message: "",
      imgs: [],
    };
  },
  inject: ["appShowImage"],
  methods: {
    onsubmit() {
      if (this.message === "") return this.$toast("请填写备注");
      let os = {
        c_id: this.ids,
        content: this.message,
        picture: this.imgs
          .map((s) => {
            return s.src;
          })
          .join(","),
        contact: "",
      };
      this.$api.http("recruitlabeladd", os, () => {
        this.$toast("添加成功");
        this.open = false;
        this.imgs = [];
        this.message = "";
        this.onPage(1);
      });
    },
    ondel(e) {
      this.$js.modeldel(() => {
        this.$api.http(
          "recruitlabeldel",
          {
            remarks_id: e.id,
          },
          () => {
            this.$toast("删除成功");
            this.item = this.item.filter((r) => {
              return r.id !== e.id;
            });
          }
        );
      });
    },
    onPath(e, v) {
      this.imgs = v;
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "recruitlabel",
        {
          page,
          c_id: this.ids,
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
  mounted() {},
};
</script>
<style lang='less' scoped>
.recruit_label {
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 80px;
  overflow-y: scroll;
  position: relative;
  background-color: #f5f5f5;
  .add_box {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 0 0 30px 30px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    font-size: 15px;
    z-index: 25;
  }
  .image {
    width: 78px;
    height: 78px;
    margin: 0 10px 10px 0;
  }
  .btns {
    margin: 20px 20%;
  }
  .close {
    width: 40px;
    height: 40px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    border-radius: 50%;
    border: 1px solid #d6d6d6;
    color: #ccc;
    cursor: pointer;
  }
  section {
    position: relative;
    box-sizing: border-box;
    background-color: #fff;
    margin-top: 5px;
    .del {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 13px;
      padding: 10px;
      color: tomato;
    }
    .time,
    .pic {
      padding: 10px;
    }
    .time {
      font-size: 13px;
      color: #999;
      b {
        padding: 0 10px;
      }
    }
  }
}
</style>
