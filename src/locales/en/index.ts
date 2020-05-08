import common from './common'
import addCatalog from './modals/addCatalog'
import settings from './modals/settings'
import about from './modals/about'
import properties from './modals/properties'
import catalog from './views/catalog'
import model from './context/model'

export default {
  common: common,
  context: {
    model: model
  },
  modals: {
    about: about,
    addCatalog: addCatalog,
    properties: properties,
    settings: settings,
  },
  views: {
    catalog: catalog
  }
}
