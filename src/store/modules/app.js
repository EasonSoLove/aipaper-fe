import Cookies from "js-cookie";
import { getLanguage } from "@/lang/index";

const state = {
  sidebar: {
    opened: Cookies.get("sidebarStatus")
      ? !!+Cookies.get("sidebarStatus")
      : true,
    withoutAnimation: false,
    activeIndex: 1,
  },
  device: "desktop",
  homeData: {},
  language: getLanguage(),

  lineTitle: "论文标题", //
  requestForm: {}, // step1 用户输入内容
  step3PdfUrl: "", // 正文链接
  currentOrder: {},
  produceLineStatus: false, // 生成大纲状态, true:生成中 false: 未生成
  activeIndex: 0, // 写论文页面 step 激活index
  globalCode: [],
};

const mutations = {
  SET_LANGUAGE: (state, language) => {
    state.language = language;
    Cookies.set("language", language);
  },
  TOGGLE_SIDEBAR: (state) => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      Cookies.set("sidebarStatus", 1);
    } else {
      Cookies.set("sidebarStatus", 0);
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set("sidebarStatus", 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
  TOGGLE_CODE: (state, globalCode) => {
    state.globalCode = globalCode;
  },
  TOGGLE_PDF: (state, step3PdfUrl) => {
    state.step3PdfUrl = step3PdfUrl;
  },
  TOGGLE_NO: (state, currentOrder) => {
    state.currentOrder = currentOrder;
  },
  TOGGLE_PROSTATE: (state, produceLineStatus) => {
    state.produceLineStatus = produceLineStatus;
  },
  TOGGLE_ACTIVE: (state, activeIndex) => {
    state.activeIndex = activeIndex;
  },
  TOGGLE_FORM: (state, requestForm) => {
    state.requestForm = requestForm;
  },
  SET_HOME_DATA: (state, homeData) => {
    state.homeData = JSON.parse(JSON.stringify(homeData));
  },
  CHANGE_ACTIVE_SIDEBAR_ITEM: (state, activeIndex) => {
    state.sidebar.activeIndex = activeIndex;
  },
};

const actions = {
  setActiveIndex({ commit }, activeIndex) {
    commit("TOGGLE_ACTIVE", activeIndex);
  },
  setGlobalCode({ commit }, globalCode) {
    commit("TOGGLE_CODE", globalCode);
  },
  setLanguage({ commit }, language) {
    commit("SET_LANGUAGE", language);
  },
  toggleSideBar({ commit }) {
    commit("TOGGLE_SIDEBAR");
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit("CLOSE_SIDEBAR", withoutAnimation);
  },
  toggleDevice({ commit }, device) {
    commit("TOGGLE_DEVICE", device);
  },
  toggleCurrentOrder({ commit }, currentOrder) {
    commit("TOGGLE_NO", currentOrder);
  },
  togglePDFUrl({ commit }, str) {
    commit("TOGGLE_PDF", str);
  },
  setHomeData({ commit }, data) {
    commit("SET_HOME_DATA", data);
  },
  setRequestForm({ commit }, data) {
    commit("TOGGLE_FORM", data);
  },
  setActiveSidebar({ commit }, index) {
    commit("CHANGE_ACTIVE_SIDEBAR_ITEM", index);
  },
  setProStatus({ commit }, status) {
    commit("TOGGLE_PROSTATE", status);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
