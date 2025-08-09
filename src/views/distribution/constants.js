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
