import { getAggregatedIcon } from './getAggregatedIcon.js'
import { formatDuration } from './utils/date.js'
import { escapeMd } from './utils/escapeMd.js'

export function formatWeeklyStats({ weeklyStats, records, aggregateHours, localize }) {
  const { totalMs, onlineMs, perDay } = weeklyStats

  return localize('weekly.message', {
    days: perDay.length,
    onlineDuration: escapeMd(formatDuration({ ms: onlineMs, localize })),
    offlineDuration: escapeMd(formatDuration({ ms: totalMs - onlineMs, localize })),
    maxOnlineDuration: escapeMd(formatDuration({ ms: records.maxOnlineMs, localize })),
    maxOfflineDuration: escapeMd(formatDuration({ ms: records.maxOfflineMs, localize })),
    averageOnlineDuration: escapeMd(formatDuration({ ms: records.averageOnlineMs, localize })),
    averageOfflineDuration: escapeMd(formatDuration({ ms: records.averageOfflineMs, localize })),
    lines: Array.from(
      new Array(
        Math.floor(perDay[0].dailyStats.perHour.length / aggregateHours)
      ),
      (_, i) => {
        const startHour = i * aggregateHours
        const endHour = startHour + aggregateHours - 1

        let icons = ''
        let lineTotalMs = 0
        let lineOnlineMs = 0

        for (let j = 0; j < perDay.length; j++) {
          const {
            dailyStats: { perHour },
          } = perDay[j]

          const hours = perHour.filter(
            (p) => p.hour >= startHour && p.hour <= endHour
          )
          const hoursOnlineMs = hours
            .map((h) => h.onlineMs)
            .reduce((a, b) => a + b, 0)
          const hoursTotalMs = hours
            .map((h) => h.totalMs)
            .reduce((a, b) => a + b, 0)

          lineTotalMs += hoursTotalMs
          lineOnlineMs += hoursOnlineMs

          icons += getAggregatedIcon({ onlineMs: hoursOnlineMs, totalMs: hoursTotalMs })
        }

        const linePercentage = lineOnlineMs / lineTotalMs
        const time = `${String(startHour).padStart(2, '0')}:00`

        return lineTotalMs > 0
          ? localize('weekly.lineWithPercentage', { icons, time, percentage: Math.floor(linePercentage * 100) })
          : localize('weekly.line', { icons, time })
      }
    ).join('\n'),
  })
}
