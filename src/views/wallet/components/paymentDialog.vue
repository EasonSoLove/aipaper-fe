<template>
  <div>
    <el-dialog
      :append-to-body="true"
      :lock-scroll="false"
      :close-on-click-modal="false"
      :visible.sync="popupStatus"
      :width="device == 'mobile' ? '90%' : '60%'"
      class="order-dialog"
      :before-close="handleClose"
    >
      <template slot="title">
        <div class="titleHeader">
          <p class="dialogTitleP">支付</p>
        </div>
      </template>
      <div class="dialog-content">
        <div class="payCodeBox">
          <div class="payLeftCode">
            <el-tabs type="border-card">
              <!-- <el-tab-pane>
                <span slot="label"
                  ><svg class="icon svg-icon" aria-hidden="true">
                    <use xlink:href="#icon-zhifubaozhifu"></use>
                  </svg>
                  支付宝支付</span
                >
                <div class="tabsBox">
                 <iframe
                    v-if="pollingStatus"
                    :src="currentOrder.pay_link"
                    height="205"
                    width="205"
                    frameborder="0"
                  ></iframe>
                  <p class="codeIntro">
                    支持使用
                    <b style="color: #00a1e9">“花呗”</b>
                    支付
                  </p>
                </div>
              </el-tab-pane> -->
              <el-tab-pane>
                <span slot="label">
                  <svg class="icon svg-icon" aria-hidden="true">
                    <use xlink:href="#icon-weixin"></use>
                  </svg>
                  微信支付
                </span>
                <img
                  style="width: 200px; height: 200px"
                  :src="qrCodeImage"
                  alt=""
                />
              </el-tab-pane>
              <!-- <el-tab-pane label="消息中心">消息中心</el-tab-pane> -->
            </el-tabs>
            <!-- left code -->
          </div>

          <div class="payRightPrice">
            <!-- left code -->

            <div>
              <div class="purchase-points">
                购买积分：<span class="points"
                  >{{ walletsOrder.recharge_amount }} 积分</span
                >
                <i style="margin-left: 10px"
                  >赠送:{{ walletsOrder.gift_amount }} 积分
                </i>
              </div>
              <div class="points-box">
                <div class="points-header">
                  <div class="points-info">
                    <i class="el-icon-wallet wallet-icon"></i>
                    <span>积&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分</span>
                  </div>
                  <span>{{ walletsOrder.recharge_amount }} 分</span>
                </div>
              </div>
              <div v-show="walletsOrder.gift_amount > 0" class="points-box">
                <div class="points-header">
                  <div class="points-info">
                    <i class="el-icon-wallet wallet-icon"></i>
                    <span>获赠积分&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  </div>
                  <span>{{ walletsOrder.gift_amount }} 分</span>
                </div>
              </div>
              <!-- 二维码 -->
              <div class="qr-code-container">
                <div>
                  <div>扫一扫付款 (元)</div>
                  <p class="payTitle">
                    支付金额:
                    <span>
                      <b> {{ walletsOrder.recharge_amount }} </b> </span
                    >元
                  </p>
                  <div class="payment-method">
                    <span>支付方式: </span>
                    <div class="wechat-button">
                      <div class="icon">
                        <svg
                          class="svg-icon"
                          style="width: 40px; height: 40px; color: rgb(0, 0, 0)"
                        >
                          <use xlink:href="#icon-weixin" fill="#000"></use>
                        </svg>
                      </div>
                      <span class="text">微信支付</span>
                    </div>

                    <!-- <div
                      type="success"
                      icon="el-icon-wechat"
                      class="alipay-button"
                    >
                      <img
                        src="https://www.alipay.com/favicon.ico"
                        alt="Alipay Logo"
                      />
                      <span>
                        支付宝<br />
                      </span>
                    </div> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { sms } from "@/api/login";
// import webinfo from "@/components/webinfo.vue";
import eventBus from "@/utils/eventBus";
import { getOrder, orderDetailById } from "@/api/user";
import { down_url } from "@/api/paper";
import { mapGetters } from "vuex";
import { downloadFile } from "@/utils/index";
import QRCode from "qrcode";
export default {
  name: "myFooter",
  data() {
    return {
      // 定义变量
      popupStatus: false,
      intervalId: "",
      payTitleStatus: "PRE_CREATE",
      payStatusObject: {
        TRADE_SUCCESS: "交易支付成功",
        WAIT_BUYER_PAY: "未付款交易超时关闭，或支付完成后全额退款",
        PRE_CREATE: "交易创建，等待买家付款",
        TRADE_FINISHED: "交易结束!",
      },
      listData: [], // 存储请求返回的数据
      pollingInterval: 1500, // 轮询间隔时间，单位毫秒
      successIndex: 0,
      qrCodeImage: "",
    };
  },
  components: {
    // webinfo,
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
  },
  watch: {
    payStatus: {
      handler(newVal, oldVal) {
        this.$log("支付状态发生变化", "新值:", newVal, "旧值:", oldVal);
        // 在这里执行你需要的操作
        this.popupStatus = true;

        this.$store.dispatch("paper/setPollingStatus", true);
        this.getDetail();
        this.generateQRCode();
      },
    },
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
    ...mapGetters(["pollingStatus", "device", "currentOrder", "walletsOrder"]),
  },

  methods: {
    async generateQRCode() {
      try {
        // 获取支付链接

        // 生成二维码
        QRCode.toDataURL(this.walletsOrder.pay_link, (err, url) => {
          if (err) {
            console.error(err);
            return;
          }
          this.qrCodeImage = url;
        });
      } catch (error) {
        console.error("Error generating QR Code:", error);
      }
    },
    showExample() {
      this.$refs.exampleDia.showDia();
    },
    handleClose(done) {
      // 刷新列表
      eventBus.emit("step0Reload", true); // 发布事件

      this.$store.dispatch("paper/setPollingStatus", false);
      done();
      // if (this.payTitleStatus == "TRADE_SUCCESS") {
      //   this.$confirm("关闭弹窗,不影响大纲生成进度")
      //     .then((_) => {
      //       done();
      //       this.$store.dispatch("app/setActiveIndex", 0);
      //       this.$store.dispatch("paper/setPollingStatus", false);
      //     })
      //     .catch((_) => {});
      // }
    },
    jumpStep() {
      if (this.payTitleStatus == "TRADE_SUCCESS") {
        this.$confirm("关闭弹窗,不影响大纲生成进度")
          .then((_) => {
            // done();
            this.popupStatus = false;
            this.$store.dispatch("paper/setPollingStatus", false);
            this.$store.dispatch("app/setActiveIndex", 0);
          })
          .catch((_) => {});
      } else {
        this.popupStatus = false;
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
      this.$log("执行一次");

      if (this.pollingStatus) {
        console.warn("轮询正在进行中...");
      } else {
        return false;
      }

      orderDetailById(data)
        .then((res) => {
          this.$log("---------------res-------------", res.result);
          let result = res.result;
          let orderData = res.result.order;
          // 判断支付状态
          if (orderData.payment_status) {
            this.payTitleStatus = orderData.payment_status;
            if (this.payTitleStatus == "TRADE_SUCCESS") {
              this.popupStatus = false;
              this.$store.dispatch("paper/setPollingStatus", false);
              this.$emit("getList", 1);
            } else {
              let _this = this;
              setTimeout(() => {
                _this.getList(data, delay, maxRetries, currentRetry);
              }, delay);
            }
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
      this.$log("d1111", this.requestKey);
      this.requestKey = this.walletsOrder.out_trade_no;
      if (this.requestKey) {
        this.getList({ key: this.requestKey }, 10000);
      } else {
        this.$message({
          type: "warning",
          message: "订单号未返回!",
        });
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

// 媒体查询
// @media only screen and (max-width: 939px) {
// }
// @media only screen and (max-width: 768px) {
// }

.order-dialog {
  .el-dialog__header {
    text-align: center;
    font-size: 1.2rem;
    padding: 20px;
    background-color: #f8f8f8;
    border-bottom: 1px solid #ddd;
  }

  .el-dialog__body {
    padding: 20px;
    text-align: center;
  }

  .dialog-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .dialog-text {
    font-size: 1rem;
    margin: 10px 0;
    color: #555;
  }

  .paperProgress {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 30px 0;
  }

  .el-button {
    margin: 10px;
    padding: 10px 20px;
    font-size: 1rem;
  }
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
      padding: 15px;
    }

    .dialog-text {
      font-size: 0.9rem;
      margin: 10px 0;
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
.payCodeBox {
  display: flex;
  justify-content: space-between;
  min-height: 300px;
  width: 100%;
  padding-bottom: 30px;
}
.payLeftCode {
  max-width: 287px;
  // height: 230px;
  padding-top: 13px;
  // border: 1px solid #ccc;
  border-radius: 10px;
  position: relative;
  .codeIntro {
    text-align: center;
    width: 100%;
    margin-top: 5px;
  }
}
.payRightPrice {
  padding-left: 20px;
  flex: 1;
  .payTitle {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #000;
    margin: 8px 0;
    span {
      color: rgb(252, 106, 0);
      margin: 0 5px;
      font-size: 16px;
    }
  }
  .popupSpan {
    margin-top: 20px;
    color: #000;
    span {
      color: rgb(252, 106, 0);
    }
  }
  .fujia {
    display: flex;
    flex-wrap: wrap;
    .liFu {
      position: relative;
      width: auto;
      height: 40px;
      display: flex;
      align-items: center;
      border: 1px solid rgb(252, 117, 19);
      border-radius: 5px;
      padding: 5px;
      margin-top: 20px;
      color: #000;
      margin-right: 10px;
      .topIntro {
        position: absolute;
        top: -10px;
        height: 20px;
        right: 0;
        background: rgb(246, 153, 0);
        font-size: 10px;
        border-radius: 3px;
        color: #fff;
        line-height: 20px;
        padding: 0 5px;
      }
    }

    .liFuRight {
      margin-left: 20px;
      span:first-child {
        color: rgb(252, 106, 0);
      }
      span:last-child {
        margin-left: 5px;
        color: #999;
        text-decoration-line: line-through;
      }
    }
  }
}
.payCodeTitle {
  text-align: left;
  width: 100%;
  margin-bottom: 10px;
}
.tabsBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.downOut {
  padding: 10px;
}
.dTitle {
  font-size: 20px;
  color: #000;
  font-weight: bold;
  text-align: center;
  margin: 30px 0;
}
.dItem {
  margin-top: 10px;
  color: #303133;
  font-weight: bold;
  span {
    color: #606266;
    font-weight: 100;
    margin-right: 7px;
  }
}
.titleHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 50px;
}
.dialogTitleP {
  font-size: 20px;
  font-weight: bold;
}
.titleRight {
  display: flex;
  align-items: center;
}
.code1V1 {
  position: absolute;
  bottom: -10px;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  div {
    width: 120px;
    height: 120px;
    margin-bottom: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  p {
    color: #303133;
  }
}
.payment-method {
  text-align: left;
  display: flex;
  align-items: center;
}

.alipay-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #108ee9;
  width: 100px;
  height: 30px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  color: white;
  font-family: Arial, sans-serif;
}

.alipay-button img {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.alipay-button span {
  display: inline-block;
  font-size: 16px;
  line-height: 24px;
}

.alipay-button .sub-text {
  font-size: 12px;
  line-height: 16px;
}
</style>

<style lang="scss" scoped>
.purchase-points {
  margin-bottom: 12px;
}

.points {
  color: green;
}

.points-box {
  border: 1px solid #eee;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 5px;
  width: 300px;
  background: #fbfbfb;
}

.points-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.points-info {
  display: flex;
  align-items: center;
}

.wallet-icon {
  color: green;
  margin-right: 8px;
}

.qr-code-container {
  text-align: left;
  margin-bottom: 20px;
  display: flex;
  margin-top: 20px;
  align-items: center;
  justify-content: flex-start;
}

.qr-code {
  width: 120px;
  height: 120px;
  background: #ccc;
  border-radius: 5px;
  margin-right: 10px;
  img {
    width: 100%;
    height: 100%;
  }
}
/* 按钮整体样式 */
.wechat-button {
  position: relative;
  margin-left: 10px;
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border: 1px solid #00c800;
  border-radius: 5px;
  background-color: #fff;
  font-size: 14px;
  color: #000;
  cursor: pointer;
  overflow: hidden;
  transition: box-shadow 0.3s;
}

/* 图标部分 */
.wechat-button .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.wechat-button .icon img {
  width: 100%;
  height: 100%;
}

/* 文字部分 */
.wechat-button .text {
  line-height: 20px;
  font-size: 14px;
  color: #000;
}

/* 右下角三角形区域 */
.wechat-button .corner {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  overflow: hidden;
}

.wechat-button .corner::before {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 30px 30px 0 0;
  border-color: #00c800 transparent transparent transparent;
}

/* 对勾样式 */
.wechat-button .corner-check {
  position: absolute;
  right: 6px;
  bottom: 6px;
  width: 8px;
  height: 12px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

::v-deep .el-tabs--border-card > .el-tabs__content {
  padding: 0;
}
</style>
