import { checkInValidRequiredFields, checkRequests, isNotValidCheck } from '../utils';

describe('logbook utils', () => {
  it('check required', () => {
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
    const validity = checkRequests(request1, translate)
    const validityCheck2 = checkRequests(request2, translate)

    expect(validity.valid).toBe(false)
    expect(validity.title).toEqual('invalid')

    expect(validityCheck2.valid).toBe(false)
    expect(validityCheck2.title).toEqual('invalid')
  })

  it('return true for a valid guest', () => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date('2021-05-20 12:51'))

    const req = {
      visitEndDate: '2021-08-01T16:21:10.731Z',
      visitationDate: '2021-05-20 10:40',
      endsAt: '2021-05-20 17:51',
      startsAt: '2021-05-20 11:51',
      occursOn: [],
    }

    const req1 = {
      visitEndDate: '2021-08-01T16:21:10.731Z',
      visitationDate: '2021-08-20 10:40',
      endsAt: '2021-05-20 17:51',
      startsAt: '2021-05-20 11:51',
      occursOn: [],
    }

    const req2 = {
      visitEndDate: '2021-08-01T16:21:10.731Z',
      visitationDate: '2021-05-20 10:40',
      endsAt: '2021-05-20 13:51',
      startsAt: '2021-05-20 12:51',
      occursOn: [],
    }

    const translate = jest.fn(() => 'valid')
    const tz = 'Africa/Lusaka'
    const validity = checkRequests(req, translate, tz)
    expect(validity.valid).toBe(true)
    expect(validity.title).toBe('valid')

    const validity1 = checkRequests(req1, translate, tz)
    expect(validity1.valid).toBe(false)

    const validity2 = checkRequests(req2, translate, tz)
    expect(validity2.valid).toBe(true)
  })
});
