  <template>
    <v-view @on-view="onconfig" bar cover index="500">
      <div class="box" v-for="(i, j) in item" :key="j">
        <h6>{{ i.t }}</h6>
        <div class="list">
          <template v-if="i.v && i.v.length">
            <v-m v-model="i.v" :cls="i.c" @change="onchange"></v-m>
          </template>
          <p v-else class="null">暂无权限查看</p>
        </div>
      </div>
      <template #fixed>
        <v-f :footer="false" v-model="open" :text="text" index="600">
          <div class="box">
            <div class="list">
              <template v-if="child.length">
                <v-m v-model="child" @change="onchange" column="3"></v-m>
              </template>
              <p v-else class="null">暂无权限查看</p>
            </div>
          </div>
        </v-f>
      </template>
    </v-view>
  </template>

  <script>
  import vM from "../private/menu.vue";
  import vF from "../private/fixed.vue";
  export default {
    data() {
      return {
        user: {},
        works: {},
        item: [],
        id: "",
        child: [],
        level: [],
        open: false,
        text: "",
        dot: {},
        cnum: 0,
        menulevels: [],
        val: {},
        connectionindex: "", // 家园联系册 类型
      };
    },
    components: { vM, vF },
    computed: {
      menu1() {
        return this.works.work || [];
      },
      menu2() {
        return this.works.manage || [];
      },
      menu3() {
        return this.works.other || [];
      },
      iscon() {
        return +this.connectionindex === 1;
      },
    },
    watch: {
      id(n) {
        if (n > 0) {
          this.setchild(n);
        }
      },
      open(n) {
        if (!n) {
          this.id = "";
          this.appPath("/work", true);
        }
      },
      "$route.path"(n) {
        if (n.indexOf("work/") < 0) {
          this.open = false;
        }
      },
    },
    inject: ["appPath"],
    methods: {
      setchild(n) {
        if (!this.level.length) {
          if (this.cnum > 10) {
            return 0;
          }
          this.cnum++;
          setTimeout(() => {
            this.setchild(n);
          }, 200);
          return 0;
        }
        this.$nextTick(async () => {
          if (!this.child.length) {
            let c = this.$js.def.work(n, this.level, [], this.val);
            if (+n === 10007) {
              // 获取一个接口
              let w = false;
              w = await this.ongetisbossuse();
              if (!w) {
                c = c.filter((r) => {
                  return !r.boss;
                });
              }
            }
            this.child = c;
            this.text = this.$js.def.workname(n);
            this.onchilddot();
          }
        });
        this.open = true;
      },
      onconfig(e) {
        // console.log(e);
        this.user = e.user || {};
        this.level = e.level || [];
        this.dot = e.dot || {};
        this.val = e.validate;
        this.menulevels = (e.menulevel || {}).close || [];
        if (this.user.auth_group) {
          // eslint-disable-next-line
          demo.title(this.user.auth_group + "工作");
        }
        let work = this.$js.def.work(
          "work",
          e.level,
          this.menulevels,
          e.validate
        );
        let manage = this.$js.def.work(
          "manage",
          e.level,
          this.menulevels,
          e.validate
        );

        let other = this.$js.def.work(
          "other",
          e.level,
          this.menulevels,
          e.validate
        );

        this.setdot(work, 468, e.dot.purchase + e.dot.receive);
        this.setdot(work, 469, e.dot.administration);
        this.setdot(work, 470, e.dot.staff_count + e.dot.overstaffing);
        this.setdot(work, 5, e.dot.binding_audit + e.dot.prompt_not_entered);
        this.setdot(
          manage,
          271,
          e.dot.my_assessment_count + e.dot.me_assessment_count
        );
        this.setdot(other, 6, e.dot.satisfaction);
        this.setdot(other, 415, e.dot.repair_count);
        // eslint-disable-next-line no-undef
        let cur_work_level = demo.$local.get('gl_level_list');
        if (cur_work_level) {
          for (let i = 0; i < manage.length; i++) {
          for (let j = 0; j < cur_work_level.length; j++) {
              if (manage[i].text === cur_work_level[j].title) {
                  manage.splice(i, 1);
                  i--;
                  break;
              }
          }
      }
        }
        this.works = {
          work,
          manage,
          other,
        };

        this.$nextTick(() => {
          this.init();
          this.menus();
        });
      },
      setdot(arr, level, num, index = 0) {
        let n = this.$js.def.menuindex(arr, level, index);
        if (n >= 0 && arr[n]) {
          arr[n].num = num;
        }
      },
      onchilddot() {
        this.setdot(this.child, 272, this.dot.administration);
        this.setdot(this.child, 7, this.dot.binding_audit);
        this.setdot(this.child, 12, this.dot.staff_count);
        this.setdot(this.child, 426, this.dot.overstaffing);
        this.setdot(this.child, 415, this.dot.repair_count);
        this.setdot(this.child, 10, this.dot.purchase);
        this.setdot(this.child, 10, this.dot.receive, 1);
        this.setdot(this.child, 271, this.dot.my_assessment_count);
        this.setdot(this.child, 271, this.dot.me_assessment_count, 1);
        //
        if (this.iscon) {
          this.setdot(this.child, 353, this.dot.prompt_not_entered);
        }
      },
      init() {
        // 获取财务权限
        this.$api.http("finlevel", {}, (e) => {
          if (e.authority === 2) {
            // 无权限
            this.works.work = this.works.work.filter((r) => {
              return r.id !== 10008;
            });
            this.menus();
          } else {
            if (e.set_password === 2) {
              // 第一次进入
            }
          }
        });

        if (this.child.length) {
          this.onchilddot();
        }
      },
      menus() {
        this.item = [
          { t: "工作", v: this.menu1, c: "purple" },
          { t: "管理", v: this.menu2, c: "primary" },
          { t: "其他", v: this.menu3, c: "info" },
        ];
      },
      ongetisbossuse() {
        let h = this.$api.http;
        return new Promise((resolve, reject) => {
          h("babymyis", {}, (r) => {
            resolve(r);
          });
        });
      },
      async onchange(e) {
        if (e.id === 10100) {
          // 园所数据判断 状态 版本
          this.$api.http("recordgettype", {}, (r) => {
            if (+r === 1) {
              return this.appPath("/management_record2");
            }
            this.appPath(e.path);
          });
          return 0;
        }
        if (this.$js.def.works.children[e.id]) {
          let c = this.$js.def.work(e.id, this.level, [], this.val);
          if (e.id === 10007) {
            // 获取一个接口
            let w = false;
            w = await this.ongetisbossuse();
            if (!w) {
              c = c.filter((r) => {
                return !r.boss;
              });
            }
          }
          this.child = c;
          this.text = e.text;
          this.id = e.id;
          this.onchilddot();
          return this.appPath("/work/" + e.id);
        }

        // 判断是否给 新权限进入
        if (
          this.menulevels.length > 0 &&
          this.menulevels.indexOf(e.menulevel) >= 0
        ) {
          return this.$js.modelmenuclose();
        }

        if (e.path) {
          if (e.level === 353 && !this.iscon) {
            this.appPath("/connection/1");
            return 0;
          }
          this.appPath(e.path);
        } else {
          this.$toast("正在维护中...");
        }
      },
    },
    mounted() {
      this.id = this.$route.params.id || "";
      this.$api.http("contact40gettype", {}, (r) => {
        this.connectionindex = r;
      });
    },
  };
  </script>
  <style lang='less' scoped>
  .box {
    margin: 10px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 10px;
    position: relative;
    border-radius: 5px;
    h6 {
      font-weight: 650;
      font-size: 15px;
      padding: 5px 0;
      letter-spacing: 1px;
    }
    .list {
      padding: 8px 0;
      overflow: hidden;
    }
  }
  .null {
    font-size: 14px;
    color: #ccc;
  }
  </style>
