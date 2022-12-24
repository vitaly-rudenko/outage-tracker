/**
 * @param {{
 *   maxDurationMs: number,
 *   latestStatusBefore?: import('./status/Status').Status,
 *   statuses: import('./status/Status').Status[],
 *   dateStart: Date,
 *   dateUntil: Date
 * }} input
 *
 * @returns {{
 *   maxOnlineMs: number,
 *   maxOfflineMs: number,
 *   averageOnlineMs: number,
 *   averageOfflineMs: number,
 * }}
 */
export function getRecords({
  latestStatusBefore,
  statuses,
  dateStart,
  dateUntil,
  maxDurationMs,
}) {
  const durationList = []

  let startingStatus = latestStatusBefore || statuses[0]
  let durationMs = 0

  for (let i = 0; i < statuses.length; i++) {
    const status = statuses[i]

    // TODO: calculate spill over from previous day
    durationMs += Math.min(
      maxDurationMs,
      status.createdAt.getTime() -
        Math.max(dateStart.getTime(), startingStatus.createdAt.getTime())
    )

    if (status.isOnline !== startingStatus.isOnline) {
      durationList.push({ isOnline: startingStatus.isOnline, durationMs })
      durationMs = 0
    }

    startingStatus = status
  }

  if (startingStatus) {
    const durationMs = Math.min(
      maxDurationMs,
      dateUntil.getTime() -
        Math.max(dateStart.getTime(), startingStatus.createdAt.getTime())
    )
    durationList.push({ isOnline: startingStatus.isOnline, durationMs })
  }

  const onlineList = filterDurations(durationList, true)
  const offlineList = filterDurations(durationList, false)

  return {
    maxOnlineMs: maxDuration(onlineList),
    maxOfflineMs: maxDuration(offlineList),
    averageOnlineMs: averageDuration(onlineList),
    averageOfflineMs: averageDuration(offlineList),
  }
}

function filterDurations(list, isOnline) {
  return list.filter((i) => i.isOnline === isOnline).map((i) => i.durationMs)
}

function maxDuration(list) {
  return list.reduce((result, i) => Math.max(result, i), 0)
}

function averageDuration(list) {
  return list.length > 0
    ? list.reduce((result, i) => result + i, 0) / list.length
    : 0
}
