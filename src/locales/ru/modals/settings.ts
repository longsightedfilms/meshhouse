export default {
  tabs: {
    common: {
      title: 'Основные настройки',
      content: {
        language: 'Язык',
        theme: {
          title: 'Тема',
          content: {
            light: 'Светлая',
            dark: 'Темная',
            system: 'Системные настройки (Windows 10, MacOS 10.14+)'
          }
        },
        openLastPage: {
          title: 'При запуске программы открывать',
          content: {
            main: 'Начальную страницу',
            lastCatalog: 'Последний открытый каталог'
          }
        },
        hideIntegrations: {
          title: 'Скрывать интеграции'
        },
        minimalisticHeaders: {
          title: 'Компактные шапки каталогов'
        },
        showInTray: {
          title: 'Показывать иконку в системном трее',
          note: 'Когда опция включена, окно также будет сворачиваться в трей'
        }
      }
    },
    dcc: {
      title: 'Настройка запуска программ',
      content: {
        currentPath: 'Текущий путь к программе: ',
        useSystemAssociation: 'Использовать системную ассоциацию',
        exePath: 'Укажите путь к исполняемому файлу',
        hint: 'Если переключатель находится в правом положении, то при открытии файлов будет использоваться системная ассоциация для {extension} файлов',
      }
    },
    integrations: {
      title: 'Общие настройки интеграций',
      content: {
        customProxy: {
          title: 'Использовать нестандартный сервер API',
          hint: 'Сторонний API сервер обязан соответствовать стандарту <a href="https://app.swaggerhub.com/apis/meshhouse/meshhouse-reverse-api-proxy/1.0.0">OpenAPI</a>.'
        },
        path: 'Укажите путь, куда будут устанавливаться модели',
        sfmlab: {
          title: 'Настройки SFMLab',
          content: {
            matureContent: {
              title: 'Показывать контент для взрослых'
            }
          }
        }
      }
    }
  },
  title: 'Настройки MeshHouse',
  restartRequired: 'Чтобы изменение вступило в силу, необходимо перезапустить приложение'
};
