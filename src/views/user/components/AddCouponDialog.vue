<template>
  <el-dialog
    title="新增优惠券"
    :visible.sync="visible"
    width="40%"
    @close="handleClose"
  >
    <el-form
      label-width="120px"
      :model="couponForm"
      ref="couponForm"
      :rules="rules"
    >
      <el-form-item label="优惠卷类型">
        <el-select
          @change="changeType"
          v-model="couponForm.coupon_type"
          clearable
          placeholder="请选择状态"
        >
          <el-option
            v-for="(item, index) in coupon_type_list"
            :key="index + 'coupon_type'"
            :label="item.coupon_description"
            :value="item.coupon_type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优惠券规则" prop="rule_id">
        <el-select
          v-model="couponForm.rule_id"
          clearable
          placeholder="请选择优惠券规则"
        >
          <el-option
            v-for="(item, index) in coupon_rule_list"
            :key="index + 'rule_id'"
            :label="item.rule_id_description"
            :value="item.rule_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="优惠折扣"
        v-if="couponForm.coupon_type == 1"
        prop="discount_rate"
      >
        <el-select
          v-model="couponForm.discount_rate"
          placeholder="请选择优惠折扣"
        >
          <el-option
            v-for="rate in discountRates"
            :key="rate.value"
            :label="rate.label"
            :value="rate.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="过期时间"
        v-if="couponForm.coupon_type != 3"
        prop="expire_time"
      >
        <el-date-picker
          v-model="couponForm.expire_time"
          type="datetime"
          placeholder="请选择过期时间"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="datePickerOptions"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="优惠券数量" prop="create_counts">
        <el-input-number
          v-model="couponForm.create_counts"
          :min="1"
          :max="100"
        ></el-input-number>
      </el-form-item>

      <el-form-item
        label="降AIGC次数"
        v-if="couponForm.coupon_type == 3"
        prop="rights_num"
      >
        <el-input-number
          v-model="couponForm.rights_num"
          :min="1"
          :max="1000"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="渠道" prop="channel">
        <el-select v-model="couponForm.channel" placeholder="请选择渠道">
          <el-option
            v-for="channel in channels"
            :key="channel.channel"
            :label="channel.display_name"
            :value="channel.channel"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="codeList.length > 1" label="生成的优惠卷">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="codeList"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { channels, batch_create } from "@/api/user";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      couponForm: {
        discount_rate: 0.1, // 默认值
        expire_time: "",
        create_counts: 1,
        channel: "",
        coupon_type: 1,
        rights_num: "",
        rule_id: "",
      },
      discountRates: [
        { label: "免费", value: 0 },
        { label: "一折", value: 0.1 },
        { label: "二折", value: 0.2 },
        { label: "三折", value: 0.3 },
        { label: "四折", value: 0.4 },
        { label: "五折", value: 0.5 },
        { label: "六折", value: 0.6 },
        { label: "七折", value: 0.7 },
        { label: "八折", value: 0.8 },
        { label: "九折", value: 0.9 },
      ],
      channels: [],
      coupon_type_list: [],
      coupon_rule_list: [],
      rules: {
        discount_rate: [
          { required: true, message: "请选择优惠折扣", trigger: "change" },
        ],
        expire_time: [
          { required: true, message: "请选择过期时间", trigger: "change" },
        ],
        create_counts: [
          { required: true, message: "请输入优惠券数量", trigger: "blur" },
        ],
        channel: [{ required: true, message: "请选择渠道", trigger: "change" }],
        rule_id: [
          { required: true, message: "请选择优惠券规则", trigger: "change" },
        ],
      },
      datePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      codeList: "",
    };
  },
  created() {
    this.getList();
  },
  methods: {
    changeType() {
      if (this.couponForm.coupon_type == 3) {
        this.couponForm.expire_time = "2099-12-31 23:59:59";
      } else {
        this.couponForm.expire_time = "";
      }
      if (this.couponForm.coupon_type == 1) {
        this.couponForm.discount_rate = 0.9;
      }

      this.codeList = "";
    },
    getList() {
      channels().then((res) => {
        Ming("res", res);
        this.channels = res.result.coupon_channels;
        this.coupon_type_list = res.result.coupon_type_list;
        this.coupon_rule_list = res.result.coupon_rule_id_list;
      });
    },
    handleClose() {
      this.$emit("update:visible", false); // 关闭弹窗
      this.resetForm();
    },
    submitForm() {
      this.$refs.couponForm.validate((valid) => {
        if (valid) {
          batch_create(this.couponForm).then((res) => {
            this.$message.success("优惠券添加成功");
            Ming("优惠券添加成功", res.result);
            this.codeList = res.result;
            this.$emit("add-coupon");
          });
        } else {
          this.$message.error("请填写完整的优惠券信息");
        }
      });
    },
    resetForm() {
      this.couponForm = {
        discount_rate: 0.1,
        expire_time: "",
        create_counts: 1,
        channel: "",
        coupon_type: 1,
        rights_num: "",
        rule_id: "",
      };
    },
  },
};
</script>
