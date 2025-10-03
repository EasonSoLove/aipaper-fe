<template>
  <div>
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

    <!-- 处理案例展示弹窗 -->
    <el-dialog
      :visible.sync="showCaseDialog"
      title="处理案例展示"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="case-dialog"
    >
      <div class="case-content">
        <img
          src="@/assets/images/promotion/translate.png"
          alt="处理案例展示"
          class="case-image"
        />

        <!-- 统计卡片区域 -->
        <div class="stats-cards">
          <div class="stat-card stat-card-green">
            <div class="stat-number">5%</div>
            <div class="stat-label">查重率</div>
            <div class="stat-desc">远低于行业标准</div>
          </div>
          <div class="stat-card stat-card-blue">
            <div class="stat-number">6%</div>
            <div class="stat-label">AI检测率</div>
            <div class="stat-desc">完全达到发表标准</div>
          </div>
        </div>

        <!-- 特点列表区域 -->
        <div class="features-list">
          <div class="feature-item">
            <i class="el-icon-check feature-icon"></i>
            <span>通过高智能算法,实现超低查重率和AI检测率</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-check feature-icon"></i>
            <span>保持原文核心观点,提升表达的学术性</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-check feature-icon"></i>
            <span>一次处理即可达到发表标准,无需多次修改</span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showCaseDialog = false"
          >我知道了</el-button
        >
      </div>
    </el-dialog>

    <!-- 主页面内容 -->
    <div class="main-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-content">
          <i class="el-icon-loading"></i>
          <p>加载中...</p>
        </div>
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
                  <span class="price">{{ product.price }}元 </span>
                  <i style="margin: 0 4px; margin-left: 5px">/</i>
                  <span class="unit"> {{ product.unit }}字</span>
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
              <p style="font-size: 16px; color: #1f2937">
                <span style="margin-right: 8px">文本语言</span>
                <span
                  style="font-size: 14px; margin-right: 12px; color: #6b7280"
                  >请选择需要处理的文本语言</span
                >
              </p>
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
            <div class="selection-label">
              <i class="el-icon-guide"></i>
              <p style="font-size: 16px; color: #1f2937">
                <span style="margin-right: 8px">输入方式</span>
                <span
                  style="font-size: 14px; margin-right: 12px; color: #6b7280"
                  >请选择需要处理的输入方式</span
                >
              </p>
            </div>
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
                文件上传 (请上传需要处理的段落)
              </div>
            </div>
          </div>

          <!-- 服务标题和余额 -->
          <div class="service-header">
            <h3>{{ currentProduct?.product_name || "降重复率" }}</h3>
            <span class="balance">(余额: {{ userBalance }}元)</span>

            <div v-if="activeTab === 'combinedplus'">
              <el-button
                type="primary"
                icon="el-icon-view"
                style="margin-left: 20px"
                @click="showCaseDialog = true"
                >查看处理案例</el-button
              >
            </div>
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
              </div>

              <!-- 文件上传模式 -->
              <div v-else class="file-upload-container">
                <!-- 隐藏的文件输入框 - 移到外层，确保始终存在 -->
                <input
                  ref="fileInput"
                  type="file"
                  style="display: none"
                  accept=".docx,.txt"
                  @change="handleFileSelect"
                />

                <!-- 未选择文件状态 -->
                <div v-if="!showFileInput" class="upload-placeholder">
                  <i
                    style="font-size: 40px; color: #c0c4cc; margin-bottom: 16px"
                    class="el-icon-document"
                  ></i>
                  <div class="el-upload__text">点击或拖拽文件到此区域上传</div>
                  <div class="el-upload__tip">
                    支持DOCX、txt格式的文件，DOC文件请先在Word中转换为DOCX，最大
                    20MB
                  </div>
                  <div style="margin-top: 16px">
                    <el-button type="primary" @click="triggerFileSelect"
                      >选择文件</el-button
                    >
                  </div>
                </div>

                <!-- 已选择文件状态 -->
                <div v-else class="file-selected-container">
                  <div class="file-info">
                    <i class="el-icon-check file-check-icon"></i>
                    <span class="file-name">{{ selectedFile?.name }}</span>
                    <el-button
                      type="danger"
                      size="mini"
                      class="delete-btn"
                      @click="deleteFile"
                    >
                      删除
                    </el-button>
                  </div>
                  <div class="file-actions">
                    <el-button type="primary" @click="triggerFileSelect"
                      >重新选择</el-button
                    >
                  </div>
                </div>
              </div>
              <div class="upload-footer">
                <div class="char-count">
                  {{ uploadedText.length }}/10000 字符
                </div>
                <div class="action-buttons">
                  <el-button @click="resetInput">重置</el-button>
                  <el-button
                    type="primary"
                    :disabled="isGenerateDisabled"
                    @click="generateText"
                  >
                    一键生成
                  </el-button>
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
                  <el-button @click="copyResult" icon="el-icon-copy-document"
                    >复制结果</el-button
                  >
                  <el-button @click="downloadDocx" icon="el-icon-download"
                    >下载DOCX</el-button
                  >
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
      showCaseDialog: false, // 处理案例展示弹窗
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
      selectedFile: null, // 选中的文件
      showFileInput: false, // 是否显示文件选择状态
    };
  },
  computed: {
    currentProduct() {
      return this.products.find((p) => p.product === this.activeTab);
    },

    // 判断是否有输入内容
    hasInputContent() {
      if (this.inputMethod === "text") {
        return this.inputText.trim().length > 0;
      } else if (this.inputMethod === "file") {
        return this.selectedFile !== null && this.uploadedText.length > 0;
      }
      return false;
    },

    // 判断生成按钮是否禁用
    isGenerateDisabled() {
      return !this.hasInputContent;
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

    // 触发文件选择
    triggerFileSelect() {
      if (this.$refs.fileInput) {
        this.$refs.fileInput.click();
      } else {
        console.error("文件输入框引用不存在");
        this.$message.error("文件选择功能暂时不可用");
      }
    },

    // 处理文件选择
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        // 验证文件类型 - 更严格的验证
        const validExtensions = [".docx", ".txt"];
        const isValidExtension = validExtensions.some((ext) =>
          file.name.toLowerCase().endsWith(ext)
        );

        const isValidMimeType =
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "text/plain" ||
          file.type === "application/msword"; // 兼容旧版Word格式

        if (!isValidExtension && !isValidMimeType) {
          this.$message.error("只能选择 DOCX 或 TXT 格式的文件!");
          // 清空文件输入框
          event.target.value = "";
          return;
        }

        // 验证文件大小
        const isLt20M = file.size / 1024 / 1024 < 20;
        if (!isLt20M) {
          this.$message.error("文件大小不能超过 20MB!");
          // 清空文件输入框
          event.target.value = "";
          return;
        }

        // 更新文件信息
        this.selectedFile = file;
        this.showFileInput = true;
        this.$message.success("文件选择成功");

        // 这里可以添加文件内容读取逻辑
        this.readFileContent(file);
      }
    },

    // 读取文件内容
    readFileContent(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        this.uploadedText = content;
        console.log("文件内容已读取:", content.length, "字符");
      };
      reader.onerror = () => {
        this.$message.error("文件读取失败");
      };
      reader.readAsText(file, "UTF-8");
    },

    // 删除文件
    deleteFile() {
      this.selectedFile = null;
      this.showFileInput = false;
      this.uploadedText = "";
      // 清空文件输入框
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
