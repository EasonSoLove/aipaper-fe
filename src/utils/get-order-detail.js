import { outlineStatus } from "@/api/user";

/**
 * 实现轮询功能
 * @param {Object} data 请求数据
 * @param {Number} delay 轮询间隔时间，默认为2000毫秒（注意：如果传入180000，会被当作轮询间隔，建议传入2000）
 * @param {Number} maxRetries 最大重试次数，默认为5次
 * @param {Number} currentRetry 当前重试次数，默认为0
 */
export default function polling(
  data,
  delay = 2000,
  maxRetries = 5,
  currentRetry = 0,
  startTime = null // 记录轮询开始时间
) {
  // 如果传入的 delay 大于 60000（1分钟），可能是误传了超时时间，使用默认的轮询间隔
  const pollingInterval = delay > 60000 ? 2000 : delay;
  // 超时时间固定为3分钟（180000毫秒）
  const timeoutDuration = 180000;
  
  // 记录第一次轮询的开始时间
  if (startTime === null) {
    startTime = Date.now();
  }
  
  return new Promise((resolve, reject) => {
    outlineStatus(data)
      .then((res) => {
        try {
          // 检查返回数据是否有效
          if (!res || !res.result) {
            reject(new Error("接口返回数据格式错误"));
            return;
          }

          let givenTimeString = res.result.aitype_time;
          const status = res.result.status;
          
          // 检查 aitype_time 是否存在
          if (!givenTimeString) {
            // 如果没有 aitype_time，根据状态决定是否继续轮询
            if (status === "AI帮写中") {
              // 检查是否从轮询开始已经超过3分钟
              const elapsedTime = Date.now() - startTime;
              if (elapsedTime < timeoutDuration) {
                setTimeout(() => {
                  resolve(polling(data, delay, maxRetries, currentRetry, startTime));
                }, pollingInterval);
              } else {
                reject(new Error("已超时"));
              }
              return;
            } else if (status == "生成失败") {
              resolve(status);
              return;
            } else {
              // 如果状态已完成但 outline 为空，继续轮询等待
              if (res.result.outline && res.result.outline.outline) {
                resolve(res.result.outline.outline);
              } else {
                const elapsedTime = Date.now() - startTime;
                if (elapsedTime < timeoutDuration) {
                  setTimeout(() => {
                    resolve(polling(data, delay, maxRetries, currentRetry, startTime));
                  }, pollingInterval);
                } else {
                  reject(new Error("已超时"));
                }
              }
              return;
            }
          }

          // 将给定的时间字符串转换为时间戳
          // 处理时间格式：将 "2026-02-14 12:36:16" 转换为 "2026/02/14 12:36:16"
          const timeStringForParse = givenTimeString.replace(/-/g, "/");
          const givenTimestamp = Date.parse(timeStringForParse);
          
          // 检查时间戳是否有效
          if (isNaN(givenTimestamp)) {
            // 如果时间解析失败，但状态是"AI帮写中"，继续轮询
            if (status === "AI帮写中") {
              const elapsedTime = Date.now() - startTime;
              if (elapsedTime < timeoutDuration) {
                setTimeout(() => {
                  resolve(polling(data, delay, maxRetries, currentRetry, startTime));
                }, pollingInterval);
              } else {
                reject(new Error("已超时"));
              }
              return;
            } else {
              reject(new Error("时间格式错误"));
              return;
            }
          }

          // 获取当前时间的时间戳
          const currentTimestamp = Date.now();
          
          // 计算从轮询开始到现在经过的时间
          const elapsedTime = currentTimestamp - startTime;
          
          // 判断循环开始时间，如果任务没开始 继续循环
          if (currentTimestamp < givenTimestamp) {
            setTimeout(() => {
              resolve(polling(data, delay, maxRetries, currentRetry, startTime));
            }, pollingInterval);
            return;
          }

          // 任务已开始，根据状态处理
          if (status === "AI帮写中") {
            // 检查是否从轮询开始已经超过3分钟
            if (elapsedTime < timeoutDuration) {
              // 如果状态是"AI帮写中"且未超时，检查 outline 是否存在
              if (res.result.outline && res.result.outline.outline) {
                // outline 有值，返回结果
                resolve(res.result.outline.outline);
              } else {
                // outline 为 null，继续轮询等待
                setTimeout(() => {
                  resolve(polling(data, delay, maxRetries, currentRetry, startTime));
                }, pollingInterval);
              }
            } else {
              // 已超时（从轮询开始已经超过3分钟）
              reject(new Error("已超时"));
            }
          } else if (status == "生成失败") {
            resolve(status);
          } else {
            // 如果不是"AI帮写中"状态，检查 outline 是否存在
            if (res.result.outline && res.result.outline.outline) {
              resolve(res.result.outline.outline);
            } else {
              // outline 为空，继续轮询等待
              const elapsedTime = Date.now() - startTime;
              if (elapsedTime < timeoutDuration) {
                setTimeout(() => {
                  resolve(polling(data, delay, maxRetries, currentRetry, startTime));
                }, pollingInterval);
              } else {
                reject(new Error("已超时"));
              }
            }
          }
        } catch (error) {
          // 捕获所有同步错误
          reject(error);
        }
      })
      .catch((error) => {
        if (currentRetry + 1 < maxRetries) {
          // 如果当前重试次数小于最大重试次数，则等待一段时间后再次尝试
          const pollingInterval = delay > 60000 ? 2000 : delay;
          setTimeout(() => {
            resolve(polling(data, delay, maxRetries, currentRetry + 1, startTime));
          }, pollingInterval);
        } else {
          // 重置大纲按钮状态
          reject(new Error("Max retries reached"));
        }
      });
  });
}
