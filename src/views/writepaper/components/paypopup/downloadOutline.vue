<template>
  <div>
    <!-- 页面名称 -->
    <!-- 付款成功弹窗 -->
    <el-dialog
      :append-to-body="true"
      :lock-scroll="false"
      :close-on-click-modal="false"
      :visible.sync="popupStatus"
      :width="device == 'mobile' ? '90%' : '60%'"
      class="order-dialog"
      :before-close="handleClose"
    >
      <template slot="title">
        <div class="titleHeader">
          <p class="dialogTitleP">支付订单</p>
          <div class="titleRight">
            <p style="font-size: 15px">看样例，质量我放心。</p>
            <div @click="showExample" class="g_poin btnExample">
              <p>范文样例</p>
            </div>
          </div>
        </div>
      </template>
      <div class="dialog-content">
        <div class="payCodeBox">
          <div class="payLeftCode">
            <el-tabs type="border-card">
              <el-tab-pane>
                <span slot="label"
                  ><svg class="icon svg-icon" aria-hidden="true">
                    <use xlink:href="#icon-zhifubaozhifu"></use>
                  </svg>
                  支付宝支付</span
                >
                <div class="tabsBox">
                  <iframe
                    v-if="pollingStatus"
                    :src="currentOrder.pay_link"
                    height="205"
                    width="205"
                    frameborder="0"
                  ></iframe>
                  <p class="codeIntro">
                    支持使用
                    <b style="color: #00a1e9">“花呗”</b>
                    支付
                  </p>
                </div>
              </el-tab-pane>
              <!-- <el-tab-pane :disabled="true">
                <span slot="label">
                  <svg class="icon svg-icon" aria-hidden="true">
                    <use xlink:href="#icon-weixin"></use>
                  </svg>
                  微信支付
                </span>

              </el-tab-pane> -->
              <!-- <el-tab-pane label="消息中心">消息中心</el-tab-pane> -->
            </el-tabs>
            <!-- left code -->
          </div>
          <div class="payRightPrice">
            <!-- left code -->
            <p class="payTitle">
              支付金额:
              <span>
                <b>{{ currentOrder.pay_amount }}</b>
                元</span
              >
              <span
                style="
                  margin-left: 20px;
                  color: #999;
                  text-decoration-line: line-through;
                "
              >
                原价:
                {{ currentOrder.original_price }}
                元
              </span>
            </p>
            <div class="downOut">
              <p class="dTitle">{{ requestForm.title }}</p>
              <div class="dItem">
                <span>大纲语言:</span>{{ requestForm.language }}
              </div>
              <div class="dItem">
                <span>大纲类型:</span>{{ requestForm.type }}
              </div>
              <div class="dItem">
                <span>大纲科目:</span
                >{{ requestForm.field ? requestForm.field[1] : "" }}
              </div>
              <div class="dItem"><span>大纲ID:</span>{{ requestForm.key }}</div>
            </div>
          </div>

          <!-- 二维码展示 -->
          <div class="code1V1">
            <div>
              <img :src="imgData.image_url" alt="" />
            </div>
            <p>1v1人工服务，全程售后无忧</p>
          </div>
        </div>
      </div>
      <example ref="exampleDia"></example>
    </el-dialog>
  </div>
</template>
<script>
// import { sms } from "@/api/login";
// import webinfo from "@/components/webinfo.vue";
import eventBus from "@/utils/eventBus";
import { getOrder, orderDetailById } from "@/api/user";
import { down_url } from "@/api/paper";
import { mapGetters } from "vuex";
import { downloadFile } from "@/utils/index";
import example from "../example/index.vue";

export default {
  name: "myFooter",
  data() {
    return {
      // 定义变量
      popupStatus: false,
      intervalId: "",
      payTitleStatus: "PRE_CREATE",
      payStatusObject: {
        TRADE_SUCCESS: "交易支付成功",
        WAIT_BUYER_PAY: "未付款交易超时关闭，或支付完成后全额退款",
        PRE_CREATE: "交易创建，等待买家付款",
        TRADE_FINISHED: "交易结束!",
      },
      listData: [], // 存储请求返回的数据
      pollingInterval: 1500, // 轮询间隔时间，单位毫秒
      successIndex: 0,
    };
  },
  components: {
    // webinfo,
    example,
  },
  props: {
    payStatus: {
      type: Number,
      require: true,
      default: () => {
        return false;
      },
    },
    requestKey: {
      type: String,
      require: false,
    },
    timeData: {
      type: String,
      require: false,
    },
  },
  watch: {
    payStatus: {
      handler(newVal, oldVal) {
        this.$log("支付状态发生变化", "新值:", newVal, "旧值:", oldVal);
        // 在这里执行你需要的操作
        this.popupStatus = true;
        this.$store.dispatch("paper/setPollingStatus", true);
        this.getDetail();
      },
    },
  },

  mounted() {
    // eventBus.emit("sendOutline", 5); // 发布事件
    // 页面初始化
  },
  created() {
    // eventBus.on("sendOutline", this.addE); // 订阅事件
  },
  beforeDestroy() {
    // eventBus.off("sendOutline", this.addE); // 移除事件监听
  },
  computed: {
    // 计算属性
    ...mapGetters([
      "pollingStatus",
      "device",
      "currentOrder",
      "requestForm",
      "additionalList",
      "agent_image",
    ]),
    imgData() {
      return this.agent_image.find((image) => image.id === 5);
    },
  },

  methods: {
    showExample() {
      window.zhuge.track("访问范围样例", {
        点击页面: "大纲付费下载",
      });
      this.$refs.exampleDia.showDia();
    },
    handleClose(done) {
      if (this.payTitleStatus == "TRADE_SUCCESS") {
        zhuge.track(`下载大纲-用户成功支付`, {});
      } else {
        zhuge.track(`下载大纲-用户取消支付`, {});
      }
      // 刷新列表
      eventBus.emit("step0Reload", true); // 发布事件

      this.$store.dispatch("paper/setPollingStatus", false);
      done();
      // if (this.payTitleStatus == "TRADE_SUCCESS") {
      //   this.$confirm("关闭弹窗,不影响大纲生成进度")
      //     .then((_) => {
      //       done();
      //       this.$store.dispatch("app/setActiveIndex", 0);
      //       this.$store.dispatch("paper/setPollingStatus", false);
      //     })
      //     .catch((_) => {});
      // }
    },
    jumpStep() {
      if (this.payTitleStatus == "TRADE_SUCCESS") {
        zhuge.track(`用户成功支付`, {});
      } else {
        zhuge.track(`用户取消支付`, {});
      }
      if (this.payTitleStatus == "TRADE_SUCCESS") {
        this.$confirm("关闭弹窗,不影响大纲生成进度")
          .then((_) => {
            // done();
            this.popupStatus = false;
            this.$store.dispatch("paper/setPollingStatus", false);
            this.$store.dispatch("app/setActiveIndex", 0);
          })
          .catch((_) => {});
      } else {
        this.popupStatus = false;
        this.$store.dispatch("paper/setPollingStatus", false);
        this.$store.dispatch("app/setActiveIndex", 0);
      }
    },
    /**
     * 获取列表数据，支持轮询
     * @param {Object} data 请求参数
     * @param {Number} delay 轮询间隔时间，默认2000ms
     * @param {Number} maxRetries 最大重试次数，默认为5次
     * @param {Number} currentRetry 当前重试次数，默认为0
     */
    getList(
      data,
      delay = this.pollingInterval,
      maxRetries = 5,
      currentRetry = 0
    ) {
      this.$log("执行一次");

      if (this.pollingStatus) {
        console.warn("轮询正在进行中...");
      } else {
        return false;
      }

      orderDetailById(data)
        .then((res) => {
          this.$log("---------------res-------------", res.result);
          let result = res.result;
          let orderData = res.result.order;
          // 判断支付状态
          if (orderData.payment_status) {
            this.payTitleStatus = orderData.payment_status;
            if (this.payTitleStatus == "TRADE_SUCCESS") {
              // eventBus.emit("showEmitPaperDialog", {
              //   requestKey: this.currentOrder.out_trade_no,
              //   payStatus: 2,
              //   paperPercent: 0,
              // });
              // alert("支付成功!");
              this.$bdSave();

              let data = {
                key1: this.currentOrder.key,
              };
              down_url(data).then((res) => {
                this.$log(res);
                if (res.result.down_url) {
                  // downloadFile(res.result.down_url);
                  const link = document.createElement("a");
                  link.href = res.result.down_url;

                  // Set the download attribute to suggest a filename
                  link.download = "download";

                  // Append the link to the body
                  document.body.appendChild(link);

                  // Programmatically click the link to trigger the download
                  link.click();

                  // Remove the link from the document
                  document.body.removeChild(link);
                } else {
                  this.$message({
                    type: "warning",
                    message: "下载链接为空!",
                  });
                }
                this.popupStatus = false;
              });
            } else {
              let _this = this;
              setTimeout(() => {
                _this.getList(data, delay, maxRetries, currentRetry);
              }, delay);
            }
          }
        })
        .catch((error) => {
          console.error("请求失败", error);
          if (currentRetry + 1 < maxRetries) {
            // 如果当前重试次数小于最大重试次数，则等待一段时间后再次尝试
            let _this = this;
            setTimeout(() => {
              _this.getList(data, delay, maxRetries, currentRetry + 1);
            }, delay);
          } else {
            // 如果已经达到最大重试次数，则停止轮询
            this.$store.dispatch("paper/setPollingStatus", false);

            console.error("达到最大重试次数，停止轮询");
          }
        });
    },
    getDetail() {
      this.$log("d1111", this.requestKey);
      if (this.requestKey) {
        this.getList({ key: this.requestKey }, 10000);
      } else {
        this.$message({
          type: "warning",
          message: "订单号未返回!",
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
// 引入scss
// @import "@/styles/variables.scss";
// @import "@/styles/mediaMain.scss";
// @import './index.scss';

// 媒体查询
// @media only screen and (max-width: 939px) {
// }
// @media only screen and (max-width: 768px) {
// }

.order-dialog {
  .el-dialog__header {
    text-align: center;
    font-size: 1.2rem;
    padding: 20px;
    background-color: #f8f8f8;
    border-bottom: 1px solid #ddd;
  }

  .el-dialog__body {
    padding: 20px;
    text-align: center;
  }

  .dialog-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .dialog-text {
    font-size: 1rem;
    margin: 10px 0;
    color: #555;
  }

  .paperProgress {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 30px 0;
  }

  .el-button {
    margin: 10px;
    padding: 10px 20px;
    font-size: 1rem;
  }
}

// 响应式设计
@media only screen and (max-width: 768px) {
  .order-dialog {
    .el-dialog {
      width: 95%; // 更小的宽度以适应手机屏幕
    }

    .el-dialog__header {
      font-size: 1.1rem;
      padding: 15px;
    }

    .el-dialog__body {
      padding: 15px;
    }

    .dialog-text {
      font-size: 0.9rem;
      margin: 10px 0;
    }

    .paperProgress {
      margin: 20px 0;
    }

    .el-button {
      margin: 10px;
      padding: 8px 15px;
      font-size: 0.9rem;
    }

    .dialog-footer {
      padding: 15px;
    }
  }
}
.dialog_pay_text {
  color: #409eff;
}
.payCodeBox {
  display: flex;
  justify-content: space-between;
  min-height: 300px;
  width: 100%;
  padding-bottom: 30px;
}
.payLeftCode {
  max-width: 287px;
  // height: 230px;
  padding-top: 13px;
  // border: 1px solid #ccc;
  border-radius: 10px;
  position: relative;
  .codeIntro {
    text-align: center;
    width: 100%;
    margin-top: 5px;
  }
}
.payRightPrice {
  padding-left: 20px;
  flex: 1;
  .payTitle {
    display: flex;
    align-items: center;
    color: #000;
    span {
      color: rgb(252, 106, 0);
      margin-left: 5px;
    }
    b {
      font-size: 24px;
    }
  }
  .popupSpan {
    margin-top: 20px;
    color: #000;
    span {
      color: rgb(252, 106, 0);
    }
  }
  .fujia {
    display: flex;
    flex-wrap: wrap;
    .liFu {
      position: relative;
      width: auto;
      height: 40px;
      display: flex;
      align-items: center;
      border: 1px solid rgb(252, 117, 19);
      border-radius: 5px;
      padding: 5px;
      margin-top: 20px;
      color: #000;
      margin-right: 10px;
      .topIntro {
        position: absolute;
        top: -10px;
        height: 20px;
        right: 0;
        background: rgb(246, 153, 0);
        font-size: 10px;
        border-radius: 3px;
        color: #fff;
        line-height: 20px;
        padding: 0 5px;
      }
    }

    .liFuRight {
      margin-left: 20px;
      span:first-child {
        color: rgb(252, 106, 0);
      }
      span:last-child {
        margin-left: 5px;
        color: #999;
        text-decoration-line: line-through;
      }
    }
  }
}
.payCodeTitle {
  text-align: left;
  width: 100%;
  margin-bottom: 10px;
}
.tabsBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.downOut {
  padding: 10px;
}
.dTitle {
  font-size: 20px;
  color: #000;
  font-weight: bold;
  text-align: center;
  margin: 30px 0;
}
.dItem {
  margin-top: 10px;
  color: #303133;
  font-weight: bold;
  span {
    color: #606266;
    font-weight: 100;
    margin-right: 7px;
  }
}
.titleHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 50px;
}
.dialogTitleP {
  font-size: 20px;
  font-weight: bold;
}
.titleRight {
  display: flex;
  align-items: center;
}
.code1V1 {
  position: absolute;
  bottom: -10px;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  div {
    width: 120px;
    height: 120px;
    margin-bottom: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  p {
    color: #303133;
  }
}
</style>
