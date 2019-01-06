import Vue from 'vue'
import VueRouter from 'vue-router' // for this.$router in components
import VueI18n from 'vue-i18n'
import { Container } from '~/ioc'
import { I18nServiceToken, STORAGE_LOCALE, pluralizationRuleRu } from '~/services/i18n'

Vue.use(VueI18n)

const i18nService = Container.get(I18nServiceToken)

export default async ({ app }) => {
  const i18n = new VueI18n({
    locale: localStorage.getItem(STORAGE_LOCALE) || '',
    fallbackLocale: 'ru',
    messages: {},
    pluralizationRules: {
      'ru': pluralizationRuleRu
    }
  })
  app.i18n = i18n
  i18nService.setInstance(app.i18n)
}
