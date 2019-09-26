import Vue from 'vue'
import { IExtension, IDatabase } from './interfaces'

declare module 'vue/types/vue' {
    interface Vue {
        $settingsGet(setting: string): string,
        $settingsSet(setting: string[]): void,
        $dccSet(setting: any): void,
        $dccGetConfig(): object,
        $dccSetConfig(config: object): void,
        $stringToSlug(str: string): string,
        $addDatabase(db: IDatabase): void,
        $editDatabase(database: string, setting: string, value: string): void,
        $indexFolderRecursive(folder: string): Promise<any>,
        $openItem(file: string): void,
        $openFolder(folder: string): void
    }
}