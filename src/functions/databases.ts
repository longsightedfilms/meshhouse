import { ipcRenderer } from 'electron';

export const integrationsList: string[] = [
  'meshhouse',
  'sfmlab',
  'smutbase',
  'open3dlab'
];
/**
 * List of integration, where license field are exists
 */
export const integrationsWithLicenseField: string[] = [
  'sfmlab',
  'smutbase',
  'open3dlab'
];

export function isDownloadLink(link: SFMLabLink[] | Error): link is SFMLabLink[] {
  return (link as SFMLabLink[]).length !== undefined;
}

export function isDBModel(model: Model[] | Error): model is Model[] {
  return (model as Model[]).length !== undefined;
}

export function findDatabaseIndex(url: string): number {
  const db = ipcRenderer.sendSync('get-database', 'databases.local');
  return db.findIndex((db: DatabaseItem) => db.url === url);
}

export function isDatabaseRemote(url: string): boolean {
  return integrationsList.findIndex((value: string) => value === url) !== -1;
}
