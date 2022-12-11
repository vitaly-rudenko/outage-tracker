import { escapeMd } from './escapeMd.js'
import { formatTime } from './formatTime.js'

export function formatDailyStats({ date, dailyStats, aggregateHours }) {
  const { totalMs, onlineMs, perHour } = dailyStats

  let message = ''

  message += `Статистика за *${escapeMd(formatDate(date))}*:\n`
  message += `✅ Онлайн: ${formatTime(onlineMs)} годин\n`
  message += `❌ Офлайн: ${formatTime(totalMs - onlineMs)} годин\n`
  message += '\n'
  message += '```\n'

  for (let i = 0; i < 24; i += aggregateHours) {
    const startHour = i
    const endHour = i + aggregateHours - 1

    const hours = perHour.filter(p => p.hour >= startHour && p.hour <= endHour)
    const hoursOnlineMs = hours.map(h => h.onlineMs).reduce((a, b) => a + b, 0)
    const hoursTotalMs = hours.map(h => h.totalMs).reduce((a, b) => a + b, 0)

    if (hoursTotalMs === 0) {
      message += `⬜ ${String(startHour).padStart(2, '0')}:00 - ${String(endHour).padStart(2, '0')}:59\n`
      continue
    }

    const percentage = hoursOnlineMs / hoursTotalMs

    let icon = '🟥'
    if (percentage >= 0.95) {
      icon = '🟩'
    } else if (percentage >= 0.5) {
      icon = '🟨'
    } else if (percentage >= 0.05) {
      icon = '🟧'
    }

    message += `${icon} ${String(startHour).padStart(2, '0')}:00 - ${String(endHour).padStart(2, '0')}:59 | ${Math.round(percentage * 100)}%\n`
  }

  message += '```'

  return message
}

function formatDate(date) {
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
}
