<template>
  <div class="mainContentSec reduceRepetiton">
    <!-- <swiper-one class="topSwiper"></swiper-one> -->
    <div style="height: 20px"></div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="新版" name="first">
        <newReduce></newReduce>
        <!-- 查重记录列表 -->
        <div class="record-list-container">
          <record-list :visible="true" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="旧版" name="second">
        <div class="reduce_Old_Page">
          <div class="outlineTab">
            <div class="outLeft">
              <!-- <p
          @click="checkoutPaper(0)"
          :class="['outLeftTitle', activeIndex == 0 ? 'activeLT' : '']"
        >
          降AIGC率-上传文件
          <span class="underLeft"></span>
        </p> -->
              <p
                @click="checkoutPaper(1)"
                :class="['outLeftTitle', activeIndex == 1 ? 'activeLT' : '']"
              >
                降AIGC率-维普
                <span class="underLeft"></span>
              </p>
              <p
                @click="checkoutPaper(2)"
                :class="['outLeftTitle', activeIndex == 2 ? 'activeLT' : '']"
              >
                降AIGC率-知网
                <span class="underLeft"></span>
              </p>
              <p
                @click="checkoutPaper(3)"
                :class="['outLeftTitle', activeIndex == 3 ? 'activeLT' : '']"
              >
                降AIGC率-格子达
                <span class="underLeft"></span>
              </p>
              <!-- <p
          @click="checkoutPaper(4)"
          :class="['outLeftTitle', activeIndex == 4 ? 'activeLT' : '']"
        >
          降AIGC率-人工版
          <span class="underLeft"></span>
        </p> -->
              <!-- <div style="position: relative; top: 10px">
          <p style="font-size: 14px; margin-bottom: 8px">温馨提示:</p>
          <p style="color: #606266">推荐字数: 300-400字效果最佳</p>
          <p style="color: #606266; margin-top: 3px">
            降重可能会导致 <b class="red">字数有差异</b>
          </p>
          <p style="color: #606266; margin-top: 3px">
            保证降重后的AIGC率 <b class="red">20%</b> 以下
          </p>
        </div> -->
            </div>
            <div v-if="activeIndex != 0" class="card">
              <div class="header">
                <span>可用次数：</span>
                <span class="count">{{ remaining_nums }}次</span>
              </div>
              <hr class="divider" />
              <div class="content">
                <p>限时优惠，单次低至 <span class="count">0.8</span>元</p>
                <button @click="showBuyDialog" class="recharge-button">
                  点我补充次数
                </button>
              </div>
            </div>
          </div>
          <template v-if="activeIndex != 4 && activeIndex != 0">
            <div
              v-loading="sendStatus"
              element-loading-text="使用高级推理AI, 润色中..."
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
            >
              <div class="edit flex">
                <div class="edit-1">
                  <el-input
                    type="textarea"
                    :rows="20"
                    placeholder="1、采用独家算法 + 学术模型进行降AIGC，可通过知网、维普、格子达三家平台的AIGC检测，保证降完之后的AIGC率低于20%；
2、单次降AIGC率输入限制500字符，为保证最好的降AIGC效果，单次推荐输入300-400字符；
3、降AIGC可能会导致前后字符数有差异，属于正常现象；
4、如有大量文本需要降AIGC，请联系人工客服进行处理。由于人工介入，因此收费会有所不同
5、仅支持中文， 其他语言正在陆续支持中
6、版本区别: 首先用V1去一遍,然后拿去检测, 如果无法去除再用V2"
                    maxlength="500"
                    show-word-limit
                    v-model="original_paragraph"
                    resize="false"
                    :autosize="{ minRows: 15, maxRows: 20 }"
                  >
                  </el-input>
                </div>
                <div class="edit-3">
                  <el-input
                    type="textarea"
                    :rows="20"
                    readonly
                    placeholder="请在左侧输入待降AIGC率的文章段落，点击“降AIGC”按钮，稍等片刻，成品会显示在这里"
                    maxlength="5000"
                    show-word-limit
                    v-model="textareaOut"
                    resize="false"
                    :autosize="{ minRows: 15, maxRows: 20 }"
                  >
                  </el-input>
                  <div class="btns">
                    <el-button
                      type="primary"
                      v-clipboard:copy="textareaOut"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onError"
                      round
                      size="mini"
                    >
                      复制结果
                    </el-button>
                  </div>
                </div>
              </div>
              <!-- <div class="customization">
          <p class="contentTitle">
            请输入您对生成内容的建议：例如：扩写，缩写，降重，降AIGC率等
          </p>
          <el-input
            type="textarea"
            :autosize="{ minRows: 4 }"
            :rows="4"
            placeholder="请输入您对生成内容的建议：例如：扩写，缩写，降重，降AIGC率等"
            v-model="user_content"
          >
          </el-input>
        </div> -->
            </div>
            <div v-if="activeIndex == 1" class="reduceBottom">
              <div
                v-for="btnItem in weipu_version"
                :key="btnItem.version + 'btn1'"
                v-loading="sendStatus"
                @click="reduceSend(btnItem)"
                class="reduceBtn g_poin"
              >
                <p>{{ btnItem.version_description }}</p>
              </div>
            </div>
            <div v-if="activeIndex == 2" class="reduceBottom">
              <div
                v-for="btnItem in kns_version"
                :key="btnItem.version + 'btn2'"
                v-loading="sendStatus"
                @click="reduceSend(btnItem)"
                class="reduceBtn g_poin"
              >
                <p>{{ btnItem.version_description }}</p>
              </div>
            </div>
            <div v-if="activeIndex == 3" class="reduceBottom">
              <div
                v-for="btnItem in gezida_version"
                :key="btnItem.version + 'btn3'"
                v-loading="sendStatus"
                @click="reduceSend(btnItem)"
                class="reduceBtn g_poin"
              >
                <p>{{ btnItem.version_description }}</p>
              </div>
            </div>
          </template>
          <template v-if="activeIndex == 4">
            <div
              style="
                display: flex;
                background-color: #fff;
                flex-direction: column;
                padding-bottom: 20px;
                align-items: center;
              "
            >
              <p style="margin-top: 20px; margin-bottom: 10px; font-size: 16px">
                联系客服,进行人工降重/降AIGC
              </p>
              <div style="width: 400px">
                <el-image :src="useImg"></el-image>
              </div>
            </div>

            <!-- <filereduce></filereduce> -->

            <!-- <progressonly
        :requestKey="requestKey"
        :payStatus="payStatusPro"
        :paperPercent="paperPercent"
      /> -->
          </template>
          <template v-if="activeIndex == 0">
            <div style="">
              <filereduce></filereduce>
            </div>

            <!-- <progressonly
        :requestKey="requestKey"
        :payStatus="payStatusPro"
        :paperPercent="paperPercent"
      /> -->
          </template>
        </div>
      </el-tab-pane>
    </el-tabs>

    <reducepay2
      :requestKey="requestKey2"
      :payStatus="popupStatus2"
      :paperPercent="paperPercent2"
    />

    <reducepay
      :requestKey="requestKey"
      :selectedPackage="selectedPackage"
      :payStatus="popupStatus"
    ></reducepay>
    <el-dialog
      title="购买套餐"
      :visible.sync="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="contentBox">
        <div class="packages">
          <p>
            当前剩余次数: <b class="red">{{ remaining_nums }}</b
            >次
          </p>
          <p style="margin-top: 20px; font-size: 1.5em; color: #333">
            限时购买优惠套餐
          </p>
          <!-- <div class="package"></div> -->
          <div class="package-container">
            <div
              v-for="item in reduce_aigc_packages"
              :key="item.index"
              :class="[
                'package-item',
                { active: selectedPackage.index == item.index },
              ]"
              @click="selectPackage(item)"
            >
              <div class="price">¥{{ item.price }}</div>
              <div class="original-price">¥{{ item.original_price }}</div>
              <!-- <div  class="description">
                {{ item.description }}
              </div> -->
              <div
                v-html="formatDescription(item.description)"
                class="description"
              ></div>
              <div class="pop" v-if="item.index === '3'">巨划算~</div>
            </div>
          </div>

          <div class="tipspack">
            <p style="color: rgb(46, 47, 46)">购买次数越多,价格越优惠!</p>
            <p style="color: rgb(168, 173, 179); margin-top: 5px">
              支付后,次数立即到账,如有权益未到账,请联系客服处理
            </p>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBuyInfo">去支付</el-button>
      </span>
    </el-dialog>

    <!-- 重要提示弹窗 -->
    <el-dialog
      title="重要提示"
      :visible.sync="importantTipDialogVisible"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="true"
      custom-class="important-tip-dialog"
    >
      <div class="important-tip-content">
        <div class="tip-header">
          <i class="el-icon-info"></i>
          <span class="tip-title">请注意:</span>
        </div>
        <div class="tip-items">
          <div class="tip-item">
            <i class="el-icon-check tip-check-icon"></i>
            <span>不同平台的AI检测算法各不相同,检测结果之间没有参考价值</span>
          </div>
          <div class="tip-item">
            <i class="el-icon-check tip-check-icon"></i>
            <span
              >知网维普格子达查重100%一次过。<span class="highlight-text"
                >30万单0失败</span
              ></span
            >
          </div>
          <div class="tip-item">
            <i class="el-icon-check tip-check-icon"></i>
            <span
              >paperpass的AI查重逻辑和主流的付费的AI查重如知网维普格子达都不一样,如果选了知网维普的话通过不了paperpass</span
            >
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="closeImportantTipDialog"
          class="confirm-button"
        >
          我知道了
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import swiperOne from "@/views/writepaper/components/swiperOne.vue";
import { editReduce, recharge } from "@/api/user";
import {
  remaining_times,
  recharge_package,
  reduce_aigc,
  third_aigc_version,
} from "@/api/wallet";
import filereduce from "./components/filereduce.vue";
import reducepay from "./components/index.vue";
import reducepay2 from "./components/reducePay.vue";
import recordList from "./components/recordList.vue";
import eventBus from "@/utils/eventBus";
import { getToken, setToken } from "@/utils/auth"; // get token from cookie
import newReduce from "./newReduce.vue";

export default {
  name: "reduceRepetition",
  components: {
    swiperOne,
    reducepay,
    filereduce,
    reducepay2,
    newReduce,
    recordList,
  },
  data() {
    return {
      activeName: "first",
      popupStatus: 0,
      popupStatus2: 0,
      requestKey: "", //out_trade_no
      requestKey2: "", //out_trade_no
      payStatusPro: 0,
      paperPercent: 0,
      payStatusPro2: 0,
      paperPercent2: 0,
      useImg: require("@/assets/images/bg/AIGC_kefu.png"),
      logo: require("@/assets/images/logo_paper.png"),
      drawer: false,
      direction: "rtl", //抽屉方向
      textareaOut: "",
      sendStatus: false,
      activeIndex: 1,
      placeText: [
        "请输入文章段落，待降AIGC率均可，每次最多500字",
        "请输入文章段落，待降AIGC率，每次最多1000字",
      ],
      reduceText: [
        '请在左侧输入待降AIGC率的文章段落，点击"降AIGC"按钮，稍等片刻，成品会显示在这里',
        '请在左侧输入待降AIGC率的文章段落，点击"开始生成"按钮，稍等片刻，成品会显示在这里',
      ],
      original_paragraph: "",
      user_content: "",
      remaining_nums: "", // 剩余使用次数
      dialogVisible: false,
      reduce_aigc_packages: [], // 降重套餐
      selectedPackage: {
        index: "3",
      },
      gezida_version: [],
      kns_version: [],
      weipu_version: [],
      // 重要提示弹窗
      importantTipDialogVisible: false,
    };
  },
  computed: {},
  created() {
    eventBus.on("showEmitReduceDialog", this.showPaperDialog); // 订阅事件
    eventBus.on("showEmitPaypopup", this.showPayDialog); // 订阅事件
  },
  beforeDestroy() {
    eventBus.off("showEmitPaypopup", this.showPayDialog); // 订阅事件
    eventBus.off("showEmitReduceDialog", this.showPaperDialog); // 订阅事件
  },
  mounted() {
    this.getReTimes();
    this.getVersion();
    // 检查是否首次进入降重页面
    this.checkFirstVisit();
  },
  methods: {
    // 检查是否首次访问降重页面
    checkFirstVisit() {
      const hasSeenImportantTip = sessionStorage.getItem("hasSeenImportantTip");
      if (!hasSeenImportantTip) {
        this.importantTipDialogVisible = true;
        sessionStorage.setItem("hasSeenImportantTip", "true");
      }
    },
    // 关闭重要提示弹窗
    closeImportantTipDialog() {
      this.importantTipDialogVisible = false;
    },
    // 处理标签页点击事件
    handleClick(tab) {
      console.log("切换到标签页:", tab.name);
    },
    showPayDialog(data) {
      console.log("dddd", data);
      this.requestKey2 = data.requestKey;
      this.popupStatus2 = Date.now();
    },
    formatDescription(description) {
      if (!description || description.length < 5) {
        return description; // 字符串长度不足时，直接返回原字符串
      }

      // 对第3、4、5个字符加粗并标红
      const formatted = description
        .split("")
        .map((char, index) => {
          if (index <= 5) {
            return `<span style="color: red; font-weight: bold;">${char}</span>`;
          }
          return char;
        })
        .join("");

      return formatted;
    },
    getVersion() {
      third_aigc_version().then((res) => {
        console.log("ddd", res);
        this.gezida_version = res.result.gezida_version;
        this.kns_version = res.result.kns_version;
        this.weipu_version = res.result.weipu_version;
      });
    },
    selectPackage(item) {
      this.selectedPackage = item;
      console.log("Selected package:", item);
    },
    getReTimes() {
      remaining_times().then((res) => {
        console.log("剩余次数:", res);
        this.remaining_nums = res.result.remaining_nums;
      });
    },
    showPaperDialog(data) {
      this.dialogVisible = false;
      this.getReTimes();
      // this.requestKey = data.requestKey;
      // this.payStatusPro = new Date().getTime();
      // this.$log("this.requestForm,支付成功打开页面时22", this.requestForm);
      // if (data.paperPercent && data.paperPercent > 0) {
      //   this.paperPercent = data.paperPercent;
      // }
    },

    submitBuyInfo(item) {
      let data = {
        index: this.selectedPackage.index,
        payment_method: "alipay",
      };
      recharge(data)
        .then((res) => {
          let order = {
            out_trade_no: res.result.out_trade_no,
            pay_amount: res.result.pay_amount,
            pay_link: res.result.pay_link,
            original_price: res.result.original_amount,
            order_type: res.result.order_type,
            is_discount: res.result.is_discount,
            discounted_price: res.result.discounted_price,
          };
          this.$store.dispatch("app/toggleCurrentOrder", order);
          this.requestKey = res.result.out_trade_no;
          this.popupStatus = Date.now();
        })
        .catch((error) => {});
    },
    showBuyDialog() {
      // 购买套餐弹窗
      recharge_package().then((res) => {
        this.reduce_aigc_packages = res.result.reduce_aigc_packages;
        this.selectedPackage =
          this.reduce_aigc_packages[this.reduce_aigc_packages.length - 1];
        // console.log("eee", res, this.reduce_aigc_packages);
      });

      this.dialogVisible = true;
    },
    onCopy() {
      this.$message({
        type: "success",
        message: "复制成功！",
      });
    },
    onError() {
      this.$message({
        type: "error",
        message: "复制失败！",
      });
    },
    reduceSend(btnItem) {
      console.log(btnItem, "btnItem");
      // 判断次数是否够用
      if (this.remaining_nums < 1) {
        // this.showBuyDialog();
        this.$message({
          type: "warning",
          message: "次数不足，请使用新版AIGC降重",
        });
        return false;
      }
      zhuge.track(`用户点击降重按钮`, {});
      let formData = new FormData();
      formData.append("contents", this.original_paragraph);
      formData.append("version", btnItem.version);
      this.sendStatus = true;
      reduce_aigc(formData)
        .then((res) => {
          this.sendStatus = false;
          this.textareaOut = res.result.result_contents;

          this.getReTimes();
        })
        .catch((err) => {
          this.sendStatus = false;
        });
    },
    checkoutPaper(val) {
      this.activeIndex = val;
      this.textareaOut = "";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.package-container {
  display: flex;
  justify-content: space-around;
  margin: 16px;
}
.tipspack {
  background-color: rgba(243, 246, 247);
  padding: 10px;
  font-size: 12px;
}
.package-item {
  border: 1px solid #ccc;
  padding: 16px;
  text-align: center;
  width: 140px;
  border-radius: 5px;
  cursor: pointer;
  border-color: rgba(255, 160, 122, 1);
  box-shadow: 0 2px 8px rgba(255, 160, 122, 0.4);
  transition: box-shadow 0.3s;
  position: relative;
  .pop {
    font-size: 12px;
    width: 4.5em;
    height: 2em;
    line-height: 2em;
    border-radius: 5px;
    background: linear-gradient(to right, #6400ff, #004cff);
    color: #fff;
    position: absolute;
    top: 0px;
    right: 0px;
    transform: translate(50%, -50%);
    padding-left: 3px;
  }
}

.package-item.active,
.package-item:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.5);
}
.price {
  font-size: 20px;
  font-weight: bold;
}

.original-price {
  font-size: 14px;
  text-decoration: line-through;
  color: #888;
}

.description {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}
.reduceRepetiton {
  position: relative;
  border-top: 1px solid transparent;
}

.reduceRepetiton::before {
  position: absolute;
  z-index: -1;
  content: "";
  display: block;
  width: 100%;
  min-width: 400px;
  height: 300px;
  top: 0px;
  left: 0px;
  background-image: radial-gradient(
    circle at 0% -230%,
    #e4f4fe 30%,
    transparent 55%
  );
}

.flex {
  display: flex;
}

.flex.align-center {
  flex-direction: column;
  align-items: center;
}

.edit {
  width: 100%;
  gap: 16px;
  padding-bottom: 16px;
  flex-wrap: wrap;

  > div {
    background: #fff;
    border-radius: 12px;
    padding: 15px;
    flex: 1 1 0%;
    height: auto;
    font-size: 14px;
    position: relative;
    min-width: 300px;
    min-height: 280px;

    &::v-deep .el-textarea textarea.el-textarea__inner {
      resize: none;
      border: none;
      padding: 0px;
      font-size: 16px;

      &::placeholder {
        color: #999;
        font-size: 16px;
      }
    }

    textarea {
      border: none;
      outline: none;
      /*边线不显示*/
      resize: none;
      /*禁止拉伸*/
      appearance: none;
      width: 100%;
      background: transparent;
      padding: 0px;
      font-size: 16px;

      &::placeholder {
        color: #999;
        font-size: 16px;
      }
    }

    .btns {
      width: 100%;
      text-align: right;
      padding-top: 10px;
      position: absolute;
      bottom: 10px;
      right: 80px;
    }
  }
}

.reduceBtn {
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
  margin-bottom: 50px;
}

.topSwiper ::v-deep .sliderImgBox img {
  width: 100%;
  height: 100%;
}

.topSwiper ::v-deep .swiperBox {
  margin-top: 0px;
}

.outlineMain {
  max-width: 1200px;
  padding-bottom: 40px;
  background: #ffffff;
  border-radius: 0px 0px 12px 12px;
}
.reduceBottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.outlineTab {
  width: 100%;
  height: 96px;
  border-radius: 12px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  padding-right: 0px;
  margin-top: 16px;
  margin-bottom: 16px;

  .outLeft {
    display: flex;
    align-items: center;
  }

  .outLeftTitle {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    margin-right: 20px;
    font-size: 18px;
    color: #000000;
    line-height: 30px;
    text-align: left;
    font-style: normal;
    position: relative;
    cursor: pointer;
  }

  .paperClass {
    @include center-content(22px);
  }

  .activeLT {
    font-weight: 600;
    @include center-content(22px);

    span {
      position: absolute;
      bottom: -10px;
      right: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: #3355ff;
    }
  }
}

.contentTitle {
  margin-bottom: 10px;
}

.edit-1 {
  font-size: bold;
}

::v-deep .el-loading-spinner .el-loading-text {
  font-size: 14px !important;
}

::v-deep .el-upload {
  width: 100%;
}
/* ::v-deep .el-dialog {
  background: linear-gradient(to right, #fff6d9, #fff9e7);
} */

::v-deep .el-upload-dragger {
  height: 240px;
  width: 100%;
  padding-top: 40px;
}

.card {
  width: 260px;
  background: linear-gradient(to right, #6400ff, #00bfff);
  border-radius: 10px;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px 10px;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.count {
  font-weight: bold;
  font-size: 16px;
  color: rgb(255, 236, 75);
}

.divider {
  border: none;
  border-top: 1px dashed white;
  margin: 5px 0;
}

.content {
  text-align: center;
  font-size: 14px;
}
.contentBox {
  text-align: center;
  font-size: 14px;
  margin-top: -40px;
}
.recharge-button {
  margin-top: 5px;
  padding: 5px 10px;
  background-color: #ff6347;
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.recharge-button:hover {
  background-color: #ff4500;
}

/* 重要提示弹窗样式 */
::v-deep .important-tip-dialog .el-dialog__header {
  padding: 20px 20px 10px;
  border-bottom: none;
}

::v-deep .important-tip-dialog .el-dialog__title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

::v-deep .important-tip-dialog .el-dialog__body {
  padding: 0 20px 20px;
}

::v-deep .important-tip-dialog .el-dialog__footer {
  padding: 10px 20px 20px;
  text-align: center;
}

.important-tip-content .tip-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.important-tip-content .tip-header .el-icon-info {
  color: #409eff;
  font-size: 16px;
  margin-right: 8px;
}

.important-tip-content .tip-header .tip-title {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.important-tip-content .tip-items .tip-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.important-tip-content .tip-items .tip-item .tip-check-icon {
  color: #409eff;
  font-size: 16px;
  margin-right: 10px;
  margin-top: 2px;
  flex-shrink: 0;
}

.important-tip-content .tip-items .tip-item span {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.important-tip-content .tip-items .tip-item span .highlight-text {
  color: #ff4757;
  font-weight: 600;
}

.confirm-button {
  background-color: #8b5cf6 !important;
  border-color: #8b5cf6 !important;
  padding: 10px 30px;
  font-size: 16px;
  border-radius: 6px;
}

.confirm-button:hover {
  background-color: #7c3aed !important;
  border-color: #7c3aed !important;
}

.confirm-button:focus {
  background-color: #8b5cf6 !important;
  border-color: #8b5cf6 !important;
}

/* 查重记录列表容器样式 */
.record-list-container {
  margin-top: 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>
