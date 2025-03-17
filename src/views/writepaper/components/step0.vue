<template>
  <div>
    <!-- 最近创建的大纲 最近生成的论文 -->
    <!-- <div :class="[device == 'desktop' ? 'recentListBox' : '']">
      <div class="outlineListClass" v-if="outlinesList.length > 0">
        <div class="lineNav">
          <p>最近创建的大纲</p>
        </div>
        <div
          v-for="(orderObj, index) in outlinesList"
          :key="index + 'outlineList'"
        >
          <div class="order">
            <div>
              <div class="orderTitle stpe0Outline">
                <div class="titleOrder">
                  {{ orderObj.title }}
                </div>
                <div style="width: 165px; display: inline-block">
                  <el-button
                    @click="sendList(orderObj)"
                    icon="el-icon-edit"
                    :disabled="orderObj.status != '生成成功'"
                    type="text"
                  >
                    继续生成正文,任务书等
                  </el-button>
                </div>
              </div>
              <div class="orderText rowBetween handleRow">
                <div class="left">大纲状态：{{ orderObj.status }}</div>
                <div class="right">
                  <el-button
                    @click="downLoadLine(orderObj)"
                    icon="el-icon-download"
                    :disabled="orderObj.status != '生成成功'"
                    type="text"
                  >
                    付费下载
                  </el-button>
                  <el-button
                    @click="jumpStep2(orderObj)"
                    icon="el-icon-view"
                    :disabled="orderObj.status != '生成成功'"
                    type="text"
                  >
                    查看大纲
                  </el-button>
                </div>
              </div>
            </div>

            <div class="orderText rowStart handleRow">
              <div class="left">
                类型:
                <span class="price">{{ orderObj.type }}</span>
              </div>
              <div class="left">
                科目:
                <span class="price">{{ orderObj.field }}</span>
              </div>
              <div class="left">
                生成时间：
                <span class="price">{{
                  orderObj.updated_at | dateFormatter
                }}</span>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div class="outlineListClass" v-if="orderList.length > 0">
        <div class="lineNav">
          <p>近期订单</p>
        </div>
        <div
          class="order"
          v-for="(orderObj, index) in orderList"
          :key="index + 'outlineList'"
        >
          <template>
            <div class="orderTitle" :key="'case2' + index">
              {{ orderObj.outline.title }}
            </div>
            <div
              v-if="orderObj.order_item_response.length > 0"
              class="orderText rowBetween handleRow orderTextImport"
              :key="'case3' + index"
            >
              <div class="left">
                <span>
                  生成状态：
                  {{
                    orderObj.order_item_response[0].case.paper_case.stage
                      | orderStatusFormatter
                  }}
                </span>
                <span style="margin-left: 10px">
                  论文类型:{{
                    orderObj.order.order_type
                      ? orderTypes[orderObj.order.order_type]
                      : "正文"
                  }}
                </span>
              </div>
              <div class="right">
                <el-button
                  icon="el-icon-view"
                  type="text"
                  :disabled="
                    !orderObj.order_item_response[0].case.file_urls.pdf
                  "
                  @click="openPaper(orderObj)"
                >
                  预览
                </el-button>
                <template
                  v-if="
                    orderObj.order_item_response[0].case.paper_case.stage == 2
                  "
                >
                  <el-button
                    icon="el-icon-download"
                    :disabled="
                      orderObj.order.payment_status != 'TRADE_SUCCESS' ||
                      downStatus
                    "
                    type="text"
                    @click="downLoadPaper(orderObj)"
                  >
                    下载
                  </el-button>
                </template>
                <el-button
                  size="mini"
                  class="handle"
                  @click="$sendPay(orderObj, '去支付')"
                  v-if="orderObj.order.payment_status == 'WAIT_BUYER_PAY'"
                  style="color: crimson"
                  icon="el-icon-shopping-cart-full"
                >
                  去支付
                </el-button>
                <el-button
                  size="mini"
                  class="handle"
                  @click="$sendPay(orderObj, '付尾款')"
                  v-if="
                    orderObj.order.payment_status == 'TRADE_DEPOSIT_SUCCESS'
                  "
                  style="color: crimson"
                  icon="el-icon-shopping-cart-full"
                >
                  付尾款
                </el-button>
              </div>
            </div>
            <div
              v-else
              class="orderText rowBetween handleRow"
              :key="'case3' + index"
            >
              <div class="left">
                生成状态：未生成
                <span style="margin-left: 10px">
                  论文类型:{{
                    orderObj.order.order_type
                      ? orderTypes[orderObj.order.order_type]
                      : "正文"
                  }}
                </span>
              </div>
              <div class="right">
                <el-button
                  size="mini"
                  class="handle"
                  @click="$sendPay(orderObj, '去支付')"
                  v-if="orderObj.order.payment_status == 'WAIT_BUYER_PAY'"
                  style="color: crimson"
                  icon="el-icon-shopping-cart-full"
                >
                  去支付
                </el-button>
                <el-button
                  size="mini"
                  class="handle"
                  @click="$sendPay(orderObj, '付尾款')"
                  v-if="
                    orderObj.order.payment_status == 'TRADE_DEPOSIT_SUCCESS'
                  "
                  style="color: crimson"
                  icon="el-icon-shopping-cart-full"
                >
                  付尾款
                </el-button>
              </div>
            </div>
          </template>
          <div class="orderText rowStart handleRow">
            <div class="left">
              类型:
              <span class="price">{{ orderObj.outline.type }}</span>
            </div>
            <div class="left">
              科目:
              <span class="price">{{ orderObj.outline.field }}</span>
            </div>
            <div class="left">
              生成时间：
              <span class="price">{{
                orderObj.order.created_at | dateFormatter
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <!-- 弹窗 -->
    <el-dialog
      title="选择生成的论文类型"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <div>
        <div style="margin-bottom: 20px">
          <div v-show="original_item.product" class="outlineDiaTItleP">
            <p>第一次所选内容:</p>
            <el-tag style="margin-left: 8px">
              <span>
                {{ original_item.product }}
              </span>
            </el-tag>
          </div>
          <div
            v-show="generated_items.length > 0"
            class="outlineDiaTItleP"
            style="display: flex; align-items: center; margin-top: 8px"
          >
            <p>已经生成过的内容:</p>
            <el-tag
              style="margin-left: 8px"
              v-for="(item, index) in generated_items"
              :key="'or2i' + index"
              type="success"
            >
              <span>
                {{ item.product }}
              </span>
            </el-tag>
          </div>
        </div>
        <!-- 论文类型 -->
        <p
          class="formItemLabel"
          style="margin-left: 40px; margin-top: 10px; margin-bottom: 15px"
        >
          论文类型
        </p>
        <div
          :class="[
            'firstItem',
            'secondItem',
            device == 'mobile' ? 'mobilebox' : '',
          ]"
          style="padding: 0 40px"
        >
          <div class="selectLang formItem">
            <div class="formItemCon">
              <el-radio-group
                @change="requestProductChange"
                v-model="outlineListDialog.product"
              >
                <el-radio
                  v-for="item in homeData.category_product_list"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                >
                  <!-- <div class="labelBox"> -->
                  <div :class="getClass(item.name)">
                    <div class="left">
                      <img
                        v-if="outlineListDialog.product == item.name"
                        class="home-icon"
                        src="@/assets/images/bank-white.png"
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
                    <div class="right">
                      <svg
                        v-if="outlineListDialog.product == item.name"
                        class="icon svg-icon"
                        aria-hidden="true"
                      >
                        <use xlink:href="#icon-duigou-cu"></use>
                      </svg>
                      <svg v-else class="icon svg-icon" aria-hidden="true">
                        <use xlink:href="#icon-fangkuang"></use>
                      </svg>
                    </div>
                  </div>
                  <!-- </el-tooltip> -->
                </el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <!-- 字数 -->
        <div
          v-if="
            !(
              outlineListDialog.product == '开题报告' ||
              outlineListDialog.product == '任务书'
            )
          "
        >
          <p class="formItemLabel" style="margin-left: 40px; margin-top: 10px">
            论文字数
          </p>
          <div class="formItemCon">
            <el-slider
              style="margin: 8px 50px"
              v-model="outlineListDialog.word_count"
              :min="minCount"
              :max="maxCount"
              :marks="marks"
              :step="1000"
            >
            </el-slider>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSelect">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
// import { sms } from "@/api/login";
// import webinfo from "@/components/webinfo.vue";
import eventBus from "@/utils/eventBus";
import {
  getOutlineList,
  getOrderList,
  paperPack,
  ordersRepay,
  balance_pay,
} from "@/api/user";
import { throttle } from "lodash";
import { getToken } from "@/utils/auth"; //
import OrderType from "@/utils/orderTypes.js";

export default {
  name: "step0",
  data() {
    return {
      orderTypes: OrderType,

      dialogVisible: false,
      // 定义变量
      outlinesList: [], // 大纲列表
      orderList: [], // 订单列表
      downStatus: false,
      outlineListDialog: {
        product: "",
        word_count: 0,
      },
      minCount: 3000,
      maxCount: 25000,
      original_item: {},
      generated_items: [],
      currentDialogRow: {},
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
            color: "#E6A23C",
            width: "90px",
          },
          label: this.$createElement("strong", "25000"),
        },
      },
    };
  },
  components: {
    // webinfo,
  },
  mounted() {
    // eventBus.emit("sendOutline", 5); // 发布事件
    const hasToken = getToken();
    if (hasToken) {
      this.handleCurrentChange();
    } else {
      this.$log("用户未登录,大纲不加载 step0!");
    }
    // 页面初始化
  },
  created() {
    eventBus.on("step0Reload", this.handleCurrentChange); // 订阅事件
    eventBus.on("outlineGen", this.sendList); // 订阅事件
  },
  beforeDestroy() {
    eventBus.off("step0Reload", this.handleCurrentChange); // 移除事件监听
    eventBus.off("outlineGen", this.sendList); // 移除事件监听
  },
  computed: {
    // 计算属性
    ...mapGetters(["device", "homeData", "requestForm"]),
  },
  methods: {
    submitSelect() {
      if (!this.outlineListDialog.product) {
        this.$message({
          type: "warning",
          message: "请选择您要生成的类型",
        });
        return false;
      }

      this.currentDialogRow.product = this.outlineListDialog.product;
      this.currentDialogRow.word_count = this.outlineListDialog.word_count;
      this.jumpStep2(this.currentDialogRow);
    },
    getClass(currentName) {
      return {
        labelBox: true, // 始终应用的类
        // firstRe: this.original_item.some((item) => item.name === currentName), // 根据条件动态添加
        // alsoRe: this.generated_items.some((item) => item.name === currentName), // 根据条件动态添加
      };
    },
    requestProductChange(val) {
      if (
        this.outlineListDialog.product == "开题报告" ||
        this.outlineListDialog.product == "任务书"
      ) {
        this.outlineListDialog.word_count = 0;
      } else if (val == "文献综述" || val == "结课论文") {
        let item = this.homeData.category_product_list.find(
          (item) => item.name == val
        );
        this.outlineListDialog.word_count = item.min_word_num;
        this.minCount = item.min_word_num;
        this.maxCount = item.max_word_num;
      } else {
        let selectItem = this.homeData.category_list.find(
          (item) => item.name == this.currentDialogRow.type
        );
        selectItem.max_word_num && (this.maxCount = selectItem.max_word_num);
        selectItem.max_word_num && (this.maxCount = selectItem.max_word_num);
      }
    },
    sendList(row) {
      Ming("ddd", row);
      this.currentDialogRow = row;
      this.original_item = row.original_item ? row.original_item : {};
      this.generated_items = row.generated_items ? row.generated_items : [];

      let _this = this;
      _this.dialogVisible = true;
    },
    downLoadLine(row) {
      let requestForm = {
        title: row.title,
        threeCon: false,
        language: row.language,
        type: row.type,
        field: ["哲学", row.field],
        key: row.key1,
      };
      this.$store.dispatch("app/setRequestForm", requestForm);
      eventBus.emit("showDownOutline", requestForm);
    },
    openPaper: _.debounce(function (item) {
      zhuge.track(`预览论文`, {
        订单价格: item.order.total_price,
        订单题目: item.outline.title,
        订单Out_trade_no: item.order.out_trade_no,
      });
      const targetPath = "/main/writepaper";
      const currentPath = this.$route.path;
      // 检查当前路径是否与目标路径相同
      if (currentPath !== targetPath) {
        this.$router.push(
          {
            path: targetPath,
            query: {
              timeData: new Date().getTime(),
            },
          },
          () => {
            // 确保 DOM 更新完成后再执行后续代码
            this.$nextTick(() => {
              this.$log("item", item);
              // 关闭弹窗
              eventBus.emit("orderDialogChange", false);
              // 保存订单ID
              this.$store.dispatch("app/toggleCurrentOrder", item.order);
              let realUrl = item.order_item_response[0].case.file_urls.pdf;
              eventBus.emit("pdfSuccessClick", realUrl); // 发布事件
            });
          }
        );
      } else {
        // 如果已经在目标路径，直接执行后续逻辑
        this.$nextTick(() => {
          this.$log("item", item);
          eventBus.emit("orderDialogChange", false);
          this.$store.dispatch("app/toggleCurrentOrder", item.order);
          let realUrl = item.order_item_response[0].case.file_urls.pdf;
          eventBus.emit("pdfSuccessClick", realUrl);
        });
      }
    }, 300),
    jumpStep2(row) {
      this.dialogVisible = false;
      this.$log("row", row);
      zhuge.track(`用户查看大纲`, {
        大纲标题: row.title,
        大纲key: row.key1,
      });
      this.$router.push(
        {
          path: "/main/writepaper",
          query: {
            key1: row.key1,
            field: row.field,
            timeData: new Date().getTime(),
          },
        },
        () => {
          this.$log("requestForm");
          let requestForm = {
            title: row.title,
            threeCon: false,
            language: row.language,
            type: row.type,
            field: ["哲学", row.field],
            key: row.key1,
            word_count: row.word_count ? row.word_count : 0,
            product: row.product,
            original_item: row.original_item ? row.original_item : {},
            generated_items: row.generated_items ? row.generated_items : [],
          };
          this.$store.dispatch("app/setRequestForm", requestForm);
          eventBus.emit("setFormData", requestForm); // 发布事件
          eventBus.emit("orderDialogChange", false);
        }
      );
    },
    // 定义方法
    handleCurrentChange: throttle(async function () {
      // 这里可以添加你的分页逻辑，例如发送请求获取新的数据
      let params = {
        page_num: 1,
        page_size: 5,
      };
      // 查询大纲
      getOutlineList(params).then((res) => {
        let data = res.result;
        if (Object.keys(data).length > 0) {
          this.outlinesList = data.outline_list || [];
          // this.page.page_num = data.page_num - 0;
          // this.page.total = data.total;
        }
      });
      // 查询订单
      getOrderList(params).then((res) => {
        let data = res.result;
        if (Object.keys(data).length > 0) {
          this.orderList = data.order_resp_list || [];
        }
      });
    }, 300), // 300毫秒内最多执行一次

    downLoadPaper: _.debounce(function (item) {
      zhuge.track(`下载论文`, {
        订单价格: item.order.total_price,
        订单题目: item.outline.title,
        订单Out_trade_no: item.order.out_trade_no,
      });
      this.downStatus = true;
      paperPack({ out_trade_no: item.order.out_trade_no }).then((res) => {
        this.downStatus = false;
        // window.open(res.result.zip_url, "_blank");
        // Create a temporary link element
        const link = document.createElement("a");
        link.href = res.result.zip_url;

        // Set the download attribute to suggest a filename
        link.download =
          item.order_item_response[0].case.paper_case.title + ".zip"; // Change 'filename.zip' to the desired file name

        // Append the link to the body
        document.body.appendChild(link);

        // Programmatically click the link to trigger the download
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);
      });
    }, 300),
    // sendPay(row, status) {
    //   zhuge.track(`点击去支付`, {
    //     订单价格: row.order.total_price,
    //     订单题目: row.outline.title,
    //     订单Out_trade_no: row.order.out_trade_no,
    //   });
    //   let data = {
    //     out_trade_no: row.order.out_trade_no, // 订单编号，必传
    //     payment_method: row.order.payment_method, // 支付方式，必传
    //   };

    //   if (status == "付尾款") {
    //     balance_pay(data).then((res) => {
    //       this.sendPayFinish(res, row, status);
    //     });
    //   } else {
    //     ordersRepay(data).then((res) => {
    //       this.sendPayFinish(res, row, status);
    //     });
    //   }
    // },
    // sendPayFinish(res, row, status) {
    //   this.$log("去支付 res", res);
    //   let currentOrder = row.order;
    //   // 存储订单信息用于订单页展示
    //   let outLineData = row.outline;
    //   let requestForm = {
    //     title: outLineData.title,
    //     language: outLineData.language,
    //     type: outLineData.type,
    //     field: ["哲学", outLineData.field],
    //     key: outLineData.key1,
    //     word_count: outLineData.word_count,
    //   };
    //   this.$store.dispatch("app/setRequestForm", requestForm);
    //   // 存储订单信息用于订单页展示
    //   let order = {
    //     out_trade_no: res.result.out_trade_no,
    //     pay_amount: res.result.pay_amount,
    //     pay_link: res.result.pay_link,
    //     original_price: res.result.original_amount,
    //     pay_type: currentOrder.pay_type,
    //     payment_status: currentOrder.payment_status,
    //     returnStatus: status,
    //     order_type: res.result.order_type,
    //   };
    //   // 保存订单信息,二维码, 价格
    //   this.$store.dispatch("app/toggleCurrentOrder", order);
    //   // 展示附加列表
    //   this.$store.dispatch(
    //     "paper/setAdditionList",
    //     res.result.additional_service
    //   );
    //   // 展示支付弹窗
    //   eventBus.emit("showEmitPaypopup", {
    //     requestKey: res.result.out_trade_no,
    //     payStatus: 2,
    //     paperPercent: 0,
    //   });
    // },
  },
};
</script>
<style lang="scss" scoped>
// 引入scss
// @import "@/styles/variables.scss";
// @import "@/styles/mediaMain.scss";
// @import './index.scss';
.recentListBox {
  display: flex;
  grid-gap: 10px; /* 格子间隔 */
  .outlineListClass {
    margin-bottom: 0px;
  }
}
.outlineListClass {
  margin-bottom: 10px;
  width: 50%;
  .ordersList {
    --border: 1px solid #0000001f;
    --border-bottom: 1px solid #0000001f;
    max-height: 90vh;
    overflow: auto;
    padding-right: 10px;
  }

  /* 整个滚动条 */
  .ordersList::-webkit-scrollbar {
    width: 8px;
    /* 滚动条宽度 */
    background-color: #f5f5f5;
    /* 背景颜色 */
  }

  /* 滚动条轨道 */
  .ordersList::-webkit-scrollbar-track {
    border-radius: 8px;
    background-color: #f5f5f5;
  }

  /* 滚动条滑块 */
  .ordersList::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: #555;
  }

  /* 当鼠标悬停在滑块上时的样式 */
  .ordersList::-webkit-scrollbar-thumb:hover {
    background-color: #666;
  }

  .orderBox {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 15px;
  }

  .orderBox .order {
    display: block;
    flex-grow: 1;
    height: fit-content;
    font-size: 14px;
    padding: 10px 15px;
    // border: 1px solid #0000001f;
    border: var(--border);
    border-radius: 5px;
    margin-left: 10px;
  }
  .order {
    background: #f2f2f2;
    // background: rgba(51, 85, 255, 0.1);

    padding: 10px;
    margin-top: 10px;
    border-radius: 10px;
  }
  .orderBox ::v-deep .el-checkbox .el-checkbox__label {
    display: none;
  }

  .rowBetween {
    display: flex;
    justify-content: space-between;
    line-height: 24px;
  }
  .rowStart {
    display: flex;
    line-height: 24px;
    justify-content: space-between;
  }

  .left {
    color: #666;
  }

  .rowBetween .right {
    color: #409eff;
  }

  .orderNum.rowBetween div {
    color: #999;
    font-size: 16px;
  }

  .orderTitle {
    color: #202020;
    font-weight: 600;
    font-size: 15px;
    line-height: 1.5em;
    min-height: 1.5em;
  }
  .stpe0Outline {
    display: flex;
    height: 30px;
    align-items: center;
    justify-content: space-between;
  }
  .handleRow:not(:last-child) {
    border-bottom: var(--border-bottom);
    margin-bottom: 10px;
  }

  .btns {
    text-align: right;
    // border-top: var(--border-bottom);
    padding: 15px 0;
  }

  .handle {
    cursor: pointer;
    margin-left: 5px;
  }
  .price {
    color: #303133;
  }
  padding: 20px;
  background: #fff;
  border-radius: 15px;
}
.lineNav {
  font-size: 16px;
  margin-top: 10px;
  color: #303133;
}
.orderTextImport {
  margin-bottom: 0px !important;
}
.orderText {
  height: 28px;
}
.titleOrder {
  display: inline-block; /* 确保元素是块级或具有块级特性 */
  width: calc(100% - 180px); /* 设置固定宽度 */
  overflow: hidden; /* 隐藏超出部分 */
  white-space: nowrap; /* 禁止换行 */
  text-overflow: ellipsis; /* 溢出时显示省略号 */
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
    }
  }
  .firstItem {
    flex-grow: 1;
    padding-right: 40px;
  }
}
.mobile {
  .formItem {
    margin-top: 10px !important;

    .formItemLabel {
      font-size: 16px;
    }

    .formItemCon {
      margin-top: 10px;

      &::v-deep .el-radio {
        margin-right: 10px;
        margin-bottom: 10px;
        height: 30px;
        line-height: 28px;
      }
    }
  }
}
::v-deep label.el-radio {
  width: auto;
  height: 40px;
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid #cccccc;
  line-height: 40px;
  padding-left: 14px;
  padding-right: 16px;
  margin-bottom: 22px;

  &.is-checked {
    background: #3355ff;
    border-color: #3355ff;
  }

  .el-radio__input.is-checked + .el-radio__label {
    color: #fff !important;
  }

  .el-radio__input {
    display: none;
  }

  .el-radio__label {
    padding-left: 0px;
  }
}
// 重置论文类型单选样式
.labelBox {
  font-size: 16px;

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
}
.firstRe {
  background: red;
}
.alsoRe {
  background: green;
}
.outlineDiaTItleP {
  display: flex;
  align-items: center;
  & > p {
    width: 160px;
    text-align: right;
  }
}
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

::v-deep .el-slider__marks-text {
  width: 40px; /* 调整宽度 */
  text-align: center; /* 居中对齐 */
}
</style>
