import { checkInValidRequiredFields, checkRequests, isNotValidCheck } from '../utils';

describe('check if the required fields are valid', () => {
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
      endTime: '2021-08-31T08:51:44.842Z',
      startTime: '2021-08-31T08:51:44.842Z',
      occursOn: ['sunday', 'monday'],
      visitEndDate: '2021-08-01T16:21:10.731Z'
    }
    const request2 = {
      visitationDate: '2021-08-20T10:51:00+02:00',
      endTime: '2021-08-31T08:51:44.842Z',
      startTime: '2021-08-30T08:51:44.842Z',
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
    jest.setSystemTime(new Date('2021-05-20T10:51:00+02:00'))

    const req = {
      visitEndDate: '2021-08-01T16:21:10.731Z',
      visitationDate: '2021-08-20T10:51:00+02:00',
      endTime: '2021-10-31T02:51:44.842Z',
      startTime: '2021-04-31T11:51:44.842Z',
      occursOn: [],
    }

    const translate = jest.fn(() => 'valid')
    const validity = checkRequests(req, translate)
    expect(validity.valid).toBe(true)
    expect(validity.title).toBe('valid')
  })
});
