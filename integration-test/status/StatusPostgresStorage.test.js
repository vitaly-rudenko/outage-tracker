import pg from 'pg'
import { StatusPostgresStorage } from '../../app/status/StatusPostgresStorage.js'
import { databaseUrl } from '../../env.js'
import { createStatus } from '../../test/helpers.js'

describe('StatusPostgresStorage', () => {
  let pgClient
  /** @type {StatusPostgresStorage} */
  let statusStorage

  beforeAll(async () => {
    pgClient = new pg.Client(databaseUrl)
    await pgClient.connect()

    statusStorage = new StatusPostgresStorage(pgClient)
  })

  beforeEach(async () => {
    await pgClient.query(`TRUNCATE status;`)
  })

  afterAll(async () => {
    await pgClient.end()
  })

  describe('findLatestStatusFirstChange()', () => {
    it('should return latest status first change (empty)', async () => {
      await expect(
        statusStorage.findLatestStatusFirstChange()
      ).resolves.toBeUndefined()
    })

    it('should return latest status first change (single status)', async () => {
      const status = await statusStorage.createStatus(
        createStatus(true, '10:00')
      )

      await expect(
        statusStorage.findLatestStatusFirstChange()
      ).resolves.toEqual(status)
    })

    it('should return latest status first change (unchanged status)', async () => {
      const status = await statusStorage.createStatus(
        createStatus(false, '10:00')
      )
      await statusStorage.createStatus(createStatus(false, '11:00'))
      await statusStorage.createStatus(createStatus(false, '12:00'))
      await statusStorage.createStatus(createStatus(false, '13:00'))
      await statusStorage.createStatus(createStatus(false, '14:00'))

      await expect(
        statusStorage.findLatestStatusFirstChange()
      ).resolves.toEqual(status)
    })

    it('should return latest status first change (simple change)', async () => {
      await statusStorage.createStatus(createStatus(false, '10:00'))
      await statusStorage.createStatus(createStatus(false, '11:00'))
      const status = await statusStorage.createStatus(createStatus(true, '12:00'))
      await statusStorage.createStatus(createStatus(true, '13:00'))
      await statusStorage.createStatus(createStatus(true, '14:00'))

      await expect(
        statusStorage.findLatestStatusFirstChange()
      ).resolves.toEqual(status)
    })

    it('should return latest status first change (simple change, last)', async () => {
      await statusStorage.createStatus(createStatus(false, '10:00'))
      await statusStorage.createStatus(createStatus(false, '11:00'))
      await statusStorage.createStatus(createStatus(false, '12:00'))
      await statusStorage.createStatus(createStatus(false, '13:00'))
      const status = await statusStorage.createStatus(createStatus(true, '14:00'))

      await expect(
        statusStorage.findLatestStatusFirstChange()
      ).resolves.toEqual(status)
    })

    it('should return latest status first change (complex changes)', async () => {
      await statusStorage.createStatus(createStatus(true, '10:00'))
      await statusStorage.createStatus(createStatus(false, '11:00'))
      await statusStorage.createStatus(createStatus(false, '12:00'))
      await statusStorage.createStatus(createStatus(true, '13:00'))
      const status = await statusStorage.createStatus(createStatus(false, '14:00'))
      await statusStorage.createStatus(createStatus(false, '15:00'))

      await expect(
        statusStorage.findLatestStatusFirstChange()
      ).resolves.toEqual(status)
    })
  })
})
