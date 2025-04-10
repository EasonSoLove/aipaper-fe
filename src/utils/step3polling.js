import { paper_status } from "@/api/paper";
import store from "@/store";

let activePollingInstance = null; // 存储当前活跃的轮询实例

/**
 * 通用轮询方法
 * @param {Function} callback 轮询执行的业务逻辑（返回 Promise）
 * @param {Number} delay 轮询间隔
 * @param {Number} maxRetries 最大重试次数
 * @param {Number} timeout 超时时间
 * @returns {Object} { start, stop } 控制轮询的接口
 */
function createIntervalPolling(
  callback,
  delay = 20000,
  maxRetries = 5,
  timeout = 120000
) {
  let timer = null;
  let isCancelled = false;
  let retries = 0;

  const stop = () => {
    isCancelled = true;
    clearTimeout(timer);
    console.log("轮询已停止");
  };

  const start = () => {
    isCancelled = false;

    const loop = async () => {
      if (isCancelled) return;

      try {
        await callback(stop);
        retries = 0; // 成功时重置重试次数
        timer = setTimeout(loop, delay);
      } catch (err) {
        retries += 1;
        if (retries >= maxRetries) {
          console.error("轮询达到最大重试次数");
          stop();
        } else {
          console.error("轮询出错，重试中：", err);
          timer = setTimeout(loop, delay);
        }
      }
    };

    loop();

    // 设置总超时
    setTimeout(() => {
      if (!isCancelled) {
        console.error("轮询超时");
        stop();
      }
    }, timeout);
  };

  return { start, stop };
}

/**
 * 业务轮询方法
 * @param {Object} data 请求数据
 * @param {Function} onSuccess 成功后的回调函数，接收 res.result
 * @returns {Object} { start, stop } 控制轮询的接口
 */
function createPaperPolling(data, onSuccess) {
  return createIntervalPolling(
    async (stop) => {
      const res = await paper_status(data); // 调用接口
      console.log("re statusstatusstatus", res);
      if (res.result.paper_stage == 1 || res.result.paper_stage == 0) {
        if (res.result.task_info_list && res.result.task_info_list.length > 0) {
          onSuccess(res.result); // 返回结果
        }
        // 继续轮询
      } else if (res.result.paper_stage == 3) {
        console.log("轮询失败，状态：", res);
        stop(); // 停止轮询
      } else {
        console.log("生成完成，结果：", res);

        // 调用回调，将结果返回给调用方
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(res.result); // 返回结果
        }

        stop(); // 停止轮询
      }
    },
    30000, // 轮询间隔
    5, // 最大重试次数
    5600000 // 超时时间
  );
}

/**
 * 启动唯一轮询
 * @param {Object} data 请求数据
 */
export function startUniquePaperPolling(data, onSuccess) {
  // 如果已存在轮询实例，先停止它
  if (activePollingInstance) {
    activePollingInstance.stop();
    activePollingInstance = null;
  }

  // 创建新的业务轮询实例，并传入回调
  activePollingInstance = createPaperPolling(data, onSuccess);

  // 启动轮询
  activePollingInstance.start();
}

/**
 * 手动停止轮询
 */
export function stopPaperPolling() {
  if (activePollingInstance) {
    activePollingInstance.stop();
    activePollingInstance = null;
  }
}
