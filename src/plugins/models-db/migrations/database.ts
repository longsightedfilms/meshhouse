import ElectronStore from 'electron-store';

const sfmlab = {
  title: 'SFMLab',
  color: '#af9c75',
  icon: '@/sfmlab.svg',
  url: 'sfmlab',
  background: '@/backgrounds/sfmlab.webp',
  path: null,
  count: 0,
  localDB: false,
  totalsize: 0,
  disabled: true
};

export default {
  '>=0.2.7': ((db: ElectronStore<DatabaseSettings>): void => {
    db.set('databases.integrations.sfmlab', sfmlab);
  })
};
