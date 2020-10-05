import ElectronStore from 'electron-store';

export const sfmlab = {
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

export const smutbase = {
  title: 'Smutbase',
  color: '#542e6e',
  icon: '@/smutbase.svg',
  url: 'smutbase',
  background: '@/backgrounds/smutbase.webp',
  path: null,
  count: 0,
  localDB: false,
  totalsize: 0,
  disabled: true
};

export const open3dlab = {
  title: 'Open3DLab',
  color: '#324386',
  icon: '@/open3dlab.svg',
  url: 'open3dlab',
  background: '@/backgrounds/open3dlab.webp',
  path: null,
  count: 0,
  localDB: false,
  totalsize: 0,
  disabled: true
};

export default {
  '>=0.2.7': ((db: ElectronStore<DatabaseSettings>): void => {
    db.set('databases.integrations.sfmlab', sfmlab);
    db.set('databases.integrations.smutbase', smutbase);
    db.set('databases.integrations.open3dlab', open3dlab);
  })
};
