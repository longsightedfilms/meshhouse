export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) {
    return '0 B';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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
