<template>
  <div class="connection_detail">
    <div class="view_box">
      <div class="v_box flex" @click.stop="isedit ? (open = !open) : null">
        <span class="f1">日期：{{ timeday }}</span>
        <span class="f1 r">姓名：{{ ext.name }}</span>
      </div>
    </div>
    <van-empty v-if="isnoselect" description="请先选择日期"></van-empty>
    <template v-else>
      <van-empty v-if="!item.length"></van-empty>
      <div class="view_box" v-for="(i, j) in item" :key="j">
        <template v-if="+i.sub === 2">
          <template v-if="parentwrite">
            <div class="head">
              <van-image :src="image.head" fit="cover"></van-image>
              <p>{{ i.title }}</p>
            </div>
            <div class="v_box">
              <div class="textarea">
                {{ i.value || "暂无" }}
              </div>
              <template v-if="i.hand">
                <h6>
                  {{ i.label }} <span>{{ i.hand ? "[已签字]" : "" }}</span>
                </h6>
                <div class="hand_img">
                  <van-image
                    :src="i.hand"
                    @click="appShowImage(i.hand)"
                  ></van-image>
                </div>
              </template>
            </div>
          </template>
        </template>
        <template v-else>
          <div class="head">
            <van-image :src="image.head" fit="cover"></van-image>
            <p>{{ i.title }}</p>
          </div>
          <div
            class="v_box"
            :class="{ noedit: !isedit && i.type !== 'textarea' }"
          >
            <template v-if="i.item && i.item.length">
              <section v-for="(x, y) in i.item" :key="y + '-' + j">
                <h6 v-if="x.title">{{ x.title }}</h6>
                <div v-for="(q, w) in x.list" :key="w + '-' + y + '-' + j">
                  <h5 v-if="q.title">{{ q.title }}</h5>
                  <div class="flex fw">
                    <van-tag
                      plain
                      type="default"
                      round
                      v-for="(r, t) in q.children"
                      :key="t + '-' + w + '-' + y + '-' + j"
                      @click="
                        q.value = r.title;
                        q.search = '';
                      "
                      :class="{ active: q.value === r.title }"
                      >{{ r.title }}</van-tag
                    >
                    <template v-if="!isedit">
                      <van-tag
                        class="active"
                        plain
                        type="default"
                        round
                        v-if="q.search"
                        >{{ q.search }}</van-tag
                      >
                    </template>
                    <template v-else>
                      <input
                        type="text"
                        class="inp"
                        placeholder="请输入"
                        v-if="q.add"
                        v-model="q.search"
                        @input="q.value = q.search"
                      />
                    </template>
                  </div>
                </div>
              </section>
            </template>
            <template v-else-if="i.type === 'textarea'">
              <template v-if="!isedit">
                <div class="textarea">
                  {{ i.value || "暂无" }}
                </div>
              </template>
              <template v-else>
                <van-field
                  v-model="i.value"
                  rows="3"
                  autosize
                  type="textarea"
                  placeholder="请输入特殊叮嘱"
                  show-word-limit
                  maxlength="255"
                />
              </template>
              <h6>
                {{ i.label }} <span>{{ hand.data ? "[已签字]" : "" }}</span>
              </h6>
              <template v-if="hand.data">
                <div class="hand_img">
                  <van-image
                    :src="hand.data"
                    @click="appShowImage(hand.data)"
                  ></van-image>
                </div>
                <van-button
                  @click="hand = {}"
                  type="primary"
                  size="small"
                  v-if="isedit"
                  >重签</van-button
                >
              </template>
              <template v-else>
                <v-h
                  v-model="hand"
                  api
                  @on-save="onsavehand"
                  ref="handref"
                  mode
                  @onmode="open1 = true"
                ></v-h>
              </template>
            </template>
          </div>
        </template>
      </div>
    </template>
    <div class="view_box foot">
      <van-button
        block
        round
        :color="$js.btnColor"
        @click="onsubmit"
        v-if="+ext.status !== 2"
        >保存</van-button
      >
    </div>
    <div class="footer_image">
      <van-image :src="image.foot"></van-image>
    </div>
    <v-t :open="open" v-model="t1"></v-t>
    <v-f v-model="open1" :footer="false" text="签名模板">
      <v-m check @change="onchangewrite"></v-m>
    </v-f>
  </div>
</template>

<script>
import vF from "../../private/fixed.vue";
import vT from "../../private/time.vue";
import vH from "../../private/hand.vue";
import vM from "../../user/my/_sign.vue";
export default {
  props: {
    value: null,
    ids: [String, Number],
    timeout: [String, Number],
  },
  data() {
    return {
      issave: false, // 可以保存
      open: false, // 控制日期
      t1: {},
      image: {
        // eslint-disable-next-line
        head: demo.siteConfig.icon("connection_header", "private"),
        // eslint-disable-next-line
        foot: demo.siteConfig.icon("connection_foot", "private"),
      },
      item: [],
      hand: {},
      timer: null,
      teacher_signature: "",
      ext: {},
      open1: false,
    };
  },
  watch: {
    t1: {
      handler(n) {
        if (n.ymd) {
          this.initonce();
        }
      },
      deep: true,
    },
    item: {
      handler() {
        if (this.isedit) {
          this.issave = true;
        }
        this.savetime();
      },
      deep: true,
    },
  },
  computed: {
    localname() {
      let ti = this.t1.ymd.replace(/-/g, "");
      return "connection-" + ti + "-" + this.ids;
    },
    timeday() {
      if (this.t1.ymd) {
        let a = this.t1.obj;
        return [a.y, "年", a.m, "月", a.d, "日"].join("");
      }
      return "选择日期";
    },
    isnoselect() {
      return !this.t1.ymd;
    },
    // 家长已阅
    parentwrite() {
      return +this.ext.state === 2;
    },
    // 老师已签字
    teachwrite() {
      return !!this.ext.teacher_signature;
    },
    // 是否可以编辑
    isedit() {
      return this.ext.status === "" || this.ext.status === "1";
    },
    // 编辑模式
    editmode() {
      return +this.ext.status === 1;
    },
  },
  inject: ["appShowImage", "appTimeout"],
  components: { vF, vT, vH, vM },
  methods: {
    onchangewrite(e) {
      this.open1 = false;
      this.hand = {
        data: e.sign,
        halfway: e.sign.replace(window.location.origin, ""),
      };
      this.onsavehand(this.hand);
    },
    wait(fn) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
        return 0;
      }
      this.timer = setTimeout(() => {
        fn();
        clearTimeout(this.timer);
        this.timer = null;
      }, 500);
    },
    savetime() {
      // 临时保存 localname
      if (!this.issave) return 0;
      this.wait(() => {
        if (this.issave && this.isedit) {
          // eslint-disable-next-line
          demo.$local.set(this.localname, this.item);
        }
      });
    },
    onsavehand(e) {
      this.$set(this.item[4], "hand", e.data);
      this.$set(this.item[4], "path", e.halfway);
      this.teacher_signature = e.halfway;
      // eslint-disable-next-line
      demo.$local.set("work_connection-write", e.data);
    },
    onsubmit() {
      if (!this.teacher_signature || !this.hand.data) {
        if (this.$refs.handref && this.$refs.handref[0]) {
          this.$refs.handref[0].submit();
        }
        return 0;
      }
      let os = {
        record_date: this.t1.ymd,
        child_id: this.ids,
        content: JSON.stringify(this.item),
        teacher_signature:
          "/uploads" + this.teacher_signature.split("/uploads")[1],
      };
      this.$api.http("connectionadd", os, () => {
        // eslint-disable-next-line
        demo.$local.clear(this.localname);
        this.$toast("保存成功");
        this.$emit("close", this.t1.ymd);
      });
    },
    init() {
      this.$nextTick(() => {
        if (this.isedit) {
          // eslint-disable-next-line
          let a = demo.$local.get(this.localname, []);
          if (a.length) {
            this.item = a;
          }
        }

        this.issave = false;

        if (this.editmode) {
          return 0;
        }

        // 新增 查看是否有签名 有则自动加入
        // eslint-disable-next-line
        let sign = demo.$local.get("work_connection-write", "");
        if (sign) {
          this.onchangewrite({ sign });
        } else {
          this.$api.http("usermysign", {}, (r) => {
            if (r.length > 0) {
              this.onchangewrite({ sign: r[0].sign });
            }
          });
        }
      });
    },
    initonce() {
      this.$api.http(
        "connectiondet",
        { child_id: this.ids, record_date: this.t1.ymd, park_records_id: "" },
        (res) => {
          this.ext = res;
          // eslint-disable-next-line
          demo.title(res.name + "的在园记录表");

          this.$nextTick(() => {
            if (this.teachwrite) {
              this.hand = {
                data: res.teacher_signature,
              };
              this.teacher_signature =
                "/uploads" + res.teacher_signature.split("/uploads")[1];
            } else {
              this.hand = {};
              this.teacher_signature = "";
              if (this.$refs.handref && this.$refs.handref[0]) {
                this.$refs.handref[0].clear();
              }
            }
          });

          if (res.content === "") {
            this.inititem();
          } else {
            try {
              this.item = JSON.parse(res.content);
              this.init();
            } catch (e) {
              this.inititem();
            }
          }
        }
      );
    },
    inititem() {
      // eslint-disable-next-line
      demo.siteConfig.tojson("connection", (r) => {
        this.item = r.map((s) => {
          if (s.item && s.item.length) {
            s.item = s.item.map((k) => {
              k.list = k.list.map((r) => {
                let val = (r.children || [])[0].title || "";
                r.value = val;
                if (r.add) {
                  r.search = "";
                }
                return r;
              });
              return k;
            });
          }
          return s;
        });
        this.init();
      });
    },
  },
  mounted() {
    let t = this.timeout || "";
    this.t1 = {
      // eslint-disable-next-line
      ymd: demo.timeout(t, "ymd", "-"),
      // eslint-disable-next-line
      obj: demo.timeout(t, "object"),
    };
    this.initonce();
  },
};
</script>
<style lang='less' scoped>
.connection_detail {
  position: relative;
  min-height: 100%;
  .view_box {
    padding: 17px 13px;
    box-sizing: border-box;
    position: relative;
    &::before {
      position: absolute;
      content: "";
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        rgba(253, 220, 159, 0.2),
        rgba(169, 215, 255, 0.2)
      );
    }
    &:nth-child(2n) {
      &::before {
        background: linear-gradient(
          rgba(169, 215, 255, 0.2),
          rgba(253, 220, 159, 0.2)
        );
      }
    }
    .head {
      width: 195px;
      margin: 0 auto 15px;
      padding: 10px 0;
      position: relative;
      .van-image {
        position: absolute;
        left: 0;
        top: 0;
      }
      line-height: 15px;
      font-size: 14px;
      color: #fff;
      box-sizing: border-box;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      > p {
        position: relative;
        z-index: 15;
        text-indent: -10px;
        letter-spacing: 1px;
      }
    }
    .v_box {
      padding: 20px 17px;
      position: relative;
      z-index: 20;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      background-color: #fff;
      font-size: 13px;
      &.flex {
        .f1 {
          font-weight: 650;
          flex: 1;
          &.r {
            text-align: right;
          }
        }
      }
      .van-tag {
        padding: 5px 15px;
        margin: 0 25px 15px 0;
        cursor: pointer;
        min-width: 70px;
        box-sizing: border-box;
        justify-content: center;
        &.active {
          background: rgba(25, 137, 250, 0.1);
          color: #1989fa;
          border-color: #1989fa;
        }
      }
      .inp {
        height: 26px;
        border-radius: 13px;
        box-sizing: border-box;
        line-height: 24px;
        padding: 0 10px;
        width: 130px;
      }
      &::before {
        position: absolute;
        content: "";
        z-index: -1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
      &.noedit::before {
        z-index: 50;
      }
    }
    &.foot {
      padding: 5px 10% 90px;
    }
  }
  .textarea {
    padding-bottom: 10px;
  }
  h6 {
    padding: 5px 0;
    margin-bottom: 5px;
    font-weight: 600;
    color: #838c95;
    font-size: 13px;
  }
  section h6 {
    margin-top: 10px;
  }
  h5 {
    font-size: 11px;
    margin-bottom: 15px;
    color: #80c1fb;
    & + div {
      padding-bottom: 10px;
    }
  }
  .hand_img {
    height: 198px;
    & + .van-button {
      margin-top: 8px;
      min-width: 80px;
    }
  }
  .footer_image {
    height: 76px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 50;
  }
}
</style>
