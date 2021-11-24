import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import uniqid from 'uniqid';
import { app } from 'electron';
import logger from '../logger';

/**
 * Creates background image 2560x400px and saves to userData folder
 * @param item model
 * @param image original image path
 */
export async function generateBackgroundImage(item: DatabaseItem, image: string): Promise<ImageProcessorOutput> {
  const imageFolder = path.join(app.getPath('userData'),
    '\\imagecache\\',
    '\\backgrounds\\'
  );
  const imagePath = path.join(imageFolder, `${item.url}.webp`);

  try {
    if(!fs.existsSync(imageFolder)) {
      fs.mkdirSync(imageFolder, 0x777);
    }

    if(fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    logger.info(`Creating thumbnail image 2560x400 from file ${image}`);
    await sharp(image)
      .resize(2560, 400)
      .webp({
        quality: 99,
        smartSubsample: true,
        reductionEffort: 6,
        force: true
      })
      .toFile(imagePath);
    logger.info('Thumbnail image has been created');
    return Promise.resolve({
      status: 'completed',
      imgPath: imagePath
    });
  } catch (err) {
    logger.error(new Error(err));
    return Promise.reject(err);
  }
}

/**
 * Creates background image 640x905px and saves to userData folder
 * @param item model
 * @param image original image path
 */
export async function generateBackgroundTallImage(item: DatabaseItem, image: string): Promise<ImageProcessorOutput> {
  const imageFolder = path.join(app.getPath('userData'),
    '\\imagecache\\',
    '\\backgrounds\\',
    '\\tall\\'
  );
  const imagePath = path.join(imageFolder, `${item.url}.webp`);

  try {
    if(!fs.existsSync(imageFolder)) {
      fs.mkdirSync(imageFolder, 0x777);
    }

    if(fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    logger.info(`Creating thumbnail image 640x905 from file ${image}`);
    await sharp(image)
      .resize(640, 905)
      .webp({
        quality: 99,
        smartSubsample: true,
        reductionEffort: 6,
        force: true
      })
      .toFile(imagePath);
    logger.info('Thumbnail image has been created');
    return Promise.resolve({
      status: 'completed',
      imgPath: imagePath
    });
  } catch (err) {
    logger.error(new Error(err));
    return Promise.reject(err);
  }
}

/**
 * Creates thumbnail image 1024x2014px and saves to userData folder
 * @param item model properties
 * @param image original image path
 */
export async function generateThumbnailImage(item: ImageProperties, image: string): Promise<ImageProcessorOutput> {
  const imageFolder = path.join(app.getPath('userData'),
    '\\imagecache\\'
  );
  const imageName = uniqid('image-') + '.webp';
  let imagePath = '';

  if (item.imageChanged === true && item.image !== '') {
    const image = path.parse(item.image);
    image.ext = '.webp';
    imagePath = path.join(image.dir, image.name) + image.ext;
  } else {
    imagePath = path.join(app.getPath('userData'), '\\imagecache\\', imageName);
  }

  try {
    if(!fs.existsSync(imageFolder)) {
      fs.mkdirSync(imageFolder, 0x777);
    }

    if(fs.existsSync(item.image)) {
      fs.unlinkSync(item.image);
    }

    logger.info(`Creating thumbnail image 1024x1024 from file ${image}`);
    await sharp(image)
      .resize(1024, 1024)
      .webp({
        quality: 85,
        smartSubsample: true,
        reductionEffort: 6,
        force: true
      })
      .toFile(imagePath);
    logger.info('Thumbnail image has been created');
    return Promise.resolve({
      status: 'completed',
      imgPath: imagePath
    });
  } catch (err) {
    logger.error(new Error(err));
    return Promise.reject(err);
  }
}
