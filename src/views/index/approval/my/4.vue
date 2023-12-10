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
      <h6>详细信息</h6>
      <div class="list_box other">
        <p>
          申请金额：<b>￥{{ ext.amount }}</b>
        </p>
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
    </x-content>
    <x-content class="list">
      <h6>审批说明</h6>
      <div class="list_box explain">
        <p v-html="content"></p>
        <div class="image flex fw" v-if="ext.imgs && ext.imgs.length">
          <div
            class="images"
            v-for="(i, j) in ext.imgs"
            :key="j + 'ex'"
            @click="appShowImage(ext.imgs, j)"
          >
            <van-image :src="i" fit="cover"></van-image>
          </div>
        </div>
      </div>
    </x-content>
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
  </div>
</template>

<script>
import schedule from "./schedule.vue";
export default {
  props: {
    value: null,
    child: [String, Number],
  },
  inject: ["appShowImage"],
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
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
  },
  watch: {
    ext: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
  },
  components: { schedule },
  data() {
    return { isFoot: false };
  },
  methods: {
    checksub(e) {
      this.$emit("changesub", { ...e, approval_id: this.ext.id });
    },
  },
  mounted() {
    this.ext = this.value;
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
</style>
