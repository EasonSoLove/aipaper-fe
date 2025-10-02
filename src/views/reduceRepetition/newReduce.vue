<template>
  <div class="new-reduce-container">
    <!-- 重要提示弹窗 -->
    <el-dialog
      :visible.sync="showWarningDialog"
      title="重要提示"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div class="warning-content">
        <p class="warning-title">重要提示</p>
        <p class="warning-text">
          <strong>请注意：</strong><br />
          不同平台的 AI 检测算法各不相同，检测结果之间没有参考价值<br />
          知网维普格子达查重 100%一次过<br />
          paperpass 的 AI 查重逻辑和主流的付费的 AI
          查重如知网维普格子达不一致，若选择知网维普则无法通过 paperpass 的检测
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeWarningDialog"
          >我知道了</el-button
        >
      </div>
    </el-dialog>

    <!-- 主页面内容 -->
    <div class="main-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-loading :loading="loading" text="加载中...">
          <div style="height: 200px"></div>
        </el-loading>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-container">
        <el-alert :title="error" type="error" show-icon :closable="false" />
        <el-button @click="loadProducts" style="margin-top: 20px"
          >重新加载</el-button
        >
      </div>

      <!-- 主要内容 -->
      <div v-else class="content-wrapper">
        <!-- 产品选择区域 -->
        <div class="products-selection">
          <div class="products-grid">
            <div
              v-for="product in products"
              :key="product.product"
              class="product-card"
              :class="{ selected: activeTab === product.product }"
              @click="selectProduct(product)"
            >
              <!-- 选中图标 -->
              <div v-if="activeTab === product.product" class="selected-icon">
                <i class="el-icon-check"></i>
              </div>

              <!-- 产品信息 -->
              <div class="product-content">
                <!-- 图标和标题在同一行 -->
                <div class="product-header">
                  <div class="product-icon">
                    <i :class="getProductIcon(product.product)"></i>
                  </div>
                  <h3 class="product-title">{{ product.product_name }}</h3>
                </div>

                <!-- 描述 -->
                <p class="product-description">{{ product.description }}</p>

                <!-- 价格 -->
                <div class="product-price">
                  <span class="price">{{ product.price }}元</span>
                  <span class="unit">/{{ product.unit }}字</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 功能区域 -->
        <div class="function-area">
          <!-- 文本语言选择 -->
          <div class="language-selection">
            <div class="selection-label">
              <i class="el-icon-document"></i>
              <span>文本语言</span>
            </div>
            <div class="selection-tabs">
              <div
                class="tab-item"
                :class="{ active: selectedLanguage === 'CN' }"
                @click="selectLanguage('CN')"
              >
                中文
              </div>
              <div
                class="tab-item"
                :class="{ active: selectedLanguage === 'EN' }"
                @click="selectLanguage('EN')"
              >
                英文
              </div>
            </div>
          </div>

          <!-- 检测平台选择 -->
          <div
            v-if="
              currentProduct &&
              currentProduct.cn_support_platform &&
              currentProduct.cn_support_platform.length > 0
            "
            class="detection-platform-selection"
          >
            <div class="selection-label">
              <i class="el-icon-monitor"></i>
              <span>检测平台</span>
            </div>
            <div class="platform-options">
              <div
                v-for="platform in currentProduct.cn_support_platform"
                :key="platform.platform"
                class="platform-item"
                :class="{ active: selectedPlatform === platform.platform }"
                @click="selectPlatform(platform.platform)"
              >
                {{ platform.description }}
              </div>
            </div>
          </div>

          <!-- 输入方式选择 -->
          <div class="input-method-selection">
            <div class="selection-tabs">
              <div
                class="tab-item"
                :class="{ active: inputMethod === 'text' }"
                @click="selectInputMethod('text')"
              >
                <i class="el-icon-edit"></i>
                文本输入
              </div>
              <div
                class="tab-item"
                :class="{ active: inputMethod === 'file' }"
                @click="selectInputMethod('file')"
              >
                <i class="el-icon-upload"></i>
                文件上传
                <span class="sub-text">(请上传需要处理的段落)</span>
              </div>
            </div>
          </div>

          <!-- 服务标题和余额 -->
          <div class="service-header">
            <h3>{{ currentProduct?.product_name || "降重复率" }}</h3>
            <span class="balance">(余额: {{ userBalance }}元)</span>
          </div>

          <!-- 主要内容区域 -->
          <div class="main-work-area">
            <!-- 左侧输入区域 -->
            <div class="input-area">
              <!-- 文本输入模式 -->
              <div v-if="inputMethod === 'text'" class="text-input-container">
                <el-input
                  v-model="inputText"
                  type="textarea"
                  :rows="20"
                  placeholder="输入或粘贴中文文本 (最多10000个字符)"
                  maxlength="10000"
                  show-word-limit
                  @input="handleTextInput"
                />
                <div class="input-footer">
                  <div class="char-count">
                    {{ inputText.length }}/10000 字符
                  </div>
                  <div class="action-buttons">
                    <el-button @click="resetInput">重置</el-button>
                    <el-button type="primary" @click="generateText"
                      >一键生成</el-button
                    >
                  </div>
                </div>
              </div>

              <!-- 文件上传模式 -->
              <div v-else class="file-upload-container">
                <el-upload
                  class="upload-dragger"
                  drag
                  :action="uploadUrl"
                  :before-upload="beforeUpload"
                  :on-success="handleUploadSuccess"
                  :on-error="handleUploadError"
                  :show-file-list="false"
                  accept=".docx,.txt"
                >
                  <i class="el-icon-document"></i>
                  <div class="el-upload__text">点击或拖拽文件到此区域上传</div>
                  <div class="el-upload__tip">
                    支持DOCX、txt格式的文件，DOC文件请先在Word中转换为DOCX，最大
                    20MB
                  </div>
                </el-upload>
                <div class="upload-footer">
                  <div class="char-count">
                    {{ uploadedText.length }}/10000 字符
                  </div>
                  <div class="action-buttons">
                    <el-button @click="resetInput">重置</el-button>
                    <el-button type="primary" @click="generateText"
                      >一键生成</el-button
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧生成区域 -->
            <div class="output-area">
              <div class="output-container">
                <div v-if="!generatedText" class="no-content">暂无内容</div>
                <div v-else class="generated-content">
                  {{ generatedText }}
                </div>
              </div>
              <div class="output-footer">
                <div class="char-count">字符数: {{ generatedText.length }}</div>
                <div class="action-buttons">
                  <el-button @click="copyResult">复制结果</el-button>
                  <el-button @click="downloadDocx">下载DOCX</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAigcProducts } from "@/api/paper";

export default {
  name: "NewReduce",
  data() {
    return {
      showWarningDialog: true,
      loading: false,
      error: null,
      products: [],
      activeTab: "",
      selectedLanguage: "CN",
      selectedPlatform: "",
      inputMethod: "text",
      inputText: "",
      uploadedText: "",
      generatedText: "",
      userBalance: "46.130",
      uploadUrl: "/api/upload", // 文件上传地址
    };
  },
  computed: {
    currentProduct() {
      return this.products.find((p) => p.product === this.activeTab);
    },
  },
  mounted() {
    this.loadProducts();
  },
  methods: {
    // 关闭警告弹窗
    closeWarningDialog() {
      this.showWarningDialog = false;
    },

    // 加载产品信息
    async loadProducts() {
      this.loading = true;
      this.error = null;

      try {
        const response = await getAigcProducts();
        if (response.code === 200) {
          this.products = response.result || [];
          // 默认选择第一个产品
          if (this.products.length > 0) {
            this.activeTab = this.products[0].product;
          }
        } else {
          this.error = response.message || "获取产品信息失败";
        }
      } catch (err) {
        console.error("获取产品信息失败:", err);
        this.error = "网络错误，请稍后重试";
      } finally {
        this.loading = false;
      }
    },

    // 选择产品
    selectProduct(product) {
      this.activeTab = product.product;
      // 重置检测平台选择
      this.selectedPlatform = "";
      // 如果产品有检测平台，默认选择第一个
      if (
        product.cn_support_platform &&
        product.cn_support_platform.length > 0
      ) {
        this.selectedPlatform = product.cn_support_platform[0].platform;
      }
    },

    // 获取产品图标
    getProductIcon(productType) {
      const iconMap = {
        deduplication: "el-icon-document",
        aigc: "el-icon-star-on",
        combined: "el-icon-collection",
        combinedplus: "el-icon-collection",
      };
      return iconMap[productType] || "el-icon-document";
    },

    // 选择语言
    selectLanguage(language) {
      this.selectedLanguage = language;
    },

    // 选择检测平台
    selectPlatform(platform) {
      this.selectedPlatform = platform;
    },

    // 选择输入方式
    selectInputMethod(method) {
      this.inputMethod = method;
    },

    // 处理文本输入
    handleTextInput(value) {
      this.inputText = value;
    },

    // 重置输入
    resetInput() {
      this.inputText = "";
      this.uploadedText = "";
      this.generatedText = "";
    },

    // 生成文本
    generateText() {
      // TODO: 实现生成逻辑
      console.log("生成文本", {
        product: this.activeTab,
        language: this.selectedLanguage,
        inputMethod: this.inputMethod,
        text: this.inputMethod === "text" ? this.inputText : this.uploadedText,
      });
    },

    // 复制结果
    copyResult() {
      if (this.generatedText) {
        navigator.clipboard.writeText(this.generatedText).then(() => {
          this.$message.success("复制成功");
        });
      }
    },

    // 下载DOCX
    downloadDocx() {
      if (this.generatedText) {
        // TODO: 实现下载DOCX功能
        this.$message.info("下载功能开发中");
      }
    },

    // 文件上传前验证
    beforeUpload(file) {
      const isValidType =
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "text/plain";
      const isLt20M = file.size / 1024 / 1024 < 20;

      if (!isValidType) {
        this.$message.error("只能上传 DOCX 或 TXT 格式的文件!");
        return false;
      }
      if (!isLt20M) {
        this.$message.error("文件大小不能超过 20MB!");
        return false;
      }
      return true;
    },

    // 文件上传成功
    handleUploadSuccess(response, file) {
      // TODO: 处理文件上传成功，提取文本内容
      this.$message.success("文件上传成功");
      // 这里需要根据实际接口返回处理文件内容
      this.uploadedText = "文件内容已上传，等待处理...";
    },

    // 文件上传失败
    handleUploadError(error) {
      this.$message.error("文件上传失败");
      console.error("上传失败:", error);
    },
  },
};
</script>

<style scoped>
.new-reduce-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.warning-content {
  text-align: center;
}

.warning-title {
  color: #f56c6c;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

.warning-text {
  color: #333;
  line-height: 1.6;
  text-align: left;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
}

.loading-container,
.error-container {
  text-align: center;
  padding: 40px;
}

/* 产品选择区域 */
.products-selection {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 20px;
}

.products-grid {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.product-card {
  width: 305px;
  height: 160px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-card:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.product-card.selected {
  border: 2px solid #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}

/* 选中图标 */
.selected-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: #409eff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  z-index: 1;
}

/* 产品内容 */
.product-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 产品头部（图标和标题） */
.product-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
}

/* 产品图标 */
.product-icon {
  width: 32px;
  height: 32px;
  background: #e6e6fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  flex-shrink: 0;
}

.product-icon i {
  font-size: 16px;
  color: #666;
}

.product-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.2;
  flex: 1;
}

.product-description {
  font-size: 11px;
  color: #666;
  line-height: 1.3;
  margin: 0 0 8px 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  display: flex;
  align-items: baseline;
  margin-top: auto;
}

.price {
  font-size: 16px;
  font-weight: bold;
  color: #409eff;
}

.unit {
  font-size: 11px;
  color: #409eff;
  margin-left: 2px;
}

/* 功能区域 */
.function-area {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

/* 语言选择 */
.language-selection {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.selection-label {
  display: flex;
  align-items: center;
  margin-right: 20px;
  font-weight: 500;
  color: #333;
}

.selection-label i {
  margin-right: 8px;
  color: #409eff;
}

.selection-tabs {
  display: flex;
  gap: 10px;
}

.tab-item {
  padding: 8px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.tab-item:hover {
  color: #409eff;
  border-color: #409eff;
}

.tab-item.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

.tab-item i {
  margin-right: 6px;
}

.sub-text {
  font-size: 12px;
  color: #999;
  margin-left: 4px;
}

/* 检测平台选择 */
.detection-platform-selection {
  margin-bottom: 20px;
}

.platform-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.platform-item {
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: #606266;
  background: white;
}

.platform-item:hover {
  color: #409eff;
  border-color: #409eff;
}

.platform-item.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

/* 输入方式选择 */
.input-method-selection {
  margin-bottom: 20px;
}

/* 服务标题和余额 */
.service-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.service-header h3 {
  font-size: 20px;
  color: #333;
  margin: 0;
  margin-right: 10px;
}

.balance {
  color: #666;
  font-size: 14px;
}

/* 主要内容区域 */
.main-work-area {
  display: flex;
  gap: 20px;
  min-height: 500px;
}

.input-area,
.output-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 文本输入区域 */
.text-input-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.text-input-container .el-textarea {
  flex: 1;
}

.text-input-container .el-textarea__inner {
  height: 100%;
  resize: none;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 10px 0;
}

/* 文件上传区域 */
.file-upload-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.upload-dragger {
  flex: 1;
  border: 2px dashed #dcdfe6;
  border-radius: 6px;
  background: #fafafa;
  text-align: center;
  padding: 40px 20px;
  transition: all 0.3s;
}

.upload-dragger:hover {
  border-color: #409eff;
}

.upload-dragger i {
  font-size: 48px;
  color: #c0c4cc;
  margin-bottom: 16px;
}

.el-upload__text {
  color: #606266;
  font-size: 14px;
  margin-bottom: 8px;
}

.el-upload__tip {
  color: #909399;
  font-size: 12px;
}

.upload-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 10px 0;
}

/* 输出区域 */
.output-container {
  flex: 1;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 15px;
  background: #fafafa;
  min-height: 400px;
}

.no-content {
  color: #c0c4cc;
  text-align: center;
  line-height: 400px;
  font-size: 14px;
}

.generated-content {
  color: #333;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.output-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 10px 0;
}

/* 字符统计 */
.char-count {
  color: #909399;
  font-size: 12px;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 10px;
}

.action-buttons .el-button {
  padding: 8px 16px;
  font-size: 14px;
}

.dialog-footer {
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .products-grid {
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .product-card {
    width: calc(50% - 10px);
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .products-grid {
    flex-direction: column;
    align-items: center;
  }

  .product-card {
    width: 100%;
    max-width: 305px;
  }

  .main-work-area {
    flex-direction: column;
  }

  .language-selection {
    flex-direction: column;
    align-items: flex-start;
  }

  .selection-label {
    margin-bottom: 10px;
  }

  .service-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .service-header h3 {
    margin-bottom: 5px;
  }
}
</style>
