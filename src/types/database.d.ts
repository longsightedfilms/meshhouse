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
