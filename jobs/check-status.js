import * as pg from 'pg'
import { MiHomeStatusChecker } from '../app/MiHomeStatusChecker.js'
import { StatusPostgresStorage } from '../app/StatusPostgresStorage.js'
import { country, databaseUrl, password, username } from '../env'

async function run() {
  const pgClient = new pg.Client(databaseUrl)
  await pgClient.connect()

  const statusStorage = new StatusPostgresStorage(pgClient)

  const statusChecker = new MiHomeStatusChecker({
    country,
    password,
    username,
  })

  await statusChecker.init()

  const status = await statusChecker.check()

  await statusStorage.storeStatus(status)
}

run()
  .then(() => console.log('Done!'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
