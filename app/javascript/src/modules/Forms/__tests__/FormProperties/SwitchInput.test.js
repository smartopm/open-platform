import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import SwitchInput from '../../components/FormProperties/SwitchInput'
import MockedThemeProvider from '../../../__mocks__/mock_theme';

describe('SwitchInput component', () => {
  const props = {
    name: 'public',
    label: 'Make Public with QR',
    value: true,
    handleChange: jest.fn(),
    labelPlacement: 'start',
    className: 'hello',
    toolTip: 'Make form public'
  };

  it('should render the switch component with toolTip', async () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider mocks={[]}>
          <MockedThemeProvider>
            <SwitchInput {...props} />
          </MockedThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(container.queryByText('Make Public with QR')).toBeInTheDocument();
      expect(container.queryByTestId('HelpCenterRoundedIcon')).toBeInTheDocument();


      fireEvent.change(container.queryByText('Make Public with QR'), {
        target: { checked: true }
      });
      expect(container.queryByText('Make Public with QR').checked).toBe(true);
    });
  });

  it('should render the switch component without toolTip',
    async () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider mocks={[]}>
          <MockedThemeProvider>
            <SwitchInput {...props} toolTip={null} />
          </MockedThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(container.queryByText('Make Public with QR')).toBeInTheDocument();
      expect(container.queryByTestId('HelpCenterRoundedIcon')).not.toBeInTheDocument();
    });
  });
});