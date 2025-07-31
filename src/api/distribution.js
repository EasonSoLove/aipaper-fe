import request from "@/utils/request";
let baseUrl = process.env.VUE_APP_BASE_API;

/**
 * 获取分销商基础信息
 * @returns {Promise}
 */
export function getDistributionBaseInfo() {
  return request({
    url: baseUrl + "/api/ai-paper/distribution/base_info",
    method: "get",
  });
}

/**
 * 刷新推广数据
 * @returns {Promise}
 */
export function refreshDistributionAccount() {
  return request({
    url: baseUrl + "/api/ai-paper/distribution/refresh_account",
    method: "get",
  });
}

/**
 * 分页查询邀请记录
 * @param {Object} params - 查询参数
 * @param {number} params.page_num - 页数，默认为1
 * @param {number} params.page_size - 每页记录数，默认为10
 * @returns {Promise}
 */
export function getInvRecords(params) {
  return request({
    url: baseUrl + "/api/ai-paper/distribution/inv_records",
    method: "get",
    params,
  });
}

/**
 * 可提现查询（分页）
 * @param {Object} params - 查询参数
 * @param {number} params.page_num - 页数，默认为1
 * @param {number} params.page_size - 每页记录数，默认为10
 * @returns {Promise}
 */
export function getWithdrawalRecords(params) {
  return request({
    url: baseUrl + "/api/ai-paper/distribution/withdrawal_records",
    method: "get",
    params,
  });
}

/**
 * 待结算查询（分页）
 * @param {Object} params - 查询参数
 * @param {number} params.page_num - 页数，默认为1
 * @param {number} params.page_size - 每页记录数，默认为10
 * @returns {Promise}
 */
export function getWaitingSettleRecords(params) {
  return request({
    url: baseUrl + "/api/ai-paper/distribution/waiting_settle_records",
    method: "get",
    params,
  });
}
