<template>
  <div>
    <!-- 页面名称 -->
    <el-dialog
      append-to-body
      :visible.sync="dialogVisible"
      :width="device == 'mobile' ? '90%' : '800px'"
      :before-close="handleClose"
      class="custom-dialog"
      :show-close="false"
    >
      <div class="popup-overlay">
        <div class="popup-container">
          <div class="popup-left">
            <div class="popConTitle">免费参加活动, 优惠享不停</div>

            <div class="test2Box">
              <p>
                参加
                <span>
                  <i><b>B站 / </b></i>
                  <i><b>小红书</b></i>
                </span>
                专属活动
              </p>
              <p style="font-size: 16px; margin-top: 20px; padding-right: 40px">
                享折扣券、免费生成券、论文查重券等各种福利
              </p>
              <!-- <img src="@/assets/images/bg/text2.png" alt="" /> -->
            </div>

            <!-- <div class="countImg">送 <span>10000字</span> 论文查重券</div> -->
            <div class="content">
              <h4>小红书专属福利：</h4>
              <p>-- 点赞、收藏+关注，享8折优惠券</p>
              <p>-- +转发笔记，享7折优惠券</p>
              <h4>B站专属福利：</h4>
              <p>-- 一键三连 享8折优惠券</p>
              <p>-- +转发视频，享7折优惠券</p>
            </div>
          </div>
          <div class="popup-right">
            <span @click="closeDialog" class="closeIcon">
              <i class="el-icon-close"></i>
            </span>
            <!-- <img src="qr-code-placeholder.png" alt="QR Code" /> -->
            <div class="popupHeader">
              <span>
                <img src="@/assets/images/logoMax.png" alt="" />
              </span>
              万象写作
            </div>
            <div class="qywxBox">
              <img :src="imgData.image_url" alt="" />
            </div>
            <div class="popupBottom">
              <p>添加客服微信 <span class="red">免费</span> 领礼包</p>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { inviteFetch } from "@/api/paper";
// import webinfo from "@/components/webinfo.vue";
// import eventBus from "@/utils/eventBus";

export default {
  name: "demo",
  data() {
    return {
      // 定义变量
      dialogVisible: false,
      inv_code_url: "",
    };
  },
  computed: {
    ...mapGetters(["agent_image", "device"]),
    imgData() {
      return this.agent_image.find((image) => image.id === 5);
    },
  },
  methods: {
    showInit() {
      this.dialogVisible = true;
      // inviteFetch().then((res) => {
      //   this.inv_code_url = res.result.inv_code_url;
      // });
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    copyLink() {
      const el = document.createElement("textarea");
      el.value = this.inv_code_url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      // alert("链接已复制到剪贴板");
      this.$message({
        type: "success",
        message: "链接已复制到剪贴板",
      });
    },
    // 定义方法
    handleClose(done) {
      done();

      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
    },
  },
  components: {
    // webinfo,
  },
  mounted() {
    // eventBus.emit("sendOutline", 5); // 发布事件
  },
  created() {
    // eventBus.on("sendOutline", this.addE); // 订阅事件
  },
  beforeDestroy() {
    // eventBus.off("sendOutline", this.addE); // 移除事件监听
  },
};
</script>
<style lang="scss" scoped>
// 引入scss
// @import "@/styles/variables.scss";
// @import "@/styles/mediaMain.scss";
// @import './index.scss';

// 媒体查询
// @media only screen and (max-width: 939px) {
// }
// @media only screen and (max-width: 768px) {
// }
.popup-overlay {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
}

.popup-container {
  display: flex;
  background: white;
  position: absolute;
  top: 35%;
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
  max-width: 800px;
  margin-top: -56px;
}

.popup-left,
.popup-right {
  width: 400px;
  padding: 50px 20px;
  position: relative;
}

.popup-left {
  flex: 1;
  background: url("../../assets/images/bg/bg.png") no-repeat 0 0 / 100% 100%;
  color: white;
}

.popup-right {
  width: 400px;
  padding: 30px 50px;
  text-align: center;
  .closeIcon {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 22px;
    &:hover {
      cursor: pointer;
      color: #35f;
    }
  }
}

.popup-right img {
  width: 270px;
  height: 270px;
  margin: 0 auto;
}

h2,
h3 {
  margin: 0;
  padding: 10px 0;
}

h4 {
  margin: 20px 0 5px;
}

.content p {
  margin: 5px 0;
  font-size: 16px;
}
.popupHeader {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #000;
  margin-bottom: 20px;
  & > span {
    margin-right: 10px;
    display: inline-block;
    width: 40px;
    height: 40px;
    padding: 5px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.popupBottom {
  margin-top: 40px;
  font-size: 16px;
  font-weight: bold;
}
.custom-dialog .el-dialog__header {
  display: none;
}
.test2Box {
  width: 397px;
  height: 84px;
  font-size: 28px;
  img {
    width: 100%;
    height: 100%;
  }
}
.countImg {
  font-size: 22px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  span {
    display: inline-block;
    width: 140px;
    height: 93px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 24px;
    background: url("../../assets/images/bg/bg3.png") no-repeat 0 0 /100% 100%;
  }
}
.popConTitle {
  font-size: 20px;
  line-height: 30px;
  margin-bottom: 30px;
}
</style>
