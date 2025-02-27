// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from "@/utils";

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label;
  }
  return time + label + "s";
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time);
  if (between < 3600) {
    return pluralize(~~(between / 60), " minute");
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), " hour");
  } else {
    return pluralize(~~(between / 86400), " day");
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1e18, symbol: "E" },
    { value: 1e15, symbol: "P" },
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "G" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" },
  ];
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (
        (num / si[i].value)
          .toFixed(digits)
          .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].symbol
      );
    }
  }
  return num.toString();
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0)
    .toString()
    .replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// src/filters/dateFormatter.js

export function dateFormatter(dateString) {
  // 解析 ISO8601 格式的日期字符串
  const date = new Date(dateString);

  // 获取年份、月份、日期、小时、分钟和秒
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // 返回格式化的日期字符串
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
export function translatePaymentMethod(key, methodList) {
  // 解析 ISO8601 格式的日期字符串
  if (!key || !Array.isArray(methodList)) {
    return "未知";
  }
  const method = methodList.find((item) => item.key === key);
  return method ? method.value : "未知";
}

export function orderStatusFormatter(status) {
  // 解析 ISO8601 格式的日期字符串
  // 状态含义映射
  // var StageDescriptions = map[int]string{
  // 	Waiting:    "等待中",
  // 	Generating: "生成中",
  // 	Success:    "生成成功",
  // 	Failed:     "生成失败",
  // }
  // Waiting = 0
  // Generating = 1
  // Success = 2
  // Failed =3
  if (status == 0) {
    return "排队中";
  }
  if (status == 1) {
    return "生成中";
  }
  if (status == 2) {
    return "生成成功";
  }
  if (status == 3) {
    return "生成失败";
  }
}
