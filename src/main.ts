import Vue, { VNode } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/main'
import { ModelsDB } from './plugins/models-db'
import Vuebar from 'vuebar'
import { i18n } from '@/locales/i18n'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faAngleLeft,
  faCog,
  faDownload,
  faPlus,
  faQuestionCircle,
  faSortAlphaUp,
  faSortAlphaDownAlt
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VModal from 'vue-js-modal'

Vue.config.productionTip = false

library.add(
  faAngleLeft,
  faCog,
  faDownload,
  faPlus,
  faQuestionCircle,
  faSortAlphaUp,
  faSortAlphaDownAlt
)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(ModelsDB)
Vue.use(Vuebar)
Vue.use(VModal, { dynamic: true, dynamicDefaults: { clickToClose: false } })

new Vue({
  router,
  store,
  i18n,
  render: (h): VNode => h(App),
}).$mount('#app')
