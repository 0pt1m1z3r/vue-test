import { Container } from '~/ioc'
import { I18nServiceToken } from '~/services/i18n'

export default function ({ route }) {
  return Container.get(I18nServiceToken).loadLanguageAsync(route.params.lang)
}
