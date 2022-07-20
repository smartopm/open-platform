import React from 'react';
import { render } from '@testing-library/react';
import AppointmentInput from '../../components/FormProperties/AppointmentInput';

describe('AppointmentInput component', () => {
  it('should not break the payment input', () => {
    const props = {
      properties: {
        fieldName: 'Registration Link',
        longDesc: 'I could be this',
      },
    };
    const wrapper = render(<AppointmentInput {...props} />);
    expect(wrapper.queryByText('Registration Link')).toBeInTheDocument();
    expect(wrapper.queryByText('I could be this')).toBeInTheDocument();
  });
});
