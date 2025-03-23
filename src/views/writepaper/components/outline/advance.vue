<template>
  <div v-loading="loading" class="container">
    <header class="header footer">
      <el-button
        type="primary"
        :disabled="!!formdataV2.key1"
        @click="getkeyWords"
        round
        style="width: 100%"
        >生成检索关键词</el-button
      >
    </header>
    <div class="keywordBox">
      <div class="keyLeft">
        <p style="font-size: 14px; font-weight: bold">
          中文关键词
          <span style="font-size: 10px; margin-left: 8px; color: #606266"
            >关键词上限4个,可删除后自定义关键词</span
          >
        </p>
        <ul>
          <li
            v-for="(keyword, index) in formdataV2.search_cn_keywords"
            :key="index"
          >
            {{ keyword }}
            <el-button
              @click="removeKeyword('cn', index)"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              circle
            ></el-button>
          </li>
        </ul>
        <div class="keyBottom">
          <el-input
            placeholder="关键词上限4个,可删除后自定义关键词"
            v-model="newCnKeyword"
            @keyup.enter="addKeyword('cn')"
            :disabled="
              formdataV2.search_cn_keywords &&
              formdataV2.search_cn_keywords.length >= 4
            "
            class="input-with-select"
          >
            <el-button
              slot="append"
              @click="addKeyword('cn')"
              icon="el-icon-circle-plus-outline"
              >添加</el-button
            >
          </el-input>
        </div>
      </div>
      <div class="keyRight">
        <p style="font-size: 14px; font-weight: bold">
          英文关键词
          <span style="font-size: 10px; margin-left: 8px; color: #606266"
            >关键词上限4个,可删除后自定义关键词</span
          >
        </p>
        <ul>
          <li
            v-for="(keyword, index) in formdataV2.search_en_keywords"
            :key="index"
          >
            {{ keyword }}
            <el-button
              @click="removeKeyword('en', index)"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              circle
            ></el-button>
          </li>
        </ul>
        <div class="keyBottom">
          <el-input
            placeholder="关键词上限4个,可删除后自定义关键词"
            v-model="newEnKeyword"
            @keyup.enter="addKeyword('en')"
            :disabled="
              formdataV2.search_en_keywords &&
              formdataV2.search_en_keywords.length >= 4
            "
            class="input-with-select"
          >
            <el-button
              slot="append"
              @click="addKeyword('en')"
              icon="el-icon-circle-plus-outline"
              >添加</el-button
            >
          </el-input>
        </div>
      </div>
    </div>
    <div>
      <div class="button-group">
        <el-button
          type="primary"
          @click="seachPaperS"
          round
          style="width: 100%"
        >
          根据关键词, 检索文献
        </el-button>
      </div>
      <div class="content">
        <div class="sidebar">
          <h3>用户上传文献列表</h3>
          <div
            class="sidebar-item"
            v-for="(paper, index) in user_upload_paper_fe_lists"
            :key="`ref-${index}`"
            :class="paper.is_relevant === 'yes' ? 'selected-item' : ''"
          >
            <div class="paper-card">
              <div class="paper-header">
                <h4>{{ paper.title }}</h4>
                <el-button
                  type="success"
                  size="mini"
                  :plain="paper.is_relevant !== 'yes'"
                  @click="togglePaperSelection(paper)"
                >
                  {{ paper.is_relevant === "yes" ? "已选中" : "选择" }}
                </el-button>
              </div>
              <p :class="{ abstract: true, expanded: paper.isExpanded }">
                <span v-if="!paper.isExpanded" class="abstract-content">
                  {{ paper.abstract }}
                </span>
                <span v-else>
                  {{ paper.abstract }}
                </span>
                <span
                  class="toggle-button"
                  @click="paper.isExpanded = !paper.isExpanded"
                >
                  {{ paper.isExpanded ? "收起" : "展开" }}
                </span>
              </p>
              <div class="paper-footer">
                <p class="formPaper">
                  <img
                    style="height: 16px; width: 16px"
                    src="@/assets/images/index/blue.png"
                    alt=""
                  />
                  {{ paper.database }}
                </p>
                <p>
                  作者: <span>{{ paper.authors.join(", ") }}</span>
                </p>
                <p class="dateP">
                  日期: <span>{{ paper.date }}</span>
                </p>
              </div>
            </div>
          </div>
          <hr />
          <h3>系统检索文献列表</h3>

          <div
            class="sidebar-item"
            v-for="(paper, index) in reference_paper_fe_lists"
            :key="`ref-${index}`"
            :class="paper.is_relevant === 'yes' ? 'selected-item' : ''"
          >
            <div class="paper-card">
              <div class="paper-header">
                <h4>{{ paper.title }}</h4>
                <el-button
                  type="success"
                  size="mini"
                  :plain="paper.is_relevant !== 'yes'"
                  @click="togglePaperSelection(paper)"
                >
                  {{ paper.is_relevant === "yes" ? "已选中" : "选择" }}
                </el-button>
              </div>
              <p :class="{ abstract: true, expanded: paper.isExpanded }">
                <span v-if="!paper.isExpanded" class="abstract-content">
                  {{ paper.abstract }}
                </span>
                <span v-else>
                  {{ paper.abstract }}
                </span>
                <span class="toggle-button" @click="paperExpandClick(paper)">
                  {{ paper.isExpanded ? "收起" : "展开" }}
                </span>
              </p>
              <div class="paper-footer">
                <p class="formPaper">
                  <img
                    style="height: 16px; width: 16px"
                    src="@/assets/images/index/blue.png"
                    alt=""
                  />
                  {{ paper.database }}
                </p>
                <p>
                  作者: <span>{{ paper.authors.join(", ") }}</span>
                </p>
                <p class="dateP">
                  日期: <span>{{ paper.date }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="content-main">
          <h3>已选中的论文</h3>
          <div v-for="(paper, index) in selectedPapers" :key="index">
            <div class="paper-card">
              <div class="paper-header">
                <h4>{{ paper.title }}</h4>
                <el-button
                  type="danger"
                  size="mini"
                  @click="delSelectPaper(paper)"
                  icon="el-icon-delete"
                  circle
                ></el-button>
              </div>
              <p :class="{ abstract: true, expanded: paper.isExpanded }">
                <span v-if="!paper.isExpanded" class="abstract-content">
                  {{ paper.abstract }}
                </span>
                <span v-else>
                  {{ paper.abstract }}
                </span>
                <span
                  class="toggle-button"
                  @click="paper.isExpanded = !paper.isExpanded"
                >
                  {{ paper.isExpanded ? "收起" : "展开" }}
                </span>
              </p>
              <div class="paper-footer">
                <p class="formPaper">
                  <img
                    style="height: 16px; width: 16px"
                    src="@/assets/images/index/blue.png"
                    alt=""
                  />
                  {{ paper.database }}
                </p>
                <p>作者: {{ paper.authors.join(", ") }}</p>
                <p>日期: {{ paper.date }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-loading="uploading" class="upload-section">
          <div class="upload-box">
            <el-upload
              class="upload-demo"
              style="width: 100%"
              drag
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :before-upload="beforeUpload"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                <p style="font-size: 14px; margin-bottom: 20px">
                  将文件拖到此处，或<em>点击上传</em>
                </p>
                <p style="font-size: 14px; margin-bottom: 10px">
                  只能上传PDF文件，且不超过10M
                </p>
                <p style="font-size: 12px">
                  Tips：请按照指定的格式进行命名，命名有误会影响正文中的引文格式。文献来源-文献作者-发表年份-文献标题.pdf，例如
                  XX科技大学-王某某-2017-H5在游戏开发领域的应用研究.pdf，多作者格式如
                  XX期刊-王某某&李某某&张某某-2018-H5在游戏开发领域的应用研究.pdf，
                </p>
              </div>
              <div class="el-upload__tip" slot="tip"></div>
            </el-upload>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  generate_keywords,
  save_papers_list,
  save_keywords,
  search_papers,
  upload_papers,
} from "@/api/paper";
import { mapGetters } from "vuex";

export default {
  name: "DocumentManager",
  data() {
    return {
      // isMenuOpen: true, // 控制整个内容区显示状态
      formDataV2: {
        search_cn_keywords: [],
        search_en_keywords: [],
      },
      loading: false,
      newCnKeyword: "",
      activeCollapse: "", // 当前展开的折叠面板
      newEnKeyword: "",
      reference_paper_fe_lists: [],
      user_upload_paper_fe_lists: [],
      selectedPapers: [], // 用于存储选中的论文
      uploading: false,
    };
  },
  computed: {
    // 计算属性
    ...mapGetters(["formdataV2"]),
  },
  props: {
    parentForm: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    // 监听 formdataV2.reference_paper_selected_lists 的变化
    "formdataV2.reference_paper_selected_lists": {
      handler(newVal, oldVal) {
        // 当数据改变时，你可以在这里执行任何你需要的操作
        Ming("reference_paper_selected_lists has been updated", newVal, oldVal);
        // 这里的操作可以是任何事情，比如调用一个方法或者更改其他数据
        this.selectedPapers = newVal;
      },
      deep: true, // 使用深度监听，以便能够感知到数组或对象内部值的变化
      immediate: true, // 如果你也需要在 watcher 创建时立即执行一次，则设置为 true
    },
  },
  methods: {
    beforeUpload(file, fileList) {
      // 检查文件是否为 PDF 格式
      const isPDF = file.type === "application/pdf";
      // 检查文件大小是否小于 10MB
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isPDF) {
        this.$message.error("上传文件只能是 PDF 格式!");
        return false;
      }
      if (!isLt10M) {
        this.$message.error("上传文件大小不能超过 10MB!");
        return false;
      }

      if (!this.formdataV2.key1 && !this.formdataV2.key) {
        this.$message({
          type: "warning",
          message: "上传文件需先生成检索关键字!",
        });
        return false;
      }
      this.uploading = true;
      let data = new FormData();
      Ming("file", file);
      data.append("files", file);
      data.append("key", this.formdataV2.key1 || this.formdataV2.key);

      upload_papers(data).then((res) => {
        Ming("ssd", res);
        this.uploading = false;

        this.dealSelectList(res.result);
        this.$message({
          type: "success", // 将类型改为 success
          message: "上传文件成功!",
        });
      });

      return false;
    },

    //  取出用户上传的文件放在左侧 用户上传区
    dealSelectList(selectList) {
      Ming("dealSelectList", selectList);
      this.user_upload_paper_fe_lists = selectList.user_upload_paper_fe_lists;
      this.formdataV2.reference_paper_selected_lists =
        selectList.reference_paper_selected_lists;
      this.formdataV2.user_upload_paper_fe_lists =
        selectList.user_upload_paper_fe_lists;
      this.$store.dispatch("paper/setFormdataV2", this.formdataV2);
    },
    saveKeywords() {
      Ming(this.formdataV2);
      let data = this.formdataV2;
      if (!data.key) {
        data.key = data.key1;
      }
      save_keywords(data)
        .then((res) => {
          Ming(res, "res");
          let resultData = res.result;
          this.formdataV2.search_cn_keywords = resultData.search_cn_keywords;
          this.formdataV2.search_en_keywords = resultData.search_en_keywords;
          this.$store.dispatch("paper/setFormdataV2", this.formdataV2);

          this.getPaperList(resultData);
        })
        .catch(() => {
          this.loading = false;
        });
      // 保存成功 更新关键词列表
    },
    seachPaperS() {
      this.loading = true;

      this.saveKeywords();
    },
    getPaperList(resultData) {
      this.loading = true;

      let data = resultData;
      search_papers(data)
        .then((res) => {
          this.loading = false;

          let paperList = res.result;
          this.reference_paper_fe_lists = paperList.reference_paper_fe_lists;
          if (
            this.reference_paper_fe_lists &&
            this.reference_paper_fe_lists.length > 0
          ) {
            this.reference_paper_fe_lists.forEach((item, index) => {
              this.$set(this.reference_paper_fe_lists, index, {
                ...item,
                isExpanded: false,
              });
            });
          }

          this.user_upload_paper_fe_lists =
            paperList.user_upload_paper_fe_lists;
          if (
            this.user_upload_paper_fe_lists &&
            this.user_upload_paper_fe_lists.length > 0
          ) {
            this.user_upload_paper_fe_lists.forEach((item, index) => {
              this.$set(this.user_upload_paper_fe_lists, index, {
                ...item,
                isExpanded: false,
              });
            });
          }
          Ming("this.reference_paper_fe_lists", this.reference_paper_fe_lists);
          Ming(
            "this.user_upload_paper_fe_lists",
            this.user_upload_paper_fe_lists
          );
        })
        .catch(() => {
          this.loading = false;
        });
    },
    toggleMenu() {},
    paperExpandClick(paper) {
      Ming(paper, "收齐切换");
      Ming(paper.isExpanded, "收齐切换1111");
      paper.isExpanded = !paper.isExpanded;
      Ming(paper.isExpanded, "收齐切换2222");
    },

    getkeyWords() {
      if (!this.parentForm.title) {
        this.$message({
          type: "warning",
          message: "请输入您的论文题目!",
        });
        return false;
      }
      this.loading = true;
      let data = {
        title: this.parentForm.title,
        language: this.parentForm.language,
        field: this.parentForm.field[1],
        type: this.parentForm.type,
        product: this.parentForm.product,
        word_count: this.parentForm.word_count,
        paper_level: this.parentForm.paper_level == "初级" ? 0 : 3,
      };
      generate_keywords(data)
        .then((res) => {
          Ming(res);
          this.$store.dispatch("paper/setFormdataV2", res.result);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 把v2的数据保存下来
    setFormV2() {
      this.$store.dispatch("paper/setFormdataV2", this.formdataV2);
    },
    removeKeyword(type, index) {
      if (type === "cn") {
        this.formdataV2.search_cn_keywords.splice(index, 1);
      } else if (type === "en") {
        this.formdataV2.search_en_keywords.splice(index, 1);
      }
    },
    addKeyword(type) {
      if (type === "cn" && this.formdataV2.search_cn_keywords.length < 4) {
        if (this.newCnKeyword.trim()) {
          this.formdataV2.search_cn_keywords.push(this.newCnKeyword.trim());
          this.newCnKeyword = "";
        }
      } else if (
        type === "en" &&
        this.formdataV2.search_en_keywords.length < 4
      ) {
        if (this.newEnKeyword.trim()) {
          this.formdataV2.search_en_keywords.push(this.newEnKeyword.trim());
          this.newEnKeyword = "";
        }
      }
    },
    togglePaperSelection(paper) {
      // 切换选中状态
      Ming(paper, "ssddddel");
      let data = {
        key: this.formdataV2.key1 || this.formdataV2.key,
        reference_paper_fe_lists: [],
        user_upload_paper_fe_list: [],
      };
      let message = "";

      if (paper.is_relevant == "no") {
        paper.is_relevant = "yes";
        message = "添加文献成功!";
      } else {
        paper.is_relevant = "no";
        message = "取消文献成功!";
      }
      if (paper.search_type == "user_upload") {
        data.user_upload_paper_fe_list.push(paper);
      } else {
        data.reference_paper_fe_lists.push(paper);
      }
      // if (paper.is_relevant === "yes") {
      //   paper.is_relevant = "no";
      //   // 从选中列表中移除
      //   this.selectedPapers = this.selectedPapers.filter(
      //     (selected) => selected.title !== paper.title
      //   );
      // } else {
      //   paper.is_relevant = "yes";
      //   // 添加到选中列表
      //   if (
      //     !this.selectedPapers.some(
      //       (selected) => selected.title === paper.title
      //     )
      //   ) {
      //     let newPaper = JSON.parse(JSON.stringify(paper));
      //     this.selectedPapers.push(newPaper);
      //   }
      // }
      this.saveUserSelect(data, message);
    },
    delSelectPaper(paper, event) {
      let data = {
        key: this.formdataV2.key1 || this.formdataV2.key,
        reference_paper_fe_lists: [],
        user_upload_paper_fe_list: [],
      };
      paper.is_relevant = "no";
      if (paper.search_type == "user_upload") {
        data.user_upload_paper_fe_list.push(paper);
      } else {
        data.reference_paper_fe_lists.push(paper);
      }
      // 如果取消选中，从 selectedPapers 中移除
      // this.selectedPapers = this.selectedPapers.filter(
      //   (item) => item.title !== paper.title
      // );
      // // 搜索到的文件列表
      // this.reference_paper_fe_lists.forEach((item) => {
      //   if (item.title == paper.title) {
      //     item.is_relevant = "no";
      //   }
      // });
      // this.user_upload_paper_fe_lists.forEach((item) => {
      //   if (item.title == paper.title) {
      //     item.is_relevant = "no";
      //   }
      // });

      this.saveUserSelect(data, "删除成功");
    },
    saveUserSelect(data, message) {
      // this.selectedPapers.forEach((item) => {
      //   if (item.search_type == "user_upload") {
      //     data.user_upload_paper_fe_list.push(item);
      //   } else {
      //     data.reference_paper_fe_lists.push(item);
      //   }
      // });
      save_papers_list(data).then((res) => {
        this.$message({
          type: "success",
          message: message,
        });
        Ming("保存选中按钮请求, ", res.result);
        this.dealSelectList(res.result);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding-left: 40px;
  margin-top: -10px;
  margin-bottom: -20px;
  font-size: 14px;
  width: 100%;
}

.keywordBox {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  margin-top: 20px;
}

.keyLeft,
.keyRight {
  flex: 1;
  margin-right: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  ul {
    margin: 10px 0;
  }
  li {
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    height: 40px;
  }
}

h3 {
  margin-bottom: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.input-field {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 10px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.content {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  min-height: 300px;
  max-height: 450px;
}

.sidebar {
  flex: 2;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 10px;
  max-height: 400px;
  overflow-y: auto;
  background: #fff;
}

.sidebar-item,
.sidebar-list {
  margin-bottom: 10px;
}

hr {
  margin: 20px 0;
  border: none;
  border-top: 1px solid #ccc;
}
.paper-container {
  margin-bottom: 20px; /* 每篇论文的外边距 */
}

.abstract {
  color: #606060;
  line-height: 1.5;
  word-wrap: break-word;
  overflow: hidden;
  display: flex; /* 使用 flex 布局，让按钮始终紧随内容 */
  align-items: flex-end; /* 按钮对齐到内容末尾 */
}

.abstract.expanded {
  display: block; /* 展开时取消 flex 布局，显示完整内容 */
  -webkit-line-clamp: unset; /* 取消行数限制 */
}

.abstract-content {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 默认显示两行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1; /* 占据剩余空间，防止按钮跑到下一行 */
}

.toggle-button {
  color: #409eff; /* 展开/收起按钮颜色 */
  cursor: pointer;
  font-size: 14px;
  margin-left: 5px;
  flex-shrink: 0; /* 防止按钮被压缩 */
}

.content-main {
  flex: 2;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  max-height: 400px;
  overflow-y: auto;
}

.upload-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  ::v-deep(.el-upload-dragger) {
    width: 190px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  ::v-deep(.el-upload) {
    height: 100%;
  }
  ::v-deep(.upload-box) {
    height: 100%;
  }
  ::v-deep(.el-upload-dragger .el-icon-upload) {
    // height: 100%;
    margin-top: -30px;
  }
  .upload-demo {
    height: 100%;
  }
}

.upload-box {
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 10px;
  background-color: #f0f8ff;
  text-align: center;
  height: 100%;
}

.upload-button {
  padding: 10px;
  background-color: #e6e6fa;
  border: 1px solid #ccc;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-button:hover {
  background-color: #d8bfd8;
}

.footer {
  text-align: center;
}

.footer .button {
  width: 100%;
  padding: 10px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter, .slide-leave-to /* .slide-leave-active in <2.1.8 */ {
  height: 0;
  overflow: hidden;
}

.selected-item {
  .paper-card {
    background-color: rgba(104, 250, 104, 0.1); /* 浅绿色背景 */
  }
}

.selected-paper {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.paper-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.paper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.paper-body {
  margin-bottom: 8px;
  color: #666;
}

.paper-footer {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-top: 8px;
  .formPaper {
    background-color: rgba(62, 179, 223, 0.1);
    color: #3eb3df;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 76px;
    height: 20px;
    font-size: 12px;
    padding: 0 6px;
    margin-right: 10px;
    border-radius: 14px;
    flex-shrink: 0;
  }
  p > span {
    color: #303133;
  }
}
.dateP {
  margin-left: 20px;
}
</style>
