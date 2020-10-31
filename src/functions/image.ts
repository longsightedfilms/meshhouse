/**
 * Returns sanitized URL if image is local file
 * @param image path to image
 */
export function getLocalLink(image: string): string {
  const local = image.search(/^https?:\/\//gm) === -1;

  const imageURL = window.functions.convertToFileUrl(image).pathname;

  return local ? `local://${imageURL}` : image;
}

export function hexToRgb(hex: string): ColorRGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function colorContrast(hex: string): string {
  const color = hexToRgb(hex);
  if (color !== null) {
    const contrast = (Math.round(color.r * 299) + Math.round(color.g * 587) + Math.round(color.b * 114)) / 1000;
    return (contrast >= 128) ? 'text--black' : 'text--white';
  } else {
    return 'text--white';
  }
}
