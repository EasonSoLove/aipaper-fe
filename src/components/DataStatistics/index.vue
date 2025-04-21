<template>
  <div class="dataStatisticsContent">
    <!-- 页面名称 -->
    <p class="dataName">今日万象</p>
    <div class="dataMain">
      <div class="datastaItem">
        <p>大纲:</p>
        <p>{{ primaryNumber }}</p>
      </div>
      <div class="datastaItem" style="margin-left: 20px">
        <p>正文:</p>
        <p>{{ secondaryNumber }}</p>
      </div>
    </div>
  </div>
</template>
<script>
// import { mapGetters } from "vuex";
// import { sms } from "@/api/login";
// import webinfo from "@/components/webinfo.vue";

export default {
  name: "myFooter",
  data() {
    return {
      // 定义变量
      primaryNumber: 0,
      secondaryNumber: 0,
      maxValue: 4000,
    };
  },
  components: {
    // webinfo,
  },
  mounted() {
    // eventBus.emit("sendOutline", 5); // 发布事件
    // 页面初始化
    // this.generateTimeBasedNumber();
    this.generateNumbers();
    // Optionally update numbers every minute
    setInterval(this.generateNumbers, 60000);
  },
  created() {
    // eventBus.on("sendOutline", this.addE); // 订阅事件
  },
  beforeDestroy() {
    // eventBus.off("sendOutline", this.addE); // 移除事件监听
  },
  computed: {
    // 计算属性
  },
  methods: {
    // 定义方法

    generateNumbers() {
      const now = new Date();
      const totalMinutes = now.getHours() * 60 + now.getMinutes();
      const maxMinutesInADay = 24 * 60;
      const timeFactor = totalMinutes / maxMinutesInADay;

      // Calculate the primary number
      let newPrimaryNumber = Math.floor(timeFactor * this.maxValue);
      newPrimaryNumber = Math.max(newPrimaryNumber, this.primaryNumber);

      // Calculate the secondary number (between 1/3 and 1/4 of primary)
      let minSecondaryNumber = Math.floor(newPrimaryNumber / 4);
      let maxSecondaryNumber = Math.floor(newPrimaryNumber / 3);

      // Ensure the secondary number is an integer in the specified range
      let newSecondaryNumber = Math.max(
        minSecondaryNumber,
        this.secondaryNumber
      );

      // If the current secondaryNumber is greater than maxSecondaryNumber, adjust it
      newSecondaryNumber = Math.min(newSecondaryNumber, maxSecondaryNumber);

      this.primaryNumber = newPrimaryNumber;
      this.secondaryNumber = newSecondaryNumber;
    },

    // Example usage
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
.dataStatisticsContent {
  height: 80px;
  background: #ffffff80;
  border: 1px solid #ffffff;
  border-radius: 8px;
  padding: 16px;
  font-size: 20px;
  padding-right: 20px;
  color: #1b2126;
  .dataName {
    font-weight: bold;
  }
  .dataMain {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 16px;
    margin-top: 5px;
  }
  .datastaItem {
    align-items: center;
    display: flex;
    p:first-child {
      color: #000;
    }
    p:last-child {
      color: #35f;
      font-weight: bold;
      font-size: 20px;
      margin-left: 8px;
    }
  }
}
</style>
