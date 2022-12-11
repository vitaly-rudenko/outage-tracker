export function getStartOfTheDay(date) {
  const updateDate = new Date(date)
  updateDate.setHours(0)
  updateDate.setMinutes(0)
  updateDate.setSeconds(0)
  updateDate.setMilliseconds(0)
  return updateDate
}
