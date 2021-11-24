/**
 * List of existed integration slugs
 */
export const integrationsList: string[] = [
  'meshhouse',
  'sfmlab',
  'smutbase',
  'open3dlab'
];

/**
 * Returns true if typeof SFMLabLink[]
 * @param link checked variable
 */
export function isDownloadLink(link: SFMLabLink[] | Error): link is SFMLabLink[] {
  return (link as SFMLabLink[]).length !== undefined;
}

/**
 * Returns true if typeof Model[]
 * @param model checked variable
 */
export function isDBModel(model: Model[] | Error): model is Model[] {
  return (model as Model[]).length !== undefined;
}
