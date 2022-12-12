import { escapeMd } from './escapeMd.js'
import { formatTime } from './formatTime.js'

export function formatWeeklyStats({ weeklyStats, aggregateHours, localize }) {
  const { totalMs, onlineMs, perDay } = weeklyStats

  return localize('daily.message', {
    days: perDay.length,
    onlineDuration: escapeMd(formatTime(onlineMs)),
    offlineDuration: escapeMd(formatTime(totalMs - onlineMs)),
    hours: Array.from(
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

          const hourPercentage = hoursOnlineMs / hoursTotalMs
          lineTotalMs += hoursTotalMs
          lineOnlineMs += hoursOnlineMs

          let icon = '🟥'
          if (hoursTotalMs === 0) {
            icon = '⬜'
          } else if (hourPercentage >= 0.95) {
            icon = '🟩'
          } else if (hourPercentage >= 0.5) {
            icon = '🟨'
          } else if (hourPercentage >= 0.05) {
            icon = '🟧'
          }

          icons += icon
        }

        const linePercentage = lineOnlineMs / lineTotalMs
        const time = `${String(startHour).padStart(2, '0')}:00 - ${String(
          endHour
        ).padStart(2, '0')}:59`

        return lineTotalMs > 0
          ? localize('weekly.lineWithPercentage', { icons, time, percentage: Math.floor(linePercentage * 100) })
          : localize('weekly.line', { icons, time })
      }
    ).join('\n'),
  })
}

function formatHours(from, to) {
  return `${String(from).padStart(2, '0')}:00–${String(to).padStart(2, '0')}:59`
}
