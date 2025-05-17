<template>
  <div class="setContainer">
    <template>
      <!-- 搜索栏 -->
      <el-form inline :model="searchForm" class="demo-form-inline">
        <el-form-item label="订单编号">
          <el-input
            v-model="searchForm.out_trade_no"
            placeholder="请输入订单编号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRefundList">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <div class="demo-form-inline">
      <!-- 表格 -->
      <el-table :data="refundTableData" border style="width: 100%">
        <el-table-column
          prop="out_trade_no"
          label="退款订单号"
        ></el-table-column>
        <el-table-column
          prop="refund_status"
          label="退款状态"
          :formatter="formatRefundStatus"
        ></el-table-column>
        <el-table-column
          prop="refund_amount"
          label="申请退款金额"
        ></el-table-column>
        <el-table-column
          prop="refund_reason"
          label="退款原因"
        ></el-table-column>
        <el-table-column
          label="补充说明"
          width="120"
          scopedSlots="{ default: scope => <el-button type='text' @click='viewImage(scope.row.refund_photo)'>查看</el-button> }"
        ></el-table-column>
        <el-table-column
          label="支付宝二维码"
          width="120"
          scopedSlots="{ default: scope => <el-button type='text' @click='viewImage(scope.row.manual_refund_qrcode)'>查看</el-button> }"
        ></el-table-column>
        <el-table-column prop="created_at" label="创建时间"></el-table-column>
        <el-table-column prop="updated_at" label="更新时间"></el-table-column>
        <el-table-column label="操作" fixed="right" width="220">
          <template slot-scope="scope">
            <el-button
              @click="handleAudit(scope.row, 'PASS')"
              type="text"
              size="small"
              >审核通过</el-button
            >
            <el-button
              @click="handleAudit(scope.row, 'REJECT')"
              type="text"
              size="small"
              >拒绝</el-button
            >
            <el-button
              @click="handleAudit(scope.row, 'MANUAL')"
              type="text"
              size="small"
              >人工处理完成</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pageBox">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="refundTotal"
          :page-size="searchForm.page_size"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 拒绝理由弹窗 -->
    <el-dialog :visible.sync="remarkDialogVisible" title="拒绝理由">
      <el-input
        type="textarea"
        v-model="remark"
        placeholder="请输入拒绝理由"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="remarkDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAudit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { apply_list, confirm_apply } from "@/api/paper";

export default {
  data() {
    return {
      searchForm: {
        out_trade_no: "",
        refund_status: "",
        page_num: 1,
        page_size: 10,
      },
      refundTableData: [],
      refundTotal: 0,
      remarkDialogVisible: false,
      currentAuditRow: null,
      currentAuditOpt: "",
      remark: "",
    };
  },
  methods: {
    getRefundList() {
      apply_list(this.searchForm).then((res) => {
        if (res.code === 200) {
          this.refundTableData = res.result.refund_apply_list;
          this.refundTotal = res.result.total;
        }
      });
    },
    handleReset() {
      this.searchForm.out_trade_no = "";
      this.searchForm.refund_status = "";
    },
    handlePageChange(page) {
      this.searchForm.page_num = page;
      this.getRefundList();
    },
    formatRefundStatus(status) {
      const statusMap = {
        PENDING: "待处理",
        PASS: "审核通过",
        REJECT: "已拒绝",
        MANUAL: "人工处理完成",
      };
      return statusMap[status] || status;
    },
    viewImage(url) {
      window.open(url);
    },
    handleAudit(row, opt) {
      this.currentAuditRow = row;
      this.currentAuditOpt = opt;
      if (opt === "REJECT") {
        this.remark = "";
        this.remarkDialogVisible = true;
      } else {
        this.submitAudit();
      }
    },
    submitAudit() {
      const payload = {
        id: this.currentAuditRow.id,
        opt: this.currentAuditOpt,
        remark: this.currentAuditOpt === "REJECT" ? this.remark : undefined,
      };
      confirm_apply(payload).then((res) => {
        if (res.code === 200) {
          this.$message.success(res.message);
          this.remarkDialogVisible = false;
          this.getRefundList();
        }
      });
    },
  },
  mounted() {
    this.getRefundList();
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
