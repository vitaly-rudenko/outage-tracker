import { formatTime } from './formatTime.js'

export function formatDailyStats(date, { totalOnlineMs, perHour }) {
  let message = ''

  message += `On ${date.toDateString()} your home has been:\n`
  message += `✅ Online for ${formatTime(totalOnlineMs)} hours\n`
  message += `❌ Offline for ${formatTime(24 * 60 * 60_000 - totalOnlineMs)} hours\n`
  message += `\n`

  for (let hour = 0; hour < 24; hour += 2) {
    const onlineMs = perHour.find(p => p.hour === hour).onlineMs + perHour.find(p => p.hour === hour + 1).onlineMs

    const percentage = onlineMs / (2 * 60 * 60_000)

    let icon = '🟥'
    if (percentage >= 0.95) {
      icon = '🟩'
    } else if (percentage >= 0.5) {
      icon = '🟨'
    } else if (percentage >= 0.05) {
      icon = '🟧'
    }

    message += `${icon} ${hour}:00 – ${hour + 1}:59\n`
  }

  return message
}
