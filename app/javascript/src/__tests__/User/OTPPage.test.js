import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import OTPFeedbackScreen from '../../containers/OTPScreen';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('One time password page', () => {
  const location = {
      state: { success: true, user: 'User name', url: "http://google.com" }
  }
  it('should render correctly', async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <OTPFeedbackScreen location={location} />
        </BrowserRouter>
      </MockedProvider>
    );
    expect(container.queryByText('User name')).toBeInTheDocument();
    expect(container.queryByText('http://google.com')).toBeInTheDocument();
    expect(container.queryByTestId('feedback').textContent).toContain('The One Time Pass code was successfully sent')
    
    fireEvent.click(container.queryByTestId('link_copier'))
  });
});
