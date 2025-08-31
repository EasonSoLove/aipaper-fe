<template>
  <div>
    <el-divider>优惠卷</el-divider>
    <el-tabs type="border-card">
      <el-tab-pane label="未使用">
        <div v-if="unused_coupons.length > 0" class="flexBox">
          <div
            class="coupon"
            v-for="item in unused_coupons"
            :key="item.coupon_code"
          >
            <div class="content">
              <div class="title">{{ getCouponTitle(item.type) }}</div>
              <div class="validity">
                过期时间: {{ item.expire_time | dateFormatter }}
              </div>
              <div class="restriction">{{ item.limit_tips }}</div>
            </div>
            <div class="right">
              <div class="discount">{{ getCouponDisplay(item) }}</div>
              <button class="use-button" @click="useCoupon(item)">
                去使用
              </button>
            </div>
          </div>
        </div>
        <div v-else>
          <el-empty description="暂无数据"></el-empty>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已使用">
        <div v-if="used_coupons.length > 0" class="flexBox">
          <div
            class="coupon couponUse"
            v-for="item in used_coupons"
            :key="item.coupon_code"
          >
            <div class="content">
              <div class="title">{{ getCouponTitle(item.type) }}</div>
              <div class="validity">
                过期时间: {{ item.expire_time | dateFormatter }}
              </div>
              <div class="restriction">{{ item.limit_tips }}</div>
            </div>
            <div class="right">
              <div class="discount">{{ getCouponDisplay(item) }}</div>
            </div>
          </div>
        </div>
        <div v-else>
          <el-empty description="暂无数据"></el-empty>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已失效">
        <div v-if="expired_coupons.length > 0" class="flexBox">
          <div
            class="coupon couponDated"
            v-for="item in expired_coupons"
            :key="item.coupon_code"
          >
            <div class="content">
              <div class="title">{{ getCouponTitle(item.type) }}</div>
              <div class="validity">
                过期时间: {{ item.expire_time | dateFormatter }}
              </div>
              <div class="restriction">{{ item.limit_tips }}</div>
            </div>
            <div class="right">
              <div class="discount">{{ getCouponDisplay(item) }}</div>
            </div>
          </div>
        </div>
        <div v-else>
          <el-empty description="暂无数据"></el-empty>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getCouponBag } from "@/api/wallet";
export default {
  name: "vouchers",
  data() {
    return {
      isInputFocused: false,
      expired_coupons: [], // 已失效的优惠券
      unused_coupons: [], // 未使用的优惠券
      used_coupons: [], // 已使用的优惠券
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    useCoupon(item) {
      console.log("item", item);
      this.$router.push({
        path: "/main/writepaper",
      });
    },
    getList() {
      getCouponBag()
        .then((res) => {
          console.log("res", res);
          if (res && res.code === 200 && res.result) {
            this.used_coupons = res.result.used_coupon_list || [];
            this.unused_coupons = res.result.available_coupon_list || [];
            this.expired_coupons = res.result.expired_coupon_list || [];
          }
        })
        .catch((error) => {
          console.error("获取优惠券列表失败:", error);
          this.$message.error("获取优惠券列表失败");
        });
    },
    // 获取优惠券标题
    getCouponTitle(type) {
      const titleMap = {
        1: "学位论文抵扣券",
        3: "降AIGC次数券",
      };
      return titleMap[type] || "优惠券";
    },

    // 获取优惠券显示内容
    getCouponDisplay(item) {
      if (item.type === 1) {
        // 折扣券
        if (item.discount_rate === 0) {
          return "免费";
        } else {
          return `${(item.discount_rate * 10).toFixed(0)}折`;
        }
      } else if (item.type === 3) {
        // 降AIGC次数券
        return `${item.rights_num}次`;
      }
      return "优惠券";
    },

    exchangeCodeRequest() {
      // 模拟请求接口
      // 这里可以使用 axios 或者 fetch 来请求接口
    },
  },
};
</script>

<style lang="scss" scoped>
body {
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.coupon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin-right: 20px;
  background: url("../../assets/images/wallets/write_blue.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  width: 300px;
  height: 150px;
  border-radius: 10px;
  padding: 15px;
  position: relative;
}
.couponUse {
  width: 300px;

  background: url("../../assets/images/wallets/used.png") no-repeat center
    center / 100% 100%;
}

.couponDated {
  background: url("../../assets/images/wallets/dated.png") no-repeat center
    center / 100% 100%;
}
.content {
  color: #fff;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: left;
}

.validity {
  font-size: 14px;
  margin-bottom: 10px;
  text-align: left;
}

.restriction {
  font-size: 12px;
  text-align: left;
  padding-right: 60px;
  margin-top: 25px;
}

.right {
  display: flex;
  width: 60px;
  right: 10px;
  top: 15px;
  padding-bottom: 20px;
  font-size: 14px;
  height: 90%;
  position: absolute;
  flex-direction: column;
  justify-content: space-between;
  color: #fff;
}

.discount {
  background: rgba(0, 0, 0, 0.2);
  padding: 5px 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  text-align: center;
  font-weight: bold;
}

.use-button {
  background: transparent;
  border: 1px solid #fff;
  color: #fff;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  position: relative;
  top: 10px;
}

.use-button:hover {
  background: #00aaff;
  color: #fff;
}
.flexBox {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-right: -20px;
  .coupon:nth-child(3n) {
    // margin-right: 0;
  }
}
</style>
