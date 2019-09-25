import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ModelsDB from './plugins/models-db'
import Vuebar from 'vuebar'
import { i18n } from './plugins/vuetify'

import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

Vue.use(ModelsDB)
Vue.use(Vuebar)

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app')
