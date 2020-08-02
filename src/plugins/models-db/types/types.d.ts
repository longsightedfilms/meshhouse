/* eslint-disable @typescript-eslint/no-explicit-any */
type ApplicationStore = {
  controls: ControlsState;
  db: DatabaseState;
  downloads: Download[];
}

type ControlsState = {
  filters: Filters;
  fullscreen: boolean;
  categoriesVisible: boolean;
  databasesVisible: boolean;
  hideIntegrations: boolean;
  imageRandomizer: number;
  isLoaded: boolean;
  lastPage: 'main' | 'lastCatalog';
  properties: ImageProperties;
  thumbnailSize: string | number;
  theme: Theme;
  updates: {
    downloading: boolean;
    downloaded: boolean;
  };
}

type Theme = 'system' | 'light' | 'dark'

type DatabaseState = {
  databases: DatabaseItem[];
  categories: Category[];
  loadedData: Model[] | Model;
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
  name: string;
  extension: string;
  path: string;
  category: string | null;
  size?: number;
  image: string;
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
  lastPage: 'main' | 'lastCatalog' | string;
  categoriesVisible: boolean;
  hideIntegrations: boolean;
}

type ApplicationSettings = {
  [key: string]: Settings | any;
}

type DCCSettings = {
  [key: string]: DCCSetting | MigrationSchema | any;
}

type DatabaseSettings = {
  [key: string]: any;
  databases: DatabaseItem[];
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
