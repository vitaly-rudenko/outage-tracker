import { config } from 'dotenv'

if (process.env.USE_NATIVE_ENV !== 'true') {
  console.log('Using .env file')
  config()
}

export const useWebhooks = process.env.USE_WEBHOOKS === 'true'
export const domain = requireIf(process.env.DOMAIN, useWebhooks)
export const debugChatId = require(process.env.DEBUG_CHAT_ID)
export const adminUserId = require(process.env.ADMIN_USER_ID)
export const allowCommandsToAdminOnly = process.env.ALLOW_COMMANDS_TO_ADMIN_ONLY === 'true'
export const telegramBotToken = require(process.env.TELEGRAM_BOT_TOKEN)
export const reportChatId = require(process.env.REPORT_CHAT_ID)
export const tpLinkUsername = require(process.env.TP_LINK_USERNAME)
export const tpLinkPassword = require(process.env.TP_LINK_PASSWORD)
export const tpLinkTerminalId = process.env.TP_LINK_TERMINAL_ID || 'my-outage-tracker-bot'
export const databaseUrl = require(process.env.DATABASE_URL)
export const checkStatusJobIntervalMs = process.env.CHECK_STATUS_JOB_INTERVAL_MS
  ? Number(process.env.CHECK_STATUS_JOB_INTERVAL_MS) : 5 * 60_000
export const retryAttempts = process.env.RETRY_ATTEMPTS
  ? Number(process.env.RETRY_ATTEMPTS) : 10
export const retryMs = process.env.RETRY_MS
  ? Number(process.env.RETRY_MS) : 30_000
export const notificationSoundDelayMs = process.env.NOTIFICATION_SOUND_DELAY_MS
  ? Number(process.env.NOTIFICATION_SOUND_DELAY_MS) : 60 * 60_000
export const timezoneOffsetMinutes = process.env.TIMEZONE_OFFSET_MINUTES
  ? Number(process.env.TIMEZONE_OFFSET_MINUTES) : -120
export const logLevel = process.env.LOG_LEVEL || 'info'

function require(value) {
  if (!value) throw new Error('Env is not provided')
  return value
}

function requireIf(value, boolean) {
  if (!value && boolean) throw new Error('Env is not provided')
  return value
}
