import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    /**
     * Returns if current locale are Right-to-Left writing
     */
    $isRTL(): boolean;
    $stringToSlug(str: string): string;
    $returnHumanLikeExtension(extension: string): string;
    $forceReloadImage(image: string): string;
    $addDatabase(db: DatabaseItem): Promise<void>;
    $editDatabase(
      index: number,
      payload: DatabaseItem,
    ): Promise<boolean>;
    $updateItemInDatabase(
      dbName: string,
      model?: Model
    ): Promise<string | boolean>;
    $setIntegrationsDB(payload: any): void;
    $deleteDatabase(database: string): Promise<boolean>;
    $openItem(file: string): void;
    $openFolder(folder: string): void;
    $openPropertiesModal(model: Model): Promise<boolean>;
    $formatSize(size: number): string;
    /**
     * Returns clean HTML, safe for interpolation
     * @param html HTML string
     */
    $sanitizeHTML(html: string): string;
    /**
     * Format date using date-fns package
     * @param timestamp Timestamp
     */
    $formatDateRelative(timestamp: number): string;
    /**
     * Toggle all catalogs sidebar
     */
    $toggleSidebar(): void;
    /**
     * Closes all catalogs sidebar
     */
    $closeSidebar(): void;
  }
}
