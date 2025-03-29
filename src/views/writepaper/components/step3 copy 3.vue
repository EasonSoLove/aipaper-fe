<template>
  <div class="wave-container">
    <div class="wave-text">
      <span
        v-for="(char, index) in displayedChars"
        :key="index"
        class="wave-char"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        {{ char }}
      </span>
    </div>
    <button
      @click="
        startDisplay(
          '这是一个测试的文字效果，逐个展示并带有波浪跳跃的动态动画。'
        )
      "
    >
      开始展示
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      displayedChars: [], // 用于逐个展示的字符列表
      intervalId: null, // 定时器ID，用于清除定时器
    };
  },
  methods: {
    startDisplay(inputString) {
      // 清空当前展示内容
      this.displayedChars = [];

      // 确保没有遗留的定时器
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }

      let index = 0; // 当前展示的字符索引

      // 每100毫秒展示一个字符
      this.intervalId = setInterval(() => {
        if (index < inputString.length) {
          this.displayedChars.push(inputString[index]); // 添加当前字符到展示列表
          index++;
        } else {
          // 如果展示完成，清除定时器
          clearInterval(this.intervalId);
          this.intervalId = null;
        }
      }, 100); // 每100毫秒添加一个字符
    },
  },
};
</script>

<style scoped>
.wave-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.wave-text {
  display: flex;
  flex-wrap: wrap; /* 自动换行支持 */
  gap: 5px;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: left;
  max-width: 600px; /* 限制文字显示宽度 */
  line-height: 1.5; /* 增加行高，适配长文字 */
}

.wave-char {
  display: inline-block;
  transform-origin: bottom;
  animation: waveJump 1s ease-in-out infinite;
}

/* 跳跃波浪效果 */
@keyframes waveJump {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px); /* 跳跃高度 */
  }
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}
</style>
