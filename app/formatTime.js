export function formatTime(ms) {
  if (ms < 60_000) {
    return `${Math.ceil(ms / 1000)} c.`
  }

  const days = Math.floor(ms / (24 * 60 * 60_000))
  const hours = Math.floor(ms / (60 * 60_000)) % 24
  const minutes = Math.floor(ms / 60_000) % 60
  
  return [
    days > 0 ? days : undefined,
    (days > 0 || hours > 0) ? hours : undefined,
    minutes,
  ]
    .filter(v => v !== undefined)
    .map((v, i) => i > 0 ? String(v).padStart(2, '0') : v)
    .join(':') + (days > 0 ? ' дн.' : (hours > 0 ? ' год.' : ' хв.'))
}
