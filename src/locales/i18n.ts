/* eslint-disable prefer-rest-params */
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import messages from '@/locales/messages';
import { configure } from 'vee-validate';

Vue.use(VueI18n);

export const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  pluralizationRules: {
    'ru': function(choice, choicesLength): number {
      // this === VueI18n instance, so the locale property also exists here

      if (choice === 0) {
        return 0;
      }

      const teen = choice > 10 && choice < 20;
      const endsWithOne = choice % 10 === 1;

      if (choicesLength < 4) {
        return (!teen && endsWithOne) ? 1 : 2;
      }
      if (!teen && endsWithOne) {
        return 1;
      }
      if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
        return 2;
      }

      return (choicesLength < 4) ? 2 : 3;
    }
  }
});

configure({
  defaultMessage: (field: string, values: any): string => {
    values._field_ = i18n.t(`fields.${field}`);
    return i18n.t(`validations.messages.${values._rule_}`, values).toString();
  }
});
