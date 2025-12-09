<template>
  <div class="vegalite-page">
    <!-- 主体内容 -->
    <div class="container">
      <!-- 内容展示区域 -->
      <div class="section-card">
        <div class="section-title">VegaLite 页面</div>
        <div class="content-section">
          <p class="placeholder-text">内容展示待定</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VegaLite",
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.vegalite-page {
  margin: 0;
  font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
  background: linear-gradient(135deg, #b6c7f7 0%, #e3c6f7 100%);
  min-height: 100vh;
  padding-bottom: 32px;
}

/* 主体内容容器 */
.container {
  max-width: 900px;
  margin: 32px auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(108, 99, 255, 0.08);
  padding: 32px 24px 24px 24px;
}

/* 区块标题 */
.section-title {
  display: inline-block;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(90deg, #a18fff 0%, #6c63ff 100%);
  border-radius: 18px 36px 18px 18px;
  padding: 10px 36px 10px 24px;
  margin-bottom: 18px;
  box-shadow: 0 4px 12px rgba(108, 99, 255, 0.2);
}

/* 区块卡片 */
.section-card {
  max-width: 900px;
  margin: 32px auto 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(108, 99, 255, 0.08);
  padding: 32px 24px 24px 24px;
}

.content-section {
  padding: 40px 20px;
  text-align: center;
}

.placeholder-text {
  font-size: 18px;
  color: #666;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .container,
  .section-card {
    padding-left: 8px;
    padding-right: 8px;
  }

  .container,
  .section-card {
    max-width: 100%;
  }
}
</style>
