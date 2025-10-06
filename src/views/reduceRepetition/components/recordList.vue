<template>
  <div class="record-list-container">
    <!-- 生成记录标题 -->
    <div class="record-header">
      <h3 class="record-title">生成记录</h3>
    </div>

    <!-- 警告横幅 -->
    <div class="warning-banner">
      <div class="warning-content">
        <i class="el-icon-warning warning-icon"></i>
        <span class="warning-text">
          本站仅保留一个月内处理记录,若有需要请及时下载保存处理结果~
        </span>
        <button class="warning-close" @click="closeWarning">
          <i class="el-icon-close"></i>
        </button>
      </div>
    </div>

    <!-- 记录列表 -->
    <div class="record-list" v-loading="loading">
      <div v-if="recordList.length === 0" class="empty-state">
        <i class="el-icon-document"></i>
        <p>暂无处理记录</p>
      </div>

      <div v-else>
        <div v-for="record in recordList" :key="record.id" class="record-item">
          <!-- 记录头部信息 -->
          <div class="record-item-header">
            <div class="record-id">
              <span class="id-label">ID:</span>
              <span class="id-value">{{ record.task_id }}</span>
              <span class="record-time">{{
                formatTime(record.created_time)
              }}</span>
            </div>
          </div>

          <!-- 记录内容 -->
          <div class="record-content">
            <div class="content-left">
              <div class="content-summary">
                <span class="summary-label">内容摘要:</span>
                <span class="summary-text">{{
                  getContentSummary(record.original_text)
                }}</span>
              </div>
              <div class="content-length">
                <span class="length-label">长度:</span>
                <span class="length-value"
                  >{{ record.original_text.length }}字</span
                >
              </div>
              <div class="processing-status">
                <span class="status-label">处理状态:</span>
                <span
                  class="status-value"
                  :class="getStatusClass(record.status)"
                >
                  {{ getStatusText(record.status) }}
                </span>
              </div>
            </div>

            <div class="content-right">
              <div class="pricing-info">
                <div class="charging-standard">
                  <span class="standard-label">收费标准:</span>
                  <span class="standard-value">3.000元/千字</span>
                </div>
                <div class="billing-amount">
                  <span class="amount-label">计费金额:</span>
                  <span class="amount-value">{{
                    calculatePrice(record.original_text.length)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="record-actions">
            <el-button
              class="download-original-btn"
              icon="el-icon-download"
              @click="downloadOriginal(record)"
            >
              下载原文
            </el-button>
            <el-button
              type="primary"
              class="download-result-btn"
              icon="el-icon-download"
              @click="downloadResult(record)"
            >
              下载结果
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-container" v-if="recordList.length > 0">
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        background
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecordList",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      recordList: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      showWarning: true,
    };
  },
  mounted() {
    console.log("RecordList 组件已挂载");
    this.loadRecordList();
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.loadRecordList();
      }
    },
  },
  methods: {
    // 加载记录列表
    async loadRecordList() {
      console.log("开始加载记录列表");
      this.loading = true;
      try {
        // 模拟接口调用
        const mockData = this.getMockData();
        console.log("模拟数据:", mockData);
        this.recordList = mockData.result.record_list;
        this.total = mockData.result.total;
        this.currentPage = parseInt(mockData.result.page_num);
        this.pageSize = parseInt(mockData.result.page_size);
        console.log("记录列表:", this.recordList);
      } catch (error) {
        console.error("加载记录列表失败:", error);
        this.$message.error("加载记录列表失败");
      } finally {
        this.loading = false;
      }
    },

    // 获取模拟数据
    getMockData() {
      return {
        code: 200,
        message: "success",
        result: {
          page_num: "1",
          page_size: "5",
          total: 5,
          record_list: [
            {
              id: 1,
              user_id: 22,
              task_id: "降AI率",
              original_text: "这是一段测试文本,帮我降AIGC率",
              result_text:
                "这是一段经过AI降重处理的测试文本，帮助您降低AIGC检测率，确保内容更加自然流畅，符合学术写作标准。",
              status: 1,
              created_time: "2025-09-28T14:57:08+08:00",
              updated_time: "2025-09-28T14:57:08+08:00",
            },
            {
              id: 2,
              user_id: 22,
              task_id: "降AI率",
              original_text:
                "M公司员工绩效考核体系优化研究摘要 T公司作为一家快速发展的科技企业，其员工绩效考核体系直接影响着企业的运营效率和员工的工作积极性。本研究旨在通过深入分析M公司现有的绩效考核体系，识别其中存在的问题和不足，并提出相应的优化建议。研究发现，当前考核体系存在指标设置不够科学、评价标准不够明确、反馈机制不够完善等问题。基于此，本研究提出了建立多元化评价指标、完善评价标准、加强反馈机制等优化措施，以期提高M公司员工绩效考核体系的科学性和有效性。",
              result_text:
                "M公司员工绩效评估体系改进研究概述 T公司作为一家高速发展的科技型企业，其员工绩效评估体系直接关系到企业的经营效率和员工的工作积极性。本研究旨在通过深入分析M公司现有的绩效评估体系，识别其中存在的问题和不足，并提出相应的改进建议。研究发现，当前评估体系存在指标设置不够科学、评价标准不够明确、反馈机制不够完善等问题。基于此，本研究提出了建立多元化评价指标、完善评价标准、加强反馈机制等改进措施，以期提高M公司员工绩效评估体系的科学性和有效性。",
              status: 1,
              created_time: "2025-09-28T14:37:40+08:00",
              updated_time: "2025-09-28T14:37:40+08:00",
            },
            {
              id: 3,
              user_id: 22,
              task_id: "降AI率",
              original_text:
                "人工智能技术在医疗领域的应用研究 随着科技的不断发展，人工智能技术在医疗领域的应用越来越广泛。本文主要探讨了人工智能技术在医疗诊断、药物研发、个性化治疗等方面的应用现状和发展趋势。通过分析相关案例，我们发现人工智能技术能够显著提高医疗诊断的准确性和效率，为患者提供更好的医疗服务。",
              result_text:
                "智能技术在医疗领域的应用研究 随着科技的不断发展，智能技术在医疗领域的应用越来越广泛。本文主要探讨了智能技术在医疗诊断、药物研发、个性化治疗等方面的应用现状和发展趋势。通过分析相关案例，我们发现智能技术能够显著提高医疗诊断的准确性和效率，为患者提供更好的医疗服务。",
              status: 1,
              created_time: "2025-09-27T16:23:15+08:00",
              updated_time: "2025-09-27T16:23:15+08:00",
            },
            {
              id: 4,
              user_id: 22,
              task_id: "降AI率",
              original_text:
                "区块链技术在供应链管理中的应用 区块链技术作为一种新兴的分布式账本技术，在供应链管理中具有巨大的应用潜力。本文分析了区块链技术在供应链透明度、可追溯性、信任建立等方面的优势，并探讨了其在食品供应链、药品供应链等具体领域的应用案例。",
              result_text:
                "区块链技术在供应链管理中的应用 区块链技术作为一种新兴的分布式账本技术，在供应链管理中具有巨大的应用潜力。本文分析了区块链技术在供应链透明度、可追溯性、信任建立等方面的优势，并探讨了其在食品供应链、药品供应链等具体领域的应用案例。",
              status: 0,
              created_time: "2025-09-26T10:15:30+08:00",
              updated_time: "2025-09-26T10:15:30+08:00",
            },
            {
              id: 5,
              user_id: 22,
              task_id: "降AI率",
              original_text:
                "机器学习算法在金融风控中的应用研究 金融风控是金融机构的核心业务之一，传统的风控方法往往依赖于人工经验和简单的统计模型。随着大数据和机器学习技术的发展，越来越多的金融机构开始采用机器学习算法进行风险控制。本文研究了决策树、随机森林、支持向量机等机器学习算法在金融风控中的应用，并通过实验验证了这些算法的有效性。",
              result_text:
                "机器学习算法在金融风控中的应用研究 金融风控是金融机构的核心业务之一，传统的风控方法往往依赖于人工经验和简单的统计模型。随着大数据和机器学习技术的发展，越来越多的金融机构开始采用机器学习算法进行风险控制。本文研究了决策树、随机森林、支持向量机等机器学习算法在金融风控中的应用，并通过实验验证了这些算法的有效性。",
              status: 1,
              created_time: "2025-09-25T09:42:18+08:00",
              updated_time: "2025-09-25T09:42:18+08:00",
            },
          ],
        },
      };
    },

    // 格式化时间
    formatTime(timeStr) {
      const date = new Date(timeStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    // 获取内容摘要
    getContentSummary(text) {
      if (!text) return "";
      return text.length > 20 ? text.substring(0, 20) + "..." : text;
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        0: "处理中",
        1: "已完成",
        2: "处理失败",
      };
      return statusMap[status] || "未知状态";
    },

    // 获取状态样式类
    getStatusClass(status) {
      const classMap = {
        0: "status-processing",
        1: "status-completed",
        2: "status-failed",
      };
      return classMap[status] || "";
    },

    // 计算价格
    calculatePrice(charCount) {
      const pricePerThousand = 3.0;
      const price = (charCount / 1000) * pricePerThousand;
      return price.toFixed(3);
    },

    // 下载原文
    downloadOriginal(record) {
      this.$message.info("下载原文功能开发中");
      console.log("下载原文:", record);
    },

    // 下载结果
    downloadResult(record) {
      this.$message.info("下载结果功能开发中");
      console.log("下载结果:", record);
    },

    // 分页变化
    handlePageChange(page) {
      this.currentPage = page;
      this.loadRecordList();
    },

    // 关闭警告
    closeWarning() {
      this.showWarning = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.record-list-container {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.record-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e4e7ed;
}

.record-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.warning-banner {
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 6px;
  margin-bottom: 20px;
  padding: 12px 16px;
}

.warning-content {
  display: flex;
  align-items: center;
  position: relative;
}

.warning-icon {
  color: #fa8c16;
  font-size: 16px;
  margin-right: 8px;
}

.warning-text {
  color: #d46b08;
  font-size: 14px;
  flex: 1;
}

.warning-close {
  background: none;
  border: none;
  color: #d46b08;
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  font-size: 12px;
  margin-left: 8px;

  &:hover {
    background: rgba(212, 107, 8, 0.1);
  }
}

.record-list {
  min-height: 200px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;

  i {
    font-size: 48px;
    margin-bottom: 16px;
    display: block;
  }

  p {
    margin: 0;
    font-size: 16px;
  }
}

.record-item {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.record-item-header {
  margin-bottom: 12px;
}

.record-id {
  display: flex;
  align-items: center;
  gap: 8px;
}

.id-label {
  color: #666;
  font-size: 14px;
}

.id-value {
  color: #409eff;
  font-weight: 500;
  font-size: 14px;
}

.record-time {
  color: #999;
  font-size: 12px;
  margin-left: auto;
}

.record-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.content-left {
  flex: 1;
}

.content-summary {
  margin-bottom: 8px;
}

.summary-label {
  color: #333;
  font-size: 14px;
  margin-right: 8px;
}

.summary-text {
  color: #666;
  font-size: 14px;
  word-break: break-all;
}

.content-length {
  margin-bottom: 8px;
}

.length-label {
  color: #333;
  font-size: 14px;
  margin-right: 8px;
}

.length-value {
  color: #666;
  font-size: 14px;
}

.processing-status {
  margin-bottom: 0;
}

.status-label {
  color: #333;
  font-size: 14px;
  margin-right: 8px;
}

.status-value {
  font-size: 14px;
  font-weight: 500;

  &.status-completed {
    color: #67c23a;
  }

  &.status-processing {
    color: #e6a23c;
  }

  &.status-failed {
    color: #f56c6c;
  }
}

.content-right {
  text-align: right;
  min-width: 120px;
}

.pricing-info {
  .charging-standard,
  .billing-amount {
    margin-bottom: 4px;
    font-size: 14px;
  }

  .standard-label,
  .amount-label {
    color: #333;
    margin-right: 4px;
  }

  .standard-value,
  .amount-value {
    color: #666;
  }
}

.record-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.download-original-btn {
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;

  &:hover {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
}

.download-result-btn {
  background: #409eff;
  border: 1px solid #409eff;
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;

  &:hover {
    background: #66b1ff;
    border-color: #66b1ff;
  }
}

.pagination-container {
  margin-top: 20px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

// 响应式设计
@media (max-width: 768px) {
  .record-list-container {
    padding: 15px;
    margin: 10px;
  }

  .record-content {
    flex-direction: column;
  }

  .content-right {
    text-align: left;
    margin-top: 12px;
  }

  .record-actions {
    flex-direction: column;
    gap: 8px;
  }

  .download-original-btn,
  .download-result-btn {
    width: 100%;
  }
}
</style>
