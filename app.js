import { Telegraf } from 'telegraf'
import pg from 'pg'
import { logger } from './logger.js'
import {
  adminUserId,
  allowCommandsToAdminOnly,
  reportChatId,
  checkStatusJobIntervalMs,
  databaseUrl,
  debugChatId,
  retryMs,
  telegramBotToken,
  tpLinkPassword,
  tpLinkUsername,
  retryAttempts,
  notificationSoundDelayMs,
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

  logger.info({}, 'Connecting to postgres')
  const pgClient = new pg.Client(databaseUrl)
  await pgClient.connect()

  const statusStorage = new StatusPostgresStorage(pgClient)
  const statusChecker = new TpLinkStatusChecker({
    username: tpLinkUsername,
    password: tpLinkPassword,
  })

  const bot = new Telegraf(telegramBotToken)
  const errorLogger = new TelegramErrorLogger({
    telegram: bot.telegram,
    debugChatId,
  })

  const statusCheckUseCase = new StatusCheckUseCase({
    bot,
    localize: localizeDefault,
    retryAttempts,
    retryMs,
    notificationSoundDelayMs,
    statusChecker,
    statusStorage,
    reportChatId,
  })

  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
  process.on('unhandledRejection', (error) => {
    errorLogger.log(error, 'Unhandled rejection')
  })

  // --- COMMANDS

  bot.telegram.setMyCommands([
    { command: 'now', description: localizeDefault('commands.now') },
    { command: 'today', description: localizeDefault('commands.today') },
    { command: 'week', description: localizeDefault('commands.week') },
    { command: 'version', description: localizeDefault('commands.version') },
  ])

  bot.command('version', versionCommand())

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
  bot.command('now', nowCommand({ bot, statusCheckUseCase }))
  bot.command('today', todayCommand({ bot, statusCheckUseCase, statusStorage }))
  bot.command('week', weekCommand({ bot, statusCheckUseCase, statusStorage }))
  bot.catch((error) => errorLogger.log(error))

  logger.info({}, 'Starting telegram bot')
  bot.launch()
    .catch((error) => {
      logger.error(error, 'Could not launch telegram bot')
      process.exit(1)
    })

  if (Number.isInteger(checkStatusJobIntervalMs)) {
    async function runCheckStatusJob() {
      logger.info({ reportChatId, retryMs }, 'Running automatic status check')

      try {
        await statusCheckUseCase.run({ retryIfOffline: true })
      } catch (error) {
        logger.error(error, 'Could not check status automatically')
      } finally {
        logger.debug({ checkStatusJobIntervalMs }, 'Scheduling next automatic status check')
        setTimeout(runCheckStatusJob, checkStatusJobIntervalMs);
      }
    }

    await runCheckStatusJob()
  }
}

start()
  .then(() => logger.info({}, 'Started!'))
  .catch((error) => {
    logger.error(error, 'Unexpected starting error')
    process.exit(1)
  })
