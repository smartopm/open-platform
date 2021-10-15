import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import SOSModal from '../component/SOSModal';
import authState from '../../../__mocks__/authstate';

describe('SOSModal component', () => {
  jest.useFakeTimers();
  const bind = jest.fn()
  const setOpen = jest.fn()
  const callback = jest.fn()
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
    expect(container.queryByTestId('sos-modal-close-btn')).toBeInTheDocument();
    expect(container.queryByTestId('sos-modal').textContent).toContain('panic_alerts.click_to_call');
    expect(container.queryByTestId('sos-modal').textContent).toContain('panic_alerts.sos_disclaimer_header');
    expect(container.queryByTestId('sos-modal').textContent).toContain('panic_alerts.sos_disclaimer_body');
    expect(container.queryByTestId('sos-modal').textContent).toContain('panic_alerts.press_and_hold');
    expect(container.queryByTestId('sos-modal').textContent).toContain('panic_alerts.for_3_seconds');
    expect(container.queryByTestId('sos-modal-panic-button')).toBeInTheDocument();
    expect(container.queryByTestId('sos-modal-panic-button').textContent).toContain('panic_alerts.sos');

    fireEvent.click(container.queryByTestId('sos-modal-panic-button'))
    jest.advanceTimersByTime(4000);
    // expect(container.queryByTestId('sos-modal-iam-safe-button')).toBeInTheDocument();
    
  });

});
