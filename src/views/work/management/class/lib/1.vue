<template>
  <div class="class_1">
    <v-l title="基本信息" small more>
      <van-field
        v-model="detail.name"
        label="宝宝姓名"
        colon
        required
        placeholder="请输入宝宝姓名"
        maxlength="12"
        label-width="5em"
      />
      <van-field label="性别" colon readonly required label-width="5em">
        <template #button>
          <van-radio-group
            direction="horizontal"
            class="radio"
            v-model="detail.genders"
          >
            <van-radio :name="1">男</van-radio>
            <van-radio :name="2">女</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
        label="出生日期"
        colon
        placeholder="请选择宝宝出生日期"
        readonly
        required
        right-icon="arrow"
        label-width="5em"
        v-model="detail.birthday"
        @click="open1 = !open1"
      />
      <van-field
        label="证件号码"
        colon
        placeholder="请输入证件号码"
        maxlength="20"
        required
        label-width="5em"
        v-model="detail.id_card"
      />
      <template #more>
        <van-field
          label="英文名"
          colon
          placeholder="请输入宝宝英文名"
          maxlength="12"
          label-width="5em"
          v-model="detail.en_name"
        />
        <van-field
          label="兴趣爱好"
          colon
          placeholder="请输入宝宝兴趣爱好"
          maxlength="50"
          label-width="5em"
          v-model="detail.hobby"
        />
        <van-field
          label="现住址"
          colon
          placeholder="请选择现住址"
          readonly
          right-icon="arrow"
          label-width="5em"
          @click="open2 = !open2"
          v-model="s2"
        />
        <van-field
          label="详细地址"
          colon
          placeholder="请输入详细地址"
          maxlength="125"
          label-width="5em"
          v-model="detail.now_detail"
        />
        <van-field
          label="国籍"
          colon
          placeholder="请选择国籍"
          readonly
          right-icon="arrow"
          label-width="5em"
          @click="open3 = !open3"
          v-model="s3"
        />
        <van-field
          label="民族"
          colon
          placeholder="请填写民族"
          maxlength="20"
          label-width="5em"
          v-model="detail.ethnic"
        />
        <van-field
          label="血型"
          colon
          placeholder="请选择血型"
          readonly
          right-icon="arrow"
          label-width="5em"
          @click="open4 = !open4"
          v-model="s4"
        />
        <van-field
          label="宗教"
          colon
          placeholder="请填写宗教"
          maxlength="20"
          label-width="5em"
          v-model="detail.religion"
        />
        <van-field
          label="入园日期"
          colon
          placeholder="请选择入园日期"
          readonly
          right-icon="arrow"
          label-width="5em"
          v-if="detail.baby_files"
          v-model="detail.baby_files.enrollment_data"
          @click="open5 = !open5"
        />
      </template>
    </v-l>
    <v-l title="健康信息" small more v-if="detail.baby_files">
      <van-field
        label="身高/cm"
        colon
        placeholder="请输入身高"
        type="number"
        required
        label-width="5em"
        v-model="detail.baby_files.height"
      />
      <van-field
        label="体重/kg"
        colon
        placeholder="请输入体重"
        type="number"
        required
        label-width="5em"
        v-model="detail.baby_files.weight"
      />
      <van-field
        label="是否独生子女"
        colon
        readonly
        required
        label-width="10em"
      >
        <template #button>
          <van-radio-group
            direction="horizontal"
            class="radio"
            v-model="detail.baby_files.only_child_or_not"
          >
            <van-radio name="1">是</van-radio>
            <van-radio name="2">否</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <template #more>
        <van-field
          label="有无高热惊厥史"
          colon
          readonly
          required
          label-width="10em"
        >
          <template #button>
            <van-radio-group
              direction="horizontal"
              class="radio"
              v-model="detail.baby_files.febrile_convulsion_history"
            >
              <van-radio name="1">有</van-radio>
              <van-radio name="2">无</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          label="是否残疾幼儿"
          colon
          readonly
          required
          label-width="10em"
        >
          <template #button>
            <van-radio-group
              direction="horizontal"
              class="radio"
              v-model="detail.baby_files.disabled_or_not"
            >
              <van-radio name="1">有</van-radio>
              <van-radio name="2">无</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          label="有无先天性疾病"
          colon
          readonly
          required
          label-width="10em"
        >
          <template #button>
            <van-radio-group
              direction="horizontal"
              class="radio"
              v-model="detail.baby_files.congenital_disability_history"
            >
              <van-radio name="1">有</van-radio>
              <van-radio name="2">无</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          label="有无过敏史(过敏源)"
          colon
          readonly
          required
          label-width="10em"
        >
          <template #button>
            <van-radio-group
              direction="horizontal"
              class="radio"
              v-model="detail.baby_files.allergic_history"
            >
              <van-radio name="1">有</van-radio>
              <van-radio name="2">无</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </template>
    </v-l>
    <v-l title="家庭成员信息" small add>
      <template #add>
        <span
          class="add_btn col_green"
          @click="onadds(1, 'baby_family_members')"
          >新增</span
        >
      </template>
      <template
        v-if="detail.baby_family_members && detail.baby_family_members.length"
      >
        <section v-for="(i, j) in detail.baby_family_members" :key="j + 'a1'">
          <van-field
            label="姓名"
            colon
            placeholder="请输入姓名"
            maxlength="12"
            label-width="5em"
            v-model="i.members_name"
          >
            <template #button>
              <van-button
                size="mini"
                color="tomato"
                icon="cross"
                @click="ondels(j, 'baby_family_members')"
              ></van-button>
            </template>
          </van-field>
          <van-field
            label="关系"
            colon
            placeholder="请输入与宝宝关系"
            maxlength="12"
            label-width="5em"
            v-model="i.filiation"
          />
          <van-field
            label="学历"
            colon
            placeholder="请选择学历"
            readonly
            label-width="5em"
            is-link
            :value="toa6(i.degree)"
            @click="onopen6(j)"
          />
          <van-field
            label="身份证"
            colon
            placeholder="请输入身份证号码"
            maxlength="20"
            label-width="5em"
            v-model="i.id_card_no"
          />
          <van-field
            label="联系方式"
            colon
            placeholder="请输入联系方式"
            maxlength="20"
            type="tel"
            label-width="5em"
            v-model="i.number"
          />
          <van-field
            label="工作单位"
            colon
            placeholder="请输入工作单位"
            maxlength="125"
            type="textarea"
            rows="2"
            autosize
            label-width="5em"
            show-word-limit
            v-model="i.employer"
          />
        </section>
      </template>
      <van-empty v-else description="暂无家庭成员信息">
        <van-button
          size="small"
          round
          class="add_empty_btn"
          type="info"
          @click="onadds(1, 'baby_family_members')"
          >新增</van-button
        >
      </van-empty>
    </v-l>
    <v-l title="接送人" small add>
      <template #add>
        <span
          class="add_btn col_green"
          @click="onadds(2, 'baby_transfer_person')"
          >新增</span
        >
      </template>
      <template
        v-if="detail.baby_transfer_person && detail.baby_transfer_person.length"
      >
        <section v-for="(i, j) in detail.baby_transfer_person" :key="j + 'a6'">
          <van-field
            label="姓名"
            colon
            placeholder="请输入姓名"
            maxlength="12"
            label-width="5em"
            v-model="i.pick_up_person"
          >
            <template #button>
              <van-button
                size="mini"
                color="tomato"
                icon="cross"
                @click="ondels(j, 'baby_transfer_person')"
              ></van-button>
            </template>
          </van-field>
          <van-field
            label="证件类型"
            colon
            readonly
            placeholder="请选择证件类型"
            maxlength="12"
            label-width="5em"
            v-model="i.id_type"
            @click="onopen7(j)"
          />
          <van-field
            label="证件号码"
            colon
            placeholder="请输入证件号码"
            maxlength="20"
            label-width="5em"
            v-model="i.id_no"
          />
          <van-field
            label="联系方式"
            colon
            placeholder="请输入联系方式"
            maxlength="20"
            label-width="5em"
            type="tel"
            v-model="i.contact_number"
          />
          <van-field
            label="幼儿关系"
            colon
            placeholder="请输入与幼儿关系"
            maxlength="25"
            label-width="5em"
            v-model="i.relationship"
          />
        </section>
      </template>
      <van-empty v-else description="暂无接送人信息">
        <van-button
          size="small"
          round
          class="add_empty_btn"
          type="info"
          @click="onadds(2, 'baby_transfer_person')"
          >新增</van-button
        >
      </van-empty>
    </v-l>
    <v-l title="附件" small more v-if="showinit">
      <van-cell is-link>
        <template #title>
          <van-tag type="danger" round>必传</van-tag>
          <span class="custom-title">户口本(户主)</span>
        </template>
      </van-cell>
      <v-upload-once v-model="i1" class="image1"></v-upload-once>
      <van-cell is-link>
        <template #title>
          <van-tag type="danger" round>必传</van-tag>
          <span class="custom-title">户口宝宝页</span>
        </template>
      </van-cell>
      <v-upload-once v-model="i2" class="image1"></v-upload-once>
      <van-cell is-link>
        <template #title>
          <van-tag type="danger" round>必传</van-tag>
          <span class="custom-title">接种本</span>
        </template>
      </van-cell>
      <v-uploads v-model="i3" type="i3">
        <div class="image2">
          <v-upload
            more
            moreLength="9"
            @on-path="onpath3"
            @on-loading="onpath3"
            ids="upload-3-file"
          ></v-upload>
        </div>
      </v-uploads>
      <template #more>
        <van-cell title="户口爸爸页"></van-cell>
        <v-upload-once v-model="i4" class="image1"></v-upload-once>
        <van-cell title="户口妈妈页"></van-cell>
        <v-upload-once v-model="i5" class="image1"></v-upload-once>
        <van-cell title="家庭合影"></van-cell>
        <v-uploads v-model="i6" type="i6">
          <div class="image2">
            <v-upload
              more
              moreLength="9"
              @on-path="onpath6"
              @on-loading="onpath6"
              ids="upload-6-file"
            ></v-upload>
          </div>
        </v-uploads>
      </template>
    </v-l>
    <v-l title="其他档案" small></v-l>
    <div class="pad10" v-if="showinit">
      <v-uploads v-model="i7" type="i7" :lists="i7">
        <div class="image2">
          <v-upload
            more
            moreLength="9"
            @on-path="onpath7"
            @on-loading="onpath7"
            ids="upload-7-file"
          ></v-upload>
        </div>
      </v-uploads>
    </div>
    <div class="w60">
      <van-button block round :color="$js.btnColor" @click="onsubmit"
        >保存</van-button
      >
    </div>
    <v-t :open="open1" v-model="detail.birthday" ymd max="d_1"></v-t>
    <template v-if="detail.baby_files">
      <v-t
        :open="open5"
        v-model="detail.baby_files.enrollment_data"
        ymd
        max="d_1"
      ></v-t>
    </template>
    <v-s
      :open="open2"
      :list="val2"
      @change="onselectchange"
      type="s2"
      noselect
    ></v-s>
    <v-s
      :open="open3"
      :list="val3"
      type="s3"
      @change="onselectchange"
      noselect
    ></v-s>
    <v-s
      :open="open4"
      :list="val4"
      type="s4"
      @change="onselectchange"
      noselect
    ></v-s>
    <v-s
      :open="open6"
      :list="val6"
      type="s6"
      @change="onselectchange"
      noselect
    ></v-s>
    <v-s
      :open="open7"
      :list="val7"
      type="s7"
      @change="onselectchange"
      noselect
    ></v-s>
  </div>
</template>

<script>
import vL from "../../../affairs/_recruit_line.vue";
import vT from "../../../../private/time.vue";
import vS from "../../../../private/select.vue";
import vjs from "./1.js";
export default {
  props: {
    value: null,
  },
  data() {
    return {
      initend: false,
      showinit: false,
      open1: false, // 控制出生日期
      open2: false, // 控制现住址选择
      open3: false, // 控制国籍
      open4: false, // 控制血型
      open5: false, // 控制入园日期
      open6: false, // 控制学历选择
      open7: false, // 控制证件类型选择
      s2: "",
      s3: "",
      s4: "",
      s6: "",
      s7: "",
      val2: [],
      val3: [],
      val4: ["A", "B", "O", "AB"].map((a, v) => {
        return { text: a + "型", id: v + 1 };
      }),
      val6: ["小学", "初中", "高中", "大专", "大学本科", "研究生", "其他"].map(
        (a, v) => {
          return { text: a, id: v + 1 };
        }
      ),
      val7: ["身份证", "护照", "驾驶证"].map((a, v) => {
        return { text: a, id: v + 1 };
      }),
      i1: {},
      i2: {},
      i3: [],
      i4: {},
      i5: {},
      i6: [],
      i7: [],
    };
  },
  components: { vL, vT, vS },
  computed: {
    detail: {
      get: function get() {
        return this.value;
      },
      set: function set(n) {
        this.$emit("input", n);
      },
    },
  },
  watch: {
    detail: {
      handler(n) {
        this.init();
        this.$emit("input", n);
      },
      deep: true,
    },
    open2(n) {
      if (n) {
        this.oncity();
      }
    },
    open3(n) {
      if (n) {
        this.oncountry();
      }
    },
    i1: {
      handler(n) {
        if (n.src) {
          this.$set(this.detail.baby_files, "householder", n.src);
        }
      },
      deep: true,
    },
    i2: {
      handler(n) {
        if (n.src) {
          this.$set(this.detail.baby_files, "hukou_baby", n.src);
        }
      },
      deep: true,
    },
    i4: {
      handler(n) {
        if (n.src) {
          this.$set(this.detail.baby_files, "dad_page", n.src);
        }
      },
      deep: true,
    },
    i5: {
      handler(n) {
        if (n.src) {
          this.$set(this.detail.baby_files, "mom_page", n.src);
        }
      },
      deep: true,
    },
  },
  methods: {
    onsubmit() {
      let os = vjs(this.detail);
      this.$api.http("classstudentdetedit", os, () => {
        this.$toast("更新成功");
      });
    },
    onadds(index, name) {
      let os = {};
      if (index === 1) {
        os = {
          members_name: "",
          degree: "",
          id_card_no: "",
          number: "",
          employer: "",
          filiation: "",
        };
      } else {
        os = {
          pick_up_person: "",
          id_type: "",
          id_no: "",
          contact_number: "",
          relationship: "",
        };
      }
      this.detail[name].push(os);
    },
    ondels(index, name) {
      this.$js.modeldel(() => {
        this.detail[name].splice(index, 1);
      });
    },
    onopen6(v) {
      this.s6 = v;
      this.open6 = !this.open6;
    },
    onopen7(v) {
      this.s7 = v;
      this.open7 = !this.open7;
    },
    toa6(v) {
      let a =
        this.val6.filter((r) => {
          return r.id === +v;
        })[0] || {};
      return a.text;
    },
    onselectchange(e, v, type) {
      switch (type) {
        case "s2":
          this.$set(this.detail, "now_province", e[0].i);
          this.$set(this.detail, "now_city", e[1].i);
          this.$set(this.detail, "now_area", e[2].i);
          // eslint-disable-next-line
          this.s2 = demo.array(v.e).unique().join("");
          break;
        case "s3":
          this.$set(this.detail, "nation", v.country_id);
          this.s3 = v.text;
          break;
        case "s4":
          this.$set(this.detail.baby_files, "blood_type", v.id);
          this.s4 = v.text;
          break;
        case "s6":
          if (this.s6 >= 0) {
            this.$set(
              this.detail.baby_family_members[+this.s6],
              "degree",
              v.id
            );
            this.s6 = "";
          }
          break;
        case "s7":
          if (this.s7 >= 0) {
            this.$set(
              this.detail.baby_transfer_person[+this.s7],
              "id_type",
              v.text
            );
            this.s7 = "";
          }
          break;
        default:
      }
    },
    onpath3(e, v) {
      this.i3 = v;
      let val = v
        .map((s) => {
          return s.src;
        })
        .join(",");
      this.$set(this.detail.baby_files, "inoculum", val);
    },
    onpath6(e, v) {
      this.i6 = v;
      let val = v
        .map((s) => {
          return s.src;
        })
        .join(",");
      this.$set(this.detail.baby_files, "family", val);
    },
    onpath7(e, v) {
      this.i7 = v;
      let val = v
        .map((s) => {
          return s.src;
        })
        .join(",");
      this.$set(this.detail, "dangan_img", val);
    },
    init() {
      if (this.initend) return 0;
      if (this.detail.id) {
        this.initend = true;
      }
      let a = [
        this.detail.now_province,
        this.detail.now_city,
        this.detail.now_area,
      ].filter((r) => {
        return !!r;
      });
      if (a.length === 3) {
        this.$api.city(a, "id", (a1) => {
          // eslint-disable-next-line
          this.s2 = demo.array(a1).unique().join("");
        });
      }
      if (this.detail.nation) {
        let a2 = this.detail.nation;
        this.oncountry(() => {
          this.s3 = (
            this.val3.filter((r) => {
              return r.country_id === +a2;
            })[0] || {}
          ).text;
        });
      }
      let i = this.detail.baby_files || {};
      if (i) {
        if (i.blood_type) {
          this.s4 = (
            this.val4.filter((r) => {
              return +i.blood_type === +r.id;
            })[0] || {}
          ).text;
        }
        if (i.householder) {
          this.i1 = { image: i.householders[0] };
        }
        if (i.hukou_baby) {
          this.i2 = { image: i.hukou_babys[0] };
        }
        if (i.inoculum) {
          this.i3 = i.inoculums.map((s, v) => {
            return {
              srcs: s,
              src: i.inoculum.split(",")[v],
              base: s,
              old: true,
              cover: "img",
            };
          });
        }
        if (i.dad_page) {
          this.i4 = { image: i.dad_pages[0] };
        }
        if (i.mom_page) {
          this.i5 = { image: i.mom_pages[0] };
        }
        if (i.family) {
          this.i6 = i.familys.map((s, v) => {
            return {
              srcs: s,
              src: i.family.split(",")[v],
              base: s,
              old: true,
              cover: "img",
            };
          });
        }
      }
      if (this.detail.dangan_img) {
        this.i7 = this.detail.dangan_imgs.map((s, v) => {
          return {
            srcs: s,
            src: this.detail.dangan_img.split(",")[v],
            base: s,
            old: true,
            cover: "img",
          };
        });
      }
      this.$nextTick(() => {
        this.showinit = true;
      });
    },
    oncity() {
      if (this.val2.length) {
        return 0;
      }
      this.$api.city([], true, (e) => {
        this.val2 = e;
      });
    },
    oncountry(fn) {
      if (this.val3.length) {
        return 0;
      }
      this.$api.http("getcountry", {}, (e) => {
        this.val3 = e.map((s) => {
          s.text = s.name_chinese;
          return s;
        });
        if (fn) {
          fn();
        }
      });
    },
  },
  mounted() {
    this.detail = this.value;
    this.$nextTick(() => {
      this.init();
    });
  },
};
</script>
<style lang='less' scoped>
.class_1 {
  padding: 15px 0;
  font-size: 15px;
}
.add_btn {
  padding: 10px;
  box-sizing: border-box;
}
.image1 {
  width: 100px;
  height: 100px;
  margin: 10px;
}
.image2 {
  width: 100px;
  height: 100px;
  margin: 10px 10px 0 0;
  &:first-child {
    margin: 10px;
  }
}
.add_empty_btn {
  width: 120px;
}
section {
  background-color: rgba(188, 241, 245, 0.2);
  position: relative;
  &:nth-child(2n) {
    background-color: rgba(250, 241, 192, 0.2);
  }
  .van-cell {
    background: transparent;
  }
}
.pad10 {
  padding: 0 10px;
}
</style>
