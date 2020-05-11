import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $settingsGet(setting: string): string;
    $settingsSet(key: string, value: string | number | boolean): void;
    $dccGetConfig(): object;
    $dccSetConfig(config: object): void;
    $stringToSlug(str: string): string;
    $returnHumanLikeExtension(extension: string): string;
    $forceReloadImage(image: string): string;
    $addDatabase(db: DatabaseItem): Promise<void>;
    $reindexCatalog(db: DatabaseItem): Promise<void>;
    $editDatabase(
      database: string,
      setting: string,
      value: string
    ): Promise<boolean>;
    $updateItemInDatabase(
      dbName: string,
      model?: Model
    ): Promise<string | boolean>;
    $deleteDatabase(database: string): Promise<boolean>;
    $indexFolderRecursive(folder: string): Promise<string[]>;
    $openItem(file: string): void;
    $openFolder(folder: string): void;
    $openPropertiesModal(model: Model): Promise<boolean>;
  }
}
