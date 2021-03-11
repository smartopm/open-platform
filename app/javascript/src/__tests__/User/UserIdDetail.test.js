import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import IdCardPage, { UserIDDetail } from '../../containers/IdCard';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('UserId Detail component', () => {
  const data = {
    user: {
      id: 'a54d6184-b10e-4865-bee7-7957701d423d',
      name: 'Another somebodyy',
      userType: 'client',
      expiresAt: null
    }
  };
  it('should render correctly', () => {
    const container = render(<UserIDDetail data={data} />);
    expect(container.queryByText('Another somebodyy')).toBeInTheDocument();
    expect(container.queryByText('client')).toBeInTheDocument();
    expect(container.queryByText('Please note the main gate visiting hours:')).toBeInTheDocument();
    expect(container.queryByText('Expiration: Never')).toBeInTheDocument();
    expect(container.queryByText('This "QR Code" is a unique identifier for you Nkwashi account and can be used at the main gate instead of writing your contact information manually. Our goal is to provide fast, easy and secure access.')).toBeInTheDocument();
    expect(container.queryByTestId('visiting_hours').textContent).toContain('Sunday: Off')
    expect(container.queryByTestId('visiting_hours').textContent).toContain('Saturday: 8:00 - 12:00')
    expect(container.queryByTestId('visiting_hours').textContent).toContain('Monday - Friday: 8:00 - 16:00')
  });

//   test the mother component here
it('renders id card page ', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <IdCardPage />
        </BrowserRouter>
      </MockedProvider>
    );
    expect(container.queryByTestId('loader')).toBeInTheDocument();
  });
});
