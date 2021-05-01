import ElectronStore from 'electron-store';

export default {
  '>=0.2.6': ((settings: ElectronStore<ApplicationSettings>): void => {
    settings.set('checkForUpdatesOnStartup', false);
  }),
  '>=0.2.7': ((settings: ElectronStore<ApplicationSettings>): void => {
    settings.set('hideIntegrations', false);
    settings.set('minimalisticHeaders', false);
    settings.set('showInTray', false);
  }),
  '>=0.2.8': ((settings: ElectronStore<ApplicationSettings>): void => {
    settings.set('integrations.proxy.customProxy', false);
    settings.set('integrations.proxy.url', '');
  }),
};
