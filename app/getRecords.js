/**
 * @param {{
 *   latestStatusBefore: import('./status/Status').Status,
 *   statuses: import('./status/Status').Status[],
 *   dateUntil: Date
 * }} input
 */
export function getRecords({ latestStatusBefore, statuses, dateUntil }) {
  let maxOnlineMs = 0
  let maxOfflineMs = 0

  let startingStatus = latestStatusBefore || statuses[0]
  for (let i = 0; i < statuses.length; i++) {
    const status = statuses[i]
    if (status.isOnline !== startingStatus.isOnline) {
      const durationMs = status.createdAt.getTime() - startingStatus.createdAt.getTime()

      if (startingStatus.isOnline && durationMs > maxOnlineMs) {
        maxOnlineMs = durationMs
      }

      if (!startingStatus.isOnline && durationMs > maxOfflineMs) {
        maxOfflineMs = durationMs
      }

      startingStatus = status
    }
  }

  if (startingStatus) {
    const durationMs = dateUntil.getTime() - startingStatus.createdAt.getTime()
    if (startingStatus.isOnline && durationMs > maxOnlineMs) {
      maxOnlineMs = durationMs
    }
    if (!startingStatus.isOnline && durationMs > maxOfflineMs) {
      maxOfflineMs = durationMs
    }
  }

  return {
    maxOnlineMs,
    maxOfflineMs,
  }
}
