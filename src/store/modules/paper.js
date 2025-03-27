import Cookies from "js-cookie";

const state = {
  activeIndex: 0, //
  pollingStatus: false, // paper弹窗 是否继续循环
  additionalList: [], // paper弹窗 是否继续循环
  preViewId: "", // 报告查询ID
  bdVid: "",
  orderStatus: "", //支付时判断支付状态
  selector_item: {},
  formdataV2: {},
  outlineVersion: "v2",
};

const mutations = {
  TOGGLE_ACTIVE: (state, activeIndex) => {
    state.activeIndex = activeIndex;
  },
  TOGGLE_PREVIEW: (state, preViewId) => {
    state.preViewId = preViewId;
  },
  TOGGLE_OUTLINE: (state, outlineVersion) => {
    state.outlineVersion = outlineVersion;
  },
  SAVE_VID: (state, bdVid) => {
    state.bdVid = bdVid;
  },
  SAVE_FORMV2: (state, formdataV2) => {
    state.formdataV2 = formdataV2;
  },
  SET_SELECT: (state, selector_item) => {
    state.selector_item = selector_item;
  },
  SET_ORDERS: (state, orderStatus) => {
    state.orderStatus = orderStatus;
  },
  TOGGLE_POLLING: (state, pollingStatus) => {
    state.pollingStatus = pollingStatus;
  },
  TOGGLE_ADDITION: (state, additionalList) => {
    state.additionalList = additionalList;
  },
};

const actions = {
  setActiveIndex({ commit }, activeIndex) {
    commit("TOGGLE_ACTIVE", activeIndex);
  },
  setOutlineVersion({ commit }, outlineVersion) {
    commit("TOGGLE_OUTLINE", outlineVersion);
  },
  setFormdataV2({ commit }, formdataV2) {
    commit("SAVE_FORMV2", formdataV2);
  },
  setPreviewId({ commit }, preViewId) {
    commit("TOGGLE_PREVIEW", preViewId);
  },
  setBdVid({ commit }, bdVid) {
    commit("SAVE_VID", bdVid);
  },
  setOrderStatus({ commit }, orderStatus) {
    commit("SET_ORDERS", orderStatus);
  },
  setSelectorItem({ commit }, selector_item) {
    commit("SET_SELECT", selector_item);
  },
  setPollingStatus({ commit }, pollingStatus) {
    commit("TOGGLE_POLLING", pollingStatus);
  },
  setAdditionList({ commit }, additionalList) {
    commit("TOGGLE_ADDITION", additionalList);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
