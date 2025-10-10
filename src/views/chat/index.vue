<template>
  <div class="chatMain">
    <!-- <SidebarChatList
      :leftChatListStatus="leftChatListStatus"
      :localChatList="localChatList"
      @update:leftChatListStatus="updateLeftChatListStatus"
      @refresh-item="reloadChatList"
      @select-chat="handleSelectChat"
      @add-chat="addChatItem"
    /> -->
    <div class="chat-container">
      <!-- <div class="navChat">
      <el-button>清屏</el-button>
    </div> -->
      <div v-show="chatMessages.length <= 0" class="defaultText">
        <p>
          <span><img src="@/assets/images/logoMax.png" alt="" /></span>
          万象AI, 您的私人助手!
        </p>
      </div>
      <div class="chat-messages">
        <div v-for="(msg, index) in chatMessages" :key="index" class="flexChat">
          <div :class="['messageBox', msg.role]">
            <div :class="['message', msg.type]">
              <!-- 问 user -->
              <template v-if="msg.role == 'user'">
                <div
                  v-for="(item, index) in msg.content"
                  :key="'wen' + index"
                  class="userTitle infoList"
                >
                  <div v-if="item.type == 'text'" class="textBox">
                    {{ item.text }}
                  </div>
                  <div v-if="item.type == 'image_url'" class="imgBox">
                    <img :src="item.image_url.url" alt="" />
                  </div>
                  <div v-if="item.type == 'file'" class="fileAnBox">
                    <el-tag type="success">{{ item.file_detail.name }}</el-tag>
                  </div>
                </div>
                <div class="userImg">
                  <img :src="avatar" alt="" />
                </div>
              </template>
              <!-- 答 user -->
              <template v-if="msg.role == 'assistant'">
                <div class="userInfo">
                  <img :src="logoMax" alt="" class="logoMax" />
                </div>
                <div
                  v-for="(item, index) in msg.content"
                  :key="'wen' + index"
                  class="answerTitle infoList"
                >
                  <div class="textBox">
                    <div v-html="renderMarkdown(item.text)"></div>
                  </div>
                </div>
              </template>
              <!-- <div v-html="renderMarkdown(msg.content.text)"></div> -->
              <!-- <div v-if="msg.type === 'assistant'" class="responseBottom">
                <div></div>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="重新生成"
                  placement="top"
                >
                  <el-button
                    size="mini"
                    circle
                    @click="regenerateResponse(index - 1)"
                    class="reload-icon"
                  >
                    <svg class="icon svg-icon" aria-hidden="true">
                      <use xlink:href="#icon-reload"></use>
                    </svg>
                  </el-button>
                </el-tooltip>
              </div> -->
            </div>
            <button
              v-if="msg.type === 'user'"
              @click="openEditDialog(index)"
              class="edit-icon"
            >
              <svg class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icon-edit"></use>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="chatBottom GH">
        <div class="chatBottomHeader">
          <div style="display: flex; align-items: center">
            <el-tooltip
              class="item"
              effect="dark"
              content="上传图片"
              placement="top"
            >
              <div class="workItem upload-button">
                <input
                  class="file-input"
                  ref="fileInput"
                  type="file"
                  @change="onFileChange"
                  accept="image/*"
                />
                <i class="el-icon-picture-outline-round"></i>
              </div>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="上传文件"
              placement="top"
            >
              <file-select @changeFile="changeFile"></file-select>
            </el-tooltip>
            <div class="workItem">
              <el-tooltip
                class="item"
                effect="dark"
                content="新建对话"
                placement="top"
              >
                <i
                  @click="setNewDialog"
                  class="el-icon-circle-plus-outline"
                ></i>
              </el-tooltip>
            </div>
          </div>
          <div>
            <el-tooltip
              class="item"
              effect="dark"
              content="切换模型"
              placement="top"
            >
              <module-select
                v-model="modelName"
                :model_list="model_list"
              ></module-select>
              <!-- <el-dropdown>
              <div class="workItem">
                <svg class="icon svg-icon" aria-hidden="true">
                  <use xlink:href="#icon-OpenAI"></use>
                </svg>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) in model_list"
                  :key="'model' + index"
                >
                  {{ item.modelName }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
            </el-tooltip>
          </div>
        </div>

        <div class="chatBoxInput">
          <el-input
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 6 }"
            placeholder="请输入您的问题"
            v-model="inputMessage"
            @keydown.native="handleKeydown"
          >
          </el-input>
          <!-- <button @click="sendMessage">
          <i class="el-icon-search"></i>
        </button> -->
        </div>
        <div class="tipBottom">
          <div class="bottomLeft">
            <!-- <transition name="el-zoom-in-top">
              <p v-show="inputMessage.length < 20">
                <svg class="icon svg-icon" aria-hidden="true">
                  <use xlink:href="#icon-feiji"></use>
                </svg>
                <span class="tipText">Ctrl + Enter</span>
              </p>
            </transition>
            <transition name="el-zoom-in-top">
              <p v-show="inputMessage.length < 20">
                <svg class="icon svg-icon" aria-hidden="true">
                  <use xlink:href="#icon-huiche"></use>
                </svg>
                <span class="tipText">Enter</span>
              </p>
            </transition> -->
          </div>
          <div class="bottomRight">
            <el-button
              icon="el-icon-s-promotion"
              type="primary "
              @click="establishConnection"
              >发送</el-button
            >
          </div>
        </div>
        <div v-if="imgBoxList.length > 0" class="fileBottom">
          <!-- <img :src="base64Image" alt="Uploaded Image" /> -->
          <div v-for="(item, index) in imgBoxList" :key="'file' + index">
            <template v-if="item.type == 'image_url'">
              <div class="fileBox">
                <div class="delImgBtn red" @click="resetImgList">
                  <i class="el-icon-delete"></i>
                </div>
                <img :src="item.image_url.url" alt="" />
              </div>
            </template>
            <template v-if="item.type == 'file'">
              <div>
                <el-tag closable type="success" @close="resetImgList">
                  {{ item.file_detail.name }}
                </el-tag>
              </div>
            </template>
          </div>
        </div>
      </div>
      <el-dialog title="编辑消息" :visible.sync="dialogVisible" width="30%">
        <el-input type="textarea" v-model="editMessageText" rows="5"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmEdit">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getToken } from "@/utils/auth";
import { chatApi, chatAllInfo, closeSession } from "@/api/gpt";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css"; // 确保路径和样式名称正确
import { mapGetters } from "vuex";
import moduleSelect from "./component/moduleSelect.vue";
import FileSelect from "./component/FileSelect.vue";
import SidebarChatList from "./component/SidebarChatList.vue";
export default {
  components: {
    moduleSelect,
    FileSelect,
    SidebarChatList,
  },
  data() {
    return {
      leftChatListStatus: false,
      inputMessage: "",
      textarea: "",
      // 当前对话框
      isMessageSent: false,
      chatMessages: [],
      model_list: [],
      temperature: 0.7,
      token: getToken(),
      sseSource: null,
      activeIndex: 0,
      reconnectInterval: 5000,
      dialogVisible: false,
      editMessageIndex: null,
      editMessageText: "",
      logoMax: require("@/assets/images/logoMax.png"),
      chatBaseApi: "",
      // 本地对话存储
      localChatList: [],
      modelName: "gpt-4o-mini",
      imgBoxList: [], // 上传图片列表
      // 数据示例
      currentChatData: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "你好",
            },
            {
              type: "image_url",
              image_url: {
                url: "",
              },
            },
            {
              type: "file",
              file_detail: {
                name: "",
                info: "",
              },
            },
          ],
        },
        {
          role: "assistant",
          content: [
            {
              type: "text",
              text: "你好！有什么我可以帮助你的吗？",
            },
          ],
        },
      ],
      base64Image: "",
      chatId: "",
    };
  },
  created() {
    this.chatBaseApi = process.env.VUE_APP_CHAT_BASE_API;
    this.chatId = this.generateUniqueId();
    let listData = JSON.parse(localStorage.getItem("chatList"));
    this.localChatList = listData ? listData : [];
  },
  mounted() {
    this.getChatInfo();
    // this.establishConnection();
    this.addCopyAndToggleListeners();
  },
  updated() {
    this.scrollToBottom();
  },
  computed: {
    // 计算属性
    ...mapGetters(["avatar"]),
  },
  methods: {
    updateLeftChatListStatus(status) {
      this.leftChatListStatus = status;
    },
    addChatItem() {
      // 添加新对话逻辑
      this.setNewDialog();
    },
    reloadChatList() {
      // this.setNewDialog();
      this.chatId = this.generateUniqueId();
      let listData = JSON.parse(localStorage.getItem("chatList"));
      this.localChatList = listData ? listData : [];
    },
    handleSelectChat(index, id) {
      if (this.chatId == id) {
        return false;
      } else {
        this.closeSSE();
      }
      let currentItem = this.localChatList.find((item) => item.id == id);
      this.modelName = currentItem.model;
      this.temperature = currentItem.temperature;
      this.modelName = currentItem.model;
      this.chatMessages = currentItem.messages;
      this.chatId = currentItem.id;

      // 在这里处理选中的聊天逻辑
    },
    closeSSE() {
      closeSession().then((res) => {
        Ming("关闭会话成功");
      });
    },
    // 存储数据， 新建对话
    setNewDialog() {
      // 关闭链接
      this.closeSSE();
      if (this.chatMessages.length <= 0) {
        return false;
      }
      this.setLocal();
      // 新建对话，
      this.chatId = this.generateUniqueId();
      this.imgBoxList = [];
      this.chatMessages = [];
    },
    changeFile(fileInfo) {
      Ming("文件名:", fileInfo.fileName);
      Ming("返回结果:", fileInfo.result);
      this.imgBoxList = [];
      let data = {
        type: "file",
        file_detail: {
          name: fileInfo.fileName,
          info: fileInfo.result,
        },
      };
      this.imgBoxList.push(data);
    },
    resetImgList() {
      this.imgBoxList = [];
    },
    generateUniqueId() {
      const timestamp = Date.now().toString(36); // 基于当前时间的时间戳
      const randomNum = Math.random().toString(36).substr(2, 9); // 随机数
      return `id_${timestamp}_${randomNum}`;
    },

    getFile() {
      Ming("chatMessages", this.chatMessages);
      this.leftChatListStatus = !this.leftChatListStatus;
    },
    onFileChange(event) {
      if (this.imgBoxList.length >= 1) {
        this.$message({
          type: "warning",
          message: "暂支持单图片上传",
        });
        return false;
      }
      const file = event.target.files[0]; // 获取用户选择的文件
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file); // 将文件读取为Data URL
        reader.onload = () => {
          let data = {
            type: "image_url",
            image_url: {
              url: reader.result,
            },
          };
          this.imgBoxList.push(data);
        };

        reader.onerror = (error) => {
          console.error("Error reading file: ", error);
        };
      }
    },
    handleKeydown(e) {
      if (e.keyCode === 13 && !e.shiftKey) {
        // Enter key pressed without Shift
        e.preventDefault(); // Prevents the default behavior (inserting a new line)

        this.establishConnection(); // Call the function to perform the search
      }
    },
    getChatInfo() {
      // const url = `${this.chatBaseApi}chatAllInfo?token=${encodeURIComponent(
      //   this.token
      // )}`;
      // axios.get(url, { token: this.token }).then((response) => {
      chatAllInfo({ token: this.token }).then((response) => {
        this.model_list = response.result.model_list;
        this.temperature = response.result.temperature;
        Ming(response, "sssreposne", this.model_list);
      });
    },
    renderMarkdown(text) {
      const renderer = new marked.Renderer();

      renderer.code = (code, language) => {
        const validLanguage = hljs.getLanguage(language)
          ? language
          : "plaintext";
        const highlighted = hljs.highlight(validLanguage, code).value;

        return `
      <div class="code-block">
        <div class="code-header">
          <span class="language-label">${language.toUpperCase()}</span>
          <div class="code-buttons">
            <button class="toggle-btn">
              <svg class="icon svg-icon" aria-hidden="true">
                <use xlink:href="#icon-expend"></use>
              </svg></button>
            <button class="copy-btn">⧉</button>
          </div>
        </div>
        <pre><code class="language-${validLanguage}">${highlighted}</code></pre>
      </div>
    `;
      };

      marked.setOptions({
        renderer,
        highlight: (code, lang) => {
          const validLanguage = hljs.getLanguage(lang) ? lang : "plaintext";
          return hljs.highlight(validLanguage, code).value;
        },
        gfm: true,
        langPrefix: "language-",
        mangle: false,
      });

      return marked.parse(text);
    },
    setLocal() {
      let data = {
        model: this.modelName,
        stream: true,
        temperature: this.temperature,
        top_p: 1,
        id: this.chatId,
        messages: [],
      };
      data.messages = this.chatMessages;

      if (this.localChatList.length < 1) {
        // 如果列表为空，则直接添加
        this.localChatList.push(data);
      } else {
        // 查找与当前 chatId 匹配的索引
        let index = this.localChatList.findIndex(
          (item) => item.id === this.chatId
        );

        if (index !== -1) {
          // 如果找到了匹配的项，用 data 替换原来的项
          this.localChatList[index] = data;
        } else {
          // 如果没有找到匹配的项，将 data 添加到数组中
          this.localChatList.push(data);
        }
      }

      // 更新 localStorage
      localStorage.setItem("chatList", JSON.stringify(this.localChatList));
    },
    establishConnection() {
      if (!this.inputMessage.trim()) {
        return false;
      }
      const url = `${this.chatBaseApi}/createSse?token=${encodeURIComponent(
        this.token
      )}`;

      this.sseSource = new EventSource(url);

      let currentMessage = "";

      this.sseSource.onmessage = (event) => {
        if (event.data === "[DONE]") {
          currentMessage = "";
          // 存储数据
          this.setLocal();
          // alert("结束了");
        } else {
          // 添加一个基本的 JSON 检查
          if (
            event.data.trim().startsWith("{") &&
            event.data.trim().endsWith("}")
          ) {
            try {
              const parsedData = JSON.parse(event.data);
              if (parsedData.content) {
                currentMessage += parsedData.content;
                // 存储结构
                let content = [
                  {
                    type: "text",
                    text: currentMessage,
                  },
                ];
                if (
                  this.chatMessages.length &&
                  this.chatMessages[this.chatMessages.length - 1].role ===
                    "assistant"
                ) {
                  this.chatMessages[this.chatMessages.length - 1].content =
                    content;
                } else {
                  this.chatMessages.push({
                    content: content,
                    role: "assistant",
                  });
                }
              }
            } catch (error) {
              console.error(
                "Error parsing SSE data:",
                error,
                "Data:",
                event.data
              );
            }
          } else {
            console.warn("Received non-JSON data:", event.data);
          }
        }
      };
      // 判断 SSE 连接是否成功建立
      this.sseSource.onopen = () => {
        Ming("SSE connection established.");
        // 你可以在这里执行其他初始化逻辑
        if (!this.inputMessage.trim()) {
          return false;
        }
        // 只在第一次连接成功时调用 sendMessage
        if (!this.isMessageSent) {
          this.sendMessage();
          this.isMessageSent = true; // 设置标志位为 true，防止重复发送
        }
      };
      this.sseSource.onerror = () => {
        // console.error("SSE Error: attempting to reconnect");
        // this.sseSource.close();
        this.isMessageSent = false;
        // setTimeout(this.establishConnection, this.reconnectInterval);
      };
    },
    // 发送消息 组装信息
    setChatData() {
      let data = {
        role: "user",
        content: [],
      };
      if (!!this.inputMessage) {
        data.content.push({
          type: "text",
          text: this.inputMessage,
        });
      }
      if (this.imgBoxList.length > 0) {
        this.imgBoxList.forEach((item) => {
          data.content.push(item);
        });
      }
      this.chatMessages.push(data);
    },
    sendMessage() {
      zhuge.track(`GPT页面用户使用`, {});

      // const url = `${this.chatBaseApi}chat?token=${encodeURIComponent(
      //   this.token
      // )}`;
      let data = {
        msg: this.inputMessage, // 用户输入的信息，如果是上传文件，需要根据上传文件接口的返参将用户输入和返参进行拼接
        temperature: 0.7, // 温度
        model: this.modelName, // 用户所选模型，不在模型列表的请求会被后端拒绝
        image_url: "", // 图片的base64格式，如果上传图片需要该字段，不传图片则留空
      };
      if (this.imgBoxList.length > 0) {
        if (this.imgBoxList[0].type == "image_url") {
          data.image_url = this.imgBoxList[0].image_url.url;
        }
        if (this.imgBoxList[0].type == "file") {
          data.msg += this.imgBoxList[0].file_detail.info;
        }
      }
      this.setChatData();
      chatApi(data)
        .then((response) => {
          Ming("Message sent successfully:", response);
        })
        .catch((error) => {
          console.error("Error sending message:", error);
          this.$message({
            type: "error",
            message: "请求失败,请重试!",
          });
          if (error.response && error.response.status === 401) {
            this.token = getToken();
            // this.establishConnection();
          }
        });
      this.isMessageSent = false;
      this.inputMessage = "";
      this.imgBoxList = [];
    },
    scrollToBottom() {
      const container = this.$el.querySelector(".chat-messages");
      container.scrollTop = container.scrollHeight;
    },
    addCopyAndToggleListeners() {
      document.addEventListener("click", (event) => {
        if (event.target.classList.contains("copy-btn")) {
          const code = event.target
            .closest(".code-block")
            .querySelector("code").textContent;
          navigator.clipboard.writeText(code).then(() => {
            this.$message.info("代码已复制！");
          });
        }

        // Handle toggle button click
        if (event.target.closest(".toggle-btn")) {
          const pre = event.target.closest(".code-block").querySelector("pre");
          pre.style.display = pre.style.display === "none" ? "block" : "none";

          // Update the SVG icon based on the display state
          const useElement = event.target
            .closest(".toggle-btn")
            .querySelector("use");
          if (pre.style.display === "none") {
            useElement.setAttribute("xlink:href", "#icon-collapse"); // Assuming you have an icon for collapse
          } else {
            useElement.setAttribute("xlink:href", "#icon-expend");
          }
        }
      });
    },
    openEditDialog(index) {
      this.editMessageIndex = index;
      this.editMessageText = this.chatMessages[index].text;
      this.dialogVisible = true;
    },
    confirmEdit() {
      if (this.editMessageText.trim() !== "") {
        this.chatMessages[this.editMessageIndex].text = this.editMessageText;
      }
      this.dialogVisible = false;
    },
  },
  beforeDestroy() {
    if (this.sseSource) {
      this.sseSource.close();
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
