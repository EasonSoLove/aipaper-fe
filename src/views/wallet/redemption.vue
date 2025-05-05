<template>
  <div class="exchange-component">
    <div class="header"></div>
    <input
      v-model="exchangeCode"
      placeholder="请输入充值卡的兑换码"
      @focus="isInputFocused = true"
      @blur="isInputFocused = false"
      :class="{ focused: isInputFocused }"
    />
    <button @click="exchangeCodeRequest">立即兑换</button>
    <div class="warning">
      <h3>温馨提示：</h3>
      <p>有兑换码的用户可以在此兑换，兑换码目前支持兑换为降AIGC的可用次数。</p>
      <p>
        兑换流程：输入兑换码 → 点击“立即兑换” →
        兑换成功，前往降AIGC页面右上角查看可用次数。
      </p>
      <p>兑换码一经兑换，概不退换，请确认无误后再操作。</p>
    </div>
  </div>
</template>

<script>
import { exchange_coupon } from "@/api/wallet";
export default {
  name: "ExchangeComponent",
  data() {
    return {
      exchangeCode: "",
      isInputFocused: false,
    };
  },
  methods: {
    exchangeCodeRequest() {
      // 模拟请求接口
      // 这里可以使用 axios 或者 fetch 来请求接口
      if (!this.exchangeCode) {
        this.$message({
          type: "warning",
          message: "请输入兑换码",
        });

        return false;
      }
      let data = {
        coupon_code: this.exchangeCode,
      };
      exchange_coupon(data).then((res) => {
        console.log("res", res);
        this.$message({
          type: "success",
          message: "优惠卷兑换成功!",
        });
        this.exchangeCode = "";
      });
    },
  },
};
</script>

<style scoped>
.exchange-component {
  max-width: 600px;
  margin: 0 auto;
  padding-bottom: 100px;
  text-align: center;
}

.header {
  height: 80px;
  background-color: #f5f5f5; /* 顶部背景颜色 */
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

input.focused {
  border-color: #4caf50; /* 选中时的边框颜色 */
}

button {
  width: 50%;
  padding: 10px;
  background-color: #4caf50; /* 按钮背景色 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px; /* 字体大小 */
}

button:hover {
  background-color: #45a049; /* 按钮悬停时的颜色 */
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
</style>
