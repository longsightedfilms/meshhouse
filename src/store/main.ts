import Vue from 'vue';
import Vuex from 'vuex';
import controls from './modules/controls';
import database from './modules/database';
import downloads from './modules/downloads';

Vue.use(Vuex);

export default new Vuex.Store<ApplicationStore>({
  modules: {
    controls,
    db: database,
    downloads
  }
});
