<template>
  <el-dialog
    title="选择海报样式"
    :visible.sync="visible"
    width="1000px"
    append-to-body
    :before-close="handleClose"
    custom-class="poster-dialog"
    :lock-scroll="false"
  >
    <div class="poster-container">
      <el-carousel
        :interval="40000"
        type="card"
        height="600px"
        @change="handleCarouselChange"
      >
        <el-carousel-item v-for="(poster, index) in posterList" :key="index">
          <div class="poster-item">
            <div
              class="poster-bg"
              :style="{ backgroundImage: `url(${poster.bg})` }"
              :ref="`poster${index + 1}`"
            >
              <div
                class="qr-code-container"
                :style="{ ...poster.qrPosition, ...poster.qrRotation }"
              >
                <div
                  :id="`qr-code-${index + 1}`"
                  class="qr-code"
                  :style="poster.qrSize"
                ></div>
              </div>
            </div>
            <el-button type="primary" @click="downloadPoster(index + 1)"
              >下载海报</el-button
            >
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import bg1 from "@/assets/images/distribution/bg0.jpg";
import bg2 from "@/assets/images/distribution/bg1.png";
import bg3 from "@/assets/images/distribution/bg2.png";
import bg4 from "@/assets/images/distribution/bg3.png";
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
      posterList: [
        {
          bg: bg1,
          qrPosition: {
            bottom: "109px",
            left: "120px",
          },
          qrRotation: {
            transform: "rotate(26deg)",
          },
          qrSize: {
            width: "63px",
            height: "63px",
          },
        },
        {
          bg: bg2,
          qrPosition: {
            bottom: "23px",
            right: "23px",
          },
          qrRotation: {
            transform: "rotate(0deg)",
          },
          qrSize: {
            width: "60px",
            height: "60px",
          },
        },
        {
          bg: bg3,
          qrPosition: {
            bottom: "45px",
            left: "124px",
          },
          qrRotation: {
            transform: "rotate(0deg)",
          },
          qrSize: {
            width: "53px",
            height: "57px",
          },
        },
        {
          bg: bg4,
          qrPosition: {
            bottom: "26px",
            right: "24px",
          },
          qrRotation: {
            transform: "rotate(0deg)",
          },
          qrSize: {
            width: "40px",
            height: "40px",
          },
        },
      ],
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        // 增加延迟，确保轮播图完全渲染
        this.$nextTick(() => {
          setTimeout(() => {
            this.generateQRCodes();
          }, 500);
        });
      }
    },
  },
  methods: {
    handleClose() {
      this.$emit("update:visible", false);
    },

    handleCarouselChange(index) {
      console.log("轮播图切换到:", index);
      // 轮播图切换时，确保当前显示的二维码已生成
      this.$nextTick(() => {
        this.generateQRCodes();
      });
    },

    async generateQRCodes() {
      try {
        console.log("开始生成二维码:", this.inviteUrl);
        console.log("海报数量:", this.posterList.length);

        // 等待所有轮播项渲染完成
        await this.waitForAllCarouselItems();

        // 为每个二维码容器生成真实二维码
        for (let i = 1; i <= this.posterList.length; i++) {
          const qrContainer = document.getElementById(`qr-code-${i}`);
          console.log(`查找二维码容器 ${i}:`, qrContainer);

          if (qrContainer) {
            // 获取当前海报的二维码尺寸配置
            const poster = this.posterList[i - 1];
            const qrSize = poster.qrSize || { width: "60px", height: "60px" };

            // 提取数值部分用于生成二维码
            const width = parseInt(qrSize.width);
            const height = parseInt(qrSize.height);

            console.log(`生成二维码 ${i}, 尺寸: ${width}x${height}`);

            // 生成二维码数据URL
            const qrDataUrl = await QRCode.toDataURL(this.inviteUrl, {
              width: width,
              height: height,
              margin: 2,
              color: {
                dark: "#000000",
                light: "#FFFFFF",
              },
            });

            // 创建二维码图片元素
            const qrImage = document.createElement("img");
            qrImage.src = qrDataUrl;
            qrImage.style.width = qrSize.width;
            qrImage.style.height = qrSize.height;
            qrImage.style.borderRadius = "8px";

            // 清空容器并添加二维码图片
            qrContainer.innerHTML = "";
            qrContainer.appendChild(qrImage);

            console.log(`二维码 ${i} 生成成功`);
          } else {
            console.warn(`二维码容器 ${i} 未找到`);
            // 如果容器不存在，尝试重新查找
            setTimeout(() => {
              const retryContainer = document.getElementById(`qr-code-${i}`);
              if (retryContainer) {
                this.generateSingleQRCode(i);
              }
            }, 100);
          }
        }

        console.log("所有二维码生成完成");
      } catch (error) {
        console.error("生成二维码失败:", error);
        // 如果生成失败，显示占位符
        for (let i = 1; i <= this.posterList.length; i++) {
          const qrContainer = document.getElementById(`qr-code-${i}`);
          if (qrContainer) {
            const poster = this.posterList[i - 1];
            const qrSize = poster.qrSize || { width: "60px", height: "60px" };
            qrContainer.innerHTML = `<div style="width: ${qrSize.width}; height: ${qrSize.height}; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #666;">二维码${i}</div>`;
          }
        }
      }
    },

    // 等待所有轮播项渲染完成
    async waitForAllCarouselItems() {
      return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 10;

        const checkItems = () => {
          attempts++;
          const allItemsExist = this.posterList.every((_, index) => {
            return document.getElementById(`qr-code-${index + 1}`);
          });

          if (allItemsExist || attempts >= maxAttempts) {
            resolve();
          } else {
            setTimeout(checkItems, 100);
          }
        };

        checkItems();
      });
    },

    // 生成单个二维码
    async generateSingleQRCode(index) {
      try {
        const qrContainer = document.getElementById(`qr-code-${index}`);
        if (!qrContainer) return;

        const poster = this.posterList[index - 1];
        const qrSize = poster.qrSize || { width: "60px", height: "60px" };
        const width = parseInt(qrSize.width);
        const height = parseInt(qrSize.height);

        const qrDataUrl = await QRCode.toDataURL(this.inviteUrl, {
          width: width,
          height: height,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });

        const qrImage = document.createElement("img");
        qrImage.src = qrDataUrl;
        qrImage.style.width = qrSize.width;
        qrImage.style.height = qrSize.height;
        qrImage.style.borderRadius = "8px";

        qrContainer.innerHTML = "";
        qrContainer.appendChild(qrImage);

        console.log(`单个二维码 ${index} 生成成功`);
      } catch (error) {
        console.error(`生成单个二维码 ${index} 失败:`, error);
      }
    },

    async downloadPoster(index) {
      try {
        this.$message.info("正在生成海报图片...");

        // 尝试多种方式查找海报元素
        let posterElement = this.$refs[`poster${index}`];

        // 如果ref方式找不到，尝试通过ID查找
        if (!posterElement) {
          posterElement = document.querySelector(`[ref="poster${index}"]`);
        }

        // 如果还是找不到，尝试通过轮播项查找
        if (!posterElement) {
          const carouselItems = document.querySelectorAll(".el-carousel__item");
          if (carouselItems[index - 1]) {
            posterElement =
              carouselItems[index - 1].querySelector(".poster-bg");
          }
        }

        if (!posterElement) {
          this.$message.error("海报元素未找到");
          console.error("无法找到海报元素，index:", index);
          console.log("所有refs:", this.$refs);
          return;
        }

        // 验证元素是否在DOM中
        if (!document.contains(posterElement)) {
          this.$message.error("海报元素未正确附加到DOM");
          console.error("元素未在DOM中:", posterElement);
          return;
        }

        // 检查元素是否可见
        const computedStyle = window.getComputedStyle(posterElement);
        if (
          computedStyle.display === "none" ||
          computedStyle.visibility === "hidden"
        ) {
          console.warn("海报元素不可见，尝试使其可见");
          // 临时使其可见
          posterElement.style.display = "block";
          posterElement.style.visibility = "visible";
        }

        console.log("找到海报元素:", posterElement);
        console.log("海报元素样式:", posterElement.style);
        console.log("元素是否在DOM中:", document.contains(posterElement));

        // 安全地获取原始样式
        let originalStyle = "";
        if (posterElement.style && posterElement.style.cssText) {
          originalStyle = posterElement.style.cssText;
        } else {
          // 如果没有style属性，创建一个空的style对象
          if (!posterElement.style) {
            posterElement.style = {};
          }
        }

        // 临时设置海报元素尺寸为下载尺寸
        posterElement.style.width = "300px";
        posterElement.style.height = "533px";
        posterElement.style.borderRadius = "0";
        posterElement.style.boxShadow = "none";

        console.log("设置临时样式后:", posterElement.style.cssText);

        // 使用 html2canvas 将海报转换为图片
        console.log("开始使用html2canvas生成图片...");

        // 确保元素在视口中
        posterElement.scrollIntoView({ behavior: "instant", block: "center" });

        // 等待一小段时间确保渲染完成
        await new Promise((resolve) => setTimeout(resolve, 100));

        const canvas = await html2canvas(posterElement, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff", // 设置白色背景
          scale: 2, // 提高分辨率
          width: 300,
          height: 533,
          logging: true, // 启用日志
          foreignObjectRendering: false, // 禁用外部对象渲染
          removeContainer: false, // 不移除容器
          imageTimeout: 5000, // 图片超时时间
        });
        console.log("html2canvas生成完成:", canvas);

        // 恢复原始样式
        if (originalStyle) {
          posterElement.style.cssText = originalStyle;
        } else {
          // 如果没有原始样式，清除临时样式
          posterElement.style.width = "";
          posterElement.style.height = "";
          posterElement.style.borderRadius = "";
          posterElement.style.boxShadow = "";
        }

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

        // 尝试恢复样式（如果可能的话）
        try {
          const posterElement = this.$refs[`poster${index}`];
          if (posterElement && posterElement.style) {
            posterElement.style.width = "";
            posterElement.style.height = "";
            posterElement.style.borderRadius = "";
            posterElement.style.boxShadow = "";
            posterElement.style.display = "";
            posterElement.style.visibility = "";
          }
        } catch (recoveryError) {
          console.error("恢复样式失败:", recoveryError);
        }

        // 尝试备用下载方案
        try {
          console.log("尝试备用下载方案...");
          await this.fallbackDownload(index);
        } catch (fallbackError) {
          console.error("备用下载方案也失败:", fallbackError);
          this.$message.error("下载海报失败，请重试");
        }
      }
    },

    // 备用下载方案
    async fallbackDownload(index) {
      try {
        console.log("使用备用下载方案，index:", index);

        // 获取当前海报的背景图片
        const poster = this.posterList[index - 1];
        if (!poster || !poster.bg) {
          throw new Error("海报配置不存在");
        }

        // 创建一个新的canvas来绘制海报
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 300;
        canvas.height = 533;

        // 创建背景图片
        const bgImage = new Image();
        bgImage.crossOrigin = "anonymous";

        await new Promise((resolve, reject) => {
          bgImage.onload = () => {
            // 绘制背景
            ctx.drawImage(bgImage, 0, 0, 300, 533);

            // 生成二维码并绘制
            this.generateQRCodeForCanvas(ctx, poster, 300, 533)
              .then(() => {
                resolve();
              })
              .catch(reject);
          };
          bgImage.onerror = reject;
          bgImage.src = poster.bg;
        });

        // 创建下载链接
        const link = document.createElement("a");
        link.download = `万象写作海报-${index}-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");

        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.$message.success("海报下载成功！");
      } catch (error) {
        console.error("备用下载方案失败:", error);
        throw error;
      }
    },

    // 为canvas生成二维码
    async generateQRCodeForCanvas(ctx, poster, canvasWidth, canvasHeight) {
      try {
        // 生成二维码数据URL
        const qrDataUrl = await QRCode.toDataURL(this.inviteUrl, {
          width: parseInt(poster.qrSize.width),
          height: parseInt(poster.qrSize.height),
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });

        // 创建二维码图片
        const qrImage = new Image();
        qrImage.crossOrigin = "anonymous";

        await new Promise((resolve, reject) => {
          qrImage.onload = () => {
            // 计算二维码位置
            const qrWidth = parseInt(poster.qrSize.width);
            const qrHeight = parseInt(poster.qrSize.height);

            let x, y;

            // 根据位置配置计算坐标
            if (poster.qrPosition.bottom) {
              y = canvasHeight - parseInt(poster.qrPosition.bottom) - qrHeight;
            } else if (poster.qrPosition.top) {
              y = parseInt(poster.qrPosition.top);
            } else {
              y = canvasHeight - qrHeight - 20; // 默认底部
            }

            if (poster.qrPosition.left) {
              if (poster.qrPosition.left.includes("%")) {
                x =
                  (canvasWidth * parseInt(poster.qrPosition.left)) / 100 -
                  qrWidth / 2;
              } else {
                x = parseInt(poster.qrPosition.left);
              }
            } else if (poster.qrPosition.right) {
              x = canvasWidth - parseInt(poster.qrPosition.right) - qrWidth;
            } else {
              x = 20; // 默认左边
            }

            // 保存当前状态
            ctx.save();

            // 移动到二维码中心
            ctx.translate(x + qrWidth / 2, y + qrHeight / 2);

            // 应用旋转
            if (poster.qrRotation && poster.qrRotation.transform) {
              const rotationMatch =
                poster.qrRotation.transform.match(/rotate\(([^)]+)\)/);
              if (rotationMatch) {
                const angle = parseFloat(rotationMatch[1]);
                ctx.rotate((angle * Math.PI) / 180);
              }
            }

            // 绘制二维码
            ctx.drawImage(
              qrImage,
              -qrWidth / 2,
              -qrHeight / 2,
              qrWidth,
              qrHeight
            );

            // 恢复状态
            ctx.restore();

            resolve();
          };
          qrImage.onerror = reject;
          qrImage.src = qrDataUrl;
        });
      } catch (error) {
        console.error("生成二维码到canvas失败:", error);
        throw error;
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
  width: 100%;
}

.poster-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  height: 100%;
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

/* 各海报二维码位置的自定义CSS类 - 可手动调整 */
.qr-position-1 {
  /* 海报1的二维码位置 */
  bottom: 20px;
  left: 20px;
}

.qr-position-2 {
  /* 海报2的二维码位置 */
  bottom: 30px;
  right: 25px;
}

.qr-position-3 {
  /* 海报3的二维码位置 */
  top: 50px;
  left: 15px;
}

.qr-position-4 {
  /* 海报4的二维码位置 */
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
}

/* 其他常用位置示例 */
.qr-position-center {
  /* 居中位置 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.qr-position-top-left {
  /* 左上角 */
  top: 20px;
  left: 20px;
}

.qr-position-top-right {
  /* 右上角 */
  top: 20px;
  right: 20px;
}

.qr-position-bottom-left {
  /* 左下角 */
  bottom: 20px;
  left: 20px;
}

.qr-position-bottom-right {
  /* 右下角 */
  bottom: 20px;
  right: 20px;
}

.qr-position-bottom-center {
  /* 底部居中 */
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

/* 二维码旋转角度CSS类 - 可手动调整 */
.qr-rotate-0 {
  /* 不旋转 */
  transform: rotate(0deg);
}

.qr-rotate-5 {
  /* 顺时针旋转5度 */
  transform: rotate(5deg);
}

.qr-rotate-10 {
  /* 顺时针旋转10度 */
  transform: rotate(10deg);
}

.qr-rotate-15 {
  /* 顺时针旋转15度 */
  transform: rotate(15deg);
}

.qr-rotate-30 {
  /* 顺时针旋转30度 */
  transform: rotate(30deg);
}

.qr-rotate-45 {
  /* 顺时针旋转45度 */
  transform: rotate(45deg);
}

.qr-rotate-90 {
  /* 顺时针旋转90度 */
  transform: rotate(90deg);
}

.qr-rotate-180 {
  /* 旋转180度 */
  transform: rotate(180deg);
}

.qr-rotate--5 {
  /* 逆时针旋转5度 */
  transform: rotate(-5deg);
}

.qr-rotate--10 {
  /* 逆时针旋转10度 */
  transform: rotate(-10deg);
}

.qr-rotate--15 {
  /* 逆时针旋转15度 */
  transform: rotate(-15deg);
}

.qr-rotate--30 {
  /* 逆时针旋转30度 */
  transform: rotate(-30deg);
}

.qr-rotate--45 {
  /* 逆时针旋转45度 */
  transform: rotate(-45deg);
}

.qr-rotate--90 {
  /* 逆时针旋转90度 */
  transform: rotate(-90deg);
}

/* 二维码尺寸CSS类 - 可手动调整 */
.qr-size-small {
  /* 小尺寸 */
  width: 50px;
  height: 50px;
}

.qr-size-medium {
  /* 中等尺寸 */
  width: 60px;
  height: 60px;
}

.qr-size-large {
  /* 大尺寸 */
  width: 80px;
  height: 80px;
}

.qr-size-xl {
  /* 超大尺寸 */
  width: 100px;
  height: 100px;
}

.qr-size-xxl {
  /* 特大尺寸 */
  width: 120px;
  height: 120px;
}

/* 自定义尺寸示例 */
.qr-size-40 {
  width: 40px;
  height: 40px;
}

.qr-size-45 {
  width: 45px;
  height: 45px;
}

.qr-size-55 {
  width: 55px;
  height: 55px;
}

.qr-size-65 {
  width: 65px;
  height: 65px;
}

.qr-size-70 {
  width: 70px;
  height: 70px;
}

.qr-size-75 {
  width: 75px;
  height: 75px;
}

.qr-size-85 {
  width: 85px;
  height: 85px;
}

.qr-size-90 {
  width: 90px;
  height: 90px;
}

.qr-size-95 {
  width: 95px;
  height: 95px;
}

.qr-size-110 {
  width: 110px;
  height: 110px;
}

.qr-size-130 {
  width: 130px;
  height: 130px;
}

.qr-size-150 {
  width: 150px;
  height: 150px;
}
</style>
