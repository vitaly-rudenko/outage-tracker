import { time } from './utils/date.js'

const HOUR_MS = 60 * 60_000

/**
 * @param {{
 *   dateStart: Date,
 *   dateUntil?: Date,
 *   statuses: import('./status/Status').Status[],
 *   latestStatusBefore?: import('./status/Status').Status,
 *   maxDurationMs: Number,
 * }} input 
 */
export function gatherDailyStats({
  dateStart,
  dateUntil = undefined,
  statuses,
  latestStatusBefore,
  maxDurationMs,
}) {
  const perHour = []
  let onlineMs = 0
  let totalMs = 0

  const hourUntil = dateUntil
    ? Math.floor((time(dateUntil) - time(dateStart)) / (60 * 60_000))
    : 24

  for (let hour = 0; hour < 24; hour++) {
    const thisHourStart = new Date(time(dateStart) + hour * HOUR_MS)
    let nextHourStart = new Date(time(dateStart) + (hour + 1) * HOUR_MS)

    if (dateUntil) {
      if (hour > hourUntil) {
        nextHourStart = thisHourStart
      } else if (hour === hourUntil) {
        nextHourStart = dateUntil
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
