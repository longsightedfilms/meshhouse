declare const __static: string;

import path from 'path';
import os from 'os';
import si from 'systeminformation';

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

export async function getSystemInfo(): Promise<any> {
  const pcInfo = await si.system();
  const osInfo = await si.osInfo();
  const uuid = (await si.uuid()).os;

  const deviceInfo = {
    model: `${pcInfo.manufacturer} ${pcInfo.model}`,
    os: `${osInfo.distro} (${osInfo.arch}) ${osInfo.release}`,
    hostname: osInfo.hostname,
    uuid: uuid
  };

  return deviceInfo;
}
