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

contextBridge.exposeInMainWorld(
  'ipc', {
    answerMain: ipcRenderer.answerMain,
    callMain: ipcRenderer.callMain,
    on: ipcRenderer.on,
    invoke: ipcRenderer.invoke,
    send: ipcRenderer.send,
    sendSync: ipcRenderer.sendSync,
    removeAllListeners: ipcRenderer.removeAllListeners
  }
);

contextBridge.exposeInMainWorld(
  'functions', {
    convertToFileUrl(baseURL: string): string {
      return url.pathToFileURL(baseURL).pathname;
    }
  }
);
