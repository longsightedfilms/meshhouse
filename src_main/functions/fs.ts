import recursive from 'recursive-readdir';
import { filterByModels } from '../integrations/functions';

/**
 * Returns all files in folder recursively
 * @param path
 */
export async function recursiveIndexFolder(path: string): Promise<any> {
  return await recursive(path, [filterByModels]);
}
