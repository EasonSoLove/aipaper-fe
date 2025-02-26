<template>
  <div class="outlineMain">
    <!-- 页面名称 -->
    <div class="outlineTab">
      <div class="outLeft">
        <p
          @click="checkoutPaper(1)"
          :class="['outLeftTitle', index == 1 ? 'activeLT' : '']"
        >
          万象专业版
          <span class="underLeft"></span>
        </p>
        <!-- checkoutPaper(2) -->
        <!-- <p
          @click="$devf"
          :class="['outLeftTitle', 'paperClass', index == 2 ? 'activeLT' : '']"
        >
          万象学术版
          <span class="underLeft"></span>
        </p> -->
      </div>
      <div class="outRight">
        <div
          v-if="device != 'mobile'"
          @click="showAdv"
          class="btnExample contrast"
        >
          <p>质量对比</p>
        </div>
        <div @click="showExample" class="g_poin btnExample">
          <p>范文样例</p>
        </div>
      </div>
    </div>
    <!-- 用户输入页面 -->
    <div :class="['uesrInputBox', index == 2 ? 'tabMainActive' : '']">
      <!-- 科目与题目 -->
      <div class="selectLang formItem">
        <el-tooltip
          class="item"
          effect="dark"
          content="不支持无意义题目, 题目控制在60字以内"
          placement="top"
        >
          <p class="formItemLabel">科目与题目</p>
        </el-tooltip>
        <div class="formItemCon phoneFlex">
          <el-cascader
            placeholder="请选择科目"
            v-model="requestForm.field"
            :options="homeData.subject_list"
            :props="carProp"
            @change="handleChange"
          >
          </el-cascader>
          <div class="userInputCon">
            <!-- <el-input
              v-model="requestForm.title"
              maxlength="60"
              show-word-limit
              placeholder="请输入完整题目，题目越完整大纲越准确"
            ></el-input> -->
            <TitleInput
              v-model="requestForm.title"
              :requestForm="requestForm"
            ></TitleInput>
          </div>
        </div>
      </div>
      <div
        :class="[
          'firstItem',
          'secondItem',
          device == 'mobile' ? 'mobilebox' : '',
        ]"
      >
        <!-- 论文语言 -->
        <div class="selectLang formItem">
          <p class="formItemLabel">论文语言</p>
          <div class="formItemCon langBox">
            <el-select v-model="requestForm.language" placeholder="请选择">
              <el-option
                v-for="item in homeData.language_list"
                :key="item.value"
                :label="item.language"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <!-- 论文类型 -->
        <div class="selectLang formItem leftType">
          <p class="formItemLabel">学业类型</p>
          <div class="formItemCon">
            <el-radio-group
              @change="paperTypeChange"
              v-model="requestForm.type"
            >
              <el-radio
                class="radioSmall"
                v-for="item in homeData.category_list"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              >
                <el-tooltip class="item" effect="dark" placement="top">
                  <template slot="content">
                    <p style="width: 200px; line-height: 20px">
                      {{ typeTips[item.name] }}
                    </p>
                  </template>
                  <div class="labelBox">
                    <div class="left">
                      <img
                        v-if="requestForm.type == item.name"
                        class="home-icon"
                        src="@/assets/images/index/icon_24_xylx_selected@2x.png"
                        alt=""
                      />
                      <img
                        v-else
                        class="home-icon"
                        src="@/assets/images/bank-dark.png"
                        alt=""
                      />
                      {{ item.name }}
                      <span v-show="item.description"
                        >({{ item.description }})</span
                      >
                    </div>
                    <div class="rightIcon">
                      <img
                        src="@/assets/images/index/icon_option_selected@2x.png"
                        alt=""
                      />
                    </div>
                  </div>
                </el-tooltip>
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <!-- 论文水平 -->
        <div class="selectLang formItem leftType">
          <p class="formItemLabel">论文水平</p>
          <div class="formItemCon">
            <el-radio-group v-model="requestForm.paper_level">
              <el-radio
                class="radioSmall"
                v-for="item in paper_levelList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              >
                <el-tooltip
                  class="item custom-tooltip"
                  effect="dark"
                  placement="top"
                >
                  <template slot="content">
                    <p style="width: 200px; line-height: 20px">
                      {{ item.description }}
                    </p>
                  </template>
                  <div class="labelBox">
                    <div class="left">
                      <img
                        v-if="requestForm.paper_level == item.name"
                        class="home-icon"
                        src="@/assets/images/index/icon_24_lwsp_selected.png"
                        alt=""
                      />
                      <img
                        v-else
                        class="home-icon"
                        src="@/assets/images/index/icon_24_lwsp_default@2x.png"
                        alt=""
                      />
                      <span style="margin-left: 10px">
                        {{ item.name }}
                      </span>
                      <!-- <span v-show="item.description"></span> -->
                    </div>
                    <div class="rightIcon">
                      <img
                        src="@/assets/images/index/icon_option_selected@2x.png"
                        alt=""
                      />
                    </div>
                  </div>
                </el-tooltip>
              </el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <!-- 论文类型 -->
      <div
        :class="[
          'firstItem',
          'secondItem',
          device == 'mobile' ? 'mobilebox' : '',
        ]"
      >
        <div class="selectLang formItem">
          <p class="formItemLabel">论文类型</p>
          <div class="formItemCon">
            <el-radio-group
              @change="requestProductChange"
              v-model="requestForm.product"
            >
              <el-radio
                class="onlyCyc"
                v-for="item in homeData.category_product_list"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              >
                <!-- <el-tooltip class="item" effect="dark" placement="top"> -->
                <template slot="content">
                  <p style="width: 200px; line-height: 20px">
                    {{ typeTips[item.name] }}
                  </p>
                </template>
                <div class="labelBox">
                  <div class="left">
                    <!-- <svg class="icon svg-icon" aria-hidden="true">
                    <use xlink:href="#icon-tubiaozoushitu"></use>
                  </svg> -->

                    <img
                      v-if="requestForm.product == item.name"
                      class="home-icon"
                      src="@/assets/images/index/icon_24_xylx_selected@2x.png"
                      alt=""
                    />
                    <img
                      v-else
                      class="home-icon"
                      src="@/assets/images/bank-dark.png"
                      alt=""
                    />
                    {{ item.name }}
                    <span v-show="item.description"
                      >({{ item.description }})</span
                    >
                  </div>
                  <div
                    v-if="requestForm.product == item.name"
                    class="rightIcon2"
                  >
                    <img
                      src="@/assets/images/index/radios_checked@2x.png"
                      alt=""
                    />
                  </div>
                </div>
                <!-- </el-tooltip> -->
              </el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div
        :class="[
          'firstItem',
          'secondItem',
          device == 'mobile' ? 'mobilebox' : '',
        ]"
      >
        <!-- 论文字数 -->
        <div
          v-if="
            !(
              requestForm.product == '开题报告' ||
              requestForm.product == '任务书'
            )
          "
          class="selectLang formItem firstItem"
        >
          <p class="formItemLabel">论文字数</p>
          <div class="formItemCon wordItem">
            <el-slider
              v-model="requestForm.word_count"
              :min="minCount"
              :max="maxCount"
              :marks="marks"
              :step="1000"
            >
            </el-slider>
          </div>
        </div>
      </div>

      <!-- 三级大纲 -->
      <!-- <div class="selectLang formItem">
        <p class="formItemLabel">
          三级大纲
          <span class="switchBox">
            <el-switch v-model="requestForm.threeCon" active-text="开启">
            </el-switch>
          </span>
        </p>
      </div> -->
      <!-- 生成大纲 -->
      <div
        @click="sendOutlineForm"
        :class="[
          'outlineBtn',
          'g_poin',
          index == 2 ? 'paperMain' : '',
          produceLineStatus ? 'produceClass' : '',
        ]"
      >
        <p>生成大纲</p>
      </div>
    </div>
    <advantage ref="advantageDia"></advantage>
    <example ref="exampleDia"></example>
  </div>
</template>
<script>
import OrderType from "@/utils/orderTypes";
import { mapGetters } from "vuex";
// import { sms } from "@/api/login";
// import webinfo from "@/components/webinfo.vue";
// import eventBus from "@/utils/eventBus";
import eventBus from "@/utils/eventBus";
import { getToken } from "@/utils/auth"; //
import { outlineCreate } from "@/api/user";
import polling from "@/utils/polling-utils";
import advantage from "@/views/dashboard/components/advantage";
import example from "./example/index.vue";
import TitleInput from "./outline/TitleInput.vue";
export default {
  name: "outline",
  data() {
    return {
      // 定义变量
      requestForm: {
        title: "",
        threeCon: false,
        language: "中文",
        type: "本科",
        product: "毕业论文",
        paper_level: "初级",
        field: ["哲学", "哲学类"],
        key: "",
        word_count: 5000,
      },
      OrderType: OrderType,
      index: 1,
      carProp: {
        value: "name",
        label: "name",
        children: "subcategories",
        expandTrigger: "hover",
      },
      typeTips: {
        专科: "产出的论文学术深度一般，可通过论文水平进一步控制论文深度",
        本科: "产出的论文学术深度中等，可通过论文水平进一步控制论文深度",
        研究生: "产出的论文学术深度较高，可通过论文水平进一步控制论文深度",
        结课论文: "专科、本科课论文水准，可通过论文水平进一步控制论文深度",
      },
      minCount: 3000,
      maxCount: 30000,
      options: [
        {
          value: "中文",
          label: "简体中文",
        },
        {
          value: "英文",
          label: "英文",
        },
        {
          value: "德语",
          label: "德语",
        },
        {
          value: "法语",
          label: "法语",
        },
        {
          value: "西班牙语",
          label: "西班牙语",
        },
      ],
      paper_levelList: [
        {
          name: "初级",
          description:
            "选定学历等级会限定论文初始等级，在此基础上选择【初级】生成的论文相对通俗易懂，使用的方法不超过本科水平，论文写作深度和水平容易理解。",
        },
        {
          name: "高级",
          description:
            "选定学历等级会限定论文初始等级，在此基础上选择【高级】生成的论文会有相对专业的方法以及结论，论文写作深度高一些。",
        },
      ],
      requestKey: "是是是",
      word_count: 3000,
      marks: {
        3000: "3000",
        5000: "5000",
        8000: "8000",
        10000: "10000",
        15000: "15000",
        20000: {
          style: {
            color: "#1989FA",
          },
          label: this.$createElement("strong", "20000"),
        },

        30000: {
          style: {
            width: "90px",
            color: "#E6A23C",
          },
          label: this.$createElement("strong", "30000"),
        },
      },
      showContrast: false,
    };
  },
  components: {
    // webinfo,
    advantage,
    example,
    TitleInput,
  },
  mounted() {
    // eventBus.emit("sendOutline", 5); // 发布事件
    // 页面初始化
    // 查看用户输入数据是否存在
    let jsonStr = localStorage.getItem("userInput");

    this.$log("outline_----", jsonStr);

    if (!!jsonStr) {
      this.requestForm = JSON.parse(jsonStr);
      this.$log("用户输入有数据", this.requestForm);
      this.$nextTick(() => {
        localStorage.removeItem("userInput");
      });
    } else {
      // let _this = this;
      // setTimeout(() => {
      //   _this.requestForm.type = _this.homeData.category_list[0].name;
      // }, 1000);
    }
  },
  created() {
    // step2点击重新生成大纲
    eventBus.on("reloadOutline", this.sendOutlineForm); // 订阅事件
    eventBus.on("setFormData", this.setFormData); // 订阅事件
  },
  beforeDestroy() {
    eventBus.off("reloadOutline", this.sendOutlineForm); // 移除事件监听
    eventBus.off("setFormData", this.setFormData); // 移除事件监听
  },
  computed: {
    // 计算属性
    ...mapGetters(["homeData", "produceLineStatus", "device"]),
  },
  methods: {
    showAdv() {
      zhuge.track(`访问质量对比`);
      this.$refs.advantageDia.showDia();
    },
    showExample() {
      window.zhuge.track("访问范围样例", {
        点击页面: "写论文页面",
      });
      this.$refs.exampleDia.showDia();
    },
    requestProductChange(val) {
      if (
        this.requestForm.product == "开题报告" ||
        this.requestForm.product == "任务书"
      ) {
        this.requestForm.word_count = 0;
      } else if (val == "文献综述" || val == "结课论文") {
        let item = this.homeData.category_product_list.find(
          (item) => item.name == val
        );
        this.requestForm.word_count = item.min_word_num;
        this.minCount = item.min_word_num;
        this.maxCount = item.max_word_num;
      } else {
        this.paperTypeChange(this.requestForm.type);
      }
    },
    paperTypeChange(val) {
      let selectItem = this.homeData.category_list.find(
        (item) => item.name == val
      );
      this.$log("论文类型", selectItem);

      if (this.requestForm.product == "毕业论文") {
        selectItem.min_word_num && (this.minCount = selectItem.min_word_num);
        selectItem.max_word_num && (this.maxCount = selectItem.max_word_num);
        if (val == "专科") {
          this.requestForm.word_count = 8000;
        }
        if (val == "本科") {
          this.requestForm.word_count = 12000;
        }
        if (val == "研究生") {
          this.requestForm.word_count = 20000;
        }
        if (val == "结课论文") {
          this.requestForm.word_count = 3000;
        }
      }
    },
    setFormData(data) {
      this.$log("setFormdata-----------", data);
      if (data) {
        this.requestForm = { ...data };
      }
    },
    // loadingBtn() {
    //   this.produceLineStatus = true;
    //   this.sendOutlineForm();
    // },
    sendOutlineForm: function () {
      if (this.produceLineStatus) {
        this.$message({
          type: "warning",
          message: "大纲生成中,请勿重复点击!",
        });
        return false;
      }
      this.$store.dispatch("app/setProStatus", true);

      // 判断是否登录,否则跳转到登录页面
      const hasToken = getToken();
      if (hasToken) {
        if (!this.requestForm.title) {
          this.$message({
            type: "warning",
            message: "请输入论文题目!",
          });
          this.$store.dispatch("app/setProStatus", false);
          return false;
        }
        if (this.requestForm.title.length < 5) {
          this.$message({
            type: "warning",
            message: "标题请至少输入5个字!",
          });
          this.$store.dispatch("app/setProStatus", false);

          return false;
        }

        // 保存用户输入数据
        let data = {
          title: this.requestForm.title,
          language: this.requestForm.language,
          field: this.requestForm.field && this.requestForm.field[1],
          type: this.requestForm.type,
          product: this.requestForm.product,
          paper_level: this.requestForm.paper_level == "初级" ? 0 : 3,
          word_count: this.requestForm.word_count,
        };
        outlineCreate(data)
          .then((res) => {
            window.zhuge.track("生成大纲", {
              语言: this.requestForm.language,
              科目: this.requestForm.field && this.requestForm.field[1],
              学业类型: this.requestForm.type,
              论文类型: this.requestForm.product,
              论文水平: this.requestForm.paper_level,
              论文字数: this.requestForm.word_count,
            });

            this.$store.dispatch("app/setProStatus", true);

            this.$log("outlineCreateres", res);
            eventBus.emit("emitOulineClick", 3); // 发布事件
            this.$log("lunwen", this.requestForm);
            this.requestForm.key = res.result.key;
            this.$store.dispatch("app/setRequestForm", this.requestForm);
            this.requestKey = res.result.key;
            // this.requestKey = "eb3a2422-301c-47ba-be1f-7c334e15c655";
            polling({ key: this.requestKey }, 5000)
              .then((res) => {
                this.$log("ddddd", res);
                if (res == "生成失败") {
                  eventBus.emit("errorOutline", res); // 发布事件
                } else {
                  eventBus.emit("successOutline", res); // 发布事件
                }
              })
              .catch((error) => {
                this.$log(error, "eeeeeerrrror");
                this.$message({
                  type: "error",
                  message: "大纲生成失败, 请稍后重试",
                });
                eventBus.emit("errorOutline"); // 发布事件
                this.$emit("errorBack", "关闭index");
              });
          })
          .catch(() => {
            this.$store.dispatch("app/setProStatus", false);
          });
      } else {
        this.$store.dispatch("app/setProStatus", false);
        this.$confirm(
          "生成大纲需要登录, 是否登录?<br>登录联系客服有好礼哟!",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            center: true,
            dangerouslyUseHTMLString: true,
          }
        )
          .then(() => {
            // 存储用户数据并跳转

            this.saveInput();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消生成",
            });
          });
      }
    },
    saveInput() {
      // 获取用户数据
      this.$log("ssss", this.requestForm);
      localStorage.setItem("userInput", JSON.stringify(this.requestForm));
      // this.$router.push("/login");
      eventBus.emit("showLogin"); // 发布事件
    },
    addE() {},
    // 定义方法
    handleChange(value) {
      this.$log(value);
    },
    checkoutPaper(val) {
      this.index = val;
      this.$log("homeData", this.homeData);
    },
  },
};
</script>
<style lang="scss" scoped>
// 引入scss
@import "@/styles/variables.scss";
// @import './index.scss';

// 媒体查询
// @media only screen and (max-width: 939px) {
// }
.outlineMain {
  max-width: 1200px;
  background: #ffffff;
  border-radius: 0px 0px 12px 12px;
}

.outlineTab {
  width: 100%;
  border-bottom: 1px solid #cccccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 96px;
  padding: 0 40px;

  .outLeft {
    display: flex;
    align-items: center;
  }

  .outLeftTitle {
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    margin-right: 40px;
    font-size: 22px;
    color: #000000;
    line-height: 30px;
    text-align: left;
    font-style: normal;
    position: relative;
  }

  .paperClass {
    @include center-content(22px);
  }

  .activeLT {
    span {
      position: absolute;
      bottom: -10px;
      right: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: #3355ff;
    }
  }
}
.tabMainActive {
  background: linear-gradient(
    135deg,
    #ffffff 0%,
    #00bfff33 50%,
    #6236ff33 82%,
    #b620e033 100%
  ) !important;
}
.paperMain {
  background: linear-gradient(
    135deg,
    #00bfff 0%,
    #0091ff 29%,
    #6236ff 62%,
    #b620e0 100%
  ) !important;
}
.produceClass {
  background: #cccccc !important;
  // font-size: ;
  color: #000;
  &:hover {
    cursor: not-allowed;
  }
}
.outRight {
  width: 300px;
  height: 40px;

  .contrast {
    margin-right: 10px;
    background: #fff;
    border-color: #d8dfe6;
    border-width: 1px;
    border-style: solid;
    color: #1b2126;
  }
}

.formItem {
  padding-left: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 40px;

  .formItemLabel {
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 18px;
    color: #000000;
    display: flex;
    line-height: 25px;
    text-align: left;
    font-style: normal;
  }

  .formItemCon {
    margin-top: 15px;
    display: flex;
    width: 100%;
    align-items: center;
  }

  .switchBox {
    margin-left: 26px;
  }

  .userInputCon {
    margin-left: 16px;
    margin-right: 16px;
    // max-width: 670px;
    flex: 1;
  }
}
.uesrInputBox {
  padding-top: 25px;
  padding-bottom: 40px;
  .selectLang:first-child {
    margin-top: 0px;
  }
}
.outlineBtn {
  width: auto;
  height: 44px;
  background: #3355ff;
  border-radius: 24px;
  margin-top: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #ffffff;
  margin-left: 40px;
}
.rightIcon {
  position: absolute;
  bottom: 0;
  right: -2000px;
  width: 20px;
  height: 20px;
  line-height: 0px;

  img {
    width: 100%;
    height: 100%;
  }
}
.rightIcon2 {
  width: 20px;
  height: 20px;
  margin-left: 10px;
  position: relative;
  top: 4px;
  img {
    width: 100%;
    height: 100%;
  }
}
// 重置论文类型单选样式
.labelBox {
  font-size: 16px;

  & > div {
    display: inline-block;

    .home-icon {
      width: 20px;
      height: 20px;
      transform: translateY(3px);
    }
  }
}

::v-deep label.el-radio {
  height: 40px;
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid #cccccc;
  line-height: 40px;
  padding-right: 16px;
  height: 40px;
  margin-right: 10px;
  background-image: linear-gradient(180deg, #f4f5f7 0%, #f4f5f7b3 100%);
  border-radius: 4px;
  &.is-checked {
    border: 1px solid #0066ff;
    background-image: linear-gradient(180deg, #d3e4ff 0%, #e5efff 100%);
    .rightIcon {
      right: 0px;
    }
  }
  &.is-checked.onlyCyc {
    border: 1px solid #0066ff !important;
  }

  .el-radio__input.is-checked + .el-radio__label {
    color: #0066ff !important;
  }

  .el-radio__input {
    display: none;
  }

  .el-radio__label {
    padding-left: 0px;
  }
}
.radioSmall {
  width: 106px;
  padding-left: 14px;
}
.onlyCyc {
  width: 160px;
  border-radius: 24px;
  padding-left: 22px;
  font-size: 14px;
  background: #ffffff;
  border: 1px solid #d8dfe6;
  border-radius: 24px !important;
}
label.el-radio.is-checked {
}
.mobile {
  .formItem {
    margin-top: 10px !important;
    width: 100% !important;
    .formItemLabel {
      font-size: 16px;
    }

    .formItemCon {
      margin-top: 0px;
    }
  }
}
.secondItem {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  margin-top: 30px;
}
.firstItem {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  .formItem {
    margin-top: 0px;
  }
  .formItemCon {
    width: 100% !important;
    & > div {
      width: 100%;
      display: flex;
    }
  }
  .firstItem {
    flex-grow: 1;
    padding-right: 40px;
  }
}
.mobilebox {
  flex-direction: column;
  align-items: flex-start;
  .formItem {
    margin-left: 0px;
  }
  .wordItem {
    width: 100%;
    padding-bottom: 10px;
    padding-right: 25px;
    margin-left: 0px !important;
    ::v-deep .el-slider__marks-text {
      transform: rotate(45deg);
    }
  }
}
::v-deep .firstItem .el-slider__bar {
  background-color: #3355ff;
}
::v-deep .firstItem .el-slider__button {
  border-color: #3355ff;
}
.leftType {
  margin-left: 20px;
}
.wordItem {
  margin-left: 19px;
  margin-top: 25px !important;
}
::v-deep .el-slider__marks-text {
  top: -40px !important;
  color: #000;
}
</style>
