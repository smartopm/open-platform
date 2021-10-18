import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import IdCapture from '../../Components/IdCapture';
import { Context } from '../../../../../containers/Provider/AuthStateProvider';
import MockedThemeProvider from '../../../../__mocks__/mock_theme';
import userMock from '../../../../../__mocks__/userMock'
import EntryRequestContextProvider from '../../Context';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Id Capture component', () => {
  it('should render correctly', () => {
    const container = render(
      <BrowserRouter>
        <EntryRequestContextProvider value={{ guest: { imageUrls: [] } }}>
          <MockedProvider>
            <MockedThemeProvider>
              <Context.Provider value={userMock}>
                <IdCapture handleNext={jest.fn()} />
              </Context.Provider>
            </MockedThemeProvider>
          </MockedProvider>
        </EntryRequestContextProvider>
      </BrowserRouter>
    );
    expect(container.queryByTestId('add_photo')).toBeInTheDocument();
    expect(container.queryByTestId('upload_area')).toBeInTheDocument();
    expect(container.queryByTestId('save_and_next')).toBeInTheDocument();
    expect(container.queryByTestId('skip_next')).toBeInTheDocument();
    expect(container.queryByTestId('instructions')).toBeInTheDocument();
  });
});
