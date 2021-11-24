type Extension = {
  [properties: string]: ExtensionProperty;
}

type ExtensionProperty = {
  title: string;
  icon: string;
}

type Language = {
  text: string;
  value: string;
}

type QueryFilters = {
  order: string;
  where: {
    category: string;
    extension: string;
    name: string;
    path: string;
  };
}

type ColorRGB = {
  r: number;
  g: number;
  b: number;
}

type ProgressInfo = {
  bytesPerSecond: number;
  percent: number;
  total: number;
  transferred: number;
}

type VueColor = {
  hsl: string;
  hex: string;
  hex8: string;
  rgba: string;
  hsv: string;
  oldHue: string;
  source: string;
  a: string;
}

type VueToggleChangeEvent = {
  value: boolean;
  tag: string;
  srcEvent: InputEvent;
}

type ApplicationNotification = {
  type: 'normal' | 'error';
  message: string;
}
