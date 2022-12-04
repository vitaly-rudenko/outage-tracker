export function gatherDailyStats({ date, until = false, statuses, latestStatusBefore }) {
  statuses.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  const perHour = []
  let totalOnlineMs = 0
  for (let hour = 0; hour < 24; hour++) {
    if (until && hour > date.getHours()) {
      perHour.push({ hour, onlineMs: -1 })
      continue
    }

    const minDate = new Date(date)
    minDate.setHours(hour)
    minDate.setMinutes(0)
    minDate.setSeconds(0)
    minDate.setMilliseconds(0)

    const maxDate = new Date(date)
    maxDate.setHours(hour + 1)
    maxDate.setMinutes(0)
    maxDate.setSeconds(0)
    maxDate.setMilliseconds(0)

    const statusBefore = statuses.filter(s => s.createdAt.getTime() < minDate.getTime()).pop()
    const statusesInBetween = statuses.filter(s => s.createdAt.getTime() >= minDate.getTime() && s.createdAt.getTime() < maxDate.getTime())
    const startedOnline = statusBefore
      ? statusBefore.isOnline
      : latestStatusBefore
        ? latestStatusBefore.isOnline
        : statusesInBetween.length > 0
          ? !statusesInBetween[0].isOnline
          : true

    let onlineMs = 0
    for (let i = 0; i < statusesInBetween.length; i++) {
      const status = statusesInBetween[i]
      if (status.isOnline) continue

      const previousStatus = statusesInBetween[i - 1]
      if (previousStatus) {
        onlineMs += status.createdAt.getTime() - previousStatus.createdAt.getTime()
      } else if (startedOnline) {
        onlineMs += status.createdAt.getTime() - minDate.getTime()
      }
    }

    if (statusesInBetween.length === 0 && startedOnline) {
      onlineMs = 60 * 60_000
    }

    if (statusesInBetween.length > 0) {
      const lastStatus = statusesInBetween[statusesInBetween.length - 1]
      if (lastStatus.isOnline) {
        onlineMs += maxDate.getTime() - lastStatus.createdAt.getTime()
      }
    }

    if (until && hour === date.getHours()) {
      onlineMs = Math.min(onlineMs, date.getMinutes() * 60_000 + date.getSeconds() * 1000 + date.getMilliseconds())
    }

    totalOnlineMs += onlineMs

    perHour.push({ hour, onlineMs })
  }

  return {
    perHour,
    totalOnlineMs,
  }
}
