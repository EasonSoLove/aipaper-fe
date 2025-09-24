<template>
  <div class="invite-progress-container">
    <!-- 标题 -->
    <div class="progress-title">
      邀请好友送
      <span class="highlight">毕业论文折扣卷 !</span>
    </div>

    <!-- 进度条 -->
    <div class="progress-bar-container">
      <!-- 全局进度条背景 -->
      <div class="progress-line-bg"></div>
      <!-- 已完成进度条 -->
      <div class="progress-line-active" :style="{ width: progressWidth }"></div>

      <!-- 圆点列表 -->
      <div class="progress-dots">
        <div
          v-for="(item, index) in progressArray"
          :key="index"
          class="progress-dot-wrapper"
          :class="{ 'is-milestone': isMilestone(index) }"
        >
          <!-- 大圆点（里程碑） -->
          <div
            v-if="isMilestone(index)"
            class="milestone-dot"
            :class="{
              'is-reached': isReached(item),
              'is-current': isCurrent(item),
            }"
          >
            <div class="dot-icon">🎁</div>
          </div>

          <!-- 小圆点（进度点） -->
          <div
            v-else
            class="progress-dot"
            :class="{ 'is-reached': isReached(item) }"
          >
            <div class="dot-icon-small">🎁</div>
          </div>

          <!-- 礼品信息（仅里程碑显示） -->
          <div v-if="isMilestone(index)" class="gift-info">
            <div class="gift-text">{{ getGiftText(index) }}</div>
            <div
              class="gift-button"
              :class="{ 'is-claimed': isFullyReached(item) }"
              @click="handleGiftClaim(item, index)"
            >
              {{ isFullyReached(item) ? "已发放" : "领取" }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 邀请按钮 -->
    <div class="invite-action">
      <button class="invite-button" @click="handleInvite">立即邀请</button>
    </div>

    <!-- 说明文字 -->
    <div class="progress-note">
      ※每邀请一人注册，被邀请人获得9折优惠券
      邀请人可得梯度优惠券奖励，还可参与现金奖励分成
    </div>
  </div>
</template>

<script>
export default {
  name: "InviteProgress",
  props: {
    currentProgress: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      // 进度数组
      progressArray: [1, 3, 5, 7, 9, 11, 15, 20, 30],
      // 礼品文本数组（对应里程碑索引）
      giftTexts: [
        "9折优惠卷",
        "8折优惠卷",
        "7折优惠卷",
        "6折优惠卷",
        "5折优惠卷",
      ],
    };
  },
  computed: {
    // 计算进度条宽度 - 基于实际达标的进度，支持插值
    progressWidth() {
      if (this.currentProgress <= 0) return "0%";

      // 找到当前进度在数组中的位置
      let reachedIndex = -1;
      for (let i = 0; i < this.progressArray.length; i++) {
        if (this.currentProgress >= this.progressArray[i]) {
          reachedIndex = i;
        } else {
          break;
        }
      }

      if (reachedIndex === -1) return "0%";

      // 如果完全达到某个进度点
      if (this.currentProgress === this.progressArray[reachedIndex]) {
        const progress = (reachedIndex / (this.progressArray.length - 1)) * 100;
        return `${Math.min(progress, 100)}%`;
      }

      // 如果介于两个进度点之间，计算插值
      if (reachedIndex < this.progressArray.length - 1) {
        const currentValue = this.progressArray[reachedIndex];
        const nextValue = this.progressArray[reachedIndex + 1];
        const progressInSegment =
          (this.currentProgress - currentValue) / (nextValue - currentValue);
        const baseProgress =
          (reachedIndex / (this.progressArray.length - 1)) * 100;
        const segmentProgress = (1 / (this.progressArray.length - 1)) * 100;
        const totalProgress =
          baseProgress + segmentProgress * progressInSegment;
        return `${Math.min(totalProgress, 100)}%`;
      }

      // 如果超过最后一个进度点
      return "100%";
    },
  },
  methods: {
    // 判断是否为里程碑（大圆点）
    isMilestone(index) {
      return index % 2 === 0; // 索引 0,2,4,6,8
    },

    // 判断是否已达到该进度
    isReached(progress) {
      return this.currentProgress >= progress;
    },

    // 判断是否已完全达标（用于显示已发放状态）
    isFullyReached(progress) {
      return this.currentProgress >= progress;
    },

    // 判断是否为当前进度
    isCurrent(progress) {
      return this.currentProgress === progress;
    },

    // 获取当前进度在数组中的索引
    getCurrentProgressIndex() {
      for (let i = 0; i < this.progressArray.length; i++) {
        if (this.currentProgress <= this.progressArray[i]) {
          return i;
        }
      }
      return this.progressArray.length - 1;
    },

    // 获取礼品文本
    getGiftText(index) {
      const milestoneIndex = index / 2; // 转换为礼品数组索引
      return this.giftTexts[milestoneIndex] || "";
    },

    // 处理礼品领取
    handleGiftClaim(progress, index) {
      if (this.isFullyReached(progress)) {
        this.$message.success("礼品已发放！");
      } else if (this.isReached(progress)) {
        this.$message.info("礼品可以领取了！");
      } else {
        this.$message.warning(`需要邀请${progress}位好友才能领取此礼品`);
      }
    },

    // 处理立即邀请
    handleInvite() {
      // 触发父组件的邀请事件
      this.$emit("invite");
      this.$message.info("正在生成邀请链接...");
    },
  },
};
</script>

<style lang="scss" scoped>
.invite-progress-container {
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.progress-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 24px;

  .highlight {
    color: #67c23a;
  }
}

.progress-bar-container {
  position: relative;
  margin: 32px 0;
  margin-top: 50px;
}

.progress-line-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  right: 0;
  height: 3px;
  background: #e4e7ed;
  border-radius: 3px;
  transform: translateY(-50%);
  z-index: 1;
}

.progress-line-active {
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #67c23a 0%, #85ce61 100%);
  border-radius: 3px;
  transform: translateY(-50%);
  transition: width 0.5s ease;
  z-index: 2;
  box-shadow: 0 1px 2px rgba(103, 194, 58, 0.3);
}

.progress-dots {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 3;

  & > .progress-dot-wrapper:first-child {
    margin-left: -5px;
  }
}

.progress-dot-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

// 里程碑圆点（大圆点）
.milestone-dot {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f5f7fa;
  border: 3px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin-bottom: 12px;
  position: relative;
  top: -25.5px; // 调整位置，使圆点中心对齐进度条（48px/2 - 3px/2 = 22.5px，向上偏移）

  &.is-reached {
    background: #67c23a;
    border-color: #67c23a;
    box-shadow: 0 0 0 4px rgba(103, 194, 58, 0.2);
  }

  &.is-current {
    background: #67c23a;
    border-color: #67c23a;
    box-shadow: 0 0 0 4px rgba(103, 194, 58, 0.2);
  }
}

.dot-icon {
  font-size: 20px;
  color: white;
}

// 进度圆点（小圆点）
.progress-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f5f7fa;
  border: 2px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin-bottom: 12px;
  position: relative;
  top: -13.5px; // 调整位置，使圆点中心对齐进度条（24px/2 - 3px/2 = 10.5px，向上偏移）

  &.is-reached {
    background: #67c23a;
    border-color: #67c23a;
  }
}

.dot-icon-small {
  font-size: 12px;
  color: #999;
}

.gift-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 8px; // 调整间距
}

.gift-text {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.gift-button {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  background: #67c23a;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &.is-claimed {
    background: #c0c4cc;
    color: #909399;
  }

  &:hover:not(.is-claimed) {
    background: #5daf34;
    transform: translateY(-1px);
  }
}

.invite-action {
  margin: 32px 0 16px;
}

.invite-button {
  background: #67c23a;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #5daf34;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
  }
}

.progress-note {
  font-size: 12px;
  color: #999;
  line-height: 1.4;
}

// 响应式设计
@media (max-width: 768px) {
  .invite-progress-container {
    padding: 16px;
  }

  .progress-title {
    font-size: 16px;
    margin-bottom: 20px;
  }

  .milestone-dot {
    width: 40px;
    height: 40px;
  }

  .dot-icon {
    font-size: 16px;
  }

  .gift-text {
    font-size: 11px;
  }

  .gift-button {
    padding: 3px 10px;
    font-size: 10px;
  }

  .invite-button {
    padding: 10px 24px;
    font-size: 14px;
  }
}
</style>
