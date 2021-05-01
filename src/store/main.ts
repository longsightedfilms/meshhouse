import Vue from 'vue';
import Vuex from 'vuex';
import controls from './modules/controls';
import database from './modules/database';
import downloads from './modules/downloads';
import settings from './modules/settings';
import devices from './modules/devices';
import notifications from './modules/notifications';

Vue.use(Vuex);

export default new Vuex.Store<ApplicationStore>({
  modules: {
    controls,
    db: database,
    devices,
    downloads,
    notifications,
    settings
  }
});
