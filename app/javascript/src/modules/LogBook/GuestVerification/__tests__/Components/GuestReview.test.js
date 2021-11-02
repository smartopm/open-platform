import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import RequestConfirmation from '../../Components/GuestReview';
import { Context } from '../../../../../containers/Provider/AuthStateProvider';
import MockedThemeProvider from '../../../../__mocks__/mock_theme';
import userMock from '../../../../../__mocks__/userMock';
import { EntryRequestContext } from '../../Context';
import { createClient } from '../../../../../utils/apollo';

describe('Review component', () => {
  it('should render correctly', () => {
    const container = render(
      <BrowserRouter>
        <Context.Provider value={userMock}>
          <ApolloProvider client={createClient}>
            <MockedThemeProvider>
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
            </MockedThemeProvider>
          </ApolloProvider>
        </Context.Provider>
      </BrowserRouter>
    );
    expect(container.queryByTestId('user-info')).toBeInTheDocument();
    expect(container.queryByTestId('edit-info')).toBeInTheDocument();
    expect(container.queryByTestId('user-details')).toBeInTheDocument();
    expect(container.queryByTestId('image-area')).toBeInTheDocument();
    expect(container.queryByTestId('video-area')).toBeInTheDocument();
    expect(container.queryByTestId('submit')).toBeInTheDocument();

    fireEvent.click(container.queryByTestId('submit'))
  });

  it('should test when image and video is null', () => {
    const container = render(
      <BrowserRouter>
        <Context.Provider value={userMock}>
          <ApolloProvider client={createClient}>
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
          </ApolloProvider>
        </Context.Provider>
      </BrowserRouter>
    );
    expect(container.queryByTestId('no-image')).toBeInTheDocument();
    expect(container.queryByTestId('no-video')).toBeInTheDocument();
  });
});
