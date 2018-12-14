import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    imgInfo: null,
  },
  mutations: {
    setImgInfo(state, res) {
      state.imgInfo = res;
    },
  },
});
