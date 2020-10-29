import fs from 'fs';
import path from 'path';
import sanitize from 'sanitize-filename';
import sevenBin from '7zip-bin';
import Seven from 'node-7z';
import { databases } from '../electron-store';
import unrar from '@zhangfuxing/unrar';
import { sendVuexCommit } from '../ipc_handlers/eventbus';
import logger from '../logger';

const sevenExtensions = ['.7z', '.xz', '.lzma', '.cab', '.zip', '.gzip', '.bzip2', '.tar', '.tar.gz'];

/**
 * Unpacks file or writes as is if is not an archive
 * @param blob file
 * @param item model
 * @param filename file name
 * @param databaseURL database URL or slug
 */
export async function installFile(
  blob: Buffer,
  item: Model,
  filename: string,
  databaseURL: string
): Promise<boolean | Error> {
  logger.info(`File ${filename} waiting for install`);
  const tmpPath = path.join(databases.get(`databases.integrations.${databaseURL}`).path, '.meshhouse_temp');
  const tmpFile = path.join(tmpPath, sanitize(filename));

  const extension = path.extname(filename);

  // Check if temp folder exists
  if (!fs.existsSync(tmpPath)) {
    fs.mkdirSync(tmpPath);
  }

  // Write archive to temp directory
  if(!fs.existsSync(tmpFile)) {
    fs.writeFileSync(tmpFile, blob);
  }

  sendVuexCommit('setLoadingStatus', false);

  const pathTo7zip = sevenBin.path7za;
  const outputPath = path.join(databases.get(`databases.integrations.${databaseURL}`).path, sanitize(item.name));

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }

  if (extension === '.rar') {
    try {
      logger.info(`Unpacking file ${filename}`);
      await unrar.uncompress({
        src: tmpFile,
        dest: outputPath,
        switches: [
          '-o+'
        ]
      });

      sendVuexCommit('setLoadingStatus', false);

      fs.rmdirSync(tmpPath, { recursive: true });
      logger.info(`File ${filename} has been installed`);
      return Promise.resolve(true);
    } catch(e) {
      sendVuexCommit('setLoadingStatus', false);

      return Promise.reject(e);
    }
  }

  if (sevenExtensions.findIndex((ext: string) => ext === extension) !== -1) {
    logger.info(`Unpacking file ${filename}`);
    return (Seven as any).extractFull(tmpFile, outputPath, {
      recursive: true,
      $bin: pathTo7zip,
    }).on('end', () => {
      logger.info(`File ${filename} has been installed`);
      sendVuexCommit('setLoadingStatus', false);

      fs.rmdirSync(tmpPath, { recursive: true });
      return Promise.resolve(true);
    }).on('error', (err: string) => {
      logger.error(new Error(err));
      sendVuexCommit('setLoadingStatus', false);

      return Promise.reject(new Error(err));
    });
  } else {
    const output = path.join(databases.get(`databases.integrations.${databaseURL}`).path, sanitize(item.name), sanitize(filename));
    fs.writeFileSync(output, new Uint8Array(blob));

    sendVuexCommit('setLoadingStatus', false);
    logger.info(`File ${filename} has been installed`);
    fs.rmdirSync(tmpPath, { recursive: true });
    return Promise.resolve(true);
  }
}
