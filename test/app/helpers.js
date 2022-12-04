import { Status } from '../../app/Status.js'

export const today = new Date('2020-01-02')

export function createStatus(isOnline, time, date = '2020-01-02') {
  return new Status({
    raw: {},
    userId: '',
    isOnline,
    createdAt: new Date(`${date} ${time}`)
  })
}

export function createLastStatusBefore(isOnline) {
  return createStatus(isOnline, '23:00', '2020-01-01')
}
