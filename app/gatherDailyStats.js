export function gatherDailyStats({
  date,
  until = false,
  statuses,
  latestStatusBefore,
}) {
  statuses.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  const startOfTheDay = new Date(date)
  startOfTheDay.setHours(0)
  startOfTheDay.setMinutes(0)
  startOfTheDay.setSeconds(0)
  startOfTheDay.setMilliseconds(0)

  const startingStatusDate = latestStatusBefore
    ? startOfTheDay
    : statuses[0]?.createdAt

  const perHour = []
  let onlineMs = 0
  let totalMs = 0
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

    const statusBefore = statuses
      .filter((s) => s.createdAt.getTime() < minDate.getTime())
      .pop()
    const statusesInBetween = statuses.filter(
      (s) =>
        s.createdAt.getTime() >= minDate.getTime() &&
        s.createdAt.getTime() < maxDate.getTime()
    )
    const startedOnline = statusBefore
      ? statusBefore.isOnline
      : latestStatusBefore
      ? latestStatusBefore.isOnline
      : false

    let hourOnlineMs = 0
    for (let i = 0; i < statusesInBetween.length; i++) {
      const status = statusesInBetween[i]
      if (status.isOnline) continue

      const previousStatus = statusesInBetween[i - 1]
      if (previousStatus) {
        hourOnlineMs +=
          status.createdAt.getTime() - previousStatus.createdAt.getTime()
      } else if (startedOnline) {
        hourOnlineMs += status.createdAt.getTime() - minDate.getTime()
      }
    }

    if (statusesInBetween.length === 0 && startedOnline) {
      hourOnlineMs = 60 * 60_000
    }

    let hourStartMs = 0
    let hourEndMs = 60 * 60_000

    if (!startingStatusDate || hour < startingStatusDate.getHours()) {
      hourStartMs = 60 * 60_000
    } else if (startingStatusDate && hour === startingStatusDate.getHours()) {
      hourStartMs = toWithinHourMs(startingStatusDate)
    }

    if (until) {
      if (hour === date.getHours()) {
        hourEndMs = toWithinHourMs(date)
      } else if (hour > date.getHours()) {
        hourEndMs = 0
      }
    }

    const hourTotalMs = Math.max(0, hourEndMs - hourStartMs)

    if (statusesInBetween.length > 0) {
      const lastStatus = statusesInBetween[statusesInBetween.length - 1]
      if (lastStatus.isOnline) {
        hourOnlineMs += hourEndMs - toWithinHourMs(lastStatus.createdAt)
      }
    }

    hourOnlineMs = Math.min(hourOnlineMs, hourTotalMs)
    onlineMs += hourOnlineMs
    totalMs += hourTotalMs

    perHour.push({ hour, onlineMs: hourOnlineMs, totalMs: hourTotalMs })
  }

  return {
    perHour,
    onlineMs,
    totalMs,
  }
}

function toWithinHourMs(date) {
  return date.getMinutes() * 60_000 + date.getSeconds() * 1000 + date.getMilliseconds()
}
