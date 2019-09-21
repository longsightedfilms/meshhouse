import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    databases: [
      { title: 'MeshHouse', url: 'meshhouse', path: '', color: 'primary' }
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
