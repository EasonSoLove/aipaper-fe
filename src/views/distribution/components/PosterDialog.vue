<template>
  <el-dialog
    title="选择海报样式"
    :visible.sync="visible"
    width="1000px"
    :before-close="handleClose"
    custom-class="poster-dialog"
  >
    <div class="poster-container">
      <div class="poster-column">
        <div
          class="poster-bg"
          :style="{ backgroundImage: `url(${bg1})` }"
          ref="poster1"
        >
          <div class="qr-code-container">
            <div id="qr-code-1" class="qr-code"></div>
          </div>
        </div>

        <el-button type="primary" @click="downloadPoster(1)"
          >下载海报</el-button
        >
      </div>
      <div class="poster-column">
        <div
          class="poster-bg"
          :style="{ backgroundImage: `url(${bg2})` }"
          ref="poster2"
        >
          <div class="qr-code-container">
            <div id="qr-code-2" class="qr-code"></div>
          </div>
        </div>
        <el-button type="primary" @click="downloadPoster(2)"
          >下载海报</el-button
        >
      </div>
      <div class="poster-column">
        <div
          class="poster-bg"
          :style="{ backgroundImage: `url(${bg3})` }"
          ref="poster3"
        >
          <div class="qr-code-container">
            <div id="qr-code-3" class="qr-code"></div>
          </div>
        </div>
        <el-button type="primary" @click="downloadPoster(3)"
          >下载海报</el-button
        >
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import bg1 from "@/assets/images/distribution/bg1.png";
import bg2 from "@/assets/images/distribution/bg2.png";
import bg3 from "@/assets/images/distribution/bg3.png";
import QRCode from "qrcode";
import html2canvas from "html2canvas";

export default {
  name: "PosterDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    inviteUrl: {
      type: String,
      default: "https://mixpaper.cn/",
    },
  },
  data() {
    return {
      bg1,
      bg2,
      bg3,
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.generateQRCodes();
        });
      }
    },
  },
  methods: {
    handleClose() {
      this.$emit("update:visible", false);
    },

    async generateQRCodes() {
      try {
        console.log("生成二维码:", this.inviteUrl);

        // 为每个二维码容器生成真实二维码
        for (let i = 1; i <= 3; i++) {
          const qrContainer = document.getElementById(`qr-code-${i}`);
          if (qrContainer) {
            // 生成二维码数据URL
            const qrDataUrl = await QRCode.toDataURL(this.inviteUrl, {
              width: 60,
              height: 60,
              margin: 2,
              color: {
                dark: "#000000",
                light: "#FFFFFF",
              },
            });

            // 创建二维码图片元素
            const qrImage = document.createElement("img");
            qrImage.src = qrDataUrl;
            qrImage.style.width = "60px";
            qrImage.style.height = "60px";
            qrImage.style.borderRadius = "8px";

            // 清空容器并添加二维码图片
            qrContainer.innerHTML = "";
            qrContainer.appendChild(qrImage);
          }
        }
      } catch (error) {
        console.error("生成二维码失败:", error);
        // 如果生成失败，显示占位符
        for (let i = 1; i <= 3; i++) {
          const qrContainer = document.getElementById(`qr-code-${i}`);
          if (qrContainer) {
            qrContainer.innerHTML = `<div style="width: 60px; height: 60px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #666;">二维码${i}</div>`;
          }
        }
      }
    },

    async downloadPoster(index) {
      try {
        this.$message.info("正在生成海报图片...");

        const posterElement = this.$refs[`poster${index}`];
        if (!posterElement) {
          this.$message.error("海报元素未找到");
          return;
        }

        // 临时设置海报元素尺寸为下载尺寸
        const originalStyle = posterElement.style.cssText;
        posterElement.style.width = "300px";
        posterElement.style.height = "533px";
        posterElement.style.borderRadius = "0";
        posterElement.style.boxShadow = "none";

        // 使用 html2canvas 将海报转换为图片
        const canvas = await html2canvas(posterElement, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          scale: 1, // 使用1倍缩放，因为已经设置了实际尺寸
          width: 300,
          height: 533,
        });

        // 恢复原始样式
        posterElement.style.cssText = originalStyle;

        // 创建下载链接
        const link = document.createElement("a");
        link.download = `poster-${index}-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");

        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.$message.success("海报下载成功！");
      } catch (error) {
        console.error("下载海报失败:", error);
        this.$message.error("下载海报失败，请重试");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* 海报弹窗样式 */
.poster-dialog {
  .el-dialog__body {
    padding: 20px;
  }
}

.poster-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.poster-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.poster-bg {
  width: 300px;
  height: 533px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
  overflow: hidden; // 确保内容不溢出

  &:hover {
    transform: scale(1.02);
  }
}

.qr-code-container {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 10;
}

.qr-code {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
