import vuetify from 'vuetify/src/locale/ru.ts'
import app from './app.ts'
import settings from './modals/settings.ts'
import local from './lists/local.ts'

export default {
    $vuetify: vuetify,
    app: app,
    lists: {
        local: local
    },
    presence: {
        basic: "Базовое представление",
        rich: "Расширенное представление"
    },
    search: "Поиск",
    settings: settings
}