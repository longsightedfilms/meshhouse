import addCatalog from './modals/addCatalog'
import settings from './modals/settings'
import about from './modals/about'
import catalog from './views/catalog'
import model from './context/model'
import common from './common'
import properties from './modals/properties'

import DDMenu from './dropdowns/mainmenu'
import navbarHint from './hints/navbar'

import fields from './fields'
import validationMessages from 'vee-validate/dist/locale/ru.json'

export default {
  common: common,
  context: {
    model: model
  },
  dropdowns: {
    mainmenu: DDMenu
  },
  fields: fields,
  hints: {
    navbar: navbarHint
  },
  modals: {
    about: about,
    addCatalog: addCatalog,
    settings: settings,
    properties: properties
  },
  validations: validationMessages,
  views: {
    catalog: catalog
  },
}
