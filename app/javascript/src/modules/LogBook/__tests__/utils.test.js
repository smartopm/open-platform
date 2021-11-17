import { checkInValidRequiredFields, checkRequests, findClosestEntry, IsAnyRequestValid, isNotValidCheck } from '../utils';

describe('logbook utils', () => {
  const tz = 'Africa/Lusaka'
  it('checks required fields', () => {
    const initialState = {
      name: '',
      phoneNumber: '',
      nrc: '',
      vehiclePlate: ''
    };
    const requiredFields = ['name', 'nrc'];
    expect(checkInValidRequiredFields(initialState, requiredFields)).toBe(true);
    expect(isNotValidCheck('something')).toBe(false);
  });

  it('checks if the invited guest is valid', () => {
    const request1 = {
      visitationDate: '2021-08-20T10:51:00+02:00',
      endsAt: '2021-08-31T08:51:44.842Z',
      startsAt: '2021-08-31T08:51:44.842Z',
      occursOn: ['sunday', 'monday'],
      visitEndDate: '2021-08-01T16:21:10.731Z'
    }
    const request2 = {
      visitationDate: '2021-08-20T10:51:00+02:00',
      endsAt: '2021-08-31T08:51:44.842Z',
      startsAt: '2021-08-30T08:51:44.842Z',
      occursOn: [],
      visitEndDate: '2021-08-01T16:21:10.731Z'
    }
    const translate = jest.fn(() => 'invalid')
    const validity = checkRequests(request1, translate, tz)
    const validityCheck2 = checkRequests(request2, translate, tz)

    expect(validity.valid).toBe(false)
    expect(validity.title).toEqual('invalid')

    expect(validityCheck2.valid).toBe(false)
    expect(validityCheck2.title).toEqual('invalid')
  })

  it('returns true for a valid guest', () => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date('2021-05-20 12:51'))

    const req = {
      visitEndDate: '2021-08-01T16:21:10.731Z',
      visitationDate: '2021-05-20T10:40:00.000Z',
      endsAt: '2021-05-20T17:51:00.000Z',
      startsAt: '2021-05-20T11:51:00.000Z',
      occursOn: [],
    }

    const req1 = {
      visitEndDate: '2021-08-01T16:21:10.731Z',
      visitationDate: '2021-08-20T10:40:00.000Z',
      endsAt: '2021-05-20T17:51:00.000Z',
      startsAt: '2021-05-20T11:51:00.000Z',
      occursOn: [],
    }
    // same date but expired time
    const req3 = {
      visitEndDate: '2021-08-01T16:21:10.731Z',
      visitationDate: '2021-05-20T10:40:00.000Z',
      endsAt: '2021-05-20T07:51:00.000Z',
      startsAt: '2021-05-20T09:51:00.000Z',
      occursOn: [],
    }

    const translate = jest.fn(() => 'valid')

    const validity = checkRequests(req, translate, tz)
    expect(validity.valid).toBe(true)
    expect(validity.title).toBe('valid')

    const validity1 = checkRequests(req1, translate, tz)
    expect(validity1.valid).toBe(false)

    const validity3 = checkRequests(req3, translate, tz)
    expect(validity3.valid).toBe(false)
  })

  it('another mocked separately', () => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date('2021-05-20 13:00'))
    const req2 = {
      visitEndDate: '2021-08-01T16:21:10.731Z',
      visitationDate: '2021-05-20T10:40:00.000Z',
      endsAt: '2021-05-20T13:51:00.000Z',
      startsAt: '2021-05-20T12:51:00.000Z',
      occursOn: [],
    }
    const translate = jest.fn(() => 'valid')
    const validity2 = checkRequests(req2, translate, tz)
    expect(validity2.valid).toBe(true)
  })

  it('checks if any of the entries is valid', () => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date('2021-05-20 13:00'))

    const entries = [
      {
        visitEndDate: '2021-08-01T16:21:10.731Z',
        visitationDate: '2021-04-20T19:40:00.000Z',
        endsAt: '2021-05-20T13:51:00.000Z',
        startsAt: '2021-05-20T12:51:00.000Z',
        occursOn: [],
      },
      // this is the only valid and the closest to today [2021-05-20 13:00]
      {
        visitEndDate: '2021-08-01T16:21:10.731Z',
        visitationDate: '2021-05-20T10:40:00.000Z',
        endsAt: '2021-05-21T13:51:00.000Z',
        startsAt: '2021-05-20T12:51:00.000Z',
        occursOn: [],
      },
      {
        visitEndDate: '2021-08-01T16:21:10.731Z',
        visitationDate: '2020-03-20T10:40:00.000Z',
        endsAt: '2021-05-20T13:51:00.000Z',
        startsAt: '2021-05-20T12:51:00.000Z',
        occursOn: [],
      },
    ]
    const nullEntries = null
    const emptyEntries = []
    const translate = jest.fn(() => 'valid')
    const validity2 = IsAnyRequestValid(entries, translate, tz)
    expect(validity2).toBe(true)

    // check the closest date
    const closestDate = findClosestEntry(entries, tz)
    const anotherClosestDate = findClosestEntry(nullEntries, tz)
    const anotherClosestDate2 = findClosestEntry(emptyEntries, tz)
    expect(closestDate.visitationDate).toEqual('2021-05-20T10:40:00.000Z')
    expect(anotherClosestDate).toEqual([])
    expect(anotherClosestDate2).toEqual([])
  })
});