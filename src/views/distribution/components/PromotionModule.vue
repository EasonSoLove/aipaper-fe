<template>
  <div class="section-card">
    <div class="section-header">
      <div class="section-title">我的推广</div>
      <button
        class="refresh-btn"
        @click="refreshPromotionData"
        :disabled="refreshing"
        :class="{ refreshing: refreshing }"
      >
        <i class="el-icon-refresh"></i>
        <span style="margin-left: 5px">刷新</span>
      </button>
    </div>

    <div class="my-invite-bg">
      <img src="@/assets/images/distribution/bg4.png" alt="" />
    </div>

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

    <div style="display: flex; justify-content: center; margin-bottom: 18px">
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

    <!-- 可提现记录 -->
    <div
      v-if="activeTab === 'withdrawable'"
      class="my-invite-content active-content"
    >
      <el-table
        :data="withdrawalRecords"
        style="width: 100%"
        v-loading="loading"
        empty-text="暂无数据"
      >
        <el-table-column
          prop="distribution_change_type"
          label="变动类型"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <span
              :class="getChangeTypeClass(scope.row.distribution_change_type)"
            >
              {{ translateChangeType(scope.row.distribution_change_type) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="change_amount" label="变动金额" width="130">
          <template slot-scope="scope">
            <span
              :class="[
                'amount-text',
                scope.row.change_amount < 0
                  ? 'amount-negative'
                  : 'amount-positive',
              ]"
            >
              {{ scope.row.change_amount < 0 ? "-" : "" }}￥{{
                formatAmount(Math.abs(scope.row.change_amount))
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="trade_no" label="关联单号" width="260">
          <template slot-scope="scope">
            <span class="trade-no-text">{{ scope.row.trade_no }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_time" label="交易时间">
          <template slot-scope="scope">
            <span>{{ formatTime(scope.row.created_time) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page_num"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="pagination.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 待结算记录 -->
    <div
      v-else-if="activeTab === 'pending'"
      class="my-invite-content active-content"
    >
      <el-table
        :data="waitingSettleRecords"
        style="width: 100%"
        v-loading="loading"
        empty-text="暂无数据"
      >
        <el-table-column
          prop="distribution_change_type"
          label="变动类型"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <span
              :class="getChangeTypeClass(scope.row.distribution_change_type)"
            >
              {{ translateChangeType(scope.row.distribution_change_type) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="change_amount" label="变动金额" width="130">
          <template slot-scope="scope">
            <span
              :class="[
                'amount-text',
                scope.row.change_amount < 0
                  ? 'amount-negative'
                  : 'amount-positive',
              ]"
            >
              {{ scope.row.change_amount < 0 ? "-" : "" }}￥{{
                formatAmount(Math.abs(scope.row.change_amount))
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="trade_no" label="关联单号" width="260">
          <template slot-scope="scope">
            <span class="trade-no-text">{{ scope.row.trade_no }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_time" label="交易时间">
          <template slot-scope="scope">
            <span>{{ formatTime(scope.row.created_time) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page_num"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="pagination.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 其他tab内容 -->
    <div v-else class="my-invite-content">
      <div class="empty-content">
        <i class="el-icon-info"></i>
        <p>暂无数据</p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDistributionBaseInfo,
  getWithdrawalRecords,
  getWaitingSettleRecords,
  refreshDistributionAccount,
} from "@/api/distribution";
import { translateChangeType, getChangeTypeClass } from "../constants.js";

export default {
  name: "PromotionModule",
  props: {
    baseInfo: {
      type: Object,
      default: () => ({
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
      }),
    },
  },
  data() {
    return {
      activeTab: "withdrawable",
      promotionTabs: [
        { id: "withdrawable", text: "可提现 ￥0.00" },
        { id: "withdrawn", text: "已提现 ￥0.00" },
        { id: "pending", text: "待结算 ￥0.00" },
      ],
      withdrawalRecords: [],
      waitingSettleRecords: [],
      loading: false,
      refreshing: false,
      pagination: {
        page_num: 1,
        page_size: 5,
        total: 0,
      },
      // 翻译函数
      translateChangeType,
      getChangeTypeClass,
    };
  },
  watch: {
    baseInfo: {
      handler(newVal) {
        this.updateTabTexts();
      },
      immediate: true,
    },
  },
  mounted() {
    // 组件初始化时获取可提现记录数据
    this.getWithdrawalRecords();
  },
  methods: {
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
      this.pagination.page_num = 1; // 重置页码

      // 根据 Tab 加载对应数据
      if (tabId === "withdrawable") {
        await this.getWithdrawalRecords();
      } else if (tabId === "pending") {
        await this.getWaitingSettleRecords();
      }
    },

    // 获取可提现记录
    async getWithdrawalRecords() {
      this.loading = true;
      try {
        const res = await getWithdrawalRecords({
          page_num: this.pagination.page_num,
          page_size: this.pagination.page_size,
        });
        if (res.code === 200) {
          this.withdrawalRecords = res.result.withdrawal_record_list || [];
          this.pagination.total = res.result.total || 0;
        }
      } catch (error) {
        console.error("获取可提现记录失败:", error);
        this.$message.error("获取可提现记录失败");
      } finally {
        this.loading = false;
      }
    },

    // 获取待结算记录
    async getWaitingSettleRecords() {
      this.loading = true;
      try {
        const res = await getWaitingSettleRecords({
          page_num: this.pagination.page_num,
          page_size: this.pagination.page_size,
        });
        if (res.code === 200) {
          this.waitingSettleRecords = res.result.settling_record_list || [];
          this.pagination.total = res.result.total || 0;
        }
      } catch (error) {
        console.error("获取待结算记录失败:", error);
        this.$message.error("获取待结算记录失败");
      } finally {
        this.loading = false;
      }
    },

    // 处理页码改变
    handleCurrentChange(page) {
      this.pagination.page_num = page;
      if (this.activeTab === "withdrawable") {
        this.getWithdrawalRecords();
      } else if (this.activeTab === "pending") {
        this.getWaitingSettleRecords();
      }
    },

    // 处理每页条数改变
    handleSizeChange(size) {
      this.pagination.page_size = size;
      this.pagination.page_num = 1; // 重置到第一页
      if (this.activeTab === "withdrawable") {
        this.getWithdrawalRecords();
      } else if (this.activeTab === "pending") {
        this.getWaitingSettleRecords();
      }
    },

    // 刷新推广数据
    async refreshPromotionData() {
      this.refreshing = true;
      try {
        // 先调用3.1接口：刷新推广数据
        const refreshRes = await refreshDistributionAccount();
        if (refreshRes.code === 200) {
          // 成功后链式调用3.2接口：获取基础信息
          const baseRes = await getDistributionBaseInfo();
          if (baseRes.code === 200) {
            // 通过事件通知父组件更新数据
            this.$emit("update-base-info", baseRes.result);
            this.updateTabTexts();
            this.$message.success("推广数据已刷新");
          } else {
            this.$message.error("获取基础信息失败");
          }
        } else {
          this.$message.error("刷新推广数据失败");
        }
      } catch (error) {
        console.error("刷新推广数据失败:", error);
        this.$message.error("刷新失败，请稍后重试");
      } finally {
        this.refreshing = false;
      }
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
  },
};
</script>

<style lang="scss" scoped>
/* 区块头部样式 */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.section-header .section-title {
  margin-bottom: 0;
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
  box-shadow: 0 4px 12px rgba(108, 99, 255, 0.2);
}

/* 刷新按钮样式 */
.refresh-btn {
  background: linear-gradient(90deg, #6c63ff 0%, #b6c7f7 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 18px;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 36px;
  margin-left: 10px;
}

.refresh-btn:hover {
  background: linear-gradient(90deg, #b6c7f7 0%, #6c63ff 100%);
}

.refresh-btn.refreshing {
  background: #ccc;
  cursor: not-allowed;
  color: #888;
}

.refresh-btn.refreshing i {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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
  color: #666;
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

.empty-content {
  text-align: center;
  color: #888;
  font-size: 16px;
  padding: 40px 0;
}

.empty-content i {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

/* 表格样式 */
.amount-text {
  color: #ff5e5e;
  font-weight: bold;
}

.amount-negative {
  color: #ff5e5e; /* 负数金额显示红色 */
}

.amount-positive {
  color: #4caf50; /* 正数金额显示绿色 */
}

/* 变动类型样式 */
.change-type-income {
  color: #4caf50;
  font-weight: bold;
}

.change-type-refund {
  color: #ff9800;
  font-weight: bold;
}

.change-type-upgrade {
  color: #2196f3;
  font-weight: bold;
}

.change-type-withdraw {
  color: #9c27b0;
  font-weight: bold;
}

.change-type-withdraw-back {
  color: #ff5722;
  font-weight: bold;
}

.change-type-default {
  color: #666;
  font-weight: normal;
}

.trade-no-text {
  color: #666;
  font-family: monospace;
  font-size: 12px;
}

.pagination-wrapper {
  margin-top: 20px;
  text-align: center;
}

.my-invite-bg {
  width: 100%;
  img {
    width: 100%;
    height: auto;
  }
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

/* 响应式设计 */
@media (max-width: 800px) {
  .my-invite-stats {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 600px) {
  .section-card {
    padding-left: 8px;
    padding-right: 8px;
  }

  .section-card {
    max-width: 100%;
  }
}
</style>
