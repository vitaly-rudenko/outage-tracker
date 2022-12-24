import { gatherDailyStats } from '../app/gatherDailyStats.js'
import { dateStart, createLatestStatusBefore, createStatus } from './helpers.js'

function min(min) {
  return min * 60_000
}

describe('gatherDailyStats()', () => {
  it('should gather daily stats (empty, before: true)', () => {
    expect(
      gatherDailyStats({
        dateStart,
        statuses: [],
        latestStatusBefore: createLatestStatusBefore(true),
        maxDurationMs: Infinity,
      })
    ).toEqual({
      onlineMs: 86400000, totalMs: 86400000,
      perHour: [
        { hour: 0,  onlineMs: min(60), totalMs: min(60) },
        { hour: 1,  onlineMs: min(60), totalMs: min(60) },
        { hour: 2,  onlineMs: min(60), totalMs: min(60) },
        { hour: 3,  onlineMs: min(60), totalMs: min(60) },
        { hour: 4,  onlineMs: min(60), totalMs: min(60) },
        { hour: 5,  onlineMs: min(60), totalMs: min(60) },
        { hour: 6,  onlineMs: min(60), totalMs: min(60) },
        { hour: 7,  onlineMs: min(60), totalMs: min(60) },
        { hour: 8,  onlineMs: min(60), totalMs: min(60) },
        { hour: 9,  onlineMs: min(60), totalMs: min(60) },
        { hour: 10, onlineMs: min(60), totalMs: min(60) },
        { hour: 11, onlineMs: min(60), totalMs: min(60) },
        { hour: 12, onlineMs: min(60), totalMs: min(60) },
        { hour: 13, onlineMs: min(60), totalMs: min(60) },
        { hour: 14, onlineMs: min(60), totalMs: min(60) },
        { hour: 15, onlineMs: min(60), totalMs: min(60) },
        { hour: 16, onlineMs: min(60), totalMs: min(60) },
        { hour: 17, onlineMs: min(60), totalMs: min(60) },
        { hour: 18, onlineMs: min(60), totalMs: min(60) },
        { hour: 19, onlineMs: min(60), totalMs: min(60) },
        { hour: 20, onlineMs: min(60), totalMs: min(60) },
        { hour: 21, onlineMs: min(60), totalMs: min(60) },
        { hour: 22, onlineMs: min(60), totalMs: min(60) },
        { hour: 23, onlineMs: min(60), totalMs: min(60) }
      ]
    })
  })

  it('should gather daily stats (empty, before: false)', () => {
    expect(
      gatherDailyStats({
        dateStart,
        statuses: [],
        latestStatusBefore: createLatestStatusBefore(false),
        maxDurationMs: Infinity,
      })
    ).toEqual({
      onlineMs: 0, totalMs: 86400000,
      perHour: [
        { hour: 0,  onlineMs: 0, totalMs: min(60) },
        { hour: 1,  onlineMs: 0, totalMs: min(60) },
        { hour: 2,  onlineMs: 0, totalMs: min(60) },
        { hour: 3,  onlineMs: 0, totalMs: min(60) },
        { hour: 4,  onlineMs: 0, totalMs: min(60) },
        { hour: 5,  onlineMs: 0, totalMs: min(60) },
        { hour: 6,  onlineMs: 0, totalMs: min(60) },
        { hour: 7,  onlineMs: 0, totalMs: min(60) },
        { hour: 8,  onlineMs: 0, totalMs: min(60) },
        { hour: 9,  onlineMs: 0, totalMs: min(60) },
        { hour: 10, onlineMs: 0, totalMs: min(60) },
        { hour: 11, onlineMs: 0, totalMs: min(60) },
        { hour: 12, onlineMs: 0, totalMs: min(60) },
        { hour: 13, onlineMs: 0, totalMs: min(60) },
        { hour: 14, onlineMs: 0, totalMs: min(60) },
        { hour: 15, onlineMs: 0, totalMs: min(60) },
        { hour: 16, onlineMs: 0, totalMs: min(60) },
        { hour: 17, onlineMs: 0, totalMs: min(60) },
        { hour: 18, onlineMs: 0, totalMs: min(60) },
        { hour: 19, onlineMs: 0, totalMs: min(60) },
        { hour: 20, onlineMs: 0, totalMs: min(60) },
        { hour: 21, onlineMs: 0, totalMs: min(60) },
        { hour: 22, onlineMs: 0, totalMs: min(60) },
        { hour: 23, onlineMs: 0, totalMs: min(60) }
      ]
    })
  })

  it('should gather daily stats (empty, before: true)', () => {
    expect(
      gatherDailyStats({
        dateStart,
        statuses: [],
        latestStatusBefore: undefined,
        maxDurationMs: Infinity,
      })
    ).toEqual({
      onlineMs: 0, totalMs: 0,
      perHour: [
        { hour: 0,  onlineMs: 0, totalMs: 0 },
        { hour: 1,  onlineMs: 0, totalMs: 0 },
        { hour: 2,  onlineMs: 0, totalMs: 0 },
        { hour: 3,  onlineMs: 0, totalMs: 0 },
        { hour: 4,  onlineMs: 0, totalMs: 0 },
        { hour: 5,  onlineMs: 0, totalMs: 0 },
        { hour: 6,  onlineMs: 0, totalMs: 0 },
        { hour: 7,  onlineMs: 0, totalMs: 0 },
        { hour: 8,  onlineMs: 0, totalMs: 0 },
        { hour: 9,  onlineMs: 0, totalMs: 0 },
        { hour: 10, onlineMs: 0, totalMs: 0 },
        { hour: 11, onlineMs: 0, totalMs: 0 },
        { hour: 12, onlineMs: 0, totalMs: 0 },
        { hour: 13, onlineMs: 0, totalMs: 0 },
        { hour: 14, onlineMs: 0, totalMs: 0 },
        { hour: 15, onlineMs: 0, totalMs: 0 },
        { hour: 16, onlineMs: 0, totalMs: 0 },
        { hour: 17, onlineMs: 0, totalMs: 0 },
        { hour: 18, onlineMs: 0, totalMs: 0 },
        { hour: 19, onlineMs: 0, totalMs: 0 },
        { hour: 20, onlineMs: 0, totalMs: 0 },
        { hour: 21, onlineMs: 0, totalMs: 0 },
        { hour: 22, onlineMs: 0, totalMs: 0 },
        { hour: 23, onlineMs: 0, totalMs: 0 }
      ]
    })
  })

  it('should gather daily stats (empty, until, before: true)', () => {
    const dateUntil = new Date(dateStart)
    dateUntil.setHours(14)
    dateUntil.setMinutes(15)

    expect(
      gatherDailyStats({
        dateStart,
        dateUntil,
        statuses: [],
        latestStatusBefore: createLatestStatusBefore(true),
        maxDurationMs: Infinity,
      })
    ).toEqual({
      onlineMs: min(14 * 60 + 15), totalMs: min(14 * 60 + 15),
      perHour: [
        { hour: 0,  onlineMs: min(60), totalMs: min(60) },
        { hour: 1,  onlineMs: min(60), totalMs: min(60) },
        { hour: 2,  onlineMs: min(60), totalMs: min(60) },
        { hour: 3,  onlineMs: min(60), totalMs: min(60) },
        { hour: 4,  onlineMs: min(60), totalMs: min(60) },
        { hour: 5,  onlineMs: min(60), totalMs: min(60) },
        { hour: 6,  onlineMs: min(60), totalMs: min(60) },
        { hour: 7,  onlineMs: min(60), totalMs: min(60) },
        { hour: 8,  onlineMs: min(60), totalMs: min(60) },
        { hour: 9,  onlineMs: min(60), totalMs: min(60) },
        { hour: 10, onlineMs: min(60), totalMs: min(60) },
        { hour: 11, onlineMs: min(60), totalMs: min(60) },
        { hour: 12, onlineMs: min(60), totalMs: min(60) },
        { hour: 13, onlineMs: min(60), totalMs: min(60) },
        { hour: 14, onlineMs: min(15), totalMs: min(15) },
        { hour: 15, onlineMs: 0, totalMs: 0 },
        { hour: 16, onlineMs: 0, totalMs: 0 },
        { hour: 17, onlineMs: 0, totalMs: 0 },
        { hour: 18, onlineMs: 0, totalMs: 0 },
        { hour: 19, onlineMs: 0, totalMs: 0 },
        { hour: 20, onlineMs: 0, totalMs: 0 },
        { hour: 21, onlineMs: 0, totalMs: 0 },
        { hour: 22, onlineMs: 0, totalMs: 0 },
        { hour: 23, onlineMs: 0, totalMs: 0 }
      ]
    })
  })

  it('should gather daily stats (simple, before: undefined)', () => {
    expect(
      gatherDailyStats({
        dateStart,
        statuses: [
          createStatus(true, '4:40'),
        ],
        latestStatusBefore: undefined,
        maxDurationMs: Infinity,
      })
    ).toEqual({
      onlineMs: 69600000, totalMs: 69600000,
      perHour: [
        { hour: 0,  onlineMs: 0, totalMs: 0 },
        { hour: 1,  onlineMs: 0, totalMs: 0 },
        { hour: 2,  onlineMs: 0, totalMs: 0 },
        { hour: 3,  onlineMs: 0, totalMs: 0 },
        { hour: 4,  onlineMs: 1200000, totalMs: 1200000 },
        { hour: 5,  onlineMs: min(60), totalMs: min(60) },
        { hour: 6,  onlineMs: min(60), totalMs: min(60) },
        { hour: 7,  onlineMs: min(60), totalMs: min(60) },
        { hour: 8,  onlineMs: min(60), totalMs: min(60) },
        { hour: 9,  onlineMs: min(60), totalMs: min(60) },
        { hour: 10, onlineMs: min(60), totalMs: min(60) },
        { hour: 11, onlineMs: min(60), totalMs: min(60) },
        { hour: 12, onlineMs: min(60), totalMs: min(60) },
        { hour: 13, onlineMs: min(60), totalMs: min(60) },
        { hour: 14, onlineMs: min(60), totalMs: min(60) },
        { hour: 15, onlineMs: min(60), totalMs: min(60) },
        { hour: 16, onlineMs: min(60), totalMs: min(60) },
        { hour: 17, onlineMs: min(60), totalMs: min(60) },
        { hour: 18, onlineMs: min(60), totalMs: min(60) },
        { hour: 19, onlineMs: min(60), totalMs: min(60) },
        { hour: 20, onlineMs: min(60), totalMs: min(60) },
        { hour: 21, onlineMs: min(60), totalMs: min(60) },
        { hour: 22, onlineMs: min(60), totalMs: min(60) },
        { hour: 23, onlineMs: min(60), totalMs: min(60) }
      ]
    })
  })

  it('should gather daily stats (simple, before: true)', () => {
    expect(
      gatherDailyStats({
        dateStart,
        statuses: [
          createStatus(false, '4:40'),
        ],
        latestStatusBefore: createLatestStatusBefore(true),
        maxDurationMs: Infinity,
      })
    ).toEqual({
      onlineMs: 16800000, totalMs: 86400000,
      perHour: [
        { hour: 0,  onlineMs: min(60), totalMs: min(60) },
        { hour: 1,  onlineMs: min(60), totalMs: min(60) },
        { hour: 2,  onlineMs: min(60), totalMs: min(60) },
        { hour: 3,  onlineMs: min(60), totalMs: min(60) },
        { hour: 4,  onlineMs: 2400000, totalMs: min(60) },
        { hour: 5,  onlineMs: 0, totalMs: min(60) },
        { hour: 6,  onlineMs: 0, totalMs: min(60) },
        { hour: 7,  onlineMs: 0, totalMs: min(60) },
        { hour: 8,  onlineMs: 0, totalMs: min(60) },
        { hour: 9,  onlineMs: 0, totalMs: min(60) },
        { hour: 10, onlineMs: 0, totalMs: min(60) },
        { hour: 11, onlineMs: 0, totalMs: min(60) },
        { hour: 12, onlineMs: 0, totalMs: min(60) },
        { hour: 13, onlineMs: 0, totalMs: min(60) },
        { hour: 14, onlineMs: 0, totalMs: min(60) },
        { hour: 15, onlineMs: 0, totalMs: min(60) },
        { hour: 16, onlineMs: 0, totalMs: min(60) },
        { hour: 17, onlineMs: 0, totalMs: min(60) },
        { hour: 18, onlineMs: 0, totalMs: min(60) },
        { hour: 19, onlineMs: 0, totalMs: min(60) },
        { hour: 20, onlineMs: 0, totalMs: min(60) },
        { hour: 21, onlineMs: 0, totalMs: min(60) },
        { hour: 22, onlineMs: 0, totalMs: min(60) },
        { hour: 23, onlineMs: 0, totalMs: min(60) }
      ]
    })
  })

  it('should gather daily stats (simple, max interval: 5 min, before: true)', () => {
    expect(
      gatherDailyStats({
        dateStart,
        statuses: [
          createStatus(true, '4:40'),
          createStatus(true, '4:50'),
          createStatus(false, '9:01'),
          createStatus(false, '9:07'),
          createStatus(false, '9:09'),
          createStatus(false, '15:30'),
          createStatus(true, '18:59'),
          createStatus(true, '19:00'),
          createStatus(true, '19:02'),
          createStatus(true, '19:59'),
          createStatus(true, '20:30'),
          createStatus(false, '23:30'),
          createStatus(true, '23:54'),
        ],
        latestStatusBefore: createLatestStatusBefore(true, '23:56'),
        maxDurationMs: 5 * 60_000,
      })
    ).toEqual({
      onlineMs: min(34), totalMs: min(56),
      perHour: [
        { hour: 0,  onlineMs: min(1), totalMs: min(1) },
        { hour: 1,  onlineMs: 0, totalMs: 0 },
        { hour: 2,  onlineMs: 0, totalMs: 0 },
        { hour: 3,  onlineMs: 0, totalMs: 0 },
        { hour: 4,  onlineMs: min(10), totalMs: min(10) },
        { hour: 5,  onlineMs: 0, totalMs: 0 },
        { hour: 6,  onlineMs: 0, totalMs: 0 },
        { hour: 7,  onlineMs: 0, totalMs: 0 },
        { hour: 8,  onlineMs: 0, totalMs: 0 },
        { hour: 9,  onlineMs: 0, totalMs: min(12) },
        { hour: 10, onlineMs: 0, totalMs: 0 },
        { hour: 11, onlineMs: 0, totalMs: 0 },
        { hour: 12, onlineMs: 0, totalMs: 0 },
        { hour: 13, onlineMs: 0, totalMs: 0 },
        { hour: 14, onlineMs: 0, totalMs: 0 },
        { hour: 15, onlineMs: 0, totalMs: min(5) },
        { hour: 16, onlineMs: 0, totalMs: 0 },
        { hour: 17, onlineMs: 0, totalMs: 0 },
        { hour: 18, onlineMs: min(1), totalMs: min(1) },
        { hour: 19, onlineMs: min(8), totalMs: min(8) },
        { hour: 20, onlineMs: min(9), totalMs: min(9) },
        { hour: 21, onlineMs: 0, totalMs: 0 },
        { hour: 22, onlineMs: 0, totalMs: 0 },
        { hour: 23, onlineMs: min(5), totalMs: min(10) }
      ]
    })
  })

  it('should gather daily stats (simple, max interval: 75 min, before: true)', () => {
    expect(
      gatherDailyStats({
        dateStart,
        statuses: [
          createStatus(false, '4:40'),
          createStatus(true, '19:00'),
          createStatus(true, '20:05'),
          createStatus(true, '23:55'),
        ],
        latestStatusBefore: createLatestStatusBefore(true, '23:30'),
        maxDurationMs: 75 * 60_000,
      })
    ).toEqual({
      onlineMs: min(190), totalMs: min(265),
      perHour: [
        { hour: 0,  onlineMs: min(45), totalMs: min(45) },
        { hour: 1,  onlineMs: 0, totalMs: 0 },
        { hour: 2,  onlineMs: 0, totalMs: 0 },
        { hour: 3,  onlineMs: 0, totalMs: 0 },
        { hour: 4,  onlineMs: 0, totalMs: min(20) },
        { hour: 5,  onlineMs: 0, totalMs: min(55) },
        { hour: 6,  onlineMs: 0, totalMs: 0 },
        { hour: 7,  onlineMs: 0, totalMs: 0 },
        { hour: 8,  onlineMs: 0, totalMs: 0 },
        { hour: 9,  onlineMs: 0, totalMs: 0 },
        { hour: 10, onlineMs: 0, totalMs: 0 },
        { hour: 11, onlineMs: 0, totalMs: 0 },
        { hour: 12, onlineMs: 0, totalMs: 0 },
        { hour: 13, onlineMs: 0, totalMs: 0 },
        { hour: 14, onlineMs: 0, totalMs: 0 },
        { hour: 15, onlineMs: 0, totalMs: 0 },
        { hour: 16, onlineMs: 0, totalMs: 0 },
        { hour: 17, onlineMs: 0, totalMs: 0 },
        { hour: 18, onlineMs: 0, totalMs: 0 },
        { hour: 19, onlineMs: min(60), totalMs: min(60) },
        { hour: 20, onlineMs: min(60), totalMs: min(60) },
        { hour: 21, onlineMs: min(20), totalMs: min(20) },
        { hour: 22, onlineMs: 0, totalMs: 0 },
        { hour: 23, onlineMs: min(5), totalMs: min(5) }
      ]
    })
  })

  it('should gather daily stats (complex, before: false)', () => {
    expect(
      gatherDailyStats({
        dateStart,
        statuses: [
          createStatus(true,  '0:05'),
          createStatus(false, '4:40'),
          createStatus(true,  '15:05'),
          createStatus(false, '17:20'),
          createStatus(true,  '17:55'),
          createStatus(false, '22:05'),
        ],
        latestStatusBefore: createLatestStatusBefore(false),
        maxDurationMs: Infinity,
      })
    ).toEqual({
      onlineMs: 39600000, totalMs: 86400000,
      perHour: [
        { hour: 0,  onlineMs: 3300000, totalMs: min(60) },
        { hour: 1,  onlineMs: min(60), totalMs: min(60) },
        { hour: 2,  onlineMs: min(60), totalMs: min(60) },
        { hour: 3,  onlineMs: min(60), totalMs: min(60) },
        { hour: 4,  onlineMs: 2400000, totalMs: min(60) },
        { hour: 5,  onlineMs: 0, totalMs: min(60) },
        { hour: 6,  onlineMs: 0, totalMs: min(60) },
        { hour: 7,  onlineMs: 0, totalMs: min(60) },
        { hour: 8,  onlineMs: 0, totalMs: min(60) },
        { hour: 9,  onlineMs: 0, totalMs: min(60) },
        { hour: 10, onlineMs: 0, totalMs: min(60) },
        { hour: 11, onlineMs: 0, totalMs: min(60) },
        { hour: 12, onlineMs: 0, totalMs: min(60) },
        { hour: 13, onlineMs: 0, totalMs: min(60) },
        { hour: 14, onlineMs: 0, totalMs: min(60) },
        { hour: 15, onlineMs: 3300000, totalMs: min(60) },
        { hour: 16, onlineMs: min(60), totalMs: min(60) },
        { hour: 17, onlineMs: 1500000, totalMs: min(60) },
        { hour: 18, onlineMs: min(60), totalMs: min(60) },
        { hour: 19, onlineMs: min(60), totalMs: min(60) },
        { hour: 20, onlineMs: min(60), totalMs: min(60) },
        { hour: 21, onlineMs: min(60), totalMs: min(60) },
        { hour: 22, onlineMs: 300000, totalMs: min(60) },
        { hour: 23, onlineMs: 0, totalMs: min(60) }
      ]
    })
  })

  it('should gather daily stats (complex, until, before: true)', () => {
    const dateUntil = new Date(dateStart)
    dateUntil.setHours(18)
    dateUntil.setMinutes(55)

    expect(
      gatherDailyStats({
        dateStart,
        dateUntil,
        statuses: [
          createStatus(false, '4:40'),
          createStatus(true,  '15:05'),
          createStatus(false, '17:20'),
          createStatus(true,  '17:55'),
        ],
        latestStatusBefore: createLatestStatusBefore(true),
        maxDurationMs: Infinity,
      })
    ).toEqual({
      onlineMs: 28500000, totalMs: 68100000,
      perHour: [
        { hour: 0,  onlineMs: min(60), totalMs: min(60) },
        { hour: 1,  onlineMs: min(60), totalMs: min(60) },
        { hour: 2,  onlineMs: min(60), totalMs: min(60) },
        { hour: 3,  onlineMs: min(60), totalMs: min(60) },
        { hour: 4,  onlineMs: 2400000, totalMs: min(60) },
        { hour: 5,  onlineMs: 0, totalMs: min(60) },
        { hour: 6,  onlineMs: 0, totalMs: min(60) },
        { hour: 7,  onlineMs: 0, totalMs: min(60) },
        { hour: 8,  onlineMs: 0, totalMs: min(60) },
        { hour: 9,  onlineMs: 0, totalMs: min(60) },
        { hour: 10, onlineMs: 0, totalMs: min(60) },
        { hour: 11, onlineMs: 0, totalMs: min(60) },
        { hour: 12, onlineMs: 0, totalMs: min(60) },
        { hour: 13, onlineMs: 0, totalMs: min(60) },
        { hour: 14, onlineMs: 0, totalMs: min(60) },
        { hour: 15, onlineMs: 3300000, totalMs: min(60) },
        { hour: 16, onlineMs: min(60), totalMs: min(60) },
        { hour: 17, onlineMs: 1500000, totalMs: min(60) },
        { hour: 18, onlineMs: 3300000, totalMs: 3300000 },
        { hour: 19, onlineMs: 0, totalMs: 0 },
        { hour: 20, onlineMs: 0, totalMs: 0 },
        { hour: 21, onlineMs: 0, totalMs: 0 },
        { hour: 22, onlineMs: 0, totalMs: 0 },
        { hour: 23, onlineMs: 0, totalMs: 0 }
      ]
    })

  })

  it('should gather daily stats (complex, until, before: undefined)', () => {
    const dateUntil = new Date(dateStart)
    dateUntil.setHours(17)
    dateUntil.setMinutes(50)

    expect(
      gatherDailyStats({
        dateStart,
        dateUntil,
        statuses: [
          createStatus(true,  '17:15'),
          createStatus(false,  '17:20'),
          createStatus(true,  '17:30'),
        ],
        latestStatusBefore: undefined,
        maxDurationMs: Infinity,
      })
    ).toEqual({
      onlineMs: 1500000, totalMs: 2100000,
      perHour: [
        { hour: 0,  onlineMs: 0, totalMs: 0 },
        { hour: 1,  onlineMs: 0, totalMs: 0 },
        { hour: 2,  onlineMs: 0, totalMs: 0 },
        { hour: 3,  onlineMs: 0, totalMs: 0 },
        { hour: 4,  onlineMs: 0, totalMs: 0 },
        { hour: 5,  onlineMs: 0, totalMs: 0 },
        { hour: 6,  onlineMs: 0, totalMs: 0 },
        { hour: 7,  onlineMs: 0, totalMs: 0 },
        { hour: 8,  onlineMs: 0, totalMs: 0 },
        { hour: 9,  onlineMs: 0, totalMs: 0 },
        { hour: 10, onlineMs: 0, totalMs: 0 },
        { hour: 11, onlineMs: 0, totalMs: 0 },
        { hour: 12, onlineMs: 0, totalMs: 0 },
        { hour: 13, onlineMs: 0, totalMs: 0 },
        { hour: 14, onlineMs: 0, totalMs: 0 },
        { hour: 15, onlineMs: 0, totalMs: 0 },
        { hour: 16, onlineMs: 0, totalMs: 0 },
        { hour: 17, onlineMs: 1500000, totalMs: 2100000 },
        { hour: 18, onlineMs: 0, totalMs: 0 },
        { hour: 19, onlineMs: 0, totalMs: 0 },
        { hour: 20, onlineMs: 0, totalMs: 0 },
        { hour: 21, onlineMs: 0, totalMs: 0 },
        { hour: 22, onlineMs: 0, totalMs: 0 },
        { hour: 23, onlineMs: 0, totalMs: 0 }
      ]
    })
  })
})
