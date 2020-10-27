declare const __static: string;

import path from 'path';
import os from 'os';

/**
 * Returns true if OS is Windows 10
 */
export function isWindows10(): boolean {
  if (process.platform !== 'win32') {
    return false;
  }
  return os.release().split('.')[0] === '10';
}

/**
 * Returns appropriate styled application icon
 */
export function getIconForOS(): string {
  if (process.platform === 'win32') {
    return path.join(__static, '../build/icons', 'icon.ico');
  }

  if (process.platform === 'darwin') {
    return path.join(__static, '../build/icons', 'icon.icns');
  }

  return path.join(__static, '../build/icons', '512x512.png');
}
