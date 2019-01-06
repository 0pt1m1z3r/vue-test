import VueI18n from 'vue-i18n'

export interface II18nService {
  i18n: VueI18n
  setInstance (i18n: VueI18n): void
  t (key: VueI18n.Path, values?: VueI18n.Values): VueI18n.TranslateResult
  loadLanguageAsync (lang: string): Promise<void>
}
