<template>
  <div>
    <!-- <el-button type="success" @click="jump">跳转到原页面</el-button> -->
    <!-- 公告管理 -->
    <!-- <announcement></announcement> -->
    <!-- 页面名称 -->

    <!-- <el-button type="success" @click="jump2">跳转详情页</el-button> -->
    <search-paper class="searchPaper"></search-paper>
    <div class="swiperBg">
      <advantage class="swiper swiper3"></advantage>
    </div>

    <div class="swiperBg swiperBg2" style="padding-top: 40px">
      <!-- <input-main class="swiper swiper1"></input-main> -->
      <div class="swiperNews pwrapper">
        <div class="swiperListTitle">
          <p>
            <span> 用户心声</span>
            <span class="rightIcon">
              <img src="@/assets/images/index/home_title_bg.png" alt="" />
            </span>
          </p>
        </div>
      </div>
      <swiper-three class="swiper swiper2"></swiper-three>
    </div>
    <!-- 优势页面 -->
    <div class="swiperBg">
      <corelist class="swiper swiper3"></corelist>
    </div>

    <!-- <el-button @click="getList">点击</el-button> -->
  </div>
</template>
<script>
import { mapGetters } from "vuex";
// import { sms } from "@/api/login";

import inputMain from "./components/inputMain.vue";
import swiperThree from "./components/swiperThree.vue";
import advantage from "./components/advantage.vue";
import corelist from "./components/corelist.vue";
import searchPaper from "./components/searchPaper.vue";
// import eventBus from "@/utils/eventBus";
import { getDomain } from "@/utils/index.js";
// import announcement from "@/components/announcement/index.vue";
export default {
  name: "index",
  data() {
    return {
      // 定义变量
      carouseStatus: true,
    };
  },
  components: {
    inputMain,
    advantage,
    searchPaper,
    swiperThree,
    corelist,
  },
  mounted() {
    // eventBus.emit("sendOutline", 5); // 发布事件
    // window.zhuge.load("aecb263210174e7994293e947ccaedba", { debug: true });
  },
  computed: {
    // 计算属性
    // ...mapGetters(["activeIndex", "device", "requestForm", "formdataV2"]),
  },
  created() {
    // console.log("getDomain", getDomain());
    // // eventBus.on("sendOutline", this.addE); // 订阅事件
    // zhuge.track(`访问域名`, {
    //   domain: getDomain(),
    // });
    // zhuge.track("购买商品", {
    //   name: "手机",
    //   price: "iPhone XS",
    //   num: 2,
    // });
  },
  beforeDestroy() {
    // eventBus.off("sendOutline", this.addE); // 移除事件监听
  },
  methods: {
    // 定义方法
    jump() {
      this.$router.push("/dashboard");
    },
    jump2() {
      this.$router.push("/main/explore");
    },
    getList() {
      console.log(window.zhuge);
      window.zhuge.track("首页点击按钮", {
        path: "MyButton",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
// 引入scss
// @import "@/styles/variables.scss";
@import "./components/index.scss";

.swiperBg {
  background: #fff;
  padding-bottom: 40px;
}
.swiperBg2 {
  background: #f7f7f7;
  padding-bottom: 40px;
}
.swiper {
  max-width: 1100px;
  margin: 0 auto;
  border-top: 1px solid transparent; // 防止margin塌陷
}
// ddd
</style>
