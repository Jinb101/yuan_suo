<template>
  <v-view header
          text="育儿教育">
    <div class="view_page"
         v-if="menuList.length > 0">
      <div class="list_box">
        <div class="l">
          <section v-for="(i, j) in menuList"
                   :key="j + '-2'"
                   @click="onCurID(i.id, i)"
                   :class="{ active: curId === i.id }">
            {{ i.name }}
          </section>
        </div>

        <div class="list">
          <v-page ref="page"
                  @on-page="onPage">
            <van-tabs swipeable
                      v-model="semester"
                      color="#99cc33"
                      title-active-color="#99cc33">
              <van-tab v-for="item in curItem.children"
                       :key="item.id"
                       :title="item.name"
                       :name="item.id"></van-tab>
            </van-tabs>

            <van-empty v-show="!item.length && !isLoading"></van-empty>
            <x-content v-for="(x, y) in item"
                       :key="y + 'c'">
              <div class="flex sec"
                   @click="ondetail(x)">
                <div class="logo">
                  <van-image :src="x.cover_picture"
                             fit="cover"></van-image>
                </div>
                <div class="text">
                  <h6>
                    <b>{{ y + 1 }}、</b>{{ x.title }}
                  </h6>
                  <div class="p">
                    <template v-if="x.duration > 0">
                      <van-tag v-if="x.duration < x.free_time">未看</van-tag>
                      <van-tag v-else
                               type="primary">已看</van-tag>
                    </template>
                    <template v-else>
                      <van-tag>未看</van-tag>
                    </template>
                  </div>
                </div>
              </div>
            </x-content>
            <x-content></x-content>
          </v-page>
        </div>
      </div>
    </div>
    <van-empty v-else
               description="暂无"></van-empty>
  </v-view>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      curItem: null,
      curId: null,
      semester: null,
      menu3: [],
      active3: "",
      item: [],
      isLoading: true,
    };
  },
  inject: ["appPath"],
  watch: {
    semester(newVal, oldVal) {
      console.log(newVal);
      this.semester = newVal;
      this.onPage(1)
    }
  },
  methods: {
    onCurID(id, item) {
      this.curId = id;
      this.curItem = item;
      this.onPage(1)
    },
    ondetail(e) {
      this.appPath("/educations/" + e.curriculum_id);
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page && this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      let classify_id = this.semester;
      this.$api.http("edulist", { classify_id, page, limit: 20 }, (e) => {
        this.item = this.item.concat(e);
        this.isLoading = false
        this.$refs.page.onFinish(e.length < 21);
      });
    },
    handleScroll() {
    const scrollContainer = this.$refs.page;
    const distanceToBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight;

    if (distanceToBottom <= 100) {
      // 触发事件，执行你想要的操作
      this.triggerEvent();
    }
  },
  },
  mounted() {
    console.log(123);
    let id = this.$route.params.id;
    if (!id) {
      // eslint-disable-next-line
      let a = demo.$local.get("temp_edu_page");
      if (a) {
        id = a;
      }
    }
    this.$api.http("eduify", {}, (r) => {
      this.menuList = r.find(item => item.id === 2).children;
      this.curItem = this.menuList[0]
      this.curId = this.curItem.id
      this.semester = this.curItem.children[0].id
    });
    this.onPage(1)
  },
};
</script>

<style lang="less" scoped>
.list_box {
  display: flex;

  .l {
    background-color: #f7f8fa;
    width: 90px;
    height: calc(100% - 44px);
    box-sizing: border-box;
    position: relative;
    padding: 8px 0;
    top: 44px;

    section {
      position: relative;
      font-size: 15px;
      padding: 10px 10px;
      line-height: 1.2;
      transition: all 0.3s;
      border-radius: 0 20px 20px 0;
      margin-bottom: 2px;

      &::before {
        position: absolute;
        content: "";
        left: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 3px;
        height: 14px;
        background-color: #38f;
        opacity: 0;
        transition: all 0.3s;
      }

      &.active {
        background-color: rgb(225, 238, 255);

        &::before {
          opacity: 1;
        }
      }
    }
  }

  .list {
    flex: 1;
    padding-left: 10px;
    overflow-y: auto;
  }
}

.sec {
  padding: 10px;
  box-sizing: border-box;
  border-radius: 10px;
  background-color: #fff;

  .logo {
    width: 100px;
    height: 100px;
    margin-right: 10px;
  }

  .text {
    width: calc(100% - 110px);
    font-size: 14px;

    h6 {
      font-weight: 650;
      padding: 3px 0;
      font-size: 15px;
    }

    .p {
      margin-top: 5px;
    }
  }
}</style>
