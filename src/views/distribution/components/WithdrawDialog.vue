<template>
  <div
    v-if="visible"
    class="withdraw-dialog-overlay"
    @click="handleOverlayClick"
  >
    <div class="withdraw-dialog" @click.stop>
      <!-- 头部 -->
      <div class="dialog-header">
        <h3 class="dialog-title">提交提现申请</h3>
        <button class="close-btn" @click="handleClose">
          <i class="el-icon-close"></i>
        </button>
      </div>

      <!-- 可提现金额区域 -->
      <div class="balance-section">
        <div class="balance-label">可提现</div>
        <div class="balance-amount">¥{{ formatAmount(balance) }}</div>
      </div>

      <!-- 提现金额输入区域 -->
      <div class="amount-input-section">
        <label class="input-label">提现金额*</label>
        <div class="amount-input-container">
          <button
            class="amount-btn decrease-btn"
            @click="decreaseAmount"
            :disabled="amount <= 0.01"
          >
            -
          </button>
          <input
            type="number"
            v-model="inputAmount"
            class="amount-input"
            :min="0.01"
            :max="balance"
            step="0.01"
            @input="handleAmountInput"
          />
          <button
            class="amount-btn increase-btn"
            @click="increaseAmount"
            :disabled="amount >= balance"
          >
            +
          </button>
        </div>
      </div>

      <!-- 预估到账金额 -->
      <div class="estimated-section">
        <div class="estimated-label">实际到账金额 (预估)</div>
        <div class="estimated-amount">¥{{ formatAmount(expectedAmount) }}</div>
      </div>

      <!-- 手续费说明 -->
      <div class="fee-notice">手续费和个税暂按预估扣除约6.5%</div>

      <!-- 底部按钮 -->
      <div class="dialog-footer">
        <button class="cancel-btn" @click="handleClose">取消</button>
        <button
          class="submit-btn"
          :class="{ loading: submitting }"
          :disabled="submitting || amount < 0.01 || amount > balance"
          @click="handleSubmit"
        >
          <span v-if="submitting" class="loading-spinner"></span>
          {{ submitting ? "提交中..." : "提交申请" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WithdrawDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      amount: 0.01,
      submitting: false,
    };
  },
  computed: {
    inputAmount: {
      get() {
        return this.amount;
      },
      set(value) {
        const numValue = parseFloat(value) || 0.01;
        this.amount = Math.max(
          0.01,
          Math.min(this.balance, parseFloat(numValue.toFixed(2)))
        );
      },
    },
    expectedAmount() {
      return parseFloat((this.amount * (1 - 0.065)).toFixed(2));
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.amount = Math.min(0.01, this.balance);
      }
    },
    balance(val) {
      if (val > 0) {
        this.amount = Math.min(0.01, val);
      }
    },
  },
  methods: {
    // 格式化金额
    formatAmount(amount) {
      return parseFloat(amount || 0).toFixed(2);
    },

    // 减少金额
    decreaseAmount() {
      if (this.amount > 0.01) {
        this.amount = Math.max(
          0.01,
          parseFloat((this.amount - 0.01).toFixed(2))
        );
      }
    },

    // 增加金额
    increaseAmount() {
      if (this.amount < this.balance) {
        this.amount = Math.min(
          this.balance,
          parseFloat((this.amount + 0.01).toFixed(2))
        );
      }
    },

    // 处理金额输入
    handleAmountInput(event) {
      const value = parseFloat(event.target.value) || 0;
      this.amount = Math.max(
        0.01,
        Math.min(this.balance, parseFloat(value.toFixed(2)))
      );
    },

    // 处理遮罩点击
    handleOverlayClick() {
      this.handleClose();
    },

    // 关闭弹窗
    handleClose() {
      this.$emit("update:visible", false);
    },

    // 提交申请
    async handleSubmit() {
      if (this.submitting) return;

      if (this.amount < 0.01) {
        this.$message.warning("提现金额小于最小提现金额");
        return;
      }
      if (this.amount > this.balance) {
        this.$message.error("提现金额超出可提现金额");
        return;
      }

      this.submitting = true;

      try {
        const { postDistributionWithdrawn } = await import(
          "@/api/distribution"
        );
        const res = await postDistributionWithdrawn({
          withdrawn_amount: String(this.amount),
        });

        if (res && res.code === 200) {
          this.$message.success("提现申请已成功发起！");
          this.$emit("success");
          this.handleClose();
        } else {
          this.$message.error((res && res.message) || "提现申请失败");
        }
      } catch (err) {
        this.$message.error((err && err.message) || "提现申请失败");
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.withdraw-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

.withdraw-dialog {
  background: #fff;
  border-radius: 16px;
  width: 400px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// 头部样式
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0;
  margin-bottom: 20px;
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
    color: #666;
  }
}

// 可提现金额区域
.balance-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0 24px 24px;
  padding: 20px;
  border-radius: 12px;
  color: white;
  text-align: center;
}

.balance-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.balance-amount {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
}

// 提现金额输入区域
.amount-input-section {
  padding: 0 24px 20px;
}

.input-label {
  display: block;
  font-size: 16px;
  margin-top: 10px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 600;
}

.amount-input-container {
  display: flex;
  align-items: center;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: #667eea;
  }
}

.amount-btn {
  background: #f8f9fa;
  border: none;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #e9ecef;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.decrease-btn {
  color: #666;
}

.increase-btn {
  color: #667eea;
}

.amount-input {
  flex: 1;
  border: none;
  padding: 0 16px;
  height: 40px;
  font-size: 16px;
  text-align: center;
  outline: none;
  background: transparent;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
}

// 预估到账金额
.estimated-section {
  background: #e3f2fd;
  margin: 0 24px 16px;
  padding: 20px;
  border-radius: 8px;
  text-align: left;
}

.estimated-label {
  font-size: 14px;
  color: #1976d2;
  margin-bottom: 6px;
  font-weight: 600;
}

.estimated-amount {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

// 手续费说明
.fee-notice {
  background: #fff3cd;
  color: #856404;
  font-size: 12px;
  font-weight: bold;

  text-align: left;
  padding: 12px 16px;
  margin: 0 24px 24px;
  border-radius: 6px;
  border: 1px solid #ffeaa7;
}

// 底部按钮
.dialog-footer {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px;
}

.cancel-btn {
  flex: 1;
  height: 48px;
  border: 2px solid #e1e5e9;
  background: #fff;
  color: #666;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ccc;
    background: #f8f9fa;
  }
}

.submit-btn {
  flex: 1;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &.loading {
    cursor: not-allowed;
  }
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// 响应式设计
@media (max-width: 480px) {
  .withdraw-dialog {
    width: 95vw;
    margin: 20px;
  }

  .dialog-header,
  .amount-input-section,
  .estimated-section,
  .fee-notice,
  .dialog-footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .balance-section {
    margin-left: 16px;
    margin-right: 16px;
  }
}
</style>
