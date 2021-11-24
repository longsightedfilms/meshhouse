import { INTEGRATIONS } from '@/constants';

export function isDownloadLink(link: SFMLabLink[] | Error): link is SFMLabLink[] {
  return (link as SFMLabLink[]).length !== undefined;
}

export function isDBModel(model: Model[] | Error): model is Model[] {
  return (model as Model[]).length !== undefined;
}

export function findDatabaseIndex(url: string): number {
  const db = window.ipc.sendSync('get-database', 'databases.local');
  return db.findIndex((db: DatabaseItem) => db.url === url);
}

export function isDatabaseRemote(url: string): boolean {
  return INTEGRATIONS.includes(url);
}
