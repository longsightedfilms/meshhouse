import {
  sfmlab,
  smutbase,
  open3dlab
} from '../migrations/database';

export default {
  local: [],
  integrations: {
    meshhouse: {
      title: 'MeshHouse',
      color: '#32a5e3',
      icon: '@/meshhouse.svg',
      url: 'meshhouse',
      background: '@/backgrounds/meshhouse.webp',
      path: null,
      count: 0,
      localDB: false,
      totalsize: 0,
      disabled: true
    },
    sfmlab,
    smutbase,
    open3dlab
  }
};
