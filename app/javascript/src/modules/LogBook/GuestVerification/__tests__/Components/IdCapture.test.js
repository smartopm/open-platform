import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import IdCapture from '../../Components/IdCapture';
import { Context } from '../../../../../containers/Provider/AuthStateProvider';
import MockedThemeProvider from '../../../../__mocks__/mock_theme';
import userMock from '../../../../../__mocks__/userMock'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Id Capture component', () => {
  it('should render correctly', () => {
    const container = render(
      <Context.Provider value={userMock}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <IdCapture />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );
    expect(container.queryByTestId('add_photo')).toBeInTheDocument();
    expect(container.queryByTestId('upload_area')).toBeInTheDocument();
    expect(container.queryByTestId('next_button')).toBeInTheDocument();
    expect(container.queryByTestId('instructions')).toBeInTheDocument();
  });
});
