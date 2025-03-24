<template>
  <div class="reChangeBox">
    <!-- 页面名称 -->
    <div class="header">
      <p>
        <span>
          <i class="el-icon-goods"></i>
        </span>
        <span style="margin-right: 5px; font-size: 14px"> {{ balance }} </span>
        积分
      </p>
    </div>
    <div class="reBoxContainer">
      <div
        class="reBox"
        v-for="item in homeData.recharge_list"
        :key="item.index"
        :class="{ selected: selectedIndex === item.index }"
        @click="selectItem(item)"
      >
        <!-- 如果选中的是最后一个选项，展示输入框 -->
        <input
          v-if="selectedIndex === item.index && item.index === 6"
          type="text"
          style="
            height: 100%;
            border: none;
            background-color: transparent;
            text-align: center;
          "
          v-model="formData.recharge_amount"
          @blur="validateInteger"
          placeholder="输入自定义金额"
        />
        <div v-else>
          <p class="giftPoints" v-if="item.gift_points > 0">
            送{{ item.gift_points }}
          </p>
          <p class="fixLeftCenter">{{ item.description }}</p>
          <p
            class="rePrice"
            v-if="selectedIndex === item.index && item.index === 6"
          >
            ¥ {{ item.price.toFixed(2) }}
          </p>
          <div v-if="selectedIndex === item.index" class="selectionCheck">
            <i class="el-icon-check"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="btnCenterCtrl">
      <button :disabled="isSubmitDisabled" class="buyNow" @click="submit">
        立即购买
      </button>
    </div>
    <div class="reminder">
      <p>温馨提示：</p>
      <ol>
        <li>每充值100元赠送10积分，以此类推；1000元赠送200积分，1积分=1元；</li>
        <li>单次充值1元=1000字，智能翻译3元=1000字；</li>
        <li>自定义仅支持重复支付相同金额；</li>
        <li>该产品为虚拟产品，一旦充值不退费。</li>
      </ol>
    </div>
    <payment-dialog @getList="getList" :payStatus="payStatus" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SideMenu from "./components/SideMenu.vue";
import paymentDialog from "./components/paymentDialog.vue";
import { find_user_balance, recharge } from "@/api/wallet";
export default {
  name: "demo",
  data() {
    return {
      payStatus: 0,
      isDialogVisible: true,
      activeIndex: "账号充值", // 默认选中项
      balance: 0,
      selectedIndex: null,
      formData: {
        recharge_index: null,
        recharge_amount: "", // 初始为空字符串
        payment_method: "wechatpay",
      },
      // recharge_list: [
      //   { index: 1, description: "10积分", price: 10, gift_points: 0 },
      //   { index: 2, description: "50积分", price: 50, gift_points: 0 },
      //   { index: 3, description: "100积分", price: 100, gift_points: 10 },
      //   { index: 4, description: "500积分", price: 500, gift_points: 50 },
      //   { index: 5, description: "1000积分", price: 1000, gift_points: 200 },
      //   { index: 6, description: "自定义金额", price: 0, gift_points: 0 },
      // ],
    };
  },
  components: {
    SideMenu,
    paymentDialog,
  },
  mounted() {
    this.getList();
  },
  computed: {
    isSubmitDisabled() {
      return (
        !this.formData.recharge_amount || this.formData.recharge_amount < 1
      );
    },
    ...mapGetters(["homeData"]),
  },
  methods: {
    getList() {
      find_user_balance().then((res) => {
        console.log("resdddddd", res);
        this.balance = res.result.balance;
      });
    },
    handleClose(done) {
      done();
    },
    selectItem(item) {
      this.selectedIndex = item.index;

      if (this.formData.recharge_index == "6" && item.index == 6) {
        return false;
      }
      if (item.index == 6) {
        this.formData.recharge_amount = "";
      } else {
        this.formData.recharge_amount = item.price;
      }
      this.formData.recharge_index = item.index;
    },
    validateInteger() {
      let value = this.formData.recharge_amount;
      if (!/^\d+(\.\d+)?$/.test(value)) {
        this.$message({
          type: "warning",
          message: "请输入有效的数字",
        });
        this.formData.recharge_amount = "";
      } else {
        value = parseFloat(value);
        if (value < 1) {
          this.$message({
            type: "warning",
            message: "请输入大于1的值",
          });
          this.formData.recharge_amount = 1;
        } else if (!Number.isInteger(value)) {
          this.$message({
            type: "warning",
            message: "请输入整数",
          });
          this.formData.recharge_amount = Math.floor(value);
        }
      }
    },
    submit() {
      if (
        this.selectedIndex === 6 &&
        (!this.formData.recharge_amount || this.formData.recharge_amount <= 0)
      ) {
        alert("请输入有效的自定义金额");
        return;
      }
      this.formData.recharge_amount = parseInt(this.formData.recharge_amount);
      // 提交逻辑
      recharge(this.formData).then((res) => {
        this.$log("this.formdata", this.formData, res);
        this.isDialogVisible = true;
        if (res.result.pay_link) {
          let order = {
            ...res.result,
          };
          this.$store.dispatch("user/setWalletsOrder", order);

          this.payStatus = new Date().getTime();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.reChangeBox {
  padding-top: 60px;
  max-width: 650px;
  margin: 0 auto;
  text-align: left;
  font-family: Arial, sans-serif;
  .header {
    margin-bottom: 20px;
    p {
      display: flex;
      width: 90px;
      height: 24px;
      border-radius: 10px;
      background-color: rgba(85, 195, 106, 0.1);
      justify-content: center;
      align-items: center;
      color: #55c36a;
      margin: 0 521px 30px 0;
      font-size: 12px;
      margin: 0;
      span {
        font-weight: bold;
      }
      i {
        margin-right: 8px;
      }
    }
  }
  .reBoxContainer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20px;
    .reBox {
      position: relative;
      width: 167px;
      height: 114px;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: border-color 0.3s;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      &:hover {
        border-color: #4caf50;
      }
      &.selected {
        border: 2px solid #4caf50;
      }
      .giftPoints {
        position: absolute;
        top: -10px;
        left: -10px;
        background-color: #4caf50;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
      }
      .fixLeftCenter {
        font-size: 14px;
        margin: 0;
        line-height: 1.5;
      }
      .rePrice {
        font-size: 16px;
        color: #333;
        margin-top: 5px;
      }
      .selectionCheck {
        position: absolute;
        bottom: 5px;
        right: 5px;
        font-size: 16px;
        color: #4caf50;
      }
      input {
        margin-top: 10px;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 80%;
        font-size: 14px;
        outline: none;
      }
    }
  }

  .reminder {
    margin: 100px 0;
    text-align: left;
    font-size: 14px;
    padding: 20px;
    background-color: #fafafa;
    border-radius: 10px;
    font-size: 12px;
    color: #666;
    display: flex;
    flex-direction: column;
    margin-top: 50px;
    p {
      font-weight: bold;
      font-size: 14px;
      color: #333;
      margin-bottom: 18px;
    }
    ol {
      margin: 0;
      padding-left: 20px;
      li {
        margin-bottom: 5px;
      }
    }
  }
}
.btnCenterCtrl {
  display: flex;
  align-content: center;
  justify-content: center;
}
.buyNow {
  margin-top: 60px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #45a049;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
}
.purchase-points {
  margin-bottom: 12px;
}

.points {
  color: green;
}

.points-box {
  border: 1px solid #eee;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  width: 100%;
  background: #fbfbfb;
}

.points-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.points-info {
  display: flex;
  align-items: center;
}

.wallet-icon {
  color: green;
  margin-right: 8px;
}

.qr-code-container {
  text-align: center;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-code {
  width: 120px;
  height: 120px;
  background: #ccc;
  border-radius: 5px;
  margin-right: 10px;
  img {
    width: 100%;
    height: 100%;
  }
}

.amount {
  color: red;
  font-size: 24px;
  margin: 10px 0;
}
</style>
