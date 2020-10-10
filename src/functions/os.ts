declare const __static: string;

import path from 'path';

export function getIconForOS(): string {
  if (process.platform === 'win32') {
    return path.join(__static, '../build/icons', 'fluent.png');
  }

  if (process.platform === 'darwin') {
    return path.join(__static, '../build/icons', 'macos.png');
  }

  return path.join(__static, '../build/icons', '512x512.png');
}
