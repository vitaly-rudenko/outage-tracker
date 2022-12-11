import { gatherDailyStats } from '../../app/gatherDailyStats.js'
import { today, createLastStatusBefore, createStatus } from './helpers.js'

describe('gatherDailyStats()', () => {
  it('should gather daily stats (empty, before: true)', () => {
    expect(
      gatherDailyStats({
        date: today,
        statuses: [],
        latestStatusBefore: createLastStatusBefore(true)
      })
    ).toEqual({
      onlineMs: 86400000, totalMs: 86400000,
      perHour: [
        { hour: 0,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 1,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 2,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 3,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 4,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 5,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 6,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 7,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 8,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 9,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 10, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 11, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 12, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 13, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 14, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 15, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 16, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 17, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 18, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 19, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 20, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 21, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 22, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 23, onlineMs: 3600000, totalMs: 3600000 }
      ]
    })
  })

  it('should gather daily stats (empty, before: false)', () => {
    expect(
      gatherDailyStats({
        date: today,
        statuses: [],
        latestStatusBefore: createLastStatusBefore(false)
      })
    ).toEqual({
      onlineMs: 0, totalMs: 86400000,
      perHour: [
        { hour: 0,  onlineMs: 0, totalMs: 3600000 },
        { hour: 1,  onlineMs: 0, totalMs: 3600000 },
        { hour: 2,  onlineMs: 0, totalMs: 3600000 },
        { hour: 3,  onlineMs: 0, totalMs: 3600000 },
        { hour: 4,  onlineMs: 0, totalMs: 3600000 },
        { hour: 5,  onlineMs: 0, totalMs: 3600000 },
        { hour: 6,  onlineMs: 0, totalMs: 3600000 },
        { hour: 7,  onlineMs: 0, totalMs: 3600000 },
        { hour: 8,  onlineMs: 0, totalMs: 3600000 },
        { hour: 9,  onlineMs: 0, totalMs: 3600000 },
        { hour: 10, onlineMs: 0, totalMs: 3600000 },
        { hour: 11, onlineMs: 0, totalMs: 3600000 },
        { hour: 12, onlineMs: 0, totalMs: 3600000 },
        { hour: 13, onlineMs: 0, totalMs: 3600000 },
        { hour: 14, onlineMs: 0, totalMs: 3600000 },
        { hour: 15, onlineMs: 0, totalMs: 3600000 },
        { hour: 16, onlineMs: 0, totalMs: 3600000 },
        { hour: 17, onlineMs: 0, totalMs: 3600000 },
        { hour: 18, onlineMs: 0, totalMs: 3600000 },
        { hour: 19, onlineMs: 0, totalMs: 3600000 },
        { hour: 20, onlineMs: 0, totalMs: 3600000 },
        { hour: 21, onlineMs: 0, totalMs: 3600000 },
        { hour: 22, onlineMs: 0, totalMs: 3600000 },
        { hour: 23, onlineMs: 0, totalMs: 3600000 }
      ]
    })
  })

  it('should gather daily stats (empty, before: true)', () => {
    expect(
      gatherDailyStats({
        date: today,
        statuses: [],
        latestStatusBefore: null
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
    const date = new Date(today)
    date.setHours(14)
    date.setMinutes(15)

    expect(
      gatherDailyStats({
        date,
        until: true,
        statuses: [],
        latestStatusBefore: createLastStatusBefore(true)
      })
    ).toEqual({
      onlineMs: 51300000, totalMs: 51300000,
      perHour: [
        { hour: 0,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 1,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 2,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 3,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 4,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 5,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 6,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 7,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 8,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 9,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 10, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 11, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 12, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 13, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 14, onlineMs: 900000,  totalMs: 900000 },
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

  it('should gather daily stats (simple, before: null)', () => {
    expect(
      gatherDailyStats({
        date: today,
        statuses: [
          createStatus(true, '4:40'),
        ],
        latestStatusBefore: null
      })
    ).toEqual({
      onlineMs: 69600000, totalMs: 69600000,
      perHour: [
        { hour: 0,  onlineMs: 0, totalMs: 0 },
        { hour: 1,  onlineMs: 0, totalMs: 0 },
        { hour: 2,  onlineMs: 0, totalMs: 0 },
        { hour: 3,  onlineMs: 0, totalMs: 0 },
        { hour: 4,  onlineMs: 1200000, totalMs: 1200000 },
        { hour: 5,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 6,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 7,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 8,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 9,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 10, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 11, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 12, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 13, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 14, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 15, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 16, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 17, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 18, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 19, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 20, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 21, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 22, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 23, onlineMs: 3600000, totalMs: 3600000 }
      ]
    })
  })

  it('should gather daily stats (simple, before: true)', () => {
    expect(
      gatherDailyStats({
        date: today,
        statuses: [
          createStatus(false, '4:40'),
        ],
        latestStatusBefore: createLastStatusBefore(true)
      })
    ).toEqual({
      onlineMs: 16800000, totalMs: 86400000,
      perHour: [
        { hour: 0,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 1,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 2,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 3,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 4,  onlineMs: 2400000, totalMs: 3600000 },
        { hour: 5,  onlineMs: 0, totalMs: 3600000 },
        { hour: 6,  onlineMs: 0, totalMs: 3600000 },
        { hour: 7,  onlineMs: 0, totalMs: 3600000 },
        { hour: 8,  onlineMs: 0, totalMs: 3600000 },
        { hour: 9,  onlineMs: 0, totalMs: 3600000 },
        { hour: 10, onlineMs: 0, totalMs: 3600000 },
        { hour: 11, onlineMs: 0, totalMs: 3600000 },
        { hour: 12, onlineMs: 0, totalMs: 3600000 },
        { hour: 13, onlineMs: 0, totalMs: 3600000 },
        { hour: 14, onlineMs: 0, totalMs: 3600000 },
        { hour: 15, onlineMs: 0, totalMs: 3600000 },
        { hour: 16, onlineMs: 0, totalMs: 3600000 },
        { hour: 17, onlineMs: 0, totalMs: 3600000 },
        { hour: 18, onlineMs: 0, totalMs: 3600000 },
        { hour: 19, onlineMs: 0, totalMs: 3600000 },
        { hour: 20, onlineMs: 0, totalMs: 3600000 },
        { hour: 21, onlineMs: 0, totalMs: 3600000 },
        { hour: 22, onlineMs: 0, totalMs: 3600000 },
        { hour: 23, onlineMs: 0, totalMs: 3600000 }
      ]
    })
  })

  it('should gather daily stats (complex, before: false)', () => {
    expect(
      gatherDailyStats({
        date: today,
        statuses: [
          createStatus(true,  '0:05'),
          createStatus(false, '4:40'),
          createStatus(true,  '15:05'),
          createStatus(false, '17:20'),
          createStatus(true,  '17:55'),
          createStatus(false, '22:05'),
        ],
        latestStatusBefore: createLastStatusBefore(false)
      })
    ).toEqual({
      onlineMs: 39600000, totalMs: 86400000,
      perHour: [
        { hour: 0,  onlineMs: 3300000, totalMs: 3600000 },
        { hour: 1,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 2,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 3,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 4,  onlineMs: 2400000, totalMs: 3600000 },
        { hour: 5,  onlineMs: 0, totalMs: 3600000 },
        { hour: 6,  onlineMs: 0, totalMs: 3600000 },
        { hour: 7,  onlineMs: 0, totalMs: 3600000 },
        { hour: 8,  onlineMs: 0, totalMs: 3600000 },
        { hour: 9,  onlineMs: 0, totalMs: 3600000 },
        { hour: 10, onlineMs: 0, totalMs: 3600000 },
        { hour: 11, onlineMs: 0, totalMs: 3600000 },
        { hour: 12, onlineMs: 0, totalMs: 3600000 },
        { hour: 13, onlineMs: 0, totalMs: 3600000 },
        { hour: 14, onlineMs: 0, totalMs: 3600000 },
        { hour: 15, onlineMs: 3300000, totalMs: 3600000 },
        { hour: 16, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 17, onlineMs: 1500000, totalMs: 3600000 },
        { hour: 18, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 19, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 20, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 21, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 22, onlineMs: 300000, totalMs: 3600000 },
        { hour: 23, onlineMs: 0, totalMs: 3600000 }
      ]
    })
  })

  it('should gather daily stats (complex, until, before: true)', () => {
    const date = new Date(today)
    date.setHours(18)
    date.setMinutes(55)

    expect(
      gatherDailyStats({
        date,
        until: true,
        statuses: [
          createStatus(false, '4:40'),
          createStatus(true,  '15:05'),
          createStatus(false, '17:20'),
          createStatus(true,  '17:55'),
        ],
        latestStatusBefore: createLastStatusBefore(true)
      })
    ).toEqual({
      onlineMs: 28500000, totalMs: 68100000,
      perHour: [
        { hour: 0,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 1,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 2,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 3,  onlineMs: 3600000, totalMs: 3600000 },
        { hour: 4,  onlineMs: 2400000, totalMs: 3600000 },
        { hour: 5,  onlineMs: 0, totalMs: 3600000 },
        { hour: 6,  onlineMs: 0, totalMs: 3600000 },
        { hour: 7,  onlineMs: 0, totalMs: 3600000 },
        { hour: 8,  onlineMs: 0, totalMs: 3600000 },
        { hour: 9,  onlineMs: 0, totalMs: 3600000 },
        { hour: 10, onlineMs: 0, totalMs: 3600000 },
        { hour: 11, onlineMs: 0, totalMs: 3600000 },
        { hour: 12, onlineMs: 0, totalMs: 3600000 },
        { hour: 13, onlineMs: 0, totalMs: 3600000 },
        { hour: 14, onlineMs: 0, totalMs: 3600000 },
        { hour: 15, onlineMs: 3300000, totalMs: 3600000 },
        { hour: 16, onlineMs: 3600000, totalMs: 3600000 },
        { hour: 17, onlineMs: 1500000, totalMs: 3600000 },
        { hour: 18, onlineMs: 3300000, totalMs: 3300000 },
        { hour: 19, onlineMs: 0, totalMs: 0 },
        { hour: 20, onlineMs: 0, totalMs: 0 },
        { hour: 21, onlineMs: 0, totalMs: 0 },
        { hour: 22, onlineMs: 0, totalMs: 0 },
        { hour: 23, onlineMs: 0, totalMs: 0 }
      ]
    })

  })

  it('should gather daily stats (complex, until, before: null)', () => {
    const date = new Date(today)
    date.setHours(17)
    date.setMinutes(50)

    expect(
      gatherDailyStats({
        date,
        until: true,
        statuses: [
          createStatus(true,  '17:15'),
          createStatus(false,  '17:20'),
          createStatus(true,  '17:30'),
        ],
        latestStatusBefore: null,
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
