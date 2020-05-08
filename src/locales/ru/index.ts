import addCatalog from './modals/addCatalog'
import settings from './modals/settings'
import about from './modals/about'
import catalog from './views/catalog'
import model from './context/model'
import common from './common'
import properties from './modals/properties'

export default {
  common: common,
  context: {
    model: model
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
