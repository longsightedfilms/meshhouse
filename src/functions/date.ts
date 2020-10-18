import { i18n } from '@/locales/i18n';
import { formatRelative } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';

const locales: any = { enUS, ru };

function mapLocateToFNS(locale: string): string {
  if (locale === 'en') {
    return 'enUS';
  }
  return locale;
}

export function formatDateRelative(timestamp: number): string {
  const timestampDate = new Date(timestamp);
  const date = new Date();
  return formatRelative(timestampDate, date, {
    locale: locales[mapLocateToFNS(i18n.locale)]
  });
}
