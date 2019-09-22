import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    databases: [
      { title: 'MeshHouse', url: 'meshhouse', path: '', color: 'primary' }
    ],
    downloads: [
      {
        img: "https://vuetifyjs.com/apple-touch-icon-180x180.png",
        title: "Downloads not implemented",
        path: "H:\\TES.Long-Sighted Films\\Mods\\Defenders of Skyrim\\Assets\\Characters\\LoL\\Ahri\\Ahri Ears.max",
        status: {
          finished: true,
          percentage: 100
        }
      },
      {
        img: "https://vuetifyjs.com/apple-touch-icon-180x180.png",
        title: "Ahri Ears (3ds Max)",
        path: "H:\\TES.Long-Sighted Films\\Mods\\Defenders of Skyrim\\Assets\\Characters\\LoL\\Ahri\\Ahri Ears.max",
        status: {
          finished: false,
          percentage: 30
        }
      }
    ],
    pageTitle: "",
    pageData: [],
    aboutModalOpened: false,
    settingModalOpened: false
  },
  mutations: {
    setApplicationDatabases(state, payload) {
      state.databases = payload
    },
    setPageTitle(state, payload) {
      state.pageTitle = payload
    },
    setPageData(state, payload) {
      state.pageData = payload
    },
    setAboutProgramModal(state) {
      state.aboutModalOpened = !state.aboutModalOpened
    },
    setSettingsModal(state) {
      state.settingModalOpened = !state.settingModalOpened
    }
  },
  actions: {

  }
})
