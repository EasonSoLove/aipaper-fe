<template>
  <div>
    <!-- 页面名称 -->
    <!-- 付款成功弹窗 -->
    <el-dialog
      :append-to-body="true"
      :lock-scroll="false"
      :close-on-click-modal="false"
      title="支付订单"
      :visible.sync="popupStatus"
      :width="device == 'mobile' ? '90%' : '70%'"
      class="order-dialog"
      :before-close="handleClose"
    >
      <template slot="title">
        <div class="titleHeader">
          <p class="dialogTitleP">订单支付</p>
        </div>
      </template>
      <div
        v-loading="loading"
        :element-loading-text="'倒计时 ' + indexNum + ' 秒'"
        element-loading-spinner="el-icon-loading"
        class="dialog-content"
      >
        <!-- <p class="dialog-text">
          当前订单状态:
          <span class="dialog_pay_text">{{
            payStatusObject[payTitleStatus]
          }}</span>
        </p> -->

        <div class="payCodeBox" style="justify-content: center">
          <div style="margin-right: 50px">
            <div class="reduceCard">
              <p>文件查重付款</p>
              <div class="cardChildList">
                <p>总字数: {{ currentOrder.word_count }}</p>
              </div>
            </div>
          </div>
          <div class="payLeftCode">
            <p class="plTitle">支付信息</p>
            <div class="newLeftBox">
              <div>
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
              </div>
              <!-- 优惠卷 -->
              <div
                v-show="
                  currentOrder.order_type !== 'OUTLINE_DOWNLOAD' &&
                  currentOrder.order_type !== 'EXTRA_PROPOSAL' &&
                  currentOrder.order_type !== 'EXTRA_TASK_ASSIGNMENT' &&
                  currentOrder.order_type !== 'EXTRA_SURVEY' &&
                  currentOrder.order_type !== 'EXTRA_JOURNAL_REVIEWED' &&
                  currentOrder.order_type !== 'REDUCE_AIGC' &&
                  currentOrder.is_discount == 1
                "
                class="newJuan"
                style="margin-top: 10px; margin-bottom: 10px"
              >
                <!-- <span>优惠卷: </span> -->

                <!-- <input
                  type="text"
                  placeholder="请输入优惠卷编号"
                  v-model="coupon_code"
                  @blur="useCoupon"
                /> -->
                <!-- <el-button size="mini" type="primary" plain
                  >兑换</el-button
                > -->
              </div>
              <!-- 价格展示 -->
              <div class="newPriceBox">
                <p>
                  <span>原价:</span>
                  <span>¥ {{ currentOrder.original_price }}</span>
                </p>
                <p v-if="currentOrder.discounted_price > 0">
                  <span>优惠金额：</span>
                  <span>¥{{ currentOrder.discounted_price }}</span>
                </p>
                <div class="newPriceBottom">
                  <span>支付金额:</span>
                  <span>¥{{ currentOrder.pay_amount }}</span>
                </div>
              </div>
            </div>
            <!-- left code -->
          </div>
        </div>
        <!-- 二维码展示 -->
        <!-- <div class="code1V1">
          <div>
            <img :src="imgData.image_url" alt="" />
          </div>
          <p>1v1人工服务，全程售后无忧</p>
        </div> -->
      </div>
      <!-- <example ref="exampleDia"></example> -->
    </el-dialog>
  </div>
</template>
<script>
// import { sms } from "@/api/login";
// import webinfo from "@/components/webinfo.vue";
import eventBus from "@/utils/eventBus";
import {
  getOrder,
  orderDetailById,
  ordersRepay,
  balance_pay,
} from "@/api/user";
import { mapGetters } from "vuex";
import OrderType from "@/utils/orderTypes";

export default {
  name: "paydialog",
  data() {
    return {
      // 定义变量
      selectValue: "left", // 初始状态未选中任何卡片

      indexNum: 5,
      activeName: "PAY_ALL", // 支付类型：PAY_ALL-正式版，PAY_STAGES-预览版
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
      pollingInterval: 2000, // 轮询间隔时间，单位毫秒
      successIndex: 0,
      orderId: "",
      loading: false,
      coupon_code: "",
      orderPayDisabled: false, // 去支付 不能切换订单
    };
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
        this.activeName = this.currentOrder.pay_type;
        this.$store.dispatch("paper/setPollingStatus", true);
        this.orderId = this.requestKey;
        this.getDetail();
        this.setCanDis();
      },
    },
  },
  components: {
    // webinfo,
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
      "agent_image",
      // "additionalList",
    ]),
    imgData() {
      return this.agent_image.find((image) => image.id === 5);
    },
  },

  methods: {
    setCanDis() {
      this.$log(this.currentOrder);

      if (this.currentOrder.payment_status) {
        this.$log(this.currentOrder.payment_status);
        this.orderPayDisabled = true;
      } else {
        this.orderPayDisabled = false;
        let wordTypeList = [
          "EXTRA_PROPOSAL",
          "EXTRA_TASK_ASSIGNMENT",
          "EXTRA_JOURNAL_REVIEWED",
        ];
        // 请求成功, 激活tab3
        if (wordTypeList.includes(this.currentOrder.order_type)) {
          this.orderPayDisabled = true;
        } else {
          this.orderPayDisabled = false;
        }
      }
      // 判断是否是word的几个内容
    },
    useCoupon() {
      if (!this.coupon_code) {
        return false;
      }
      this.$confirm("优惠卷兑换后，无法退回, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (this.currentOrder.returnStatus == "去支付") {
            this.payUseCode();
          } else if (this.currentOrder.returnStatus == "付尾款") {
            this.payWeiUseCode();
          } else {
            this.handleClick();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消兑换",
          });
        });
    },
    startCountdown() {
      const countdownInterval = setInterval(() => {
        if (this.indexNum > 0) {
          this.indexNum--;
        } else {
          this.loading = false;
          clearInterval(countdownInterval); // 停止循环
          this.indexNum = 5;
        }
      }, 1000); // 每隔 1000 毫秒（1秒）执行一次
    },
    payWeiUseCode() {
      this.loading = true;
      this.startCountdown();
      // 停止上一次循环
      this.$store.dispatch("paper/setPollingStatus", false);
      let data = {
        out_trade_no: this.currentOrder.out_trade_no,
        payment_method: "alipay",
        coupon_code: this.coupon_code,
      };
      balance_pay(data)
        .then((res) => {
          this.resetForm();

          let order = {
            ...this.currentOrder,
            out_trade_no: res.result.out_trade_no,
            pay_amount: res.result.pay_amount,
            pay_link: res.result.pay_link,
            original_price: res.result.original_amount,
            order_type: res.result.order_type,
            is_discount: res.result.is_discount,
            discounted_price: res.result.discounted_price,
          };
          this.$store.dispatch("app/toggleCurrentOrder", order);
          let _this = this;
          setTimeout(() => {
            _this.loading = false;
            _this.$store.dispatch("paper/setPollingStatus", true);
            _this.orderId = res.result.out_trade_no;
            _this.getDetail();
          }, 4000);
        })
        .catch((error) => {
          let _this = this;
          setTimeout(() => {
            _this.orderId = _this.currentOrder.out_trade_no;
            _this.$store.dispatch("paper/setPollingStatus", true);
            _this.getDetail();
          }, 4000);
        });
    },
    payUseCode() {
      this.loading = true;
      this.startCountdown();
      // 停止上一次循环
      this.$store.dispatch("paper/setPollingStatus", false);
      let data = {
        out_trade_no: this.currentOrder.out_trade_no,
        payment_method: "alipay",
        coupon_code: this.coupon_code,
      };
      ordersRepay(data)
        .then((res) => {
          let order = {
            ...this.currentOrder,
            out_trade_no: res.result.out_trade_no,
            pay_amount: res.result.pay_amount,
            pay_link: res.result.pay_link,
            original_price: res.result.original_amount,
            order_type: res.result.order_type,
            is_discount: res.result.is_discount,
            discounted_price: res.result.discounted_price,
          };
          this.resetForm();

          this.$store.dispatch("app/toggleCurrentOrder", order);
          let _this = this;
          setTimeout(() => {
            _this.loading = false;
            _this.$store.dispatch("paper/setPollingStatus", true);
            _this.orderId = res.result.out_trade_no;
            _this.getDetail();
          }, 4000);
        })
        .catch((error) => {
          let _this = this;
          setTimeout(() => {
            _this.orderId = _this.currentOrder.out_trade_no;
            _this.$store.dispatch("paper/setPollingStatus", true);
            _this.getDetail();
          }, 4000);
        });
    },
    resetForm() {
      this.coupon_code = "";
    },
    handleClick(tab, event) {
      this.loading = true;
      this.startCountdown();
      // 停止上一次循环
      this.$store.dispatch("paper/setPollingStatus", false);
      // 重新生成订单
      let data = {
        payment_method: "alipay", // 支付方式
        pay_type: this.activeName,
        key: this.currentOrder.key,
        items: this.currentOrder.items,
        coupon_code: this.coupon_code,
        product: this.currentOrder.product, // 大纲的key
        type: this.currentOrder.type, // 大纲的key
        word_count: this.currentOrder.word_count, // 大纲的key
      };
      if (data.pay_type == "PAY_STAGES") {
        data.items = [
          {
            product_id: "1", //正文id
            quantity: 1, // 数量
            price: 149.85, //价格
          },
        ];
      }
      getOrder(data)
        .then((res) => {
          this.resetForm();
          let order = {
            ...this.currentOrder,
            out_trade_no: res.result.out_trade_no,
            pay_amount: res.result.pay_amount,
            pay_link: res.result.pay_link,
            original_price: res.result.original_amount,
            pay_type: data.pay_type,
            payment_method: data.payment_method,
            key: data.key,
            items: data.items,
            is_discount: res.result.is_discount,
            discounted_price: res.result.discounted_price,
          };
          this.$store.dispatch("app/toggleCurrentOrder", order);
          let _this = this;
          setTimeout(() => {
            _this.loading = false;
            _this.$store.dispatch("paper/setPollingStatus", true);
            _this.orderId = res.result.out_trade_no;
            _this.getDetail();
          }, 4000);
        })
        .catch((error) => {
          let _this = this;
          setTimeout(() => {
            _this.orderId = _this.currentOrder.out_trade_no;
            _this.$store.dispatch("paper/setPollingStatus", true);
            _this.getDetail();
          }, 4000);
        });
    },
    showExample() {
      window.zhuge.track("访问范围样例", {
        点击页面: "论文付款页面",
      });
      this.$refs.exampleDia.showDia();
    },
    handleClose(done) {
      eventBus.emit("step0Reload", true); // 发布事件

      if (this.payTitleStatus == "TRADE_SUCCESS") {
        window.zhuge.track("用户成功付款", {
          价格: this.currentOrder.pay_amount,
          语言: this.requestForm.language,
          科目: this.requestForm.field && this.requestForm.field[1],
          学历: this.requestForm.type,
          论文字数: this.requestForm.word_count,
        });
      } else {
        window.zhuge.track("用户取消付款", {
          价格: this.currentOrder.pay_amount,
          语言: this.requestForm.language,
          科目: this.requestForm.field && this.requestForm.field[1],
          学历: this.requestForm.type,
          论文字数: this.requestForm.word_count,
        });
      }
      this.$store.dispatch("app/setActiveIndex", 0);
      this.$store.dispatch("paper/setPollingStatus", false);
      done();
      // if (this.payTitleStatus == "TRADE_SUCCESS") {
      //   this.$confirm("关闭弹窗,不影响论文生成进度")
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
        this.$confirm("关闭弹窗,不影响论文生成进度")
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
            if (this.currentOrder.returnStatus) {
              if (
                this.currentOrder.returnStatus == "付尾款" &&
                this.payTitleStatus == "TRADE_SUCCESS"
              ) {
                this.paySend();
                return false;
              }
              if (
                this.currentOrder.returnStatus == "去支付" &&
                (this.payTitleStatus == "TRADE_SUCCESS" ||
                  this.payTitleStatus == "TRADE_DEPOSIT_SUCCESS")
              ) {
                this.paySend();
                return false;
              }
              let _this = this;
              setTimeout(() => {
                _this.getList(data, delay, maxRetries, currentRetry);
              }, delay);
            } else {
              if (
                this.payTitleStatus == "TRADE_SUCCESS" ||
                this.payTitleStatus == "TRADE_DEPOSIT_SUCCESS"
              ) {
                this.paySend();
              } else {
                let _this = this;
                setTimeout(() => {
                  _this.getList(data, delay, maxRetries, currentRetry);
                }, delay);
              }
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
    paySend() {
      // this.$bdSave();
      window.zhuge.track("用户成功付款", {
        类目: "查重付费",
      });
      this.$log("this.requestForm,扫码成功后调用回调11", this.requestForm);

      eventBus.emit("showEmitPaperDialog", {
        requestKey: this.currentOrder.out_trade_no,
        payStatus: 2,
        paperPercent: 0,
      });
      this.popupStatus = false;
    },
    getDetail() {
      this.$log("d1111", this.orderId);
      if (this.orderId) {
        this.getList({ key: this.orderId });
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
    padding-bottom: 50px;
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
  margin-top: -30px;
  padding-top: 20px;
  width: 100%;
  border-top: 1px solid #ccc;
  padding-bottom: 30px;
}
.newLeftBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}
.newJuan {
  display: flex;
  align-items: center;
  color: #1b2126;
  width: 240px;
  height: 41px;
  background: #ffffff;
  border-radius: 8px;
  padding-left: 8px;
  &:hover {
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  input {
    border: none;
    outline: none;
    height: 99%;
    width: 180px;
    padding-left: 5px;
  }
}
.newPriceBox {
  width: 240px;
  background: #ffffff;
  border-radius: 8px;
  padding: 0 8px;
  p {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: 14px;
    color: #959da6;
    line-height: 18px;
    margin-top: 10px;
    & > span:first-child {
      display: inline-block;
      width: 90px;
      text-align: left;
    }
  }
  .newPriceBottom {
    height: 44px;
    line-height: 44px;
    font-weight: 600;
    font-size: 14px;
    color: #000000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > span:last-child {
      color: #f53f3f;
      font-size: 16px;
    }
  }
}
.reduceCard {
  font-family: PingFangSC-SNaNpxibold;
  font-weight: 600;
  font-size: 18px;
  color: #000000;
}
.cardChildList {
  display: flex;
  margin-top: 10px;
  p {
    height: 24px;
    line-height: 22px;
    background: #fff7e8;
    border: 1px solid #ff7d00;
    border-radius: 2px;
    padding: 0px 8px;
    color: #ff7d00;
    font-weight: bold;
    font-size: 12px;
    margin-right: 10px;
  }
}
.payLeftCode {
  width: 307px;
  padding: 20px 30px;
  margin-top: -20px;
  background: #f4f5f7;
  // height: 230px;
  // border: 1px solid #ccc;
  position: relative;
  .codeIntro {
    text-align: center;
    width: 100%;
    margin-top: 5px;
  }
  .plTitle {
    font-family: PingFangSC-SNaNpxibold;
    font-weight: 600;
    font-size: 18px;
    color: #000000;
  }
}
.payRightPrice {
  position: relative;
  flex-grow: 1;

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

.payFrom {
  margin-top: 20px;
  line-height: 30px;
  font-size: 14px;
  .formitem {
    display: flex;
    b {
      display: inline-block;
      width: 50%;
    }
    span {
      display: inline-block;
      width: 70px;
      text-align: right;
      margin-right: 8px;
      color: #000;
    }
  }
}
::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  background: #409eff !important;
  color: #fff !important;
}
</style>
