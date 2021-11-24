const GAME_ENGINE_EXTENSIONS: Extension = {
  '.sfm': {
    title: 'Source Filmmaker Addon',
    icon: 'sfm'
  }
};

const INTERCHANGE_EXTENSIONS: Extension = {
  '.fbx': {
    title: 'Autodesk FBX',
    icon: 'max'
  }
};

export const INTEGRATIONS: string[] = [
  'meshhouse',
  'sfmlab',
  'smutbase',
  'open3dlab'
];

export const EXTENSIONS: Extension = {
  '.3b': {
    title: '3DCoat Scene',
    icon: '3b'
  },
  '.max': {
    title: '3ds Max Scene',
    icon: 'max',
  },
  '.ma': {
    title: 'Maya ASCII Scene',
    icon: 'ma',
  },
  '.mb': {
    title: 'Maya Binary Scene',
    icon: 'mb',
  },
  '.blend': {
    title: 'Blender Scene',
    icon: 'blend',
  },
  '.c4d': {
    title: 'Cinema 4D Scene',
    icon: 'c4d',
  },
  '.hip': {
    title: 'Houdini Scene',
    icon: 'hip',
  },
  '.hiplc': {
    title: 'Houdini Scene',
    icon: 'hiplc',
  },
  '.hipnc': {
    title: 'Houdini Scene',
    icon: 'hipnc',
  },
  '.lxo': {
    title: 'Modo Scene',
    icon: 'lxo',
  },
  '.spp': {
    title: 'Substance Painter Scene',
    icon: 'spp'
  },
  ...GAME_ENGINE_EXTENSIONS,
  ...INTERCHANGE_EXTENSIONS
};
