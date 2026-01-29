<template>
  <div
    id="fixedCard"
    :class="{ tipContain: isFixed, fixedCard: true, fixed: isFixed }"
    ref="fixedCard"
  >
    <!-- tip1 -->
    <div class="tipBox">
      <p class="tipTitle">Tips 1:</p>
      <div class="tipCon">
        <p>
          点击
          <span> 【 <i class="el-icon-delete"></i>】 </span>
          可以删除本章/小节
        </p>
        <p>
          点击
          <span> 【 <i class="el-icon-circle-plus-outline"></i>】 </span>
          ，在本章/小节后新增一章/小节
        </p>
        <p>
          点击
          <span> 【<i class="el-icon-edit-outline"></i>增删图表】 </span>
          可以在对应的章节中加入不同的内容，包含公式、数据表、图表、代码
        </p>
        <p>
          模型在创作大纲过程中会自动为部分章节加入公式、数据表、图表、代码，如果您不需要，可以点击<span>【增删图表】</span>，<span>手动取消勾选</span>您不想要的公式、数据表、图表、代码。
        </p>
        <p>
          在所有的编辑完成后，如果有章节内容留空、插图描述留空的地方，<span>务必点击</span>一次
          <span> 【AI帮写】 ，【AI帮写】</span>
          ，需要重写部分内容，请您耐心等待！
        </p>
      </div>
      <div class="jumpBtn">
        <el-button @click="jumpUrl" type="success" size="mini"
          >跳转到生成正文</el-button
        >
      </div>
    </div>
    <!-- <div class="tipBox">
      <p class="tipTitle">Tips 2:</p>
      <div class="tipCon">
        <p>
          大纲不满意可以点击下边的<span
            >【重新生成按钮<i class="el-icon-refresh"></i>】</span
          >
        </p>
      </div>
    </div> -->
    <div class="tipBox">
      <p class="tipTitle">Tips 2:</p>
      <div class="tipCon">
        <p><span>网站暂不支持三级目录</span>，该功能正在努力升级中...</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "tips",
  data() {
    return {
      isFixed: false,
      offsetTop: 0,
      windowWidth: window.innerWidth, //
    };
  },
  props: {
    parentHeight: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      // 使用示例
      const element = document.querySelector("#fixedCard");
      this.offsetTop = this.getElementOffsetTop(element) - 10;
      window.addEventListener("resize", this.handleResize);
      // 初始化位置
      window.addEventListener("scroll", this.handleScroll);
    });
  },
  computed: {
    outlineBottom() {
      return this.offsetTop + this.parentHeight - 200;
    },
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
      this.updateCardPosition();
    },
    updateCardPosition() {
      const element = this.$refs.fixedCard;
      if (element) {
        let newLeft = this.windowWidth - 880;
        if (this.windowWidth > 1450) {
          if (this.isFixed) {
            newLeft = 1226;
            element.style.left = `${newLeft}px`;
            element.style.right = `auto !important`;
          } else {
            element.style.left = `auto`;
            element.style.right = `-201px !important`;
          }
        } else {
          element.style.left = `auto `;
          element.style.right = `20px !important`;
        }
      }
    },
    getElementOffsetTop(element) {
      if (!element) return null;

      // 获取元素距离视口顶部的距离
      const rect = element.getBoundingClientRect();

      // 获取页面滚动的垂直距离
      const scrollTop = window.scrollY || window.pageYOffset;

      // 计算元素距离页面顶部的距离
      const offsetTop = rect.top + scrollTop;

      return offsetTop;
    },
    handleScroll() {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;

      // 判断是否需要固定
      if (scrollTop > this.offsetTop && scrollTop < this.outlineBottom) {
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
      this.updateCardPosition();
    },
    jumpUrl() {
      this.$scrollTo("#reduceId", 500, { offset: -100 });
    },
  },
};
</script>

<style lang="scss" scoped>
.tipContain {
  position: fixed !important;
  top: 62px !important;
  right: 20px !important;
  z-index: 1000;
}
.fixedCard {
  position: absolute;
  top: 0px;
  right: -201px;
}

.tipBox {
  width: 189px;
  padding: 9px;
  background: #fff;
  font-size: 14px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-top: 30px;
}
.tipTitle {
  font-size: 14px;
  color: #000;
  font-weight: bold;
  margin-bottom: 10px;
}
.tipCon {
  line-height: 20px;
  & > p {
    margin-top: 10px;
    span {
      color: #d75300;
    }
  }
}
.jumpBtn {
  margin-top: 15px;
}
.card {
  margin-bottom: 15px;
}
</style>
