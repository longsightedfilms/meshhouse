import notifier from 'node-notifier';
import { getIconForOS } from './os';
import logger from '../logger';

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
    icon: getIconForOS(),
    wait: true
  };
  notifier.notify(notifierObject);
  logger.verbose('Notification has been created');
}
