import { Status } from '../../app/Status.js'

export const today = new Date('2020-01-02')

export function createStatus(isOnline, time, date = '2020-01-02') {
  return new Status({
    isOnline,
    createdAt: new Date(`${date} ${time}`)
  })
}

export function createLastStatusBefore(isOnline, time = '23:00') {
  return createStatus(isOnline, time, '2020-01-01')
}
