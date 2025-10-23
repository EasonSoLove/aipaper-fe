<template>
  <div class="outlineMain" v-loading="loading">
    <!-- 页面名称 -->
    <div class="outlineTab">
      <div class="outLeft">
        <p
          @click="checkoutPaper('v1')"
          :class="['outLeftTitle', outlineVersion == 'v1' ? 'activeLT' : '']"
        >
          万象专业版

          <b style="font-size: 14px">一键生成更简单</b>

          <span class="underLeft"></span>
        </p>
        <!-- checkoutPaper(2) -->
        <div
          @click="checkoutPaper('v2')"
          style="position: relative"
          :class="[
            'outLeftTitle',
            'paperClass',
            outlineVersion == 'v2' ? 'activeLT' : '',
          ]"
        >
          万象定制版 <b style="font-size: 14px">让你的论文更懂你</b>
          <!-- <svg
            xmlns="http://www.w3.org/2000/svg"
            style="height: 73px"
            version="1.1"
          >
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color: #00d5ff" />
                <stop offset="29%" style="stop-color: #0091ff" />
                <stop offset="62%" style="stop-color: #6236ff" />
                <stop offset="100%" style="stop-color: #b620e0" />
              </linearGradient>
            </defs>
            <text x="0" y="30" font-size="22" fill="url(#gradient)">
              万象定制版
              <tspan font-size="14" dy="5">让你的论文更懂你</tspan>
            </text>
          </svg> -->

          <span class="underLeft"></span>
        </div>
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
    <div
      :class="['uesrInputBox', outlineVersion == 'v2' ? 'tabMainActive' : '']"
    >
      <!-- 论文基础信息 -->
      <div class="outlineBasic">
        <div
          class="outlineBasicDia"
          v-if="produceLineStatus || formdataV2.status == '生成成功'"
          @click="showMessage"
        ></div>
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
                  :label="item.value"
                  :value="item.value"
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
                          v-if="requestForm.paper_level == item.value"
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
            <p class="formItemLabel">
              论文字数
              <span class="introSpanOutline">
                字数供参考，可能存在误差，属于正常情况。
              </span>
            </p>
            <div class="formItemCon wordItem">
              <el-slider
                :disabled="produceLineStatus || formdataV2.status == '生成成功'"
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
      </div>
      <!-- start 检索文献 -->

      <div
        :class="[
          'firstItem',
          'secondItem',
          device == 'mobile' ? 'mobilebox' : '',
        ]"
        v-if="outlineVersion == 'v2'"
      >
        <advance :parentForm="requestForm"></advance>
      </div>
      <!-- end 检索文献 -->
      <div
        :class="[
          'firstItem',
          'secondItem',
          device == 'mobile' ? 'mobilebox' : '',
        ]"
      >
        <!-- 投喂信息 -->
        <div class="selectLang formItem firstItem" style="padding-right: 0">
          <p class="formItemLabel">
            投喂信息
            <span style="font-size: 14px"
              >（可以提供开题报告， 设计思路等参考内容）</span
            >
          </p>
          <div class="formItemCon">
            <el-input
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 10 }"
              placeholder="1. 可投喂开题报告、设计思路等，模型会根据您的投喂内容，在思考和推理过程中进行参考
2. 投喂的所有内容仅在创作大纲阶段使用，暂不支持三级目录
3. 投喂文献内容请使用“本地上传”功能上传您的参考文献，此处投喂并不会在初稿创作过程中引用
4. 模型暂不具备联网功能，针对部分投喂无法获取最新数据，敬请谅解"
              v-model="requestForm.extra_requirements"
            >
            </el-input>
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
        @click="sendOutlineForm('v1')"
        v-if="outlineVersion == 'v1'"
        :class="[
          'outlineBtn',
          'g_poin',
          outlineVersion == 'v2' ? 'paperMain' : '',
          produceLineStatus ? 'produceClass' : '',
        ]"
      >
        <p>生成大纲</p>
      </div>
      <div
        v-if="outlineVersion == 'v2'"
        @click="sendV2Form"
        :class="[
          'outlineBtn',
          'g_poin',
          outlineVersion == 'v2' ? 'paperMain' : '',
          produceLineStatus ? 'produceClass' : '',
        ]"
      >
        <span style="margin-right: 10px">Step 3</span>
        <p>生成大纲</p>
      </div>
    </div>
    <advantage ref="advantageDia"></advantage>
    <example ref="exampleDia"></example>

    <el-dialog
      title="请确认您的大纲信息, 是否继续生成?"
      :visible.sync="lineDetailStatus"
      width="50%"
      :before-close="handleClose"
    >
      <p style="margin-bottom: 10px; margin-top: -10px" class="red">
        请确认您的科目、专业、论文类型、论文字数等信息填写无误，否则会影响大纲及初稿的创作质量！
      </p>
      <div style="margin-top: 0px">
        <el-descriptions class="margin-top" :column="2" border>
          {{ formdataV2 }}
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              科目与题目
            </template>
            {{ formdataV2.field }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              论文语言
            </template>
            {{ formdataV2.language }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location-outline"></i>
              学业类型
            </template>
            {{ formdataV2.type }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-tickets"></i>
              论文水平
            </template>
            {{ formdataV2.paper_level == 0 ? "初级" : "高级" }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-tickets"></i>
              论文类型
            </template>
            {{ formdataV2.product }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-tickets"></i>
              论文字数
            </template>
            {{ formdataV2.word_count }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              论文题目
            </template>
            {{ formdataV2.title }}
          </el-descriptions-item>
        </el-descriptions>
        <div>
          <p
            style="
              font-size: 16px;
              margin-top: 20px;
              color: #222;
              font-weight: bold;
            "
          >
            您勾选的参考文献
          </p>
          <p style="font-size: 12px; margin-bottom: 10px; line-height: 16px">
            请仔细检查所勾选文献与您专业和论文题目的相关性，万象学术模型会进行参考文献相关性进行引用逐级生成大纲，<span
              class="red"
              >若相关性不大，可能不会引用！</span
            >
          </p>

          <el-collapse accordion style="max-height: 400px; overflow-y: scroll">
            <template
              v-for="(item, index) in formdataV2.reference_paper_selected_lists"
            >
              <el-collapse-item
                :key="index + 'paper'"
                :title="item.title"
                :name="index + 'p'"
              >
                <template slot="title">
                  {{ item.title }}
                  <span
                    v-show="item.reference_parse_status === 'ERROR_PARSE'"
                    class="delTips2 animate__animated animate__headShake infinite-bounce"
                  >
                    <i class="el-icon-caret-left"></i>
                    该文献解析失败, 请在论文选择区,手动删除!
                  </span>
                </template>
                <div class="firstItem">
                  <el-tag> 作者: {{ item.authors.join(",") }}</el-tag>
                  <el-tag> 类型: {{ item.database }} </el-tag>
                  <el-tag> 日期: {{ item.date }} </el-tag>
                  <el-tag> 来源: {{ item.source }} </el-tag>
                </div>
                <div style="margin-top: 10px">摘要: {{ item.abstract }}</div>
              </el-collapse-item>
            </template>
          </el-collapse>
        </div>
        <p style="margin-top: 30px; font-weight: bold"></p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeConfirm">去修改</el-button>
        <el-button type="primary" @click="confirmSend">继 续</el-button>
      </span>
    </el-dialog>
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
import { create_outline, save_extra_requirements } from "@/api/paper";
import polling from "@/utils/polling-utils";
import advantage from "@/views/dashboard/components/advantage";
import example from "./example/index.vue";
import TitleInput from "./outline/TitleInput.vue";
import advance from "./outline/advance.vue";
export default {
  name: "outline",
  data() {
    return {
      // 定义变量
      loading: false,
      requestForm: {
        title: "",
        extra_requirements: "",
        threeCon: false,
        language: "中文",
        type: "本科",
        product: "毕业论文",
        paper_level: 0,
        field: ["哲学", "哲学类"],
        key: "",

        word_count: 5000,
      },
      lineDetailStatus: false,
      OrderType: OrderType,
      // outlineActiveIndex: 2,
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
      maxCount: 25000,
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
          value: 0,
          description:
            "选定学历等级会限定论文初始等级，在此基础上选择【初级】生成的论文相对通俗易懂，使用的方法不超过本科水平，论文写作深度和水平容易理解。",
        },
        {
          name: "高级",
          value: 3,

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

        25000: {
          style: {
            width: "90px",
            color: "#E6A23C",
          },
          label: this.$createElement("strong", "25000"),
        },
      },
      showContrast: false,
    };
  },
  components: {
    // webinfo,
    advance,
    advantage,
    example,
    TitleInput,
  },
  mounted() {
    // eventBus.emit("sendOutline", 5); // 发布事件
    // 页面初始化
    // 查看用户输入数据是否存在
    // let jsonStr = localStorage.getItem("userInput");
    // this.$log("outline_----", jsonStr);
    // if (!!jsonStr) {
    //   // this.requestForm = JSON.parse(jsonStr);
    //   // this.$log("用户输入有数据", this.requestForm);
    //   // this.$nextTick(() => {
    //   //   localStorage.removeItem("userInput");
    //   // });
    // } else {
    //   // let _this = this;
    //   // setTimeout(() => {
    //   //   _this.requestForm.type = _this.homeData.category_list[0].name;
    //   // }, 1000);
    // }
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
    ...mapGetters([
      "homeData",
      "outlineVersion",
      "produceLineStatus",
      "device",
      "formdataV2",
    ]),
  },
  watch: {
    // 监听 formdataV2.reference_paper_selected_lists 的变化
    "requestForm.product": {
      handler(newVal, oldVal) {
        // 当数据改变时，你可以在这里执行任何你需要的操作
        Ming("reference_paper_selected_lists has been updated", newVal, oldVal);
        // 这里的操作可以是任何事情，比如调用一个方法或者更改其他数据
        this.requestProductChange(newVal);
      },
      immediate: true, // 如果你也需要在 watcher 创建时立即执行一次，则设置为 true
    },
  },
  methods: {
    showMessage() {
      if (this.produceLineStatus) {
        this.$message({
          type: "warning",
          message:
            "当前大纲“生成中”，科目等信息无法修改，如需修改请刷新页面重新生成大纲!",
        });
      } else {
        this.$message({
          type: "warning",
          message:
            "当前大纲“生成成功”，科目等信息无法修改，如需修改请刷新页面重新生成大纲!",
        });
      }
    },
    // 如果有key值, 用户切换页面 数据复现
    returnDataToForm(data) {
      // title: "",
      //   extra_requirements: "",
      //   threeCon: false,
      //   language: "中文",
      //   type: "本科",
      //   product: "毕业论文",
      //   paper_level: 0,
      //   field: ["哲学", "哲学类"],
      //   key: "",
      //   word_count: 5000,
      // this.requestForm.title = data.title
      this.requestForm = { ...data };
      if (typeof data.field == "string") {
        this.requestForm.field = data.field;
      } else {
        this.requestForm.field = data.field[1];
      }

      // this.requestForm.paper_level = parseInt(data.paper_level);
    },
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
    setFormData(data, index) {
      this.$log("setFormdata-----------", data, index);
      if (data) {
        this.requestForm = { ...data };
      }
    },
    // loadingBtn() {
    //   this.produceLineStatus = true;
    //   this.sendOutlineForm();
    // },
    sendV2Form() {
      // let data = {
      //   key: this.formdataV2.key,
      // };
      // create_outline(data).then((res) => {
      //   this.$message({
      //     type: "success",
      //     message: "申城大纲成功!",
      //   });
      // });
      this.sendOutlineForm("v2");
    },
    closeConfirm() {
      this.lineDetailStatus = false;
      this.$store.dispatch("app/setProStatus", false);
    },
    handleClose(done) {
      this.$store.dispatch("app/setProStatus", false);

      done();
    },
    confirmSend() {
      this.lineDetailStatus = false;
      let data = {
        key: this.formdataV2.key || this.formdataV2.key1,
        extra_requirements: this.requestForm.extra_requirements,
      };
      if (this.requestForm.extra_requirements) {
        save_extra_requirements(data)
          .then((res) => {
            this.sendV2Fun();
          })
          .catch(() => {
            this.$store.dispatch("app/setProStatus", false);
          });
      } else {
        this.sendV2Fun();
      }
    },
    // 用户投喂保存
    saveExtraFun(vision) {
      console.log("已选择蚊香", this.formdataV2.reference_paper_selected_lists);
      if (!this.formdataV2.reference_paper_selected_lists) {
        this.$message({
          type: "warning",
          message: "请在论文选择区, 选择至少10篇参考文献!",
        });
        this.$store.dispatch("app/setProStatus", false);
        return false;
      }
      if (this.formdataV2.reference_paper_selected_lists.length < 10) {
        this.$message({
          type: "warning",
          message: "请在论文选择区, 选择至少10篇参考文献!",
        });
        this.$store.dispatch("app/setProStatus", false);

        return false;
      }
      if (this.formdataV2.reference_paper_selected_lists.length > 30) {
        this.$message({
          type: "warning",
          message: "最多选择30篇参考文献,请在已选择列表删除部分参考文献!",
        });
        this.$store.dispatch("app/setProStatus", false);

        return false;
      }
      // TODO:
      this.lineDetailStatus = true;
      return false;
      this.$confirm(
        "请仔细检查所勾选文献与您专业和论文题目的相关性，万象学术模型会进行参考文献相关性进行引用逐级生成大纲，若相关性不大，可能不会引用！ 是否继续?",
        "温馨提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {})
        .catch(() => {
          this.$store.dispatch("app/setProStatus", false);

          this.$message({
            type: "info",
            message: "已取消生成",
          });
        });
    },
    // v2发送请求保存
    sendV2Fun() {
      // 保存用户输入数据
      console.log("requestForm", this.requestForm);
      console.log("requestForm", this.formdataV2);

      let data2 = {
        key: this.formdataV2.key || this.formdataV2.key1,
        title: this.requestForm.title,
        language: this.requestForm.language,
        field: "",
        type: this.requestForm.type,
        product: this.requestForm.product,
        word_count: this.requestForm.word_count,
        paper_level: this.requestForm.paper_level,
      };
      if (typeof this.requestForm.field === "string") {
        data2.field = this.requestForm.field;
      } else {
        data2.field = this.requestForm.field[1];
      }
      this.loading = true;
      create_outline(data2)
        .then((res) => {
          window.zhuge.track("生成大纲", {
            语言: this.requestForm.language,
            科目: this.requestForm.field[1],
            学业类型: this.requestForm.type,
            论文类型: this.requestForm.product,
            论文水平: this.requestForm.paper_level,
            论文字数: this.requestForm.word_count,
          });
          this.loading = false;
          this.$store.dispatch("app/setProStatus", true);

          this.$log("outlineCreateres", res);
          eventBus.emit("emitOulineClick", 3); // 发布事件
          this.$log("lunwen", this.requestForm);
          this.requestForm.key = res.result.key;
          this.$store.dispatch("app/setRequestForm", this.requestForm);
          this.requestKey = res.result.key;
          // this.requestKey = "eb3a2422-301c-47ba-be1f-7c334e15c655";
          polling({ key: this.requestKey, type: 3 }, 5000)
            .then((res) => {
              this.$log("dddddaaaaaaaaaa", res);
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
              // eventBus.emit("errorOutline", error); // 发布事件
              this.$emit("errorBack", "关闭index");
            });
        })
        .catch(() => {
          this.loading = false;
          this.$store.dispatch("app/setProStatus", false);
        });
    },
    sendOutlineForm: function (vision) {
      if (this.produceLineStatus) {
        this.$message({
          type: "warning",
          message: "大纲生成中,请勿重复点击!",
        });
        return false;
      }

      // 判断是否登录,否则跳转到登录页面
      const hasToken = getToken();
      if (hasToken) {
        if (!this.requestForm.title) {
          this.$message({
            type: "warning",
            message: "请输入论文题目!",
          });
          return false;
        }
        if (this.requestForm.title.length < 5) {
          this.$message({
            type: "warning",
            message: "标题请至少输入5个字!",
          });

          return false;
        }
        this.$store.dispatch("app/setProStatus", true);

        if (vision == "v1") {
          // 保存用户输入数据
          let data = {
            title: this.requestForm.title,
            language: this.requestForm.language,
            field: "",
            type: this.requestForm.type,
            product: this.requestForm.product,
            paper_level: this.requestForm.paper_level,
            word_count: this.requestForm.word_count,
            extra_requirements: this.requestForm.extra_requirements,
          };
          if (typeof this.requestForm.field === "string") {
            data.field = this.requestForm.field;
          } else {
            data.field = this.requestForm.field[1];
          }
          outlineCreate(data)
            .then((res) => {
              window.zhuge.track("生成大纲", {
                语言: this.requestForm.language,
                科目: this.requestForm.field[1],
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
              polling({ key: this.requestKey, type: 3 }, 5000)
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
                  // eventBus.emit("errorOutline", error); // 发布事件
                  this.$emit("errorBack", "关闭index");
                });
            })
            .catch(() => {
              this.$store.dispatch("app/setProStatus", false);
            });
        }
        if (vision == "v2") {
          // 先保存自定一内容  然后生成大纲
          this.saveExtraFun();
        }
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
            this.$store.dispatch("paper/setAdditionList", []);

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
      this.$emit("errorBack", "关闭index");
      this.$store.dispatch("paper/setOutlineVersion", val);

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
    cursor: pointer;
  }

  .paperClass {
    @include center-content(22px);
  }

  .activeLT {
    // height: 60px;
    // line-height: 60px;
    // border: 1px solid #ccc;
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
  padding-right: 40px;
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

.delTips2 {
  animation-iteration-count: infinite;
  animation-duration: 2s;
  background: #fff;
  padding: 4px;
  line-height: 16px;
  margin-left: 10px;
  border-radius: 3px;
  font-weight: bold;
  color: #f56c6c;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
.introSpanOutline {
  font-size: 12px;
  position: relative;
  top: 3px;
  margin-left: 8px;
  color: rgb(96, 98, 102);
}
.firstItem {
  span {
    margin-right: 10px;
  }
}

.outlineBasic {
  position: relative;
}
.outlineBasicDia {
  position: absolute;
  top: 0;
  border-radius: 10px;
  bottom: 0;
  right: 0;
  left: 0;
  margin: 0 auto;
  background: rgb(255, 255, 255, 0.7);
  z-index: 1000;
}
</style>
