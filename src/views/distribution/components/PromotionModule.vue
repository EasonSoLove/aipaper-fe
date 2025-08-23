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
      <div class="upgrade-btn" @click="openUpgradeDialog">升级为分享商</div>
    </div>

    <div class="my-invite-stats">
      <div class="my-invite-stat-card">
        <div class="my-invite-stat-icon">💰</div>
        <div class="my-invite-stat-label">累计佣金</div>
        <div class="my-invite-stat-value">
          ￥{{ formatAmount(baseInfo.total_income)
          }}<el-button
            style="margin-left: 10px"
            type="primary"
            size="small"
            @click="handleWithdraw"
          >
            提现
          </el-button>
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

    <!-- 已提现记录 -->
    <div
      v-else-if="activeTab === 'withdrawn'"
      class="my-invite-content active-content"
    >
      <el-table
        :data="withdrawnRecords"
        style="width: 100%"
        v-loading="loading"
        empty-text="暂无数据"
      >
        <el-table-column prop="trade_no" label="单号" width="260">
          <template slot-scope="scope">
            <span class="trade-no-text">{{ scope.row.trade_no }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="distribution_change_type"
          label="类型"
          width="120"
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
        <el-table-column prop="change_amount" label="金额" width="120">
          <template slot-scope="scope">
            <span class="amount-text"
              >￥{{ formatAmount(scope.row.change_amount) }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="settle_status" label="状态" width="120">
          <template slot-scope="scope">
            <span>{{
              translateWithdrawStatus(
                scope.row.settle_status,
                $store.getters.globalCode
              )
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_time" label="申请时间" width="180">
          <template slot-scope="scope">
            <span>{{ formatTime(scope.row.created_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="complete_time" label="处理时间" width="180">
          <template slot-scope="scope">
            <span>{{ formatTime(scope.row.complete_time) }}</span>
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

    <!-- 实名认证弹窗（待激活） -->
    <el-dialog
      :visible.sync="realNameDialogVisible"
      title="实名认证"
      width="520px"
    >
      <el-form
        ref="realNameFormRef"
        :model="realNameForm"
        :rules="realNameRules"
        style="margin: -20px 10px"
        label-position="top"
      >
        <el-form-item label="姓名" prop="real_name" :required="true">
          <el-input
            v-model.trim="realNameForm.real_name"
            placeholder="请输入真实姓名"
          />
        </el-form-item>
        <el-form-item label="身份证号" prop="id_card" :required="true">
          <el-input
            v-model.trim="realNameForm.id_card"
            placeholder="请输入身份证号"
          />
        </el-form-item>
        <el-form-item
          label="支付宝账号（手机号）"
          prop="ali_account"
          :required="true"
        >
          <el-input
            v-model.trim="realNameForm.ali_account"
            placeholder="请输入支付宝账号（手机号）"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="hasAgreedContract">
            我已阅读并同意
            <a
              v-if="contractInfo.title"
              href="javascript:void(0)"
              @click.prevent="openContractLink"
              style="color: #67c23a; margin-left: 4px"
            >
              {{ contractInfo.title }}
            </a>
          </el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="realNameDialogVisible = false">取 消</el-button>
        <el-button
          type="success"
          :disabled="disableSignButton()"
          @click="handleSignSubmit"
          >认证并签约</el-button
        >
      </span>
    </el-dialog>

    <!-- 状态提示弹窗（冻结/关闭/已签约） -->
    <el-dialog
      :visible.sync="statusDialogVisible"
      title="提现提示"
      width="420px"
    >
      <div style="padding: 8px 0">{{ statusDialogText }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="statusDialogVisible = false"
          >我知道了</el-button
        >
      </span>
    </el-dialog>

    <!-- 提现弹窗 -->
    <el-dialog
      :visible.sync="withdrawDialogVisible"
      title="提交提现申请"
      width="520px"
    >
      <div style="margin: -10px 10px 0">
        <div style="margin-bottom: 10px; font-size: 14px">
          可提现：<b>￥{{ formatAmount(baseInfo.balance) }}</b>
        </div>
        <el-form label-position="top">
          <el-form-item label="提现金额 *">
            <el-input-number
              size="medium"
              :min="0.01"
              :max="Number(baseInfo.balance) || 0"
              :step="0.01"
              :precision="2"
              v-model="withdrawForm.withdrawn_amount"
              @change="handleWithdrawAmountChange"
            />
            <div style="margin-top: 8px; color: #999; font-size: 12px">
              实际到账金额（预估）：￥{{ withdrawForm.expected_amount }}
            </div>
            <div style="margin-top: 4px; color: #e6a23c; font-size: 12px">
              手续费和个税暂按预估扣除约6.5%
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="withdrawDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitWithdraw">提交申请</el-button>
      </span>
    </el-dialog>
    <UpgradeDialog
      :visible.sync="upgradeDialogVisible"
      @success="$emit('update-base-info', null)"
    />
  </div>
</template>

<script>
import {
  getDistributionBaseInfo,
  getWithdrawalRecords,
  getWaitingSettleRecords,
  getWithdrawnRecords,
  refreshDistributionAccount,
  getDistributionContract,
  postDistributionSign,
  postDistributionWithdrawn,
  getDistributionUpgrade,
} from "@/api/distribution";
import {
  translateChangeType,
  getChangeTypeClass,
  translateWithdrawStatus,
} from "../constants.js";
import { orderDetailById } from "@/api/user";
import UpgradeDialog from "./UpgradeDialog.vue";

export default {
  name: "PromotionModule",
  components: { UpgradeDialog },
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
      withdrawnRecords: [],
      waitingSettleRecords: [],
      loading: false,
      refreshing: false,
      // 实名认证弹窗相关
      realNameDialogVisible: false,
      realNameForm: {
        real_name: "",
        id_card: "",
        ali_account: "",
      },
      hasAgreedContract: false,
      contractInfo: {
        title: "",
        url: "",
      },
      realNameRules: {
        real_name: [
          {
            required: true,
            message: "请输入真实姓名",
            trigger: ["blur", "change"],
          },
          {
            validator: (rule, value, callback) => {
              const nameRegex = /^[\u4e00-\u9fa5·\sA-Za-z]{2,30}$/;
              if (!value) return callback();
              if (!nameRegex.test(value)) {
                return callback(new Error("姓名格式不正确，不能包含特殊字符"));
              }
              callback();
            },
            trigger: ["blur", "change"],
          },
        ],
        id_card: [
          {
            required: true,
            message: "请输入身份证号",
            trigger: ["blur", "change"],
          },
          {
            validator: (rule, value, callback) => {
              // 简易大陆二代身份证校验（18位，含校验位X/x）
              const idRegex =
                /^(^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0][1-9])|([12]\d)|(3[01]))\d{3}[0-9Xx]$)$/;
              if (!value) return callback();
              if (!idRegex.test(value)) {
                return callback(new Error("身份证号格式不正确"));
              }
              callback();
            },
            trigger: ["blur", "change"],
          },
        ],
        ali_account: [
          {
            required: true,
            message: "请输入支付宝账号（手机号）",
            trigger: ["blur", "change"],
          },
          {
            validator: (rule, value, callback) => {
              const phoneRegex = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
              if (!value) return callback();
              if (!phoneRegex.test(value)) {
                return callback(new Error("手机号格式不正确"));
              }
              callback();
            },
            trigger: ["blur", "change"],
          },
        ],
      },
      // 状态提示弹窗
      statusDialogVisible: false,
      statusDialogText: "",
      // 提现弹窗
      withdrawDialogVisible: false,
      withdrawForm: {
        withdrawn_amount: 0.01,
        expected_amount: 0,
      },
      // 升级支付（交由子组件控制显示，仅提供开关）
      upgradeDialogVisible: false,
      upgradeLoading: false,
      upgradeOrder: {
        out_trade_no: "",
        original_amount: 199,
        pay_amount: 99,
        pay_link: "",
      },
      upgradePolling: false,
      pagination: {
        page_num: 1,
        page_size: 5,
        total: 0,
      },
      // 翻译函数
      translateChangeType,
      getChangeTypeClass,
      translateWithdrawStatus,
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
    openUpgradeDialog() {
      this.upgradeDialogVisible = true;
    },
    // 升级入口
    async handleUpgrade() {
      try {
        this.upgradeDialogVisible = true;
        this.upgradeLoading = true;
        const res = await getDistributionUpgrade();
        if (res && res.code === 200 && res.result) {
          this.upgradeOrder = {
            out_trade_no: res.result.out_trade_no,
            original_amount: res.result.original_amount || 199,
            pay_amount: res.result.pay_amount || 99,
            pay_link: res.result.pay_link,
          };
          this.upgradePolling = true;
          // 启动查询
          this.pollUpgradeStatus();
        } else {
          this.$message.error((res && res.message) || "获取升级订单失败");
        }
      } catch (e) {
        this.$message.error("获取升级订单失败");
      } finally {
        this.upgradeLoading = false;
      }
    },

    // 轮询支付结果（默认2s）
    pollUpgradeStatus(delay = 2000) {
      if (!this.upgradePolling || !this.upgradeOrder.out_trade_no) return;
      orderDetailById({ key: this.upgradeOrder.out_trade_no })
        .then((res) => {
          if (!this.upgradePolling) return;
          const order = res && res.result && res.result.order;
          const status = order && order.payment_status;
          if (status === "TRADE_SUCCESS") {
            this.upgradePolling = false;
            this.upgradeDialogVisible = false;
            this.$message.success("升级成功！");
            this.$emit("update-base-info", null);
          } else {
            setTimeout(() => this.pollUpgradeStatus(delay), delay);
          }
        })
        .catch(() => {
          if (!this.upgradePolling) return;
          setTimeout(() => this.pollUpgradeStatus(delay), delay);
        });
    },
    // 提现入口
    async handleWithdraw() {
      const status = this.baseInfo && this.baseInfo.distribution_account_status;
      if (status === "PENDING_ACTIVATION") {
        this.realNameDialogVisible = true;
        try {
          const res = await getDistributionContract();
          if (res && res.code === 200 && res.result) {
            this.contractInfo.title = res.result.title || "";
            this.contractInfo.url = res.result.url || "";
          }
        } catch (e) {
          // 忽略错误，仅不展示合同信息
        }
        return;
      }

      // 已签约等状态：校验并进入提现弹窗
      if (status === "NORMAL") {
        // 先刷新基础数据，确保余额最新
        try {
          await this.$emit("update-base-info", null);
        } catch (e) {}
        const balance = Number(this.baseInfo && this.baseInfo.balance) || 0;
        if (balance < 0.01) {
          this.$message.warning("金额不足，无法提现");
          return;
        }

        // 打开提现弹窗
        this.openWithdrawDialog();
        return;
      }

      // 其他状态展示状态说明
      const text = this.translateAccountStatus(status);
      this.statusDialogText = text || "状态未知";
      this.statusDialogVisible = true;
    },

    openWithdrawDialog() {
      const balance = Number(this.baseInfo && this.baseInfo.balance) || 0;
      this.withdrawForm.withdrawn_amount = Math.min(0.01, balance);
      this.withdrawForm.expected_amount = (
        this.withdrawForm.withdrawn_amount *
        (1 - 0.065)
      ).toFixed(2);
      this.withdrawDialogVisible = true;
    },

    handleWithdrawAmountChange(val) {
      const v = Number(val) || 0;
      this.withdrawForm.expected_amount = (v * (1 - 0.065)).toFixed(2);
    },

    submitWithdraw() {
      const balance = Number(this.baseInfo && this.baseInfo.balance) || 0;
      const amt = Number(this.withdrawForm.withdrawn_amount) || 0;
      if (amt < 0.01) {
        this.$message.warning("提现金额小于最小提现金额");
        return;
      }
      if (amt > balance) {
        this.$message.error("提现金额超出可提现金额");
        return;
      }
      postDistributionWithdrawn({ withdrawn_amount: String(amt) })
        .then((res) => {
          if (res && res.code === 200) {
            this.$message.success("提现申请已成功发起！");
            this.withdrawDialogVisible = false;
            // 申请成功后刷新基础信息
            this.$emit("update-base-info", null);
          } else {
            this.$message.error((res && res.message) || "提现申请失败");
          }
        })
        .catch((err) => {
          this.$message.error((err && err.message) || "提现申请失败");
        });
    },

    // 账户状态翻译
    translateAccountStatus(status) {
      const map = {
        PENDING_ACTIVATION: "待激活（需先完成实名认证与签约）",
        NORMAL: "已签约（后续将完善提现流程）",
        FROZEN: "账户已冻结，禁止提现",
        CLOSED: "账户已关闭，禁止提现",
      };
      return map[status] || status || "";
    },

    // 打开合同链接
    openContractLink() {
      if (this.contractInfo && this.contractInfo.url) {
        window.open(this.contractInfo.url, "_blank");
      }
    },

    // 是否禁用“认证并签约”按钮（只根据必填项，不强制勾选，从而可以提示）
    disableSignButton() {
      const f = this.realNameForm;
      return !(f.real_name && f.id_card && f.ali_account);
    },

    // 表单校验并提交
    handleSignSubmit() {
      if (!this.$refs.realNameFormRef) return;
      this.$refs.realNameFormRef.validate((valid) => {
        if (!valid) return;
        if (!this.hasAgreedContract) {
          this.$message.warning("请勾选并同意协议");
          return;
        }
        // 提交签约
        const payload = {
          real_name: this.realNameForm.real_name,
          id_card: this.realNameForm.id_card,
          ali_account: this.realNameForm.ali_account,
        };
        postDistributionSign(payload)
          .then((res) => {
            if (res && res.code === 200) {
              this.$message.success("签约成功！");
              this.realNameDialogVisible = false;
              // 通知父组件刷新基础信息
              this.$emit("update-base-info", null); // 父组件内会重新触发getBaseInfo
            } else {
              this.$message.error((res && res.message) || "签约失败");
            }
          })
          .catch((err) => {
            const msg = (err && err.message) || "签约失败";
            this.$message.error(msg);
          });
      });
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
      this.pagination.page_num = 1; // 重置页码

      // 根据 Tab 加载对应数据
      if (tabId === "withdrawable") {
        await this.getWithdrawalRecords();
      } else if (tabId === "withdrawn") {
        await this.getWithdrawnRecords();
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

    // 获取已提现记录
    async getWithdrawnRecords() {
      this.loading = true;
      try {
        const res = await getWithdrawnRecords({
          page_num: this.pagination.page_num,
          page_size: this.pagination.page_size,
        });
        if (res.code === 200) {
          this.withdrawnRecords = res.result.withdrawn_record_list || [];
          this.pagination.total = res.result.total || 0;
        }
      } catch (error) {
        console.error("获取已提现记录失败:", error);
        this.$message.error("获取已提现记录失败");
      } finally {
        this.loading = false;
      }
    },

    // 处理页码改变
    handleCurrentChange(page) {
      this.pagination.page_num = page;
      if (this.activeTab === "withdrawable") {
        this.getWithdrawalRecords();
      } else if (this.activeTab === "withdrawn") {
        this.getWithdrawnRecords();
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
      } else if (this.activeTab === "withdrawn") {
        this.getWithdrawnRecords();
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

    // 关闭升级弹窗
    closeUpgradeDialog() {
      this.upgradeDialogVisible = false;
      this.upgradePolling = false; // 停止轮询
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
  position: relative;
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
/* 占位：移除空样式规则 */
.upgrade-btn {
  font-size: 15px;
  position: absolute;
  bottom: 20px;
  right: 0;
  left: 0;
  margin: 0 auto;
  width: 170px;
  text-align: center;
  color: #fff;
  background: #6c63ff;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  z-index: 2;
}
</style>
