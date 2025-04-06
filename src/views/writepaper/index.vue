<template>
  <div class="mainContentSec" ref="mainSec">
    <!-- 页面名称 -->

    <div class="carouselBox stepTips">
      <!-- <div class="carouselCon">
        <el-carousel
          height="44px"
          direction="vertical"
          :loop="true"
          :autoplay="true"
        >
          <el-carousel-item>
            <p class="homeSwiper">
              <img
                src="https://mixpaper.cn/static/img/MIXPAPER.d3c7dfc9.png"
                alt=""
              />
              <b>免费生成</b>毕业论文大纲&nbsp;&nbsp;&nbsp;&nbsp;
              提供查重<b>低于10%</b>的专业初稿
            </p>
          </el-carousel-item>
          <el-carousel-item>
            <p class="homeSwiper">
              <img
                src="https://mixpaper.cn/static/img/MIXPAPER.d3c7dfc9.png"
                alt=""
              />
              助你<b>节省三个月</b>写作时间
              &nbsp;&nbsp;&nbsp;&nbsp;只需三步，搞定论文
            </p>
          </el-carousel-item>
          <el-carousel-item>
            <p class="homeSwiper">
              <img
                src="https://mixpaper.cn/static/img/MIXPAPER.d3c7dfc9.png"
                alt=""
              />
              郑重承诺：
              <b>不满意，不收费！</b>
            </p>
          </el-carousel-item>
        </el-carousel>
      </div> -->
    </div>
    <!-- <div style="padding: 0 10px">
      <swiper-one class="topSwiper"></swiper-one>
    </div> -->
    <global-modal ref="globalModal"> </global-modal>
    <!-- tabs{{ $t("route.writePaper") }}  -->
    <div class="tabsListWrapper" ref="tasListWrapper">
      <div class="tabsList">
        <div
          :class="[
            'tabLi',
            activeIndex == 1 || activeIndex == 0 ? 'activeTab' : '',
          ]"
        >
          <p class="tabsTitle">Step 1</p>
          <div class="tabIcon">
            <span></span>
          </div>
          <p class="tabIntro">填写需求 <span>生成大纲</span></p>
        </div>
        <div :class="['tabLi', activeIndex == 2 ? 'activeTab2' : '']">
          <p class="tabsTitle">Step 2</p>
          <div class="tabIcon">
            <span></span>
          </div>
          <p class="tabIntro">检查大纲 <span>生成正文</span></p>
        </div>
        <div
          :class="['tabLi', activeIndex == 3 ? 'activeTab3' : '']"
          @click="setActiveIndex3"
        >
          <p class="tabsTitle">Step 3</p>
          <div class="tabIcon">
            <span></span>
          </div>
          <p class="tabIntro">查收正文 <span>下载初稿</span></p>
        </div>
      </div>
    </div>
    <!-- step3不展示论文 -->
    <div v-if="activeIndex !== 3" class="outlineBox" id="outlineTop">
      <outline ref="outlineRef" @errorBack="errorBack"></outline>
    </div>

    <div class="stepContent">
      <step0 ref="step0" v-if="activeIndex != 3"></step0>

      <step1 v-if="activeIndex == 1"></step1>
      <step2 :outlineData="outlineData" v-if="activeIndex == 2"></step2>
      <step3
        v-if="activeIndex == 3"
        :class="[isScrollActive ? 'fixed' : '']"
      ></step3>
    </div>
    <!-- <question-list></question-list> -->
    <!-- 论文查询生辰弹窗 -->
    <order-dialog
      :requestKey="requestKey"
      :payStatus="payStatusPro"
      :paperPercent="paperPercent"
    ></order-dialog>
    <paypopup :requestKey="requestKey" :payStatus="popupStatus"></paypopup>
    <down-line
      :requestKey="requestKeyLine"
      :payStatus="popupStatusLine"
    ></down-line>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
// import { sms } from "@/api/login";

import swiperOne from "./components/swiperOne.vue";
// import eventBus from "@/utils/eventBus";
// import step0 from "./components/step0.vue";
import questionList from "./components/questionList/index.vue";
import step1 from "./components/step1.vue";
import step0 from "./components/step0.vue";
import step2 from "./components/step2.vue";
import outline from "./components/outline.vue";
import step3 from "./components/step3.vue";
import eventBus from "@/utils/eventBus";
import emitter from "@/utils/eventBus";
import { outlineStatus } from "@/api/user";
import { pay_download } from "@/api/paper";
import orderDialog from "./components/orderDialog.vue";
import paypopup from "./components/paypopup/index.vue";
import downLine from "./components/paypopup/downloadOutline.vue";

import { getDomain } from "@/utils/index.js";

export default {
  name: "writepaper",
  data() {
    return {
      // 定义变量
      isScrollActive: false,
      outlineData: [],
      requestKey: "", //out_trade_no
      requestKeyLine: "", //out_trade_no
      payStatusPro: 0,
      popupStatusLine: 0,
      paperPercent: 0,
      popupStatus: 0,
    };
  },
  components: {
    // webinfo,
    swiperOne,
    outline,
    step3,
    step2,
    step1,
    step0,
    orderDialog,
    paypopup,
    questionList,
    downLine,
  },
  mounted() {
    this.$message({
      showClose: true,
      center: true,
      duration: 6000,
      type: "warning",
      dangerouslyUseHTMLString: true,
      message: `
            <p style="text-align: center;">
            近期算力紧张，用户访问骤增，大纲和正文有失败情况，请重试。
          </p>
    <p style="text-align: center;margin-top: 10px">如果生成大纲或者正文失败，重试不成功，请及时联系客服解决！给大家带来的不便，敬请谅解。</p>

            `,
    });
    //     `
    //         <p style="text-align: center;">
    //         近期算力紧张，给大家带来的不变，敬请谅解。
    //       </p>
    // <p style="text-align: center;margin-top: 10px">如果生成大纲或者正文失败，请重试，重试不成功，请及时联系客服解决！再次抱歉，我们一直在努力，让学术更简单！</p>
    //         `,

    // 页面初始化
    window.addEventListener("scroll", this.handleScroll);
    // this.$store.dispatch("app/setActiveIndex", 2);
  },
  created() {
    this.getBdVidFromUrl();
    eventBus.on("showEmitPaperDialog", this.showPaperDialog); // 订阅事件
    eventBus.on("showEmitPaypopup", this.showPayDialog); // 订阅事件
    eventBus.on("emitOulineClick", this.showIndex); // 订阅事件
    eventBus.on("successOutline", this.showOutLine); // 订阅事件
    eventBus.on("pdfSuccessClick", this.showIndex3); // 订阅事件
    eventBus.on("showDownOutline", this.showDownOutline); // 订阅事件

    // eventBus.on("sendOutline", this.addE); // 订阅事件
    zhuge.track(`访问域名`, {
      domain: getDomain(),
    });
  },

  beforeDestroy() {
    eventBus.off("showEmitPaperDialog", this.showPaperDialog); // 订阅事件
    eventBus.off("showEmitPaypopup", this.showPayDialog); // 订阅事件

    eventBus.off("emitOulineClick", this.showIndex); // 移除事件监听
    eventBus.off("successOutline", this.showOutLine); // 移除事件监听
    eventBus.off("pdfSuccessClick", this.showIndex3); // 订阅事件
    eventBus.off("showDownOutline", this.showDownOutline); // 订阅事件

    window.removeEventListener("scroll", this.handleScroll);
  },
  watch: {
    // $route(to, from) {
    //   // 手动处理更新逻辑
    //   this.fetchDataBasedOnRoute(to);
    // },
    device: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val == "mobile") {
          eventBus.emit("open-modal", true); // 发布事件
        }
      },
    },
    activeIndex: {
      handler(val) {
        this.$log("activeIndexval", val);
        // 更新首页大纲列表
        // eventBus.emit("step0Reload", true); // 发布事件
      },
    },
  },
  computed: {
    // 计算属性
    ...mapGetters([
      "activeIndex",
      "device",
      "requestForm",
      "formdataV2",
      "currentOrder",
    ]),
  },
  methods: {
    fetchDataBasedOnRoute(to) {
      this.$log("tototototo---------", to);
    },
    getBdVidFromUrl() {
      // 获取当前页面的 URL
      let bdVid = "";
      const url = new URL(window.location.href);
      // 使用 URLSearchParams 对象解析查询字符串
      const params = new URLSearchParams(url.search);
      // 提取 bd_vid 的值
      bdVid = params.get("bd_vid");
      // 如果需要，可以在控制台输出查看
      this.$store.dispatch("paper/setBdVid", bdVid);
    },
    // 展示论文加载弹窗
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
    showDownOutline(data) {
      // 生成二维码
      let data1 = {
        key: data.key,
        payment_method: "alipay",
      };
      pay_download(data1).then((res) => {
        let order = {
          //
          key: data.key,
          out_trade_no: res.result.out_trade_no,
          pay_amount: res.result.pay_amount,
          pay_link: res.result.pay_link,
          original_price: res.result.original_amount
            ? res.result.original_amount
            : res.result.pay_amount,
          payment_method: res.result.payment_method,
        };
        // 弹窗里的附加信息
        let addList = res.result.additional_service
          ? res.result.additional_service
          : [];

        this.$store.dispatch("paper/setAdditionList", addList);
        this.$store.dispatch("app/toggleCurrentOrder", order);
        this.requestKeyLine = res.result.out_trade_no;
        this.popupStatusLine = Date.now();
      });
    },
    // 定义方法
    errorBack() {
      // this.tabsClick(0);
      // this.activeIndex = 0;
      this.$store.dispatch("app/setActiveIndex", 0);
    },
    setActiveIndex3() {
      // this.tabsClick(0);
      // this.activeIndex = 0;
      this.$store.dispatch("app/setActiveIndex", 3);
    },
    // 点击生成大纲
    showIndex() {
      // this.activeIndex = 1;
      this.$store.dispatch("app/setActiveIndex", 1);
      this.$nextTick(() => {
        eventBus.emit("beginTime", 900);
        this.$scrollTo("#step1", 500, { offset: -150 });
      });
    },
    showIndex3(pdfUrl) {
      // let pdfUrl =
      // "https://file.mixpaper.cn/paper/case/4fd240e4-cad3-4e87-a8d4-1eda7a2cbe4d/second/output.pdf";
      // this.activeIndex = 3;
      this.$store.dispatch("app/setActiveIndex", 3);

      this.$nextTick(() => {
        this.$store.dispatch("app/togglePDFUrl", pdfUrl);
      });
    },
    showOutLine(data) {
      this.outlineData = {};

      this.outlineData = data;
      this.tabsClick(2);
    },
    tabsClick(val) {
      // this.activeIndex = val;
      this.$store.dispatch("app/setActiveIndex", val);

      if (val == 2) {
        this.$nextTick(() => {
          this.$scrollTo("#top", 500, { offset: -100 });
        });
      }
    },
    tabStapAdd() {
      if (this.activeIndex <= 3) {
        this.activeIndex += 1;
      }
    },
    handleScroll() {
      const element = this.$refs.mainSec;
      const elementTop = element.getBoundingClientRect().top; // 当元素顶部到达页面顶部时添加 active 类

      if (elementTop <= -300) {
        this.isScrollActive = true;
      } else {
        this.isScrollActive = false;
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    // 在路由进入前调用
    if (to.query.key1) {
      console.log("ddd", to.query.key1);
      let data = {
        key: to.query.key1,
      };
      outlineStatus(data)
        .then((res) => {
          // 使用 next 的回调函数来访问组件实例
          next((vm) => {
            vm.showOutLine(res.result.outline.outline);
            console.log("dddddddddddddddddddddddd", vm.requestForm.key);

            if (res.result.key) {
              vm.$refs.outlineRef.returnDataToForm(res.result);
            }
            console.log("dddd", res);
            // 复现大纲接口
            // let data = {
            //   ...vm.requestForm,
            //   predict_price: res.result.predict_price,
            // };

            // 保存大纲输入信息
            vm.$store.dispatch("app/setRequestForm", res.result);
            // 填充大纲列表数据
          });
        })
        .catch((error) => {
          console.error("Error fetching outline status:", error);
          // 处理错误，比如显示一个通知或提示信息
          next(); // 确保在发生错误时仍然导航到组件
        });
    } else {
      next((vm) => {
        // 直接在这使用 vm 进行 store 操作
        if (vm.requestForm.key || vm.requestForm.key1) {
          vm.$refs.outlineRef.returnDataToForm(vm.requestForm);
        }
        vm.$store.dispatch("app/setActiveIndex", 0);
      });
    }
  },
  beforeRouteUpdate(to, from, next) {
    // 当路由的查询参数发生变化时，这个方法会被调用
    console.log("ssssssssssssssssssssssssss");
    // this.activeIndex = to.query.activeIndex || 0;
    if (to.query.key1) {
      let data = {
        key: to.query.key1,
      };
      outlineStatus(data).then((res) => {
        this.showOutLine(res.result.outline.outline);
        // 复现大纲接口
        let data = {
          ...this.requestForm,
          predict_price: res.result.predict_price,
        };

        // 保存大纲输入信息
        this.$store.dispatch("app/setRequestForm", data);
        // 填充大纲列表数据
      });
    } else {
      this.$store.dispatch("app/setActiveIndex", 0);
    }
    next();
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
.topSwiper ::v-deep .sliderImgBox img {
  width: 100%;
  height: 100%;
}

.topSwiper ::v-deep .swiperBox {
  margin-top: 0px;
}

.mainContentSec {
  // background-color:  #F7F7F7;  overflow: hidden;
}

.tabsListWrapper {
  // : 1200px;
  width: 100%;
  max-width: 1200px;
  // padding-top: 16px;
}

.tabsList {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  background-color: #e6edff;
}

.tabLi {
  width: 33.3%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 130px;
}

.tabsTitle {
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 18px;
  color: #000000;
  line-height: 25px;
  text-align: left;
  font-style: normal;
}

.tabIcon {
  width: 38px;
  height: 38px;
  background: #999999;
  border-radius: 19px;
  margin: 7px 0;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    display: inline-block;
    width: 12px;
    height: 12px;
    background: #ffffff;
    border-radius: 8px;
  }
}

.tabIntro {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #000000;
  line-height: 22px;
  text-align: center;
  font-style: normal;

  span {
    color: #3355ff;
    margin-left: -5px;
    font-weight: bold;
  }
}

.activeTab {
  background: url("../../assets/images/shape-left.png") no-repeat 0 0 / 100%
    100% !important;

  .tabsTitle {
    color: #3355ff;
  }

  .tabIcon {
    background-color: #3355ff;
  }
}

.activeTab2 {
  background: url("../../assets/images/shape.png") no-repeat 0 0 / 100% 100% !important;

  .tabsTitle {
    color: #3355ff;
  }

  .tabIcon {
    background-color: #3355ff;
  }
}

.activeTab3 {
  background: url("../../assets/images/shape-right.png") no-repeat 0 0 / 100%
    100% !important;

  .tabsTitle {
    color: #3355ff;
  }

  .tabIcon {
    background-color: #3355ff;
  }
}

.stepContent {
  margin-top: 16px;
  margin-bottom: 16px;
}

.fixed ::v-deep .stickyBox {
  width: 100%;
  position: fixed;
  top: 90px;
  z-index: 100;
}
.stepTips {
  text-align: center;
  font-size: 16px;
  color: #3355ff;
  margin-top: 15px;
  line-height: 44px;
  b {
    margin: 0 5px;
    color: #0022cc;
  }
}
.carouselBox {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f7f7;
  .carouselCon {
    width: 1100px;
  }
}
.homeSwiper {
  font-size: 14px;
  line-height: 44px;
  text-align: center;
  color: #1d1d1f;
  background-color: #f7f7f7;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 115px;
    height: 19px;
    margin-right: 10px;
  }
}
</style>
