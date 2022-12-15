export function getAggregatedIcon({ onlineMs, totalMs }) {
  if (totalMs === 0) {
    return '⬜'
  }

  const percentage = onlineMs / totalMs
  if (percentage >= 0.95) {
    return '🟩'
  } else if (percentage >= 0.5) {
    return '🟨'
  } else if (percentage >= 0.05) {
    return '🟧'
  }

  return '🟥'
}