import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/vue-admin-template/user/login",
    method: "post",
    data,
  });
}
export function getHomeInfo(params) {
  return request({
    url: "/dev-api/api/ai-paper/home/info",
    method: "get",
    params,
  });
}
export function gpt_search(params) {
  return request({
    url: "/dev-api/api/ai-paper/paper/gpt_search?",
    method: "get",
    params,
  });
}
export function getUserInfo() {
  return request({
    url: "/dev-api/api/ai-paper/user/info",
    method: "get",
  });
}
// export function getUserInfo(data) {
//   return request({
//     url: '/dev-api/api/ai-paper/orders/order',
//     method: 'post',
//     data
//   })
// }
export function getOrder(data) {
  return request({
    url: "/dev-api/api/ai-paper/orders/order",
    method: "post",
    data,
  });
}
export function chatApi(data) {
  return request({
    url: "/chat-api/chat",
    method: "post",
    data,
  });
}
export function editLine(data) {
  return request({
    url: "/dev-api/api/ai-paper/paper/outline/edit",
    method: "post",
    data,
  });
}
export function userProxy(data) {
  return request({
    url: "/dev-api/api/ai-paper/user/proxy",
    method: "post",
    data,
  });
}
export function userEdit(data) {
  return request({
    url: "/dev-api/api/ai-paper/user/edit",
    method: "post",
    data,
  });
}
export function ordersRepay(data) {
  return request({
    url: "/dev-api/api/ai-paper/orders/repay",
    method: "post",
    data,
  });
}
export function balance_pay(data) {
  return request({
    url: "/dev-api/api/ai-paper/orders/balance_pay",
    method: "post",
    data,
  });
}
export function outlineCreate(data) {
  return request({
    url: "/dev-api/api/ai-paper/paper/outline/create",
    method: "post",
    data,
  });
}

export function getInfo(params) {
  return request({
    url: "/dev-api/api/ai-paper/user/info",
    method: "get",
    params,
  });
}
export function rePaper(params) {
  return request({
    url: "/dev-api/api/ai-paper/admin/re_paper",
    method: "get",
    params,
  });
}
export function agentInfo() {
  return request({
    url: "/dev-api/api/ai-paper/agent/info",
    method: "get",
  });
}
export function agentCount(data) {
  return request({
    url: "/dev-api/api/ai-paper/agent/count",
    method: "post",
    data,
  });
}
export function editReduce(data) {
  return request({
    url: "/dev-api/api/ai-paper/paper/edit/reduce",
    method: "post",
    data,
  });
}
export function outlineStatus(params) {
  return request({
    url: "/dev-api/api/ai-paper/paper/outline/status/" + params.key,
    method: "get",
  });
}
export function paperPack(params) {
  return request({
    url: "/dev-api/api/ai-paper/paper/pack/" + params.out_trade_no,
    method: "get",
  });
}
export function getOrderList(params) {
  return request({
    url: "/dev-api/api/ai-paper/orders/order/list",
    method: "get",
    params,
  });
}
// export function delOrder(params) {
//   return request({
//     url: "/dev-api/api/ai-paper/orders/order/" + params.join(","),
//     method: "delete",
//   });
// }
export function delOrder(data) {
  return request({
    url: "/dev-api/api/ai-paper/orders/batch_delete",
    method: "post",
    data,
  });
}
// 查询单个订单状态
export function orderDetailById(params) {
  return request({
    url: "/dev-api/api/ai-paper/orders/order/" + params.key,
    method: "get",
  });
}

export function logout() {
  return request({
    url: "/vue-admin-template/user/logout",
    method: "post",
  });
}

export function getOutlineList(params) {
  return request({
    url: "/dev-api/api/ai-paper/paper/outline/list",
    method: "get",
    params,
  });
}
