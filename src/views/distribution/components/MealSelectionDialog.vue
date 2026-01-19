<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="万象升级套餐介绍"
    width="950px"
    :show-close="true"
    :close-on-click-modal="true"
    :close-on-press-escape="false"
    :lock-scroll="false"
    :append-to-body="true"
  >
    <div class="meal-selection-container">
      <div class="meal-cards">
        <!-- 高级代理 -->
        <div class="meal-card meal-card-green">
          <div class="meal-header">
            <img
              src="@/assets/images/distribution/meal1.png"
              alt="高级代理"
              class="meal-bg"
            />
            <div class="meal-title-section">
              <div class="meal-subtitle">专业代理服务</div>
              <div class="meal-title">高级代理</div>
            </div>
            <div class="discount-tag">推荐</div>
            <div class="meal-icon">🚀</div>
          </div>

          <div class="meal-content">
            <div class="service-list">
              <div class="service-item">
                <span class="service-name">直接推广佣金</span>
                <span class="service-count">30%</span>
              </div>
              <div class="service-item">
                <span class="service-name">间接推广佣金</span>
                <span class="service-count">10%</span>
              </div>
              <div class="service-item">
                <span class="service-name">下级用户开通代理分成</span>
                <span class="service-count">50%</span>
              </div>
              <div class="service-item">
                <!-- <img
                  src="@/assets/images/distribution/present1.png"
                  alt="赠品"
                  class="gift-icon"
                /> -->
                <p style="text-align: center; width: 100%; margin-top: 10px">
                  邀请新用户注册可获得
                </p>
                <!-- <span class="service-count">奖励</span> -->
              </div>
              <div class="service-item gift-item">
                <img
                  src="@/assets/images/distribution/present1.png"
                  alt="赠品"
                  class="gift-icon"
                />
                <span class="service-name">AIGC次数及优惠券</span>
                <span class="service-count">奖励</span>
              </div>
              <div class="service-item gift-item">
                <img
                  src="@/assets/images/distribution/present1.png"
                  alt="赠品"
                  class="gift-icon"
                />
                <span class="service-name">流量获取及运营教学服务</span>
                <span class="service-count">提供</span>
              </div>
            </div>

            <div class="price-section" style="margin-top: -50px">
              <div class="current-price">专业代理权益</div>
              <div class="original-price">升级即可享受</div>
            </div>
            <div
              class="price-section"
              style="
                display: flex;
                align-items: flex-end;
                justify-content: center;
              "
            >
              <div class="current-price">99元</div>
              <div
                class="original-price"
                style="
                  margin-left: 10px;
                  text-decoration: line-through;
                  position: relative;
                  top: -5px;
                "
              >
                原价:199元
              </div>
            </div>

            <div class="action-buttons">
              <button class="btn-purchase" @click="handlePurchase(1)">
                点击升级
              </button>
            </div>
          </div>
        </div>

        <!-- 城市合伙人 -->
        <div class="meal-card meal-card-orange">
          <div class="meal-header">
            <img
              src="@/assets/images/distribution/meal2.png"
              alt="城市合伙人"
              class="meal-bg"
            />
            <div class="meal-title-section">
              <div class="meal-subtitle">顶级合作伙伴</div>
              <div class="meal-title">城市合伙人</div>
            </div>
            <div class="discount-tag">VIP</div>
            <div class="meal-icon">👑</div>
          </div>

          <div class="meal-content">
            <div class="service-list">
              <div class="service-item">
                <span class="service-name">站内成交额佣金</span>
                <span class="service-count">80%</span>
              </div>
              <div class="service-item">
                <span class="service-name">无限制免费开通代理资格</span>
                <span class="service-count">✓</span>
              </div>
              <div class="service-item">
                <span class="service-name">站内用户开通代理分成</span>
                <span class="service-count">100%</span>
              </div>
              <div class="service-item">
                <span class="service-name">自由配置代理佣金</span>
                <span class="service-count">✓</span>
              </div>
              <div class="service-item">
                <span class="service-name">站内名称、图标、界面可自由配置</span>
                <span class="service-count">✓</span>
              </div>
              <div class="service-item gift-item">
                <img
                  src="@/assets/images/distribution/present2.png"
                  alt="赠品"
                  class="gift-icon"
                />
                <span class="service-name">提供N对1技术扶持</span>
                <span class="service-count">专属</span>
              </div>
              <div class="service-item gift-item">
                <img
                  src="@/assets/images/distribution/present2.png"
                  alt="赠品"
                  class="gift-icon"
                />
                <span class="service-name">提供N对1流量扶持</span>
                <span class="service-count">专属</span>
              </div>
              <div class="service-item gift-item">
                <img
                  src="@/assets/images/distribution/present2.png"
                  alt="赠品"
                  class="gift-icon"
                />
                <span class="service-name">提供N对1运营扶持</span>
                <span class="service-count">专属</span>
              </div>
              <div class="service-item gift-item">
                <img
                  src="@/assets/images/distribution/present2.png"
                  alt="赠品"
                  class="gift-icon"
                />
                <span class="service-name">提供N对1资源扶持</span>
                <span class="service-count">专属</span>
              </div>
            </div>

            <div class="price-section">
              <div class="current-price">全方位扶持服务</div>
              <div class="original-price">顶级合作伙伴</div>
            </div>

            <div class="action-buttons">
              <el-popover placement="top" width="150" trigger="hover">
                <div class="qywxBox">
                  <img src="@/assets/images/index/kefu_right.jpg" alt="" />
                </div>
                <p>扫描二维码，<br />联系客服</p>
                <button
                  class="btn-contact"
                  slot="reference"
                  style="width: 225px"
                  @click="handleContact"
                >
                  联系客服
                </button>
              </el-popover>
            </div>
          </div>
        </div>

        <!-- 普通用户 -->
        <div class="meal-card meal-card-blue">
          <div class="meal-header">
            <img
              src="@/assets/images/distribution/meal3.png"
              alt="普通用户"
              class="meal-bg"
            />
            <div class="meal-title-section">
              <div class="meal-subtitle">基础用户权益</div>
              <div class="meal-title">普通用户</div>
            </div>
            <div class="discount-tag">基础</div>
            <div class="meal-icon">👤</div>
          </div>

          <div class="meal-content">
            <div class="service-list">
              <div class="service-item">
                <span class="service-name">直接推广佣金</span>
                <span class="service-count">20%</span>
              </div>
              <div class="service-item gift-item">
                <img
                  src="@/assets/images/distribution/present3.png"
                  alt="赠品"
                  class="gift-icon"
                />
                <span class="service-name">邀请新用户注册可获得</span>
                <span class="service-count">奖励</span>
              </div>
              <div class="service-item gift-item">
                <img
                  src="@/assets/images/distribution/present3.png"
                  alt="赠品"
                  class="gift-icon"
                />
                <span class="service-name">AIGC次数及优惠券</span>
                <span class="service-count">免费</span>
              </div>
            </div>

            <div class="price-section">
              <div class="current-price">基础推广权益</div>
              <div class="original-price">免费使用</div>
            </div>

            <div class="action-buttons">
              <!-- <button class="btn-current">当前状态</button> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "MealSelectionDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  computed: {
    ...mapGetters(["agent_image"]),
    contactService() {
      return this.agent_image.find((image) => image.id === 5);
    },
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("update:visible", val);
    },
  },
  methods: {
    async handlePurchase(mealType) {
      // 只有第一个套餐（高级代理）可以购买
      if (mealType === 1) {
        try {
          // 调用升级接口
          const { getDistributionUpgrade } = await import("@/api/distribution");
          const res = await getDistributionUpgrade();

          // 如果已经是高级分销商，显示提示信息，不关闭弹窗
          if (res && res.code === 10004) {
            this.$message.info(
              res.message || "您已经是高级分销商了，无需升级！"
            );
            return;
          }

          // 如果接口返回成功且有订单信息，直接处理升级流程
          if (
            res &&
            res.code === 200 &&
            res.result &&
            res.result.out_trade_no &&
            res.result.pay_amount
          ) {
            // 关闭弹窗
            this.dialogVisible = false;
            // 通知父组件处理升级订单
            this.$emit("purchase", {
              mealType,
              orderInfo: {
                out_trade_no: res.result.out_trade_no,
                original_amount: res.result.original_amount || 199,
                pay_amount: res.result.pay_amount || 99,
                pay_link: res.result.pay_link,
              },
            });
          } else {
            this.$message.error((res && res.message) || "获取升级订单失败");
          }
        } catch (error) {
          console.error("升级失败:", error);
          this.$message.error("升级失败，请稍后重试");
        }
      }
    },
    handleContact() {
      // 联系客服
      this.$message.info("请扫码添加客服微信, 了解套餐详情!");
      // 这里可以添加具体的联系客服逻辑
      // 比如打开客服窗口、跳转到客服页面等
    },
  },
};
</script>

<style lang="scss" scoped>
.meal-selection-container {
  padding: 30px 20px;
  padding-top: 0px;
}

.meal-cards {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.meal-card {
  width: 260px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.meal-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.meal-header {
  position: relative;
  height: 100px;
  overflow: hidden;
  border-radius: 16px 16px 0 0;
}

.meal-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.meal-title-section {
  position: absolute;
  top: 12px;
  left: 16px;
  color: #fff;
  z-index: 2;
}

.meal-subtitle {
  font-size: 11px;
  opacity: 0.9;
  margin-bottom: 2px;
  font-weight: normal;
}

.meal-title {
  font-size: 18px;
  font-weight: bold;
  line-height: 1.2;
}

.discount-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ffd700;
  color: #333;
  padding: 3px 6px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: bold;
  z-index: 2;
}

.meal-icon {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 20px;
  opacity: 0.2;
  z-index: 2;
}

.meal-content {
  padding: 18px;
}

.service-list {
  margin-bottom: 18px;
  height: 250px;
  overflow-y: auto;
}

.service-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.gift-item {
  color: #4caf50;
  font-weight: 500;
}

.gift-icon {
  width: 14px;
  height: 14px;
  margin-right: 6px;
}

.service-name {
  font-size: 13px;
  color: #333;
}

.gift-item .service-name {
  color: #4caf50;
}

.service-count {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.price-section {
  text-align: center;
  margin-bottom: 18px;
}

.current-price {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.original-price {
  font-size: 13px;
  color: #999;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn-request,
.btn-purchase,
.btn-contact,
.btn-current {
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-request {
  background: #f0f0f0;
  color: #666;
}

.btn-request:hover {
  background: #e0e0e0;
}

.btn-purchase {
  background: #4caf50;
  color: #fff;
}

.btn-purchase:hover {
  background: #45a049;
}

.btn-purchase.disabled {
  background: #ccc;
  color: #999;
  cursor: not-allowed;
}

.btn-purchase.disabled:hover {
  background: #ccc;
}

.btn-contact {
  background: #ff9800;
  color: #fff;
}

.btn-contact:hover {
  background: #f57c00;
}

.btn-current {
  background: #e0e0e0;
  color: #666;
  cursor: default;
}

.btn-current:hover {
  background: #e0e0e0;
}

// 不同套餐的颜色主题
.meal-card-green {
  .btn-purchase {
    background: #4caf50;
  }
  .btn-purchase:hover {
    background: #45a049;
  }
}

.meal-card-orange {
  .btn-contact {
    background: #ff9800;
  }
  .btn-contact:hover {
    background: #f57c00;
  }
}

.meal-card-blue {
  .btn-current {
    background: #e0e0e0;
    color: #666;
  }
  .btn-current:hover {
    background: #e0e0e0;
  }
}

// 响应式设计
@media (max-width: 900px) {
  .meal-selection-container {
    padding: 20px 10px;
  }

  .meal-cards {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .meal-card {
    width: 100%;
    max-width: 320px;
  }
}

@media (max-width: 600px) {
  .meal-selection-container {
    padding: 15px 5px;
  }

  .meal-card {
    width: 100%;
    max-width: 280px;
  }

  .meal-title {
    font-size: 16px;
  }

  .current-price {
    font-size: 20px;
  }

  .meal-content {
    padding: 15px;
  }
}

// 客服二维码样式
.qywxBox {
  width: 120px;
  height: 120px;
  margin: 0 auto;

  img {
    width: 100%;
    height: 100%;
  }

  & + p {
    text-align: center;
    margin-top: 8px;
    font-size: 12px;
    color: #666;
    line-height: 1.4;
  }
}
</style>

<style lang="scss">
// 全局样式，用于覆盖 el-dialog 的默认样式
.meal-selection-dialog {
  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
  }

  .el-dialog__footer {
    display: none;
  }
}
</style>
