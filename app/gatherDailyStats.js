import { getStartOfTheDay } from './getStartOfTheDay.js'

export function gatherDailyStats({
  date,
  until = false,
  statuses,
  latestStatusBefore,
  maxDurationMs = Infinity,
}) {
  const perHour = []
  let onlineMs = 0
  let totalMs = 0

  for (let hour = 0; hour < 24; hour++) {
    const thisHourStart = getStartOfTheDay(date)
    thisHourStart.setHours(hour)

    let nextHourStart = getStartOfTheDay(date)
    nextHourStart.setHours(hour + 1)

    if (until) {
      if (hour > date.getHours()) {
        nextHourStart = thisHourStart
      } else if (hour === date.getHours()) {
        nextHourStart = date
      }
    }

    const hourDurationMs = time(nextHourStart) - time(thisHourStart)

    const statusBefore =
      statuses.filter((s) => time(s) < time(thisHourStart)).pop() ||
      latestStatusBefore

    const statusesWithinHour = statuses.filter(
      (s) => time(s) >= time(thisHourStart) && time(s) < time(nextHourStart)
    )

    const spilledMs = statusBefore
      ? Math.min(
          hourDurationMs,
          Math.max(
            0,
            maxDurationMs - (time(thisHourStart) - time(statusBefore))
          )
        )
      : 0
    
    const correctedSpilledMs = Math.min(
      spilledMs,
      time(statusesWithinHour[0] || nextHourStart) - time(thisHourStart)
    )

    let hourOnlineMs = statusBefore?.isOnline ? correctedSpilledMs : 0
    let hourTotalMs = correctedSpilledMs
    for (let i = 0; i < statusesWithinHour.length; i++) {
      const status = statusesWithinHour[i]
      const nextStatus = statusesWithinHour[i + 1]
      const durationMs = Math.min(
        maxDurationMs,
        time(nextStatus || nextHourStart) - time(status)
      )

      hourTotalMs = Math.min(hourDurationMs, hourTotalMs + durationMs)
      if (status.isOnline) {
        hourOnlineMs = Math.min(hourDurationMs, hourOnlineMs + durationMs)
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

function time(dateOrStatus) {
  return getDate(dateOrStatus).getTime()
}

function getDate(dateOrStatus) {
  return 'createdAt' in dateOrStatus ? dateOrStatus.createdAt : dateOrStatus
}
