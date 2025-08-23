/**
 * 分销系统码值翻译
 */

// 变动类型翻译
export const DISTRIBUTION_CHANGE_TYPE_MAP = {
  USER_CONSUME: "用户订单消费",
  USER_REFUND: "用户订单退款",
  USER_UPGRADE: "用户升级代理费",
  WITHDRAWN: "提现",
  WITHDRAWN_BACK: "提现失败退回",
};

/**
 * 翻译变动类型
 * @param {string} changeType - 变动类型码值
 * @returns {string} 翻译后的中文描述
 */
export function translateChangeType(changeType) {
  return DISTRIBUTION_CHANGE_TYPE_MAP[changeType] || changeType;
}

/**
 * 获取变动类型的颜色样式
 * @param {string} changeType - 变动类型码值
 * @returns {string} CSS类名
 */
export function getChangeTypeClass(changeType) {
  const classMap = {
    USER_CONSUME: "change-type-income",
    USER_REFUND: "change-type-refund",
    USER_UPGRADE: "change-type-upgrade",
    WITHDRAWN: "change-type-withdraw",
    WITHDRAWN_BACK: "change-type-withdraw-back",
  };
  return classMap[changeType] || "change-type-default";
}

/**
 * 翻译提现状态 settle_status
 * 依赖全局码值 distribution_withdrawn_status_code
 * @param {string|number} status
 * @param {Array} globalCode 由 /api/ai-paper/home/global_code 设置到 Vuex 的 app.globalCode
 */
export function translateWithdrawStatus(status, globalCode = []) {
  // 新结构：globalCode 为对象，直接包含 distribution_withdrawn_status_code 数组
  if (
    globalCode &&
    typeof globalCode === "object" &&
    !Array.isArray(globalCode) &&
    Array.isArray(globalCode.distribution_withdrawn_status_code)
  ) {
    const arr = globalCode.distribution_withdrawn_status_code;
    const found = arr.find((i) => String(i.code) === String(status));
    return (
      (found && (found.description || found.desc || found.value)) || status
    );
  }

  // 兼容旧结构：globalCode 为数组，元素包含 code_key 与 code_values
  if (Array.isArray(globalCode)) {
    const group = globalCode.find(
      (g) => g && g.code_key === "distribution_withdrawn_status_code"
    );
    if (group && Array.isArray(group.code_values)) {
      const item = group.code_values.find(
        (i) => String(i.code) === String(status)
      );
      return (item && (item.value || item.desc || item.name)) || status;
    }
  }

  return status;
}
