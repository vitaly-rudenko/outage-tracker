import { gatherDailyStats } from './gatherDailyStats.js'
import { time } from './utils/date.js'

/**
 * @param {{
 *   dateStart: Date,
 *   dateUntil?: Date,
 *   days: number,
 *   statuses: import('./status/Status').Status[],
 *   latestStatusBefore?: import('./status/Status').Status,
 *   maxDurationMs: Number,
 * }} input 
 */
export function gatherWeeklyStats({
  dateStart,
  dateUntil,
  days,
  statuses,
  latestStatusBefore,
  maxDurationMs = Infinity,
}) {
  const perDay = []

  for (let offset = 0; offset < days; offset++) {
    const thisDateStart = new Date(dateStart.getTime() - offset * 24 * 60 * 60_000)
    const nextDateStart = new Date(dateStart.getTime() - (offset - 1) * 24 * 60 * 60_000)

    const dailyStats = gatherDailyStats({
      dateStart: thisDateStart,
      dateUntil: offset === 0 ? dateUntil : undefined,
      statuses: statuses.filter(s => time(s) >= time(thisDateStart) && time(s) < time(nextDateStart)),
      latestStatusBefore: statuses.filter(s => time(s) < time(thisDateStart)).pop() || latestStatusBefore,
      maxDurationMs,
    })

    perDay.unshift({ date: thisDateStart, day: days - offset, dailyStats })
  }

  return {
    totalMs: perDay.reduce((a, b) => a + b.dailyStats.totalMs, 0),
    onlineMs: perDay.reduce((a, b) => a + b.dailyStats.onlineMs, 0),
    perDay,
  }
}
