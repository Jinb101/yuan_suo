<template>
  <div class="app_people">
    <x-content>
      <div class="flex fw">
        <section v-for="(i, j) in list" :key="j" class="list">
          <x-radius size="40">
            <van-image fit="cover"></van-image>
          </x-radius>
          <p class="van-multi-ellipsis--l2">这是他的名字</p>
        </section>
        <section class="list more" @click="showMore = true" v-if="isMore">
          <x-radius size="40" color="#38f" before>
            <van-icon name="more" />
          </x-radius>
          <p class="center">更多</p>
        </section>
        <section class="list edit" @click="showEdit = true" v-if="isEdit">
          <x-radius size="40" color="orange" before>
            <van-icon name="edit" />
          </x-radius>
          <p class="center">编辑</p>
        </section>
        <section class="list add" @click="showAdd = true" v-if="isAdd">
          <x-radius size="40" :color="$js.color" before>
            <van-icon name="plus" />
          </x-radius>
          <p class="center">添加</p>
        </section>
      </div>
    </x-content>
    <!-- 更多 内置点击编辑 跳到编辑 -->
    <v-f v-model="showMore" text="更多" :index="500">
      <x-content>
        <van-checkbox-group v-model="delList">
          <div class="flex fw">
            <section
              v-for="(i, j) in 30"
              :key="j + 30"
              class="list"
              @click="onChangeMore(j)"
            >
              <div class="check">
                <van-checkbox
                  :name="i"
                  icon-size="14"
                  ref="checkMore"
                ></van-checkbox>
              </div>
              <x-radius size="40">
                <van-image fit="cover"></van-image>
              </x-radius>
              <p class="van-multi-ellipsis--l2">这是他的名字</p>
            </section>
          </div>
        </van-checkbox-group>
      </x-content>
      <transition name="van-fade">
        <div class="w60" v-if="delList.length">
          <van-button block round color="tomato"
            >批量删除({{ delList.length }})</van-button
          >
        </div>
      </transition>
    </v-f>
    <!-- 添加 -->
    <v-f v-model="showAdd" text="添加" :index="501">
      <div class="search">
        <van-search
          v-model="search"
          placeholder="请输入搜索关键词"
          @search="onSearchAdd"
        />
      </div>
      <van-checkbox-group v-model="addList">
        <x-content v-for="(i, j) in 20" :key="j + 100">
          <section
            class="flex list_add van-hairline--top"
            @click="onChangeAdd(j)"
          >
            <x-radius size="40"></x-radius>
            <div class="font">
              <p class="name">name</p>
              <p class="job">job</p>
            </div>
            <div class="check">
              <van-checkbox
                :name="i"
                icon-size="20"
                ref="checkAdd"
              ></van-checkbox>
            </div>
          </section>
        </x-content>
        <section class="list_add"><div class="check"></div></section>
      </van-checkbox-group>
      <transition name="van-fade">
        <div class="w80" v-if="addList.length">
          <van-button block round :color="$js.btnColor"
            >确认选中({{ addList.length }})</van-button
          >
        </div>
      </transition>
    </v-f>
    <!-- 编辑 -->
    <v-f v-model="showEdit" text="编辑" :index="502">
      <section
        v-for="(i, j) in 50"
        :key="j"
        class="van-hairline--bottom list_edit flex"
      >
        <x-radius size="40"></x-radius>
        <p class="font">name</p>
        <div class="tool flex">
          <span class="up">
            <van-icon name="arrow-up" />
          </span>
          <span class="down">
            <van-icon name="arrow-down" :color="$js.color" />
          </span>
          <span class="del">
            <van-icon name="delete-o" color="tomato" />
          </span>
        </div>
      </section>
    </v-f>
  </div>
</template>

<script>
import vF from "../private/fixed.vue";
export default {
  props: {
    api: Boolean,
    type: { type: String, default: "all_staff" },
    value: null,
    max: { type: [String, Number], default: "max" },
    open: Boolean,
  },
  data() {
    return {
      count: 8,
      delList: [],
      showMore: false,
      showAdd: false,
      showEdit: false,
      search: "",
      addList: [],
      item: [],
      items: [],
      timer: null,
    };
  },
  computed: {
    isMore() {
      return this.list.length > 8;
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
  },
  watch: {
    list: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
    search() {
      this.onSearchAdd();
    },
  },
  components: { vF },
  methods: {
    onChangeMore(e) {
      this.$refs.checkMore[e].toggle();
    },
    onChangeAdd(e) {
      this.$refs.checkAdd[e].toggle();
    },
    onSearchAdd() {
      this.onTimers(() => {
        console.log(this.search);
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
      }, 500);
    },
    initOnce() {
      switch (this.type) {
        case "all_staff":
        case "staffs":
          break;
        case "all_parent":
        case "parents":
          break;
        default:
      }
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
        & + p {
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
</style>
