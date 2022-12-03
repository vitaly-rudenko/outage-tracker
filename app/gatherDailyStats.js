export function gatherDailyStats(date, dailyStatuses, lastStatusBefore) {
  dailyStatuses.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  const perHour = []
  let totalOnlineMs = 0
  for (let hour = 0; hour < 24; hour++) {
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

    const statusBefore = dailyStatuses.filter(s => s.createdAt.getTime() < minDate.getTime()).pop()
    const statusesInBetween = dailyStatuses.filter(s => s.createdAt.getTime() >= minDate.getTime() && s.createdAt.getTime() < maxDate.getTime())
    const startedOnline = statusBefore
      ? statusBefore.isOnline
      : lastStatusBefore
        ? lastStatusBefore.isOnline
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

    totalOnlineMs += onlineMs

    perHour.push({ hour, onlineMs })
  }

  return {
    perHour,
    totalOnlineMs,
  }
}
