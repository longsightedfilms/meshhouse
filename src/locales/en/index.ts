import vuetify from 'vuetify/src/locale/en'
import app from './app'
import settings from './modals/settings'
import about from './modals/about'
import local from './lists/local'

export default {
    $vuetify: vuetify,
    about: about,
    app: app,
    lists: {
        local: local,
    },
    presence: {
        basic: "Basic presence",
        rich: "Rich presence"
    },
    search: "Search",
    settings: settings,
}
