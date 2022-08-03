import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import OTPFeedbackScreen from '../../containers/OTPScreen';
import { SendOneTimePasscode } from '../../graphql/mutations';
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('One time password page', () => {
  it('should render correctly', async () => {
    const mocks = [
      {
        request: {
          query: SendOneTimePasscode,
          variables: { userid: '394859wdfsdf' }
        },
        result: {
          data: {
            oneTimeLogin: {
              success: true,
              url: 'http://google.com'
            }
          }
        }
      }
    ];
    const container = render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <MockedThemeProvider>
            <OTPFeedbackScreen />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    expect(container.queryAllByTestId('loader')[0]).toBeInTheDocument()

    await waitFor(() => {
      expect(container.queryByTestId('feedback')).toBeInTheDocument()
    }, 20);
    fireEvent.click(container.queryByTestId('link_copier'));
  });
});
