<template>
  <div class="a_my">
    <x-content></x-content>
    <x-content>
      <div class="no flex">
        <p class="num">审批单号：{{ ext.approval_number }}</p>
        <p class="time">{{ ext.apply_time }}</p>
      </div>
    </x-content>
    <x-content class="list">
      <p>
        审批状态：<b :class="'c_' + (ext.status > 0 ? ext.status : '0')">
          {{
            isNaN(ext.status)
              ? ext.status
              : ["", "待审核", "已通过", "已撤销"][ext.status] || "已拒绝"
          }}
        </b>
      </p>
      <p v-if="ext.reasons_refusal">拒绝原因：{{ ext.reasons_refusal }}</p>
    </x-content>
    <x-content class="list">
      <p>
        报销数量： 共{{ (ext.receipt || []).length }}项，报销金额共<b
          class="col_danger"
          >{{ allPrice }}</b
        >元
      </p>
    </x-content>
    <x-content class="list">
      <h6>报销明细</h6>
      <template v-if="+child === 0 && +ext.status === 1">
        <div class="list_box other items">
          <section v-for="(i, j) in ext.receipt" :key="j + 'sw'">
            <van-cell
              title="报销类别："
              :value="i.classify_name"
              is-link
              @click="onOpen(0, j)"
            />
            <van-cell
              title="报销明细："
              :value="i.level_classify_name"
              is-link
              @click="onOpen(1, j)"
            />
            <van-field
              v-model="i.remarks"
              label="备注："
              placeholder="请输入备注"
              label-width="3em"
            />
            <van-cell title="报销金额：" :value="i.amount" />
          </section>
        </div>
      </template>
      <template v-else>
        <div class="list_box other item">
          <section
            v-for="(i, j) in ext.receipt"
            :key="j + 'sw'"
            class="van-hairline--bottom"
          >
            <p>
              报销类别：<b>{{ i.classify_name || "无" }}</b>
            </p>
            <p>
              报销明细：<b>{{ i.level_classify_name || "无" }}</b>
            </p>
            <p>
              报销金额：<b>{{ i.amount }}</b>
            </p>
            <p v-if="i.remarks">
              备注：<b>{{ i.remarks }}</b>
            </p>
          </section>
        </div>
      </template>
    </x-content>
    <x-content class="list">
      <h6>详细信息</h6>
      <div class="list_box other">
        <template v-if="+child !== 1">
          <p>
            申请部门:<b>{{ ext.apply_group }}</b>
          </p>
          <p>
            申请人:<b>{{ ext.apply_name }}</b>
          </p>
          <p>
            联系电话:<b
              ><a :href="'tel:' + ext.apply_contact">{{
                ext.apply_contact
              }}</a></b
            >
          </p>
        </template>
        <template v-else-if="+child === 1">
          <p>
            审批部门：<b>{{ ext.approval_group }}</b>
          </p>
          <p>
            审批人：<b>{{ ext.approval_name }}</b>
          </p>
          <p>
            联系电话:<b
              ><a :href="'tel:' + ext.approval_contact">{{
                ext.approval_contact
              }}</a></b
            >
          </p>
        </template>
        <p>
          申请时间:<b>{{ ext.apply_time }}</b>
        </p>
        <p>
          知会人:
          <b v-if="ext.inform && ext.inform.length">
            <van-tag
              plain
              type="primary"
              v-for="(i, j) in ext.inform"
              :key="j + 'e'"
            >
              <a :href="'tel:' + i.inform_contact">
                {{ i.inform_name }}-{{ i.inform_contact }}
              </a>
            </van-tag>
          </b>
          <b v-else>无</b>
        </p>
      </div>
    </x-content>
    <x-content class="list">
      <h6>银行信息</h6>
      <template v-if="+child === 0 && +ext.status === 1">
        <div class="list_box other items">
          <section>
            <van-field
              v-model="ext.account_name"
              label="开户银行:"
              placeholder="请输入开户银行"
              label-width="6em"
            />
            <van-field
              v-model="ext.bank_no"
              label="银行账号:"
              placeholder="请输入银行账号"
              label-width="6em"
            />
            <van-field
              v-model="ext.bank_name"
              label="开户姓名:"
              placeholder="请输入开户姓名"
              label-width="6em"
            />
          </section>
        </div>
      </template>
      <template v-else>
        <div class="list_box other">
          <p>
            开户银行:<b>{{ ext.account_name || "未填写" }}</b>
          </p>
          <p>
            银行账号:<b>{{ ext.bank_no || "未填写" }}</b>
          </p>
          <p>
            开户姓名:<b>{{ ext.bank_name || "未填写" }}</b>
          </p>
        </div>
      </template>
    </x-content>
    <x-content class="list">
      <h6>审批说明</h6>
      <div class="list_box explain">
        <template v-if="+child === 1 && +ext.status === 1">
          <v-d edit v-model="ans" @change="oneditanswer" ref="answer2"></v-d>
        </template>
        <template v-else>
          <p v-html="content"></p>
          <div class="image flex fw" v-if="ext.imgs && ext.imgs.length">
            <div
              class="images"
              v-for="(i, j) in extImage"
              :key="j + 'ex'"
              @click="onShowImage(j)"
            >
              <van-image :src="i.pic" fit="cover"></van-image>
            </div>
          </div>
        </template>
      </div>
    </x-content>
    <!-- 审批回复 -->
    <!-- <x-content class="list" v-if="isFoot && +ext.status === 1">
      <van-cell
        title="审批回复"
        label="审批说明不够详细或无法具体表达事件！可点击此处进行审批回复"
        is-link
        @click="open2 = true"
      ></van-cell>
    </x-content> -->
    <template v-if="(isFoot || +child === 1) && +ext.status === 1">
      <template v-if="ext.approval_explain && ext.approval_explain.length">
        <x-content class="list">
          <h6>审批回复</h6>
          <div class="list_box answer_list">
            <section
              v-for="(i, j) in ext.approval_explain"
              :key="j + 'fd'"
              class="flex"
            >
              <span class="time"
                >发表时间：{{ appTimeout(i.create_time, true) }}</span
              >
              <div class="logo">
                <van-image :src="i.staff.avatar"></van-image>
              </div>
              <div class="f1">
                <h6>{{ i.staff.name }}</h6>
                <p class="tel">{{ i.staff.contact }}</p>
                <p>
                  回复内容：{{ i.content }}
                  <van-tag type="primary" v-if="+i.status === 2"
                    >已回复</van-tag
                  >
                </p>
                <div class="imgs" v-if="i.file && i.file.length">
                  <div
                    class="img"
                    v-for="(x, y) in toImages(i.file)"
                    :key="y + 'f' + j"
                  >
                    <van-image
                      :src="x.pic"
                      fit="cover"
                      @click="x.show ? appShowImage(x.pic) : towatchanswer(x)"
                    ></van-image>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </x-content>
      </template>
      <v-d
        v-model="ans"
        @change="onsaveanswer"
        v-if="+child === 0"
        ref="answer"
      ></v-d>
    </template>
    <!-- 被审批回复 -->
    <!-- <template
      v-if="
        +child === 1 &&
        +ext.status === 1 &&
        ext.approval_explain &&
        ext.approval_explain.length
      "
    >
      <x-content class="list">
        <h6>审批回复</h6>
        <div class="list_box answer_list">
          <section
            v-for="(i, j) in ext.approval_explain"
            :key="j + 'fd'"
            class="flex"
          >
            <span class="time"
              >发表时间：{{ appTimeout(i.create_time, true) }}</span
            >
            <div class="logo">
              <van-image :src="i.staff.avatar"></van-image>
            </div>
            <div class="f1">
              <h6>{{ i.staff.name }}</h6>
              <p class="tel">{{ i.staff.contact }}</p>
              <p>
                回复内容：{{ i.content }}
                <van-tag type="primary" v-if="+i.status === 2">已回复</van-tag>
              </p>
              <div class="imgs" v-if="i.file && i.file.length">
                <div
                  class="img"
                  v-for="(x, y) in toImages(i.file)"
                  :key="y + 'f' + j"
                >
                  <van-image
                    :src="x.pic"
                    fit="cover"
                    @click="x.show ? appShowImage(x.pic) : towatchanswer(x)"
                  ></van-image>
                </div>
              </div>
            </div>
          </section>
        </div>
      </x-content>
      <x-content class="list">
        <van-cell
          title="审批回复"
          label="审批被拒！可点击此处进行审批回复"
          is-link
          @click="open2 = true"
        ></van-cell>
      </x-content>
    </template> -->
    <x-content class="list">
      <h6>审批进度</h6>
      <div class="list_box explain">
        <schedule
          :schedule="ext.schedule"
          v-model="isFoot"
          :check="+child === 1"
          @checksub="checksub"
        ></schedule>
      </div>
    </x-content>
    <x-content v-if="isFoot || +child === 1">
      <div class="is_height"></div>
      <div class="cover_footer">
        <template v-if="+child === 0 && +ext.status === 1">
          <slot />
        </template>
        <template v-if="+child === 1 && +ext.status === 1">
          <slot name="footer" />
        </template>
      </div>
    </x-content>
    <x-content></x-content>
    <v-f :index="501" v-model="open" text="选择分类" :footer="false">
      <van-empty v-if="!ify.length" description="暂无分类"></van-empty>
      <van-radio-group v-model="childs">
        <van-collapse v-model="radio" accordion>
          <van-collapse-item
            :name="i.classify_id"
            v-for="(i, j) in ify"
            :key="j + 'f'"
          >
            <template #title>
              <div class="fonts">{{ i.classify_name }}</div>
            </template>
            <van-cell-group>
              <van-cell
                :title="x.classify_name"
                clickable
                @click="childs = childs === x.classify_id ? '' : x.classify_id"
                v-for="(x, y) in i.children"
                :key="y + 'f' + j"
              >
                <template #right-icon>
                  <van-radio :name="x.classify_id" />
                </template>
              </van-cell>
              <van-cell title="其他" @click="childs = childs === -1 ? '' : -1">
                <template #right-icon>
                  <van-radio :name="-1" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-collapse-item>
        </van-collapse>
        <div class="none12"></div>
      </van-radio-group>
      <div class="w80" v-if="radio !== ''">
        <van-button block round :color="$js.btnColor" @click="onSelectRadio">{{
          subtext
        }}</van-button>
      </div>
    </v-f>
    <v-f v-model="showText" :footer="false" text="查看">
      <iframe :src="iframes" frameborder="0" class="db_image"></iframe>
    </v-f>
    <!-- <v-f v-model="open2" :footer="false" text="审批回复" :index="502" cover>
      <template v-if="ext.approval_explain && ext.approval_explain.length">
        <x-content class="list">
          <h6>审批回复</h6>
          <div class="list_box answer_list">
            <section
              v-for="(i, j) in ext.approval_explain"
              :key="j + 'fd'"
              class="flex"
            >
              <span class="time"
                >发表时间：{{ appTimeout(i.create_time, true) }}</span
              >
              <div class="logo">
                <van-image :src="i.staff.avatar"></van-image>
              </div>
              <div class="f1">
                <h6>{{ i.staff.name }}</h6>
                <p class="tel">{{ i.staff.contact }}</p>
                <p>
                  回复内容：{{ i.content }}
                  <van-tag type="primary" v-if="+i.status === 2"
                    >已回复</van-tag
                  >
                </p>
                <div class="imgs" v-if="i.file && i.file.length">
                  <div
                    class="img"
                    v-for="(x, y) in toImages(i.file)"
                    :key="y + 'f' + j"
                  >
                    <van-image
                      :src="x.pic"
                      fit="cover"
                      @click="x.show ? appShowImage(x.pic) : towatchanswer(x)"
                    ></van-image>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </x-content>
      </template>
      <v-d v-model="ans" @change="onsaveanswer"></v-d>
    </v-f> -->
    <v-f v-model="open3" :footer="false" :index="510" text="查看附件">
      <iframe :src="framesrc" frameborder="0"></iframe>
    </v-f>
  </div>
</template>

<script>
import schedule from "./schedule.vue";
import vF from "../../../private/fixed.vue";
import vD from "./answer.vue";
export default {
  props: {
    value: null,
    child: [String, Number],
  },
  inject: ["appShowImage", "appTimeout"],
  computed: {
    content() {
      let ext = this.ext;
      let v = ext.content
        ? ext.content
        : ext.imgs && ext.imgs.length
        ? ""
        : "无";
      return this.$js.strToHtml(v);
    },
    allPrice() {
      let a = (this.ext.receipt || []).map((s) => s.amount);
      // eslint-disable-next-line
      return demo.array(a.concat(0)).sum(0);
    },
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
    extImage() {
      let i = this.ext.imgs || [];
      if (!i.length) return [];
      return this.toImages(i);
    },
    iframes() {
      if (this.textsrc) {
        return this.$js.config.api.see + "?t=" + this.textsrc;
      }
      return "";
    },
    subtext() {
      if (this.childs) {
        return "确认选择";
      }
      if (this.radio) {
        let id = this.radio;
        let t = "该分类";
        try {
          let v = this.ify.filter((r) => {
            return r.classify_id === id;
          })[0];
          t = ["【", v.classify_name, "】"].join("");
        } catch (e) {}
        return "选择" + t;
      }
      return "取消选择";
    },
  },
  watch: {
    ext: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
    radio() {
      this.childs = "";
    },
  },
  components: { schedule, vF, vD },
  data() {
    return {
      isFoot: false,
      ify: [],
      index: 0,
      select_index: 0,
      a: "",
      radio: "",
      childs: "",
      open: false,
      showText: false,
      textsrc: "",
      // open2: false,
      ans: {},
      open3: false,
      framesrc: "",
    };
  },
  methods: {
    checksub(e) {
      this.$emit("changesub", { ...e, approval_id: this.ext.id });
    },
    toImages(i) {
      return JSON.parse(JSON.stringify(i)).map((s) => {
        let x = s.split(".");
        x = x[x.length - 1];
        let os = { pic: s, suffix: x, show: true, url: s };
        switch (x) {
          case "docx":
          case "doc":
          case "pdf":
          case "xls":
          case "xlsx":
            // eslint-disable-next-line
            os.pic = demo.siteConfig.uploadShow(x);
            os.show = false;
            break;
          default:
        }
        return os;
      });
    },
    towatchanswer(e) {
      // eslint-disable-next-line
      this.framesrc = demo.siteConfig.api.see + "?t=" + e.url;
      this.open3 = true;
    },
    onsaveanswer(e) {
      let approval_id = +this.child === 0 ? this.ext.a_id : this.ext.id;
      let os = {
        ...e,
        approval_id: this.ext.id,
      };
      this.$api.http("approvalMyAnswer", os, () => {
        this.$toast("回复成功");
        // this.open2 = false;
        this.$emit("reset", { id: approval_id });
        this.$refs.answer.onreset();
      });
    },
    oneditanswer(e) {
      let os = {
        ...e,
        approval_id: this.ext.id,
      };
      this.$api.http("approvalMyAnswer", os, () => {
        this.$toast("提交成功");
        this.$emit("reset", { id: this.ext.id });
        // this.$refs.answer2.onreset();
      });
    },
    onShowImage(index) {
      let v = this.extImage[index];
      if (v.show) {
        this.appShowImage(v.pic);
      } else {
        this.showText = true;
        this.textsrc = this.ext.imgs[index];
      }
    },
    onSelectRadio() {
      this.open = false;
      let id = this.radio;
      let val = this.ify.filter((r) => +r.classify_id === +id);
      if (val.length) {
        val = val[0];
        this.$set(
          this.ext.receipt[this.index],
          "classify_name",
          val.classify_name
        );
        this.$set(this.ext.receipt[this.index], "classify_id", val.classify_id);
        let jid = this.childs;
        if (+jid === -1) {
          this.$set(
            this.ext.receipt[this.index],
            "level_classify_name",
            "其他"
          );
          this.$set(this.ext.receipt[this.index], "level_classify_id", "");
          return 0;
        }
        let child =
          (val.children || []).filter((s) => {
            return +s.classify_id === +jid;
          })[0] || {};
        this.$set(
          this.ext.receipt[this.index],
          "level_classify_name",
          child.classify_name
        );
        this.$set(
          this.ext.receipt[this.index],
          "level_classify_id",
          child.classify_id
        );
      } else {
        console.log("取消选择");
        this.$set(this.list[this.index], "classify_name", "");
        this.$set(this.list[this.index], "classify_id", "");
        this.$set(this.list[this.index], "level_classify_name", "");
        this.$set(this.list[this.index], "level_classify_id", "");
      }
    },
    toZindex(id) {
      return { "z-index": this.radio === id ? "5" : 4 };
    },
    toStyle() {
      this.$nextTick(() => {
        let poa = this.$refs.poa[0];
        let line = this.$refs.child[0];
        if (poa && line) {
          line.style.height = poa.clientHeight + 10 + "px";
        }
      });
      return {};
    },
    onOpen(i, j) {
      this.open = true;
      this.index = j;
      this.select_index = i;
    },
    init() {
      this.$api.http("financeifyget", { classify_type: 2 }, (res) => {
        // eslint-disable-next-line
        this.ify = demo.tree(res, "classify_id", "pid");
      });
      if (+this.child === 1 && +this.ext.status === 1) {
        this.ans = this.ext;
      }
    },
  },
  mounted() {
    this.ext = this.value;
    this.init();
  },
};
</script>
<style lang='less' scoped>
.c_1 {
  color: #ffb408 !important;
}
.c_2 {
  color: #99cc33 !important;
}
.c_0 {
  color: #ff0000 !important;
}
.c_3 {
  color: #666666 !important;
}
.list {
  padding: 10px;
  border-radius: 10px;
  background-color: #fff;
  box-sizing: border-box;
  box-shadow: 0 5px 5px rgb(243, 243, 243);
  font-size: 15px;
  color: #333;
  h6 {
    padding: 5px 0 10px;
    font-weight: 650;
    color: #999;
  }
  & > p + p {
    margin-top: 8px;
  }
}
.no {
  font-size: 12px;
  .time {
    flex: 1;
    text-align: right;
  }
}
.other {
  font-size: 14px;
  p {
    padding: 5px 0;
    color: #999;
    b {
      color: #333;
      font-weight: 650;
      padding-left: 5px;
    }
  }
  .van-tag {
    margin: 0 5px 5px 0;
  }
}
a {
  color: inherit;
}
.explain {
  font-size: 14px;
  p {
    color: #333;
    line-height: 1.2;
  }
  .image {
    padding-top: 8px;
    .images {
      width: 80px;
      height: 80px;
      margin: 0 5px 10px 0;
      &:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
}
.item {
  section {
    padding: 8px 0;
    &:first-child {
      padding-top: 0;
    }
  }
}
.items section {
  background-color: rgba(151, 149, 240, 0.2);
  margin-bottom: 8px;
  &:nth-child(2n) {
    background-color: rgba(251, 200, 212, 0.2);
  }
  &:first-child {
    background-color: #fff;
  }
  &:last-child {
    margin-bottom: 0;
  }
  .van-cell {
    background-color: transparent;
  }
}
.is_height {
  height: 50px;
}
.cover_footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  z-index: 600;
  display: flex;
}
.select_list {
  width: 50%;
  box-sizing: border-box;
  font-size: 16px;
  margin-bottom: 5px;
  position: relative;
  .head {
    font-weight: 650;
    padding: 8px;
    box-sizing: border-box;
    p {
      flex: 1;
    }
  }
  .select_child {
    position: relative;
    &.right {
      .poa {
        left: 0;
      }
    }
    .poa {
      position: absolute;
      top: 0;
      left: -100%;
      width: 200%;
      box-sizing: border-box;
      padding: 8px;
      background-color: rgb(239, 255, 254);
      font-size: 14px;
      .select_child_list {
        width: 50%;
        padding: 8px;
        box-sizing: border-box;
        display: flex;
        p {
          flex: 1;
        }
      }
    }
  }
}
.answer {
  padding: 10px;
  margin-top: 8px;
}
.answer_list {
  section {
    position: relative;
    .logo {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      margin-top: 10px;
    }
    .f1 {
      width: calc(100% - 40px);
      box-sizing: border-box;
      padding-left: 10px;
      font-size: 15px;
      h6 {
        padding: 5px 0;
        font-weight: 650;
      }
      p {
        font-size: 14px;
        line-height: 1.5;
        word-break: break-all;
      }
      .tel {
        color: #ccc;
        font-size: 12px;
      }
    }
    .time {
      position: absolute;
      right: 5px;
      top: 5px;
      font-size: 12px;
      color: #ccc;
    }
    .imgs {
      display: flex;
      flex-wrap: wrap;
      margin: 5px 0;
      .img {
        width: 84px;
        height: 84px;
        margin: 0 8px 8px 0;
      }
    }
    & + section {
      margin-top: 10px;
    }
  }
}
iframe {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
