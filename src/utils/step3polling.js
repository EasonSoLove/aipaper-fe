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
  delay = 2000,
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
 * @returns {Object} { start, stop } 控制轮询的接口
 */
function createPaperPolling(data) {
  return createIntervalPolling(
    async (stop) => {
      const res = await paper_status(data); // 调用接口

      if (res.result.status === "生成中") {
      } else if (res.result.status === "生成失败") {
        console.log("轮询失败，状态：", res.result.status);
        stop(); // 停止轮询
      } else {
        // store.dispatch("app/setProStatus", false);
        console.log("生成完成，结果：", res.result.outline.outline);
        stop(); // 停止轮询
      }
    },
    2000, // 轮询间隔
    5, // 最大重试次数
    120000 // 超时时间
  );
}

/**
 * 启动唯一轮询
 * @param {Object} data 请求数据
 */
export function startUniquePaperPolling(data) {
  // 如果已存在轮询实例，先停止它
  if (activePollingInstance) {
    activePollingInstance.stop();
    activePollingInstance = null;
  }

  // 创建新的业务轮询实例
  activePollingInstance = createPaperPolling(data);

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
