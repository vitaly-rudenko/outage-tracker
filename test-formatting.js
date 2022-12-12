import { formatDailyStats } from './app/formatDailyStats.js'
import { formatWeeklyStats } from './app/formatWeeklyStats.js'
import { gatherDailyStats } from './app/gatherDailyStats.js'
import { gatherWeeklyStats } from './app/gatherWeeklyStats.js'
import { withLanguage } from './app/localization/localize.js'
import { Status } from './app/Status.js'

const dailyStats = gatherDailyStats({
  date: new Date('2020-01-01 18:30'),
  until: true,
  latestStatusBefore: undefined,
  statuses: [
    new Status({ isOnline: false, createdAt: new Date('2020-01-01 0:30') }),
    new Status({ isOnline: true, createdAt: new Date('2020-01-01 4:30') }),
    new Status({ isOnline: false, createdAt: new Date('2020-01-01 17:15') }),
    new Status({ isOnline: true, createdAt: new Date('2020-01-01 17:45') }),
    new Status({ isOnline: false, createdAt: new Date('2020-01-01 18:15') }),
  ],
  maxDurationMs: 10 * 60_000,
})

console.log(
  formatDailyStats({
    date: new Date('2020-01-01 12:00'),
    dailyStats,
    aggregateHours: 2,
    localize: withLanguage('uk'),
  })
)

const weeklyStats = gatherWeeklyStats({
  date: new Date('2020-01-07 18:30'),
  days: 7,
  latestStatusBefore: undefined,
  maxDurationMs: 2 * 60 * 60_000,
  until: true,
  statuses: [
    new Status({ isOnline: false, createdAt: new Date('2020-01-01 0:30') }),
    new Status({ isOnline: true, createdAt: new Date('2020-01-01 4:30') }),
    new Status({ isOnline: false, createdAt: new Date('2020-01-01 17:15') }),
    new Status({ isOnline: true, createdAt: new Date('2020-01-01 17:45') }),
    new Status({ isOnline: false, createdAt: new Date('2020-01-01 18:15') }),

    new Status({ isOnline: false, createdAt: new Date('2020-01-02 0:30') }),
    new Status({ isOnline: true, createdAt: new Date('2020-01-02 4:30') }),
    new Status({ isOnline: false, createdAt: new Date('2020-01-02 17:15') }),
    new Status({ isOnline: true, createdAt: new Date('2020-01-02 17:45') }),
    new Status({ isOnline: false, createdAt: new Date('2020-01-02 18:15') }),

    new Status({ isOnline: false, createdAt: new Date('2020-01-04 0:30') }),
    new Status({ isOnline: true, createdAt: new Date('2020-01-04 4:30') }),
    new Status({ isOnline: false, createdAt: new Date('2020-01-04 17:15') }),
    new Status({ isOnline: true, createdAt: new Date('2020-01-04 17:45') }),
    new Status({ isOnline: false, createdAt: new Date('2020-01-04 18:15') }),

    new Status({ isOnline: false, createdAt: new Date('2020-01-05 0:30') }),
    new Status({ isOnline: true, createdAt: new Date('2020-01-05 4:30') }),
    new Status({ isOnline: false, createdAt: new Date('2020-01-05 17:15') }),
    new Status({ isOnline: true, createdAt: new Date('2020-01-05 17:45') }),
    new Status({ isOnline: false, createdAt: new Date('2020-01-05 18:15') }),

    new Status({ isOnline: false, createdAt: new Date('2020-01-07 0:30') }),
    new Status({ isOnline: true, createdAt: new Date('2020-01-07 4:30') }),
    new Status({ isOnline: false, createdAt: new Date('2020-01-07 17:15') }),
    new Status({ isOnline: true, createdAt: new Date('2020-01-07 17:45') }),
    new Status({ isOnline: false, createdAt: new Date('2020-01-07 18:15') }),
  ],
})

console.log(
  formatWeeklyStats({
    localize: withLanguage('uk'),
    weeklyStats,
    aggregateHours: 2,
  })
)