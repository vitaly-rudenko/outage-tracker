export function getTomorrowDate(date) {
  return getOffsetDate(date, 1)
}

export function getOffsetDate(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60_000)
}

export function formatDuration({ ms, localize }) {
  if (ms < 60_000) {
    return localize('duration.seconds', { duration: Math.round(ms / 1000) })
  }

  const hours = Math.floor(ms / (60 * 60_000))
  const minutes = Math.floor(ms / 60_000) % 60

  const duration = [hours > 0 ? hours : undefined, minutes]
    .filter((v) => v !== undefined)
    .map((v, i) => (i > 0 ? String(v).padStart(2, '0') : v))
    .join(':')

  if (hours > 0) {
    return localize('duration.hours', { duration })
  }

  return localize('duration.minutes', { duration })
}

/**
 * @param {Date} date 
 * @param {number} timezoneOffsetMinutes 
 */
export function getStartOfTheDay(date, timezoneOffsetMinutes) {
  const offsetDate = new Date(date.getTime() - timezoneOffsetMinutes * 60_000)

  return new Date(
    Date.UTC(
      offsetDate.getUTCFullYear(),
      offsetDate.getUTCMonth(),
      offsetDate.getUTCDate(),
      0,
      timezoneOffsetMinutes,
      0,
      0,
    )
  )
}

export function time(dateOrStatus) {
  return getDate(dateOrStatus).getTime()
}

export function getDate(dateOrStatus) {
  return 'createdAt' in dateOrStatus ? dateOrStatus.createdAt : dateOrStatus
}
