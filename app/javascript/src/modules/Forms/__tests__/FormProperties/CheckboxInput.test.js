import React from 'react';
import { render } from '@testing-library/react';

import CheckboxInput from '../../components/FormProperties/CheckboxInput';

describe('Checkbox component', () => {
  it('should render properly', () => {
    const props = {
      handleValue: jest.fn(),
      properties: {
        fieldName: 'Select your favorite colors',
        required: true,
        fieldType: 'checkbox',
        fieldValue: [
          {
            value: 'Red',
            label: 'Red'
          },
          {
            value: 'Green',
            label: 'Green'
          },
          {
            value: 'Blue',
            label: 'Blue'
          }
        ],
        id: '3145c47e-1234-1193-9dac-dc723d2e',
        groupingId: '3145c47e-1001-9dac',
        adminUse: false,
        order: '1'
      }
    };

    const wrapper = render(<CheckboxInput {...props} />);
    expect(wrapper.queryAllByText('Select your favorite colors *')[0]).toBeInTheDocument();
    expect(wrapper.queryAllByText('Green')[0]).toBeInTheDocument();
    expect(wrapper.queryAllByText('Red')[0]).toBeInTheDocument();
    expect(wrapper.queryAllByText('Blue')[0]).toBeInTheDocument();
  });

  it('should show validation error message', () => {
    const props = {
      handleValue: jest.fn(),
      properties: {
        fieldName: 'Select your favorite colors',
        required: true,
        fieldType: 'checkbox',
        fieldValue: [
          {
            value: 'Red',
            label: 'Red'
          },
          {
            value: 'Green',
            label: 'Green'
          },
          {
            value: 'Blue',
            label: 'Blue'
          }
        ],
        id: '3145c47e-1234-1193-9dac-dc723d2e',
        groupingId: '3145c47e-1001-9dac',
        adminUse: false,
        order: '1'
      }
    };

    const wrapper = render(<CheckboxInput {...props} inputValidation={{error: true}} />);
    expect(wrapper.queryByTestId('error-msg')).toBeInTheDocument();
    expect(wrapper.queryByText('errors.required_field')).toBeInTheDocument()
  });
});
