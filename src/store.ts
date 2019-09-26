import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    databases: [
      { title: 'MeshHouse', url: 'meshhouse', path: '', color: 'primary', view: 'rich' }
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
    pageLoaded: false,
    pageTitle: "",
    pageData: [],
    properties: {},
    imageRandomizer: 0,
    aboutModalOpened: false,
    editPropertiesModalOpened: false,
    settingModalOpened: false
  },
  mutations: {
    clearDownloadsList(state) {
      state.downloads = []
    },
    deleteItemFromDownloadsList(state, index) {
      state.downloads.splice(index, 1)
    },
    incrementImageRandomizer(state) {
      state.imageRandomizer++
    },
    setApplicationDatabases(state, payload) {
      state.databases = payload
    },
    setPageStatus(state, bool) {
      state.pageLoaded = bool
    },
    setPageTitle(state, payload) {
      state.pageTitle = payload
    },
    setPageData(state, payload) {
      state.pageData = payload
    },
    setProperties(state, payload) {
      state.properties = payload
    },
    setAboutProgramModal(state) {
      state.aboutModalOpened = !state.aboutModalOpened
    },
    setEditPropsModal(state, payload) {
      state.editPropertiesModalOpened = payload
    },
    setSettingsModal(state) {
      state.settingModalOpened = !state.settingModalOpened
    }
  },
  actions: {

  }
})
