export default {
  tabs: {
    common: {
      title: "Common settings",
      content: {
        language: 'Language',
        theme: {
          title: 'Theme',
          content: {
            light: 'Light',
            dark: 'Dark',
            system: 'System settings (Windows 10, MacOS 10.14+)'
          }
        }
      }
    },
    dcc: {
      title: "DCC launch settings",
      content: {
        currentPath: 'Current path to application: ',
        useSystemAssociation: 'Use system association',
        exePath: 'Choose executable file',
        hint: 'If switch is enabled (set to right), program will open file with system association with {extension} files',
      }
    }
  },
  title: 'MeshHouse settings',
}
