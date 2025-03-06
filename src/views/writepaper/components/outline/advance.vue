<template>
  <div class="container">
    <header class="header">
      <button class="advanced-settings" @click="toggleMenu">
        高级自定义
        <span>{{ isMenuOpen ? "▼" : "▲" }}</span>
      </button>
    </header>
    <transition name="slide">
      <div v-if="isMenuOpen">
        <div class="button-group">
          <button class="button">生成检索关键词</button>
          <button class="button">选择关键词的区域</button>
          <button class="button">检索文献</button>
        </div>
        <div class="content">
          <div class="sidebar">
            <div class="sidebar-item">
              <input type="checkbox" id="title1" />
              <label for="title1">标题1</label>
            </div>
            <div class="sidebar-list">
              <input type="checkbox" id="title1-1" />
              <label for="title1-1">标题1 编号</label>
              <input type="checkbox" id="title1-2" />
              <label for="title1-2">标题1</label>
              <input type="checkbox" id="title1-3" />
              <label for="title1-3">标题1</label>
              <input type="checkbox" id="title1-4" />
              <label for="title1-4">标题1</label>
            </div>
          </div>
          <div class="content-main">
            <p>这里展示悬浮选中的论文的摘要</p>
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
    </transition>
  </div>
</template>

<script>
export default {
  name: "DocumentManager",
  data() {
    return {
      isMenuOpen: true, // 控制整个内容区显示状态
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #333;
}

.header {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.advanced-settings {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #6a5acd;
  display: flex;
  align-items: center;
}

.advanced-settings span {
  margin-left: 5px;
  font-size: 12px;
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
}

.sidebar-item {
  margin-bottom: 10px;
}

.sidebar-list {
  border-top: 1px solid #ccc;
  padding-top: 10px;
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

.input-field {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
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
