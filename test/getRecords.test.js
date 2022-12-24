import { getRecords } from '../app/getRecords'
import { createLatestStatusBefore, createStatus, dateStart, nextDateStart } from './helpers.js'

describe('getRecords()', () => {
  it('should calculate records (empty)', () => {
    expect(
      getRecords({
        maxDurationMs: Infinity,
        dateStart,
        dateUntil: new Date(),
        latestStatusBefore: undefined,
        statuses: [],
      })
    ).toEqual({
      maxOnlineMs: 0,
      maxOfflineMs: 0,
      averageOfflineMs: 0,
      averageOnlineMs: 0,
    })
  })

  it('should calculate records (empty, latest, until next day)', () => {
    expect(
      getRecords({
        maxDurationMs: Infinity,
        dateStart,
        dateUntil: nextDateStart,
        latestStatusBefore: createLatestStatusBefore(true, '23:55'),
        statuses: [],
      })
    ).toEqual({
      maxOnlineMs: 24 * 60 * 60_000,
      maxOfflineMs: 0,
      averageOfflineMs: 0,
      averageOnlineMs: 24 * 60 * 60_000,
    })
  })

  it('should calculate records (empty, latest, until this day)', () => {
    expect(
      getRecords({
        maxDurationMs: Infinity,
        dateStart,
        dateUntil: new Date(dateStart.getTime() + 17 * 60 * 60_000 + 35 * 60_000),
        latestStatusBefore: createLatestStatusBefore(true, '23:55'),
        statuses: [],
      })
    ).toEqual({
      maxOnlineMs: 17 * 60 * 60_000 + 35 * 60_000,
      maxOfflineMs: 0,
      averageOfflineMs: 0,
      averageOnlineMs: 17 * 60 * 60_000 + 35 * 60_000,
    })
  })

  it('should calculate records (complex, until, latest)', () => {
    expect(
      getRecords({
        maxDurationMs: Infinity,
        dateStart,
        dateUntil: nextDateStart,
        latestStatusBefore: createLatestStatusBefore(true, '23:55'),
        statuses: [
          createStatus(false, '1:05'),  // 1:05  true
          createStatus(false,  '8:35'),
          createStatus(true,  '10:05'), // 9:00  false
          createStatus(false, '23:35'), // 13:30 true
          createStatus(true,  '23:55'), // 0:20  false
        ],                              // 0:05 true
      })
    ).toEqual({
      maxOnlineMs: 13 * 60 * 60_000 + 30 * 60_000,
      maxOfflineMs: 9 * 60 * 60_000,
      averageOnlineMs: (14 * 60 * 60_000 + 40 * 60_000) / 3,
      averageOfflineMs: (9 * 60 * 60_000 + 20 * 60_000) / 2,
    })
  })

  it('should calculate records (complex, max duration, until, latest)', () => {
    expect(
      getRecords({
        maxDurationMs: 55 * 60_000,
        dateStart,
        dateUntil: nextDateStart,
        latestStatusBefore: createLatestStatusBefore(true, '23:55'),
        statuses: [
          createStatus(false, '1:05'),  // 0:55 true
          createStatus(false,  '1:55'), 
          createStatus(true,  '10:05'), // 1:45 false
          createStatus(false, '23:35'), // 0:55 true
          createStatus(true,  '23:55'), // 0:20 false
        ],                              // 0:05 true
      })
    ).toEqual({
      maxOnlineMs: 55 * 60_000,
      maxOfflineMs: 60 * 60_000 + 45 * 60_000,
      averageOnlineMs: (60 * 60_000 + 55 * 60_000) / 3,
      averageOfflineMs: (60 * 60_000 + 15 * 60_000) / 2,
    })
  })
})
