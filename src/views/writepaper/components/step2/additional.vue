<template>
  <div>
    <!-- 页面名称 -->
    <div class="newCard">
      <!-- <div class="markBox">
        <img src="@/assets/images/mark.png" alt="" />
      </div> -->
      <!-- {{ requestForm }} -->
      <p class="requestTitle">
        {{ requestForm.product }}
      </p>
      <!-- 支付卡片 -->
      <div class="payCard">
        <!-- 正式版 -->

        <div
          class="cardClidOnly cardLeft"
          :class="{ selected: internalValue === 'left' }"
          @click="selectCard('left')"
        >
          <p class="cardIntro">正式版</p>
          <p class="cardIntroTitle">
            {{ requestForm.title }}
          </p>
          <p class="cardPrice">
            总价: <span>{{ defaultPrice }}元</span>
          </p>
          <div class="cardChildList">
            <p>
              {{ requestForm.type }}
            </p>
            <p>
              {{ requestForm.word_count ? requestForm.word_count : "暂无" }}
            </p>
            <p>
              {{ requestForm.language }}
            </p>
            <p>
              {{ requestForm.field && requestForm.field[1] }}
            </p>
          </div>
          <!-- 写死正式版的内容 -->
          <div
            v-show="
              requestForm.product == '毕业论文' ||
              requestForm.product ==
                '结课论文                                                       '
            "
            class="cardAdditions"
          >
            <p>
              <img src="@/assets/images/step/icon_24_qy@2x(1).png" alt="" />
              中英文摘要
            </p>
            <p>
              <img
                src="@/assets/images/step/icon_24_qy@2x(1).png"
                alt=""
              />中英文参考文献
            </p>
            <p>
              <img
                src="@/assets/images/step/icon_24_qy@2x(1).png"
                alt=""
              />论文正文(PDF版)
            </p>
            <p>
              <img
                src="@/assets/images/step/icon_24_qy@2x(1).png"
                alt=""
              />论文正文(Latex版)
            </p>
            <p>
              <img
                src="@/assets/images/step/icon_24_qy@2x(1).png"
                alt=""
              />论文正文(Word版)
            </p>
          </div>
          <div class="cardPress">
            <img src="@/assets/images/step/icon_24_bz@2x.png" alt="" />
            <p>承诺知网维普查重率低于20%，超过退款！</p>
          </div>
          <div class="selectImg">
            <img src="@/assets/images/step/icon_option_selected.png" alt="" />
          </div>
        </div>
        <!-- 预览版 -->
        <div
          v-show="
            requestForm.product == '毕业论文' ||
            requestForm.product ==
              '结课论文                                                       '
          "
          class="cardClidOnly cardRight"
          :class="{ selected: internalValue === 'right' }"
          @click="selectCard('right')"
        >
          <div class="selectImg">
            <img src="@/assets/images/step/icon_option_selected.png" alt="" />
          </div>
          <p class="cardIntro">预览版</p>
          <p class="cardIntroTitle">
            {{ requestForm.title }}
          </p>
          <p class="cardPrice">总价: <span>19.9元</span></p>
          <div class="cardChildList">
            <p>
              {{ requestForm.type }}
            </p>
            <p>
              {{ requestForm.word_count ? requestForm.word_count : "暂无" }}
            </p>
            <p>
              {{ requestForm.language }}
            </p>
            <p>
              {{ requestForm.field && requestForm.field[1] }}
            </p>
          </div>
          <!-- 写死正式版的内容 -->
          <div class="cardAdditions">
            <p>
              <img src="@/assets/images/step/icon_24_qy@2x(1).png" alt="" />
              查看正式版50%内容
            </p>
            <p>
              <img src="@/assets/images/step/icon_24_qy@2x(1).png" alt="" />
              预览满意后再解锁全文
            </p>
            <p>
              <img src="@/assets/images/step/icon_24_qy.png" alt="" />
              开题报告不支持预览
            </p>
            <p>
              <img src="@/assets/images/step/icon_24_qy.png" alt="" />

              任务书不支持预览
            </p>
            <p>
              <img src="@/assets/images/step/icon_24_qy.png" alt="" />

              文件综述不支持预览
            </p>
          </div>
        </div>
      </div>

      <!-- 说明部分 -->
      <div class="introList">
        <p>说明:</p>
        <p>1. 预览版不可退费；</p>

        <div>
          <el-popover
            :width="device == 'mobile' ? '350' : ''"
            placement="right"
            trigger="hover"
          >
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

            <p slot="reference" class="priceIntro">2. 价格体系说明；</p>
          </el-popover>
        </div>
      </div>
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
      selectedCard: "left", // 用于跟踪选中的卡片
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
  props: {
    value: {
      type: String,
      default: null,
    },
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
    internalValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("input", newValue);
      },
    },
    ...mapGetters(["requestForm", "homeData", "device"]),
    wordShow() {
      return (
        this.requestForm.product == "毕业论文" ||
        this.requestForm.product == "结课论文"
      );
    },
  },
  methods: {
    selectCard(card) {
      this.internalValue = card;
    },
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
      console.log("预估价格", this.requestForm);
      if (this.requestForm.key || this.requestForm.key1) {
        let data = {
          key: this.requestForm.key || this.requestForm.key1,
          type: this.requestForm.type,
          product: this.requestForm.product,
          word_count: this.requestForm.word_count,
        };
        predict_price(data).then((res) => {
          this.defaultPrice = res.result.predict_price;
        });
      }
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
.payCard {
  display: flex;
  justify-content: center;
  overflow: hidden;
}
.cardLeft {
  background: skyblue;
}

.cardChildList {
  display: flex;
  margin-top: 14px;
  p {
    height: 24px;
    line-height: 24px;
    background: #fff7e8;
    border: 1px solid #ff7d00;
    border-radius: 2px;
    padding: 0px 8px;
    color: #ff7d00;
    font-weight: bold;
    font-size: 12px;
    margin-right: 10px;
  }
}
.cardLeft,
.cardRight {
  border: 1px solid #ccc;
  padding: 10px;
  cursor: pointer;
}

.selected {
  background: #ffffff;
  border: 2px solid #0066ff !important;
}
.newCard {
  padding-left: 40px;
}
.requestTitle {
  width: 72px;
  height: 25px;
  font-family: PingFangSC-SNaNpxibold;
  font-weight: 600;
  font-size: 18px;
  color: #000000;
  letter-spacing: 0;
  margin-bottom: 20px;
}
.cardClidOnly {
  width: 360px;
  padding: 20px;
  background: #ffffff;
  border: 2px solid #d8dfe6;
  border-radius: 4px;
  position: relative;
}
.cardRight {
  margin-left: 20px;
}
.selectImg {
  width: 40px;
  height: 40px;
  position: absolute;
  bottom: -2px;
  right: -2px;
  display: none;
  img {
    width: 100%;
    height: 100%;
  }
}
.selected {
  .selectImg {
    display: block;
  }
}
.cardIntro {
  font-family: PingFangSC-SNaNpxibold;
  font-weight: 600;
  font-size: 14px;
  color: #0066ff;
  line-height: 18px;
}
.cardIntroTitle {
  font-family: PingFangSC-SNaNpxibold;
  font-weight: 600;
  font-size: 18px;
  color: #000000;
  margin-top: 10px;
}
.cardPrice {
  font-family: PingFangSC-SNaNpxibold;
  font-weight: 600;
  margin-top: 10px;
  font-size: 18px;
  color: #000000;
  span {
    color: #f53f3f;
  }
}

.cardAdditions {
  margin-top: 20px;
  font-family: PingFangSC-Regular;
  font-weight: bold;
  font-size: 14px;
  color: #1b2126;
  img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
  p {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
  }
}
.cardPress {
  font-family: PingFangSC-Medium;
  font-weight: 500;
  font-size: 14px;
  color: #00b42a;
  letter-spacing: 0;
  line-height: 18px;
  margin-top: 30px;
  display: flex;
  align-items: center;
  font-weight: bold;
  img {
    margin-right: 8px;
    width: 24px;
    height: 24px;
  }
}
.introList {
  margin-top: 20px;
  line-height: 20px;
  color: #1b2126;
  font-size: 14px;
  font-face: PingFangSC;
  font-weight: 400;
  text-align: left;
}

.priceIntro {
  color: #0066ff;
  font-size: 14px;
  width: 120px;
  font-weight: 400;
  text-align: left;
  text-decoration: underline;
  &:hover {
    cursor: pointer;
  }
}
</style>
