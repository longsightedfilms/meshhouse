import ElectronStore from 'electron-store';

export default {
  '>=0.2.6': ((settings: ElectronStore<ApplicationSettings>): void => {
    settings.set('checkForUpdatesOnStartup', false);
  })
};
