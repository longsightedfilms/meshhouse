/* eslint-disable prefer-rest-params */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from '@/locales/messages'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
})


const defaultImpl = VueI18n.prototype.getChoiceIndex

/**
 * @param choice {number} a choice index given by the input to $tc: `$tc('path.to.rule', choiceIndex)`
 * @param choicesLength {number} an overall amount of available choices
 * @returns a final choice index to select plural word by
**/

VueI18n.prototype.getChoiceIndex = function (choice, choicesLength): number {
  if (this.locale !== 'ru') {
    return defaultImpl.apply(this, (arguments as any))
  }

  if (choice === 0) {
    return 0;
  }

  const teen = choice > 10 && choice < 20;
  const endsWithOne = choice % 10 === 1;

  if (!teen && endsWithOne) {
    return 1;
  }

  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2;
  }

  return (choicesLength < 4) ? 2 : 3;
}
