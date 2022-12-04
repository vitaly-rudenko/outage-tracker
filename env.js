import { config } from 'dotenv'

if (process.env.USE_NATIVE_ENV !== 'true') {
  console.log('Using .env file')
  config()
}

export const useWebhooks = process.env.USE_WEBHOOKS === 'true'
export const domain = requireIf(process.env.DOMAIN, useWebhooks)
export const debugChatId = require(process.env.DEBUG_CHAT_ID)
export const telegramBotToken = require(process.env.TELEGRAM_BOT_TOKEN)
export const chatId = require(process.env.TELEGRAM_CHAT_ID)
export const username = require(process.env.MI_CLOUD_USERNAME)
export const password = require(process.env.MI_CLOUD_PASSWORD)
export const country = require(process.env.MI_CLOUD_COUNTRY)
export const databaseUrl = require(process.env.DATABASE_URL)
export const logLevel = process.env.LOG_LEVEL || 'info'

function require(value) {
  if (!value) throw new Error('Env is not provided')
  return value
}

function requireIf(value, boolean) {
  if (!value && boolean) throw new Error('Env is not provided')
  return value
}
