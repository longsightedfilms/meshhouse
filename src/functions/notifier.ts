declare const __static: string;

import path from 'path';
import notifier from 'node-notifier';

/**
 * Creates a notification in OS
 * @param title Notification title
 * @param message Notification message
 */
export function createOSNotification(title: string, message: string): void {
  const notifierObject = {
    appName: 'com.longsightedfilms.meshhouse',
    title,
    message,
    icon: path.join(__static, '../build/icons', '512x512.png'),
    wait: true
  };
  notifier.notify(notifierObject);
}
