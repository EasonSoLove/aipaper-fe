<template>
  <div
    style="
      background-color: #fff;
      margin-top: -20px;
      padding-left: 20px;
      padding-bottom: 50px;
      padding-top: 50px;
    "
  >
    <!-- 页面名称 -->
    <h2>文件上传与解析</h2>
    <el-upload
      ref="upload"
      action=""
      :http-request="handleUpload"
      :before-upload="beforeUpload"
      multiple
      list-type="text"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">仅支持上传.docx文件</div>
    </el-upload>
    <div v-if="fileList.length">
      <h3>上传文件列表：</h3>
      <ul>
        <li v-for="(file, index) in fileList" :key="index">
          {{ file.file_name }} - 字符数: {{ file.file_chars }}
        </li>
      </ul>
      <p>总字符数: {{ totalChars }}</p>
      <p>Reduce Key: {{ reduceKey }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { upload_reduce_file } from "@/api/paper";
export default {
  name: "demo",
  data() {
    return {
      fileList: [],
      reduceKey: "",
      totalChars: 0,
    };
  },
  methods: {
    beforeUpload(file) {
      const isDocx =
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      if (!isDocx) {
        this.$message.error("上传文件只能是.docx格式!");
      }
      return isDocx;
    },
    async handleUpload({ file, onProgress, onSuccess, onError }) {
      console.log("fiel", file);
      const formData = new FormData();
      formData.append("files", file);
      formData.append("reduce_key", this.reduceKey);

      try {
        upload_reduce_file(formData).then((res) => {
          console.log("res", res);
          if (response.data.code === 200) {
            this.fileList = response.data.result.file_list;
            this.reduceKey = response.data.result.reduce_key;
            this.totalChars = response.data.result.word_count;
            onSuccess(response.data);
          } else {
            this.$message.error(response.data.message || "上传失败");
            onError();
          }
        });
      } catch (error) {
        console.error("Upload error:", error);
        this.$message.error("上传出错，请检查网络或联系管理员");
        onError(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
h2 {
  margin-bottom: 20px;
}
.el-upload__tip {
  color: #666;
}
</style>
