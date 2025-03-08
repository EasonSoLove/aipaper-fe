<template>
  <div
    style="
      background-color: #fff;
      margin-top: -20px;
      padding-left: 20px;
      padding-bottom: 50px;
      padding-top: 50px;
    "
  >
    <!-- 页面名称 -->

    <h2>文件上传与解析</h2>
    <el-upload
      ref="upload"
      action=""
      :http-request="handleUpload"
      :before-upload="beforeUpload"
      multiple
      list-type="text"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">仅支持上传.docx文件</div>
    </el-upload>
    <div v-if="fileList.length">
      <h3>上传文件列表：</h3>
      <ul>
        <li v-for="(file, index) in fileList" :key="index">
          {{ file.file_name }} - 字符数: {{ file.file_chars }}
        </li>
      </ul>
      <p>总字符数: {{ totalChars }}</p>
      <p>Reduce Key: {{ reduceKey }}</p>
    </div>

    <div>
      <el-button @click="payReduce">去支付</el-button>
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
      reduceKey: "",
      totalChars: 0,
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
    payReduce() {
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
          } else {
            onError();
          }
        });
      } catch (error) {
        console.error("Upload error:", error);
        this.$message.error("上传出错，请检查网络或联系管理员");
        onError(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
h2 {
  margin-bottom: 20px;
}
.el-upload__tip {
  color: #666;
}
</style>
