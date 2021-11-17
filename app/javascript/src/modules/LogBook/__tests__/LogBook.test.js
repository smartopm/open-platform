import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import LogBook from '../Components/LogBook';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/userMock';
import MockedThemeProvider from '../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('LogBook Component', () => {

  it('renders loader when loading record', () => {
    const container = render(
      <MockedProvider>
        <MockedThemeProvider>
          <BrowserRouter>
            <Context.Provider value={userMock}>
              <LogBook match={{ params: { id: '123' } }} history={{ push: jest.fn() }} />
            </Context.Provider>
          </BrowserRouter>
        </MockedThemeProvider>
      </MockedProvider>
    );

    expect(container.queryByTestId('loader')).toBeInTheDocument();
  });
});