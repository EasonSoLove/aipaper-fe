<template>
  <div class="step1Box">
    <!-- 编辑大纲，生成全文 -->
    <div class="outlineIntroNew">
      <!-- 滚动标签 -->
      <div id="step1"></div>
      <p class="introTitle">编辑大纲，生成全文</p>
      <p class="introSubtitle">
        🔔
        大纲可直接<span>点击编辑</span>，点击<span>AI帮写</span>可智能为项目查漏补缺。点击小节右侧<span>增删图表</span>，为小节增加<span>数据(表)、图、公式、代码段</span>，支持对章节,
        小节进行<span>增加、删减</span>
      </p>
    </div>

    <!-- 论文标题 -->
    <p class="oulineTitlePaper"><span>题目: </span>{{ requestForm.title }}</p>
    <p class="outlineTitleDesc">
      <span>科目: </span
      >{{
        requestForm.field && typeof requestForm.field == "string"
          ? requestForm.field
          : requestForm.field[1]
      }}
      <span style="margin-left: 50px">类型: </span>
      {{ requestForm.type ? requestForm.type : "暂无" }}
    </p>
    <div class="newProgressBox">
      <div class="ProGressLEft">
        <!-- 页面名称 -->
        <div v-if="errLineStatus" class="progressBox">
          <div class="pgBoxEl">
            <el-progress
              :text-inside="true"
              :percentage="currentNumber"
              type="circle"
              :width="150"
            ></el-progress>
            <div class="progressText">
              <p>{{ outlineStatusText }}<i class="el-icon-loading"></i></p>
              <p class="progressNumber">{{ currentNumber }}%</p>
            </div>
            <p
              style="
                position: absolute;
                bottom: -30px;
                left: -50px;
                width: 260px;
                font-size: 14px;
                color: #5c6166;
              "
            >
              深度求索，慢但质量高，预计5分钟完成
            </p>
          </div>
        </div>
        <div v-else class="errText outlineTitleDesc">
          <el-link
            @click="reloadOutline"
            style="font-size: 16px"
            icon="el-icon-refresh"
          >
            大纲生成失败, 请点击重试...
          </el-link>
          <p
            style="font-size: 14px; margin-top: 10px; width: 300px; color: #333"
          >
            由于部分参考文献不符合规范，万象学术模型无法学习，请返回
            <span class="red">文献列表处替换或删除</span
            >有问题的文献后重新生成大纲！
          </p>
        </div>
      </div>
      <div class="newProgressRight">
        <div class="imgProgressImg">
          <img src="@/assets/images/outline/gongzonghao.jpg" alt="" />
        </div>
        <p style="padding: 0 10px">关注微信公众号</p>
        <p style="margin-top: 5px; padding: 0 10px; padding-bottom: 10px">
          获取大纲及论文实时生成进度！
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
// import { sms } from "@/api/login";
// import webinfo from "@/components/webinfo.vue";
// import eventBus from "@/utils/eventBus";
import { title } from "@/settings";
import eventBus from "@/utils/eventBus";

export default {
  name: "step1",
  data() {
    return {
      // 定义变量
      currentNumber: 0,
      errLineStatus: true,
      title: "艺术批评的时间作用及发展历程",
      descri: "1201 艺术学理论类",
      intervalId: null,
      currentIndex: 0,
      error_message: "",
      textArr: ["分析题目", "检索文献", "AI创作", "规划章节", "生成大纲."],
    };
  },
  components: {
    // webinfo,
  },
  mounted() {
    // eventBus.emit("sendOutline", 5); // 发布事件
    // 页面初始化
  },
  created() {
    eventBus.on("errorOutline", this.errLine); // 订阅事件

    eventBus.on("beginTime", this.addE); // 订阅事件
  },
  beforeDestroy() {
    eventBus.off("errorOutline", this.errLine); // 移除事件监听
    eventBus.off("beginTime", this.addE); // 移除事件监听
  },
  computed: {
    ...mapGetters(["requestForm", "outlineVersion"]),
    // 计算属性
    outlineStatusText() {
      return this.textArr[this.currentIndex];
    },
  },
  methods: {
    reloadOutline() {
      eventBus.emit(
        "reloadOutline",
        this.outlineVersion ? this.outlineVersion : "v1"
      );
    },
    errLine(res) {
      console.log("errLine11111111111", res.error_message);
      // this.error_message = res.error_message;
      clearInterval(this.intervalId); // 达到目标数字时清除定时器
      this.errLineStatus = false;
    },
    // 定义方法
    // 生成大纲
    addE(index) {
      this.errLineStatus = true;
      clearInterval(this.intervalId); // 达到目标数字时清除定时器
      this.currentNumber = 0;
      this.countUpToHundred(index);
    },

    countUpToHundred(seconds) {
      this.currentNumber = 0;
      const targetNumber = 99;
      const totalSteps = targetNumber - this.currentNumber;

      // 计算每一步所需的时间（毫秒）
      const stepTimeMs = (seconds * 1000) / totalSteps;

      this.intervalId = setInterval(() => {
        this.currentNumber++;
        if (this.currentNumber == 5) {
          this.currentIndex = 1;
        }
        if (this.currentNumber == 10) {
          this.currentIndex = 2;
        }
        if (this.currentNumber == 20) {
          this.currentIndex = 3;
        }
        if (this.currentNumber == 30) {
          this.currentIndex = 4;
        }
        if (this.currentNumber >= targetNumber) {
          clearInterval(this.intervalId); // 达到目标数字时清除定时器
          this.getList();
        }
      }, stepTimeMs);
    },
    // 渲染大纲
    getList() {
      // this.outLineStatus = false;
      // 判断展示那个大纲
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
.step1Box {
  // width: ;
  height: 500px;
  background-color: #fff;
  max-width: 1200px;
  margin-top: 20px;
}

.progressBox {
  margin-top: 30px;
  width: 150px;
  height: 150px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .pgBoxEl {
    width: 150px;
    position: relative;
  }

  .progressNumber {
    margin-top: 10px;
  }

  .progressText {
    position: absolute;
    font-weight: bold;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    font-size: 18px;

    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
}

.outlineIntroNew {
  max-width: 688px;
  padding-top: 50px;
  margin: 0 auto;
  text-align: center;

  .introTitle {
    font-size: 16px;
    font-weight: bold;
    color: #3b82f6;
  }

  .introSubtitle {
    font-size: 14px;
    line-height: 20px;
    margin-top: 30px;

    span {
      color: #d75300;
    }
  }
}

.oulineTitlePaper {
  font-size: 20px;
  color: #000;
  margin: 20px 0;
  margin-top: 30px;
  text-align: center;
  font-weight: bold;
}

.outlineTitleDesc {
  text-align: center;
  font-weight: bold;
  font-size: 16px;
}
.errText {
  margin-top: 40px;
}

.newProgressBox {
  display: flex;
  align-items: center;
  justify-content: center;
}
.newProgressRight {
  margin-left: 130px;
  margin-right: -50px;
  position: relative;
  top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 5px;
  justify-content: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.imgProgressImg {
  padding-top: 20px;
  width: 150px;
  height: 170px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
