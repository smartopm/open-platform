import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import PasswordInput from '../PasswordInput';

describe('PasswordInput', () => {
  it('should check for PassWord Input fields', () => {
    const mock = jest.fn();
    const wrapper = render(
      <PasswordInput
        label="Initial Password"
        passwordValue={{ showPassword: false, password: 'somevalue' }}
        type="password"
        setPasswordValue={mock}
      />
    );
    expect(wrapper.queryAllByText('Initial Password')[0]).toBeInTheDocument();
    expect(wrapper.queryByTestId('toggle_password')).toBeInTheDocument();
    fireEvent.click(wrapper.queryByTestId('toggle_password'));
    expect(mock).toBeCalled();
    fireEvent.change(wrapper.queryByTestId('password_input'));
    expect(mock).toBeCalled();
  });
});
