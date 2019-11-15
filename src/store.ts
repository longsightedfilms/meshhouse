import Vue from 'vue'
import Vuex from 'vuex'
import { i18n } from '@/plugins/vuetify'
import { getCollection, initDB, getDB } from 'lokijs-promise'
import { Model } from './plugins/models-db/interfaces'

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
    pageCategories: [''],
    pageData: [],
    pageFilters: {
      order: 'ASC',
      where: {
        category: '',
        extension: 'none',
        name: '',
        path: ''
      }
    },
    pageLoadStatus: false,
    pageTitle: "",
    pageSceneTypes: [
      {
        text: i18n.t('lists.local.filterDCCAll'),
        value: 'none'
      },
      {
        text: '3ds Max Scene (.max)',
        value: '.max'
      },
      {
        text: 'Maya ASCII Scene (.ma)',
        value: '.ma'
      },
      {
        text: 'Maya Binary Scene (.mb)',
        value: '.mb'
      },
      {
        text: 'Blender Scene (.blend)',
        value: '.blend'
      },
      {
        text: 'Cinema 4D Scene (.c4d)',
        value: '.c4d'
      },
      {
        text: 'Houdini Scene (.hip)',
        value: '.hip'
      },
      {
        text: 'Houdini Scene (.hiplc)',
        value: '.hiplc'
      },
      {
        text: 'Houdini Scene (.hipnc)',
        value: '.hipnc'
      },
      {
        text: 'Modo Scene (.lxo)',
        value: '.lxo'
      }
    ],
    properties: {},
    imageRandomizer: 0,
    aboutModalOpened: false,
    editPropertiesModalOpened: false,
    settingModalOpened: false
  },
  mutations: {
    clearDownloadsList(state): void {
      state.downloads = []
    },
    deleteItemFromDownloadsList(state, index): void {
      state.downloads.splice(index, 1)
    },
    incrementImageRandomizer(state): void {
      state.imageRandomizer++
    },
    setApplicationDatabases(state, payload): void {
      state.databases = payload
    },
    setPageCategories(state, payload): void {
      state.pageCategories = payload
    },
    setPageLoadStatus(state, bool): void {
      state.pageLoadStatus = bool
    },
    setPageTitle(state, payload): void {
      state.pageTitle = payload
    },
    setPageData(state, payload): void {
      const categories: any[] = []
      payload.forEach((item: Model) => {
        if (!categories.includes(item.category) && item.category != '') {
          categories.push(item.category)
        }
      })

      state.pageCategories = categories
      state.pageData = payload
    },
    setPageFilters(state, payload): Promise<any> {
      state.pageFilters = payload
      return Promise.resolve(true)
    },
    setProperties(state, payload): void {
      state.properties = payload
    },
    setAboutProgramModal(state): void {
      state.aboutModalOpened = !state.aboutModalOpened
    },
    setEditPropsModal(state, payload): void {
      state.editPropertiesModalOpened = payload
    },
    setSettingsModal(state): void {
      state.settingModalOpened = !state.settingModalOpened
    }
  },
  actions: {

  }
})
