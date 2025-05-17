<template>
  <div>
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
          <el-form-item label="退款状态">
            <el-select
              v-model="searchForm.refund_status"
              placeholder="请选择退款状态"
            >
              <el-option
                v-for="status in globalCode.refund_status_code"
                :key="status.code"
                :label="status.description"
                :value="status.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getRefundList">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </template>

      <!-- 表格 -->
      <el-table :data="refundTableData" border style="width: 100%">
        <el-table-column
          prop="out_trade_no"
          label="退款订单号"
          align="center"
        ></el-table-column>
        <el-table-column prop="refund_status" label="退款状态" align="center">
          <template slot-scope="scope">
            {{ formatRefundStatus(scope.row.refund_status) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="refund_amount"
          label="申请退款金额"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="refund_reason"
          label="退款原因"
          align="center"
        ></el-table-column>
        <el-table-column label="补充说明" align="center" width="120">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.refund_photo"
              :preview-src-list="[scope.row.refund_photo]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="支付宝二维码" width="120">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.manual_refund_qrcode"
              :preview-src-list="[scope.row.manual_refund_qrcode]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" align="center" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.created_at | dateFormatter }}
          </template>
        </el-table-column>
        <el-table-column prop="updated_at" align="center" label="更新时间">
          <template slot-scope="scope">
            {{ scope.row.updated_at | dateFormatter }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="300">
          <template
            slot-scope="scope"
            v-if="
              scope.row.refund_status == 'PENDING' ||
              scope.row.refund_status == 'AUTO_REFUND_FAILED' ||
              scope.row.refund_status == 'MANUAL_REFUND_SUCCESS'
            "
          >
            <el-button
              @click="handleAudit(scope.row, 'PASS')"
              type="primary"
              plain
              size="mini"
              >审核通过</el-button
            >
            <el-button
              @click="handleAudit(scope.row, 'REJECT')"
              type="primary"
              plain
              size="mini"
              >拒绝</el-button
            >
            <el-button
              @click="handleAudit(scope.row, 'MANUAL')"
              type="primary"
              plain
              size="mini"
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
import { mapGetters } from "vuex";

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
  computed: {
    ...mapGetters(["globalCode"]),
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
      const statusMap = this.globalCode.refund_status_code;
      let name = "";
      statusMap.forEach((item) => {
        if (item.code == status) {
          name = item.description;
        }
      });
      return name || "未知状态";
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
