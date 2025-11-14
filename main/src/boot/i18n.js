import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

export default defineBoot(({ app }) => {
  const i18n = createI18n({
    locale: 'en-US',
    fallbackLocale: 'ru-RU',
    messages,
    missing(locale, key) {
      console.warn(`Missing translation for key "${key}" in locale "${locale}"`)
      return key
    }
  })
  
  app.use(i18n)
})