import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets
import Cookies from "js-cookie";

// import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
// import "element-ui/lib/theme-chalk/display.css";
import "@/styles/index.scss"; // global css
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/display.css";

import App from "./App";
import store from "./store";
import router from "./router";

import "@/icons"; // icon
import "@/permission"; // permission control
import "@/utils/rem";
import "@/assets/js/iconfont";
import i18n from "./lang"; // internationalization
import VueClipboard from "vue-clipboard2";

const VConsole = require("vconsole");
const vConsole = new VConsole();
console.log("VConsole is enabled");

import * as filters from "./filters"; // global filters
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === "production") {
  const { mockXHR } = require("../mock");
  mockXHR();
}
import locale from "element-ui/lib/locale/lang/zh-CN";
// set ElementUI lang to EN
Vue.use(ElementUI, {
  size: Cookies.get("size") || "medium", // set element-ui default size
  i18n: (key, value) => i18n.t(key, value),
});

import VueAwesomeSwiper from "vue-awesome-swiper";
// import style
// import 'swiper/swiper.css'
// require('swiper/dist/css/swiper.css')
import "swiper/css/swiper.css";
Vue.use(VueAwesomeSwiper /* { default options with global component } */);

import GlobalMethodsPlugin from "@/utils/globalMethods";
Vue.use(GlobalMethodsPlugin);
VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);

Vue.config.productionTip = false;

Vue.prototype.$minWidth = 500;

// eventBus.js
import VueScrollTo from "vue-scrollto";

let scrollOptions = {
  easing: "ease", //缓动类型
  offset: -50, // 滚动时应应用的偏移量。此选项接受回调函数
  x: false, // 是否要在x轴上也滚动
  y: true, // 是否要在y轴上滚动
};

Vue.use(VueScrollTo, scrollOptions);

import TextareaAutosize from "vue-textarea-autosize";

Vue.use(TextareaAutosize);
new Vue({
  el: "#app",
  router,
  store,
  i18n,
  render: (h) => h(App),
  beforeCreate() {
    this.$setMinWindowWidth(); // 在 Vue 实例创建前设置窗口大小限制
  },
});
