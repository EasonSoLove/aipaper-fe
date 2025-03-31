<template>
  <div>
    <!-- 页面名称 -->
    <div class="lineDataBox">
      <data-statistics></data-statistics>
    </div>
    <div class="mainBackground">
      <div class="leftMainText">
        <p>MIXPAPER</p>
        <p>万象写作</p>
      </div>

      <!-- <div class="mainInput">
        <p class="inputName">AI 论文快查</p>
        <div class="selectText">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="inputBox">
          <input placeholder="输入你想查找的论文信息" type="text" />
        </div>
        <div class="searchIconBox">
          <span>
            <img src="@/assets/images/search.png" alt="" />
          </span>
        </div>
      </div> -->
      <div class="inputDesc g_poin" @click="$jumpUrl('/main/writepaper')">
        <p>
          万象写作是由浅思科技自主研发的AI论文辅助写作系统，荣获300w美金的融资，由清华博士，斯坦福博士等基于人工智能、大模型等前沿技术，打造的一站式学术辅助写作平台。为用户提供学术创新，论文创作，润色，改写，降重，降AIGC率等服务。
        </p>
      </div>
      <div class="inputBtn" @click="$jumpUrl('/main/writepaper')">
        <img src="@/assets/images/index/home_banner01_btn_pc.png" alt="" />
      </div>
    </div>
  </div>
</template>
<script>
// import { mapGetters } from "vuex";
// import { sms } from "@/api/login";
import dataStatistics from "@/components/DataStatistics/index.vue";
// import eventBus from "@/utils/eventBus";

export default {
  name: "searchPaper",
  data() {
    return {
      // 定义变量
      options: [
        {
          value: "选项1",
          label: "综合",
        },
        {
          value: "选项2",
          label: "科学",
        },
        {
          value: "选项3",
          label: "政治",
        },
      ],
      value: "综合",
    };
  },
  components: {
    dataStatistics,
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
  },
  methods: {
    // 定义方法
  },
};
</script>
<style lang="scss" scoped>
// 引入scss
@import "@/styles/variables.scss";

//
// 媒体查询
// @media only screen and (max-width: 939px) {
// }

.mainBackground {
  background: url("../../../assets/images/index/home_banner01_01_pc.png")
    no-repeat center center; // 将背景居中
  background-size: cover; // 确保背景图片覆盖整个容器
  height: 360px;
}

@import "./index.scss";
.lineDataBox {
  position: fixed;
  z-index: 3;
  top: 100px;
  left: 20px;
}
.inputBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  img {
    width: 178px;
    height: 44px;
  }
}
</style>
