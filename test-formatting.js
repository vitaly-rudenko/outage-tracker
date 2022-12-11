import { formatDailyStats } from './app/formatDailyStats.js'
import { gatherDailyStats } from './app/gatherDailyStats.js'
import { Status } from './app/Status.js'

const dailyStats = gatherDailyStats({
  date: new Date('2020-01-01 18:30'),
  until: true,
  latestStatusBefore: null,
  statuses: [
    new Status({ isOnline: false, createdAt: new Date('2020-01-01 0:30') }),
    new Status({ isOnline: true, createdAt: new Date('2020-01-01 4:30') }),
    new Status({ isOnline: false, createdAt: new Date('2020-01-01 17:15') }),
    new Status({ isOnline: true, createdAt: new Date('2020-01-01 17:45') }),
    new Status({ isOnline: false, createdAt: new Date('2020-01-01 18:15') }),
  ],
  maxDurationMs: 10 * 60_000,
})

console.log(dailyStats)

console.log(
  formatDailyStats({
    date: new Date('2020-01-01 12:00'),
    dailyStats,
    aggregateHours: 1,
  })
)