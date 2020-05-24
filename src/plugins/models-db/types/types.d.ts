type ApplicationStore = {
  controls: ControlsState;
  db: DatabaseState;
  downloads: Download[];
}

type ControlsState = {
  filters: Filters;
  categoriesVisible: boolean;
  databasesVisible: boolean;
  imageRandomizer: number;
  isLoaded: boolean;
  lastPage: 'main' | 'lastCatalog';
  properties: ImageProperties;
  thumbnailSize: string | number;
  theme: string;
  updates: {
    downloading: boolean;
    downloaded: boolean;
  };
}

type DatabaseState = {
  databases: DatabaseItem[];
  categories: Category[];
  loadedData: Model[] | Model;
}

type Filters = {
  order: string;
    where: {
      [key: string]: any;
      category: string;
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

type DatabaseItem =  {
  title: string;
  color: string;
  icon?: string;
  url: string;
  path: string | undefined;
  count?: string | number;
  localDB: boolean;
  totalsize?: string | number;
  disabled: boolean;
}

// Common types

type Extension = {
  [properties: string]: {
    title: string;
    icon: string;
  };
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
  category: string;
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
