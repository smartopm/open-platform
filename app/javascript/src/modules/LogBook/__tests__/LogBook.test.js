import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import LogBook from '../Components/LogBook';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/authstate';
import MockedThemeProvider from '../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('LogBook Component', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  it('renders loader when loading record', async () => {
    window.scrollTo = jest.fn()
    const container = render(
      <MockedProvider>
        <MockedThemeProvider>
          <BrowserRouter>
            <Context.Provider value={userMock}>
              <LogBook />
            </Context.Provider>
          </BrowserRouter>
        </MockedThemeProvider>
      </MockedProvider>
    );
    await waitFor(() => expect(container.queryByTestId('page_title')).toBeInTheDocument());
  });
});
