<template>
  <div>
    <!-- 重要提示弹窗 -->
    <el-dialog
      :visible.sync="showWarningDialog"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      custom-class="warning-dialog"
    >
      <div class="warning-dialog-content">
        <!-- 自定义标题栏 -->
        <div class="warning-header">
          <h3 class="warning-title">重要提示</h3>
          <button class="close-btn" @click="closeWarningDialog">
            <i class="el-icon-close"></i>
          </button>
        </div>

        <!-- 内容区域 -->
        <div class="warning-body">
          <!-- 请注意部分 -->
          <div class="notice-section">
            <div class="notice-icon">
              <i class="el-icon-info"></i>
            </div>
            <span class="notice-text">请注意：</span>
          </div>

          <!-- 提示点列表 -->
          <div class="warning-points">
            <div class="warning-point">
              <div class="point-icon">
                <i class="el-icon-check"></i>
              </div>
              <span class="point-text"
                >不同平台的AI检测算法各不相同，检测结果之间没有参考价值</span
              >
            </div>

            <div class="warning-point">
              <div class="point-icon">
                <i class="el-icon-check"></i>
              </div>
              <span class="point-text">
                知网维普格子达查重100%一次过。
                <span class="highlight-text">30万单0失败</span>
              </span>
            </div>

            <div class="warning-point">
              <div class="point-icon">
                <i class="el-icon-check"></i>
              </div>
              <span class="point-text"
                >paperpass的AI查重逻辑和主流的付费的AI查重如知网维普格子达都不一样，如果选了知网维普的话通过不了paperpass</span
              >
            </div>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="warning-footer">
          <el-button class="confirm-btn" @click="closeWarningDialog">
            我知道了
          </el-button>
        </div>
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

    <!-- 充值弹窗组件 -->
    <RechargeDialog
      :visible.sync="showRechargeDialog"
      @recharge-success="handleRechargeSuccess"
    />

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
              <i class="el-icon-s-platform"></i>
              <p style="font-size: 16px; color: #1f2937">
                <span style="margin-right: 8px">检测平台</span>
                <span
                  style="font-size: 14px; margin-right: 12px; color: #6b7280"
                  >请选择需要适配的查重平台</span
                >
              </p>
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
            <el-button
              type="primary"
              size="mini"
              style="margin-left: 20px"
              icon="el-icon-wallet"
              @click="recharge"
              >充值金额</el-button
            >

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
                  accept=".docx"
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
                    仅支持DOCX格式的文件，最大20MB
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
                <div
                  class="char-count"
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                  "
                >
                  {{ displayChars || uploadedText.length }}/10000 字符

                  <p
                    style="margin-left: 10px; color: #3355ff; font-weight: bold"
                    v-if="predictPrice !== null"
                  >
                    <span> 预估价格: {{ predictPrice }}元 </span>
                  </p>
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
              <div
                class="output-container"
                v-loading="isGenerating"
                element-loading-text="正在生成中，请稍候..."
              >
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
import {
  getAigcProducts,
  predictPrice,
  reduceText,
  getReduceResult,
} from "@/api/paper";
import RechargeDialog from "./components/RechargeDialog.vue";

export default {
  name: "NewReduce",
  components: {
    RechargeDialog,
  },
  data() {
    return {
      showWarningDialog: false, // 初始为false，在mounted中根据sessionStorage决定
      showCaseDialog: false, // 处理案例展示弹窗
      showRechargeDialog: false, // 充值弹窗
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
      predictPrice: null, // 预估价格
      totalChars: 0, // 总字符数
      displayChars: 0, // 显示的字符数（从接口获取）
      priceLoading: false, // 价格预估加载状态
      predictPriceTimer: null, // 防抖定时器
      isGenerating: false, // 是否正在生成中
      pollingTimer: null, // 轮询定时器
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
    this.getUserBalance();
    this.checkWarningDialog();
  },
  beforeDestroy() {
    // 清理防抖定时器
    if (this.predictPriceTimer) {
      clearTimeout(this.predictPriceTimer);
    }
    // 清理轮询定时器
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
    }
  },
  methods: {
    // 检查是否需要显示警告弹窗
    checkWarningDialog() {
      const hasSeenWarning = sessionStorage.getItem("hasSeenImportantWarning");
      if (!hasSeenWarning) {
        this.showWarningDialog = true;
      }
    },

    // 关闭警告弹窗
    closeWarningDialog() {
      this.showWarningDialog = false;
      // 设置sessionStorage标记，表示已经看过重要提示
      sessionStorage.setItem("hasSeenImportantWarning", "true");
    },

    // 打开充值弹窗
    recharge() {
      this.showRechargeDialog = true;
    },

    // 处理充值成功
    handleRechargeSuccess(data) {
      console.log("充值成功:", data);
      this.$message.success(`充值成功！已到账 ${data.amount} 元`);
      // 刷新用户余额
      this.getUserBalance();
    },

    // 获取用户余额
    async getUserBalance() {
      try {
        const { default: request } = await import("@/utils/request");
        const baseUrl = process.env.VUE_APP_BASE_API;

        const response = await request({
          url: baseUrl + "/api/ai-paper/aigc/balance",
          method: "get",
        });

        if (response.code === 200) {
          this.userBalance = response.result.balance;
        }
      } catch (error) {
        console.error("获取用户余额失败:", error);
      }
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
      // 切换产品时也触发价格预估
      this.debouncePredictPrice();
    },

    // 获取产品图标
    getProductIcon(productType) {
      const iconMap = {
        deduplication: "el-icon-document",
        aigc: "el-icon-reading",
        combined: "el-icon-coin",
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
      // 防抖调用价格预估
      this.debouncePredictPrice();
    },

    // 重置输入
    resetInput() {
      this.inputText = "";
      this.uploadedText = "";
      this.generatedText = "";
      this.predictPrice = null;
      this.totalChars = 0;
      this.displayChars = 0;
      // 清除防抖定时器
      if (this.predictPriceTimer) {
        clearTimeout(this.predictPriceTimer);
        this.predictPriceTimer = null;
      }
    },

    // 生成文本
    async generateText() {
      // 检查是否有预估价格
      if (this.predictPrice === null) {
        this.$message.warning("请先获取预估价格");
        return;
      }

      // 检查余额是否充足
      const userBalance = parseFloat(this.userBalance);
      const predictPrice = parseFloat(this.predictPrice);

      if (userBalance < predictPrice) {
        // 余额不足，弹出充值弹窗
        this.showRechargeDialog = true;
        return;
      }

      // 余额充足，弹出确认弹窗
      const confirmMessage = `您输入的字符数是${this.displayChars}，预估价格是${this.predictPrice}元，是否确认？`;

      try {
        await this.$confirm(confirmMessage, "确认生成", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
          lockScroll: false,
        });

        // 用户确认后，开始生成
        await this.startGenerate();
      } catch (error) {
        // 用户取消
        console.log("用户取消生成");
      }
    },

    // 开始生成
    async startGenerate() {
      try {
        this.isGenerating = true;
        this.generatedText = "";

        // 构建请求参数
        const formData = new FormData();
        formData.append("product", this.activeTab);
        formData.append("language", this.selectedLanguage);
        formData.append("input_type", this.inputMethod);

        // 添加检测平台（如果有）
        if (this.selectedPlatform) {
          formData.append("platform", this.selectedPlatform);
        }

        if (this.inputMethod === "text") {
          formData.append("input_text", this.inputText);
        } else if (this.inputMethod === "file") {
          formData.append("file", this.selectedFile);
        }

        // 调用降重接口
        const response = await reduceText(formData);

        if (response.code === 200) {
          const taskId = response.result.task_id;
          // 开始轮询查询结果
          this.startPolling(taskId);
        } else {
          this.$message.error("生成失败：" + response.message);
          this.isGenerating = false;
        }
      } catch (error) {
        console.error("生成失败:", error);
        this.$message.error("生成失败，请稍后重试");
        this.isGenerating = false;
      }
    },

    // 开始轮询查询结果
    startPolling(taskId) {
      this.pollingTimer = setInterval(async () => {
        try {
          const response = await getReduceResult({ task_id: taskId });

          if (response.code === 200) {
            const { task_status, result_text } = response.result;

            if (task_status === 1) {
              // 完成
              this.generatedText = result_text;
              this.isGenerating = false;
              clearInterval(this.pollingTimer);
              this.$message.success("生成完成");
              // 刷新用户余额
              this.getUserBalance();
            } else if (task_status === 2) {
              // 失败
              this.isGenerating = false;
              clearInterval(this.pollingTimer);
              this.$message.error("降重失败，请稍后重试");
              // 刷新用户余额
              this.getUserBalance();
            }
            // task_status === 0 继续轮询
          }
        } catch (error) {
          console.error("查询结果失败:", error);
          this.isGenerating = false;
          clearInterval(this.pollingTimer);
          this.$message.error("查询结果失败");
          // 刷新用户余额
          this.getUserBalance();
        }
      }, 2000); // 每2秒轮询一次
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
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      const isLt20M = file.size / 1024 / 1024 < 20;

      if (!isValidType) {
        this.$message.error("只能上传 DOCX 格式的文件!");
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
        // 验证文件类型 - 仅支持DOCX格式
        const validExtensions = [".docx"];
        const isValidExtension = validExtensions.some((ext) =>
          file.name.toLowerCase().endsWith(ext)
        );

        const isValidMimeType =
          file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

        if (!isValidExtension && !isValidMimeType) {
          this.$message.error("只能选择 DOCX 格式的文件!");
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
        // 文件读取完成后调用价格预估
        this.debouncePredictPrice();
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
      // 重置价格预估
      this.predictPrice = null;
      this.totalChars = 0;
      this.displayChars = 0;
    },

    // 防抖调用价格预估
    debouncePredictPrice() {
      // 清除之前的定时器
      if (this.predictPriceTimer) {
        clearTimeout(this.predictPriceTimer);
      }

      // 检查是否有输入内容
      let hasContent = false;
      if (this.inputMethod === "text") {
        hasContent = this.inputText.trim().length > 0;
      } else if (this.inputMethod === "file") {
        hasContent =
          this.selectedFile !== null && this.uploadedText.trim().length > 0;
      }

      // 如果没有内容，重置价格预估
      if (!hasContent) {
        this.predictPrice = null;
        this.totalChars = 0;
        this.displayChars = 0;
        return;
      }

      // 设置新的定时器，1000ms后调用价格预估
      this.predictPriceTimer = setTimeout(() => {
        this.getPredictPrice();
      }, 1000);
    },

    // 获取预估价格
    async getPredictPrice() {
      // 检查是否有必要的数据
      if (!this.activeTab || !this.inputMethod) {
        return;
      }

      let inputText = "";
      let file = null;

      if (this.inputMethod === "text") {
        inputText = this.inputText.trim();
        if (!inputText) {
          this.predictPrice = null;
          this.totalChars = 0;
          return;
        }
      } else if (this.inputMethod === "file") {
        if (!this.selectedFile || !this.uploadedText.trim()) {
          this.predictPrice = null;
          this.totalChars = 0;
          return;
        }
        file = this.selectedFile;
      }

      // 构建form-data
      const formData = new FormData();
      formData.append("product", this.activeTab);
      formData.append("language", this.selectedLanguage);
      formData.append("input_type", this.inputMethod);

      if (this.inputMethod === "text") {
        formData.append("input_text", inputText);
      } else if (this.inputMethod === "file") {
        formData.append("file", file);
      }

      try {
        this.priceLoading = true;
        const response = await predictPrice(formData);

        if (response.code === 200) {
          // 检查字数是否超过限制
          if (response.result.total_chars > 10000) {
            // 字数超限，清空文件并提示用户
            this.deleteFile();
            this.$message.error("文件字数大于10000字，暂不支持");
            return;
          }

          this.predictPrice = response.result.predict_price;
          this.totalChars = response.result.total_chars;
          this.displayChars = response.result.total_chars;
        } else if (response.code === 30011) {
          // 文件格式不支持，清空文件并提示用户
          this.deleteFile();
          this.$message.error("上传文件仅支持docx格式！");
        } else {
          console.error("获取预估价格失败:", response.message);
          this.predictPrice = null;
          this.totalChars = 0;
          this.displayChars = 0;
        }
      } catch (error) {
        console.error("获取预估价格失败:", error);
        this.predictPrice = null;
        this.totalChars = 0;
        this.displayChars = 0;
      } finally {
        this.priceLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
