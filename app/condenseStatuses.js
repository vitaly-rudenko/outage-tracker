export function condenseStatuses(statuses) {
  const sortedStatuses = [...statuses].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  const condensed = []

  let lastStatus
  for (const status of sortedStatuses) {
    if (!lastStatus || lastStatus.isOnline !== status.isOnline) {
      condensed.push(status)
    }

    lastStatus = status
  }

  return condensed
}
