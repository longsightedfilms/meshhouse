/* eslint-disable @typescript-eslint/no-explicit-any */
type ApplicationStore = {
  controls: ControlsState;
  db: DatabaseState;
  devices: DevicesState;
  downloads: Download[];
  notifications: ApplicationNotification[];
  settings: SettingsState;
}

type ControlsState = {
  filters: Filters;
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

type Theme = 'system' | 'light' | 'dark'

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

type Filters = {
  order: string;
    where: {
      [key: string]: any;
      category: string | number;
      extension: string;
      name: string;
      path: string;
    };
}

type FilterPayload = {
  field: string;
  value: string | number | boolean | object;
}

type Download = {
  img: string;
  title: string;
  path: string;
  totalSize: number;
  downloadedSize: number;
  startedAt: number;
  id: string;
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

type ApplicationNotification = {
  type: 'normal' | 'error';
  message: string;
}

// Database

type DatatableHeader = {
  text: string;
  align?: string;
  width?: string | number;
  value: string;
}

type DatabaseItem = {
  title: string;
  color: string;
  icon?: string;
  background: string;
  backgroundTall?: string;
  url: string;
  path?: string | null;
  count?: string | number;
  localDB: boolean;
  totalsize?: string | number;
  disabled: boolean;
}

type DatabaseUpdateInformation = {
  count: number;
  totalSize: number;
}

// Common types

type Extension = {
  [properties: string]: ExtensionProperty;
}

type ExtensionProperty = {
  title: string;
  icon: string;
}

type Language = {
  text: string;
  value: string;
}

type QueryFilters = {
  order: string;
  where: {
    category: string;
    extension: string;
    name: string;
    path: string;
  };
}

type ColorRGB = {
  r: number;
  g: number;
  b: number;
}

type ProgressInfo = {
  bytesPerSecond: number;
  percent: number;
  total: number;
  transferred: number;
}

// Model

type Model = {
  id: number;
  remoteId?: number;
  name: string;
  extension: string;
  folderPath?: string;
  path: string;
  category: string | null;
  size?: number;
  image: string;
  images?: string[];
  installed?: boolean;
  mature_content?: boolean;
  downloadLinks?: SFMLabLink[];
  comments?: ModelComment[];
}

type ImageProperties = Model & { imageChanged: boolean }

type Category = {
  id: number;
  parentId: number;
  slug: string;
  name: string;
}

// Integration types

type QueryParameters = {
  category: number | string;
  extension: string;
  name: string;
  path: string;
}

type Integrations = {
  [key: string]: any;
}

type PossibleIntegrations = any;

type ModelsTablePragma = {
  id: number;
  name: string;
  extension: string;
  path: string;
  category?: string | number;
  size: number;
  image: string;
}

// Settings

type SettingsState = Settings;

type StoreSettings = {
  [key: string]: any;
}

type MigrationSchema = {
  __internal__: {
		migrations: {
			version: string;
		};
	};
}

type DCCSetting = {
  useSystemAssociation: boolean;
  customPath: string;
}

type Settings = {
  language: string;
  applicationWindow: {
    width: number;
    height: number;
    lastOpened: string;
  };
  thumbnailSize: number;
  databasesVisible: boolean;
  theme: string;
  systemDarkTheme: boolean;
  lastPage: 'main' | 'lastCatalog' | string;
  categoriesVisible: boolean;
  hideIntegrations: boolean;
  integrations: {
    proxy: {
      customProxy: boolean;
      url: string;
    };
    sfmlab: {
      showMatureContent: boolean;
    };
  };
}

type ApplicationSettings = {
  [key: string]: Settings | any;
}

type DCCSettings = {
  [key: string]: DCCSetting | MigrationSchema | any;
}

type DatabaseSettings = {
  [key: string]: any;
  databases: {
    local: DatabaseItem[];
    integrations: any;
  };
}


type VueColor = {
  hsl: string;
  hex: string;
  hex8: string;
  rgba: string;
  hsv: string;
  oldHue: string;
  source: string;
  a: string;
}

type VueToggleChangeEvent = {
  value: boolean;
  tag: string;
  srcEvent: InputEvent;
}

type IntegrationFetch = Model[] | SFMLabFetch

// Integrations types
type SFMLabLicense = {
  id: number | string;
  name: string;
}

type SFMLabFetch = {
  models: Model[];
  categories: Category[];
  licenses: SFMLabLicense[];
  totalPages: number;
}

type SFMLabLink = {
  link: string;
  filename: string;
}

type SFMLabParams = {
  category?: string;
  order_by?: string;
  license?: number;
  search_text?: string;
  page?: number;
}

type ModelComment = {
  username: string;
  avatar: string;
  message: string;
  date: number;
}
