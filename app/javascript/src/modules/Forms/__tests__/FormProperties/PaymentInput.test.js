import React from 'react';
import { render } from '@testing-library/react';

import PaymentInput from '../../components/FormProperties/PaymentInput';

describe('PaymentInput component', () => {
  it('should not break the payment input', () => {
    const props = {
      properties: {
        fieldName: 'Registration Fee',
        required: false,
        shortDesc: '400',
        longDesc: 'I could be this',
      },
      communityCurrency: 'NGN',
    };
    const wrapper = render(<PaymentInput {...props} />);
    expect(wrapper.queryByText('Registration Fee')).toBeInTheDocument();
    expect(wrapper.queryByText('NGN 400')).toBeInTheDocument();
    expect(wrapper.queryByText('I could be this')).toBeInTheDocument();
  });
});
