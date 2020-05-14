import addCatalog from './modals/addCatalog'
import settings from './modals/settings'
import about from './modals/about'
import catalog from './views/catalog'
import model from './context/model'
import common from './common'
import properties from './modals/properties'

import DDMenu from './dropdowns/mainmenu'
import navbarHint from './hints/navbar'

export default {
  common: common,
  context: {
    model: model
  },
  dropdowns: {
    mainmenu: DDMenu
  },
  hints: {
    navbar: navbarHint
  },
  modals: {
    about: about,
    addCatalog: addCatalog,
    settings: settings,
    properties: properties
  },
  views: {
    catalog: catalog
  },
}
