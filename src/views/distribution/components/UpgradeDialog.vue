<template>
  <el-dialog :visible.sync="visible" title="升级为分享商" width="720px">
    <div class="payCodeBox" v-loading="loading">
      <div class="payRightPrice">
        <!-- 高级代理权益介绍 -->
        <div class="agent-benefits" style="margin-top: -40px">
          <div class="agent-header">
            <img
              src="@/assets/images/distribution/meal1.png"
              alt="高级代理背景"
              class="agent-bg-image"
            />
            <div class="agent-title-section">
              <div class="agent-subtitle">专业代理服务</div>
              <div class="agent-title">高级代理</div>
            </div>
            <div class="agent-discount-tag">推荐</div>
            <div class="agent-icon">🚀</div>
          </div>

          <div class="agent-content">
            <!-- 原有价格信息 -->
            <div class="agent-price-section">
              <div class="agent-price-title">解锁更高分成</div>
              <div class="agent-price-details">
                <div class="agent-price-item">
                  <span class="agent-price-label">解锁金额</span>
                  <span class="agent-price-value"
                    >¥{{ order.pay_amount || 99 }}</span
                  >
                </div>
                <div class="agent-price-item">
                  <span class="agent-price-label">原价</span>
                  <span class="agent-price-original"
                    >¥{{ order.original_amount || 199 }}</span
                  >
                </div>
              </div>
            </div>

            <!-- 原有说明文案 -->
            <div class="agent-description">
              支持分销商付费升级，以解锁间推奖励。完成支付后系统将自动为您生效更高分成。
            </div>

            <!-- 权益列表 -->
            <div class="agent-service-list">
              <div class="agent-service-item">
                <span class="agent-service-name">直接推广佣金</span>
                <span class="agent-service-count">30%</span>
              </div>
              <div class="agent-service-item">
                <span class="agent-service-name">间接推广佣金</span>
                <span class="agent-service-count">10%</span>
              </div>
              <div class="agent-service-item">
                <span class="agent-service-name">下级用户开通代理分成</span>
                <span class="agent-service-count">50%</span>
              </div>
              <div class="agent-service-item agent-gift-item">
                <img
                  src="@/assets/images/distribution/present1.png"
                  alt="赠品"
                  class="agent-gift-icon"
                />
                <span class="agent-service-name">邀请新用户注册可获得</span>
                <span class="agent-service-count">奖励</span>
              </div>
              <div class="agent-service-item agent-gift-item">
                <img
                  src="@/assets/images/distribution/present1.png"
                  alt="赠品"
                  class="agent-gift-icon"
                />
                <span class="agent-service-name">AIGC次数及优惠券</span>
                <span class="agent-service-count">免费</span>
              </div>
              <div class="agent-service-item agent-gift-item">
                <img
                  src="@/assets/images/distribution/present1.png"
                  alt="赠品"
                  class="agent-gift-icon"
                />
                <span class="agent-service-name">流量获取及运营教学服务</span>
                <span class="agent-service-count">提供</span>
              </div>
            </div>
          </div>
        </div>
      </div>
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
                    v-if="polling"
                    :src="order.pay_link"
                    height="205"
                    width="205"
                    frameborder="0"
                  ></iframe>
                  <p class="codeIntro">
                    支持使用 <b style="color: #00a1e9">“花呗”</b> 支付
                  </p>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="newPriceBox">
            <p>
              <span>原价:</span
              ><span>¥ {{ order.original_amount || 199 }}</span>
            </p>
            <div class="newPriceBottom">
              <span>支付金额:</span><span>¥{{ order.pay_amount || 99 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { orderDetailById } from "@/api/user";

export default {
  name: "UpgradeDialog",
  props: {
    visible: { type: Boolean, default: false },
    upgradeOrder: {
      type: Object,
      default: () => ({
        out_trade_no: "",
        original_amount: 199,
        pay_amount: 99,
        pay_link: "",
      }),
    },
  },
  data() {
    return {
      loading: false,
      polling: false,
      intervalMs: 2000,
    };
  },
  computed: {
    order() {
      return this.upgradeOrder;
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.initUpgrade();
      } else {
        this.polling = false;
      }
    },
  },
  methods: {
    async initUpgrade() {
      // 直接使用父组件传递的订单信息，避免重复API调用
      if (this.order && this.order.out_trade_no && this.order.pay_link) {
        this.polling = true;
        this.pollOnce();
      }
    },
    pollOnce() {
      if (!this.polling || !this.order.out_trade_no) return;
      orderDetailById({ key: this.order.out_trade_no })
        .then((res) => {
          if (!this.polling) return;
          const order = res && res.result && res.result.order;
          if (order && order.payment_status === "TRADE_SUCCESS") {
            this.polling = false;
            this.$message.success("升级成功！");
            this.$emit("success");
            this.$emit("update:visible", false);
          } else {
            setTimeout(() => this.pollOnce(), this.intervalMs);
          }
        })
        .catch(() => {
          if (!this.polling) return;
          setTimeout(() => this.pollOnce(), this.intervalMs);
        });
    },
  },
};
</script>

<style scoped lang="scss">
/* 复用父组件已有的支付样式命名，避免重复编写 */
.payCodeBox {
  display: flex;
  align-items: flex-start;
}

.payRightPrice {
  flex: 1;
  padding: 20px;
}
.payLeftCode {
  width: 307px;
  padding: 20px 30px;
  margin-top: -20px;
  background: #f4f5f7;
  position: relative;
  .codeIntro {
    text-align: center;
    width: 100%;
    margin-top: 5px;
  }
  .plTitle {
    font-family: PingFangSC-SNaNpxibold;
    font-weight: 600;
    font-size: 18px;
    color: #000000;
  }
}
.newLeftBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}
.tabsBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.newPriceBox {
  width: 240px;
  background: #ffffff;
  border-radius: 8px;
  padding: 0 8px;
  p {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: 14px;
    color: #959da6;
    line-height: 18px;
    margin-top: 10px;
    & > span:first-child {
      display: inline-block;
      width: 90px;
      text-align: left;
    }
  }
  .newPriceBottom {
    height: 44px;
    line-height: 44px;
    font-weight: 600;
    font-size: 14px;
    color: #000000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > span:last-child {
      color: #f53f3f;
      font-size: 16px;
    }
  }
}

/* 高级代理权益介绍样式 */
.agent-benefits {
  margin-top: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.agent-header {
  position: relative;
  height: 90px;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
}

.agent-bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.agent-header::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 2;
}

.agent-title-section {
  color: #fff;
  z-index: 3;
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  float: left;
}

.agent-subtitle {
  font-size: 12px;
  opacity: 0.85;
  margin-bottom: 4px;
  font-weight: 400;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.agent-title {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
}

.agent-discount-tag {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #333;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  z-index: 3;
  position: absolute;
  right: 60px;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.agent-icon {
  font-size: 24px;
  opacity: 0.4;
  z-index: 3;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.agent-content {
  padding: 16px;
}

/* 价格信息样式 */
.agent-price-section {
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.agent-price-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
}

.agent-price-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.agent-price-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.agent-price-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.agent-price-value {
  font-size: 16px;
  font-weight: bold;
  color: #4caf50;
}

.agent-price-original {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

/* 说明文案样式 */
.agent-description {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16px;
  padding: 8px 12px;
  background: #f0f8ff;
  border-radius: 6px;
  border-left: 3px solid #4caf50;
}

.agent-service-list {
  margin-bottom: 0;
}

.agent-service-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.agent-gift-item {
  color: #4caf50;
  font-weight: 500;
}

.agent-gift-icon {
  width: 12px;
  height: 12px;
  margin-right: 6px;
}

.agent-service-name {
  font-size: 12px;
  color: #333;
}

.agent-gift-item .agent-service-name {
  color: #4caf50;
}

.agent-service-count {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}
</style>
