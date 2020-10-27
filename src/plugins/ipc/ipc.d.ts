import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    /**
     * Sends async message to main process
     */
    $ipcInvoke(channel: string, args?: any): Promise<any>;
    /**
     * Sends sync message to main process
     */
    $ipcSendSync(channel: string, args?: any): any;
  }
}
