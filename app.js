import { Telegraf } from 'telegraf'
import express from 'express'
import pg from 'pg'
import { logger } from './logger.js'
import {
  country,
  databaseUrl,
  debugChatId,
  domain,
  password,
  telegramBotToken,
  username,
  useWebhooks,
} from './env.js'
import { withLanguage } from './app/localize.js'
import { MiHomeStatusChecker } from './app/status/MiHomeStatusChecker.js'
import { StatusPostgresStorage } from './app/status/StatusPostgresStorage.js'
import { TelegramErrorLogger } from './app/telegram/TelegramErrorLogger.js'
import { versionCommand } from './app/telegram/flows/version.js'
import { withLocalization } from './app/telegram/withLocalization.js'
import { nowCommand } from './app/status/flows/now.js'
import { todayCommand, weekCommand } from './app/status/flows/stats.js'

async function start() {
  const localizeDefault = withLanguage('uk')

  logger.info({}, 'Connecting to Postgres')
  const pgClient = new pg.Client(databaseUrl)
  await pgClient.connect()

  const statusStorage = new StatusPostgresStorage(pgClient)
  const statusChecker = new MiHomeStatusChecker({
    country,
    password,
    username,
  })

  const bot = new Telegraf(telegramBotToken)
  const errorLogger = new TelegramErrorLogger({
    telegram: bot.telegram,
    debugChatId,
  })

  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
  process.on('unhandledRejection', (error) => {
    errorLogger.log(error)
  })

  if (!useWebhooks) {
    bot.use((context, next) => {
      logger.debug({ update: context.update }, 'Direct update received')
      return next()
    })
  }

  // --- COMMANDS

  bot.telegram.setMyCommands([
    { command: 'now', description: localizeDefault('commands.now') },
    { command: 'today', description: localizeDefault('commands.today') },
    { command: 'week', description: localizeDefault('commands.week') },
    { command: 'start', description: localizeDefault('commands.start') },
    { command: 'version', description: localizeDefault('commands.version') },
  ])

  bot.use(withLocalization())
  bot.command('version', versionCommand())
  bot.command('now', nowCommand({ bot, statusChecker, statusStorage }))
  bot.command('today', todayCommand({ bot, statusChecker, statusStorage }))
  bot.command('week', weekCommand({ bot, statusChecker, statusStorage }))
  bot.catch((error) => errorLogger.log(error))

  // --- HTTP API

  const app = express()
  app.use(express.json())

  const handledBotUpdates = new Set()

  app.post(`/bot${telegramBotToken}`, async (req, res, next) => {
    const updateId = req.body['update_id']
    if (!updateId) {
      logger.warn({ body: req.body }, 'Invalid webhook update')
      res.sendStatus(500)
      return
    }

    if (handledBotUpdates.has(updateId)) {
      logger.debug({ body: req.body }, 'Webhook update is already handled')
      res.sendStatus(200)
      return
    }

    handledBotUpdates.add(updateId)

    try {
      logger.debug({ body: req.body }, 'Webhook update received')
      await bot.handleUpdate(req.body, res)
    } catch (error) {
      next(error)
    }
  })

  const port = Number(process.env.PORT) || 3001

  logger.info({}, 'Starting Express app')
  await new Promise((resolve) => app.listen(port, () => resolve(undefined)))

  // --- TELEGRAM WEBHOOKS

  try {
    logger.info({}, 'Removing existing webhook')
    await bot.telegram.deleteWebhook()
  } catch (error) {
    logger.warn({ error }, 'Could not delete webhook:')
  }

  if (useWebhooks) {
    const webhookUrl = `${domain}/bot${telegramBotToken}`

    logger.info({ webhookUrl }, 'Setting webhook')
    while (true) {
      try {
        await bot.telegram.setWebhook(webhookUrl, {
          allowed_updates: ['message', 'callback_query'],
        })
        break
      } catch (error) {
        logger.warn({ error }, 'Could not set webhook, retrying...')
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    logger.info(
      { webhookInfo: await bot.telegram.getWebhookInfo() },
      `Webhook 0.0.0.0:${port} is listening at ${webhookUrl}`
    )
  } else {
    logger.info({}, 'Starting Telegram bot')

    bot.launch()
  }
}

start()
  .then(() => logger.info({}, 'Started!'))
  .catch((error) => {
    logger.error(error, 'Unexpected starting error')
    process.exit(1)
  })
