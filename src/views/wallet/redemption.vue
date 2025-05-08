<template>
  <div style="width: 100%; background-color: #fff">
    <div class="exchange-component">
      <div class="header">降AIGC率优惠券兑换</div>
      <el-input
        v-model="exchangeCode"
        placeholder="请输入降AIGC率优惠券的兑换码"
        clearable
        prefix-icon="el-icon-goods"
      />
      <el-button
        type="success"
        style="margin-top: 20px; width: 50%"
        @click="exchangeCodeRequest"
      >
        立即兑换
      </el-button>
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
      <div class="warning">
        <p>
          tips: <span class="red">正文折扣卷</span> 在订单支付页使用,如下图:
        </p>

        <div class="tipImgBox">
          <el-image
            style="width: 100%"
            :src="imageUrl"
            :preview-src-list="previewList"
            fit="cover"
          >
          </el-image>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { exchange_coupon } from "@/api/wallet";
export default {
  name: "ExchangeComponent",
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
          message: "优惠卷兑换成功,请前往对应页面查看兑换内容!",
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
