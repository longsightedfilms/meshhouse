export interface DatatableHeader {
  text: string;
  align?: string;
  width?: string | number;
  value: string;
}
export interface DatabaseItem {
  title: string;
  color: string;
  icon?: string;
  url: string;
  path: string | undefined;
  count?: string | number;
  totalsize?: string | number;
  disabled: boolean;
}
export interface Extension {
  [properties: string]: {
    title: string;
    icon: '*.svg';
  };
}
export interface Model {
  id: number;
  name: string;
  extension: string;
  path: string;
  category: string;
  size: string;
  image: string;
}
export interface Language {
  text: string;
  value: string;
}
export interface EditProperties {
  category: string;
  extension: string;
  name: string;
  image: string;
  imageChanged: boolean;
  path: string;
}

export interface QueryFilters {
  order: string;
  where: {
    category: string;
    extension: string;
    name: string;
    path: string;
  };
}
