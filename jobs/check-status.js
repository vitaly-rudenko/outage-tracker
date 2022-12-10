import pg from 'pg'
import { MiHomeStatusChecker } from '../app/MiHomeStatusChecker.js'
import { StatusPostgresStorage } from '../app/StatusPostgresStorage.js'
import { country, databaseUrl, password, username } from '../env.js'
import { logger } from '../logger.js'

async function run() {
  logger.info({}, 'Running status check')
  logger.info({}, 'Connecting to Postgres')

  const pgClient = new pg.Client(databaseUrl)
  await pgClient.connect()

  const statusStorage = new StatusPostgresStorage(pgClient)
  const statusChecker = new MiHomeStatusChecker({
    country,
    password,
    username,
  })

  logger.info({}, 'Initializing status checker')
  await statusChecker.init()

  logger.info({}, 'Fetching current status')
  let status = await statusChecker.check()

  if (!status.isOnline) {
    logger.info({}, 'Current status is offline, retrying in 30 seconds')
    await new Promise(resolve => setTimeout(resolve, 30_000))

    logger.info({}, 'Fetching current status again')
    status = await statusChecker.check()
  }

  logger.info({}, 'Storing the status')
  const storedStatus = await statusStorage.storeStatus(status)
}

run()
  .then(() => logger.info({}, 'Done!'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
