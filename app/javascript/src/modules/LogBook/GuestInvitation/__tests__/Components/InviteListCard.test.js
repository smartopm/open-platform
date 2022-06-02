import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import MockedThemeProvider from '../../../../__mocks__/mock_theme';
import InviteListCard from '../../Components/InviteListCard';
import { Context } from '../../../../../containers/Provider/AuthStateProvider';
import userMock from '../../../../../__mocks__/authstate';

describe('Invitation Card Component', () => {
  it('should render Invitation List Card component', () => {
    const invitation = {
      id: '4af00f39-7fcd-47d2-89bf-e93827d34666',
      status: 'active',
      host: {
        id: '1388d45c-5279-4e90-9815-8ab33c49d382',
        name: 'Test two',
        imageUrl: null,

      },
      entryTime: {
        id: '1841e4dc-0e7c-4297-be0b-3c00db12a668',
        occursOn: [],
        visitEndDate: null,
        visitationDate: '2021-11-30T11:54:00Z',
        endsAt: '2021-11-01T21:15:29Z',
        startsAt: '2021-11-01T09:15:29Z'
      },
    };
    const container = render(
      <MemoryRouter>
        <MockedThemeProvider>
          <Context.Provider value={userMock}>
            <InviteListCard invitation={invitation}  />
          </Context.Provider>
        </MockedThemeProvider>
      </MemoryRouter>
    );

    expect(container.getByTestId('starts_at_time')).toBeInTheDocument();
    expect(container.getByTestId('starts_at_time').textContent).toContain('guest_book.starts');
    expect(container.getByTestId('ends_at_time')).toBeInTheDocument();
    expect(container.getByTestId('ends_at_time').textContent).toContain('guest_book.ends');
    expect(container.getByTestId('reoccuring_days')).toBeInTheDocument();
    expect(container.getByTestId('reoccuring_days').textContent).toContain('guest_book.repeats: -');
    expect(container.getByTestId('created_at')).toBeInTheDocument();
    expect(container.getByTestId('created_at').textContent).toContain('guest_book.invite_created_at');
    expect(container.getByTestId('date_of_visit').textContent).toContain('guest_book.date_of_visit');
    expect(container.getByTestId('validity')).toBeInTheDocument();
    expect(container.getByTestId('validity').textContent).toContain('guest_book.invalid_now');
    expect(container.getByTestId('host_name')).toBeInTheDocument();
    expect(container.getByTestId('host_name').textContent).toContain('Test two');
    expect(container.getByText('guest_book.active')).toBeInTheDocument();
    expect(container.getByAltText('host_avatar')).toBeInTheDocument();
  });
});
