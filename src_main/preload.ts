import { contextBridge } from 'electron';
import { ipcRenderer } from 'electron-better-ipc';
import type { RendererProcessIpc } from 'electron-better-ipc';
import url from 'url';

declare global {
  interface Window {
    ipc: RendererProcessIpc;
    functions: {
      convertToFileUrl(url: string): url.URL;
    };
    applicationStore: {
      settings: {
        get(key: string): any;
      };
    };
  }
}

window.ipc = ipcRenderer;
window.functions = {
  convertToFileUrl: url.pathToFileURL
};

/*contextBridge.exposeInMainWorld(
  'ipc', ipcRenderer
);

contextBridge.exposeInMainWorld(
  'functions', {
    convertToFileUrl(baseURL: string): url.URL {
      return url.pathToFileURL(baseURL);
    }
  }
);*/
