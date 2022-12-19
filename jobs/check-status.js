import pg from 'pg'
import { Telegraf } from 'telegraf'
import { withLanguage } from '../app/localize.js'
import { StatusPostgresStorage } from '../app/status/StatusPostgresStorage.js'
import { TpLinkStatusChecker } from '../app/status/TpLinkStatusChecker.js'
import { StatusCheckUseCase } from '../app/status/StatusCheckUseCase.js'
import {
  reportChatId,
  databaseUrl,
  retryMs,
  telegramBotToken,
  tpLinkPassword,
  tpLinkTerminalId,
  tpLinkUsername,
  retryAttempts,
  notificationSoundDelayMs,
} from '../env.js'
import { logger } from '../logger.js'

async function run() {
  const localizeDefault = withLanguage('uk')

  const bot = new Telegraf(telegramBotToken)

  logger.info({}, 'Connecting to Postgres')
  const pgClient = new pg.Client(databaseUrl)
  await pgClient.connect()

  const statusStorage = new StatusPostgresStorage(pgClient)
  const statusChecker = new TpLinkStatusChecker({
    username: tpLinkUsername,
    password: tpLinkPassword,
    terminalId: tpLinkTerminalId,
  })

  await new StatusCheckUseCase({
    bot,
    localize: localizeDefault,
    retryMs,
    retryAttempts,
    notificationSoundDelayMs,
    statusChecker,
    statusStorage,
    reportChatId,
  }).run({ retryIfOffline: true })
}

run()
  .then(() => {
    logger.info({}, 'Done!')
    process.exit(0)
  })
  .catch((error) => {
    logger.error(error, 'Unhandled error')
    process.exit(1)
  })
