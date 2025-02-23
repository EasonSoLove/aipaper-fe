import request from "@/utils/request";
let baseUrl = process.env.VUE_APP_BASE_API;

export function recharge(data) {
  return request({
    url: baseUrl + "api/ai-paper/wallet/recharge",
    method: "post",
    data,
  });
}
// 获取积分接口
export function find_user_balance() {
  return request({
    url: baseUrl + "/api/ai-paper/wallet/find_user_balance",
    method: "get",
  });
}
// 钱包明细列表
export function find_recharge_details(params) {
  return request({
    url: baseUrl + "/api/ai-paper/wallet/find_recharge_details",
    method: "get",
    params,
  });
}
// 兑换码
export function exchange_coupon(params) {
  return request({
    url: baseUrl + "/api/ai-paper/wallet/exchange_coupon",
    method: "get",
    params,
  });
}
export function find_user_coupons(params) {
  return request({
    url: baseUrl + "/api/ai-paper/wallet/find_user_coupons",
    method: "get",
    params,
  });
}
