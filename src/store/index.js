import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import app from "./modules/app";
import paper from "./modules/paper";
import settings from "./modules/settings";
import user from "./modules/user";
import distribution from "./modules/distribution";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    paper,
    settings,
    user,
    distribution,
  },
  getters,
});

export default store;
