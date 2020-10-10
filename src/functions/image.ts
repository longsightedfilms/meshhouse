import url from 'url';

/**
 * Returns sanitized URL if image is local file
 * @param image path to image
 */
export function getLocalLink(image: string): string {
  const local = image.search(/^https?:\/\//gm) === -1;

  const imageURL = url.pathToFileURL(image).pathname;

  return local ? `local://${imageURL}` : image;
}
