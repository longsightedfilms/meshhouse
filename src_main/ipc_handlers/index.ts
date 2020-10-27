import fs from './fs';
import image from './image';
import integrations from './integrations';
import theme from './theme';
import shell from './shell';
import store from './electron-store';
import systemInfo from './system-info';
import window from './window';

export const fsHandler = fs;
export const themeHandler = theme;
export const shellHandler = shell;
export const storeHandler = store;
export const systemInfoHandler = systemInfo;
export const windowHandler = window;
export const integrationsHandler = integrations;
export const imageHandler = image;
