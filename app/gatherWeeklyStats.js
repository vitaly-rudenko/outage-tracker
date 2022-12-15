import { gatherDailyStats } from './gatherDailyStats.js'
import { getStartOfTheDay } from './utils/date.js'

export function gatherWeeklyStats({
  date,
  days,
  until = false,
  statuses,
  latestStatusBefore,
  maxDurationMs = Infinity,
}) {
  const perDay = []

  for (let offset = 0; offset < days; offset++) {
    const today = new Date(date)
    today.setDate(date.getDate() - offset)

    const dailyStats = gatherDailyStats({
      date: today,
      until: until && offset === 0,
      statuses: statuses.filter(s => s.createdAt.getDate() === today.getDate()),
      latestStatusBefore: statuses.filter(s => s.createdAt.getTime() < getStartOfTheDay(today).getTime()).pop() || latestStatusBefore,
      maxDurationMs,
    })

    perDay.unshift({ date: today, day: days - offset, dailyStats })
  }

  return {
    totalMs: perDay.reduce((a, b) => a + b.dailyStats.totalMs, 0),
    onlineMs: perDay.reduce((a, b) => a + b.dailyStats.onlineMs, 0),
    perDay,
  }
}
