<template>
  <div>
    <!-- 页面名称 -->
    <div class="pdfShowBox">
      <div id="step3Top"></div>
      <div class="stickyBox">
        <div class="pdfNavbar">
          <div class="pdfNavLeft">
            <el-tooltip
              class="item"
              effect="dark"
              content="返回第一步,继续创作"
              placement="top"
            >
              <div @click="returnStep" class="pdfLeftBtn g_poin">
                <i class="el-icon-back"></i>
                <p>返回第一步</p>
              </div>
            </el-tooltip>
            <!-- <div class="pdfNavItem">
              <i class="el-icon-edit"></i>
              <span>编辑Word版论文</span>
            </div>
            <div class="pdfNavItem">
              <i class="el-icon-edit"></i>
              <span>编辑Latex版论文</span>
            </div> -->
            <div @click="$jumpUrl('/main/reduceRepetition')" class="pdfNavItem">
              <i class="el-icon-film"></i>
              <span>{{ $t("route.reduceRepetition") }}</span>
            </div>
          </div>

          <div
            @click="downLoadPaper"
            v-loading="downStatus"
            v-if="paper_stage == '2'"
            class="pdfNavRight g_poin"
          >
            <i class="el-icon-download"></i>
            <p>下载论文</p>
          </div>
        </div>
      </div>
      <!-- <button @click="startPolling">开始轮询</button>
      <button @click="stopPolling">停止轮询</button> -->

      <div v-if="paperProductStatus" style="height: 30000px">
        <iframe :src="step3PdfUrl" style="width: 100%; height: 100%"></iframe>
      </div>
      <div v-else>
        <el-row style="padding: 40px" :gutter="20">
          <div class="step3Left">
            <el-timeline v-if="oldStr">
              <el-timeline-item
                v-for="(activity, index) in task_info_list"
                :key="index"
                :type="activity.task_stage == 1 ? 'primary' : 'success'"
                :timestamp="activity.task_time"
                placement="top"
              >
                <el-card>
                  <p class="gp0">{{ activity.task_theme }}</p>
                  <p class="gp2">
                    <vue-markdown>
                      {{ activity.task_reasoner }}
                    </vue-markdown>
                  </p>
                  <p class="gp1">
                    <vue-markdown>
                      {{ activity.task_content }}
                    </vue-markdown>
                  </p>
                </el-card>
              </el-timeline-item>
              <el-timeline-item
                v-if="JSON.stringify(steamStr) !== '{}'"
                :timestamp="oldStr.task_time"
                placement="top"
              >
                <el-card>
                  <p class="gp0">{{ steamStr.task_theme }}</p>
                  <p v-html="markdownReasoner" class="gp2"></p>
                  <p v-html="markdownContent" class="gp1"></p>

                  <!-- <p class="gp1">
                    <vue-markdown>
                      {{ steamStr.task_content }}
                    </vue-markdown>
                  </p> -->
                </el-card>
              </el-timeline-item>
            </el-timeline>

            <el-timeline v-else>
              <el-timeline-item :timestamp="nowTime" placement="top">
                <el-card>
                  <p>您当前订单排队中, 请稍等...</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
            <div
              v-if="lastStepStatus && paper_stage != 2"
              style="text-align: center"
            >
              <p>
                <i class="el-icon-loading"></i>
                下一步正在生成中, 请稍等....
              </p>
            </div>
            <div id="step3Bottom"></div>
          </div>
        </el-row>
      </div>

      <div ref="gzhRef" class="gzhDialog1">
        <p style="margin-top: 5px; padding: 10px; line-height: 18px">
          <span style="font-size: 14px"> Tips: </span>
          此页面可以放心关闭,生成结束可以在
          <b style="color: #409eff">我的订单</b>查看
        </p>
      </div>
      <div ref="gzhRef" class="gzhDialog">
        <div class="imgProgressImg">
          <img src="@/assets/images/outline/gongzonghao.jpg" alt="" />
        </div>
        <p style="padding: 0 10px">关注微信公众号</p>
        <p style="margin-top: 5px; padding: 0 10px; padding-bottom: 10px">
          获取大纲及论文实时生成进度！
        </p>
      </div>
    </div>
    <el-dialog
      title="温馨提示"
      :visible.sync="dialogVisible"
      :width="device == 'mobile' ? '90%' : '30%'"
    >
      <p style="line-height: 24px">
        注意：此为预览版，只展示全文的50%。若满意请支付尾款，解锁全文并支持下载，下载有更多的惊喜哟~
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
// import { sms } from "@/api/login";
// import webinfo from "@/components/webinfo.vue";
import eventBus from "@/utils/eventBus";
import VueMarkdown from "vue-markdown";
import { marked } from "marked";
import PdfViewer from "./PdfViewer.vue";
import { paperPack, orderDetailById } from "@/api/user";
import {
  startUniquePaperPolling,
  stopPaperPolling,
} from "@/utils/step3polling";

export default {
  name: "step3",
  data() {
    return {
      oldStr: {
        task_time: "",
        task_theme: "",
        task_reasoner: "",
        task_content: "",
      },
      nowTime: "",
      steamStr: {
        task_theme: "",
        task_reasoner: "",
        task_content: "",
      },
      old_paper_info_list_length: 0,
      newStr: "",
      paperProductStatus: false,
      // 定义变量
      dialogVisible: false,
      data: "",
      // pdfUrl: require("@/assets/third_output.pdf"),
      pdfUrl: "",
      downStatus: false,
      out_trade_no: "",
      paper_stage: 1,
      lastStepStatus: true,
      task_info_list: [],
      firstTag: 0,
      oldLength: 0,
      newLength: 0,
      paper_info_list: [],
      displayedChars: [], // 用于逐个展示的字符列表
      intervalId: null, // 定时器ID，用于清除定时器
    };
  },
  components: {
    PdfViewer,
    VueMarkdown,
  },
  computed: {
    // 计算属性
    ...mapGetters(["step3PdfUrl", "currentOrder", "activeIndex", "device"]),
    markdownContent() {
      // 使用Markdown解析器处理内容
      return marked(this.steamStr.task_content);
    },
    markdownReasoner() {
      // 使用Markdown解析器处理内容
      return marked(this.steamStr.task_reasoner);
    },
  },

  watch: {
    activeIndex: {
      handler(val) {
        this.$log("activeIndexval", val);
        if (val !== 3) {
          this.stopPolling();
        }
        // 更新首页大纲列表
        // eventBus.emit("step0Reload", true); // 发布事件
      },
    },
    step3PdfUrl(newValue, oldValue) {
      this.dialogVisible = false;
      if (newValue) {
        this.$scrollTo("#step3Top", 500, { offset: -150 });
        this.paperProductStatus = true;
      }
      // 在这里执行你需要的逻辑
      if (this.currentOrder.payment_status == "TRADE_DEPOSIT_SUCCESS") {
        let _this = this;
        this.$nextTick(() => {
          setTimeout(() => {
            _this.dialogVisible = true;
          }, 1000);
        });
      } else {
        let _this = this;
        this.$nextTick(() => {
          setTimeout(() => {
            _this.dialogVisible = false;
          }, 1000);
        });
      }
    },

    pdfUrl: {
      handler(newVal, oldVal) {
        this.pdfUrl = newVal;

        if (this.currentOrder.payment_status == "TRADE_SUCCESS") {
          this.dialogVisible = true;
        } else {
          this.dialogVisible = false;
        }
      },
      deep: true, // 启用深度监听
    },
  },
  mounted() {
    // eventBus.emit("sendOutline", 5); // 发布事件
    // 页面初始化
    this.startPolling();
    this.$scrollTo("#step3Top", 500, { offset: -150 });
    console.log("step3初始化");
  },
  created() {
    eventBus.on("startStep3Polling", this.startPolling); // 订阅事件
  },
  beforeDestroy() {
    eventBus.off("startStep3Polling", this.startPolling); // 移除事件监听
    this.stopPolling();
    // 清除定时器以避免组件销毁后仍然运行
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  },

  methods: {
    getCurrentTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 月份从0开始，需要加1
      const day = now.getDate().toString().padStart(2, "0");
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    streamOut() {
      this.stopPolling();
      // 清空当前展示内容
      this.steamStr = {
        task_theme: "",
        task_reasoner: "",
        task_content: "",
      };

      // 确保没有遗留的定时器
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }

      const properties = ["task_theme", "task_reasoner", "task_content"];
      let currentPropertyIndex = 0;
      let index = 0; // 当前展示的字符索引

      // 定义一个函数用于更新当前处理的属性
      const updateDisplay = () => {
        const currentProperty = properties[currentPropertyIndex];
        const currentStr = this.oldStr[currentProperty];

        if (index < currentStr.length) {
          // console.log(currentStr[index]);
          this.steamStr[currentProperty] += currentStr[index];
          index++;
        } else {
          // 当前属性完成，切换到下一个属性
          currentPropertyIndex++;
          if (currentPropertyIndex < properties.length) {
            index = 0; // 重置索引以处理下一个属性
          } else {
            // 如果所有属性都展示完成，清除定时器
            clearInterval(this.intervalId);
            this.intervalId = null;
            // 生成成功, 停止循环
            if (this.paper_stage != 2) {
              if (this.newLength > 0) {
                this.oldLength = this.newLength;
              }
              console.log("this.oldLength", this.oldLength);
              let _this = this;
              setTimeout(() => {
                _this.startPolling();
              }, 1000);
            }
          }
        }
      };

      // 每100毫秒展示一个字符
      this.intervalId = setInterval(updateDisplay, 50);
    },
    // 启动轮询
    startPolling(data) {
      this.lastStepStatus = true;
      console.log("this.oldStr", this.oldStr);
      const requestData = {
        out_trade_no: "",
        task_node: this.oldStr.task_node,
        // out_trade_no: "9d4eebbf-3d87-432b-bb88-d53475a2df00",
      }; // 请求数据
      if (data && data.out_trade_no) {
        requestData.out_trade_no = data.out_trade_no;
      } else {
        requestData.out_trade_no = this.currentOrder.out_trade_no;
      }
      // 开始轮询，并传入回调处理结果
      startUniquePaperPolling(requestData, (result) => {
        console.log("轮询完成，接收到结果：", result);
        this.nowTime = this.getCurrentTime();
        // 处理接收到的结果
        // 比如更新组件数据或触发其他逻辑
        this.handlePollingResult(result);
      });
    },

    handlePollingResult(result) {
      // 处理轮询结果的逻辑
      this.paper_stage = result.paper_stage;
      // 如果生成成功展示pdf, 获取下载链接
      if (this.paper_stage == 2) {
        let data = { key: this.currentOrder.out_trade_no };
        orderDetailById(data).then((res) => {
          console.log(res, res, res);
          let paperTitle = res.result.outline.title;
          // 如果是附件就下载
          let wordTypeList = [
            "EXTRA_PROPOSAL",
            "EXTRA_TASK_ASSIGNMENT",
            "EXTRA_JOURNAL_REVIEWED",
          ];
          if (wordTypeList.includes(res.result.order.order_type)) {
            // word
            // 提示用户下载
            this.$confirm("文件已生成, 是否下载?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                // 下载word
                paperPack({ out_trade_no: res.result.order.out_trade_no }).then(
                  (res) => {
                    // window.open(res.result.zip_url, "_blank");
                    // Create a temporary link element
                    const link = document.createElement("a");
                    link.href = res.result.zip_url;

                    // Set the download attribute to suggest a filename
                    // let title = this.requestForm.title ? this.requestForm.title : 'outline'
                    link.download = paperTitle + ".zip"; // Change 'filename.zip' to the desired file name

                    // Append the link to the body
                    document.body.appendChild(link);

                    // Programmatically click the link to trigger the download
                    link.click();

                    // Remove the link from the document
                    document.body.removeChild(link);
                    // let _this = this;
                    // setTimeout(() => {
                    //   _this.$message({
                    //     type: "success",
                    //     message: "已开始下载文件!",
                    //   });
                    //   _this.$store.dispatch("app/setActiveIndex", 0);
                    //   eventBus.emit("outlineGen", this.requestForm);
                    // }, 1000);
                    this.$message({
                      type: "success",
                      message: "您的文件已开始下载!",
                    });
                    this.returnStep();
                  }
                );
                // 结束
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "我的订单可下载已生成文件!",
                });
              });
          } else {
            // 如果是正文, 就展示
            this.$store.dispatch(
              "app/togglePDFUrl",
              res.result.order_item_response[0].case.file_urls.pdf
            );
          }
        });
        this.paperProductStatus = true;

        return false;
      }

      // 没有成功 走一下判断 流式输出
      this.task_info_list = result.task_info_list
        ? result.task_info_list.slice(0, -1)
        : [];
      // console.log(this.task_info_list, "task_info_list");
      let lastTimeLine =
        result.task_info_list[result.task_info_list.length - 1];
      // console.log(lastTimeLine, "lastTimeLine");

      // 需要做渐入的
      this.oldStr = JSON.parse(JSON.stringify(lastTimeLine));

      // 判断是不是第一次进入, 记录当前节点长度
      if (this.firstTag == 0) {
        this.oldLength = result.task_info_list.length;
      } else {
        this.newLength = result.task_info_list.length;
      }
      console.log("处理轮询结果this.oldStr：", this.oldStr);
      console.log("处理轮询结果：", result);
      console.log("轮询结果页", this.newLength, this.oldLength);
      let _this = this;
      setTimeout(() => {
        if (_this.firstTag == 0) {
          _this.scrollBottom();

          _this.streamOut();
          _this.firstTag = 1;
        } else {
          if (this.newLength > this.oldLength) {
            _this.scrollBottom();

            _this.streamOut();
            _this.firstTag = 1;
          }
        }
      }, 1000);
    },
    scrollBottom() {
      this.$scrollTo("#step3Bottom", 500, { offset: -150 });
    },
    // 停止轮询
    stopPolling() {
      this.lastStepStatus = false;
      stopPaperPolling();
    },
    returnStep() {
      this.stopPolling();

      this.$store.dispatch("app/setActiveIndex", 0);
    },
    downLoadPaper: _.debounce(function (item) {
      this.downStatus = true;
      zhuge.track(`下载论文`, {
        路径: "step3",
        订单Out_trade_no: this.currentOrder.out_trade_no,
      });
      paperPack({ out_trade_no: this.currentOrder.out_trade_no }).then(
        (res) => {
          this.downStatus = false;
          // window.open(res.result.zip_url, "_blank");
          // Create a temporary link element
          const link = document.createElement("a");
          link.href = res.result.zip_url;
          const regex = /\/([^\/]+)\.zip$/;
          const match = res.result.zip_url.match(regex);
          // Set the download attribute to suggest a filename

          match + ".zip"; // Change 'filename.zip' to the desired file name
          if (match && match[1]) {
            link.download = match[1] + ".zip";
          } else {
            link.download = "论文" + ".zip";
          }
          // Append the link to the body
          document.body.appendChild(link);

          // Programmatically click the link to trigger the download
          link.click();

          // Remove the link from the document
          document.body.removeChild(link);
        }
      );
    }, 1000),
    // 定义方法
    onViewFile(item) {
      if (item.fileName.split(".").pop() === "pdf") {
        let url =
          "/pdfjs/web/viewer.html?file=" +
          process.env.VUE_APP_BASE_API +
          item.filePath;
        window.open(url, "_blank");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.gp0,
.gp1,
.gp2 {
  margin-top: 20px;
}
.gp0 {
  margin-top: 0px;

  font-size: 16px;
  font-weight: bold;
}
.step3Left {
  line-height: 24px;

  blockquote {
    line-height: 40px;
  }
}
::v-deep(.step3Left code) {
  display: block;
  padding: 10px;
  border: 1px solid #ddd;
  white-space: pre-wrap;
  word-wrap: break-word;
  background: #f6f6f6;
  margin: 20px 0;
}
// 引入scss
// @import "@/styles/variables.scss";
// @import './index.scss';

// 媒体查询
// @media only screen and (max-width: 939px) {
// }
.pdfBox {
}
.pdfShowBox {
  background-color: #fff;
  position: relative;
}
.iframe-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 这个比例可以根据你的需求调整 */
  height: 0;
  overflow: hidden;
}
.iframe-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.my-bullet {
  width: 0.1rem;
  height: 0.1rem;
  display: inline-block;
  border-radius: 50%;
  background: #b7b6b9;

  &:nth-child(2) {
    margin: 0 0.1rem;
  }
}

.my-bullet-active {
  background: #fd882e;
}

.pdfNavbar {
  max-width: 1120px;
  // margin: 0 auto;

  height: 64px;
  background: rgba(245, 248, 255, 0.95);
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  border: 1px solid #cccccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;

  .pdfNavItem {
    margin-right: 40px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #3355ff;
    line-height: 22px;
    text-align: left;
    font-style: normal;

    span {
      margin-left: 10px;
    }

    &:hover {
      cursor: pointer;
    }
  }

  .pdfNavLeft {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: space-between;
  }

  .pdfNavRight {
    width: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    background: #3355ff;
    border-radius: 20px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: #ffffff;
    line-height: 22px;
    text-align: left;
    font-style: normal;
  }
  .pdfLeftBtn {
    width: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    background: #3355ff;
    border-radius: 20px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: #ffffff;
    line-height: 22px;
    text-align: left;
    font-style: normal;
    margin-right: 10px;
  }
}

.stickyBox {
  position: relative;
}
.backStep {
  font-size: 30px;
  background: #3355ff;
  color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
}
.itemTitle {
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 0.875rem;
  color: #000;
  height: 1.75rem;
  line-height: 1.75rem;
  font-weight: 700;
  padding-left: 0.3125rem;
  border-radius: 0.3125rem;
  margin: 30px 0 10px 0;
}
.contentItem {
  background: #f7f9fa;
  padding: 10px 20px;
}
.sectionTitle {
  display: inline-block;
  white-space: nowrap; /* 防止文本换行 */
  text-overflow: ellipsis; /* 溢出部分用省略号表示 */
  font-size: 14px;
  font-weight: bold;
  color: #000;
  height: 28px;
  line-height: 28px;
  font-weight: bold;
  padding-left: 5px;
  border-radius: 5px;
}
.sectionContent {
  border-radius: 5px;
  margin: 5px;
  line-height: 24px;
  font-size: 14px;
  // padding-top: 10px;
  padding: 10px;
  background: #f7f9fa;
}

// 跳动效果
.wave-char {
  display: inline-block;
  transform-origin: bottom;
  animation: waveJump 1s ease-in-out infinite;
}
.gzhDialog1 {
  position: absolute;
  bottom: 270px;
  right: -193px;
  width: 187px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 5px;
  justify-content: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
}
.gzhDialog {
  position: absolute;
  bottom: 50px;
  right: -190px;

  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 5px;
  justify-content: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
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
/* 跳跃波浪效果 */
@keyframes waveJump {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-1px); /* 跳跃高度 */
  }
}
</style>
