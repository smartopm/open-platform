import { checkInValidRequiredFields, isNotValidCheck } from '../utils';

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
});
