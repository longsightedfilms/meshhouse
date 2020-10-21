export default {
  tabs: {
    common: {
      title: 'Common settings',
      content: {
        language: 'Language',
        theme: {
          title: 'Theme',
          content: {
            light: 'Light',
            dark: 'Dark',
            system: 'System settings (Windows 10, MacOS 10.14+)'
          }
        },
        openLastPage: {
          title: 'After application startup open',
          content: {
            main: 'Index page',
            lastCatalog: 'Last opened catalog'
          }
        },
        hideIntegrations: {
          title: 'Hide integrations'
        },
        minimalisticHeaders: {
          title: 'Compact catalog headers'
        },
        showInTray: {
          title: ' Show icon in system tray',
          note: 'If enabled, window also will be minimized in tray'
        }
      }
    },
    dcc: {
      title: 'DCC launch settings',
      content: {
        currentPath: 'Current path to application: ',
        useSystemAssociation: 'Use system association',
        exePath: 'Choose executable file',
        hint: 'If switch is enabled (set to right), program will open file with system association with {extension} files',
      }
    },
    integrations: {
      title: 'Main integrations settings',
      content: {
        path: 'Choose path to install models'
      }
    }
  },
  title: 'MeshHouse settings',
  restartRequired: 'To apply changes restart application'
};
