import { getDistributionBaseInfo } from "@/api/distribution";

const getDefaultState = () => ({
  baseInfo: {
    distribution_name: "",
    distribution_account_status: "NORMAL",
    inv_code_url: "",
    inv_user_num: 0,
    currency: "CNY",
    direct_rewards: 0,
    indirect_rewards: 0,
    balance: 0,
    frozen_amount: 0,
    withdrawn_amount: 0,
    total_income: 0,
    question_and_answer: "",
    is_login: false,
  },
});

const state = getDefaultState();

const mutations = {
  RESET_STATE(state) {
    Object.assign(state, getDefaultState());
  },
  SET_BASE_INFO(state, payload) {
    state.baseInfo = { ...state.baseInfo, ...(payload || {}) };
  },
};

const actions = {
  async fetchBaseInfo({ commit }) {
    const res = await getDistributionBaseInfo();
    if (res && res.code === 200) {
      commit("SET_BASE_INFO", res.result || {});
    }
    return res;
  },
  setBaseInfo({ commit }, payload) {
    commit("SET_BASE_INFO", payload || {});
  },
  reset({ commit }) {
    commit("RESET_STATE");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
