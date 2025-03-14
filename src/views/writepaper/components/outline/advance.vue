<template>
  <div class="container">
    <header class="header footer">
      <button @click="getkeyWords" class="button">生成检索关键词</button>
    </header>
    <div class="keywordBox">
      <div class="keyLeft">
        <h3>中文关键词</h3>
        <ul>
          <li
            v-for="(keyword, index) in keyWordsData.search_cn_keywords"
            :key="index"
          >
            {{ keyword }}
            <button @click="removeKeyword('cn', index)">删除</button>
          </li>
        </ul>
        <input
          type="text"
          v-model="newCnKeyword"
          @keyup.enter="addKeyword('cn')"
          placeholder="新增中文关键词"
          :disabled="keyWordsData.search_cn_keywords.length >= 4"
        />
      </div>
      <div class="keyRight">
        <h3>英文关键词</h3>
        <ul>
          <li
            v-for="(keyword, index) in keyWordsData.search_en_keywords"
            :key="index"
          >
            {{ keyword }}
            <button @click="removeKeyword('en', index)">删除</button>
          </li>
        </ul>
        <input
          type="text"
          v-model="newEnKeyword"
          @keyup.enter="addKeyword('en')"
          placeholder="新增英文关键词"
          :disabled="keyWordsData.search_en_keywords.length >= 4"
        />
      </div>
    </div>
    <div>
      <div class="button-group">
        <button @click="saveKeywords" class="button">检索文献</button>
      </div>
      <div class="content">
        <div class="sidebar">
          <h3>用户上传文件列表</h3>
          <div
            class="sidebar-item"
            v-for="(paper, index) in user_upload_paper_fe_lists"
            :key="`user-${index}`"
          >
            <input
              type="checkbox"
              :id="`user-title-${index}`"
              @change="selectPaper(paper, $event)"
            />
            <label :for="`user-title-${index}`">{{ paper.title }}</label>
            <p>{{ paper.abstract }}</p>
            <p>{{ paper.source }}</p>
          </div>

          <hr />

          <h3>搜索到的文件列表</h3>
          <div
            class="sidebar-list"
            v-for="(paper, index) in reference_paper_fe_lists"
            :key="`ref-${index}`"
          >
            <input
              type="checkbox"
              :id="`ref-title-${index}`"
              @change="selectPaper(paper, $event)"
            />
            <label :for="`ref-title-${index}`">{{ paper.title }}</label>
            <p>{{ paper.abstract }}</p>
            <p>{{ paper.source }}</p>
          </div>
        </div>
        <div class="content-main">
          <h3>选中的论文摘要</h3>
          <div v-for="(paper, index) in selectedPapers" :key="index">
            <h4>{{ paper.title }}</h4>
            <p>{{ paper.abstract }}</p>
            <p>作者: {{ paper.authors.join(", ") }}</p>
            <p>来源: {{ paper.source }}</p>
            <p>日期: {{ paper.date }}</p>
          </div>
        </div>
        <div class="upload-section">
          <div class="upload-box">上传文件区域</div>
          <input type="text" placeholder="论文题目" class="input-field" />
          <input
            type="text"
            placeholder="填写引文格式（模型提取）"
            class="input-field"
          />
          <button class="upload-button">上传</button>
        </div>
      </div>
      <footer class="footer">
        <button class="button">生成大纲</button>
      </footer>
    </div>
  </div>
</template>

<script>
import { generate_keywords, save_keywords, search_papers } from "@/api/paper";
export default {
  name: "DocumentManager",
  data() {
    return {
      // isMenuOpen: true, // 控制整个内容区显示状态
      keyWordsData: {
        search_cn_keywords: [],
        search_en_keywords: [],
      },
      newCnKeyword: "",
      newEnKeyword: "",
      reference_paper_fe_lists: [],
      user_upload_paper_fe_lists: [],
      selectedPapers: [], // 用于存储选中的论文
    };
  },
  methods: {
    saveKeywords() {
      let data = {
        key: "22949e2b-efd1-4dc1-9312-f453067bc039",
        search_cn_keywords: ["测试关键词", "宗教发展", "印度哲学", "宗教研究"],
        search_en_keywords: [
          "test save en keywords",
          "religious development",
          "Indian philosophy",
          "religious studies",
        ],
      };
      save_keywords(data).then((res) => {
        console.log(res, "res");
      });
      // 保存成功 更新关键词列表
      let resultData = {
        key: "22949e2b-efd1-4dc1-9312-f453067bc039",
        search_cn_keywords: ["测试关键词", "宗教发展", "印度哲学", "宗教研究"],
        search_en_keywords: [
          "test save en keywords",
          "religious development",
          "Indian philosophy",
          "religious studies",
        ],
      };
      this.keyWordsData.search_cn_keywords = resultData.search_cn_keywords;
      this.keyWordsData.search_en_keywords = resultData.search_en_keywords;
    },
    saveKeywords() {
      this.saveKeywords();
      let data = {
        key: "22949e2b-efd1-4dc1-9312-f453067bc039",
        search_cn_keywords: ["印度宗教", "宗教发展", "印度哲学", "宗教研究"],
        search_en_keywords: [
          "Indian religions",
          "religious development",
          "Indian philosophy",
          "religious studies",
        ],
      };
      search_papers(data).then((res) => {});
      let paperList = {
        key: "22949e2b-efd1-4dc1-9312-f453067bc039",
        search_cn_keywords: ["印度宗教", "宗教发展", "印度哲学", "宗教研究"],
        search_en_keywords: [
          "Indian religions",
          "religious development",
          "Indian philosophy",
          "religious studies",
        ],
        reference_paper_fe_lists: [
          {
            title: "浅析古印度瑜伽法的发展及其与宗教的关系",
            authors: ["冯云"],
            source: "青春岁月",
            date: "2013-11-08",
            database: "特色期刊",
            abstract:
              '瑜伽法源自于古印度,它是将类似于古文书中的教法与日常的行为方式融合起来,并使信仰充分地渗透,以此支配人的灵性修养、道德操行、生活实践来追逐身心与灵魂的和谐一体,同时激发体内潜能的体系。古印度人相信天与人的合一,瑜伽体式中把古老的技巧与合理的膳食相结合,妄图改善人们的道德与身体素质寻得长寿的奥秘。印度《奥义书》曾告诫世人:"一把剑的锋刃很不容易越过。"所以智者说:"解脱之道是艰巨的。"瑜伽法在传播过程中,融汇了信徒对身心改善的期许。鉴于东学西渐之风日盛,印度瑜伽的东传以及其在世界范围内的影响,使我们把研究视角对准了古印度文明时期,在此我们对《薄伽梵歌》中关于瑜伽法的发展及其思想作一个初步的把握,以期探讨瑜伽法与古代印度宗教的关系。',
            latex_reference: "",
            search_type: "cnki",
            is_relevant: "no",
          },
        ],
        user_upload_paper_fe_lists: [
          {
            title: "初中美术水墨探索大单元的开发与实践",
            authors: ["万象"],
            source: "万象学术",
            date: "2025",
            database: "",
            abstract: "",
            latex_reference:
              "@article{万象2025,\n  title={初中美术水墨探索大单元的开发与实践},\n  author={万象},\n  journal={万象学术},\n  year={2025},\n}",
            search_type: "user_upload",
            is_relevant: "yes",
          },
          {
            title: "大数据技术在企业成本会计中的应用研究",
            authors: ["万象"],
            source: "万象学术",
            date: "2025",
            database: "",
            abstract: "",
            latex_reference:
              "@article{万象2025,\n  title={大数据技术在企业成本会计中的应用研究},\n  author={万象},\n  journal={万象学术},\n  year={2025},\n}",
            search_type: "user_upload",
            is_relevant: "yes",
          },
          {
            title: "工业机器人双目视觉系统的特征识别与运动学逆解研究",
            authors: ["万象"],
            source: "万象学术",
            date: "2025",
            database: "",
            abstract: "",
            latex_reference:
              "@article{万象2025,\n  title={工业机器人双目视觉系统的特征识别与运动学逆解研究},\n  author={万象},\n  journal={万象学术},\n  year={2025},\n}",
            search_type: "user_upload",
            is_relevant: "yes",
          },
        ],
      };
      this.reference_paper_fe_lists = paperList.reference_paper_fe_lists;
      this.user_upload_paper_fe_lists = paperList.user_upload_paper_fe_lists;
    },
    toggleMenu() {},
    getkeyWords() {
      let data = {
        title: "印度宗教的发展与研究",
        language: "中文",
        field: "哲学类",
        type: "本科",
        product: "毕业论文",
        word_count: 8000,
        paper_level: 0,
      };
      generate_keywords(data).then((res) => {
        console.log(res);
      });

      let result = {
        title: "印度宗教的发展与研究",
        language: "中文",
        field: "哲学类",
        type: "本科",
        product: "毕业论文",
        word_count: 8000,
        paper_level: 0,
        key: "032d35f2-86a9-4374-8374-3400d5d451aa",
        version: "v2",
        search_cn_keywords: [
          "印度宗教",
          "宗教发展",
          "印度哲学",
          "宗教研究方法",
        ],
        search_en_keywords: [
          "Indian religion",
          "religious development",
          "Indian philosophy",
          "religious research methods",
        ],
      };
      this.keyWordsData = result;
    },
    removeKeyword(type, index) {
      if (type === "cn") {
        this.keyWordsData.search_cn_keywords.splice(index, 1);
      } else if (type === "en") {
        this.keyWordsData.search_en_keywords.splice(index, 1);
      }
    },
    addKeyword(type) {
      if (type === "cn" && this.keyWordsData.search_cn_keywords.length < 4) {
        if (this.newCnKeyword.trim()) {
          this.keyWordsData.search_cn_keywords.push(this.newCnKeyword.trim());
          this.newCnKeyword = "";
        }
      } else if (
        type === "en" &&
        this.keyWordsData.search_en_keywords.length < 4
      ) {
        if (this.newEnKeyword.trim()) {
          this.keyWordsData.search_en_keywords.push(this.newEnKeyword.trim());
          this.newEnKeyword = "";
        }
      }
    },
    selectPaper(paper, event) {
      if (event.target.checked) {
        this.selectedPapers.push(paper);
      } else {
        this.selectedPapers = this.selectedPapers.filter((p) => p !== paper);
      }
    },
  },
};
</script>

<style scoped>
.container {
  padding-left: 50px;
}

.keywordBox {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.keyLeft,
.keyRight {
  flex: 1;
  margin-right: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
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

button {
  margin-left: 10px;
  padding: 5px;
  background-color: #e6e6fa;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #d8bfd8;
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

.button {
  flex: 1;
  margin: 0 5px;
  padding: 10px;
  background-color: #e6e6fa;
  border: 1px solid #ccc;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #d8bfd8;
}

.content {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.sidebar {
  flex: 1;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.sidebar-item,
.sidebar-list {
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

hr {
  margin: 20px 0;
  border: none;
  border-top: 1px solid #ccc;
}

.content-main {
  flex: 2;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 10px;
  background-color: #f0f8ff;
}

.upload-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.upload-box {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 10px;
  background-color: #f0f8ff;
  text-align: center;
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
</style>
