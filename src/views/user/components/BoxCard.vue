<template>
  <el-card class="box-card-component" style="margin-left: 8px">
    <div slot="header" class="box-card-header">
      <img
        src="https://wpimg.wallstcn.com/e7d23d71-cf19-4b90-a1cc-f56af8c0903d.png"
      />
    </div>
    <div style="position: relative">
      <pan-thumb :image="avatar" class="panThumb" />
      <mallki class-name="mallki-text" text="vue-element-admin" />
      <div style="padding-top: 35px" class="progress-item">
        <span>总付费率</span>
        <el-progress :percentage="70" />
      </div>
      <div class="progress-item">
        <span>转化率</span>
        <el-progress :percentage="18" />
      </div>
      <div class="progress-item">
        <span>推广量</span>
        <el-progress :percentage="12" />
      </div>
      <div class="progress-item">
        <span>已成交率</span>
        <el-progress :percentage="100" status="success" />
      </div>
    </div>
  </el-card>
</template>

<script>
import PanThumb from "@/components/PanThumb";
import Mallki from "@/components/TextHoverEffect/Mallki";

export default {
  components: { PanThumb, Mallki },

  filters: {
    statusFilter(status) {
      const statusMap = {
        success: "success",
        pending: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      statisticsData: {
        article_count: 1024,
        pageviews_count: 1024,
      },
      name: "管理员",
      avatar:
        "https://gw.alicdn.com/imgextra/i1/O1CN01vmyavS1TH64dFg6YZ_!!6000000002356-0-tps-1024-1024.jpg",
      roles: ["admin"],
    };
  },
  computed: {},
};
</script>

<style lang="scss" >
.box-card-component {
  .el-card__header {
    padding: 0px !important;
  }
}
</style>
<style lang="scss" scoped>
.box-card-component {
  .box-card-header {
    position: relative;
    height: 220px;
    img {
      width: 100%;
      height: 100%;
      transition: all 0.2s linear;
      &:hover {
        transform: scale(1.1, 1.1);
        filter: contrast(130%);
      }
    }
  }
  .mallki-text {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 20px;
    font-weight: bold;
  }
  .panThumb {
    z-index: 100;
    height: 70px !important;
    width: 70px !important;
    position: absolute !important;
    top: -45px;
    left: 0px;
    border: 5px solid #ffffff;
    background-color: #fff;
    margin: auto;
    box-shadow: none !important;
    ::v-deep .pan-info {
      box-shadow: none !important;
    }
  }
  .progress-item {
    margin-bottom: 10px;
    font-size: 14px;
  }
  @media only screen and (max-width: 1510px) {
    .mallki-text {
      display: none;
    }
  }
}
</style>
