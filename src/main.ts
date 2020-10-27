import Vue, { VNode } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/main';
import { ModelsDB } from './plugins/models-db';
import ipcBridge from '@/plugins/ipc';
import Vuebar from 'vuebar';
import Meta from 'vue-meta';
import { i18n } from '@/locales/i18n';
import VModal from 'vue-js-modal';
import { ValidationProvider, extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import VueButton from '@/components/UI/Button/Button.vue';
import VueIcon from '@/components/UI/Icon/Icon.vue';
import VueDropdown from '@/components/UI/Button/DropdownButton.vue';
import VueLoader from '@/components/UI/Loader/Loader.vue';
import CatalogHeader from '@/components/UI/Header/CatalogHeader.vue';

import { integrationsList } from '@/functions/databases';
import { transliterate as tr, slugify } from 'transliteration';

Vue.config.productionTip = false;

for (const [rule, validation] of Object.entries(rules)) {
  extend(rule, {
    ...validation
  });
}

extend('notIntegrationName', ((value: string): boolean => {
  const slug = value.trim().replace(/[~!@#$%^&*()=+.,?/\\|]+/, '');
  const url = slugify(slug);
  return integrationsList.findIndex((integrationName: string) => integrationName === url) === -1;
}));

Vue.component('v-button', VueButton);
Vue.component('v-loader', VueLoader);
Vue.component('vue-icon', VueIcon);
Vue.component('vue-dropdown', VueDropdown);
Vue.component('catalog-header', CatalogHeader);
Vue.component('ValidationProvider', ValidationProvider);
Vue.use(ModelsDB);
Vue.use(ipcBridge);
Vue.use(Vuebar);
Vue.use(Meta);
Vue.use(VModal, { dynamic: true, dynamicDefaults: { clickToClose: false } });

new Vue({
  router,
  store,
  i18n,
  render: (h): VNode => h(App),
}).$mount('#app');
