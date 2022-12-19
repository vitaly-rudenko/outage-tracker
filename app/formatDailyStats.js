import { getAggregatedIcon } from './getAggregatedIcon.js'
import { formatDuration } from './utils/date.js'
import { escapeMd } from './utils/escapeMd.js'

export function formatDailyStats({
  now,
  timezoneOffsetMinutes,
  dailyStats,
  aggregateHours,
  localize,
}) {
  const { totalMs, onlineMs, perHour } = dailyStats

  return localize('daily.message', {
    date: escapeMd(formatDate(now, timezoneOffsetMinutes)),
    onlineDuration: escapeMd(formatDuration({ ms: onlineMs, localize })),
    offlineDuration: escapeMd(formatDuration({ ms: totalMs - onlineMs, localize })),
    hours: Array.from(
      new Array(Math.floor(perHour.length / aggregateHours)),
      (_, i) => {
        const startHour = i * aggregateHours
        const endHour = startHour + aggregateHours - 1

        const hours = perHour.filter(
          (p) => p.hour >= startHour && p.hour <= endHour
        )
        const hoursOnlineMs = hours
          .map((h) => h.onlineMs)
          .reduce((a, b) => a + b, 0)
        const hoursTotalMs = hours
          .map((h) => h.totalMs)
          .reduce((a, b) => a + b, 0)

        const time = formatHours(startHour, endHour)
        const icon = getAggregatedIcon({ onlineMs: hoursOnlineMs, totalMs: hoursTotalMs })

        if (hoursTotalMs === 0) {
          return localize('daily.hour', { icon, time })
        }

        const percentage = hoursOnlineMs / hoursTotalMs
        return localize('daily.hourWithPercentage', {
          icon,
          time,
          percentage: Math.floor(percentage * 100),
        })
      }
    ).join('\n'),
  })
}

function formatDate(date, timezoneOffsetMinutes) {
  const offsetDate = new Date(date.getTime() - timezoneOffsetMinutes * 60_000)

  return `${String(offsetDate.getUTCDate()).padStart(2, '0')}.${String(
    offsetDate.getUTCMonth() + 1
  ).padStart(2, '0')}.${offsetDate.getUTCFullYear()}`
}

function formatHours(from, to) {
  return `${String(from).padStart(2, '0')}:00–${String(to).padStart(
    2,
    '0'
  )}:59`
}
