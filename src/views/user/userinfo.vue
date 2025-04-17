<template>
  <div class="wrapper">
    <div class="topBar">
      <i class="el-icon-arrow-left" @click="goBack"></i>
      账号设置
    </div>
    <div class="userInfoBox">
      <!-- 页面名称 -->
      <div class="info">
        <div class="info_left imgBox">
          <!-- <span class="userNameIcon">{{ user.name.slice(0,1) }}</span> -->
          <img
            class="userNameIcon"
            v-if="userInfo.photo"
            :src="userInfo.photo"
            alt=""
          />
          <img class="userNameIcon" v-else :src="avatar" alt="" />
          <div class="imgEdit" @click="dialogVisible = true">编辑</div>
        </div>
        <div class="info_right"></div>
      </div>
      <div class="info">
        <div class="info_left">
          <p class="infoLabel">用户名</p>
          <p class="InfoValue">{{ userInfo.user_name }}</p>
        </div>
        <div class="info_right">
          <el-button @click="openUserSet">编辑</el-button>
        </div>
      </div>
      <div class="info">
        <div class="info_left">
          <p class="infoLabel">手机号</p>
          <p class="InfoValue">{{ userInfo.phone }}</p>
        </div>
        <div class="info_right">
          <!-- <el-button @click="$devf">编辑</el-button> -->
        </div>
      </div>
      <!-- <div class="info">
        <div class="info_left">
          <p class="infoLabel">密码</p>
          <p class="InfoValue">******</p>
        </div>
        <div class="info_right">
          <el-button @click="$devf">编辑</el-button>
        </div>
      </div>
      </div> -->
      <p
        v-if="
          userInfo.permission == 'AGENT' || userInfo.permission == 'SUPER_ADMIN'
        "
        class="imguploadTtile"
      >
        上传网站所需物料:
      </p>
      <div
        v-if="
          userInfo.permission == 'AGENT' || userInfo.permission == 'SUPER_ADMIN'
        "
        class=""
      >
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>底部栏三张图片</span>
          </div>
          <div class="cardMain userUploadBox">
            <!-- 公众号二维码 -->
            <div class="uploadLi">
              <el-upload
                class="imgUploader"
                action="https://api.mixpaper.cn/api/ai-paper/user/edit"
                :data="{ image: 2, image_name: imgId2.name }"
                :show-file-list="false"
                :on-success="handleSuccess"
                :on-error="handleError"
                :before-upload="beforeAvatarUpload"
                :http-request="handleHttpRequest"
              >
                <img
                  v-if="imgId2.image_url"
                  :src="imgId2.image_url"
                  class="avatar"
                />
                <i v-else class="el-icon-plus liImgLi"></i>
              </el-upload>
              <p>
                <el-input
                  v-model="imgId2.name"
                  placeholder="请输入内容"
                  style="width: 120px"
                  @blur="saveInput(2)"
                ></el-input>
              </p>
            </div>

            <!-- 小红书 -->
            <div class="uploadLi">
              <el-upload
                class="imgUploader"
                action="https://api.mixpaper.cn/api/ai-paper/user/edit"
                :data="{ image: 3, image_name: imgId3.name }"
                :show-file-list="false"
                :on-success="handleSuccess"
                :on-error="handleError"
                :before-upload="beforeAvatarUpload"
                :http-request="handleHttpRequest"
              >
                <img
                  v-if="imgId3.image_url"
                  :src="imgId3.image_url"
                  class="avatar"
                />
                <i v-else class="el-icon-plus liImgLi"></i>
              </el-upload>
              <p>
                <el-input
                  v-model="imgId3.name"
                  placeholder="请输入内容"
                  style="width: 120px"
                  @blur="saveInput(3)"
                ></el-input>
              </p>
            </div>
            <!-- B站 -->
            <div class="uploadLi">
              <el-upload
                class="imgUploader"
                action="https://api.mixpaper.cn/api/ai-paper/user/edit"
                :data="{ image: 4, image_name: imgId4.name }"
                :show-file-list="false"
                :on-success="handleSuccess"
                :on-error="handleError"
                :before-upload="beforeAvatarUpload"
                :http-request="handleHttpRequest"
              >
                <img
                  v-if="imgId4.image_url"
                  :src="imgId4.image_url"
                  class="avatar"
                />
                <i v-else class="el-icon-plus liImgLi"></i>
              </el-upload>
              <p>
                <el-input
                  v-model="imgId4.name"
                  placeholder="请输入内容"
                  style="width: 120px"
                  @blur="saveInput(4)"
                ></el-input>
              </p>
            </div>
          </div>
        </el-card>
        <!-- 联系客服 -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>右侧悬浮窗图片</span>
          </div>
          <div class="cardMain userUploadBox">
            <!-- <div class="uploadLi">
              <el-upload
                class="imgUploader"
                action="https://api.mixpaper.cn/api/ai-paper/user/edit"
                :data="{ image: 5, image_name: imgId5.name }"
                :show-file-list="false"
                :on-success="handleSuccess"
                :on-error="handleError"
                :before-upload="beforeAvatarUpload"
                :http-request="handleHttpRequest"
              >
                <img
                  v-if="imgId5.image_url"
                  :src="imgId5.image_url"
                  class="avatar"
                />
                <i v-else class="el-icon-plus liImgLi"></i>
              </el-upload>
              <p>
                <el-input
                  v-model="imgId5.name"
                  placeholder="请输入内容"
                  style="width: 120px"
                  @blur="saveInput(5)"
                ></el-input>
              </p>
            </div> -->
            <!-- 代理加盟 -->
            <div class="uploadLi">
              <el-upload
                class="imgUploader"
                action="https://api.mixpaper.cn/api/ai-paper/user/edit"
                :data="{ image: 6, image_name: imgId6.name }"
                :show-file-list="false"
                :on-success="handleSuccess"
                :on-error="handleError"
                :before-upload="beforeAvatarUpload"
                :http-request="handleHttpRequest"
              >
                <img
                  v-if="imgId6.image_url"
                  :src="imgId6.image_url"
                  class="avatar"
                />
                <i v-else class="el-icon-plus liImgLi"></i>
              </el-upload>
              <p>
                <el-input
                  v-model="imgId6.name"
                  placeholder="请输入内容"
                  style="width: 120px"
                  @blur="saveInput(6)"
                ></el-input>
              </p>
            </div>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>支付弹窗图片及活动弹窗图片</span>
          </div>
          <div class="cardMain userUploadBox">
            <div class="uploadLi">
              <el-upload
                class="imgUploader"
                action="https://api.mixpaper.cn/api/ai-paper/user/edit"
                :data="{ image: 7, image_name: imgId7.name }"
                :show-file-list="false"
                :on-success="handleSuccess"
                :on-error="handleError"
                :before-upload="beforeAvatarUpload"
                :http-request="handleHttpRequest"
              >
                <img
                  v-if="imgId7.image_url"
                  :src="imgId7.image_url"
                  class="avatar"
                />
                <i v-else class="el-icon-plus liImgLi"></i>
              </el-upload>
              <p>
                <el-input
                  v-model="imgId7.name"
                  placeholder="请输入内容"
                  style="width: 120px"
                  @blur="saveInput(7)"
                ></el-input>
              </p>
            </div>
            <div v-if="sub_domain == 'www'" class="uploadLi">
              <el-upload
                class="imgUploader"
                action="https://api.mixpaper.cn/api/ai-paper/user/edit"
                :data="{ image: 8, image_name: imgId8.name }"
                :show-file-list="false"
                :on-success="handleSuccess"
                :on-error="handleError"
                :before-upload="beforeAvatarUpload"
                :http-request="handleHttpRequest"
              >
                <img
                  v-if="imgId8.image_url"
                  :src="imgId8.image_url"
                  class="avatar"
                />
                <i v-else class="el-icon-plus liImgLi"></i>
              </el-upload>
              <p>
                <el-input
                  v-model="imgId8.name"
                  placeholder="请输入内容"
                  style="width: 120px"
                  @blur="saveInput(8)"
                ></el-input>
              </p>
            </div>
          </div>
        </el-card>
      </div>
      <div class="info">
        <el-button @click="loginOut">退出登录</el-button>
      </div>
    </div>
    <el-dialog title="编辑头像" :visible.sync="dialogVisible" width="500px">
      <div class="imgEditBox">
        <div class="upload">
          <el-upload
            class="avatar-uploader"
            action="https://api.mixpaper.cn/api/ai-paper/user/edit"
            :data="{ image: 1 }"
            :show-file-list="false"
            :on-success="handleSuccess"
            :on-error="handleError"
            :before-upload="beforeAvatarUpload"
            :http-request="handleHttpRequest"
          >
            <img v-if="true" :src="avatar" class="avatarUser" />
            <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" /> -->
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p>支持jpg、jpeg、png格式的图片，大小不超过3M</p>
        </div>
        <div class="preView">
          <div class="imgPre">
            <img :src="avatar" class="avatarUser2" />
          </div>
          <p>头像预览</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="编辑用户名"
      :visible.sync="userEditDialogStatus"
      :width="device == 'mobile' ? '80%' : '30%'"
    >
      <p style="margin-bottom: 10px">请输入用户名</p>
      <el-input placeholder="请输入用户名" v-model="username" clearable>
      </el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="userEditDialogStatus = false">取 消</el-button>
        <el-button type="primary" @click="setFormData"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
// import { sms } from "@/api/login";
// import webinfo from "@/components/webinfo.vue";
import { removeToken } from "@/utils/auth"; // get token from cookie
import { userEdit } from "@/api/user"; // get token from cookie

export default {
  name: "UserInfo",
  data() {
    return {
      // 定义变量
      dialogVisible: false,
      imageUrl: "",
      userEditDialogStatus: false,
      username: "",
    };
  },
  components: {
    // webinfo,
  },
  mounted() {
    // 页面初始化
    // this.getList();
  },

  computed: {
    ...mapGetters([
      "avatar",
      "name",
      "userInfo",
      "agent_image",
      "device",
      "sub_domain",
    ]),
    imgId2() {
      return this.agent_image.find((image) => image.id === 2);
    },
    imgId3() {
      return this.agent_image.find((image) => image.id === 3);
    },
    imgId4() {
      return this.agent_image.find((image) => image.id === 4);
    },
    imgId5() {
      return this.agent_image.find((image) => image.id === 5);
    },
    imgId6() {
      return this.agent_image.find((image) => image.id === 6);
    },
    imgId7() {
      return this.agent_image.find((image) => image.id === 7);
    },
    imgId8() {
      return this.agent_image.find((image) => image.id === 8);
    },
  },
  methods: {
    setFormData() {
      const formData = new FormData();
      formData.append("user_name", this.username);

      userEdit(formData)
        .then((response) => {
          this.$message({
            type: "success",
            message: "用户名已修改!",
          });
          this.$store.dispatch("user/getInfo");
          this.userEditDialogStatus = false;
        })
        .catch((error) => {});
    },
    openUserSet() {
      this.userEditDialogStatus = true;
      this.username = "";
    },
    openModal() {
      this.$refs.globalModal.open();
    },

    handleHttpRequest({ file, data, onSuccess, onError }) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("image", data.image);
      formData.append("image_name", data.image_name);

      userEdit(formData)
        .then((response) => {
          onSuccess(response.data);
        })
        .catch((error) => {
          onError(error);
        });
    },
    saveInput(index) {
      let imgData = this.agent_image.find((image) => image.id == index);
      const formData = new FormData();
      formData.append("image", index);
      formData.append("file", "");
      formData.append("image_name", imgData.name);
      Ming(
        "currentName",
        this.agent_image.find((image) => image.id == index)
      );
      userEdit(formData)
        .then((response) => {
          this.$message({
            type: "success",
            message: "保存成功!",
          });
        })
        .catch((error) => {});
    },
    // 定义方法
    goBack() {
      // 使用 history.back() 方法返回上一页
      history.back();
    },
    loginOut() {
      removeToken();
      this.$router.push("/home/home");
      // location.reload();
    },
    uploadImg() {
      Ming("91---", "上传图片");
    },
    handleSuccess(res, file) {
      this.$message.success("上传成功!");
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.$store.dispatch("user/getInfo");
    },
    handleError(err, file, fileList) {
      this.$message.error("上传失败!");
    },
    beforeAvatarUpload(file) {
      const isImage = ["image/jpeg", "image/jpg", "image/png"].includes(
        file.type
      );
      const isLt2M = file.size / 1024 / 1024 < 3;

      if (!isImage) {
        this.$message.error("上传头像图片只能是 JPG、JPEG 或 PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 3MB!");
      }
      return isImage && isLt2M;
    },
  },
};
</script>
<style lang="scss" scoped>
// 引入scss
// @import './index.scss';

// 媒体查询
// @media only screen and (max-width: 939px) {
// }
* p {
  margin: 0px;
}

.wrapper .topBar {
  line-height: 3em;
  padding: 0 2em;
  border-bottom: 1px solid #0000001f;
}

.wrapper .topBar i {
  margin-right: 20px;
}

.userInfoBox {
  min-width: 400px;
  max-width: 600px;
  min-height: 600px;
  margin: 0 auto;
  // background: rgb(136, 134, 134);
  padding: 20px 0;
}

.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #0000001f;
  padding: 10px;
}

.info:first-child {
  border-bottom: 0px;
}

.info:last-child {
  border-bottom: 0px;
  padding: 20px 0;
}
.imgBox {
  position: relative;
  overflow: hidden;
  border-radius: 25px;
  cursor: pointer;
}
.info_left .userNameIcon {
  display: block;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  text-align: center;
  line-height: 50px;
  font-size: 20px;
  background: #fff;
  color: #fff;
}

.info_left .infoLabel {
  line-height: 2em;
  font-size: 16px;
  color: #000;
}

.info_left .InfoValue {
  line-height: 2em;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
}
.imgEdit {
  display: none;
}
.info_left:hover .imgEdit {
  display: block;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: #00000099;
  line-height: 50px;
  font-size: 14px;
  color: #fff;
  text-align: center;
}
// 上传头像
.imgEditBox {
  display: top;
  display: flex;
  align-items: flex-start;
  justify-content: space-evenly;
}
.upload {
  flex: none;
}
.box-card {
  margin-top: 10px;
}
.avatar-uploader {
  display: inline-block;
  width: 300px;
  height: 300px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader ::v-deep .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 298px;
  height: 298px;
  line-height: 298px;
  text-align: center;
}
.userUploadBox {
  display: flex;
  flex-wrap: wrap;
}

.uploadLi {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 15px;
  p {
    margin-top: 10px;
    color: #606266;
  }
  .imgUploader {
    width: 100px;
    height: 100px;
    border-radius: 6px;
    border: 1px dashed #d9d9d9;
  }
  .liImgLi {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
}
.imgUploader {
  width: 100px;
  height: 100px;
  background: #fff;
}
.avatar {
  width: 98px;
  height: 98px;
  display: block;
}
.avatarUser {
  width: 298px;
  height: 298px;
  display: block;
}
.avatarUser2 {
  width: 70px;
  height: 70px;
  display: block;
}
.preView {
  flex: none;
  color: #2f2e3f;
  opacity: 0.65;
  font-size: 14px;
  line-height: 19px;
  width: 70px;
  text-align: center;
}
.imgPre {
  width: 70px;
  height: 70px;
  background: #f1f1f5;
  border-radius: 35px;
  overflow: hidden;
  margin: 10px 0;
}
.imguploadTtile {
  font-size: 18px;
  margin-top: 40px;
  font-weight: bold;
}
</style>
