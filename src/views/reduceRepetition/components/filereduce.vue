<template>
  <div class="container">
    <!-- 左右布局 -->
    <div v-loading="loading" class="layout">
      <!-- 右侧上传区域 -->
      <el-card class="upload-section">
        <div slot="header" class="file-list-header">
          <span>文件上传与解析</span>
        </div>
        <el-upload
          ref="upload"
          class="upload-demo"
          drag
          action=""
          :show-file-list="false"
          :http-request="handleUpload"
          :before-upload="beforeUpload"
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">
            <span style="font-weight: bold; font-size: 14px"> 温馨提示: </span>
          </div>
          <div class="el-upload__tip" slot="tip">可上传多个文件</div>
          <div class="el-upload__tip" slot="tip">
            限制总降重为:
            <i style="color: #0066ff; font-weight: bold">30000</i> 字
          </div>
          <div class="el-upload__tip" slot="tip">
            仅支持上传
            <i style="color: #0066ff; font-weight: bold">.docx</i>
            文件
          </div>
        </el-upload>
      </el-card>
      <!-- 左侧文件列表 -->
      <el-card class="box-card file-list-card">
        <div slot="header" class="file-list-header">
          <span>已上传文件列表</span>
        </div>
        <!-- 文件列表 -->
        <ul v-if="fileList.length" class="file-list">
          <li
            v-for="(file, index) in fileList"
            :key="index"
            class="file-item"
            @mouseover="hoverIndex = index"
            @mouseleave="hoverIndex = null"
          >
            <div class="file-content">
              <div class="file-info">
                <span class="file-name">{{ file.file_name }}</span>
                <span class="file-chars">字符数: {{ file.file_chars }}</span>
              </div>
              <button class="delete-button" @click="removeFile(index)">
                删除
                <!-- v-if="hoverIndex === index" -->
              </button>
            </div>
          </li>
        </ul>
        <!-- 空状态 -->
        <div v-else>
          <el-empty description="无上传文件"></el-empty>
        </div>
        <!-- 总字符数固定在底部 -->
        <div class="file-summary">
          <p>总字符数: {{ totalChars }}</p>
        </div>
      </el-card>
    </div>

    <!-- 去支付按钮 -->
    <div class="pay-button-container">
      <el-button
        @click="payReduce"
        :disabled="fileList.length === 0"
        type="primary"
        style="width: 100%"
      >
        去支付
      </el-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { upload_reduce_file, reduce_aigc_pay } from "@/api/paper";
import eventBus from "@/utils/eventBus";
import Progress from "@/components/progressonly.vue";

export default {
  name: "demo",
  data() {
    return {
      fileList: [],
      loading: false,
      reduceKey: "",
      totalChars: 0,
      hoverIndex: null, // 当前鼠标悬浮的索引
      resdata: {
        file_list: [
          {
            index: 1,
            file_name: "歌曲《江城子·乙卯正月二十日夜记梦》的演唱技巧分析.docx",
            file_chars: 15339,
          },
          {
            index: 2,
            file_name:
              "歌曲《江城子·乙卯正月二十日夜记梦》的演唱技巧分析 - 副本.docx",
            file_chars: 5891,
          },
        ],
        reduce_key: "7528f831-b9d1-4097-8906-caa7cee797ae",
        total_files: 2,
        word_count: 21230,
      },
    };
  },
  methods: {
    removeFile(index) {
      // 删除文件的逻辑
      this.$emit("remove-file", index);
    },
    payReduce() {
      if (this.totalChars > 30000) {
        this.$message({
          type: "warning",
          message: "降重最大字数为30000字,请修改部分文件后重试!",
        });
        return false;
      }
      let data = {
        reduce_key: this.reduceKey,
        payment_method: "alipay",
      };

      reduce_aigc_pay(data).then((res) => {
        // let res = {
        //   result: {
        //     reduce_key: "64a450fa-a773-4900-8662-ac21b62df5ca",
        //     payment_method: "alipay",
        //     pay_link:
        //       "https://openapi.alipay.com/gateway.do?app_id=2021004165663603&biz_content=%7B%22out_trade_no%22%3A%2281dbc973-f032-4771-8bcc-c6997768bd9a%22%2C%22product_code%22%3A%22FAST_INSTANT_TRADE_PAY%22%2C%22qr_pay_mode%22%3A4%2C%22subject%22%3A%22%E6%B5%85%E6%80%9D%E7%A7%91%E6%8A%80%22%2C%22total_amount%22%3A0.01%7D&charset=utf-8&format=JSON&method=alipay.trade.page.pay&notify_url=https%3A%2F%2Fapi.mixpaper.cn%2Fapi%2Fai-paper%2Fnotify%2Falipay_dispatch&return_url=https%3A%2F%2Fmixpaper.cn%2F%23%2Fdashboard&sign=OemC44EgAtjHa3ajM5qtt4tABagdAXl%2FZpO3ZEuLQOgtpnAQkE04L86xuOStki2gn9WEsvh9MXua56bDQhOon65nQ%2FAQsdxBiS8hY6%2BA9G50eXM%2FQdvIUbiyf9lCotB%2Bdm3rSjC0s7djnzW4aAz2wriAmTupGpFwyEyjroO2XthaFdze5W%2BhEXP4686Fe9ECQ8N3JsCFg6QlnauinVt1Jo9CxLpzB29eMGfLnALLIYnFwmuw43oqpShySkIn94m898zBXF2Lt8dlFl9YEkGHenBM37Lg2XecQKDdKO6g4XgWgxCaRJnbLlCtf1dKgOO7buvuNpL9jvQThAZa2rXo7g%3D%3D&sign_type=RSA2&timestamp=2025-03-06+14%3A28%3A56&version=1.0",
        //     pay_amount: 32,
        //     original_amount: 64,
        //     discounted_price: 32,
        //     out_trade_no: "81dbc973-f032-4771-8bcc-c6997768bd9a",
        //     word_count: 15339,
        //     is_discount: 2,
        //     order_type: "REDUCE_AIGC",
        //   },
        // };
        let order = {
          out_trade_no: res.result.out_trade_no,
          pay_amount: res.result.pay_amount,
          pay_link: res.result.pay_link,
          original_price: res.result.original_amount,
          pay_type: "PAY_ALL",
          word_count: res.result.word_count,

          payment_method: data.payment_method,
          order_type: res.result.order_type, // 判断是否能切换
          discounted_price: res.result.discounted_price, // 优惠金额
          is_discount: res.result.is_discount, // 优惠金额
        };
        this.$store.dispatch("app/toggleCurrentOrder", order);

        eventBus.emit("showEmitPaypopup", {
          requestKey: res.result.out_trade_no,
          payStatus: 300,
          paperPercent: 0,
        });
      });
    },
    beforeUpload(file) {
      const isDocx =
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      if (!isDocx) {
        this.$message.error("上传文件只能是.docx格式!");
      }
      return isDocx;
    },
    async handleUpload({ file, onProgress, onSuccess, onError }) {
      console.log("fiel", file);
      const formData = new FormData();
      formData.append("files", file);
      if (this.reduceKey) {
        formData.append("reduce_key", this.reduceKey);
      }
      this.loading = true;
      try {
        upload_reduce_file(formData).then((res) => {
          console.log("res", res);
          if (res.code === 200) {
            //       this.fileList = this.resdata.file_list;
            // this.totalChars = this.resdata.word_count;
            // this.reduceKey = this.resdata.reduce_key;
            this.fileList = res.result.file_list;
            this.reduceKey = res.result.reduce_key;
            this.totalChars = res.result.word_count;
            this.loading = false;
          } else {
            this.loading = false;
            onError();
          }
        });
      } catch (error) {
        console.error("Upload error:", error);
        this.$message.error("上传出错，请检查网络或联系管理员");
        onError(error);
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* 整体容器 */
.container {
  background-color: #fff;
  margin-top: -20px;
  padding: 20px;
  padding-bottom: 50px;
}

/* 布局样式 */
.layout {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}

/* 左侧文件列表样式 */
.file-list-card {
  flex: 1;
  margin-left: 20px;
  position: relative;
}

.file-list-header {
  font-size: 16px;
}

/* 文件列表 */
.file-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.file-item {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 5px 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: box-shadow 0.3s ease, background 0.3s ease;
  position: relative;
}

.file-item:hover {
  background: #f0f8ff;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.file-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

/* 文件信息 */
.file-info {
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
}

.file-name {
  font-weight: bold;
  margin-right: 10px;
}

.file-chars {
  color: #666;
}

/* 删除按钮 */
.delete-button {
  background: #ff4d4f;
  border: none;
  color: white;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.delete-button:hover {
  background: #d9363e;
}

/* 文件总字符数固定在底部 */
.file-summary {
  position: fixed;
  bottom: 20px;
  left: 20px;
  font-size: 14px;
  color: #333;
}

.file-summary p {
  margin: 5px 0;
}

/* 右侧上传区域 */
.upload-section {
  flex: 1;
  font-size: 16px; /* 与左侧字体一致 */
}

/* 去支付按钮容器 */
.pay-button-container {
  text-align: center;
  margin-top: 20px;
}
</style>
