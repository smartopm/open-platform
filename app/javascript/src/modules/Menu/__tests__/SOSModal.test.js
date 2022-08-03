import React from 'react';
import { act } from "react-dom/test-utils";
import { render, fireEvent, waitFor } from '@testing-library/react';

import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import SOSModal from '../component/SOSModal';
import authState from '../../../__mocks__/authstate';
import {CancelCommunityEmergencyMutation} from '../graphql/sos_mutation';
import MockedSnackbarProvider from '../../__mocks__/mock_snackbar';

describe('SOSModal component', () => {
  jest.useFakeTimers();
  const bind = jest.fn()
  const setOpen = jest.fn()
  const theme = createTheme();
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

  it('should render properly the sos modal', async() => {
    const container = render(
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <MockedProvider>
            <BrowserRouter>
              <MockedSnackbarProvider>
                <SOSModal open setOpen={setOpen} bind={bind} location={mockGeolocation} {...{ authState }} />
              </MockedSnackbarProvider>
            </BrowserRouter>
          </MockedProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    );

    await waitFor(() => {

    expect(container.queryByTestId('sos-modal')).toBeInTheDocument();
    expect(container.queryByTestId('sos-modal-close-btn')).toBeInTheDocument();
    expect(container.queryByTestId('sos-modal').textContent).toContain('panic_alerts.click_to_call');
    expect(container.queryByTestId('sos-modal').textContent).toContain('panic_alerts.sos_disclaimer_header');
    expect(container.queryByTestId('sos-modal').textContent).toContain('panic_alerts.sos_disclaimer_body');
    expect(container.queryByTestId('sos-modal').textContent).toContain('panic_alerts.press_and_hold');
    expect(container.queryByTestId('sos-modal').textContent).toContain('panic_alerts.for_3_seconds');
    expect(container.queryByTestId('sos-modal-panic-button')).toBeInTheDocument();
    expect(container.queryByTestId('sos-modal-panic-button').textContent).toContain('panic_alerts.sos');  
    })  
  });


  it('should render properly the sos modal and transition after 3 sec long press', async() => {
    const container = render(
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <MockedProvider>
            <BrowserRouter>
              <MockedSnackbarProvider>
                <SOSModal open setOpen={setOpen} location={mockGeolocation} {...{ authState }} />
              </MockedSnackbarProvider>
            </BrowserRouter>
          </MockedProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    );
    expect(container.queryByTestId('sos-modal').textContent).toContain('panic_alerts.for_3_seconds');
    expect(container.queryByTestId('sos-modal-panic-button')).toBeInTheDocument();
    expect(container.queryByTestId('sos-modal-panic-button').textContent).toContain('panic_alerts.sos');

    act(() => {
    fireEvent.mouseDown(container.queryByTestId('sos-modal-panic-button'))
    jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      expect(container.queryByTestId('sos-modal-iam-safe-button')).toBeInTheDocument();
    });
    
  });

  it('should render properly the sos modal and feedback message after iam safe button is pressed', async() => {
    const mocks = [
      {
        request: {
          query: CancelCommunityEmergencyMutation,
          variables: {}
        },
        result: {
          data: {
            communityEmergencyCancel: {
              success: true,
            }
          }
        }
      },
    ]
    const container = render(
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <BrowserRouter>
              <MockedSnackbarProvider>
                <SOSModal open setOpen={setOpen} location={mockGeolocation} {...{ authState }} />
              </MockedSnackbarProvider>
            </BrowserRouter>
          </MockedProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    );
    expect(container.queryByTestId('sos-modal').textContent).toContain('panic_alerts.for_3_seconds');
    expect(container.queryByTestId('sos-modal-panic-button')).toBeInTheDocument();
    expect(container.queryByTestId('sos-modal-panic-button').textContent).toContain('panic_alerts.sos');

    act(() => {
    fireEvent.mouseDown(container.queryByTestId('sos-modal-panic-button'))
    jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      expect(container.queryByTestId('sos-modal-iam-safe-button')).toBeInTheDocument();

      // Click I am Safe Button
      fireEvent.click(container.queryByTestId('sos-modal-iam-safe-button'))
    });
  
    act(() => {
    jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      expect(container.queryByTestId('sos-modal-iam-safe-body')).toBeInTheDocument();
      expect(container.queryByTestId('sos-modal-iam-safe-body').textContent).toContain('panic_alerts.am_safe_feedback_header');
      expect(container.queryByTestId('sos-modal-iam-safe-body').textContent).toContain('panic_alerts.am_safe_feedback_body');
    });

  });

});
