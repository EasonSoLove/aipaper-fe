<template>
  <div>
    <!-- 页面名称 -->
    <div class="spendingBox">
      <!-- <div class="markBox">
        <img src="@/assets/images/mark.png" alt="" />
      </div> -->
      <!-- {{ requestForm }} -->
      <p class="fuTitle">继续生成全文,您将获得以下权益</p>
      <div class="maintxt">
        <div class="borderBox">
          <div class="left">
            <svg class="icon svg-icon" aria-hidden="true">
              <use xlink:href="#icon-wj-zw"></use>
            </svg>
          </div>
          <div class="right">
            <p>
              [中文]{{ requestForm.title }}
              <span class="add">x1</span>
              <span class="wordage"
                >{{ requestForm.type }} | {{ requestForm.language }}</span
              >
            </p>
            <!-- {{ requestForm }}  -->
            <!-- <p>
              {{ requestForm.field ? requestForm.field[1] : "暂无" }}
              <span>含在线编辑</span>
            </p> -->
            <p v-if="wordShow" class="alertTxt">真实数据来源</p>
            <p v-if="!wordShow" class="alertTxt">{{ requestForm.product }}</p>
            <p v-if="wordShow" class="include">
              摘要 | 大纲目录 | 正文 | 参考文献
            </p>
            <p v-else class="include">{{ requestForm.product }}</p>
            <p class="alignR">
              <svg class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icon-checkmark"></use>
              </svg>
            </p>
          </div>
        </div>
      </div>
      <!-- 附件部分 -->
      <div
        v-show="
          requestForm.product == '毕业论文' ||
          requestForm.product ==
            '结课论文                                                       '
        "
        class="att"
      >
        <!-- <div class="borderBox">
          <div class="left">
            <svg class="icon svg-icon" aria-hidden="true">
              <use xlink:href="#icon-zhengwenmoban"></use>
            </svg>
          </div>
          <div class="right">
            <p>
              [开题报告]
              <span class="add">x1</span>
            </p>
            <p class="include">引言 | 主体 | 结论</p>
            <p class="alignR">
              <svg class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icon-checkmark"></use>
              </svg>
            </p>
          </div>
        </div> -->
        <!-- <div class="borderBox">
          <div class="left">
            <svg class="icon svg-icon" aria-hidden="true">
              <use xlink:href="#icon-wenxianzongshu18"></use>
            </svg>
          </div>
          <div class="right">
            <p>
              [文献综述]
              <span class="add">x1</span>
            </p>
            <p class="include">提供背景 | 展示现状</p>
            <p class="alignR">
              <svg class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icon-checkmark"></use>
              </svg>
            </p>
          </div>
        </div> -->
        <div class="borderBox">
          <div class="left">
            <svg class="icon svg-icon" aria-hidden="true">
              <use xlink:href="#icon-zhongyingwenyingwen"></use>
            </svg>
          </div>
          <div class="right">
            <p>
              [中英文摘要]
              <span class="add">x1</span>
            </p>
            <p class="include">中英文翻译 | 简洁扼要</p>
            <p class="alignR">
              <svg class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icon-checkmark"></use>
              </svg>
            </p>
          </div>
        </div>
        <div class="borderBox">
          <div class="left">
            <svg class="icon svg-icon" aria-hidden="true">
              <use xlink:href="#icon-icon-cankaowenxian"></use>
            </svg>
          </div>
          <div class="right">
            <p>
              [中英文参考文献]
              <span class="add"> </span>
            </p>
            <p class="include">提供依据 | 支撑论证</p>
            <p class="alignR">
              <svg class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icon-checkmark"></use>
              </svg>
            </p>
          </div>
        </div>
        <!-- 学术创新 -->
        <!-- <div class="borderBox">
          <div class="left">
            <svg class="icon svg-icon" aria-hidden="true">
              <use xlink:href="#icon-chuangxinfuwu"></use>
            </svg>
          </div>
          <div class="right">
            <p>
              [任务书]
              <span class="add">x1</span>
            </p>
            <p class="include">提出新观点 | 贡献新知识</p>
            <p class="alignR">
              <svg class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icon-checkmark"></use>
              </svg>
            </p>
          </div>
        </div> -->

        <!-- 论文正文(PDF版本) -->
        <div class="borderBox">
          <div class="left">
            <svg class="icon svg-icon" aria-hidden="true">
              <use xlink:href="#icon-pdf"></use>
            </svg>
          </div>
          <div class="right">
            <p>
              论文正文(PDF版本)
              <span class="add">x1</span>
            </p>
            <p class="alignR">
              <svg class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icon-checkmark"></use>
              </svg>
            </p>
          </div>
        </div>
        <!-- 论文正文(LEXTEX版本) -->
        <div class="borderBox">
          <div class="left">
            <svg class="icon svg-icon" aria-hidden="true">
              <use xlink:href="#icon-template"></use>
            </svg>
          </div>
          <div class="right">
            <p>
              论文正文(Latex版本)
              <span class="add">x1</span>
            </p>
            <p class="alignR">
              <svg class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icon-checkmark"></use>
              </svg>
            </p>
          </div>
        </div>
        <!-- 论文正文(WORD版本) -->
        <div class="borderBox">
          <div class="left">
            <svg class="icon svg-icon" aria-hidden="true">
              <use xlink:href="#icon-file-word-fill"></use>
            </svg>
          </div>
          <div class="right">
            <p>
              论文正文(Word版本)
              <span class="add">x1</span>
            </p>
            <p class="alignR">
              <svg class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icon-checkmark"></use>
              </svg>
            </p>
          </div>
        </div>
        <div style="width: 175px"></div>
      </div>
      <!-- <p class="fuTitle">增值附加服务</p> -->
      <p class="fuTitle">价格预估</p>
      <!-- {{ requestForm }} -->
      <div class="priceList">
        <p>
          <span> 学科: </span>
          {{ requestForm.type }}
        </p>
        <p>
          <span> 字数: </span>
          {{ requestForm.word_count ? requestForm.word_count : "暂无" }}
        </p>
        <p>
          <span> 预估费用: </span>
          <b class="danger"> {{ defaultPrice }}</b>
        </p>
        <p
          v-if="wordShow"
          style="text-align: center; color: #606266; font-size: 14px"
        >
          担心生成后不满意?
          <span class="red" style="font-weight: bold; font-size: 20px">
            19.9
          </span>
          元生成预览版,满意再付款
        </p>
        <p style="text-align: center; color: #606266; font-size: 12px">
          PS: 点击生成全文,在支付页可选择正式版(全款) / 预览版(19.9元)
        </p>
      </div>

      <div style="padding-bottom: 40px">
        <el-popover placement="top" width="800" trigger="hover">
          <el-table
            header-row-class-name="bgTable"
            border
            stripe
            :data="tableData"
            style="width: 100%"
            :span-method="cellSpanMethod"
          >
            <el-table-column
              prop="wordCount"
              align="center"
              label="字数"
            ></el-table-column>
            <el-table-column
              prop="vocational"
              align="center"
              label="专科"
            ></el-table-column>
            <el-table-column
              prop="undergraduate"
              align="center"
              label="本科"
            ></el-table-column>
            <el-table-column
              prop="master"
              align="center"
              label="研究生"
            ></el-table-column>
            <el-table-column
              prop="finalPaper"
              align="center"
              label="结课论文"
            ></el-table-column>
            <el-table-column align="center" label="开题报告">
              <template slot-scope="scope">
                <div
                  v-if="scope.$index === 0"
                  style="text-align: center; line-height: 100px"
                >
                  {{ tableData[0].openingReport }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="任务书">
              <template slot-scope="scope">
                <div
                  v-if="scope.$index === 0"
                  style="text-align: center; line-height: 100px"
                >
                  {{ tableData[0].taskBook }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="文献综述">
              <template slot-scope="scope">
                <div
                  v-if="scope.$index === 0"
                  style="text-align: center; line-height: 100px"
                >
                  {{ tableData[0].literatureReview }}
                </div>
              </template>
            </el-table-column>
          </el-table>

          <p class="priceLine" slot="reference">
            如果价格有疑问，参考价格体系说明。（鼠标移入查看价格图）
          </p>
        </el-popover>
      </div>

      <!-- <el-checkbox-group
          class="addService "
          v-model="checkboxGroup1"
          @change="fuChange"
          size="small"
        >
          <el-checkbox
            v-for="(item, index) in homeData.additional_service"
            :label="item.id"
            :key="index + 'fu'"
            :disabled="item.is_supported"
            border
          >
            <div class="cusLabel">
              <p class="topIntro" v-show="item.intro">{{ item.intro }}</p>
              <p class="addName">{{ item.name }}</p>
              <div class="price">
                <span>0.0元</span>
                <span>{{ item.price }}元</span>
              </div>
            </div>
          </el-checkbox>
        </el-checkbox-group> -->

      <!-- <p class="tips" @click="reduceAIGC">
          AIGC率知网超25%<span>包退费</span>
        </p> -->
    </div>
  </div>
</template>
<script>
// import { sms } from "@/api/login";
// import webinfo from "@/components/webinfo.vue";
// import eventBus from "@/utils/eventBus";
import { mapGetters } from "vuex";
import { predict_price } from "@/api/paper";

export default {
  name: "additional",
  data() {
    return {
      // 定义变量
      checkboxGroup1: ["6", "7", "10", "11", "12", "13", "14", "15"],
      supportedProducts: [],
      tableData: [
        {
          wordCount: "5000以下",
          vocational: 76,
          undergraduate: 96,
          master: 136,
          finalPaper: 38,
          openingReport: 29,
          taskBook: 29,
          literatureReview: 29,
        },
        {
          wordCount: "6000-8000",
          vocational: 76,
          undergraduate: 96,
          master: 136,
          finalPaper: 48,
          openingReport: 29,
          taskBook: 29,
          literatureReview: 29,
        },
        {
          wordCount: "9000-10000",
          vocational: 116,
          undergraduate: 136,
          master: 176,
          finalPaper: 48,
          openingReport: 29,
          taskBook: 29,
          literatureReview: 29,
        },
        {
          wordCount: "10000 - 15000",
          vocational: 116,
          undergraduate: 136,
          master: 176,
          finalPaper: "-",
          openingReport: 29,
          taskBook: 29,
          literatureReview: 29,
        },
        {
          wordCount: "16000 - 20000",
          vocational: 156,
          undergraduate: 176,
          master: 216,
          finalPaper: "-",
          openingReport: 29,
          taskBook: 29,
          literatureReview: 29,
        },
        {
          wordCount: "21000 - 25000",
          vocational: 196,
          undergraduate: 216,
          master: 256,
          finalPaper: "-",
          openingReport: 29,
          taskBook: 29,
          literatureReview: 29,
        },
      ],
      defaultPrice: "",
      model: false,
    };
  },
  components: {
    // webinfo,
  },
  watch: {
    requestForm: {
      handler(newVal, oldVal) {
        // 检查是否为初始化调用
        if (oldVal === undefined) {
          this.getDefaultPrice(); // 如果需要在初始化时调用
          return false;
        }
        // 检查具体的字段是否发生变化
        if (
          newVal.key !== oldVal.key ||
          newVal.word_count !== oldVal.word_count ||
          newVal.product !== oldVal.product
        ) {
          // 在这里执行你的操作
          this.getDefaultPrice();
        }
      },
      deep: true, // 启用深度监听
      immediate: true,
    },
  },

  mounted() {
    // eventBus.emit("sendOutline", 5); // 发布事件
    // 页面初始化
    // this.$store.dispatch("paper/setAdditionList", this.supportedProducts);
    // this.fuChange();
  },
  created() {
    // eventBus.on("sendOutline", this.addE); // 订阅事件
  },
  beforeDestroy() {
    // eventBus.off("sendOutline", this.addE); // 移除事件监听
  },
  computed: {
    ...mapGetters(["requestForm", "homeData"]),
    wordShow() {
      return (
        this.requestForm.product == "毕业论文" ||
        this.requestForm.product == "结课论文"
      );
    },
  },
  methods: {
    cellSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex >= 5) {
        // 合并最后三列的单元格
        if (rowIndex === 0) {
          return [this.tableData.length, 1];
        } else {
          return [0, 0];
        }
      }
    },
    getDefaultPrice() {
      // 获取预估价格
      let data = {
        key: this.requestForm.key,
        type: this.requestForm.type,
        product: this.requestForm.product,
        word_count: this.requestForm.word_count,
      };
      predict_price(data).then((res) => {
        this.defaultPrice = res.result.predict_price;
      });
    },
    getPrice(educationLevel, wordCount) {
      const levelMap = {
        专科: "vocational",
        本科: "undergraduate",
        研究生: "master",
        结课论文: "finalPaper",
      };

      const levelKey = levelMap[educationLevel];
      if (!levelKey) return "未知学历";

      const range = this.tableData.find((item) => {
        const [min, max] = item.wordCount
          .split("-")
          .map((w) => w.trim().replace(/[^\d]/g, ""));
        if (max) {
          return wordCount >= parseInt(min) && wordCount <= parseInt(max);
        }
        return wordCount < parseInt(min);
      });

      if (range && range[levelKey] !== "-") {
        return `${range[levelKey]}元`;
      } else {
        return "无对应价格";
      }
    },
    juanChange(index) {
      this.model = !this.model;
      this.$log(this.model, "model");
      if (this.model) {
        this.$store.dispatch("paper/setAdditionList", this.supportedProducts);
      }
    },
    // this.$store.dispatch("paper/setAdditionList", []);
    // fuChange(val) {
    //   // let fuList =\
    //   const selectedProducts = this.homeData.additional_service.filter(
    //     (product) => this.checkboxGroup1.includes(product.id)
    //   );
    //   this.$log("val", this.checkboxGroup1);

    //   this.$store.dispatch("paper/setAdditionList", selectedProducts);
    // },
    // 定义方法
    reduceAIGC() {
      if (this.checkboxGroup1.indexOf("7") != -1) {
        let i = this.checkboxGroup1.indexOf("7");
        this.checkboxGroup1.splice(i, 1);
      } else {
        this.checkboxGroup1.push("7");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
// 引入scss
// @import "@/styles/variables.scss";
// @import "@/styles/mediaMain.scss";
// @import './index.scss';
@import "@/styles/variables.scss";
@import "../index.scss";
// 媒体查询
// @media only screen and (max-width: 939px) {
// }
// @media only screen and (max-width: 768px) {
// }

.floorBox {
  font-size: 16px;
  width: 150px;
  height: 40px;
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid #cccccc;
  line-height: 40px;
  padding-left: 14px;
  padding-right: 16px;
  margin-bottom: 22px;
  background: #3355ff;
  color: #fff;
  border-color: #3355ff;
  > div {
    display: inline-block;

    &.right {
      padding-left: 5px;
    }

    .home-icon {
      width: 18px;
      height: 18px;
      transform: translateY(3px);
    }
  }
  .left {
    flex: none;

    svg.icon {
      width: 33px;
      height: 33px;
    }
  }

  .right {
    flex-grow: 1;
    position: relative;
    padding-left: 5px;

    .alignR {
      text-align: right;
      position: absolute;
      right: 0;
      bottom: -8px;

      svg.icon {
        width: 14px;
        height: 14px;
        color: #018417;
      }
    }

    p {
      margin: 0;
      line-height: 1.5em;
    }

    p:first-child {
      padding: 5px 0;
    }
  }
}

.activeClass {
  background: #fff !important;
  color: #606266 !important;
}
.floorBox {
  &:hover {
    cursor: pointer;
  }
}
.priceList {
  padding-left: 20px;
  line-height: 30px;
  font-size: 16px;
}

.priceLine {
  width: 350px;
  margin: 0 auto;
  margin-top: 40px;
  text-decoration: underline;
  &:hover {
    cursor: pointer;
  }
}
.bgTable {
  background: red;
}
</style>
