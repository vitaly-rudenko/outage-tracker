import pg from 'pg'
import { Telegraf } from 'telegraf'
import { withLanguage } from '../app/localize.js'
import { MiHomeStatusChecker } from '../app/status/MiHomeStatusChecker.js'
import { StatusPostgresStorage } from '../app/status/StatusPostgresStorage.js'
import { formatDuration } from '../app/utils/dateUtils.js'
import { escapeMd } from '../app/utils/escapeMd.js'
import {
  chatId,
  country,
  databaseUrl,
  password,
  telegramBotToken,
  username,
} from '../env.js'
import { logger } from '../logger.js'

const RETRY_MS = 30_000

async function run() {
  const localizeDefault = withLanguage('uk')

  const bot = new Telegraf(telegramBotToken)

  logger.info({}, 'Connecting to Postgres')
  const pgClient = new pg.Client(databaseUrl)
  await pgClient.connect()

  const statusStorage = new StatusPostgresStorage(pgClient)
  const statusChecker = new MiHomeStatusChecker({
    country,
    password,
    username,
  })

  logger.info({}, 'Fetching current status')
  let status = await statusChecker.check()

  if (!status.isOnline) {
    logger.info({}, `Current status is offline, retrying in ${RETRY_MS} ms`)
    await new Promise((resolve) => setTimeout(resolve, RETRY_MS))

    logger.info({}, 'Fetching current status again')
    status = await statusChecker.check()
  }

  logger.info({}, 'Fetching the latest status first change')
  const latestStatusFirstChange =
    await statusStorage.findLatestStatusFirstChange()

  logger.info({}, 'Storing the current status')
  await statusStorage.createStatus(status)

  console.log({ status, latestStatusFirstChange })

  logger.info({}, 'Sending the message to the chat if necessary')
  if (latestStatusFirstChange) {
    if (latestStatusFirstChange.isOnline !== status.isOnline) {
      const latestStatusDurationMs =
        status.createdAt.getTime() - latestStatusFirstChange.createdAt.getTime()
      const duration = escapeMd(
        formatDuration({
          ms: latestStatusDurationMs,
          localize: localizeDefault,
        })
      )

      await bot.telegram.sendMessage(
        chatId,
        status.isOnline
          ? localizeDefault('becameOnlineAfter', { duration })
          : localizeDefault('becameOfflineAfter', { duration }),
        { parse_mode: 'MarkdownV2' }
      )
    }
  } else {
    await bot.telegram.sendMessage(
      chatId,
      status.isOnline
        ? localizeDefault('becameOnline')
        : localizeDefault('becameOffline'),
      { parse_mode: 'MarkdownV2' }
    )
  }
}

run()
  .then(() => {
    logger.info({}, 'Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
