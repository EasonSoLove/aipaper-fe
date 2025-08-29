import request from "@/utils/request";
let baseUrl = process.env.VUE_APP_BASE_API;

export function recharge(data) {
  return request({
    url: baseUrl + "/api/ai-paper/wallet/recharge",
    method: "post",
    data,
  });
}
export function reduce_aigc(data) {
  return request({
    url: baseUrl + "/api/ai-paper/third_aigc/reduce_aigc",
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
// 获取小发猫API版本号
export function third_aigc_version() {
  return request({
    url: baseUrl + "/api/ai-paper/third_aigc/version",
    method: "get",
  });
}
export function remaining_times() {
  return request({
    url: baseUrl + "/api/ai-paper/third_aigc/remaining_times",
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
export function recharge_package(params) {
  return request({
    url: baseUrl + "/api/ai-paper/third_aigc/recharge_package",
    method: "get",
    params,
  });
}
// 兑换码
export function exchange_coupon(params) {
  return request({
    url: baseUrl + "/api/ai-paper/coupon/exchange_coupon",
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

// 获取优惠券背包
export function getCouponBag() {
  return request({
    url: baseUrl + "/api/ai-paper/coupon/bag",
    method: "get",
  });
}
