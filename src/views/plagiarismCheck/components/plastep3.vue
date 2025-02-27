<template>
  <div class="stepCon3">
    <!-- 页面名称 -->
    <div class="step3Title">
      <p>
        <i class="el-icon-takeaway-box"></i>
        <b>报告查询</b>
        <span
          >填写检测的“订单编号”，点击查询报告，然后下载对应的检测报告！</span
        >
      </p>

      <el-button type="primary" size="small" @click="beforeNext">
        返回第一步
      </el-button>
    </div>
    <div class="reportCon">
      订单号:
      <el-input
        class="inputWidth"
        v-model="orderText"
        placeholder="请输入内容"
      ></el-input>
      <el-button type="primary" @click="getList">查询</el-button>
    </div>
    <!-- <p class="intro">订单号也可从我的查重记录中获取...</p> -->

    <el-divider></el-divider>

    <div class="reportList">
      <div v-if="resultStatus" class="reportItem">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="cardTitle">{{ reportResult.title }}</span>
            <el-button
              :disabled="reportResult.status != 3"
              style="float: right; padding: 3px 0"
              type="text"
              @click="downloadFile"
              >下载报告</el-button
            >
          </div>
          <div class="cardItem">
            <p class="cardMainCon">
              查重率:
              <span>
                {{
                  reportResult.copy_percent
                    ? reportResult.copy_percent
                    : "未完成检测,暂无数据"
                }}</span
              >
            </p>
            <div><span>论文作者:</span> {{ reportResult.author }}</div>
            <div>
              <span>订单支付时间:</span>
              {{ formatPayAmountTime(reportResult.pay_amount_time) }}
            </div>
            <div><span>订单状态: </span>{{ statusDescription }}</div>
          </div>
        </el-card>
      </div>
      <el-empty v-else description="查询记录为空"></el-empty>

      <p class="introP">
        <span> 提醒：</span>系统仅保留
        <span>7 天以内</span>的检测报告，用户检测完成后请尽快下载您的检测报告!
      </p>
      <p class="introP">
        <span>检测时长:</span>
        一般付款后，<span>半小时左右</span>会出报告。如果是毕业季，高峰期间
        可能需要两小时
      </p>
      <p class="introP">
        <span>报告真伪:</span>
        很多品牌方的官网可以验证报告真伪，<span>验证为假找我们退款</span>。
      </p>
      <p class="introP">
        <span>检测失败:</span>
        如果出现检测失败，<span>请联系客服进行退款</span>。
      </p>
      <el-alert
        title="提醒：系统仅保留 7 天以内的检测报告，用户检测完成后请尽快下载您的检测报告!"
        type="error"
        show-close="false"
      >
      </el-alert>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
// import { sms } from "@/api/login";
// import webinfo from "@/components/webinfo.vue";
import { passReport } from "@/api/paper";
import { result } from "lodash";
// import eventBus from "@/utils/eventBus";

export default {
  name: "plaStep3",
  data() {
    return {
      // 定义变量
      resultStatus: false,
      orderText: "",
      reportResult: {
        author: "",
        copy_percent: "",
        down_url: "",
        pay_amount_time: "",
        title: "",
        status: "",
      },
    };
  },
  components: {
    // webinfo,
  },
  watch: {
    preViewId: {
      immediate: true,
      handler(val) {
        this.orderText = val;
        Ming("preViewIdddd", val);
      },
    },
  },

  computed: {
    // 计算属性
    ...mapGetters(["preViewId"]),
    statusDescription() {
      const statusMap = {
        0: "创建成功",
        1: "解析失败",
        2: "正在检测",
        3: "成功",
        4: "失败",
        8: "已退款",
        9: "已经删除报告",
      };
      return statusMap[this.reportResult.status] || "未知状态";
    },
  },
  methods: {
    formatPayAmountTime(isoString) {
      const date = new Date(isoString);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    downloadFile() {
      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = this.reportResult.down_url;
      // Extract the filename from the URL (optional)
      link.download = this.reportResult.title;
      // Append the anchor to the body
      document.body.appendChild(link);
      // Trigger a click on the anchor element to start the download
      link.click();

      // Clean up by removing the anchor element
      document.body.removeChild(link);
    },

    // 定义方法
    getList() {
      // 报告id保存
      let data = {
        out_trade_no: this.orderText,
      };
      passReport(data).then((res) => {
        Ming("dsssssdd", res);
        if (res.result.status < 5) {
          this.resultStatus = true;
          this.reportResult = { ...res.result };
          if (res.result.status == 3) {
            this.$message({
              type: "success",
              message: "报告已生成!",
            });
          } else {
            this.$message({
              type: "warning",
              message: "报告暂未生成,请稍后重试!",
            });
          }
        } else {
          this.$message({
            type: "warning",
            message: "报告暂未生成,请稍后重试!",
          });
        }
      });
    },
    beforeNext(index) {
      this.$emit("stepNext", 1, { index: 2 });
    },
  },
  mounted() {
    // zhuge.track(`用户查看大纲`, {
    //   大纲标题: row.title,
    //   大纲key: row.key1,
    // });
    let localPreViewId = localStorage.getItem("localPreViewId");
    this.orderText = localPreViewId;
    // eventBus.emit("sendOutline", 5); // 发布事件
    // 页面初始化
  },
  created() {
    // eventBus.on("sendOutline", this.addE); // 订阅事件
  },
  beforeDestroy() {
    // eventBus.off("sendOutline", this.addE); // 移除事件监听
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
.step3Title {
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #303133;
  b {
    margin-left: 5px;
  }
  span {
    margin-left: 20px;
    color: #909399;
    font-size: 12px;
  }
}
.stepCon3 {
  max-width: 800px;
  margin: 0 auto;
  .intro {
    margin-top: 10px;
    color: #909399;
    text-align: right;
    width: 260px;
  }
  .introP {
    color: #909399;
    text-align: right;
    text-align: center;
    margin-bottom: 20px;
    span {
      color: #f56c6c;
    }
  }
}
.reportCon {
  margin-top: 30px;
  display: flex;
  font-size: 16px;
  align-items: center;
  .inputWidth {
    width: 300px;
    margin: 0 15px;
  }
}
.cardTitle {
  font-size: 20px;
  font-weight: bold;
}
.cardItem {
  line-height: 30px;
  font-size: 16px;
  .cardMainCon {
    font-size: 20px;
    span {
      color: #f56c6c;
    }
  }
  div {
    font-weight: bold;

    span {
      color: #909399;
      font-size: 14px;
    }
  }
}
.reportItem {
  margin-bottom: 50px;
}
</style>
