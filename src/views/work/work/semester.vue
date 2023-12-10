<template>
  <v-view header :text="title" @on-user="onuser">
    <template #menu>
      <span @click="open = true">学期附件</span>
    </template>
    <van-tabs v-model="active" color="#99cc33" title-active-color="#99cc33">
      <van-tab
        :title="i.t"
        v-for="(i, j) in bar"
        :key="j"
        :name="i.v"
      ></van-tab>
    </van-tabs>
    <div class="conts">
      <van-collapse v-model="activeNames" accordion>
        <van-collapse-item title="学期指标目标" name="1">
          <section
            v-for="(i, j) in item.index"
            :key="j + '-line'"
            class="box van-hairline--bottom"
          >
            <span class="num">{{ j + 1 }}</span>
            <span
              class="btn"
              @click="onDelItem(i)"
              v-if="+user.is_whether === 1"
              ><van-icon name="delete-o"
            /></span>
            <van-field
              v-model="i.key"
              label="重点指标"
              placeholder="请输入重点指标"
              maxlength="125"
            />
            <van-field
              v-model="i.target"
              label="保底目标"
              placeholder="请输入保底目标"
              maxlength="125"
            />
            <van-field
              v-model="i.spurt"
              label="冲刺目标"
              placeholder="请输入冲刺目标"
              maxlength="125"
            />
          </section>
          <div class="add" v-if="+user.is_whether === 1">
            <van-button
              block
              round
              icon="plus"
              :color="$js.btnColor"
              size="small"
              @click="onAddItem"
            >
              添加
            </van-button>
          </div>
        </van-collapse-item>
        <van-collapse-item title="学期重点工作" name="2">
          <section
            class="lines van-hairline--bottom"
            v-for="(i, j) in item.work"
            :key="j + '-lin'"
          >
            <h6>{{ i.year }}年{{ i.month }}月重点工作</h6>
            <van-field
              v-model="x.val"
              placeholder="请输入重点工作"
              v-for="(x, y) in i.work"
              :key="y + '-w'"
              maxlength="125"
              :readonly="+user.is_whether !== 1"
            >
              <template #button>
                <template v-if="+user.is_whether === 1">
                  <van-icon
                    name="plus"
                    size="20"
                    v-if="y === i.work.length - 1"
                    @click="onAddList(i, j)"
                  ></van-icon>
                  <van-icon
                    name="minus"
                    size="20"
                    color="tomato"
                    v-else
                    @click="onDelList(j, y)"
                  ></van-icon>
                </template>
              </template>
            </van-field>
          </section>
        </van-collapse-item>
      </van-collapse>
    </div>
    <div class="bottom_h"></div>
    <div class="bottom" v-if="+user.is_whether === 1">
      <van-button block round :color="$js.btnColor" @click="onsave"
        >添加/编辑学期计划</van-button
      >
    </div>
    <!-- <div class="down_btn">
      <van-button block round type="default" @click="onworddown"
        >生成Word</van-button
      >
    </div> -->
    <template #fixed>
      <v-f v-model="open" text="学期附件" :footer="false" :index="500">
        <template #menu>
          <span @click="open2 = true">我的附件</span>
        </template>
        <v-page ref="filepage" @on-page="filePage">
          <van-empty v-if="!fileitem.length"></van-empty>
          <section
            v-for="(i, j) in fileitem"
            :key="j + '-s'"
            class="flex van-hairline--bottom file_sec"
            @click="onfiledet(i)"
          >
            <div class="ava">
              <van-image :src="i.avatar" fit="cover" round></van-image>
            </div>
            <div class="text">
              <p class="name">
                {{ i.staff_name }} <b v-if="+user.s_id === +i.staff_id">自己</b>
              </p>
              <p>{{ i.group_name }}-{{ i.jpb_name }}</p>
              <p>最近更新：{{ appTimeout(i.update_time, true) }}</p>
              <p>历史发布：{{ i.quantity }}个</p>
            </div>
          </section>
        </v-page>
        <div class="bottom_h"></div>
        <div class="bottom">
          <van-button block round :color="$js.btnColor" @click="open3 = true"
            >我也添加</van-button
          >
        </div>
      </v-f>
      <v-f v-model="open2" text="我的附件" :footer="false" :index="502">
        <v-d @detItem="filePage" :ids="ids" my @show="onshow" @edit="oneditfile" ref="open2"></v-d>
      </v-f>
      <v-f v-model="open3" text="添加附件" :footer="false" :index="505">
        <v-c @on-submit="onaddfiles" nowork v-model="upload"></v-c>
      </v-f>
      <v-f v-model="open4" text="附件详情" :footer="false" :index="504">
        <v-d :ids="ids" @show="onshow"></v-d>
      </v-f>
      <v-f v-model="open5" text="附件查看" :footer="false" :index="507">
        <iframe :src="framesrc" frameborder="0" @edit="oneditfile"></iframe>
      </v-f>
      <v-f v-model="open6" text="编辑附件" :footer="false" :index="508">
        <v-c @on-submit="oneditfiles" nowork v-model="upload" edit></v-c>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vF from "../../private/fixed.vue";
import vC from "./files.vue";
import vD from "./det.vue";
export default {
  data() {
    return {
      bar: [
        { t: "春季", v: "1" },
        { t: "秋季", v: "2" },
      ],
      active: "",
      item: {
        index: [],
        work: [],
      },
      activeNames: "1",
      open: false, // 控制学期附件
      open2: false, // 控制我的附件
      open3: false, // 控制添加附件
      open4: false, // 控制附件详情
      open5: false, // 控制查看器
      open6: false, // 编辑附件
      fileitem: [],
      user: {},
      upload: {},
      ids: "",
      framesrc: "",
    };
  },
  inject: ["appTimeout"],
  components: { vF, vC, vD },
  computed: {
    title() {
      let a = this.active;
      let v = this.bar.filter((r) => {
        return r.v === a;
      });
      return [new Date().getFullYear(), "年", (v[0] || {}).t].join("");
    },
  },
  watch: {
    active() {
      this.init();
    },
  },
  methods: {
    // 删除附件刷新
    onworddown() {
      // eslint-disable-next-line
      demo.siteConfig.downfiledata(
        this.item,
        this.$js.env,
        "work_semester",
        "word"
      );
    },
    onshow(e) {
      this.framesrc = e;
      this.open5 = true;
    },
    onaddfiles() {
      let img = this.upload.img;
      this.$api.http("semesterfileadd", { enclosure: img.join(",") }, () => {
        this.$toast("添加附件成功");
        this.filePage()
        this.open3 = false;
      });
    },
    oneditfiles(e) {
      let os = {
        id: e.id,
        enclosure: this.upload.img.join(","),
      };
      this.$api.http("semesterfileadd", os, () => {
        this.$toast("修改成功");
        this.open6 = false;
        if (this.open2 && this.$refs.open2) {
          this.$refs.open2.onPage(1);
        }
      });
      this.filePage()
    },
    oneditfile(e) {
      console.log(3);
      this.upload = e;
      this.open6 = true;
      this.filePage()
    },
    onuser(e) {
      this.user = e;
      this.ids = e.s_id;
      console.log("自己");
    },
    onfiledet(e) {
      this.ids = e.staff_id;
      if (e.staff_id === this.user.s_id) {
        // console.log("自己");
        this.open2 = true;
      } else {
        this.open4 = true;
      }
    },
    filePage(page, f) {
      if (!f) {
        return this.$refs.filepage.onRefresh();
      }
      if (+page === 1) {
        this.fileitem = [];
      }
      this.$api.http("semesterfiles", { page, type: 0 }, (e) => {
        this.fileitem = this.fileitem.concat(e);
        this.$refs.filepage.onFinish(e.length < 20);
      });
    },
    onDelItem(i) {
      this.item.index = this.item.index.filter((r) => {
        return r.id !== i.id;
      });
    },
    onAddItem() {
      this.item.index.push({
        key: "",
        target: "",
        spurt: "",
        // eslint-disable-next-line
        id: demo.$random.vars(8),
      });
    },
    onAddList(i, j) {
      let len = this.item.work[j].work.filter((s) => {
        return !s.val;
      }).length;
      if (len > 0) {
        return this.$toast("请先完整填写" + i.month + "月重点工作");
      }
      this.item.work[j].work.push({ t: "" });
    },
    onDelList(i, j) {
      this.item.work[i].work = this.item.work[i].work.filter((r, v) => {
        return v !== j;
      });
    },
    onsave() {
      let work = JSON.parse(JSON.stringify(this.item.work)).map((s) => {
        s.work = (s.work || []).map((r) => {
          return r.val || "";
        });
        return s;
      });
      let index = this.item.index;
      this.$api.http(
        "semesteradd",
        {
          semester_index: JSON.stringify(index),
          key_work: JSON.stringify(work),
          semester: this.active,
        },
        () => {
          this.$toast("操作成功");
        }
      );
    },
    init() {
      this.$api.http(
        "semester",
        { semester: this.active, year: new Date().getFullYear() },
        (r) => {
          let work = r.key_work;
          let index = r.semester_index;
          try {
            work = JSON.parse(work).map((s) => {
              if (s.work && s.work.length) {
                s.work = s.work.map((q) => {
                  return { val: q };
                });
              } else {
                s.work = [{ val: "" }];
              }
              return s;
            });
            index = JSON.parse(index);
          } catch (e) {
            let y = new Date().getFullYear();
            let s =
              +this.active === 1 ? [3, 4, 5, 6, 7, 8] : [9, 10, 11, 12, 13, 14];
            work = s.map((r) => {
              let year = r > 12 ? y + 1 : y;
              let month = r > 12 ? r % 12 : r;
              return { month, year, work: [""] };
            });
            index = [{ key: "", spurt: "", target: "" }];
          }
          this.item = { index, work };
          this.activeNames = "1";
        }
      );
    },
  },
  mounted() {
    let month = new Date().getMonth() + 1;
    this.active = month >= 3 && month <= 8 ? "1" : "2";
  },
};
</script>
<style lang='less' scoped>
.bottom {
  position: sticky;
  bottom: 0;
  z-index: 55;
  padding: 10px 15%;
  background-color: #fff;
  border-radius: 8px 8px 0 0;
}
.box {
  position: relative;
  padding-right: 40px;
  margin-bottom: 5px;
  &::before {
    position: absolute;
    left: 0;
    top: 0;
    transform: scale(1.1, 1);
    width: 100%;
    height: 100%;
    background-color: #c3ddf7;
    content: "";
    opacity: 0.2;
  }
  &:nth-child(2n)::before {
    background-color: #c5f8f4;
  }
  .van-cell {
    background: transparent;
  }
  .btn,
  .num {
    position: absolute;
    right: -5px;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 20px;
    color: #999;
  }
  .num {
    top: 0;
    transform: scale(0.7);
    border-radius: 50%;
    border: 1px solid #222;
    color: #333;
  }
  .btn {
    bottom: 30px;
    font-size: 25px;
    color: tomato;
    z-index: 15;
  }
}
.add {
  margin: 20px auto;
  width: 60%;
}
.file_sec {
  padding: 15px;
  position: relative;
  .ava {
    width: 60px;
    height: 60px;
    margin-right: 10px;
  }
  .text {
    width: calc(100% - 70px);
    font-size: 14px;
    line-height: 20px;
    p {
      height: 20px;
      color: #999;
    }
    .name {
      font-weight: 650;
      color: #333;
      b {
        padding-left: 10px;
        display: inline-block;
        color: #ccc;
        font-size: 12px;
        font-weight: 400;
        vertical-align: bottom;
      }
    }
  }
}
.bottom_h {
  height: 60px;
}
.add_file {
  padding: 10px;
  h6 {
    font-weight: 650;
    padding: 8px 0;
    font-size: 15px;
  }
  .image {
    width: 100px;
    height: 100px;
  }
}
iframe {
  display: block;
  width: 100%;
  height: 100%;
}
.down_btn {
  padding: 10px 15%;
}
</style>
