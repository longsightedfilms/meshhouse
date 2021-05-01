import recursive from 'recursive-readdir';
import fs from 'fs';
import { filterByModels } from '../integrations/functions';

const fsAsync = fs.promises;

/**
 * Returns all files in folder recursively
 * @param path
 */
export async function recursiveIndexFolder(path: string): Promise<any> {
  return await recursive(path, [filterByModels]);
}

export async function batchDeleteFiles(files: string[]): Promise<void | Error> {
  try {
    const promises = files.map((file) => {
      return fsAsync.unlink(file);
    });

    await Promise.all(promises);

    Promise.resolve();
  } catch (error) {
    Promise.reject(new Error(error));
  }
}
