<template>
  <div class="title-input-wrapper" @click.stop>
    <div style="position: relative">
      <div class="titleTip">
        <i class="el-icon-warning"></i>
        <span>不知道怎么选题？只需要输入要求，点击AI推荐题目！</span>
      </div>
      <div @click="toggleDropdown" class="recomBtn" icon="el-icon-guide">
        <span class="starSpan">
          <img src="@/assets/images/index/icon_32_star.png" alt="" />
        </span>
        AI推荐题目
      </div>
      <el-input
        class="elipt"
        v-model="innerValue"
        maxlength="60"
        placeholder="请输入5-50字论文题目，或输入关键词使用AI只能选题！"
        @focus="showDropdown = true"
      >
      </el-input>
    </div>

    <div v-if="showDropdown" class="title-dropdown" @click.stop>
      <div class="inner-stroke inner-dropdown-box">
        <div class="recommendation-section">
          <div class="recommendation-header">
            <div class="header-title">
              <span class="starSpan">
                <img
                  style="margin-top: 4px"
                  src="@/assets/images/index/icon_32_star.png"
                  alt="" /></span
              >AI推荐标题
            </div>
            <p @click="getList"><i class="el-icon-refresh-right"></i>换一换</p>
          </div>
          <div v-loading="loading" class="recommendation-content">
            <div
              v-for="(recommendation, index) in recommendations"
              :key="index"
              type="primary"
              class="recommendation-item"
              @click="selectRecommendation(recommendation)"
            >
              <div class="itemParen">
                {{ recommendation }}
              </div>
              <div class="itemBtn">
                <span style="margin-left: 3px">采纳</span>
              </div>
            </div>
          </div>
          <!-- <div class="generate-button">
            <el-button type="text" size="mini" @click="getList"
              >不满意? 换一组</el-button
            >
          </div> -->
        </div>
        <div class="info-section">
          <div class="sectionTitle">使用提示</div>
          <div class="info-item">
            <div class="info-title"><span>1.</span>选择科目</div>
          </div>
          <div class="arrow">
            <i class="el-icon-caret-right"></i>
          </div>
          <div class="info-item">
            <div class="info-title"><span>2.</span>输入标题关键词</div>
          </div>
          <div class="arrow">
            <i class="el-icon-caret-right"></i>
          </div>
          <div class="info-item">
            <div class="info-title"><span>3.</span>选择推荐题目</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { title_recommend } from "@/api/paper";
export default {
  name: "TitleInputWithRecommendations",
  props: {
    value: {
      type: String,
      default: "",
    },
    requestForm: {
      type: Object,
      default: "",
    },
  },
  data() {
    return {
      innerValue: this.value,
      loading: false,
      showDropdown: false,
      recommendations: [
        "用自然辩证法看待科技创新",
        "磁电耦合传感器的微弱磁场测量及实时检测研究",
        "集成微流通道的微波/红外隐身超材料吸波器研究",
      ],
    };
  },
  watch: {
    innerValue(newVal) {
      this.$emit("input", newVal);
    },
    value(newVal, oldVal) {
      console.log("new", newVal, oldVal);
      if (oldVal && newVal && oldVal !== newVal) {
        // 清空form
        this.$store.dispatch("app/setRequestForm", {});
        this.$store.dispatch("paper/setFormdataV2", {});
      }
      this.innerValue = newVal;
    },
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = true;
      this.getList();
    },
    getList() {
      Ming(this.requestForm);
      let data = {
        language: this.requestForm.language,
        field: this.requestForm.field[0],
        type: this.requestForm.type,
        user_idea: this.requestForm.title,
      };
      this.loading = true;
      title_recommend(data)
        .then((res) => {
          this.loading = false;
          Ming(res);
          this.recommendations = res.result;
        })
        .catch((err) => {});
    },
    selectRecommendation(recommendation) {
      this.innerValue = recommendation;
      this.showDropdown = false;
    },

    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.showDropdown = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style lang="scss" scoped>
.inner-stroke {
  position: relative;
  padding: 10px;
  background: white;
}

.inner-stroke::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, #e0b0ff, #7bb0ff);
  z-index: -1;
  margin: -1px;
}
.title-input-wrapper {
  position: relative;
  width: 600px;
}

.title-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 10;
  border-radius: 5px;
  padding: 1px;
  overflow: hidden;
}
.inner-dropdown-box {
  padding: 16px;
  border-radius: 5px;
  background-image: linear-gradient(180deg, #017eff33 1%, #017eff00 12%);
  padding-top: 0px;
}

.info-section {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  // background: linear-gradient(#f0f8ff, #f2f2ff);
  background-image: url("../../../../assets/images/tips_bg.png");
  background-size: 100% 100%;
  padding: 22px 0;
  position: relative;
  .sectionTitle {
    position: absolute;
    font-size: 13px;
    font-weight: bold;
    top: 0px;
    left: 0px;
    background: #0067ff;
    border-radius: 4px 0 4px 0;
    padding: 4px 4px 2px 4px;
    color: #fff;
  }
}

.info-item {
  text-align: center;
  width: 25%;
}

.info-title {
  font-weight: bold;
  color: #1b2126;
  font-size: 15px;
  span {
    color: #0066ff;
  }
}

.info-content {
  color: #606266;
}

.arrow {
  /* background-color: #dcdfe6; */
  font-size: 18px;
  margin: 0 10px;
  color: #0066ff;
}

.recommendation-header {
  font-weight: bold;
  font-size: 14px;
  color: #f56c6c;
  margin-bottom: 10px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .header-title {
    display: flex;
    align-items: center;
    color: #0066ff;
    font-size: 16px;
  }
  p {
    cursor: pointer;
    color: #1b2126;
    font-weight: 200;
    font-size: 14px;
    left: 100px;
    display: flex;
    align-items: center;
    i {
      font-size: 1.4em;
      margin-right: 2px;
      transform: rotate(90deg);
    }
  }
}

.recommendation-content {
  display: flex;
  flex-direction: column;
}

.recommendation-item {
  padding: 16px;
  cursor: pointer;
  color: #1b2126;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f4f5f7;
  margin-bottom: 10px;
  border-radius: 4px;
  .itemBtn {
    font-size: 13px;
    color: #547dff;
    margin-left: 6px;
    background: rgba(0, 102, 255, 0.1);
    padding: 3px 10px;
    border-radius: 4px;
    height: 24px;
    line-height: 20px;
  }
  .itemParen {
    // flex: 1;
    width: calc(100% - 63px);
  }
  .itemParen {
    padding: 0 14px;
    width: 380px;
    color: #2b2f36;
    flex: 1;
    font-size: 13px;
    line-height: 30px;
    color: #547dff;
    margin-left: 6px;
    font-size: 13px;
    color: #2b2f36;
    cursor: pointer;
  }
  &:hover {
    cursor: pointer;
    background-color: rgba(64, 158, 255, 0.1);
    color: #0066ff;
    .itemBtn {
      background: #0066ff;
      color: #fff;
    }
  }
}

.generate-button {
  text-align: right;
  margin-top: 10px;
}
.recomBtn {
  position: absolute;
  width: 135px;
  height: 32px;
  background: #f4f4fe;
  border-radius: 6px 6px 6px 6px;
  text-align: center;
  line-height: 32px;
  font-weight: 400;
  color: #fff;
  right: 3px;
  z-index: 2;
  top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;

  font-family: PingFangSC-SNaNpxibold;
  font-weight: 600;
  font-size: 13px;
  color: #ffffff;
  letter-spacing: 0;
  background: url("../../../../assets/images/index/btn_aiznmt.png") no-repeat 0
    0 / 100% 100%;
  cursor: pointer;

  .starSpan {
    display: inline-block;
    width: 32px;
    height: 32px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  &:hover {
    .g-svg-icon {
      color: #fff;
    }
  }
}
.g-svg-icon {
  font-size: 20x;
  color: #3355ff;
  margin-right: 5px;
}
.titleTip {
  width: 340px;
  height: 32px;
  background: #0066ff1a;
  border-radius: 8px 12px 0 8px;
  position: absolute;
  top: -32px;
  left: 0px;
  padding-left: 10px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #0066ff;
  line-height: 32px;
  span {
    font-size: 12px;
    margin-left: 8px;
  }
}
</style>
