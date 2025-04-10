<template>
  <div class="container Excontainer">
    <div class="swiperListTitle" style="margin-top: 50px">
      <p>
        <span> 论文宝典下载</span>
        <span class="rightIcon">
          <img src="@/assets/images/index/home_title_bg.png" alt="" />
        </span>
      </p>
    </div>
    <div class="adBox madBox">
      <div
        class="card"
        v-for="(card, index) in references"
        :key="index"
        @click="openLink(card.link)"
      >
        <div class="image-container">
          <img
            :src="getAdvantageImage(index)"
            alt="advantage image"
            class="card-image"
          />
          <div class="content">
            <h3>{{ card.name }}</h3>
          </div>
          <div class="btnClass">
            <el-button type="primary" size="mini" plain
              ><i class="el-icon-download"></i>下载</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { references } from "@/api/paper";

export default {
  name: "References",
  data() {
    return {
      references: [],
      advantageList: [
        require("@/assets/images/index/home_banner02_01_pc@2x.png"),
        require("@/assets/images/index/home_banner02_02_pc@2x.png"),
        require("@/assets/images/index/home_banner02_03_pc@2x.png"),
        require("@/assets/images/index/home_banner02_04_pc@2x.png"),
        require("@/assets/images/index/home_banner02_05_pc@2x.png"),
        require("@/assets/images/index/home_banner02_06_pc@2x.png"),
      ],
    };
  },
  created() {
    this.fetchReferences();
  },
  methods: {
    async fetchReferences() {
      try {
        const res = await references();
        console.log("res", res);
        this.references = res.result;
      } catch (error) {
        console.error("Failed to fetch references:", error);
      }
    },
    getAdvantageImage(index) {
      return this.advantageList[index % this.advantageList.length];
    },
    openLink(link) {
      if (link) {
        window.open(link, "_blank");
      } else {
        console.warn("Link is not available for this reference.");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  width: calc((100% - 40px) / 3);
  margin-bottom: 20px;
  box-sizing: border-box;
  border-radius: 8px;
  overflow: hidden;
  background-image: linear-gradient(
    269deg,
    #ffffff 0%,
    #ffffff52 35%,
    #ffffff00 100%
  );
  border-radius: 8px;
  cursor: pointer; // 增加鼠标指针样式，提示用户可点击
  .image-container {
    position: relative;
    width: 100%;
    height: 140px;

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .content {
      position: absolute;
      top: 40px;
      left: 30px;
      color: #1b2126;

      h3 {
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        font-size: 20px;
        color: #1b2126;
        letter-spacing: 0;
        margin: 0;
      }

      p {
        opacity: 0.5;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 14px;
        color: #1b2126;
        letter-spacing: 0;
        margin: 7px 0 0;
      }
    }
  }
}
.adBox {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
  padding: 30px;
}
.swiperListTitle {
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    text-align: center;
    position: relative;
    font-family: PingFangSC-SNaNpxibold;
    font-weight: 600;
    font-size: 32px;
    color: #1b2126;
    letter-spacing: 0;
    text-align: center;
  }
  .rightIcon {
    width: 30px;
    height: 30px;
    display: inline-block;
    position: absolute;
    right: -10px;
    top: -8px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.btnClass {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>
