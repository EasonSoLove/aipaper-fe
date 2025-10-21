<template>
  <div style="width: 100%; background-color: #fff">
    <div class="exchange-component">
      <div class="header">优惠券兑换</div>
      <div
        style="
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
        "
      >
        <el-input
          v-model="exchangeCode"
          style="width: 470px"
          placeholder="请输入优惠券的兑换码"
          clearable
          prefix-icon="el-icon-goods"
          @blur="handleInputBlur"
        />
        <el-button
          type="success"
          style="margin-top: 20px; width: 50%"
          @click="exchangeCodeRequest"
        >
          立即兑换
        </el-button>
      </div>

      <!-- 优惠卷页面 -->
      <div class="vouchers-container">
        <vouchers ref="vouchersComponent" />
      </div>
      <div class="warning">
        <h3>温馨提示：</h3>
        <p>
          有兑换码的用户可以在此兑换，<span class="red"
            >兑换码目前支持兑换为降AIGC的可用次数。</span
          >
        </p>
        <p>
          兑换流程：
          <span class="red">
            输入兑换码 → 点击“立即兑换” → 兑换成功，前往
            <el-link type="primary" @click="$jumpUrl('/main/reduceRepetition')"
              >降AIGC页面</el-link
            >
            右上角查看可用次数。
          </span>
        </p>
        <p>兑换码一经兑换，概不退换，请确认无误后再操作。</p>
      </div>
    </div>
  </div>
</template>

<script>
import { exchange_coupon } from "@/api/wallet";
import vouchers from "./vouchers.vue";

export default {
  name: "ExchangeComponent",
  components: {
    vouchers,
  },
  data() {
    return {
      imageUrl: require("@/assets/images/bg/tipsPay.png"),
      previewList: [require("@/assets/images/bg/tipsPay.png")],
      exchangeCode: "",
      isInputFocused: false,
    };
  },
  methods: {
    exchangeCodeRequest() {
      // 模拟请求接口
      // 这里可以使用 axios 或者 fetch 来请求接口
      const trimmedCode = this.exchangeCode.trim();
      if (!trimmedCode) {
        this.$message({
          type: "warning",
          message: "请输入兑换码",
        });

        return false;
      }
      let data = {
        coupon_code: trimmedCode,
      };
      exchange_coupon(data)
        .then((res) => {
          console.log("res", res);
          if (res && res.code === 200) {
            this.$message({
              type: "success",
              message: "优惠卷兑换成功,请前往对应页面查看兑换内容!",
            });
            this.exchangeCode = "";

            // 兑换成功后刷新优惠券列表
            if (this.$refs.vouchersComponent) {
              this.$refs.vouchersComponent.getList();
            }
          } else {
            this.$message({
              type: "error",
              message: (res && res.message) || "兑换失败，请重试",
            });
          }
        })
        .catch((error) => {
          console.error("兑换失败:", error);
          this.$message({
            type: "error",
            message: "兑换失败，请重试",
          });
        });
    },

    // 输入框失去焦点时自动去除首尾空格
    handleInputBlur() {
      if (this.exchangeCode) {
        this.exchangeCode = this.exchangeCode.trim();
      }
    },
  },
};
</script>

<style scoped>
.exchange-component {
  max-width: 1000px;
  margin: 0 auto;
  padding-bottom: 100px;
  text-align: center;
}

.vouchers-container {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.header {
  height: 80px;
  padding-top: 60px;
  font-size: 20px;
  line-height: 20px;
  margin-bottom: 20px;
}

input {
  width: 80%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
  font-size: 16px; /* 字体大小 */
  color: #666; /* 字体颜色 */
}

.warning {
  margin-top: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: left;
}

h3 {
  margin: 0 0 10px 0;
  color: #ff5722; /* 温馨提示标题颜色 */
  font-size: 18px; /* 字体大小 */
}

p {
  margin: 0 0 10px 0;
  line-height: 1.5;
  color: #333;
  font-size: 14px; /* 字体大小 */
}
.tipImgBox {
  width: 100%;
}
.tipImgBox img {
  width: 100%;
}
</style>
