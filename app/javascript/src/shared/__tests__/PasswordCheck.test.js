import { render } from '@testing-library/react';
import React from 'react';
import PasswordCheck from '../PasswordCheck';

describe('PasswordCheck', () => {
  it('should check if PassWord checks are met', () => {
    const value = 'somepassword';
    const mockCheckList = {
      minLength: {
        valid: value.length >= 10,
        message: 'ten_characters',
      },
      specialChar: {
        valid: /[-+_!@#$%^&*.,?]/g.test(value),
        message: 'no_special_character',
      },
      number: {
        valid: /\d/g.test(value),
        message: 'contains_number',
      },
    };
    const wrapper = render(
      <PasswordCheck checks={{ definitions: mockCheckList, rules: Object.keys(mockCheckList) }} />
    );
    expect(wrapper.queryAllByTestId('valid_icon')).toHaveLength(1);
    expect(wrapper.queryAllByTestId('invalid_icon')).toHaveLength(2);
    expect(wrapper.queryByText('ten_characters')).toBeInTheDocument();
    expect(wrapper.queryByText('no_special_character')).toBeInTheDocument();
    expect(wrapper.queryByText('contains_number')).toBeInTheDocument();
  });
});
