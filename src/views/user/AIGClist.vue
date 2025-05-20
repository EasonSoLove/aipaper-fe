<template>
  <div>
    <div class="setContainer">
      <template>
        <el-form inline :model="searchForm" class="demo-form-inline">
          <el-form-item label="订单编号">
            <el-input
              style="width: 400px"
              v-model="searchForm.out_trade_no"
              placeholder="请输入订单编号"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="降AIGC类别">
            <el-select
              v-model="searchForm.reduce_aigc_type"
              placeholder="请选择降AIGC类别"
            >
              <el-option label="降知网AIGC" value="kns"></el-option>
              <el-option label="降维普AIGC" value="weipu"></el-option>
              <el-option label="降格子达AIGC" value="gezida"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="getRefundList">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- 表格 -->
      <el-table :data="refundTableData" border style="width: 100%">
        <!-- ID -->
        <!-- <el-table-column prop="id" label="ID" align="center"></el-table-column> -->
        <!-- 用户ID -->
        <el-table-column
          prop="user_id"
          label="用户ID"
          align="center"
        ></el-table-column>
        <!-- 任务key -->
        <el-table-column
          prop="reduce_key"
          label="任务Key"
          align="center"
        ></el-table-column>
        <!-- 降AIGC类别 -->
        <el-table-column
          prop="reduce_aigc_type"
          label="降AIGC类别"
          align="center"
        >
          <template slot-scope="scope">
            {{ formatOrderTypeStatus2(scope.row.reduce_aigc_type) }}
          </template>
        </el-table-column>
        <!-- 字符数 -->
        <el-table-column
          prop="total_chars"
          label="字符数"
          align="center"
        ></el-table-column>
        <!-- 文件名 -->
        <el-table-column
          prop="file_name"
          label="文件名"
          align="center"
        ></el-table-column>
        <!-- 原文下载地址 -->
        <el-table-column label="原文下载地址" align="center">
          <template slot-scope="scope">
            <a
              style="color: blue; text-decoration: underline"
              :href="scope.row.file_path"
              target="_blank"
              >{{ scope.row.file_name }}</a
            >
          </template>
        </el-table-column>
        <!-- 任务状态 -->
        <el-table-column prop="stage" label="任务状态" align="center">
          <template slot-scope="scope">
            {{ scope.row.stage == 1 ? "未完成" : "完成" }}
          </template>
        </el-table-column>
        <!-- 创建时间 -->
        <el-table-column prop="created_at" label="创建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.created_at | dateFormatter }}
          </template>
        </el-table-column>
        <!-- 更新时间 -->
        <el-table-column prop="updated_at" label="更新时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.updated_at | dateFormatter }}
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" align="center" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button
              @click="downloadUrl(scope.row)"
              type="primary"
              size="mini"
              >下载</el-button
            >

            <el-button @click="openUpload(scope.row)" type="primary" size="mini"
              >上传</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pageBox">
        <el-pagination
          background
          layout="total,prev, pager, next"
          :total="refundTotal"
          :page-size="searchForm.page_size"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 上传弹窗 -->
    <el-dialog :visible.sync="uploadDialogVisible" title="上传文件">
      <el-upload
        ref="upload"
        class="upload-demo"
        drag
        action=""
        :show-file-list="true"
        :limit="1"
        :http-request="handleUpload"
        :before-upload="beforeUpload"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          <p>
            将文件拖到此处，或<em style="font-weight: bold; color: #0066ff"
              >点击上传</em
            >
          </p>
          <p style="margin-top: 10px">
            仅支持上传
            <i style="color: #0066ff; font-weight: bold">docx / txt </i>
            文件, 大小不超过
            <i style="color: #0066ff; font-weight: bold">10M</i>
          </p>
        </div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { third_aigc_task, task_complete } from "@/api/paper";

export default {
  data() {
    return {
      searchForm: {
        out_trade_no: "",
        reduce_aigc_type: "",
        page_num: 1,
        page_size: 10,
      },
      refundTableData: [],
      refundTotal: 0,
      uploadDialogVisible: false,
      currentUploadRow: null,
      fileList: [],
      uploadUrl: "/api/ai-paper/third_aigc/task_complete",
      uploadId: "",
    };
  },
  methods: {
    openUpload(row) {
      this.uploadDialogVisible = true;
      this.uploadId = row.id;
    },
    formatOrderTypeStatus2(status) {
      const statusMap = [
        { code: "kns", name: "知网" },
        { code: "kns_urgent", name: "知网加急" },
        { code: "weipu", name: "维普" },
        { code: "weipu_urgent", name: "维普加急" },
        { code: "gezida", name: "格子达" },
        { code: "gezida_urgent", name: "格子达加急" },
      ];
      let name = "";
      statusMap.forEach((item) => {
        if (item.code == status) {
          name = item.name;
        }
      });
      return name || "未知状态";
    },
    handleUpload({ file, onProgress, onSuccess, onError }) {
      console.log("fiel", file);
      const formData = new FormData();
      formData.append("files", file);
      formData.append("id", this.uploadId);

      task_complete(formData)
        .then((res) => {
          console.log("res", res);
          if (res.code === 200) {
            //       this.fileList = this.resdata.file_list;
            // this.totalChars = this.resdata.word_count;
            // this.reduceKey = this.resdata.reduce_key;
            this.uploadDialogVisible = false;
            this.$message({
              type: "success",
              message: "上传成功, 任务完成!",
            });
            this.searchForm.page_num = 1;

            this.getRefundList();
          } else {
            onError();
          }
        })
        .catch(() => {
          this.uploadDialogVisible = false;
        });
    },
    beforeUpload(file) {
      const isDocxOrTxt =
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "text/plain";
      if (!isDocxOrTxt) {
        this.$message.error("上传文件只能是.docx或.txt格式!");
      }
      return isDocxOrTxt;
    },
    getRefundList() {
      third_aigc_task(this.searchForm).then((res) => {
        if (res.code === 200) {
          this.refundTableData = res.result.reduce_aigc_list;
          this.refundTotal = res.result.total;
        }
      });
    },
    handlePageChange(page) {
      this.searchForm.page_num = page;
      this.getRefundList();
    },

    downloadUrl(row) {
      window.open(row.file_path, "_blank");
    },
    handleReset() {
      this.searchForm.out_trade_no = "";
      this.searchForm.reduce_aigc_type = "";
    },
  },
  mounted() {
    this.getRefundList();
  },
};
</script>

<style scoped>
.setContainer {
  padding: 20px;
}
.pageBox {
  padding-bottom: 20px;
  margin-top: 20px;
  text-align: right;
}
</style>
