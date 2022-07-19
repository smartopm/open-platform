import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import RequestConfirmation from '../../Components/GuestReview';
import { Context } from '../../../../../containers/Provider/AuthStateProvider';
import MockedThemeProvider from '../../../../__mocks__/mock_theme';
import userMock from '../../../../../__mocks__/authstate';
import { EntryRequestContext } from '../../Context';
import MockedSnackbarProvider from '../../../../__mocks__/mock_snackbar';

describe('Review component', () => {
  it('should render correctly', async () => {
    const container = render(
      <BrowserRouter>
        <Context.Provider value={userMock}>
          <MockedProvider>
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <EntryRequestContext.Provider
                  value={{
                    request: {
                      id: 'somew2923',
                      name: 'sme name',
                      email: 'email@email.com',
                      primaryNumber: '1234456',
                      imageUrls: ['sample1', 'sample2'],
                      videoUrl: 'sample3'
                    },
                    isGuestRequest: false
                  }}
                >
                  
                  <RequestConfirmation handleGotoStep={jest.fn()} />
                </EntryRequestContext.Provider>
              </MockedSnackbarProvider>
            </MockedThemeProvider>
          </MockedProvider>
        </Context.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(container.queryByTestId('user-info')).toBeInTheDocument();
      expect(container.queryByTestId('edit-info')).toBeInTheDocument();
      expect(container.queryByTestId('user-details')).toBeInTheDocument();
      expect(container.queryByTestId('image-area')).toBeInTheDocument();
      expect(container.queryByTestId('video-area')).toBeInTheDocument();
      expect(container.queryByTestId('submit')).toBeInTheDocument();
  
      fireEvent.click(container.queryByTestId('submit'))
    }, 10)
  });

  it('should test when image and video is null', async () => {
    const container = render(
      <BrowserRouter>
        <Context.Provider value={userMock}>
          <MockedProvider>
            <MockedThemeProvider>
              <EntryRequestContext.Provider
                value={{
                  request: {
                    id: 'somew2923',
                    name: 'sme name',
                    email: 'email@email.com',
                    primaryNumber: '1234456',
                  },
                  isGuestRequest: false
                }}
              >
                <RequestConfirmation handleGotoStep={jest.fn()} />
              </EntryRequestContext.Provider>
            </MockedThemeProvider>
          </MockedProvider>
        </Context.Provider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(container.queryByTestId('no-image')).toBeInTheDocument();
      expect(container.queryByTestId('no-video')).toBeInTheDocument();
    }, 10)
  });
});
