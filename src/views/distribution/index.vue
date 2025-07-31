<template>
  <div class="distribution-page">
    <!-- Banner区 -->
    <div class="banner">
      <img
        src="@/assets/images/distribution/banner.png"
        alt="邀请有礼Banner"
        @click="scrollToInvite"
      />
    </div>

    <!-- 横向文字播报 -->
    <div class="marquee">
      <span class="marquee-content">
        恭喜用户A成功邀请3位好友获得奖励！ |
        邀请好友最高可得30%现金分成，快来参与吧！ |
        MixPaper助力高效写作，邀请越多奖励越多！
      </span>
    </div>

    <!-- 主体内容 -->
    <div class="container">
      <!-- 活动奖励板块 -->
      <div class="reward-section-new">
        <div class="section-title">活动奖励</div>

        <!-- 现金奖励卡片 -->
        <div class="reward-card">
          <div class="reward-card-left">
            <div class="reward-card-title">
              <span class="reward-card-title-main">现金奖励</span>
            </div>
            <div class="reward-card-highlight">
              您至高获得实付金额
              <span class="highlight-amount">30%现金分成</span>
            </div>
            <div class="reward-card-link">
              <a href="#" class="reward-card-detail" @click="showRewardDetail"
                >现金奖励细则 →</a
              >
            </div>
          </div>
          <div class="reward-card-right">
            <div class="reward-card-img-box">
              <img
                src="@/assets/images/distribution/reward.png"
                alt="奖励插画"
                class="reward-card-img"
              />
              <div class="reward-card-badge">50%</div>
            </div>
          </div>
        </div>

        <!-- 虚拟物品奖励卡片 -->
        <div class="reward-card">
          <div class="reward-card-left">
            <div class="reward-card-title">
              <span class="reward-card-title-main">虚拟物品奖励</span>
            </div>
            <div class="virtual-reward-list-row">
              <div class="virtual-reward-mini-card">
                <div class="mini-card-header">
                  <div class="mini-card-logo" style="background: #2563eb">
                    🟦
                  </div>
                  <div class="mini-card-title">ProcessOn</div>
                  <div class="mini-card-tag">邀请后，双方都可获得</div>
                </div>
                <div class="mini-card-desc">正文 8折优惠码</div>
                <div class="mini-card-detail">一笔成文，最高可省约XX元</div>
                <div class="mini-card-vip">VIP</div>
              </div>
              <div class="virtual-reward-mini-card">
                <div class="mini-card-header">
                  <div class="mini-card-logo" style="background: #ff5e5e">
                    🟥
                  </div>
                  <div class="mini-card-title">降AIGC</div>
                  <div class="mini-card-tag">邀请后，双方都可获得</div>
                </div>
                <div class="mini-card-desc">降AIGC 100次</div>
                <div class="mini-card-detail">
                  降AIGC无忧，维普、知网、格子达通用
                </div>
                <div class="mini-card-vip">VIP</div>
              </div>
            </div>
          </div>
          <div class="reward-card-right"></div>
        </div>
      </div>

      <!-- 邀请好友板块 -->
      <div id="invite-section" class="section-card">
        <div class="section-title">邀请好友</div>
        <div class="invite-section">
          <div class="invite-content">
            <div class="invite-link-box">
              <span class="invite-link">{{
                baseInfo.inv_code_url || "https://mixpaper.cn/"
              }}</span>
              <button class="btn" @click="copyInviteLink">复制邀请链接</button>
              <button class="btn" @click="generatePoster">生成分享海报</button>
            </div>
          </div>
        </div>
        <div
          style="display: flex; justify-content: center; margin-bottom: 18px"
        >
          <div class="my-invite-tabs">
            <button class="my-invite-tab active">
              已邀请{{ baseInfo.inv_user_num || 0 }}人
            </button>
          </div>
        </div>
        <div class="my-invite-content">
          <ul class="my-invite-list">
            <li>暂无数据</li>
          </ul>
        </div>
      </div>

      <!-- 我的推广板块 -->
      <div class="section-card">
        <div class="section-title">我的推广</div>
        <div class="my-invite-stats">
          <div class="my-invite-stat-card">
            <div class="my-invite-stat-icon">💰</div>
            <div class="my-invite-stat-label">累计佣金</div>
            <div class="my-invite-stat-value">
              ￥{{ formatAmount(baseInfo.total_income) }}
            </div>
          </div>
          <div class="my-invite-stat-card">
            <div class="my-invite-stat-icon">🦍</div>
            <div class="my-invite-stat-label">直推分成比例</div>
            <div class="my-invite-stat-value">
              {{ (baseInfo.direct_rewards * 100).toFixed(0) }}%
            </div>
          </div>
          <div class="my-invite-stat-card">
            <div class="my-invite-stat-icon">🤝</div>
            <div class="my-invite-stat-label">间推分成比例</div>
            <div class="my-invite-stat-value">
              {{ (baseInfo.indirect_rewards * 100).toFixed(0) }}%
            </div>
          </div>
        </div>
        <div
          style="display: flex; justify-content: center; margin-bottom: 18px"
        >
          <div class="my-invite-tabs">
            <button
              v-for="tab in promotionTabs"
              :key="tab.id"
              :class="['my-invite-tab', { active: activeTab === tab.id }]"
              @click="switchTab(tab.id)"
            >
              {{ tab.text }}
            </button>
          </div>
        </div>
        <div
          v-if="activeTab === 'withdrawable'"
          class="my-invite-content active-content"
        >
          <ul class="my-invite-list">
            <li v-if="withdrawalRecords.length === 0">暂无数据</li>
            <li
              v-else
              v-for="record in withdrawalRecords"
              :key="record.trade_no"
            >
              {{ record.distribution_change_type }} - ￥{{
                formatAmount(record.change_amount)
              }}
              - {{ formatTime(record.created_time) }}
            </li>
          </ul>
        </div>
        <div
          v-else-if="activeTab === 'pending'"
          class="my-invite-content active-content"
        >
          <ul class="my-invite-list">
            <li v-if="waitingSettleRecords.length === 0">暂无数据</li>
            <li
              v-else
              v-for="record in waitingSettleRecords"
              :key="record.trade_no"
            >
              {{ record.distribution_change_type }} - ￥{{
                formatAmount(record.change_amount)
              }}
              - {{ formatTime(record.created_time) }}
            </li>
          </ul>
        </div>
        <div v-else class="my-invite-content">
          <ul class="my-invite-list">
            <li>暂无数据</li>
          </ul>
        </div>
      </div>

      <!-- 常见问题板块 -->
      <div class="section-card">
        <div class="section-title">常见问题</div>
        <div class="qa-section">
          <div class="qa-list">
            <ol>
              <li>
                活动时间如何计算？<br />
                本次活动时间为2024年1月1日至2024年12月31日。在此期间，邀请好友注册并完成首单，即可获得奖励。
              </li>
              <li>
                什么是邀请链接，生成海报有什么用？<br />
                邀请链接和海报均可用于邀请好友注册MixPaper，好友通过你的专属链接或海报注册并完成首单，你即可获得奖励。
              </li>
              <li>
                奖励如何发放？<br />
                奖励将在好友完成首单后7个工作日内发放至你的账户，请注意查收。
              </li>
              <li>
                邀请奖励有上限吗？<br />
                邀请奖励无上限，邀请越多奖励越多，快来邀请好友一起参与吧！
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <!-- 现金奖励细则弹窗 -->
    <el-drawer
      title="现金奖励细则"
      :visible.sync="rewardDetailVisible"
      direction="rtl"
      size="500px"
      :before-close="handleCloseRewardDetail"
    >
      <div class="reward-detail-content">
        <!-- 邀请返佣机制 -->
        <div class="detail-section">
          <div class="section-header">
            <div class="section-bar"></div>
            <h3 class="section-title">邀请返佣机制</h3>
          </div>
          <div class="section-content">
            <ul>
              <li>被邀请人必须通过专属链接或二维码注册，以便系统追踪。</li>
              <li>
                推荐新客户下单即可获得奖励，一次邀请终身享受订单佣金分红。
              </li>
              <li>所有产品均可享受现金佣金。</li>
              <li>
                佣金为被邀请人消费金额的<span class="highlight-red">10%</span>。
              </li>
            </ul>
          </div>
        </div>

        <!-- 提现规则 -->
        <div class="detail-section">
          <div class="section-header">
            <div class="section-bar"></div>
            <h3 class="section-title">提现规则</h3>
          </div>
          <div class="section-content">
            <ul>
              <li>
                仅付费用户（平台有消费记录，无消费金额限制）可使用提现功能。
              </li>
              <li>至少邀请5位付费用户方可申请提现。</li>
              <li>提现申请审核约需一个工作日。</li>
              <li>
                如上一笔提现申请仍在审核中，新提现申请将不予受理，请确保上一笔提现完成后再申请，保障资金安全，避免重复申请。
              </li>
              <li class="important-note">
                <span class="highlight-orange">重要提示：</span
                >系统目前仅支持支付宝提现，用户必须准确填写支付宝账号及对应真实姓名，因信息错误导致的提现失败本站概不负责。
              </li>
            </ul>
          </div>
        </div>

        <!-- 声明 -->
        <div class="detail-section">
          <div class="section-header">
            <div class="section-bar"></div>
            <h3 class="section-title">声明</h3>
          </div>
          <div class="section-content">
            <ul>
              <li>根据市场环境和运营策略，相关规则政策可能会进行调整。</li>
              <li>如有调整，将提前通过官方渠道通知。</li>
              <li>
                万象写作官方团队保留对相关规则政策的最终解释权，感谢您的理解与支持。
              </li>
            </ul>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- 海报生成弹窗 -->
    <PosterDialog
      :visible.sync="posterDialogVisible"
      :invite-url="baseInfo.inv_code_url || 'https://mixpaper.cn/'"
    />
  </div>
</template>
http://localhost:9528/dev-api/api/ai-paper/distribution/base_info
http://localhost:9528/dev-api/api/ai-paper/orders/order/list?page_num=1&page_size=5
<script>
import {
  getDistributionBaseInfo,
  getInvRecords,
  getWithdrawalRecords,
  getWaitingSettleRecords,
} from "@/api/distribution";
import PosterDialog from "./components/PosterDialog.vue";

export default {
  name: "Distribution",
  components: {
    PosterDialog,
  },
  data() {
    return {
      activeTab: "withdrawable",
      baseInfo: {
        distribution_name: "",
        inv_code_url: "",
        inv_user_num: 0,
        direct_rewards: 0,
        indirect_rewards: 0,
        balance: 0,
        frozen_amount: 0,
        withdrawn_amount: 0,
        total_income: 0,
        is_login: false,
      },
      promotionTabs: [
        { id: "withdrawable", text: "可提现 ￥0.00" },
        { id: "withdrawn", text: "已提现 ￥0.00" },
        { id: "pending", text: "待结算 ￥0.00" },
      ],
      invRecords: [],
      withdrawalRecords: [],
      waitingSettleRecords: [],
      loading: false,
      rewardDetailVisible: false,
      posterDialogVisible: false,
    };
  },
  created() {
    this.getBaseInfo();
  },
  methods: {
    // 获取基础信息
    async getBaseInfo() {
      try {
        this.loading = true;
        const res = await getDistributionBaseInfo();
        if (res.code === 200) {
          this.baseInfo = res.result;
          this.updateTabTexts();
        }
      } catch (error) {
        console.error("获取基础信息失败:", error);
        this.$message.error("获取数据失败");
      } finally {
        this.loading = false;
      }
    },

    // 更新 Tab 文本
    updateTabTexts() {
      this.promotionTabs = [
        {
          id: "withdrawable",
          text: `可提现 ￥${this.formatAmount(this.baseInfo.balance)}`,
        },
        {
          id: "withdrawn",
          text: `已提现 ￥${this.formatAmount(this.baseInfo.withdrawn_amount)}`,
        },
        {
          id: "pending",
          text: `待结算 ￥${this.formatAmount(this.baseInfo.frozen_amount)}`,
        },
      ];
    },

    // 切换 Tab
    async switchTab(tabId) {
      this.activeTab = tabId;

      // 根据 Tab 加载对应数据
      if (tabId === "withdrawable" && this.withdrawalRecords.length === 0) {
        await this.getWithdrawalRecords();
      } else if (
        tabId === "pending" &&
        this.waitingSettleRecords.length === 0
      ) {
        await this.getWaitingSettleRecords();
      }
    },

    // 获取邀请记录
    async getInvRecords() {
      try {
        const res = await getInvRecords({
          page_num: 1,
          page_size: 10,
        });
        if (res.code === 200) {
          this.invRecords = res.result.invited_record_list || [];
        }
      } catch (error) {
        console.error("获取邀请记录失败:", error);
      }
    },

    // 获取可提现记录
    async getWithdrawalRecords() {
      try {
        const res = await getWithdrawalRecords({
          page_num: 1,
          page_size: 10,
        });
        if (res.code === 200) {
          this.withdrawalRecords = res.result.settling_record_list || [];
        }
      } catch (error) {
        console.error("获取可提现记录失败:", error);
      }
    },

    // 获取待结算记录
    async getWaitingSettleRecords() {
      try {
        const res = await getWaitingSettleRecords({
          page_num: 1,
          page_size: 10,
        });
        if (res.code === 200) {
          this.waitingSettleRecords = res.result.settling_record_list || [];
        }
      } catch (error) {
        console.error("获取待结算记录失败:", error);
      }
    },

    // 复制邀请链接
    copyInviteLink() {
      const link =
        this.baseInfo.inv_code_url || "https://mixpaper.cn/invite/xxxxxx";
      navigator.clipboard
        .writeText(link)
        .then(() => {
          this.$message.success("邀请链接已复制到剪贴板");
        })
        .catch(() => {
          this.$message.error("复制失败，请手动复制");
        });
    },

    generatePoster() {
      this.posterDialogVisible = true;
      this.$nextTick(() => {
        this.generateQRCodes();
      });
    },

    // 格式化金额
    formatAmount(amount) {
      return parseFloat(amount || 0).toFixed(2);
    },

    // 格式化时间
    formatTime(timeStr) {
      if (!timeStr) return "";
      const date = new Date(timeStr);
      return date.toLocaleString("zh-CN");
    },

    // 显示现金奖励细则
    showRewardDetail() {
      this.rewardDetailVisible = true;
    },

    // 关闭现金奖励细则
    handleCloseRewardDetail(done) {
      this.rewardDetailVisible = false;
      done();
    },

    // 滚动到邀请好友模块
    scrollToInvite() {
      this.$scrollTo("#invite-section", 500, { offset: -100 });
    },
  },
};
</script>

<style lang="scss" scoped>
$title-color: #fff;

.distribution-page {
  margin: 0;
  font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
  background: linear-gradient(135deg, #b6c7f7 0%, #e3c6f7 100%);
  min-height: 100vh;
  padding-bottom: 32px;
}

/* Banner区 */
.banner {
  width: 100%;
  max-width: 900px;
  margin: 0px auto 0 auto;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(108, 99, 255, 0.08);
  padding-top: 20px;
  cursor: pointer;
}

.banner img {
  width: 100%;
  display: block;
}

/* 横向文字播报 */
.marquee {
  width: 100%;
  background: rgba(255, 255, 255, 0.7);
  color: $title-color;
  font-size: 16px;
  padding: 8px 0;
  overflow: hidden;
  margin-top: 16px;
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.04);
}

.marquee-content {
  display: inline-block;
  white-space: nowrap;
  animation: marquee 12s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* 主体内容容器 */
.container {
  max-width: 900px;
  margin: 32px auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(108, 99, 255, 0.08);
  padding: 32px 24px 24px 24px;
}

/* 区块标题 */
.section-title {
  display: inline-block;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(90deg, #a18fff 0%, #6c63ff 100%);
  border-radius: 18px 36px 18px 18px;
  padding: 10px 36px 10px 24px;
  margin-bottom: 18px;
  box-shadow: 0 4px 12px rgba(108, 99, 255, 0.2);
}

/* 奖励卡片 */
.reward-card {
  display: flex;
  align-items: stretch;
  background: linear-gradient(90deg, #fff 60%, #f3f3ff 100%);
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(108, 99, 255, 0.08);
  padding: 28px 32px 28px 32px;
  margin-bottom: 32px;
  position: relative;
}

.reward-card-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.reward-card-title {
  display: flex;
  align-items: baseline;
  gap: 18px;
  margin-bottom: 8px;
}

.reward-card-title-main {
  font-size: 22px;
  font-weight: bold;
  color: #000;
  border-bottom: 4px solid #6c63ff;
  padding-bottom: 2px;
}

.reward-card-highlight {
  background: linear-gradient(90deg, #ffe3e3 0%, #ffe9f7 100%);
  color: #ff5e5e;
  font-size: 18px;
  font-weight: bold;
  border-radius: 8px;
  padding: 8px 18px;
  margin-bottom: 6px;
  width: fit-content;
}

.highlight-amount {
  color: #ffc107;
  font-size: 20px;
  font-weight: bold;
}

.reward-card-link {
  margin-top: 2px;
}

.reward-card-detail {
  color: #8b7cf6;
  font-size: 14px;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.reward-card-detail:hover {
  color: #6c63ff;
}

.reward-card-right {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  position: relative;
}

.reward-card-img-box {
  position: relative;
  width: 140px;
  height: 110px;
}

.reward-card-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
  background: #f3f3ff;
}

.reward-card-badge {
  position: absolute;
  right: 10px;
  bottom: 10px;
  background: #ff5e5e;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(255, 94, 94, 0.18);
  border: 3px solid #fff;
}

/* 虚拟奖励卡片 */
.virtual-reward-list-row {
  display: flex;
  gap: 24px;
  margin-top: 12px;
}

.virtual-reward-mini-card {
  flex: 1;
  background: linear-gradient(135deg, #e3eaff 0%, #f8f8ff 100%);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.08);
  padding: 14px 14px 28px 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  min-width: 0;
}

.mini-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.mini-card-logo {
  font-size: 28px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #fff;
}

.mini-card-title {
  font-size: 16px;
  font-weight: bold;
  color: #6c63ff;
}

.mini-card-tag {
  background: #b6c7f7;
  color: #fff;
  font-size: 12px;
  border-radius: 8px;
  padding: 2px 10px;
  margin-left: 8px;
}

.mini-card-desc {
  font-size: 14px;
  color: #8b7cf6;
  margin-bottom: 2px;
}

.mini-card-detail {
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
}

.mini-card-vip {
  position: absolute;
  right: 14px;
  bottom: 8px;
  font-size: 30px;
  font-weight: bold;
  color: #e3eaff;
  opacity: 0.5;
  pointer-events: none;
  user-select: none;
}

/* 邀请好友区域 */
.invite-section {
  margin-bottom: 32px;
}

.invite-content {
  background: #f8f8ff;
  border-radius: 10px;
  padding: 18px 16px;
}

.invite-link-box {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.invite-link {
  background: #f3f3ff;
  border: 1px solid #d1d1ff;
  border-radius: 6px;
  padding: 6px 16px;
  font-size: 15px;
  color: #6c63ff;
  min-width: 220px;
}

.btn {
  background: linear-gradient(90deg, #6c63ff 0%, #b6c7f7 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 18px;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn:hover {
  background: linear-gradient(90deg, #b6c7f7 0%, #6c63ff 100%);
}

/* 我的推广区域 */
.my-invite-stats {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  margin: 18px 0 28px 0;
}

.my-invite-stat-card {
  flex: 1;
  background: linear-gradient(135deg, #edeaff 0%, #f8f8ff 100%);
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.06);
  padding: 18px 0 14px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.my-invite-stat-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.my-invite-stat-label {
  font-size: 15px;
  color: #000;
  margin-bottom: 4px;
}

.my-invite-stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #000;
}

.my-invite-tabs {
  background: #edeaff;
  border-radius: 12px;
  padding: 4px;
  width: fit-content;
}

.my-invite-tab {
  border: none;
  outline: none;
  background: none;
  font-size: 16px;
  font-weight: 500;
  color: $title-color;
  padding: 8px 32px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  margin: 0 auto;
}

.my-invite-tab.active {
  background: linear-gradient(90deg, #6c63ff 0%, #b6c7f7 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.1);
}

.my-invite-tab:not(.active):hover {
  background: #f3f3ff;
}

.my-invite-content {
  background: #f8f8ff;
  border-radius: 10px;
  padding: 18px 16px;
}

.my-invite-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: center;
  color: #888;
  font-size: 16px;
}

/* 常见问题区域 */
.qa-section {
  margin-top: 32px;
  background: #f8f8ff;
  border-radius: 10px;
  padding: 24px 18px;
}

.qa-list {
  color: #444;
  font-size: 15px;
  line-height: 1.8;
}

.qa-list ol {
  padding-left: 20px;
}

.qa-list li {
  margin-bottom: 16px;
}

/* 区块卡片 */
.section-card {
  max-width: 900px;
  margin: 32px auto 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(108, 99, 255, 0.08);
  padding: 32px 24px 24px 24px;
}

.reward-section-new {
  max-width: 900px;
  margin: 32px auto 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(108, 99, 255, 0.08);
  padding: 32px 24px 24px 24px;
}

/* 响应式设计 */
@media (max-width: 800px) {
  .reward-card {
    flex-direction: column;
    padding: 18px 10px 18px 10px;
  }

  .reward-card-right {
    margin-top: 18px;
  }

  .virtual-reward-list-row {
    flex-direction: column;
    gap: 16px;
  }

  .my-invite-stats {
    flex-direction: column;
    gap: 12px;
  }

  .invite-link-box {
    flex-direction: column;
    align-items: stretch;
  }

  .invite-link {
    min-width: auto;
  }
}

@media (max-width: 600px) {
  .container,
  .section-card,
  .reward-section-new {
    padding-left: 8px;
    padding-right: 8px;
  }

  .banner,
  .container,
  .section-card,
  .reward-section-new {
    max-width: 100%;
  }
}

/* 现金奖励细则弹窗样式 */
.reward-detail-content {
  padding: 20px;
  font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
}

.detail-section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.section-bar {
  width: 4px;
  height: 20px;
  background: linear-gradient(90deg, #a18fff 0%, #6c63ff 100%);
  margin-right: 10px;
  border-radius: 2px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: $title-color;
  margin: 0;
}

.section-content {
  color: #666;
  line-height: 1.6;
}

.section-content ul {
  margin: 0;
  padding-left: 20px;
}

.section-content li {
  margin-bottom: 8px;
  font-size: 14px;
}

.highlight-red {
  color: #f56c6c;
  font-weight: bold;
}

.highlight-orange {
  color: #e6a23c;
  font-weight: bold;
}

.important-note {
  background: #fdf6ec;
  padding: 10px;
  border-radius: 4px;
  border-left: 3px solid #e6a23c;
  margin-top: 10px;
}

/* 弹窗标题样式 */
.el-drawer__header {
  background: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  padding: 20px;
}

.el-drawer__title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 弹窗内容区域 */
.el-drawer__body {
  padding: 0;
}
</style>
