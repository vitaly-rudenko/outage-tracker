import { gatherDailyStats } from '../../app/gatherDailyStats.js'
import { today, createLastStatusBefore, createStatus } from './helpers.js'

describe('gatherDailyStats()', () => {
  it('should gather daily stats (empty, before: true)', () => {
    expect(gatherDailyStats(today, [], createLastStatusBefore(true))).toEqual({
      totalOnlineMs: 86400000,
      perHour: [
        { hour: 0, onlineMs: 3600000 },
        { hour: 1, onlineMs: 3600000 },
        { hour: 2, onlineMs: 3600000 },
        { hour: 3, onlineMs: 3600000 },
        { hour: 4, onlineMs: 3600000 },
        { hour: 5, onlineMs: 3600000 },
        { hour: 6, onlineMs: 3600000 },
        { hour: 7, onlineMs: 3600000 },
        { hour: 8, onlineMs: 3600000 },
        { hour: 9, onlineMs: 3600000 },
        { hour: 10, onlineMs: 3600000 },
        { hour: 11, onlineMs: 3600000 },
        { hour: 12, onlineMs: 3600000 },
        { hour: 13, onlineMs: 3600000 },
        { hour: 14, onlineMs: 3600000 },
        { hour: 15, onlineMs: 3600000 },
        { hour: 16, onlineMs: 3600000 },
        { hour: 17, onlineMs: 3600000 },
        { hour: 18, onlineMs: 3600000 },
        { hour: 19, onlineMs: 3600000 },
        { hour: 20, onlineMs: 3600000 },
        { hour: 21, onlineMs: 3600000 },
        { hour: 22, onlineMs: 3600000 },
        { hour: 23, onlineMs: 3600000 }
      ]
    })
  })

  it('should gather daily stats (empty, before: false)', () => {
    expect(gatherDailyStats(today, [], createLastStatusBefore(false))).toEqual({
      totalOnlineMs: 0,
      perHour: [
        { hour: 0, onlineMs: 0 },
        { hour: 1, onlineMs: 0 },
        { hour: 2, onlineMs: 0 },
        { hour: 3, onlineMs: 0 },
        { hour: 4, onlineMs: 0 },
        { hour: 5, onlineMs: 0 },
        { hour: 6, onlineMs: 0 },
        { hour: 7, onlineMs: 0 },
        { hour: 8, onlineMs: 0 },
        { hour: 9, onlineMs: 0 },
        { hour: 10, onlineMs: 0 },
        { hour: 11, onlineMs: 0 },
        { hour: 12, onlineMs: 0 },
        { hour: 13, onlineMs: 0 },
        { hour: 14, onlineMs: 0 },
        { hour: 15, onlineMs: 0 },
        { hour: 16, onlineMs: 0 },
        { hour: 17, onlineMs: 0 },
        { hour: 18, onlineMs: 0 },
        { hour: 19, onlineMs: 0 },
        { hour: 20, onlineMs: 0 },
        { hour: 21, onlineMs: 0 },
        { hour: 22, onlineMs: 0 },
        { hour: 23, onlineMs: 0 }
      ]
    })
  })

  it('should gather daily stats (simple, before: true)', () => {
    const dailyStatuses = [
      createStatus(false, '4:40'),
    ]

    expect(gatherDailyStats(today, dailyStatuses, createLastStatusBefore(true))).toEqual({
      totalOnlineMs: 16800000,
      perHour: [
        { hour: 0, onlineMs: 3600000 },
        { hour: 1, onlineMs: 3600000 },
        { hour: 2, onlineMs: 3600000 },
        { hour: 3, onlineMs: 3600000 },
        { hour: 4, onlineMs: 2400000 },
        { hour: 5, onlineMs: 0 },
        { hour: 6, onlineMs: 0 },
        { hour: 7, onlineMs: 0 },
        { hour: 8, onlineMs: 0 },
        { hour: 9, onlineMs: 0 },
        { hour: 10, onlineMs: 0 },
        { hour: 11, onlineMs: 0 },
        { hour: 12, onlineMs: 0 },
        { hour: 13, onlineMs: 0 },
        { hour: 14, onlineMs: 0 },
        { hour: 15, onlineMs: 0 },
        { hour: 16, onlineMs: 0 },
        { hour: 17, onlineMs: 0 },
        { hour: 18, onlineMs: 0 },
        { hour: 19, onlineMs: 0 },
        { hour: 20, onlineMs: 0 },
        { hour: 21, onlineMs: 0 },
        { hour: 22, onlineMs: 0 },
        { hour: 23, onlineMs: 0 }
      ]
    })
  })

  it('should gather daily stats (complex, before: false)', () => {
    const dailyStatuses = [
      createStatus(true,  '0:05'),
      createStatus(false, '4:40'),
      createStatus(true,  '15:05'),
      createStatus(false, '17:20'),
      createStatus(true,  '17:55'),
      createStatus(false, '22:05'),
    ]

    expect(gatherDailyStats(today, dailyStatuses, createLastStatusBefore(false))).toEqual({
      totalOnlineMs: 39600000,
      perHour: [
        { hour: 0, onlineMs: 3300000 },
        { hour: 1, onlineMs: 3600000 },
        { hour: 2, onlineMs: 3600000 },
        { hour: 3, onlineMs: 3600000 },
        { hour: 4, onlineMs: 2400000 },
        { hour: 5, onlineMs: 0 },
        { hour: 6, onlineMs: 0 },
        { hour: 7, onlineMs: 0 },
        { hour: 8, onlineMs: 0 },
        { hour: 9, onlineMs: 0 },
        { hour: 10, onlineMs: 0 },
        { hour: 11, onlineMs: 0 },
        { hour: 12, onlineMs: 0 },
        { hour: 13, onlineMs: 0 },
        { hour: 14, onlineMs: 0 },
        { hour: 15, onlineMs: 3300000 },
        { hour: 16, onlineMs: 3600000 },
        { hour: 17, onlineMs: 1500000 },
        { hour: 18, onlineMs: 3600000 },
        { hour: 19, onlineMs: 3600000 },
        { hour: 20, onlineMs: 3600000 },
        { hour: 21, onlineMs: 3600000 },
        { hour: 22, onlineMs: 300000 },
        { hour: 23, onlineMs: 0 }
      ]
    })
  })
})
