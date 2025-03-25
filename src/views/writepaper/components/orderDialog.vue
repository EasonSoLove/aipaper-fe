<template>
  <div>
    <!-- 页面名称 -->
    <!-- 付款成功弹窗 -->
    <el-dialog
      :append-to-body="true"
      :lock-scroll="false"
      :close-on-click-modal="false"
      title="订单支付"
      :visible.sync="ownPayStatus"
      :width="device == 'mobile' ? '90%' : '55%'"
      :before-close="handleClose"
    >
      <div class="reduceBox">
        <div class="boxLeft">
          <div class="reduceCard">
            <p>
              {{ requestForm.title ? requestForm.title : "暂无" }}
            </p>
            <div class="cardChildList">
              <p>
                {{ requestForm.type ? requestForm.type : "暂无" }}
              </p>
              <p>
                {{ requestForm.word_count ? requestForm.word_count : "暂无" }}
              </p>
              <p>
                {{ requestForm.language ? requestForm.language : "暂无" }}
              </p>
              <p>
                {{
                  requestForm.field
                    ? typeof requestForm.field == "string"
                      ? requestForm.field
                      : requestForm.field[1]
                    : ""
                }}
              </p>
            </div>
          </div>
          <div class="dialog-content">
            <!-- <button @click="clickffff">sssdd</button> -->
            <!-- 订单支付成功展示页面 -->
            <!-- <div
              v-if="
                payTitleStatus == 'TRADE_SUCCESS' ||
                this.payTitleStatus == 'TRADE_DEPOSIT_SUCCESS'
              "
            > -->
            <div class="paperProgress">
              <el-progress
                type="circle"
                :percentage="currentNumber"
              ></el-progress>
            </div>
            <p class="reduceP1">努力生成中</p>
            <p class="reduceP2">
              正在拼命查询, 学习大量
              <span style="font-weight: bold" class="primary">真实文献</span>
            </p>
            <p class="dialog-text">
              预计
              <span
                v-if="
                  currentOrder.product == '文献综述' ||
                  currentOrder.product == '任务书' ||
                  currentOrder.product == '结课论文' ||
                  currentOrder.product == '开题报告'
                "
                class="primary"
              >
                10分钟
              </span>
              <span v-else class="primary"> 60分钟 </span>左右完成 ，请耐心等待
            </p>
            <p class="dialog-text">如果您有事离开, 此弹窗可以放心关闭</p>
            <p class="dialog-text">
              后续,在
              <span style="color: #1b2126">顶部栏 - 我的订单</span>
              , 查看您的正文
            </p>
          </div>
        </div>
        <!-- 右边开始 -->
        <div class="boxRight">
          <p class="brTitle">支付信息</p>
          <p class="boxRightCon">
            <span class="imgbox">
              <img
                v-if="
                  payTitleStatus == 'TRADE_DEPOSIT_SUCCESS' ||
                  payTitleStatus == 'TRADE_SUCCESS'
                "
                src="@/assets/images/dialog/icon_64_zfcg@2x.png"
                alt=""
              />
              <img
                v-if="payTitleStatus == 'PRE_CREATE'"
                src="@/assets/images/dialog/icon_64_dzf@2x.png"
                alt=""
              />
              <img
                v-if="payTitleStatus == 'WAIT_BUYER_PAY'"
                src="@/assets/images/dialog/icon_64_qetk@2x.png"
                alt=""
              />
              <img
                v-if="payTitleStatus == 'TRADE_FINISHED'"
                src="@/assets/images/dialog/icon_64_zfygb@2x.png"
                alt=""
              />
            </span>
            <span class="brp">{{ payStatusObject[payTitleStatus] }}</span>
          </p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="jumpStep">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import { sms } from "@/api/login";
// import webinfo from "@/components/webinfo.vue";
import eventBus from "@/utils/eventBus";
import { paperPack, orderDetailById } from "@/api/user";
import { mapGetters } from "vuex";

export default {
  name: "myFooter",
  data() {
    return {
      // 定义变量
      // ownPayStatus: true,
      ownPayStatus: false,
      currentNumber: 0,
      intervalId: "",
      payTitleStatus: "PRE_CREATE",
      payStatusObject: {
        TRADE_DEPOSIT_SUCCESS: "支付成功",
        TRADE_SUCCESS: "支付成功",
        WAIT_BUYER_PAY: "交易关闭或完成",
        PRE_CREATE: "待支付",
        TRADE_FINISHED: "交易结束!",
      },
      listData: [], // 存储请求返回的数据
      pollingInterval: 2000, // 轮询间隔时间，单位毫秒
      successIndex: 0,
    };
  },
  props: {
    payStatus: {
      type: Number,
      require: true,
      default: () => {
        return false;
      },
    },
    requestKey: {
      type: String,
      require: false,
    },
    timeData: {
      type: String,
      require: false,
    },
    paperPercent: {
      type: Number,
      require: false,
      default: 0,
    },
  },
  watch: {
    payStatus: {
      handler(newVal, oldVal) {
        // 在这里执行你需要的操作
        this.ownPayStatus = true;
        this.$store.dispatch("paper/setPollingStatus", true);
        this.$log("this.requestForm,弹窗内watch事件333", this.requestForm);

        this.getDetail();
      },
    },
    paperPercent: {
      handler(newVal, oldVal) {
        // 在这里执行你需要的操作
        this.currentNumber = newVal;
      },
      immediate: true, // 立即触发一次监听器
    },
  },
  components: {
    // webinfo,
  },
  mounted() {
    // eventBus.emit("sendOutline", 5); // 发布事件
    // 页面初始化
  },
  created() {
    // eventBus.on("sendOutline", this.addE); // 订阅事件
  },
  beforeDestroy() {
    // eventBus.off("sendOutline", this.addE); // 移除事件监听
  },
  computed: {
    // 计算属性
    ...mapGetters(["pollingStatus", "device", "currentOrder", "requestForm"]),
  },

  methods: {
    clickffff() {},
    handleClose(done) {
      if (
        this.payTitleStatus == "TRADE_SUCCESS" ||
        this.payTitleStatus == "TRADE_DEPOSIT_SUCCESS"
      ) {
        this.$confirm("关闭弹窗,不影响论文生成进度")
          .then((_) => {
            done();
            this.$store.dispatch("app/setActiveIndex", 0);
            this.$store.dispatch("paper/setPollingStatus", false);
            eventBus.emit("step0Reload", true); // 发布事件
          })
          .catch((_) => {});
      } else {
        eventBus.emit("step0Reload", true); // 发布事件

        done();
      }
    },
    jumpStep() {
      if (
        this.payTitleStatus == "TRADE_SUCCESS" ||
        this.payTitleStatus == "TRADE_DEPOSIT_SUCCESS"
      ) {
        this.$confirm("关闭弹窗,不影响论文生成进度")
          .then((_) => {
            // done();
            this.ownPayStatus = false;
            this.$store.dispatch("paper/setPollingStatus", false);
            this.$store.dispatch("app/setActiveIndex", 0);
            eventBus.emit("step0Reload", true); // 发布事件
          })
          .catch((_) => {});
      } else {
        this.ownPayStatus = false;
        this.$store.dispatch("paper/setPollingStatus", false);
        this.$store.dispatch("app/setActiveIndex", 0);
      }
    },
    /**
     * 获取列表数据，支持轮询
     * @param {Object} data 请求参数
     * @param {Number} delay 轮询间隔时间，默认2000ms
     * @param {Number} maxRetries 最大重试次数，默认为5次
     * @param {Number} currentRetry 当前重试次数，默认为0
     */
    getList(
      data,
      delay = this.pollingInterval,
      maxRetries = 5,
      currentRetry = 0
    ) {
      Ming("执行一次");
      if (this.pollingStatus) {
        console.warn("轮询正在进行中...");
      } else {
        return false;
      }
      orderDetailById(data)
        .then((res) => {
          this.$log("res", res.result);
          let result = res.result;
          let orderData = res.result.order;
          // 判断支付状态
          if (orderData.payment_status) {
            this.payTitleStatus = orderData.payment_status;
            if (
              (this.payTitleStatus == "TRADE_SUCCESS" ||
                this.payTitleStatus == "TRADE_DEPOSIT_SUCCESS") &&
              this.successIndex <= 0
            ) {
              this.addE(1500);
              this.successIndex += 1;
            }
          }
          // 判断论文生成状态
          const { order_item_response, order, outline } = res.result;
          let caseStatus = true;
          if (order_item_response.length > 0) {
            this.$log("case", order_item_response[0].case.paper_case.stage);
            this.$log(
              "case",
              order_item_response[0].case.paper_case.stage == 2
            );
            if (order_item_response[0].case.paper_case.stage == 2) {
              caseStatus = false;
            }
          }

          if (caseStatus) {
            // 如果满足继续轮询的条件，则设置延时后再次调用此方法
            let _this = this;
            setTimeout(() => {
              _this.getList(data, delay, maxRetries, currentRetry);
            }, delay);
          } else {
            let wordTypeList = [
              "EXTRA_PROPOSAL",
              "EXTRA_TASK_ASSIGNMENT",
              "EXTRA_JOURNAL_REVIEWED",
            ];
            // 请求成功, 激活tab3
            if (wordTypeList.includes(orderData.order_type)) {
              // word
              this.$store.dispatch("paper/setPollingStatus", false);
              // 保存数据， 用于step3下载
              this.$store.dispatch("app/toggleCurrentOrder", orderData);
              this.ownPayStatus = false;
              // 提示用户下载
              this.$confirm("文件已生成, 是否下载?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  // 下载word
                  paperPack({ out_trade_no: order.out_trade_no }).then(
                    (res) => {
                      // window.open(res.result.zip_url, "_blank");
                      // Create a temporary link element
                      const link = document.createElement("a");
                      link.href = res.result.zip_url;

                      // Set the download attribute to suggest a filename
                      link.download = outline.title + ".zip"; // Change 'filename.zip' to the desired file name

                      // Append the link to the body
                      document.body.appendChild(link);

                      // Programmatically click the link to trigger the download
                      link.click();

                      // Remove the link from the document
                      document.body.removeChild(link);
                      // let _this = this;
                      // setTimeout(() => {
                      //   _this.$message({
                      //     type: "success",
                      //     message: "已开始下载文件!",
                      //   });
                      //   _this.$store.dispatch("app/setActiveIndex", 0);
                      //   eventBus.emit("outlineGen", this.requestForm);
                      // }, 1000);
                    }
                  );
                  // 结束
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "我的订单可下载已生成文件!",
                  });
                });
            } else {
              // pdf
              let pdfUrl2 = order_item_response[0].case.file_urls.pdf;
              let realUrl = pdfUrl2 ? pdfUrl2 : "";
              this.$log("realUrl", realUrl);

              // 满足停止轮询的条件，更新数据并结束轮询
              this.listData = order_item_response; // 假设这里是你想更新的数据
              this.$store.dispatch("paper/setPollingStatus", false);
              // 保存数据， 用于step3下载
              this.$store.dispatch("app/toggleCurrentOrder", order);
              this.ownPayStatus = false;
              eventBus.emit("pdfSuccessClick", realUrl); // 发布事件
            }
            // let pdfUrl = "https://file.mixpaper.cn/pdf/third_output.pdf";

            // this.$nextTick(() => {
            //   this.$store.dispatch("app/togglePDFUrl", realUrl);
            // });
          }
        })
        .catch((error) => {
          console.error("请求失败", error);
          if (currentRetry + 1 < maxRetries) {
            // 如果当前重试次数小于最大重试次数，则等待一段时间后再次尝试
            let _this = this;
            setTimeout(() => {
              _this.getList(data, delay, maxRetries, currentRetry + 1);
            }, delay);
          } else {
            // 如果已经达到最大重试次数，则停止轮询
            this.$store.dispatch("paper/setPollingStatus", false);

            console.error("达到最大重试次数，停止轮询");
          }
        });
    },
    getDetail() {
      if (this.requestKey) {
        this.getList({ key: this.requestKey }, 10000);
      } else {
        this.$message({
          type: "warning",
          message: "订单号未返回!",
        });
      }
    },
    addE(index) {
      this.$log("dddd", index, this.paperPercent);
      clearInterval(this.intervalId); // 达到目标数字时清除定时器

      this.countUpToHundred(index);
    },
    // 定义方法
    countUpToHundred(totalSeconds) {
      if (this.paperPercent > 0) {
        this.currentNumber = this.paperPercent;
      } else {
        this.currentNumber = 0.0; // 同样初始化时确保它是一个带有两位小数的数字
      }
      const targetNumber = 99.99; // 目标数字是 100%
      const stepSize = targetNumber / totalSeconds; // 每秒增加的步长

      this.intervalId = setInterval(() => {
        this.currentNumber += stepSize; // 增加数值
        this.currentNumber = parseFloat(this.currentNumber.toFixed(2)); // 保留两位小数

        if (this.currentNumber >= targetNumber) {
          clearInterval(this.intervalId); // 达到目标数字时清除定时器
          this.currentNumber = targetNumber; // 确保最终值与目标值完全相同
        }
      }, 1000); // 每秒执行一次
    },
  },
};
</script>
<style lang="scss" scoped>
// 引入scss
// @import "@/styles/variables.scss";
// @import "@/styles/mediaMain.scss";
// @import './index.scss';

// 媒体查询
// @media only screen and (max-width: 939px) {
// }
// @media only screen and (max-width: 768px) {
// }

.el-dialog__header {
  text-align: center;
  font-size: 1.2rem;
  padding: 20px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #ddd;
}

.el-dialog__body {
  padding: 0px;
  text-align: center;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.paperProgress {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
  margin-top: 30px;
}

.el-button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 1rem;
}
.dialog-text {
  margin: 2px 0;
  text-align: center;
  color: #959da6;
  font-size: 14px;
  font-face: PingFangSC;
  font-weight: 400;
}
// 响应式设计
@media only screen and (max-width: 768px) {
  .order-dialog {
    .el-dialog {
      width: 95%; // 更小的宽度以适应手机屏幕
    }

    .el-dialog__header {
      font-size: 1.1rem;
      padding: 15px;
    }

    .el-dialog__body {
      padding: 5px;
    }

    .paperProgress {
      margin: 20px 0;
    }

    .el-button {
      margin: 10px;
      padding: 8px 15px;
      font-size: 0.9rem;
    }

    .dialog-footer {
      padding: 15px;
    }
  }
}
.dialog_pay_text {
  color: #409eff;
}

.cardChildList {
  display: flex;
  margin-top: 10px;
  p {
    height: 24px;
    line-height: 22px;
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
.reduceCard {
  font-family: PingFangSC-SNaNpxibold;
  font-weight: 600;
  font-size: 18px;
  color: #000000;
}
.reduceBox {
  margin-top: -30px;
  display: flex; /* 使用flex布局 */
  border-top: 1px solid #ccc;
}

.boxLeft {
  flex-grow: 1; /* 让左边的盒子自适应宽度 */
  /* 你可以根据需要添加其他样式 */
  padding: 20px 5px;
}

.boxRight {
  padding: 20px 40px;
  width: 200px; /* 固定宽度200px */
  background: #f4f5f7;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .brTitle {
    font-family: PingFangSC-SNaNpxibold;
    font-weight: 600;
    font-size: 18px;
    color: #000000;
    position: absolute;
    top: 20px;
    left: 20px;
  }
  .imgbox {
    width: 64px;
    height: 64px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .boxRightCon {
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .brp {
      font-family: PingFangSC-SNaNpxibold;
      font-weight: 600;
      font-size: 18px;
      color: #1b2126;
      text-align: center;
    }
  }
}
.reduceP1 {
  font-family: PingFangSC-SNaNpxibold;
  font-weight: 600;
  font-size: 16px;
  color: #1b2126;
  text-align: center;
}
.reduceP2 {
  color: #1b2126;
  font-size: 16px;
  font-face: PingFangSC;
  font-weight: 600;
  margin-top: 10px;
  margin-bottom: 25px;
}
</style>
