import { withLanguage } from '../localize.js'

const DEFAULT_LOCALE = 'uk'

export const withLocalization = () => {
  /** @param {import('telegraf').Context} context */
  return async (context, next) => {
    context.state.localize = withLanguage(DEFAULT_LOCALE)
    return next()
  }
}
