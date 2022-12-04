import { condenseStatuses } from '../../app/condenseStatuses.js'
import { createStatus } from './helpers.js'

describe('condenseStatuses()', () => {
  it('should handle empty list', () => {
    expect(condenseStatuses([])).toEqual([])
  })

  it('should handle single item list', () => {
    expect(condenseStatuses([createStatus(true, '12:00')])).toEqual([
      createStatus(true, '12:00'),
    ])
  })

  it('should sort and condense status list', () => {
    expect(condenseStatuses([
      createStatus(true,  '1:00'),
      createStatus(false, '6:00'),
      createStatus(false, '19:00'),
      createStatus(true,  '8:00'),
      createStatus(true,  '15:30'),
      createStatus(false, '21:00'),
      createStatus(true,  '15:00'),
      createStatus(true,  '3:00'),
      createStatus(true,  '23:55'),
      createStatus(false, '23:00'),
    ])).toEqual([
      createStatus(true,  '1:00'),
      createStatus(false, '6:00'),
      createStatus(true,  '8:00'),
      createStatus(false, '19:00'),
      createStatus(true,  '23:55'),
    ])
  })
})
