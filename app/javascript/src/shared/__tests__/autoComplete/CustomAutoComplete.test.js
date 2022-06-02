import React from 'react';
import { render } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import CustomAutoComplete from '../../autoComplete/CustomAutoComplete';

describe('CustomAutoComplete component', () => {
  it('should render correctly', () => {
    const props = {
      onChange: jest.fn(),
      isMultiple: true,
      users: [],
      label: 'search'
    };

    const container = render(
      <MockedProvider>
        <CustomAutoComplete {...props} />
      </MockedProvider>
    );
    expect(container.queryByTestId('autocomplete')).toBeInTheDocument();
  });
});
