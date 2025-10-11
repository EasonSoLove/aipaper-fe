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
export function third_aigc_task(params) {
  return request({
    url: baseUrl + "/api/ai-paper/third_aigc/task",
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
export function reduce_pack(params) {
  return request({
    url:
      baseUrl +
      "/api/ai-paper/paper/reduce_pack?out_trade_no=" +
      params.out_trade_no,
    method: "get",
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
export function apply_list(params) {
  return request({
    url: baseUrl + "/api/ai-paper/refund/apply_list",
    method: "get",
    params: params,
  });
}
export function paper_status(data) {
  return request({
    url: baseUrl + "/api/ai-paper/paper/paper_status",
    method: "post",
    data,
  });
}
export function confirm_apply(data) {
  return request({
    url: baseUrl + "/api/ai-paper/refund/confirm_apply",
    method: "post",
    data,
  });
}
export function task_complete(data) {
  return request({
    url: baseUrl + "/api/ai-paper/third_aigc/task_complete",
    method: "post",
    data,
  });
}
export function once_aigc_order(data) {
  return request({
    url: baseUrl + "/api/ai-paper/third_aigc/once_aigc_order",
    method: "post",
    data,
  });
}
export function free_pay(data) {
  return request({
    url: baseUrl + "/api/ai-paper/orders/free_pay",
    method: "post",
    data,
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
export function create_outline(data) {
  return request({
    url: baseUrl + "/api/ai-paper/step_outline/create_outline",
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
export function save_extra_requirements(data) {
  return request({
    url: baseUrl + "/api/ai-paper/step_outline/save_extra_requirements",
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

// 获取降AIGC产品信息
export function getAigcProducts() {
  return request({
    url: baseUrl + "/api/ai-paper/aigc/product",
    method: "get",
  });
}

// 获取预估价格
export function predictPrice(data) {
  return request({
    url: baseUrl + "/api/ai-paper/aigc/predict_price",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// 降重处理接口
export function reduceText(data) {
  return request({
    url: baseUrl + "/api/ai-paper/aigc/reduce",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// 查询降重结果
export function getReduceResult(params) {
  return request({
    url: baseUrl + "/api/ai-paper/aigc/result",
    method: "get",
    params,
  });
}

// 获取降重记录
export function getReduceRecords(params) {
  return request({
    url: baseUrl + "/api/ai-paper/aigc/records",
    method: "get",
    params,
  });
}
