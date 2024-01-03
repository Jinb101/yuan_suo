<template>
  <div class="app_people">
    <x-content>
      <div class="flex fw">
        <section v-for="(i, j) in showList"
                 :key="j"
                 class="list">
          <x-radius size="40">
            <van-image fit="cover"
                       :src="i.avatar"
                       class="db_image"></van-image>
          </x-radius>
          <p class="van-multi-ellipsis--l2">{{ i.name }}</p>
        </section>
        <section class="list more"
                 @click="showMore = true"
                 v-if="isMore">
          <x-radius size="40"
                    color="#38f"
                    before>
            <van-icon name="more" />
          </x-radius>
          <p class="center">更多</p>
        </section>
        <section class="list edit"
                 @click="showEdit = true"
                 v-if="isEdit">
          <x-radius size="40"
                    color="orange"
                    before>
            <van-icon name="edit" />
          </x-radius>
          <p class="center">编辑</p>
        </section>
        <section class="list add"
                 @click="showAdd = true"
                 v-if="isAdd">
          <x-radius size="40"
                    :color="$js.color"
                    before>
            <van-icon name="plus" />
          </x-radius>
          <p class="center">添加</p>
        </section>
      </div>
    </x-content>
    <!-- 更多 内置点击编辑 跳到编辑 -->
    <v-f v-model="showMore"
         text="更多"
         :index="500"
         :footer="false">
      <x-content>
        <van-checkbox-group v-model="delList">
          <div class="flex fw">
            <section v-for="(i, j) in list"
                     :key="j + 'l'"
                     class="list"
                     @click="onChangeMore(j)">
              <div class="check">
                <van-checkbox :name="i.id"
                              icon-size="14"
                              ref="checkMore"></van-checkbox>
              </div>
              <x-radius size="40">
                <van-image :src="i.avatar"
                           fit="cover"
                           class="db_image"
                           lazy-load></van-image>
              </x-radius>
              <p class="van-multi-ellipsis--l2">{{ i.name }}</p>
            </section>
          </div>
        </van-checkbox-group>
      </x-content>
      <transition name="van-fade">
        <div class="w60"
             v-if="delList.length">
          <van-button block
                      round
                      color="tomato"
                      @click="onShowDel">批量删除 ({{ delList.length }})</van-button>
        </div>
      </transition>
      <div class="w60">
        <van-button block
                    round
                    :color="$js.btnColor"
                    @click="showMore = false">返回</van-button>
      </div>
    </v-f>
    <!-- 添加 -->
    <v-f v-model="showAdd"
         text="添加"
         :index="501"
         :footer="false">
      <div class="search">
        <van-search v-model="search"
                    placeholder="请输入搜索关键词"
                    @search="onSearchAdd" />
      </div>
      <van-empty v-if="!item.length"
                 description="暂无"></van-empty>
      <van-checkbox-group v-model="addList">
        <template v-if="isparent">
          <div class="par_box">
            <van-collapse v-model="a">
              <van-collapse-item :title="x.nickname"
                                 :name="x.id"
                                 v-for="(x, y) in item"
                                 :key="y + '-item'">
                <div class="btns_p"
                     v-if="x.children && x.children.length > 1">
                  <van-button size="small"
                              type="primary"
                              plain
                              round
                              @click="onallselector(x, y)">全选/反选</van-button>
                </div>
                <section class="flex list_add van-hairline--top"
                         @click="onChangeAdd(j + '', y + '')"
                         v-for="(i, j) in x.children"
                         :key="j + 'item-' + y">
                  <x-radius size="40">
                    <van-image :src="i.avatar"
                               fit="cover"
                               class="db_image"
                               lazy-load></van-image>
                  </x-radius>
                  <div class="font">
                    <p class="name">{{ i.name }}</p>
                    <p class="job"
                       v-if="i.job_name">{{ i.job_name }}</p>
                  </div>
                  <div class="check">
                    <van-checkbox :name="i.id"
                                  icon-size="20"
                                  :ref="'checkAdd' + y"></van-checkbox>
                  </div>
                </section>
              </van-collapse-item>
            </van-collapse>
          </div>
        </template>
        <template v-else>
          <x-content v-for="(i, j) in item"
                     :key="j + 'item'">
            <section class="flex list_add van-hairline--top"
                     @click="onChangeAdd(j)">
              <x-radius size="40">
                <van-image :src="i.avatar"
                           fit="cover"
                           class="db_image"
                           lazy-load></van-image>
              </x-radius>
              <div class="font">
                <p class="name">{{ i.name }}</p>
                <p class="job"
                   v-if="i.job_name">{{ i.job_name }}</p>
              </div>
              <div class="check">
                <van-checkbox :name="i.id"
                              icon-size="20"
                              ref="checkAdd"></van-checkbox>
              </div>
            </section>
          </x-content>
        </template>
        <section class="list_add">
          <div class="check"></div>
        </section>
      </van-checkbox-group>
      <transition name="van-fade">
        <div class="w80"
             v-if="addList.length">
          <van-button block
                      round
                      :color="$js.btnColor"
                      @click="onAddSubmit">确认选中 ({{ addList.length }})</van-button>
        </div>
      </transition>
    </v-f>
    <!-- 编辑 -->
    <v-f v-model="showEdit"
         text="编辑"
         :index="502"
         :footer="false">
      <section v-for="(i, j) in list"
               :key="j + 'e'"
               class="van-hairline--bottom list_edit flex">
        <x-radius size="40">
          <van-image :src="i.avatar"
                     fit="cover"
                     class="db_image"></van-image>
        </x-radius>
        <p class="font">{{ i.name }}</p>
        <div class="tool flex">
          <span class="up"
                v-if="j > 0"
                @click="onEditUp(i.id)">
            <van-icon name="arrow-up" />
          </span>
          <span class="down"
                v-if="j < list.length - 1"
                @click="onEditDown(i.id)">
            <van-icon name="arrow-down"
                      :color="$js.color" />
          </span>
          <span class="del"
                @click="onEditDel(i.id)">
            <van-icon name="delete-o"
                      color="tomato" />
          </span>
        </div>
      </section>
      <div class="w60">
        <template v-if="!list.length || changeselect">
          <van-button block
                      round
                      type="info"
                      @click="
                        showEdit = false;
                      showAdd = true;
                      ">重新选择</van-button>
          <br />
        </template>
        <van-button block
                    round
                    :color="$js.btnColor"
                    @click="showEdit = false">返回</van-button>
      </div>
    </v-f>
  </div>
</template>

<script>
import vF from "./fixed.vue";
export default {
  props: {
    api: Boolean,
    type: { type: String, default: "all_staff" },
    value: null,
    max: { type: [String, Number], default: "max" },
    open: Boolean,
    changeselect: Boolean,
    nome: Boolean,
  },
  data() {
    return {
      count: 7,
      delList: [],
      showMore: false,
      showAdd: false,
      showEdit: false,
      search: "",
      addList: [],
      item: [],
      items: [],
      timer: null,
      isparent: false,
      a: [],
    };
  },
  computed: {
    isMore() {
      return this.list.length > this.count;
    },
    isEdit() {
      return this.list.length > 0;
    },
    isAdd() {
      let n = isNaN(this.max) ? 999999 : parseInt(this.max);
      return this.list.length < n;
    },
    list: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
    showList() {
      if (this.list.length > this.count) {
        let num = this.count;
        return this.list.filter((k, v) => {
          return v < num;
        });
      }
      return this.list;
    },
  },
  watch: {
    list: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
    showAdd(n) {
      if (n) {
        if (!this.items.length) {
          this.initOnce();
        }
        if (this.list.length) {
          this.addList = this.list.map((r) => r.id);
        }
      }
    },
    search() {
      this.onSearchAdd();
    },
  },
  components: { vF },
  methods: {
    onallselector(x, y) {
      x.children.forEach((k, v) => {
        this.onChangeAdd(v + "", y + "");
      });
    },
    // 更多 - 删除
    onShowDel() {
      let ids = this.delList;
      this.delList = [];
      this.addList = this.addList.filter((r) => {
        return ids.indexOf(r) < 0;
      });
      this.list = this.list.filter((r) => {
        return ids.indexOf(r.id) < 0;
      });
    },
    // 编辑-下移
    onEditDown(id) {
      let index = this.list.map((r) => r.id).indexOf(id);
      let newArr = { ...this.list[index] };
      this.list.splice(index, 1);
      this.list.splice(index + 1, 0, newArr);
    },
    // 编辑 - 上移
    onEditUp(id) {
      let index = this.list.map((r) => r.id).indexOf(id);
      let newArr = { ...this.list[index] };
      this.list.splice(index, 1);
      this.list.splice(index - 1, 0, newArr);
    },
    // 编辑 - 删除
    onEditDel(id) {
      this.addList = this.addList.filter((r) => {
        return r !== id;
      });
      this.list = this.list.filter((r) => {
        return r.id !== id;
      });
    },
    // 添加 - 选中
    onAddSubmit() {
      let ids = [...this.addList];
      if (this.isparent) {
        let x = this.items.map((s) => {
          return s.children || [];
        });
        let b = [];
        for (let i in x) {
          b = b.concat(x[i]);
        }
        this.list = b.filter((r) => {
          return ids.indexOf(r.id) > -1;
        });
      } else {
        this.list = this.items.filter((r) => {
          return ids.indexOf(r.id) > -1;
        });
      }
      this.showAdd = false;
    },
    onChangeMore(e) {
      this.$refs.checkMore[e].toggle();
    },
    onChangeAdd(e, name = "", flag = false) {
      let refname = name ? "checkAdd" + name : "checkAdd";
      if (name && flag) {
        this.$refs[refname][e].toggle(true);
      } else {
        this.$refs[refname][e].toggle();
      }
      let num = isNaN(this.max) ? 999999 : parseInt(this.max);
      if (num > 1000) return 0;
      if (this.addList.length >= num) {
        this.addList = this.addList.reverse().filter((r, v) => {
          return v < num - 1;
        });
      }
    },
    onSearchAdd() {
      this.onTimers(() => {
        let val = this.search;
        if (this.isparent) {
          // eslint-disable-next-line
          this.item = demo.copy(this.items).map((r) => {
            r.children = (r.children || []).filter((s) => {
              return s.name.indexOf(val) > -1;
            });
            return r;
          });

          if (val + "" === "") {
            this.a = [this.item[0].id];
          } else {
            this.a = this.item
              .filter((s) => {
                return s.children.length > 0;
              })
              .map((s) => {
                return s.id;
              });
          }
        } else {
          this.item = this.items.filter((r) => {
            return r.name.indexOf(val) > -1;
          });
        }
      });
    },
    onTimers(fn) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        fn();
        clearTimeout(this.timer);
        this.timer = null;
      }, 300);
    },
    initOnce() {
      this.isparent = false;
      this.item = [];
      switch (this.type) {
        case "all_staff":
        case "staffs":
          this.toStaff();
          break;
        case "all_parent":
        case "parents":
          this.isparent = true;
          this.toParent();
          break;
        default:
      }
    },
    toStaff() {
      this.$api.http(
        "getAllStaff",
        { type: 0, group_id: "", is_human: this.nome ? "1" : "" },
        (res) => {
          this.item = res;
          this.items = this.item;
        }
      );
    },
    toParent() {
      this.$api.http(
        "getAllParents",
        { type: 0, group_id: "", is_human: this.nome ? "1" : "" },
        (r) => {
          this.item = r.map((s) => {
            s.name = s.nickname;
            s.children = (s.child || []).map((k) => {
              k.name = k.nickname;
              k.id = k.user_id;
              return k;
            });
            return s;
          });
          this.items = this.item;
          this.a = [this.item[0].id];
        }
      );
      // this.$api.http(
      //   "getAllParent",
      //   { type: 0, group_id: "", is_human: this.nome ? "1" : "" },
      //   (res) => {
      //     this.item = res.map((s) => {
      //       s.name = s.nickname;
      //       return s;
      //     });
      //     this.items = this.item;
      //   }
      // );
    },
  },
  mounted() {
    this.list = this.value;
    if (this.open && !this.list.length) {
      this.showAdd = true;
    }
  },
};
</script>
<style lang='less' scoped>
.app_people {
  .list {
    width: 70px;
    font-size: 12px;
    text-align: center;
    box-sizing: border-box;
    padding: 0 2px;
    position: relative;
    margin-bottom: 5px;

    .check {
      position: absolute;
      right: 0;
      top: 0;
    }

    p:not(.center) {
      text-align: center;
      height: 24px;
    }

    .center {
      line-height: 24px;
      font-size: 14px;
    }

    .van-icon {
      margin-top: 8px;
      font-size: 22px;
    }
  }

  .list_add {
    padding: 10px 0;

    .font {
      flex: 1;
      font-size: 14px;
      padding: 0 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .name {
        font-weight: 650;
        font-size: 16px;

        &+p {
          margin-top: 4px;
        }
      }
    }

    .check {
      padding-top: 10px;
    }
  }

  .list_edit {
    padding: 10px;

    .font {
      flex: 1;
      font-size: 16px;
      padding: 0 8px;
      line-height: 40px;
      font-weight: 650;
    }

    .tool {
      span {
        width: 40px;
        height: 40px;
        text-align: center;
        box-sizing: border-box;
        padding-top: 10px;

        .van-icon {
          font-size: 20px;
        }
      }
    }
  }
}

.search {
  position: sticky;
  top: 0;
  z-index: 55;
}

.btns_p {
  text-align: right;

  button {
    width: 100px;
  }
}

.par_box {
  padding-bottom: 80px;
}
</style>
