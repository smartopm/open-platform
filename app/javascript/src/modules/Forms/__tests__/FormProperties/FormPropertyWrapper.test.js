import { MockedProvider } from '@apollo/react-testing';
import { Typography } from '@mui/material';
import { render } from '@testing-library/react';
import React from 'react';
import FormPropertyWrapper from '../../components/FormProperties/FormPropertyWrapper';

describe('FormPropertyWrapper', () => {
  it('should render the wrapper properly', () => {
    const props = {
      formPropertiesData: {
        id: '3423213',
      },
      propertyActionData: {
        refetch: jest.fn(),
        categoryId: 'sdhfsds',
        formId: 'sdhfsds',
        formDetailRefetch: jest.fn(),
      },
      editMode: true,
      number: 12,
    };
    const container = render(
      <MockedProvider>
        <FormPropertyWrapper {...props}>
          <Typography>Some Text</Typography>
        </FormPropertyWrapper>
      </MockedProvider>
    );
    expect(container.queryByText('12')).toBeInTheDocument();
    expect(container.queryByText('Some Text')).toBeInTheDocument();
    expect(container.queryByTestId('action_options')).toBeInTheDocument();
  });
});
