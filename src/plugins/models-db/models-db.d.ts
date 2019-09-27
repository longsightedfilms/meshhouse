import Vue from 'vue'
import { Database, Model } from './interfaces'

declare module 'vue/types/vue' {
    interface Vue {
        $settingsGet(setting: string): string;
        $settingsSet(setting: string[]): void;
        $dccSet(setting: any): void;
        $dccGetConfig(): object;
        $dccSetConfig(config: object): void;
        $stringToSlug(str: string): string;
        $addDatabase(db: Database): void;
        $editDatabase(database: string, setting: string, value: string): Promise<boolean>;
        $deleteDatabase(database: string): Promise<boolean>;
        $indexFolderRecursive(folder: string): Promise<any>;
        $openItem(file: string): void;
        $openFolder(folder: string): void;
        $openPropertiesModal(model: Model): Promise<boolean>;
    }
}