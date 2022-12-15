export function getTomorrowDate(date) {
  return getOffsetDate(date, 1)
}

export function getOffsetDate(date, days) {
  const offsetDate = new Date(date)
  offsetDate.setDate(offsetDate.getDate() + days)
  return offsetDate
}

export function formatDuration({ ms, localize }) {
  if (ms < 60_000) {
    return localize('duration.seconds', { duration: Math.round(ms / 1000) })
  }

  const days = Math.floor(ms / (24 * 60 * 60_000))
  const hours = Math.floor(ms / (60 * 60_000)) % 24
  const minutes = Math.floor(ms / 60_000) % 60
  
  const duration = [
    days > 0 ? days : undefined,
    (days > 0 || hours > 0) ? hours : undefined,
    minutes,
  ]
    .filter(v => v !== undefined)
    .map((v, i) => i > 0 ? String(v).padStart(2, '0') : v)
    .join(':')

  if (days > 0) {
    return localize('duration.days', { duration })
  }

  if (hours > 0) {
    return localize('duration.hours', { duration })
  }

  return localize('duration.minutes', { duration })
}

export function getStartOfTheDay(date) {
  const updateDate = new Date(date)
  updateDate.setHours(0)
  updateDate.setMinutes(0)
  updateDate.setSeconds(0)
  updateDate.setMilliseconds(0)
  return updateDate
}
