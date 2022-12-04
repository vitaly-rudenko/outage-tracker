import { formatTime } from '../../app/formatTime.js'

describe('formatTime()', () => {
  it('should format time', () => {
    expect(formatTime(0)).toEqual('00:00')
    expect(formatTime(60_000)).toEqual('00:01')
    expect(formatTime(60 * 60_000)).toEqual('01:00')
    expect(formatTime(12 * 60 * 60_000 + 35 * 60_000)).toEqual('12:35')
  })
})