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
import { TelegramErrorLogger } from './app/TelegramErrorLogger.js'
import { versionCommand } from './app/flows/version.js'
import { MiHomeStatusChecker } from './app/MiHomeStatusChecker.js'
import { StatusPostgresStorage } from './app/StatusPostgresStorage.js'
import { gatherDailyStats } from './app/gatherDailyStats.js'
import { formatDailyStats } from './app/formatDailyStats.js'
import { formatTime } from './app/formatTime.js'
import { gatherWeeklyStats } from './app/gatherWeeklyStats.js'
import { formatWeeklyStats } from './app/formatWeeklyStats.js'
import { withLocalization } from './app/localization/middlewares/localization.js'
import { withLanguage } from './app/localization/localize.js'
import { escapeMd } from './app/escapeMd.js'

const maxDurationMs = 10 * 60_000
const aggregateHours = 2
const days = 7

async function start() {
  const localizeDefault = withLanguage('uk')

  const statusChecker = new MiHomeStatusChecker({
    country,
    password,
    username,
  })

  logger.info({}, 'Connecting to Postgres')
  const pgClient = new pg.Client(databaseUrl)
  await pgClient.connect()

  const statusStorage = new StatusPostgresStorage(pgClient)

  const bot = new Telegraf(telegramBotToken)
  const errorLogger = new TelegramErrorLogger({
    telegram: bot.telegram,
    debugChatId,
  })

  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))

  bot.telegram.setMyCommands([
    { command: 'now', description: localizeDefault('commands.now') },
    { command: 'today', description: localizeDefault('commands.today') },
    { command: 'week', description: localizeDefault('commands.week') },
    { command: 'start', description: localizeDefault('commands.start') },
    { command: 'version', description: localizeDefault('commands.version') },
  ])

  process.on('unhandledRejection', (error) => {
    errorLogger.log(error)
  })

  if (!useWebhooks) {
    bot.use((context, next) => {
      logger.debug({ update: context.update }, 'Direct update received')
      return next()
    })
  }

  bot.use(withLocalization())

  bot.start(async (context) => {
    await context.reply('Hello!')
  })

  bot.command('version', versionCommand())

  bot.command('now', async (context) => {
    const { localize } = context.state

    const message = await context.reply(localize('fetchingStatus'), {
      parse_mode: 'MarkdownV2',
    })

    const latestStatusChange = await statusStorage.getLatestStatusChange()
    const currentStatus = await statusChecker.check()

    let replyText
    if (
      !latestStatusChange ||
      latestStatusChange.isOnline !== currentStatus.isOnline
    ) {
      await statusStorage.storeStatus(currentStatus)

      replyText = currentStatus.isOnline
        ? localize('now.becameOnline')
        : localize('now.becameOffline')
    } else {
      const time =
        currentStatus.createdAt.getTime() -
        latestStatusChange.createdAt.getTime()

      replyText = currentStatus.isOnline
        ? localize('now.stillOnline', { duration: escapeMd(formatTime(time)) })
        : localize('now.stillOffline', { duration: escapeMd(formatTime(time)) })
    }

    await bot.telegram.editMessageText(
      message.chat.id,
      message.message_id,
      undefined,
      replyText,
      { parse_mode: 'MarkdownV2' }
    )
  })

  bot.command('today', async (context) => {
    const { localize } = context.state

    const message = await context.reply(localize('fetchingStatus'), {
      parse_mode: 'MarkdownV2',
    })

    await statusStorage.storeStatus(await statusChecker.check())

    const date = new Date()
    const statuses = await statusStorage.getDailyStatuses({ date })
    const latestStatusBefore = await statusStorage.getLatestStatusBeforeDate({
      date,
    })

    const dailyStats = gatherDailyStats({
      date,
      until: true,
      statuses,
      latestStatusBefore,
      maxDurationMs,
    })

    await bot.telegram.editMessageText(
      message.chat.id,
      message.message_id,
      undefined,
      formatDailyStats({ date, dailyStats, aggregateHours, localize }),
      { parse_mode: 'MarkdownV2' }
    )
  })

  bot.command('week', async (context) => {
    const { localize } = context.state

    const message = await context.reply(localize('fetchingStatus'), {
      parse_mode: 'MarkdownV2',
    })

    await statusStorage.storeStatus(await statusChecker.check())

    const date = new Date()
    const statuses = await statusStorage.getWeeklyStatuses({ date, days })
    const latestStatusBefore = await statusStorage.getLatestStatusBeforeWeek({
      date,
      days,
    })

    const weeklyStats = gatherWeeklyStats({
      date,
      days,
      until: true,
      statuses,
      latestStatusBefore,
      maxDurationMs,
    })

    await bot.telegram.editMessageText(
      message.chat.id,
      message.message_id,
      undefined,
      formatWeeklyStats({ weeklyStats, aggregateHours, localize }),
      { parse_mode: 'MarkdownV2' }
    )
  })

  bot.catch((error) => errorLogger.log(error))

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
