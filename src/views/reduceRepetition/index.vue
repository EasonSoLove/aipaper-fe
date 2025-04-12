<template>
  <div class="mainContentSec reduceRepetiton">
    <!-- <swiper-one class="topSwiper"></swiper-one> -->
    <div class="outlineTab">
      <div class="outLeft">
        <p
          @click="checkoutPaper(1)"
          :class="['outLeftTitle', activeIndex == 1 ? 'activeLT' : '']"
        >
          普通版-降AIGC率(知网版)
          <span class="underLeft"></span>
        </p>
        <p
          @click="checkoutPaper(2)"
          :class="['outLeftTitle', activeIndex == 2 ? 'activeLT' : '']"
        >
          万象版-降AIGC率(知网版)
          <span class="underLeft"></span>
        </p>
        <div style="position: relative; top: 10px">
          <p style="font-size: 14px; margin-bottom: 8px">温馨提示:</p>
          <p style="color: #606266">本站使用万象大模型实现降低AIGC率</p>
          <p style="color: #606266; margin-top: 3px">
            AIGC降重工具升级为高级推理模型, 推理时间略有延长,请您耐心等待!
          </p>
          <p style="color: #606266; margin-top: 3px">
            保证知网的AIGC率 <b class="red">30%</b> 以下
          </p>
        </div>
      </div>
    </div>
    <template v-if="activeIndex == 1">
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
              :placeholder="placeText[activeIndex - 1]"
              maxlength="300"
              show-word-limit
              v-model="original_paragraph"
              resize="false"
              :autosize="{ minRows: 15, maxRows: 20 }"
            >
            </el-input>
          </div>
          <!-- <div class="edit-2 flex align-center">
        <el-button type="primary" round>降低重复率
          <span class="edTwoIcon">
            <svg class="icon svg-icon" aria-hidden="true">
              <use xlink:href="#icon-a-icondanxiangjiantou1"></use>
            </svg>
          </span>
        </el-button>
        <el-button type="primary" round>降低AIGC率
          <span class="edTwoIcon">
            <svg class="icon svg-icon" aria-hidden="true">
              <use xlink:href="#icon-a-icondanxiangjiantou1"></use>
            </svg>
          </span>
        </el-button>
      </div> -->
          <div class="edit-3">
            <el-input
              type="textarea"
              :rows="20"
              readonly
              :placeholder="reduceText[activeIndex - 1]"
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

      <div v-loading="sendStatus" @click="reduceSend" class="reduceBtn g_poin">
        <p>开始生成</p>
      </div>
    </template>
    <template v-if="activeIndex == 2">
      <filereduce></filereduce>
      <progressonly
        :requestKey="requestKey"
        :payStatus="payStatusPro"
        :paperPercent="paperPercent"
      />
    </template>
    <reducepay :requestKey="requestKey" :payStatus="popupStatus"></reducepay>
  </div>
</template>

<script>
import swiperOne from "@/views/writepaper/components/swiperOne.vue";
import { editReduce } from "@/api/user";
import filereduce from "./components/filereduce.vue";
import reducepay from "./components/index.vue";
import eventBus from "@/utils/eventBus";

export default {
  name: "reduceRepetition",
  components: {
    swiperOne,
    reducepay,
    filereduce,
  },
  data() {
    return {
      popupStatus: 0,
      requestKey: "", //out_trade_no
      payStatusPro: 0,
      paperPercent: 0,

      logo: require("@/assets/images/logo_paper.png"),
      drawer: false,
      direction: "rtl", //抽屉方向
      textareaOut: "",
      sendStatus: false,
      activeIndex: 2,
      placeText: [
        "请输入文章段落，待降AIGC率均可，每次最多300字",
        "请输入文章段落，待降AIGC率，每次最多1000字",
      ],
      reduceText: [
        "请在左侧输入待降AIGC率的文章段落，点击“开始生成”按钮，稍等片刻，成品会显示在这里",
        "请在左侧输入待降AIGC率的文章段落，点击“开始生成”按钮，稍等片刻，成品会显示在这里",
      ],
      original_paragraph: "",
      user_content: "",
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
  methods: {
    showPaperDialog(data) {
      this.requestKey = data.requestKey;
      this.payStatusPro = new Date().getTime();
      this.$log("this.requestForm,支付成功打开页面时22", this.requestForm);
      if (data.paperPercent && data.paperPercent > 0) {
        this.paperPercent = data.paperPercent;
      }
    },
    showPayDialog(data) {
      this.requestKey = data.requestKey;
      this.popupStatus = Date.now();
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
    reduceSend() {
      zhuge.track(`用户点击降重按钮`, {});
      let data = {
        original_paragraph: this.original_paragraph,
        // user_content: this.user_content,
      };
      this.sendStatus = true;
      editReduce(data).then((res) => {
        this.sendStatus = false;
        this.textareaOut = res.result.reduce_paragraph;
      });
    },
    checkoutPaper(val) {
      this.activeIndex = val;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

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
  width: auto;
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

.outlineTab {
  width: 100%;
  height: 96px;
  border-radius: 12px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  margin-top: 16px;
  margin-bottom: 16px;

  .outLeft {
    display: flex;
    align-items: center;
  }

  .outLeftTitle {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    margin-right: 40px;
    font-size: 22px;
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
::v-deep .el-upload-dragger {
  height: 240px;
  width: 100%;
  padding-top: 40px;
}
</style>
