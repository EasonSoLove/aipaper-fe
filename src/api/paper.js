import request from "@/utils/request";
let baseUrl = process.env.VUE_APP_BASE_API;

export function login(data) {
  return request({
    url: "/vue-admin-template/user/login",
    method: "post",
    data,
  });
}
export function product() {
  return request({
    url: baseUrl + "/api/ai-paper/pass/product",
    method: "get",
  });
}
// 我的推广获取用户列表
export function user_info(params) {
  return request({
    url: baseUrl + "/api/ai-paper/agent/user_info",
    method: "get",
    params,
  });
}
export function references(params) {
  return request({
    url: baseUrl + "/api/ai-paper/paper/references",
    method: "get",
    params,
  });
}
// 我的推广获取订单列表
export function order_info(params) {
  return request({
    url: baseUrl + "/api/ai-paper/agent/order_info",
    method: "get",
    params,
  });
}
export function inviteFetch() {
  return request({
    url: baseUrl + "/api/ai-paper/user/invite/fetch",
    method: "get",
  });
}
export function passOrder(params) {
  return request({
    url: baseUrl + "/api/ai-paper/pass/order/" + params.fileBackKey,
    method: "get",
  });
}
export function down_url(params) {
  return request({
    url: baseUrl + "/api/ai-paper/paper/outline/down_url/" + params.key1,
    method: "get",
  });
}
export function report_url(params) {
  return request({
    url: baseUrl + "/api/ai-paper/pass/report_url/" + params.fileBackKey,
    method: "get",
  });
}
export function pay_discount(params) {
  return request({
    url: baseUrl + "/api/ai-paper/pass/pay_discount/" + params.out_trade_no,
    method: "get",
  });
}
export function passReport(params) {
  return request({
    url: baseUrl + "/api/ai-paper/pass/report/" + params.out_trade_no,
    method: "get",
  });
}
// 百度推广接口
export function bd_convert(params) {
  return request({
    url: baseUrl + "/api/ai-paper/orders/bd_convert",
    method: "get",
    params: params,
  });
}
export function predict_price(params) {
  return request({
    url: baseUrl + "/api/ai-paper/paper/predict_price",
    method: "get",
    params: params,
  });
}
export function pre_create(data) {
  return request({
    url: baseUrl + "/api/ai-paper/pass/pre_create",
    method: "post",
    data,
  });
}
export function title_recommend(data) {
  return request({
    url: baseUrl + "/api/ai-paper/paper/title_recommend",
    method: "post",
    data,
  });
}
export function remove_reduce_file(data) {
  return request({
    url: baseUrl + "/api/ai-paper/paper/edit/remove_reduce_file",
    method: "post",
    data,
  });
}
export function save_papers_list(data) {
  return request({
    url: baseUrl + "/api/ai-paper/step_outline/save_papers_list",
    method: "post",
    data,
  });
}
export function upload_papers(data) {
  return request({
    url: baseUrl + "/api/ai-paper/step_outline/upload_papers",
    method: "post",
    data,
  });
}

export function re_reduce(data) {
  return request({
    url: baseUrl + "/api/ai-paper/paper/edit/re_reduce",
    method: "post",
    data,
  });
}
export function pay_order(data) {
  return request({
    url: baseUrl + "/api/ai-paper/pass/pay_order",
    method: "post",
    data,
  });
}
export function upload_reduce_file(data) {
  return request({
    url: baseUrl + "/api/ai-paper/paper/edit/upload_reduce_file",
    method: "post",
    data,
  });
}
export function generate_keywords(data) {
  return request({
    url: baseUrl + "/api/ai-paper/step_outline/generate_keywords",
    method: "post",
    data,
  });
}
export function save_keywords(data) {
  return request({
    url: baseUrl + "/api/ai-paper/step_outline/save_keywords",
    method: "post",
    data,
  });
}
export function search_papers(data) {
  return request({
    url: baseUrl + "/api/ai-paper/step_outline/search_papers",
    method: "post",
    data,
  });
}
// 下载大纲接口
export function pay_download(data) {
  return request({
    url: baseUrl + "/api/ai-paper/paper/outline/pay_download",
    method: "post",
    data,
  });
}
export function reduce_aigc_pay(data) {
  return request({
    url: baseUrl + "/api/ai-paper/orders/reduce_aigc_pay",
    method: "post",
    data,
  });
}
