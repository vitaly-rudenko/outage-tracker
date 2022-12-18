import { Telegraf } from 'telegraf'
import express from 'express'
import pg from 'pg'
import { logger } from './logger.js'
import {
  adminUserId,
  allowCommandsToAdminOnly,
  reportChatId,
  checkStatusJobIntervalMs,
  databaseUrl,
  debugChatId,
  domain,
  retryMs,
  telegramBotToken,
  tpLinkPassword,
  tpLinkTerminalId,
  tpLinkUsername,
  useWebhooks,
} from './env.js'
import { withLanguage } from './app/localize.js'
import { StatusPostgresStorage } from './app/status/StatusPostgresStorage.js'
import { TelegramErrorLogger } from './app/telegram/TelegramErrorLogger.js'
import { versionCommand } from './app/telegram/flows/version.js'
import { withLocalization } from './app/telegram/withLocalization.js'
import { nowCommand } from './app/status/flows/now.js'
import { todayCommand, weekCommand } from './app/status/flows/stats.js'
import { TpLinkStatusChecker } from './app/status/TpLinkStatusChecker.js'
import { StatusCheckUseCase } from './app/status/StatusCheckUseCase.js'

async function start() {
  const localizeDefault = withLanguage('uk')

  logger.info({}, 'Connecting to Postgres')
  const pgClient = new pg.Client(databaseUrl)
  await pgClient.connect()

  const statusStorage = new StatusPostgresStorage(pgClient)
  const statusChecker = new TpLinkStatusChecker({
    username: tpLinkUsername,
    password: tpLinkPassword,
    terminalId: tpLinkTerminalId,
  })

  const bot = new Telegraf(telegramBotToken)
  const errorLogger = new TelegramErrorLogger({
    telegram: bot.telegram,
    debugChatId,
  })

  const statusCheckUseCase = new StatusCheckUseCase({
    bot,
    localize: localizeDefault,
    retryMs,
    statusChecker,
    statusStorage,
    reportChatId,
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
    { command: 'version', description: localizeDefault('commands.version') },
  ])

  bot.use((context, next) => {
    if (context.chat?.type === 'private') {
      return next()
    }
  })

  if (allowCommandsToAdminOnly) {
    bot.use(async (context, next) => {
      if (context.from && String(context.from.id) === adminUserId) {
        return next()
      }

      await context.reply(localizeDefault('onlyAdminIsAllowed'))
    })
  }

  bot.use(withLocalization())
  bot.command('version', versionCommand())
  bot.command('now', nowCommand({ bot, statusCheckUseCase }))
  bot.command('today', todayCommand({ bot, statusCheckUseCase, statusStorage }))
  bot.command('week', weekCommand({ bot, statusCheckUseCase, statusStorage }))
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
    logger.info({}, 'Telegram bot started')

    bot.launch().catch((error) => {
      logger.error(error, 'Could not launch the bot')
      process.exit(1)
    })
  }

  if (Number.isInteger(checkStatusJobIntervalMs)) {
    ;(async function checkStatus() {
      logger.info({ reportChatId, retryMs }, 'Running automatic status check')

      try {
        await statusCheckUseCase.run({ retryIfOffline: true })
      } catch (error) {
        logger.error(error, 'Could not check status automatically')
      } finally {
        logger.info({ checkStatusJobIntervalMs }, 'Scheduling next automatic status check')
        setTimeout(checkStatus, checkStatusJobIntervalMs);
      }
    })()
  }
}

start()
  .then(() => logger.info({}, 'Started!'))
  .catch((error) => {
    logger.error(error, 'Unexpected starting error')
    process.exit(1)
  })
