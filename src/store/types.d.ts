/* eslint-disable @typescript-eslint/no-explicit-any */
type ApplicationStore = {
  controls: ControlsState;
  db: DatabaseState;
  devices: DevicesState;
  filters: FiltersState;
  downloads: Download[];
  notifications: ApplicationNotification[];
  settings: SettingsState;
}

type ControlsState = {
  fullscreen: boolean;
  categoriesVisible: boolean;
  databasesVisible: boolean;
  hideIntegrations: boolean;
  minimalisticHeaders: boolean;
  imageRandomizer: number;
  isOffline: boolean;
  isLoaded: boolean;
  isModalVisible: boolean;
  lastPage: 'main' | 'lastCatalog';
  properties: ImageProperties;
  thumbnailSize: string | number;
  theme: Theme;
  title: string;
  downloadLinks: SFMLabLink[];
  updates: {
    downloading: boolean;
    downloaded: boolean;
  };
}
type DatabaseState = {
  databases: {
    local: DatabaseItem[];
    integrations: any;
  };
  categories: Category[];
  loadedData: Model[] | Model;
  licenses: SFMLabLicense[];
  currentDB: DatabaseItem | undefined;
}

type DownloadState = {
  started: boolean;
  completed: boolean;
  items: Download[];
}

type DevicesState = {
  currentDevice: Device;
  devices: Device[];
}

type Device = {
  model: string;
  os: string;
  hostname: string;
  uuid: string;
  status?: boolean;
}

/**
 * @module filters
 */
type FiltersState = {
  [key: string]: any;
  order: 'ASC' | 'DESC';
  search: string;
  category: number;
  extension: string;
}
/**
 * @module filters
 */
type FilterPayload = {
  field: string;
  value: string | number | boolean | object | 'ASC' | 'DESC';
}
