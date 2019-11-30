import Vue from 'vue'
import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'

import 'vuetify/dist/vuetify.min.css'

import messages from '../locales/messages'

Vue.use(Vuetify)
Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en',
  messages,
})

export default new Vuetify({
  lang: {
    t: (key: string, ...params: any): string => i18n.t(key, params) as string,
  },
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    dark: true,
  },
})
