import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import Events from '../Components/Events';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('Should Render Events Component', () => {
  const data = {
    result: [
      {
        id: '1',
        subject: 'user_active',
        sentence: 'User john doe was active',
        createdAt: new Date(),
        timestamp: new Date(),
        data: {
          digital: false,
        },
      },
      {
        id: '2',
        subject: 'user_entry',
        sentence: 'User john doe was recorded leaving',
        createdAt: new Date(),
        timestamp: new Date(),
        data: {},
      },
    ],
  };
  it('should render proper data', async () => {
    const { getByText, queryByText } = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <Events data={data} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByText('log_title.subject')).toBeInTheDocument();
      expect(queryByText('log_title.description')).toBeInTheDocument();
      expect(getByText('user_entry')).toBeInTheDocument();
      expect(getByText('user_active')).toBeInTheDocument();
      expect(getByText('logbook.print_scan')).toBeInTheDocument();
      expect(getByText('User john doe was recorded leaving')).toBeInTheDocument();
      expect(getByText('User john doe was active')).toBeInTheDocument();
    });
  });

  it('should not render any data when no events is provided', () => {
    const emptyData = { result: [] };
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <Events data={emptyData} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    expect(container.queryByText('user_entry')).toBeNull();
    expect(container.queryByText('user_active')).toBeNull();
    expect(container.queryByText('logbook.print_scan')).toBeNull();
    expect(container.queryByText('User john doe was recorded leaving')).toBeNull();
    expect(container.queryByText('User john doe was active')).toBeNull();
  });
});
