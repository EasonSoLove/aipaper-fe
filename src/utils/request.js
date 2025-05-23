import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
import router from "../router/index";
import eventBus from "@/utils/eventBus";

// create an axios instance
const service = axios.create({
  baseURL: "", // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers["Authorization"] = getToken();
    }
    return config;
  },
  (error) => {
    // do something with request error
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.

    if (res.code !== 200) {
      if (res.code == 401) {
        Message({
          message: "登录已过期,请重新登录!",
          type: "error",
          duration: 5 * 1000,
        });
        store.dispatch("user/resetToken").then(() => {
          // router.push("/login");
          eventBus.emit("showLogin"); // 发布事件
        });
      } else {
        Message({
          message: res.message || res.msg || "Error",
          type: "error",
          duration: 5 * 1000,
        });
      }

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50014) {
        // to re-login
        MessageBox.confirm(
          "您已被注销，您可以取消以留在当前页面，或者再次登录",
          "确认注销",
          {
            confirmButtonText: "重新登录",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    if (error.response.status == "401") {
      Message({
        message: "登录已过期,请重新登录!",
        type: "error",
        duration: 5 * 1000,
      });
      store.dispatch("user/resetToken").then(() => {
        // router.push("/login");
        eventBus.emit("showLogin"); // 发布事件
      });
    } else {
      // 请求已发出，但是不在2xx的范围
      Message({
        message: error.response.data.message
          ? error.response.data.message
          : error.response.data.msg,
        type: "error",
        duration: 5 * 1000,
      });
    }

    return Promise.reject(error);
  }
);

export default service;
