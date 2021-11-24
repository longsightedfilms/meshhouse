type SettingsStore = Settings;

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

type DatabasesState = {
  local: DatabaseItem[];
  integrations: any;
}

type Theme = 'system' | 'light' | 'dark'
