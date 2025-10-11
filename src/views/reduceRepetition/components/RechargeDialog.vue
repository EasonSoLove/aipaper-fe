<template>
  <div>
    <!-- 充值弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :width="showQRCode ? '600px' : '500px'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="recharge-dialog"
      :show-close="false"
      @close="handleClose"
    >
      <div class="recharge-dialog-content">
        <!-- 标题 -->
        <div class="recharge-header">
          <h3 class="recharge-title">充值金额</h3>
          <button class="close-btn" @click="handleClose">
            <i class="el-icon-close"></i>
          </button>
        </div>

        <!-- 输入阶段 -->
        <div v-if="!showQRCode" class="recharge-input-stage">
          <!-- 提示信息 -->
          <div class="recharge-notice">
            <p class="notice-text">支持支付宝扫码支付, 即时到账</p>
            <p class="warning-text">
              请在电脑浏览器打开付款, 不要在微信浏览器打开
            </p>
          </div>

          <!-- 充值金额输入 -->
          <div class="recharge-input-section">
            <label class="input-label">充值金额</label>
            <el-input
              v-model="rechargeAmount"
              type="number"
              placeholder="请输入充值金额"
              class="amount-input"
              @input="handleAmountInput"
            />
          </div>

          <!-- 底部按钮 -->
          <div class="recharge-footer">
            <el-button
              type="primary"
              class="recharge-btn"
              :disabled="!isValidAmount || rechargeLoading"
              :loading="rechargeLoading"
              @click="handleRecharge"
            >
              {{ rechargeLoading ? "处理中..." : "立即充值" }}
            </el-button>
          </div>
        </div>

        <!-- 二维码支付阶段 -->
        <div v-else class="recharge-qr-stage">
          <div class="payment-container">
            <div class="payCodeBox">
              <div class="payLeftCode">
                <p class="plTitle">支付信息</p>
                <div class="newLeftBox">
                  <div>
                    <el-tabs type="border-card">
                      <el-tab-pane>
                        <span slot="label">
                          <svg class="icon svg-icon" aria-hidden="true">
                            <use xlink:href="#icon-zhifubaozhifu"></use>
                          </svg>
                          支付宝支付
                        </span>
                        <div class="tabsBox">
                          <iframe
                            v-if="paymentLink"
                            :src="paymentLink"
                            height="205"
                            width="205"
                            frameborder="0"
                          ></iframe>
                          <p class="codeIntro">
                            支持使用
                            <b style="color: #00a1e9">"花呗"</b>
                            支付
                          </p>
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                  </div>

                  <!-- 价格展示 -->
                  <div class="newPriceBox">
                    <div class="newPriceBottom">
                      <span>充值金额:</span>
                      <span>¥{{ rechargeAmount }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="payRightInfo">
                <div class="reduceCard">
                  <p style="margin-bottom: 20px">充值说明:</p>
                  <p style="color: #606266; margin: 10px 0">
                    1. 请使用支付宝扫描上方二维码完成支付
                  </p>
                  <p style="color: #606266; margin: 10px 0">
                    2. 支付成功后余额将立即到账
                  </p>
                  <p style="color: #606266; margin: 10px 0">
                    3. 如有问题请联系客服
                  </p>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="qr-footer">
              <el-button @click="backToInput">重新输入金额</el-button>
              <el-button type="primary" @click="checkPaymentStatus"
                >检查支付状态</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { orderDetailById } from "@/api/user";

export default {
  name: "RechargeDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogVisible: false,
      rechargeAmount: "", // 充值金额
      rechargeLoading: false, // 充值加载状态
      showQRCode: false, // 是否显示二维码
      paymentLink: "", // 支付链接
      outTradeNo: "", // 订单号
      pollingInterval: 2000, // 轮询间隔时间，单位毫秒
      pollingTimer: null, // 轮询定时器
      maxRetries: 30, // 最大重试次数，30次 * 2秒 = 1分钟
      currentRetry: 0, // 当前重试次数
      consecutiveFailures: 0, // 连续失败次数
      maxConsecutiveFailures: 5, // 最大连续失败次数
    };
  },
  watch: {
    visible: {
      handler(newVal) {
        this.dialogVisible = newVal;
        if (newVal) {
          this.resetDialog();
        }
      },
      immediate: true,
    },
  },
  computed: {
    // 判断充值金额是否有效
    isValidAmount() {
      const amount = parseFloat(this.rechargeAmount);
      return amount > 0 && Number.isInteger(amount);
    },
  },
  beforeDestroy() {
    this.stopPolling();
  },
  methods: {
    // 重置弹窗状态
    resetDialog() {
      this.rechargeAmount = "";
      this.showQRCode = false;
      this.paymentLink = "";
      this.outTradeNo = "";
      this.rechargeLoading = false;
      this.currentRetry = 0;
      this.consecutiveFailures = 0;
      this.stopPolling();
    },

    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false;
      this.$emit("update:visible", false);
      this.resetDialog();
    },

    // 处理金额输入
    handleAmountInput(value) {
      // 只允许输入数字
      this.rechargeAmount = value.replace(/[^\d]/g, "");
    },

    // 处理充值
    async handleRecharge() {
      if (!this.isValidAmount) {
        this.$message.warning("请输入有效的充值金额（必须是正整数）");
        return;
      }

      this.rechargeLoading = true;

      try {
        // 调用充值接口
        const response = await this.callRechargeAPI(this.rechargeAmount);

        if (response.code === 200) {
          // 显示二维码支付界面
          this.paymentLink = response.result.pay_link;
          this.outTradeNo = response.result.out_trade_no;
          this.showQRCode = true;
          this.$message.success("请扫描二维码完成支付");

          // 开始轮询支付状态
          this.startPolling();
        } else {
          this.$message.error(response.message || "充值失败");
        }
      } catch (error) {
        console.error("充值失败:", error);
        this.$message.error("充值失败，请稍后重试");
      } finally {
        this.rechargeLoading = false;
      }
    },

    // 调用充值接口
    async callRechargeAPI(amount) {
      // 根据文档，接口是 GET /api/ai-paper/aigc/recharge
      const { default: request } = await import("@/utils/request");
      const baseUrl = process.env.VUE_APP_BASE_API;

      const response = await request({
        url: baseUrl + "/api/ai-paper/aigc/recharge",
        method: "get",
        params: {
          recharge_amount: amount,
        },
      });
      return response;
    },

    // 开始轮询支付状态
    startPolling() {
      this.currentRetry = 0;
      this.consecutiveFailures = 0;
      this.pollingTimer = setInterval(() => {
        this.checkPaymentStatus();
      }, this.pollingInterval);
    },

    // 停止轮询
    stopPolling() {
      if (this.pollingTimer) {
        clearInterval(this.pollingTimer);
        this.pollingTimer = null;
      }
    },

    // 检查支付状态
    async checkPaymentStatus() {
      if (!this.outTradeNo) {
        this.stopPolling();
        return;
      }

      if (this.currentRetry >= this.maxRetries) {
        this.$message.warning("支付超时，请重新发起支付");
        this.stopPolling();
        return;
      }

      // 检查连续失败次数
      if (this.consecutiveFailures >= this.maxConsecutiveFailures) {
        this.$message.warning("网络连接异常，请手动检查支付状态");
        this.stopPolling();
        return;
      }

      this.currentRetry++;

      try {
        // 调用订单详情接口检查支付状态
        const response = await orderDetailById({ key: this.outTradeNo });

        if (response.code === 200) {
          const orderData = response.result.order;

          // 重置连续失败次数
          this.consecutiveFailures = 0;

          if (orderData && orderData.payment_status) {
            console.log("当前支付状态:", orderData.payment_status);

            if (orderData.payment_status === "TRADE_SUCCESS") {
              // 支付成功
              this.stopPolling();
              this.$emit("recharge-success", {
                amount: this.rechargeAmount,
                outTradeNo: this.outTradeNo,
              });
              this.handleClose();
            } else if (orderData.payment_status === "TRADE_CLOSED") {
              // 支付关闭
              this.stopPolling();
              this.$message.warning("支付已关闭，请重新发起支付");
              this.backToInput();
            } else {
              // 其他状态（如 WAIT_BUYER_PAY），继续轮询
              console.log("等待支付中，继续轮询...");
            }
          } else {
            // 订单数据异常，增加连续失败次数
            this.consecutiveFailures++;
            console.error("订单数据异常:", orderData);
          }
        } else {
          // 接口返回错误，增加连续失败次数
          this.consecutiveFailures++;
          console.error("检查支付状态失败:", response.message);
        }
      } catch (error) {
        // 网络错误，增加连续失败次数
        this.consecutiveFailures++;
        console.error("检查支付状态失败:", error);
      }
    },

    // 返回输入金额界面
    backToInput() {
      this.showQRCode = false;
      this.paymentLink = "";
      this.stopPolling();
    },
  },
};
</script>

<style lang="scss" scoped>
// 充值弹窗样式
.recharge-dialog {
  .el-dialog__body {
    padding: 0;
  }
}

.recharge-dialog-content {
  .recharge-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px 16px;
    border-bottom: 1px solid #f0f0f0;
    margin-top: -40px;
    .recharge-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 16px;
      color: #9ca3af;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s;

      &:hover {
        background-color: #f3f4f6;
        color: #6b7280;
      }
    }
  }

  .recharge-notice {
    padding: 16px 24px;
    background-color: #f9fafb;

    .notice-text {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #6b7280;
    }

    .warning-text {
      margin: 0;
      font-size: 14px;
      color: #dc2626;
      font-weight: 500;
    }
  }

  .recharge-input-section {
    padding: 24px;

    .input-label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: #374151;
      font-weight: 500;
    }

    .amount-input {
      width: 100%;

      .el-input__inner {
        height: 48px;
        font-size: 16px;
        border-radius: 8px;
        border: 1px solid #d1d5db;
        transition: all 0.2s;

        &:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      }
    }
  }

  .recharge-footer {
    padding: 0 24px 24px;
    text-align: center;

    .recharge-btn {
      width: 100%;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 8px;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border: none;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      }

      &:disabled {
        background: #e5e7eb;
        color: #9ca3af;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
    }
  }
}

// 二维码支付阶段样式
.recharge-qr-stage {
  .payment-container {
    min-height: 400px;
  }

  .payCodeBox {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }

  .payLeftCode {
    width: 307px;
    padding: 20px 30px;
    margin-top: -20px;
    background: #f4f5f7;
    position: relative;

    .plTitle {
      font-family: PingFangSC-SNaNpxibold;
      font-weight: 600;
      font-size: 18px;
      color: #000000;
      margin-bottom: 16px;
    }

    .newLeftBox {
      .tabsBox {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;

        iframe {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .codeIntro {
          text-align: center;
          width: 100%;
          margin-top: 8px;
          font-size: 14px;
          color: #606266;
        }
      }

      .newPriceBox {
        .newPriceBottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #fff;
          border: 1px solid #e4e7ed;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;

          span:first-child {
            color: #606266;
          }

          span:last-child {
            color: #f53f3f;
            font-size: 18px;
          }
        }
      }
    }
  }

  .payRightInfo {
    margin-left: 20px;
    padding-top: 20px;

    .reduceCard {
      font-family: PingFangSC-SNaNpxibold;
      font-weight: 600;
      font-size: 18px;
      color: #000000;

      p {
        line-height: 1.6;
        margin: 8px 0;
      }
    }
  }

  .qr-footer {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 24px;
    padding: 0 24px 24px;

    .el-button {
      min-width: 120px;
    }
  }
}

// 支付宝图标样式
::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  background: #409eff !important;
  color: #fff !important;
}

// 响应式设计
@media (max-width: 768px) {
  .recharge-qr-stage {
    .payCodeBox {
      flex-direction: column;
      align-items: center;
    }

    .payLeftCode {
      width: 100%;
      margin-top: 0;
    }

    .payRightInfo {
      margin-left: 0;
      margin-top: 20px;
    }
  }
}
</style>
