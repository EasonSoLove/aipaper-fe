<template>
  <div class="ordersList">
    <div class="btns">
      <el-button
        :size="device == 'mobile' ? 'mini' : 'medium'"
        type="primary"
        round
        @click="delList"
        >删除订单</el-button
      >
      <el-button
        :size="device == 'mobile' ? 'mini' : 'medium'"
        type="primary"
        round
        @click="refresh"
        >刷新订单</el-button
      >
    </div>
    <!-- 订单列表 -->
    <el-checkbox-group v-model="checkList" @change="handleCheckAllChange">
      <div
        class="orderBox"
        v-for="(orderObj, i) in orderList"
        :key="orderObj.order.id + '-' + i"
      >
        <el-checkbox
          :label="orderObj.order.out_trade_no"
          :value="orderObj.order.out_trade_no"
        ></el-checkbox>
        <!-- 订单展示 -->
        <div v-if="!!orderObj.order.key1" class="order">
          <div class="orderNum rowBetween">
            <!-- <div class="left">订单号：{{ orderObj.order.out_trade_no }}</div> -->
            <div class="left" style="width: 60%">
              <el-tooltip
                class="item"
                effect="dark"
                :content="`订单号: ${orderObj.order.out_trade_no}`"
                placement="top"
              >
                <p class="overHidden">
                  订单号: {{ orderObj.order.out_trade_no }}
                  <!-- 订单修改 -->
                </p>
              </el-tooltip>
            </div>
            <div class="right">
              时间：{{ orderObj.order.created_at | dateFormatter }}
            </div>
          </div>
          <div v-if="orderObj.order_item_response.length > 0">
            <template v-for="(item, j) in orderObj.order_item_response">
              <div
                class="orderTitle"
                style="margin-bottom: 8px"
                :key="'case2' + j"
              >
                <span v-show="orderObj.order.order_type != 'REDUCE_AIGC'">
                  论文题目:
                </span>
                {{ item.case.paper_case.title }}
              </div>
              <div class="orderTitle orderTitleSpan" :key="'case3' + j">
                生成状态:
                <el-link
                  :type="
                    item.case.paper_case.stage == 1
                      ? 'primary'
                      : item.case.paper_case.stage == 2
                      ? 'success'
                      : item.case.paper_case.stage === 3
                      ? 'danger'
                      : 'warning'
                  "
                >
                  {{
                    item.case.paper_case.stage | orderStatusFormatter
                  }}</el-link
                >
              </div>
              <div class="orderTitle orderTitleSpan" :key="'title' + j">
                <!-- {{ item.product.name }} -->
                订单类型:
                <span class="info">{{
                  orderObj.order.order_type
                    ? orderTypes[orderObj.order.order_type]
                    : "正文"
                }}</span>
              </div>

              <div class="orderTitle orderTitleSpan" :key="'title1' + j">
                <!-- {{ item.product.name }} -->
                支付类型:
                <span class="success">{{
                  payType[orderObj.order.pay_type]
                }}</span>
              </div>
              <div class="orderTitle orderTitleSpan" :key="'title12' + j">
                <!-- {{ item.product.name }} -->
                支付状态:
                <span class="warning">{{
                  payStatusObj[orderObj.order.payment_status]
                }}</span>
              </div>
              <div class="orderText rowBetween handleRow" :key="'case' + j">
                <div></div>
                <div class="right">
                  <el-button
                    icon="el-icon-view"
                    type="text"
                    :disabled="item.case.paper_case.stage !== 1"
                    @click="pushStep3(orderObj)"
                    v-show="orderObj.order.order_type != 'REDUCE_AIGC'"
                  >
                    查看论文进度
                  </el-button>
                  <el-button
                    icon="el-icon-view"
                    type="text"
                    :disabled="item.case.paper_case.stage !== 1"
                    @click="pushStep2(orderObj)"
                    v-show="orderObj.order.order_type == 'REDUCE_AIGC'"
                  >
                    查看降重进度
                  </el-button>
                  <el-button
                    icon="el-icon-view"
                    type="text"
                    :disabled="!item.case.file_urls.pdf"
                    @click="openPaper(orderObj)"
                    v-show="orderObj.order.order_type != 'REDUCE_AIGC'"
                  >
                    预览
                  </el-button>
                  <template v-if="item.case.paper_case.stage == 2">
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
                  <div v-if="item.case.paper_case.stage === 3" class="right">
                    <el-button
                      size="mini"
                      class="handle"
                      @click="sendReLoad(orderObj)"
                      style="color: crimson"
                      icon="el-icon-refresh"
                    >
                      重试
                    </el-button>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div v-else>
            <div style="margin-bottom: 8px" class="orderTitle">
              <!-- 论文题目: {{ orderObj.outline.title }} -->
              论文题目: {{ orderObj.outline.title }}
            </div>

            <div class="orderTitle orderTitleSpan">
              <!-- {{ item.product.name }} -->
              论文类型:

              <span class="info">{{
                orderObj.order.order_type
                  ? orderTypes[orderObj.order.order_type]
                  : "正文"
              }}</span>
            </div>
            <div class="orderTitle orderTitleSpan">
              <!-- {{ item.product.name }} -->
              支付类型:
              <span class="success">{{
                payType[orderObj.order.pay_type]
              }}</span>
            </div>
            <div class="orderTitle orderTitleSpan">
              <!-- {{ item.product.name }} -->
              支付状态:
              <span class="warning">{{
                payStatusObj[orderObj.order.payment_status]
              }}</span>
            </div>
          </div>

          <div class="orderText rowBetween handleRow">
            <div class="left">
              总价格:
              <span class="price">￥{{ orderObj.order.total_price }}</span>
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
                v-if="orderObj.order.payment_status == 'TRADE_DEPOSIT_SUCCESS'"
                style="color: crimson"
                icon="el-icon-shopping-cart-full"
              >
                付尾款
              </el-button>
            </div>
          </div>
        </div>
        <!-- 充值订单  -->
        <div
          v-if="!orderObj.order.key1"
          class="order"
          style="font-size: 14px; line-height: 20px"
        >
          <p>订单类型:支付订单</p>
          <p>
            支付状态:
            <span class="warning">{{
              payStatusObj[orderObj.order.payment_status]
            }}</span>
          </p>
          <p>
            订单金额:
            <span class="price">￥{{ orderObj.order.total_price }}</span>
          </p>
        </div>
      </div>
    </el-checkbox-group>
    <div class="block">
      <el-pagination
        background
        small
        layout="total, prev, pager, next"
        :total="page.total"
        :page-size="page.page_size"
        :current-page="page.page_num"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <progressonly
      :requestKey="requestKey"
      :payStatus="payStatusPro"
      :paperPercent="paperPercent"
    />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
// import { sms } from "@/api/login";
// import webinfo from "@/components/webinfo.vue";
import { getList } from "@/api/table";
import { re_reduce, reduce_pack } from "@/api/paper";
import OrderType from "@/utils/orderTypes.js";
import {
  getOrderList,
  delOrder,
  paperPack,
  ordersRepay,
  rePaper,
  balance_pay,
} from "@/api/user";
import { throttle } from "lodash";
import eventBus from "@/utils/eventBus";

export default {
  name: "UserOrders",
  props: {
    listId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      orderTypes: OrderType,
      requestKey: "", //out_trade_no
      payStatusPro: 0,
      paperPercent: 0,
      // 定义变量
      checkList: [],
      orderList: [],
      downStatus: false,
      payType: {
        PAY_ALL: "正式版",
        PAY_STAGES: "预览版",
      },
      payStatusObj: {
        WAIT_BUYER_PAY: "待支付",
        TRADE_DEPOSIT_SUCCESS: "已付定金",
        TRADE_SUCCESS: "支付成功",
      },
      page: {
        page_num: 0,
        page_size: 5,
        total: null,
      },
    };
  },
  components: {
    // webinfo,
  },
  watch: {
    // 当listId发生变化时执行此回调
    listId(newVal, oldVal) {
      // 在这里处理listId变化后需要做的事情
      this.handleCurrentChange(1);
    },
  },
  mounted() {
    // 页面初始化
    this.handleCurrentChange(1);
  },

  computed: {
    ...mapGetters(["device"]),
    // 计算属性
  },
  methods: {
    sendReLoad(obj) {
      Ming("obj", obj);
      if (obj.order.order_type == "REDUCE_AIGC") {
        let data = {
          reduce_key: obj.order.key1,
        };
        re_reduce(data).then((res) => {
          this.$message({
            type: "success",
            message: "成功重试，内容生成中！",
          });
          this.requestKey = obj.order.out_trade_no;
          this.payStatusPro = new Date().getTime();
          this.paperPercent = 0;
          this.refresh();
        });
        return false;
      }

      let data = {
        out_trade_no: obj.order.out_trade_no,
      };
      let outLineData = obj.outline;
      let requestForm = {
        title: outLineData.title,
        language: outLineData.language,
        type: outLineData.type,
        field: ["哲学", outLineData.field],
        key: outLineData.key1,
        word_count: outLineData.word_count,
      };
      this.$store.dispatch("app/setRequestForm", requestForm);
      rePaper(data).then((res) => {
        eventBus.emit("orderDialogChange", false);
        this.$nextTick(() => {
          eventBus.emit("showEmitPaperDialog", {
            requestKey: data.out_trade_no,
            payStatus: 4,
            paperPercent: 0,
          });
        });
      });
    },
    // sendPay(row, status) {
    //   this.$log("去支付", row);
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
    //       const targetPath = "/main/writepaper";
    //       const currentPath = this.$route.path;
    //       // 检查当前路径是否与目标路径相同
    //       if (currentPath !== targetPath) {
    //         this.$router.push(
    //           {
    //             path: "/main/writepaper",
    //             // query: { key1: row.key1, field: row.field },
    //           },
    //           () => {
    //             this.$nextTick(() => {
    //               this.sendPayFinish(res, row, status);
    //             });
    //           }
    //         );
    //       } else {
    //         this.sendPayFinish(res, row, status);
    //       }
    //     });
    //   } else {
    //     ordersRepay(data).then((res) => {
    //       const targetPath = "/main/writepaper";
    //       const currentPath = this.$route.path;
    //       // 检查当前路径是否与目标路径相同
    //       if (currentPath !== targetPath) {
    //         this.$router.push(
    //           {
    //             path: "/main/writepaper",
    //             // query: { key1: row.key1, field: row.field },
    //           },
    //           () => {
    //             this.$nextTick(() => {
    //               this.sendPayFinish(res, row, status);
    //             });
    //           }
    //         );
    //       } else {
    //         this.sendPayFinish(res, row, status);
    //       }
    //     });
    //   }
    // },
    // sendPayFinish(res, row, status) {
    //   this.$log("去支付 res", res, row.order);
    //   let currentOrder = row.order;
    //   let order = {
    //     out_trade_no: res.result.out_trade_no,
    //     pay_amount: res.result.pay_amount,
    //     pay_link: res.result.pay_link,
    //     original_price: res.result.original_amount,
    //     pay_type: currentOrder.pay_type,
    //     payment_status: currentOrder.payment_status,
    //     returnStatus: status,
    //   };
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
    //   this.$store.dispatch("app/toggleCurrentOrder", order);
    //   // this.$store.dispatch(
    //   //   "paper/setAdditionList",
    //   //   res.result.additional_service
    //   // );

    //   eventBus.emit("showEmitPaypopup", {
    //     requestKey: res.result.out_trade_no,
    //     payStatus: 2,
    //     paperPercent: 0,
    //   });
    //   // let payUrl = res.result.pay_link;
    //   // if (payUrl) {
    //   //   window.open(payUrl, "_blank");
    //   // }
    //   // eventBus.emit("showEmitPaypopup", {
    //   //           requestKey: res.result.out_trade_no,
    //   //           payStatus: 2,
    //   //           paperPercent: 0,
    //   //         });
    //   // 关闭弹窗
    //   eventBus.emit("orderDialogChange", false);
    //   // eventBus.emit("showEmitPaperDialog", {
    //   //   requestKey: res.result.out_trade_no,
    //   //   payStatus: 5,
    //   //   paperPercent: 0,
    //   // });
    // },

    pushStep2: _.debounce(function (row) {
      this.requestKey = row.order.out_trade_no;
      this.payStatusPro = new Date().getTime();
      this.paperPercent = 30;
    }, 300),
    pushStep3: _.debounce(function (row) {
      zhuge.track(`查看论文进度`, {});
      Ming("reow", row);
      if (row.order.order_type == "REDUCE_AIGC") {
        return false;
      }
      const targetPath = "/main/writepaper";
      const currentPath = this.$route.path;
      // 检查当前路径是否与目标路径相同
      if (currentPath !== targetPath) {
        this.$router.push(
          {
            path: "/main/writepaper",
            query: {
              timeData: new Date().getTime(),
            },
          },
          () => {
            this.$nextTick(() => {
              this.pushFinish(row);
            });
          }
        );
      } else {
        this.pushFinish(row);
      }
    }, 300),
    pushFinish(row) {
      eventBus.emit("orderDialogChange", false);
      Ming("rwo", row);
      // 关闭弹窗
      // 生成一个 0 到 10 之间的随机数，然后加上 30
      const randomNum = Math.random() * 10 + 30;
      // 使用 toFixed(2) 保留两位小数，并将结果转换为浮点数
      this.$log("ddd1111", row, row.order.out_trade_no);
      let outLineData = row.outline;
      let requestForm = {
        title: outLineData.title,
        language: outLineData.language,
        type: outLineData.type,
        field: ["哲学", outLineData.field],
        key: outLineData.key1,
        word_count: outLineData.word_count,
      };
      this.$store.dispatch("app/setRequestForm", requestForm);
      this.$nextTick(() => {
        eventBus.emit("showEmitPaperDialog", {
          requestKey: row.order.out_trade_no,
          payStatus: 4,
          paperPercent: parseFloat(randomNum.toFixed(2)),
        });
      });
    },
    downLoadPaper: _.debounce(function (item) {
      this.downStatus = true;
      if (item.order.order_type == "REDUCE_AIGC") {
        zhuge.track(`下载降重压缩包`);
        let data = {
          out_trade_no: item.order.out_trade_no,
        };
        reduce_pack(data)
          .then((res) => {
            Ming("dddd", res);
            if (res.result.zip_url) {
              window.open(res.result.zip_url);
              this.downStatus = false;
            } else {
              this.downStatus = false;

              this.$message({
                type: "warning",
                message: "下载链接为空！",
              });
            }
          })
          .catch(() => {
            this.downStatus = false;
          });

        return false;
      }

      zhuge.track(`下载论文`, {
        订单价格: item.order.total_price,
        订单题目: item.outline.title,
        订单Out_trade_no: item.order.out_trade_no,
      });
      paperPack({ out_trade_no: item.order.out_trade_no })
        .then((res) => {
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
        })
        .catch((err) => {
          this.downStatus = false;
        });
    }, 300),
    openPaper: _.debounce(function (item) {
      this.$log(item, "预览订单");
      zhuge.track(`预览论文`, {
        订单价格: item.order.total_price,
        订单题目: item.outline.title,
        订单Out_trade_no: item.order.out_trade_no,
      });
      const targetPath = "/main/writepaper";
      const currentPath = this.$route.path;
      this.$log("item", item);
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
          eventBus.emit("orderDialogChange", false);
          this.$store.dispatch("app/toggleCurrentOrder", item.order);
          let realUrl = item.order_item_response[0].case.file_urls.pdf;
          eventBus.emit("pdfSuccessClick", realUrl);
        });
      }
    }, 300),
    refresh() {
      this.handleCurrentChange(1);
    },
    handleCheckAllChange(val) {
      this.checkList = val;
      // if (val.length > 1) {
      //   this.$message({
      //     type: "warning",
      //     message: "只能同时选择一条数据!",
      //   });
      //   this.checkList.pop();
      // }
    },
    delList() {
      this.$log(this.checkList);
      let data = {
        trade_no_list: this.checkList,
      };
      delOrder(data).then((res) => {
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        this.checkList = [];
        this.handleCurrentChange();
      });
    },
    handleCurrentChange: throttle(function (newPage) {
      // 这里可以添加你的分页逻辑，例如发送请求获取新的数据
      let params = {
        page_num: newPage ? newPage : this.page.page_num,
        page_size: this.page.page_size,
      };
      getOrderList(params).then((res) => {
        let data = res.result;
        if (Object.keys(data).length > 0) {
          this.orderList = res.result.order_resp_list || [];
          this.page.page_num = data.page_num - 0;
          this.page.total = data.total;
        }
      });
    }, 300), // 300毫秒内最多执行一次
  },
};
</script>
<style lang="scss" scoped>
// 引入scss
// @import "@/styles/variables.scss";
// @import './index.scss';

// 媒体查询
// @media only screen and (max-width: 939px) {
// }
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

.orderBox ::v-deep .el-checkbox .el-checkbox__label {
  display: none;
}

.rowBetween {
  display: flex;
  justify-content: space-between;
  line-height: 2em;
}

.rowBetween .left {
  color: #666;
  width: 50%;
}

.overHidden {
  width: 100%; /* 根据需要调整宽度 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rowBetween .right {
  color: #409eff;
}

.orderNum.rowBetween div {
  color: #999;
  font-size: 12px;
}

.orderTitle {
  color: #202020;
  font-weight: 600;
  margin-top: 6px;
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
  color: #409eff;
  font-weight: bold;
}
.orderTitleSpan {
  width: 45%;
  display: inline-block;
}
</style>
