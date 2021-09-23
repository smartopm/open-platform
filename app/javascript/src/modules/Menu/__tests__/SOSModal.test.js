import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import SOSModal from '../component/SOSModal';
import authState from '../../../__mocks__/authstate';

describe('SOSModal component', () => {
  const bind = jest.fn()
  const setOpen = jest.fn
  const theme = createMuiTheme();
  const mockGeolocation = {
    getCurrentPosition: jest.fn()
      .mockImplementationOnce((success) => Promise.resolve(success({
        coords: {
          latitude: 51.1,
          longitude: 45.3
        }
      }))),
      watchPosition: jest.fn(),
  };
  global.navigator.geolocation = mockGeolocation;

  it('should render properly the sos modal', () => {
    const container = render(
      <ThemeProvider theme={theme}>
        <MockedProvider>
          <BrowserRouter>
            <SOSModal open setOpen={setOpen} bind={bind} location={mockGeolocation} {...{ authState }} />
          </BrowserRouter>
        </MockedProvider>
      </ThemeProvider>
    );

    expect(container.queryByTestId('sos-modal')).toBeInTheDocument();
    expect(container.queryByTestId('sos-modal').textContent).toContain('panic_alerts.press_for_3_seconds');
  });

});
