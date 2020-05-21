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
type Extension = {
  [properties: string]: {
    title: string;
    icon: string;
  };
}

type Model = {
  id: number;
  name: string;
  extension: string;
  path: string;
  category: string;
  size?: number;
  image: string;
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

type ImageProperties = {
  imageChanged: boolean;
  name: string;
  category: string;
  image: string;
  extension: string;
  path: string;
}

type ColorRGB = {
  r: number;
  g: number;
  b: number;
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
