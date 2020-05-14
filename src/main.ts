import Vue, { VNode } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/main'
import { ModelsDB } from './plugins/models-db'
import Vuebar from 'vuebar'
import { i18n } from '@/locales/i18n'
import VModal from 'vue-js-modal'
import VueIcon from '@/components/UI/Icon/Icon.vue'
import VueDropdown from '@/components/UI/Button/DropdownButton.vue'

Vue.config.productionTip = false

Vue.component('vue-icon', VueIcon)
Vue.component('vue-dropdown', VueDropdown)
Vue.use(ModelsDB)
Vue.use(Vuebar)
Vue.use(VModal, { dynamic: true, dynamicDefaults: { clickToClose: false } })

new Vue({
  router,
  store,
  i18n,
  render: (h): VNode => h(App),
}).$mount('#app')
