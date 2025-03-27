<template>
  <div>
    <!-- 页面名称 -->
    <div class="pdfShowBox">
      <div class="stickyBox">
        <div class="pdfNavbar">
          <div class="pdfNavLeft">
            <el-tooltip
              class="item"
              effect="dark"
              content="返回第一步,继续创作"
              placement="top"
            >
              <div @click="returnStep" class="pdfLeftBtn g_poin">
                <i class="el-icon-back"></i>
                <p>返回第一步</p>
              </div>
            </el-tooltip>
            <!-- <div class="pdfNavItem">
              <i class="el-icon-edit"></i>
              <span>编辑Word版论文</span>
            </div>
            <div class="pdfNavItem">
              <i class="el-icon-edit"></i>
              <span>编辑Latex版论文</span>
            </div> -->
            <div @click="$jumpUrl('/main/reduceRepetition')" class="pdfNavItem">
              <i class="el-icon-film"></i>
              <span>{{ $t("route.reduceRepetition") }}</span>
            </div>
          </div>

          <div
            @click="downLoadPaper"
            v-loading="downStatus"
            v-if="currentOrder.payment_status == 'TRADE_SUCCESS'"
            class="pdfNavRight g_poin"
          >
            <i class="el-icon-download"></i>
            <p>下载论文</p>
          </div>
        </div>
      </div>
      <button @click="startPolling">开始轮询</button>
      <button @click="stopPolling">停止轮询</button>
      <iframe :src="step3PdfUrl" style="width: 100%; height: 100%"></iframe>
    </div>
    <!-- <div class="pdfBox">
      <PdfViewer :pdfUrl="step3PdfUrl" ref="pdfViewer" />
    </div> -->
    <el-dialog
      title="温馨提示"
      :visible.sync="dialogVisible"
      :width="device == 'mobile' ? '90%' : '30%'"
    >
      <p style="line-height: 24px">
        注意：此为预览版，只展示全文的50%。若满意请支付尾款，解锁全文并支持下载，下载有更多的惊喜哟~
      </p>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
// import { sms } from "@/api/login";
// import webinfo from "@/components/webinfo.vue";
// import eventBus from "@/utils/eventBus";
import PdfViewer from "./PdfViewer.vue";
import { paperPack } from "@/api/user";
import {
  startUniquePaperPolling,
  stopPaperPolling,
} from "@/utils/step3polling";
export default {
  name: "step3",
  data() {
    return {
      // 定义变量
      dialogVisible: false,
      data: "",
      // pdfUrl: require("@/assets/third_output.pdf"),
      pdfUrl: "",
      downStatus: false,
      out_trade_no: "",
    };
  },
  components: {
    PdfViewer,
  },
  computed: {
    // 计算属性
    ...mapGetters(["step3PdfUrl", "currentOrder", "device"]),
  },

  watch: {
    step3PdfUrl(newValue, oldValue) {
      this.dialogVisible = false;

      // 在这里执行你需要的逻辑
      if (this.currentOrder.payment_status == "TRADE_DEPOSIT_SUCCESS") {
        let _this = this;
        this.$nextTick(() => {
          setTimeout(() => {
            _this.dialogVisible = true;
          }, 1000);
        });
      } else {
        let _this = this;
        this.$nextTick(() => {
          setTimeout(() => {
            _this.dialogVisible = false;
          }, 1000);
        });
      }
    },
    pdfUrl: {
      handler(newVal, oldVal) {
        this.pdfUrl = newVal;

        if (this.currentOrder.payment_status == "TRADE_SUCCESS") {
          this.dialogVisible = true;
        } else {
          this.dialogVisible = false;
        }
      },
      deep: true, // 启用深度监听
    },
  },
  mounted() {
    // eventBus.emit("sendOutline", 5); // 发布事件
    // 页面初始化
    console.log("step3初始化");
  },
  created() {
    // eventBus.on("sendOutline", this.addE); // 订阅事件
  },
  beforeDestroy() {
    // eventBus.off("sendOutline", this.addE); // 移除事件监听
  },

  methods: {
    // 启动轮询
    startPolling() {
      const requestData = { id: 123 }; // 请求数据
      startUniquePaperPolling(requestData);
    },
    // 停止轮询
    stopPolling() {
      stopPaperPolling();
    },
    returnStep() {
      this.$store.dispatch("app/setActiveIndex", 0);
    },
    downLoadPaper: _.debounce(function (item) {
      this.downStatus = true;
      zhuge.track(`下载论文`, {
        路径: "step3",
        订单Out_trade_no: this.currentOrder.out_trade_no,
      });
      paperPack({ out_trade_no: this.currentOrder.out_trade_no }).then(
        (res) => {
          this.downStatus = false;
          // window.open(res.result.zip_url, "_blank");
          // Create a temporary link element
          const link = document.createElement("a");
          link.href = res.result.zip_url;
          const regex = /\/([^\/]+)\.zip$/;
          const match = res.result.zip_url.match(regex);
          // Set the download attribute to suggest a filename

          match + ".zip"; // Change 'filename.zip' to the desired file name
          if (match && match[1]) {
            link.download = match[1] + ".zip";
          } else {
            link.download = "论文" + ".zip";
          }
          // Append the link to the body
          document.body.appendChild(link);

          // Programmatically click the link to trigger the download
          link.click();

          // Remove the link from the document
          document.body.removeChild(link);
        }
      );
    }, 1000),
    // 定义方法
    onViewFile(item) {
      if (item.fileName.split(".").pop() === "pdf") {
        let url =
          "/pdfjs/web/viewer.html?file=" +
          process.env.VUE_APP_BASE_API +
          item.filePath;
        window.open(url, "_blank");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
// 引入scss
// @import "@/styles/variables.scss";
// @import './index.scss';

// 媒体查询
// @media only screen and (max-width: 939px) {
// }
.pdfBox {
}
.pdfShowBox {
  height: 33000px;
  background-color: #fff;
}
.iframe-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 这个比例可以根据你的需求调整 */
  height: 0;
  overflow: hidden;
}
.iframe-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.my-bullet {
  width: 0.1rem;
  height: 0.1rem;
  display: inline-block;
  border-radius: 50%;
  background: #b7b6b9;

  &:nth-child(2) {
    margin: 0 0.1rem;
  }
}

.my-bullet-active {
  background: #fd882e;
}

.pdfNavbar {
  max-width: 1120px;
  // margin: 0 auto;

  height: 64px;
  background: rgba(245, 248, 255, 0.95);
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  border: 1px solid #cccccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;

  .pdfNavItem {
    margin-right: 40px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #3355ff;
    line-height: 22px;
    text-align: left;
    font-style: normal;

    span {
      margin-left: 10px;
    }

    &:hover {
      cursor: pointer;
    }
  }

  .pdfNavLeft {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: space-between;
  }

  .pdfNavRight {
    width: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    background: #3355ff;
    border-radius: 20px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: #ffffff;
    line-height: 22px;
    text-align: left;
    font-style: normal;
  }
  .pdfLeftBtn {
    width: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    background: #3355ff;
    border-radius: 20px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: #ffffff;
    line-height: 22px;
    text-align: left;
    font-style: normal;
    margin-right: 10px;
  }
}

.stickyBox {
  position: relative;
}
.backStep {
  font-size: 30px;
  background: #3355ff;
  color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
}
</style>
