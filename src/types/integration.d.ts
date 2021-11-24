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

type IntegrationFetch = Model[] | SFMLabFetch

type SFMLabLicense = {
  id: number | string;
  name: string;
}

type SFMLabFetch = {
  models: RemoteModel[];
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
  };
}

type SFMLabLink = {
  link: string;
  filename: string;
}

type SFMLabParams = {
  adult_content?: 'included' | 'excluded' | 'only';
  page?: number;
  limit?: number;
  search?: string;
}

type ModelComment = {
  username: string;
  avatar: string;
  message: string;
  date: number;
}
