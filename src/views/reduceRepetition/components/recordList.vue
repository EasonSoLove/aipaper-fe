<template>
  <div class="record-list-container">
    <!-- 生成记录标题 -->
    <div class="record-header">
      <h3 class="record-title">生成记录</h3>
    </div>

    <!-- 警告横幅 -->
    <div class="warning-banner" v-if="showWarning">
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
              <span class="id-label">类型:</span>
              <span class="id-value">{{ record.product_type_text }}</span>
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
                <!-- <div class="billing-amount">
                  <span class="amount-label">计费金额:</span>
                  <span class="amount-value">{{
                    calculatePrice(record.original_text.length)
                  }}</span>
                </div> -->
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="record-actions">
            <el-button
              size="mini"
              class="download-original-btn"
              icon="el-icon-download"
              @click="downloadOriginal(record)"
            >
              下载原文
            </el-button>
            <el-button
              type="primary"
              size="mini"
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

    <!-- 分页组件 -->
    <!-- 当记录数量大于0时显示分页 -->
    <div class="pagination-container" v-if="recordList.length > 0">
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        background
        :page-sizes="[5, 10, 20]"
        :page-size-options="['5条/页', '10条/页', '20条/页']"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getReduceRecords } from "@/api/paper";

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
      loading: false, // 加载状态
      recordList: [], // 记录列表数据
      currentPage: 1, // 当前页码，从1开始
      pageSize: 5, // 每页显示条数，设置为5条
      total: 0, // 总记录数，用于分页计算
      showWarning: true, // 是否显示警告横幅
    };
  },
  mounted() {
    console.log("RecordList 组件已挂载");
    this.checkWarningStatus();
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
      console.log("开始加载记录列表，当前页:", this.currentPage);
      this.loading = true;
      try {
        const response = await getReduceRecords({
          page_num: this.currentPage,
          page_size: this.pageSize,
        });

        if (response.code === 200) {
          this.recordList = response.result.record_list || [];
          this.total = response.result.total || 0;
          console.log("记录列表:", this.recordList);
          console.log(
            "总记录数:",
            this.total,
            "当前页:",
            this.currentPage,
            "每页条数:",
            this.pageSize
          );
        } else {
          this.$message.error("获取记录列表失败：" + response.message);
          this.recordList = [];
          this.total = 0;
        }
      } catch (error) {
        console.error("加载记录列表失败:", error);
        this.$message.error("加载记录列表失败");
        this.recordList = [];
        this.total = 0;
      } finally {
        this.loading = false;
      }
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
    async downloadOriginal(record) {
      if (!record.original_text) {
        this.$message.warning("没有可下载的原文内容");
        return;
      }

      try {
        // 动态导入 docx 库
        const { Document, Packer, Paragraph, TextRun } = await import("docx");

        // 创建文档
        const doc = new Document({
          sections: [
            {
              properties: {},
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: record.original_text,
                      size: 24, // 12pt font size
                    }),
                  ],
                }),
              ],
            },
          ],
        });

        // 生成 DOCX 文件
        const blob = await Packer.toBlob(doc);

        // 创建下载链接
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // 生成文件名
        const timestamp = this.formatTime(record.created_time).replace(
          /[: ]/g,
          "-"
        );
        link.download = `原文_${record.task_id}_${timestamp}.docx`;

        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 清理 URL 对象
        window.URL.revokeObjectURL(url);

        this.$message.success("原文下载成功");
      } catch (error) {
        console.error("下载原文失败:", error);
        this.$message.error("下载失败，请稍后重试");
      }
    },

    // 下载结果
    async downloadResult(record) {
      if (!record.result_text) {
        this.$message.warning("没有可下载的结果内容");
        return;
      }

      try {
        // 动态导入 docx 库
        const { Document, Packer, Paragraph, TextRun } = await import("docx");

        // 创建文档
        const doc = new Document({
          sections: [
            {
              properties: {},
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: record.result_text,
                      size: 24, // 12pt font size
                    }),
                  ],
                }),
              ],
            },
          ],
        });

        // 生成 DOCX 文件
        const blob = await Packer.toBlob(doc);

        // 创建下载链接
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // 生成文件名
        const timestamp = this.formatTime(record.created_time).replace(
          /[: ]/g,
          "-"
        );
        link.download = `结果_${record.task_id}_${timestamp}.docx`;

        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 清理 URL 对象
        window.URL.revokeObjectURL(url);

        this.$message.success("结果下载成功");
      } catch (error) {
        console.error("下载结果失败:", error);
        this.$message.error("下载失败，请稍后重试");
      }
    },

    // 分页变化处理
    // 当用户点击分页按钮时触发，更新当前页码并重新加载数据
    handlePageChange(page) {
      console.log("切换到第", page, "页");
      this.currentPage = page;
      // 重新加载当前页的数据
      this.loadRecordList();
    },

    // 检查警告状态
    checkWarningStatus() {
      const hasClosedWarning = sessionStorage.getItem("hasClosedRecordWarning");
      if (hasClosedWarning === "true") {
        this.showWarning = false;
      }
    },

    // 关闭警告
    closeWarning() {
      this.showWarning = false;
      // 设置 sessionStorage 标记，表示用户已经关闭过警告
      sessionStorage.setItem("hasClosedRecordWarning", "true");
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
  margin-top: -46px;
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
