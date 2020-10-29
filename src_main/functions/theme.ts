import type { VibrancyOptions } from 'electron-acrylic-window';

/**
 * Created default vibrancy options, that matched Windows 10 Fluent Design interface
 * @param theme application theme - light, dark or system
 */
export function getVibrancyOptions(theme: string): VibrancyOptions {
  const acrylicColor = theme !== 'system'
    ? (theme === 'light' ? '#e5e5e5aa' : '#222424aa')
    : 'appearance-based';

  const vibrancyOptions: VibrancyOptions = {
    theme: (acrylicColor as 'light'),
    effect: 'acrylic',
    useCustomWindowRefreshMethod: true,
    maximumRefreshRate: 60,
    disableOnBlur: false
  };

  return vibrancyOptions;
}
