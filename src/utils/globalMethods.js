// src/plugins/globalMethods.js
import router from "@/router";
import ElementUI from "element-ui";
import store from "@/store";
import eventBus from "@/utils/eventBus";

import {
  getOutlineList,
  getOrderList,
  paperPack,
  ordersRepay,
  balance_pay,
} from "@/api/user";
import { setTimeout } from "core-js";

const GlobalMethodsPlugin = {
  install(Vue) {
    Vue.prototype.$sayHello = function (name) {
      return `Hello, ${name}!`;
    };
    Vue.prototype.$devf = function (name) {
      // console.log('Global method called!');
      const ele = `
        <div style="display: flex;flex-direction: column;align-items: center;">
          <p style="font-weight:600;font-size:large;color:#202020;margin:12px 0;">开发中, 请联系我们的官方客服，获取上线时间。</p>
          <p style="font-weight:500;font-size:small;color:#ff5353;margin:5px 0;display:none;">开发中, 请联系我们的官方客服，获取上线时间。</p>
        </div>
          `;
      ElementUI["MessageBox"]({
        title: "",
        message: ele,
        dangerouslyUseHTMLString: true,
        showClose: true,
      });
      // this.$msgbox(options)
      // 执行你需要的操作
    };

    // 付尾款
    Vue.prototype.$sendPay = function (row, status) {
      zhuge.track(`点击去支付`, {
        订单价格: row.order.total_price,
        订单题目: row.outline.title,
        订单Out_trade_no: row.order.out_trade_no,
      });

      const processResponse = (res, currentOrder, status) => {
        this.$log("去支付 res", res);
        // 关闭弹窗
        eventBus.emit("orderDialogChange", false);

        const outLineData = row.outline;
        const requestForm = {
          title: outLineData.title,
          language: outLineData.language,
          type: outLineData.type,
          field: ["哲学", outLineData.field],
          key: outLineData.key1,
          product: outLineData.product,
          word_count: res.result.word_count,
        };
        store.dispatch("app/setRequestForm", requestForm);

        const order = {
          out_trade_no: res.result.out_trade_no,
          pay_amount: res.result.pay_amount,
          pay_link: res.result.pay_link,
          type: outLineData.type,
          original_price: res.result.original_amount,
          pay_type: currentOrder.pay_type,
          payment_status: currentOrder.payment_status,
          returnStatus: status,
          order_type: res.result.order_type,
          word_count: res.result.word_count,
          product: outLineData.product,
          discounted_price: res.result.discounted_price,
          is_discount: res.result.is_discount,
        };

        store.dispatch("app/toggleCurrentOrder", order);

        // 复现aigc选项
        console.log("res.result.is_reduce_aigc", res.result.is_reduce_aigc);
        console.log("res.result.is_reduce_aigc", res.result.is_reduce_aigc);
        console.log("res.result.is_reduce_aigc", res.result.is_reduce_aigc);
        console.log("res.result.is_reduce_aigc", res.result.is_reduce_aigc);
        console.log("res.result.is_reduce_aigc", res.result.is_reduce_aigc);
        console.log("res.result.is_reduce_aigc", res.result.is_reduce_aigc);
        store.dispatch("paper/setAigc", res.result.is_reduce_aigc);

        store.dispatch("paper/setAdditionList", res.result.additional_service);

        eventBus.emit("showEmitPaypopup", {
          requestKey: res.result.out_trade_no,
          payStatus: 2,
          paperPercent: 0,
        });
      };

      const payFun = async () => {
        const data = {
          out_trade_no: row.order.out_trade_no,
          payment_method: row.order.payment_method,
        };

        const paymentMethod = status === "付尾款" ? balance_pay : ordersRepay;

        try {
          const res = await paymentMethod(data);
          processResponse(res, row.order, status);
        } catch (error) {
          this.$message({
            type: "warning",
            message: `接口超时,请稍后重试! 错误: ${error.message || error}`,
          });
        }
      };

      const targetPath = "/main/writepaper";
      const currentPath = this.$route.path;
      console.log("currenetPath", currentPath);

      if (currentPath !== targetPath) {
        this.$router.push(
          {
            path: targetPath,
            query: {
              timeData: new Date().getTime(),
            },
          },
          () => {
            let _this = this;
            setTimeout(() => {
              _this.$nextTick(() => {
                payFun();
              });
            }, 1000);
          }
        );
      } else {
        payFun();
      }
    };

    // 定义全局跳转方法
    Vue.prototype.$jumpUrl = function (url) {
      const staticRoutes = {
        "/login": "登录页",
        "/404": "",
        "*": "",
        "/dashboard": "",
        "/toPromotion": "",
        "/": "",
        "/main": "main",
        "/main/writepaper": "写论文",
        "/main/reduceRepetition": "降重/降AIGC",
        "/main/chat": "ChatGPT",
        "/main/explore": "AI在线搜索",
        "/main/readpaper": "读论文",
        "/main/amendpaper": "amendpaper",
        "/main/integratedservices": "integratedservices",
        "/main/eliteCourses": "eliteCourses",
        "/main/aitools": "AI工具",
        "/user": "",
        "/user/promotion": "我的推广",
        "/user/userInfo": "我的详情",
        "/paper": "",
        "/paper/preview": "preview",
        "/paper/reduceRepetiton": "reduceRepetiton",
        "/home": "",
        "/home/home": "首页",
      };
      window.zhuge.track("用户访问页面", {
        页面名称: staticRoutes[url],
      });
      router.push(url);
    };

    Vue.prototype.$setMinWindowWidth = function () {
      // let resizing = false;
      // function preventResize(e) {
      //   if (resizing && window.innerWidth < Vue.prototype.$minWidth) {
      //     e.preventDefault();
      //     window.resizeTo(Vue.prototype.$minWidth, window.innerHeight);
      //   }
      // }
      // window.addEventListener('resize', function () {
      //   if (window.innerWidth < Vue.prototype.$minWidth) {
      //     // window.resizeTo(Vue.prototype.$minWidth, window.innerHeight);
      //     // window.innerWidth = 500
      //   }
      //   resizing = true;
      //   setTimeout(() => {
      //     resizing = false;
      //   }, 2000); // 假设 resize 事件触发的频率
      // });
      // window.addEventListener('beforeunload', preventResize);
      // 提示用户最小窗口大小要求
    };
    Vue.prototype.$bdSave = function (name) {
      // let data = {
      //   out_trade_no: store.getters.currentOrder.out_trade_no,
      //   bd_vid: store.getters.bdVid,
      // };
      // bd_convert(data).then((res) => {
      // });
      // this.$msgbox(options)
      // 执行你需要的操作
    };
  },
};

export default GlobalMethodsPlugin;
