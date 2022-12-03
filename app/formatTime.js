export function formatTime(ms) {
  const hours = Math.floor(ms / (60 * 60_000))
  const minutes = Math.floor(ms / 60_000) % 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}
