<template>
  <el-dialog :visible.sync="visible" title="升级为分享商" width="720px">
    <div class="payCodeBox" v-loading="loading">
      <div class="payRightPrice">
        <div class="reduceCard">
          <p>解锁更高分成</p>
          <div class="cardChildList">
            <p>解锁金额 ¥{{ order.pay_amount || 99 }}</p>
            <p>原价 ¥{{ order.original_amount || 199 }}</p>
          </div>
        </div>
        <div class="popupSpan" style="margin-top: 16px">
          支持分销商付费升级，以解锁间推奖励。完成支付后系统将自动为您生效更高分成。
        </div>
      </div>
      <div class="payLeftCode">
        <p class="plTitle">支付信息</p>
        <div class="newLeftBox">
          <div>
            <el-tabs type="border-card">
              <el-tab-pane>
                <span slot="label">
                  <svg class="icon svg-icon" aria-hidden="true">
                    <use xlink:href="#icon-zhifubaozhifu"></use>
                  </svg>
                  支付宝支付
                </span>
                <div class="tabsBox">
                  <iframe
                    v-if="polling"
                    :src="order.pay_link"
                    height="205"
                    width="205"
                    frameborder="0"
                  ></iframe>
                  <p class="codeIntro">
                    支持使用 <b style="color: #00a1e9">“花呗”</b> 支付
                  </p>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="newPriceBox">
            <p>
              <span>原价:</span
              ><span>¥ {{ order.original_amount || 199 }}</span>
            </p>
            <div class="newPriceBottom">
              <span>支付金额:</span><span>¥{{ order.pay_amount || 99 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDistributionUpgrade } from "@/api/distribution";
import { orderDetailById } from "@/api/user";

export default {
  name: "UpgradeDialog",
  props: {
    visible: { type: Boolean, default: false },
  },
  data() {
    return {
      loading: false,
      polling: false,
      order: {
        out_trade_no: "",
        original_amount: 199,
        pay_amount: 99,
        pay_link: "",
      },
      intervalMs: 2000,
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.initUpgrade();
      } else {
        this.polling = false;
      }
    },
  },
  methods: {
    async initUpgrade() {
      this.loading = true;
      try {
        const res = await getDistributionUpgrade();
        if (res && res.code === 200 && res.result) {
          this.order = {
            out_trade_no: res.result.out_trade_no,
            original_amount: res.result.original_amount || 199,
            pay_amount: res.result.pay_amount || 99,
            pay_link: res.result.pay_link,
          };
          this.polling = true;
          this.pollOnce();
        } else {
          this.$message.error((res && res.message) || "获取升级订单失败");
        }
      } catch (e) {
        this.$message.error("获取升级订单失败");
      } finally {
        this.loading = false;
      }
    },
    pollOnce() {
      if (!this.polling || !this.order.out_trade_no) return;
      orderDetailById({ key: this.order.out_trade_no })
        .then((res) => {
          if (!this.polling) return;
          const order = res && res.result && res.result.order;
          if (order && order.payment_status === "TRADE_SUCCESS") {
            this.polling = false;
            this.$message.success("升级成功！");
            this.$emit("success");
            this.$emit("update:visible", false);
          } else {
            setTimeout(() => this.pollOnce(), this.intervalMs);
          }
        })
        .catch(() => {
          if (!this.polling) return;
          setTimeout(() => this.pollOnce(), this.intervalMs);
        });
    },
  },
};
</script>

<style scoped lang="scss">
/* 复用父组件已有的支付样式命名，避免重复编写 */
.payCodeBox {
  display: flex;
  align-items: flex-start;
}
.payLeftCode {
  width: 307px;
  padding: 20px 30px;
  margin-top: -20px;
  background: #f4f5f7;
  position: relative;
  .codeIntro {
    text-align: center;
    width: 100%;
    margin-top: 5px;
  }
  .plTitle {
    font-family: PingFangSC-SNaNpxibold;
    font-weight: 600;
    font-size: 18px;
    color: #000000;
  }
}
.newLeftBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}
.tabsBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.newPriceBox {
  width: 240px;
  background: #ffffff;
  border-radius: 8px;
  padding: 0 8px;
  p {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: 14px;
    color: #959da6;
    line-height: 18px;
    margin-top: 10px;
    & > span:first-child {
      display: inline-block;
      width: 90px;
      text-align: left;
    }
  }
  .newPriceBottom {
    height: 44px;
    line-height: 44px;
    font-weight: 600;
    font-size: 14px;
    color: #000000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > span:last-child {
      color: #f53f3f;
      font-size: 16px;
    }
  }
}
</style>
