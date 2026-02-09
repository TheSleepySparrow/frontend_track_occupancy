import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import { useGlobalState } from 'src/composables/GlobalState'

const { globalState } = useGlobalState()

const i18n = createI18n({
  legacy: false,
  locale: globalState.value.language,
  fallbackLocale: 'en-US',
  messages,
  missing(locale, key) {
    console.warn(`Missing translation for key "${key}" in locale "${locale}"`)
    return key
  },
})

export default defineBoot(({ app }) => {
  app.use(i18n)
})

export { i18n }
