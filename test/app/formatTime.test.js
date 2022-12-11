import { formatTime } from '../../app/formatTime.js'

describe('formatTime()', () => {
  it('should format time', () => {
    expect(formatTime(0)).toEqual('0 хвилин')
    expect(formatTime(60_000)).toEqual('1 хвилин')
    expect(formatTime(60 * 60_000)).toEqual('1:00 годин')
    expect(formatTime(12 * 60 * 60_000 + 35 * 60_000)).toEqual('12:35 годин')
    expect(formatTime(24 * 60 * 60_000 + 35 * 60_000)).toEqual('1:00:35 днів')
    expect(formatTime(7 * 24 * 60 * 60_000 + 7 * 60 * 60_000 + 35 * 60_000)).toEqual('7:07:35 днів')
  })
})