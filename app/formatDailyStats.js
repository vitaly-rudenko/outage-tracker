import { formatTime } from './formatTime.js'

export function formatDailyStats(date, { totalMs, onlineMs, perHour }) {
  let message = ''

  message += `Статистика за *${date.toDateString()}*:\n`
  message += `✅ Онлайн: ${formatTime(onlineMs)} годин\n`
  message += `❌ Офлайн: ${formatTime(totalMs - onlineMs)} годин\n`
  message += '\n'
  message += '```\n'

  for (let hour = 0; hour < 24; hour += 2) {
    const hours = perHour.filter(p => p.hour >= hour && p.hour <= hour + 1)
    const hoursOnlineMs = hours.map(h => h.onlineMs).reduce((a, b) => a + b, 0)
    const hoursTotalMs = hours.map(h => h.totalMs).reduce((a, b) => a + b, 0)

    if (hoursTotalMs === 0) {
      message += `⬜ ${String(hour).padStart(2, '0')}:00 - ${String(hour + 1).padStart(2, '0')}:59\n`
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

    message += `${icon} ${String(hour).padStart(2, '0')}:00 - ${String(hour + 1).padStart(2, '0')}:59 | ${Math.round(percentage * 100)}%\n`
  }

  message += '```'

  return message
}
