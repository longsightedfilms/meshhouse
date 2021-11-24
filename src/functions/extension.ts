/**
 * Convert DCC title to extension
 *
 * Can be used when you can't get extension directly
 * @param format DCC title
 */
export function slugifyToExtension(format: string): string {
  const file = format.toLowerCase();
  if (file.includes('max')) {
    return '.max';
  }
  if (file.includes('blender')) {
    return '.blend';
  }
  if (file.includes('cinema 4d')) {
    return '.c4d';
  }
  if (file.includes('maya')) {
    return '.ma';
  }

  return '.sfm';
}

export function getParameterByExtension(extension: string, param: string): string {
  switch (extension) {
  case '.3b':
    return window.ipc.sendSync('get-dcc-setting', 'threedCoat.' + param);
  case '.max':
    return window.ipc.sendSync('get-dcc-setting', 'adsk3dsmax.' + param);
  case '.ma':
  case '.mb':
    return window.ipc.sendSync('get-dcc-setting', 'adskMaya.' + param);
  case '.blend':
    return window.ipc.sendSync('get-dcc-setting', 'blender.' + param);
  case '.c4d':
    return window.ipc.sendSync('get-dcc-setting', 'cinema4d.' + param);
  case '.hip':
  case '.hiplc':
  case '.hipnc':
    return window.ipc.sendSync('get-dcc-setting', 'houdini.' + param);
  case '.lxo':
    return window.ipc.sendSync('get-dcc-setting', 'modo.' + param);
  case '.spp':
    return window.ipc.sendSync('get-dcc-setting', 'substancePainter.' + param);
  default:
    return 'nondefault';
  }
}
