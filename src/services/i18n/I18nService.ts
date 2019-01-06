import VueI18n from 'vue-i18n'
import { Service, Token } from '~/ioc'
import { II18nService } from './II18nService'

export const STORAGE_LOCALE = 'i18n/locale'

export const I18nServiceToken = new Token<II18nService>()

// сервис для работы с мультиязычностью
@Service(I18nServiceToken)
export class I18nService implements II18nService {
  protected instance!: VueI18n
  protected loadedLanguages: { [key: string]: Promise<any> } = {}

  supported: string[] = ['ru']

  get i18n (): VueI18n {
    return this.instance
  }

  setInstance (i18n: VueI18n): void {
    this.instance = i18n
  }

  t (key: VueI18n.Path, values?: VueI18n.Values): VueI18n.TranslateResult {
    return this.instance.t(key, values)
  }

  async loadLanguageAsync (lang: string): Promise<void> {
    lang = lang || this.instance.locale
    if (!this.supported.includes(lang)) {
      lang = this.instance.fallbackLocale
    }
    if (!this.loadedLanguages[lang]) {
      this.loadedLanguages[lang] = import(/* webpackChunkName: "lang-[request]" */ `~/locales/${lang}`)
    }
    try {
      const msgs = await this.loadedLanguages[lang]
      this.instance.setLocaleMessage(lang, msgs.default)
      if (this.instance.locale !== lang) {
        this.setI18nLanguage(lang)
      }
    } catch (e) {
      console.error(e)
    }
  }

  protected setI18nLanguage (lang: string): void {
    this.instance.locale = lang
    // axios.defaults.headers.common['Accept-Language'] = lang
    // document.querySelector('html').setAttribute('lang', lang)
  }
}
