// plugins/logPlugin.js
const isProduction = process.env.NODE_ENV === "production";

const logger = {
  log: (...args) => {
    if (!isProduction) {
      console.log(...args);
    }
  },
  warn: (...args) => {
    if (!isProduction) {
      console.warn(...args);
    }
  },
  error: (...args) => {
    console.error(...args); // 错误信息通常在生产环境也需要输出
  },
};

const logPlugin = {
  install(Vue) {
    Vue.prototype.$log = logger.log;
    Vue.prototype.$warn = logger.warn;
    Vue.prototype.$error = logger.error;

    // 定义全局函数
    window.Ming = logger.log;
    window.gao = logger.log;
    window.Warn = logger.warn;
    window.ELog = logger.error;
  },
};

export default logPlugin;
