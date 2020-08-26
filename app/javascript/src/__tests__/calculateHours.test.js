/* eslint-disable */
import { calculateHoursAndDays } from '../components/TimeTracker/EmployeeTimeSheetLog'

// / multiple short shifts in day
const shiftMock = [
  {
    startedAt: '2020-05-11T11:21:50Z',
    endedAt: '2020-05-11T11:22:18Z'
  },
  {
    startedAt: '2020-05-08T12:06:56Z',
    endedAt: '2020-05-08T14:59:44Z'
  },
  {
    startedAt: '2020-05-08T11:18:28Z',
    endedAt: '2020-05-08T11:19:43Z'
  },
  {
    startedAt: '2020-05-08T11:07:14Z',
    endedAt: '2020-05-08T11:07:15Z'
  }
]
// at least one shift a day
const moreShifts = [
  {
    startedAt: '2020-05-01T11:21:50Z',
    endedAt: '2020-05-02T10:22:18Z'
  },
  {
    startedAt: '2020-05-10T12:06:56Z',
    endedAt: '2020-05-11T11:59:44Z'
  },
  {
    startedAt: '2020-05-09T11:18:28Z',
    endedAt: '2020-05-10T10:19:43Z'
  },
  {
    startedAt: '2020-05-08T11:07:14Z',
    endedAt: '2020-05-09T10:07:15Z'
  }
]

describe('calculate total number of hours and days', () => {
  it('should return 0hrs and 0dys if given empty array of shifts', () => {
    const { days, hours } = calculateHoursAndDays([])
    expect(days).toEqual(0)
    expect(hours).toEqual(0)
  })

  it('should not return 0 when given shifts', () => {
    const { days, hours } = calculateHoursAndDays(shiftMock)
    expect(days).not.toBe(0)
    expect(hours).not.toBe(0)
  })

  it('should return correct number of days based on hours worked on multiple shifts in a day', () => {
    const { days } = calculateHoursAndDays(shiftMock)
    expect(days).toBe(1)
  })
  it('should get correct total number of hours worked on multiple shifts in a day', () => {
    const { hours } = calculateHoursAndDays(shiftMock)
    expect(parseInt(hours)).toBeGreaterThanOrEqual(2)
  })

  it('should get correct total number of days worked when shifts take long', () => {
    const { days } = calculateHoursAndDays(moreShifts)
    expect(days).toBe(4)
  })
  it('should get correct total number of hours worked when shifts are longer', () => {
    const { hours } = calculateHoursAndDays(moreShifts)
    expect(parseInt(hours)).toBeGreaterThanOrEqual(32)
  })
})
