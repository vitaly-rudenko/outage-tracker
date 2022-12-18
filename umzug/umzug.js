import { Umzug } from 'umzug'
import pg from 'pg'
import { databaseUrl } from '../env.js'
import { PostgresStorage } from './PostgresStorage.js'

const pgClient = new pg.Client(databaseUrl)
pgClient.connect()

export const umzug = new Umzug({
  migrations: { glob: 'migrations/*-*.cjs' },
  context: pgClient,
  storage: new PostgresStorage(pgClient, 'migrations_meta'),
  logger: console,
})
