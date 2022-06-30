/* eslint-disable */
import React from 'react';
import { cleanup, render } from '@testing-library/react';
import DatePickerDialog from '../components/DatePickerDialog';
import MockedThemeProvider from '../modules/__mocks__/mock_theme';

describe('Mounts date picker', () => {
  it('Render date component', () => {
    const { getByTestId } = render(
      <MockedThemeProvider>
        <DatePickerDialog
          selectedDate="2020/05/12"
          handleDateChange={jest.fn()}
          label="Expiration Date"
          t={jest.fn()}
        />
      </MockedThemeProvider>
    );

    expect(getByTestId('date-picker')).toBeTruthy();
  });

  it('Render date component with validation error', () => {
    const rendered = render(
      <MockedThemeProvider>
        <DatePickerDialog
          selectedDate="2020/05/12"
          handleDateChange={jest.fn()}
          label="Expiration Date"
          inputValidation={{ error: true, fieldName: 'Expiration Date' }}
          t={jest.fn()}
        />
      </MockedThemeProvider>
    );
    expect(rendered.queryByText('form:errors.required_field')).toBeTruthy();
  });

  afterEach(cleanup);
});
