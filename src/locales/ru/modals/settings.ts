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
        path: 'Укажите путь, куда будут устанавливаться модели'
      }
    }
  },
  title: 'Настройки MeshHouse',
};
