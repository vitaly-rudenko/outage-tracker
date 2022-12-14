import fs from 'fs'
import path from 'path'
import { logger } from '../logger.js'

const cachedLocalizations = {}
function loadLocalization(name) {
  if (!cachedLocalizations[name]) {
    cachedLocalizations[name] = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'localization', `${name}.json`),
        { encoding: 'utf-8' }
      )
    )
  }

  return cachedLocalizations[name]
}

function getMessages(language) {
  return loadLocalization(language)
}

function get(key, language) {
  const path = key.split('.')

  let result = getMessages(language)
  while (result && path.length > 0) {
    result = result[path.shift()]
  }

  if (!result) {
    logger.warn(`Could not find localization key for "${key}"`)
  }

  return result ?? key
}

function localize(language, key, replacements) {
  let result = get(key, language)

  if (Array.isArray(result)) {
    result = result.map((item, index, array) => (
      item.endsWith('\\')
        ? item.slice(0, -1)
        : (index === array.length - 1) ? item : `${item}\n`
    )).join('')
  }

  if (replacements) {
    for (const [key, value] of Object.entries(replacements)) {
      result = result.replace(new RegExp('\\{' + key + '\\}', 'g'), value)
    }
  }

  return result
}

export function withLanguage(language) {
  return (key, replacements) => localize(language, key, replacements)
}
