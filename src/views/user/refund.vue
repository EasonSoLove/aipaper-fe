<template>
  <div class="setContainer">
    <template>
      <!-- 搜索栏 -->
      <el-form inline :model="searchForm" class="demo-form-inline">
        <el-form-item label="订单编号">
          <el-input
            style="width: 400px"
            v-model="searchForm.out_trade_no"
            placeholder="请输入订单编号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <div class="demo-form-inline">
      <!-- 表格 -->
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column
          prop="out_trade_no"
          label="商家订单号"
        ></el-table-column>
        <el-table-column prop="trade_no" label="支付宝订单号"></el-table-column>
        <el-table-column prop="payment_status" label="交易状态">
          <template slot-scope="scope">
            {{ formatOrderTypeStatus2(scope.row.payment_status) }}
          </template>
        </el-table-column>
        <el-table-column prop="total_price" label="订单金额"></el-table-column>
        <el-table-column prop="pay_amount" label="实付金额"></el-table-column>
        <el-table-column prop="created_at" label="订单创建时间">
          <template slot-scope="scope">
            {{ scope.row.created_at | dateFormatter }}
          </template>
        </el-table-column>
        <el-table-column prop="updated_at" label="订单更新时间">
          <template slot-scope="scope">
            {{ scope.row.updated_at | dateFormatter }}
          </template>
        </el-table-column>
        <el-table-column prop="order_type" label="订单类型">
          <template slot-scope="scope">
            {{ formatOrderTypeStatus(scope.row.order_type) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button
              @click="handleRefund(scope.row)"
              type="primary"
              plain
              size="mini"
              >退款</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pageBox">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="searchForm.page_size"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
    <apply-div></apply-div>
    <!-- 退款申请弹窗 -->
    <el-dialog :visible.sync="refundDialogVisible" title="退款申请">
      <el-form
        :model="refundForm"
        :rules="refundRules"
        ref="refundForm"
        label-width="120px"
      >
        <el-form-item label="退款金额" prop="refund_amount">
          <el-input
            v-model="refundForm.refund_amount"
            placeholder="请输入退款金额"
          ></el-input>
        </el-form-item>
        <el-form-item label="退款原因" prop="refund_reason">
          <el-input
            v-model="refundForm.refund_reason"
            placeholder="请输入退款原因"
          ></el-input>
        </el-form-item>
        <el-form-item label="补充说明" prop="refund_photo">
          <el-upload
            action=""
            :before-upload="handleBeforeUpload"
            list-type="picture-card"
            :on-change="handlePhotoChange"
            :limit="1"
            :auto-upload="false"
          >
            <i class="el-icon-upload"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户收款码" prop="manual_refund_qrcode">
          <el-upload
            :before-upload="handleBeforeUpload"
            action=""
            list-type="picture-card"
            :on-change="handleQrCodeChange"
            :limit="1"
            :auto-upload="false"
          >
            <i class="el-icon-upload"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refundDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRefund('refundForm')"
          >提交</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import applyDiv from "./components/apply.vue";
import { mapGetters } from "vuex";

import { pending_order, apply } from "@/api/user";
export default {
  components: {
    applyDiv,
  },
  data() {
    return {
      searchForm: {
        out_trade_no: "",
        page_num: 1,
        page_size: 10,
      },
      refundDialogVisible: false,
      refundForm: {
        refund_amount: "",
        refund_reason: "",
        refund_photo: null,
        manual_refund_qrcode: null,
      },
      refundRules: {
        refund_amount: [
          { required: true, message: "请输入退款金额", trigger: "blur" },
          {
            type: "number",
            message: "金额必须为数字",
            transform(value) {
              return Number(value);
            },
            trigger: "blur",
          },
        ],
        refund_reason: [
          { required: false, message: "请输入退款原因", trigger: "blur" },
        ],
        refund_photo: [
          { required: true, message: "请上传补充说明图片", trigger: "change" },
        ],
        manual_refund_qrcode: [
          {
            required: true,
            message: "请上传用户收款码图片",
            trigger: "change",
          },
        ],
      },
      tableData: [],
      total: 0,
    };
  },
  computed: {
    ...mapGetters(["globalCode"]),
  },
  methods: {
    getList() {
      pending_order(this.searchForm).then((res) => {
        this.tableData = [res.result];
        this.total = res.result.length;
      });
    },
    handleReset() {
      this.searchForm.out_trade_no = "";
    },
    handlePageChange(page) {
      this.searchForm.page_num = page;
      this.getList();
    },
    formatOrderTypeStatus2(status) {
      const statusMap = this.globalCode.payment_status_code;
      let name = "";
      statusMap.forEach((item) => {
        if (item.code == status) {
          name = item.description;
        }
      });
      return name || "未知状态";
    },
    formatOrderTypeStatus(status) {
      const statusMap = this.globalCode.order_type_code;

      let name = "";
      statusMap.forEach((item) => {
        if (item.code == status) {
          name = item.description;
        }
      });
      return name || "未知状态";
    },
    handleRefund(row) {
      this.refundForm = {
        out_trade_no: row.out_trade_no,
        order_id: row.id,
        refund_amount: "",
        refund_reason: "",
        refund_photo: null,
        manual_refund_qrcode: null,
      };
      this.refundDialogVisible = true;
    },
    handleBeforeUpload() {
      return false; // 阻止默认的上传行为
    },
    handlePhotoChange(file) {
      this.refundForm.refund_photo = file.raw;
    },
    handleQrCodeChange(file) {
      this.refundForm.manual_refund_qrcode = file.raw;
    },
    submitRefund(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const formData = new FormData();
          formData.append("order_id", this.refundForm.order_id);
          formData.append("out_trade_no", this.refundForm.out_trade_no);
          formData.append("refund_amount", this.refundForm.refund_amount);
          formData.append("refund_reason", this.refundForm.refund_reason);
          formData.append("refund_photo", this.refundForm.refund_photo);
          formData.append(
            "manual_refund_qrcode",
            this.refundForm.manual_refund_qrcode
          );

          apply(formData).then((res) => {
            if (res.code === 200) {
              this.$message.success(res.message);
              this.refundDialogVisible = false;
              this.getList();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.demo-form-inline {
  margin-bottom: 20px;
  padding: 18px 18px 0;
  background: #fff;
  box-sizing: border-box;
  overflow-x: hidden;
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  box-shadow: 0 0 12px #0000000d;
}
.setContainer {
  padding: 20px;
}
.pageBox {
  padding-bottom: 20px;
  margin-top: 20px;
  text-align: right;
}
</style>
