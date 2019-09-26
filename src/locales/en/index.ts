import vuetify from 'vuetify/src/locale/en'
import app from './app'
import addCatalog from './addCatalog'
import settings from './modals/settings'
import about from './modals/about'
import local from './lists/local'

export default {
    $vuetify: vuetify,
    about: about,
    addCatalog: addCatalog,
    app: app,
    lists: {
        local: local,
    },
    search: "Search",
    settings: settings,
}
