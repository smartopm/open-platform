import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import StatsPage from '../../containers/User/StatsPage';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Stat Page component', () => {
  it('should render correctly', async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <StatsPage />
        </BrowserRouter>
      </MockedProvider>
    );
    expect(container.queryByText('User Stats')).toBeInTheDocument();
  });
});
