import vuetify from 'vuetify/src/locale/en.ts'
import app from './app.ts'
import settings from './modals/settings.ts'
import about from './modals/about.ts'
import local from './lists/local.ts'

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
