import { Status } from '../app/status/Status.js'

export const dateStart = new Date('2020-01-02 0:00')
export const nextDateStart = new Date('2020-01-03 0:00')

export function createStatus(isOnline, time, date = '2020-01-02') {
  return new Status({
    isOnline,
    createdAt: new Date(`${date} ${time}`)
  })
}

export function createLatestStatusBefore(isOnline, time = '23:00') {
  return createStatus(isOnline, time, '2020-01-01')
}
