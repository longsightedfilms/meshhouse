import {
  integrationsList,
  integrationsWithLicenseField
} from '@/functions/databases';

/**
 * Returns if license dropdown need to show in current integration
 * @param databaseURL database URL
 */
export function showLicenseField(databaseURL: string): boolean {
  return integrationsWithLicenseField.findIndex((value: string) => value === databaseURL) !== -1;
}
