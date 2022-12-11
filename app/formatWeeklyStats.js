import { formatTime } from './formatTime.js'

export function formatWeeklyStats({ weeklyStats, aggregateHours }) {
  const { totalMs, onlineMs, perDay } = weeklyStats

  let message = ''

  message += `Статистика за *${weeklyStats.perDay.length} днів*:\n`
  message += `✅ Онлайн: ${formatTime(onlineMs)}\n`
  message += `❌ Офлайн: ${formatTime(totalMs - onlineMs)}\n`
  message += '\n'
  message += '```\n'

  for (let i = 0; i < perDay[0].dailyStats.perHour.length; i += aggregateHours) {
    const startHour = i
    const endHour = startHour + aggregateHours - 1

    let icons = ''
    let lineTotalMs = 0
    let lineOnlineMs = 0

    for (let j = 0; j < perDay.length; j++) {
      const { dailyStats: { perHour } } = perDay[j]
      
      const hours = perHour.filter(p => p.hour >= startHour && p.hour <= endHour)
      const hoursOnlineMs = hours.map(h => h.onlineMs).reduce((a, b) => a + b, 0)
      const hoursTotalMs = hours.map(h => h.totalMs).reduce((a, b) => a + b, 0)
  
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

    const time = `${String(startHour).padStart(2, '0')}:00 - ${String(endHour).padStart(2, '0')}:59`
    const linePercentage = lineOnlineMs / lineTotalMs

    message += lineTotalMs > 0
      ? `${icons} ${time} | ${Math.round(linePercentage * 100)}%\n`
      : `${icons} ${time}\n`
  }

  message += '```'

  return message
}
