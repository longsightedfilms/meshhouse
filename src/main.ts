import Vue, { VNode } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/main';
import { ModelsDB } from './plugins/models-db';
import Vuebar from 'vuebar';
import Meta from 'vue-meta';
import { i18n } from '@/locales/i18n';
import VModal from 'vue-js-modal';
import { ValidationProvider, extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import VueIcon from '@/components/UI/Icon/Icon.vue';
import VueDropdown from '@/components/UI/Button/DropdownButton.vue';
import CatalogHeader from '@/components/UI/Header/CatalogHeader.vue';

Vue.config.productionTip = false;

for (const [rule, validation] of Object.entries(rules)) {
  extend(rule, {
    ...validation
  });
}

Vue.component('vue-icon', VueIcon);
Vue.component('vue-dropdown', VueDropdown);
Vue.component('catalog-header', CatalogHeader);
Vue.component('ValidationProvider', ValidationProvider);
Vue.use(ModelsDB);
Vue.use(Vuebar);
Vue.use(Meta);
Vue.use(VModal, { dynamic: true, dynamicDefaults: { clickToClose: false } });

new Vue({
  router,
  store,
  i18n,
  render: (h): VNode => h(App),
}).$mount('#app');
