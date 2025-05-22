<template>
  <div class="container">
    <!-- 左右布局 -->
    <div v-loading="loading" class="layout">
      <!-- 右侧上传区域 -->
      <el-card class="upload-section">
        <div slot="header" class="file-list-header">
          <span>文件上传</span>
        </div>
        <el-upload
          ref="upload"
          class="upload-demo"
          drag
          action=""
          :show-file-list="true"
          :http-request="handleUpload"
          :before-upload="beforeUpload"
          :file-list="fileList"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            <p>
              将文件拖到此处，或<em style="font-weight: bold; color: #0066ff"
                >点击上传</em
              >
            </p>
            <p style="margin-top: 10px">
              仅支持上传
              <i style="color: #0066ff; font-weight: bold">docx </i>
              文件, 大小不超过
              <i style="color: #0066ff; font-weight: bold">10M</i>
            </p>
          </div>

          <div class="el-upload__tip" slot="tip">
            省钱小妙招：只需要上传重复率超标的片段即可哦～
          </div>
        </el-upload>

        <div
          style="
            margin-top: 10px;
            display: flex;
            align-items: center;
            flex-direction: column;
          "
        >
          <el-radio-group v-model="reduce_aigc_type">
            <div style="display: flex">
              <div class="leftRadio">
                <div class="radioItem">
                  <b>降知网AIGC</b>（AIGC率超20%包退）：
                  <el-radio label="kns">预计12小时，不含检测报告</el-radio>
                </div>
                <div class="radioItem">
                  <b> 降维普AIGC率</b>（AIGC率超20%包退）：
                  <el-radio label="weipu">预计12小时，不含检测报告</el-radio>
                </div>
                <div class="radioItem">
                  <b>降格子达AIGC率</b>（AIGC率超20%包退）：
                  <el-radio label="gezida">预计12小时，不含检测报告</el-radio>
                </div>
              </div>
              <div class="rightRadio" style="padding-left: 20px">
                <div class="radioItem">
                  <el-radio label="kns_urgent"
                    >加急, 预计30分钟，不含检测报告</el-radio
                  >
                </div>
                <div class="radioItem">
                  <el-radio label="weipu_urgent"
                    >加急, 预计30分钟，不含检测报告</el-radio
                  >
                </div>
                <div class="radioItem">
                  <el-radio label="gezida_urgent"
                    >加急, 预计30分钟，不含检测报告</el-radio
                  >
                </div>
              </div>
            </div>
          </el-radio-group>
          <p style="margin-top: 20px; font-size: 12px; color: #909399">
            温馨提示: 凌晨0:00 - 8:00 客服未在线, 不能及时处理加急的文件!
          </p>
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              margin-top: 20px;
              width: 100%;
            "
          >
            <div @click="sentPayAi" class="reduceBtn2 g_poin">
              <p>开始降重</p>
            </div>
          </div>
        </div>
      </el-card>

      <el-dialog
        title="支付成功"
        :visible.sync="showPaperDialog2Status"
        width="30%"
      >
        <div>
          <el-result icon="success" title="成功提示" subTitle="您已成功付款">
            <template slot="extra">
              订单详情及查重后文件, 在右上角
              <span style="color: #0066ff; font-weight: bold"> 我的订单 </span>
              <p style="margin-top: 10px">查看支付记录及下载查重文件!</p>
            </template>
          </el-result>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="showPaperDialog2Status = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>

    <!-- 去支付按钮 -->
    <!-- <div class="pay-button-container">
      <el-button @click="payReduce" type="primary" style="width: 100%">
        一键降AIGC
      </el-button>
    </div> -->
  </div>
</template>

<script>
import eventBus from "@/utils/eventBus";

import {
  once_aigc_order,
  reduce_aigc_pay,
  remove_reduce_file,
} from "@/api/paper";
import Progress from "@/components/progressonly.vue";

export default {
  name: "demo",
  data() {
    return {
      fileList: [],
      loading: false,
      reduceKey: "",
      showPaperDialog2Status: false,
      totalChars: 0,
      reduce_aigc_type: "kns",
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
        reduce_key: "",
        total_files: 2,
        word_count: 21230,
      },
    };
  },
  created() {
    eventBus.on("showEmitReduceDialog2", this.showPaperDialog2); // 订阅事件
  },
  beforeDestroy() {
    eventBus.off("showEmitReduceDialog2", this.showPaperDialog2); // 订阅事件
  },
  methods: {
    showPaperDialog2(data) {
      this.showPaperDialog2Status = true;
      this.fileList = [];
      // this.requestKey = data.requestKey;
      // this.payStatusPro = new Date().getTime();
      // this.$log("this.requestForm,支付成功打开页面时22", this.requestForm);
      // if (data.paperPercent && data.paperPercent > 0) {
      //   this.paperPercent = data.paperPercent;
      // }
    },
    removeFile(file) {
      // 删除文件的逻辑
      console.log("remove-file", file);
      console.log("remove-file", this.reduceKey);
      let data = {
        file_name: file.file_name,
        reduce_key: this.reduceKey,
      };
      remove_reduce_file(data).then((res) => {
        // 重新赋值 fileList
        this.fileList = this.fileList.filter(
          (file2) => file2.index !== file.index
        );

        this.$message({
          type: "success",
          message: "删除文件成功！",
        });
      });
    },

    beforeUpload(file) {
      const isDocxOrTxt =
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      if (!isDocxOrTxt) {
        this.$message.error("上传文件暂只支持 docx / doc 文件.");
      }
      return isDocxOrTxt;
    },
    sentPayAi() {
      let data = new FormData();
      data.append("reduce_aigc_type", this.reduce_aigc_type);
      data.append("payment_method", "alipay");
      data.append("files", this.fileList[0]);
      once_aigc_order(data).then((res) => {
        console.log(res, res, "sres");
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
        });
      });
    },
    async handleUpload({ file, onProgress, onSuccess, onError }) {
      console.log("fiel", file);
      // this.fileList = [file];
      this.fileList = [];
      // this.fileList = [];
      this.fileList.push(file);
      // const formData = new FormData();
      // formData.append("files", file);
      // if (this.reduceKey) {
      //   formData.append("reduce_key", this.reduceKey);
      // }
      // this.loading = true;
      // try {
      //   upload_reduce_file(formData)
      //     .then((res) => {
      //       console.log("res", res);
      //       if (res.code === 200) {
      //         //       this.fileList = this.resdata.file_list;
      //         // this.totalChars = this.resdata.word_count;
      //         // this.reduceKey = this.resdata.reduce_key;
      //         this.fileList = res.result.file_list;
      //         this.reduceKey = res.result.reduce_key;
      //         this.totalChars = res.result.word_count;
      //         this.loading = false;
      //       } else {
      //         this.loading = false;
      //         onError();
      //       }
      //     })
      //     .catch(() => {
      //       this.loading = false;
      //     });
      // } catch (error) {
      //   console.error("Upload error:", error);
      //   this.$message.error("上传出错，请检查网络或联系管理员");
      //   this.loading = false;
      //   onError(error);
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
/* 整体容器 */
.container {
  margin-top: -20px;
  padding: 20px;
  padding-bottom: 50px;
  background: linear-gradient(
    135deg,
    #ffffff 0%,
    #00bfff33 50%,
    #6236ff33 82%,
    #b620e033 100%
  ) !important;
}

/* 布局样式 */
.layout {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
}

/* 左侧文件列表样式 */
.file-list-card {
  flex: 1;
  position: relative;
  margin-top: 20px;
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
::v-deep .el-upload-dragger {
  height: 180px !important;
  width: 100%;
  padding-top: 0px !important;
}
.radioItem {
  margin-top: 15px;
  display: flex;
  font-size: 13px;
  align-items: center;
}
.reduceBtn2 {
  width: 49%;
  height: 44px;
  background: #3355ff;
  border-radius: 24px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #ffffff;
  margin-bottom: 10px;
}
</style>
