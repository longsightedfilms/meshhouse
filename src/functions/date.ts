import { i18n } from '@/locales/i18n';
import { formatRelative, intlFormat } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import type { Locale } from 'date-fns';

const locales: Record<string, Locale> = { enUS, ru };

function mapLocateToFNS(locale: string): string {
  if (locale === 'en') {
    return 'enUS';
  }
  return locale;
}

export function formatDateRelative(timestamp: number): string {
  try {
    let timestampDate: Date;
    if (timestamp === undefined) {
      timestampDate = new Date(0);
    } else {
      timestampDate = new Date(timestamp);
    }

    const date = new Date();
    return formatRelative(timestampDate, date, {
      locale: locales[mapLocateToFNS(i18n.locale)]
    });
  } catch (error) {
    return 'unknown';
  }

}

export function formatDate(timestamp: string | number): string {
  return intlFormat(new Date(timestamp));
}
