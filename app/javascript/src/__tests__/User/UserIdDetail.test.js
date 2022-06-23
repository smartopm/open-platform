import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import IdCardPage, { UserIDDetail } from '../../containers/IdCard';
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';

describe('UserId Detail component', () => {
  const data = {
    user: {
      id: 'a54d6184-b10e-4865-bee7-7957701d423d',
      name: 'Another somebody',
      userType: 'client',
      expiresAt: null
    }
  };
  it('should render correctly', () => {
    const container = render(
      <MockedThemeProvider>
        <UserIDDetail data={data} communityName="Nkwashi" />
      </MockedThemeProvider>
    );
    expect(container.queryByText('Another somebody')).toBeInTheDocument();
    expect(container.queryByText('client')).toBeInTheDocument();
    expect(container.queryByText('misc.visiting_hours')).toBeInTheDocument();
    expect(container.queryByText('common:misc.expiration: misc.never')).toBeInTheDocument();
    expect(container.queryByText('qr_code.message')).toBeInTheDocument();
    expect(container.queryByTestId('visiting_hours').textContent).toContain(
      'days:days.sunday: misc.off'
    );
    expect(container.queryByTestId('visiting_hours').textContent).toContain(
      'days:days.saturday: 8:00 - 12:00'
    );
    expect(container.queryByTestId('visiting_hours').textContent).toMatch(
      'days:days.monday -days:days.friday: 8:00 - 16:00'
    );
  });

  it('should hide visiting hours for CM', () => {
    const container = render(
      <MockedThemeProvider>
        <UserIDDetail data={data} communityName="Ciudad Morazán" />
      </MockedThemeProvider>
    );
    expect(container.queryByText('Another somebody')).toBeInTheDocument();
    expect(container.queryByText('client')).toBeInTheDocument();
    expect(container.queryByText('common:misc.expiration: misc.never')).toBeInTheDocument();
    expect(
      container.queryByText('Please note the main gate visiting hours:')
    ).not.toBeInTheDocument();
    expect(container.queryByText('qr_code.message')).toBeInTheDocument();
    expect(container.queryByTestId('visiting_hours')).toBeNull();
    expect(container.queryByTestId('visiting_hours')).toBeNull();
    expect(container.queryByTestId('visiting_hours')).toBeNull();
  });

  //   test the mother component here
  it('renders id card page', async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <IdCardPage />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(container.queryByTestId('loader')).toBeInTheDocument();
    });
  });
});
