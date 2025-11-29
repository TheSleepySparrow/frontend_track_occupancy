import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

export const i18n = createI18n({
    legacy: false,
    locale: 'en-US',
    fallbackLocale: 'ru-RU',
    messages,
    missing(locale, key) {
      console.warn(`Missing translation for key "${key}" in locale "${locale}"`)
      return key
    }
  })

export default defineBoot(({ app }) => {
  app.use(i18n)
})