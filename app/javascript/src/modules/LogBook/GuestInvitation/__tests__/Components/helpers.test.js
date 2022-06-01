import {
  filterEmptyObjectByKey,
  validateGuest,
  formatReoccuringDays,
  validateStartAndEndDate
} from '../../helpers';

describe('helpers', () => {
  it('should remove items that dont have certain keys values', () => {
    const arr = [
      {
        id: '2312',
        name: 'somerandomuser'
      },
      {
        id: '239123',
        name: '312312s'
      },
      {
        id: '',
        name: 'sd'
      }
    ];
    expect(filterEmptyObjectByKey(arr, 'id')).toHaveLength(2);
    expect(filterEmptyObjectByKey(arr, 'id')).toEqual([
      { id: '2312', name: 'somerandomuser' },
      { id: '239123', name: '312312s' }
    ]);
    expect(filterEmptyObjectByKey(arr, 'name')).toHaveLength(3);
  });
  it('should return empty arr if none is provided', () => {
    expect(filterEmptyObjectByKey([], 'id')).toHaveLength(0);
    expect(filterEmptyObjectByKey(null, 'id')).toEqual([]);
  });
  it('validates guests and invitation time', () => {
    const t1 = jest.fn(() => 'invalid');

    expect(validateGuest({ guests: [], userIds: [], t: t1, guestData: {} }).valid).toBe(false);
    expect(validateGuest({ guests: [], userIds: [], t: t1, guestData: {} }).msg).toEqual('invalid');

    expect(
      validateGuest({ guests: [], userIds: ['ajsdhsa'], t: t1, guestData: { startsAt: null } }).msg
    ).toEqual('invalid');
    expect(
      validateGuest({ guests: [], userIds: ['ajsdhsa'], t: t1, guestData: { startsAt: null } })
        .valid
    ).toBe(false);

    expect(
      validateGuest({
        guests: [],
        userIds: ['ajsdhsa'],
        t: t1,
        guestData: { startsAt: new Date() }
      }).msg
    ).toBeNull();
    expect(
      validateGuest({
        guests: [],
        userIds: ['ajsdhsa'],
        t: t1,
        guestData: { startsAt: new Date() }
      }).valid
    ).toBe(true);
  });

  it('formats days', () => {
    const occursOn = ['tuesday', 'monday', 'thursday']
    expect(formatReoccuringDays(occursOn)).toMatchObject([' T ', ' M ', ' T '])
    expect(formatReoccuringDays([])).toBe('-')
  });
  it('validates start and end date and time', () => {
    const t1 = jest.fn(() => 'invalid');

    expect(validateStartAndEndDate({ start: '', end: '', t: t1}).valid).toBe(
      false
    );

    expect(validateStartAndEndDate({ start: '', end: '', t: t1 }).valid).toBe(false);

    expect(
      validateStartAndEndDate({
        start: new Date('2015-03-25T12:00:00Z'),
        end: new Date('2015-03-25T12:00:00Z'),
        t: t1
      }).valid
    ).toBe(false);

    expect(
      validateStartAndEndDate({
        start: new Date('2022-06-01T12:00:00Z'),
        end: new Date('2015-06-01T12:00:00Z'),
        t: t1
      }).valid
    ).toBe(false);

    expect(
      validateStartAndEndDate({
        start: new Date('2022-06-25T12:00:00Z'),
        end: new Date('2022-06-27T12:00:00Z'),
        t: t1
      }).valid
    ).toBe(true);
  });
});
