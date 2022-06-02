import React from 'react';
import { render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import IdCapture from '../../Components/IdCapture';
import { Context } from '../../../../../containers/Provider/AuthStateProvider';
import MockedThemeProvider from '../../../../__mocks__/mock_theme';
import EntryRequestContextProvider from '../../Context';
import { createClient } from '../../../../../utils/apollo';
import authState from '../../../../../__mocks__/authstate';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Id Capture component', () => {
  it('should render correctly', () => {
    const container = render(
      <BrowserRouter>
        <Context.Provider value={authState}>
          <ApolloProvider client={createClient}>
            <MockedThemeProvider>
              <EntryRequestContextProvider value={{ request: { imageUrls: [] } }}>
                <IdCapture handleNext={jest.fn()} />
              </EntryRequestContextProvider>
            </MockedThemeProvider>
          </ApolloProvider>
        </Context.Provider>
      </BrowserRouter>
    );
    expect(container.queryByTestId('add_photo')).toBeInTheDocument();
    expect(container.queryByTestId('upload_area')).toBeInTheDocument();
    expect(container.queryByTestId('save_and_next')).toBeInTheDocument();
    expect(container.queryByTestId('skip_next')).toBeInTheDocument();
    expect(container.queryByTestId('skip_next')).toBeDisabled();
    expect(container.queryByTestId('instructions')).toBeInTheDocument();
  });
});
