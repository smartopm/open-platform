import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import routeData, { MemoryRouter } from 'react-router';
import GuestListCard from '../../Components/GuestListCard';

import MockedThemeProvider from '../../../../__mocks__/mock_theme';

describe('Render Guest List Card Component', () => {
  const mockHistory = {
    push: jest.fn()
  };
  beforeEach(() => {
    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockHistory);
  });
  const guest = {
    id: '4af00f39-7fcd-47d2-89bf-e93827d34666',
    status: 'cancelled',
    guest: {
      id: '1388d45c-5279-4e90-9815-8ab33c49d382',
      name: 'Test two',
      imageUrl: null,
      avatarUrl: null,
      request: {
        id: '2acd2ecc-7ff2-4e93-a0fe-329468b2e420',
        status: 'pending',
        revoked: false,
        name: "Test two"
      }
    },
    entryTime: {
      id: '1841e4dc-0e7c-4297-be0b-3c00db12a668',
      occursOn: [],
      visitEndDate: null,
      visitationDate: '2021-11-30T11:54:00Z',
      endsAt: '2021-11-01T21:15:29Z',
      startsAt: '2021-11-01T09:15:29Z'
    },
    thumbnailUrl: 'https://some-video.com'
  };
  it('should render Guest List Card component', async () => {
    const t = jest.fn(() => 'guest_book.cancelled');
    const handleInviteMenu = jest.fn()
    const currentInvite = { id: guest.id, loading: false }
    const container = render(
      <MemoryRouter>
        <MockedThemeProvider>
          <GuestListCard
            invite={guest}
            translate={t}
            styles={{
            theme: {
              palette: {
                info: { main: 'sdasd' }
              },
              success: { main: 'sdasd' }
            }
          }}
            tz="Africa/Cairo"
            currentInvite={currentInvite}
            handleInviteMenu={handleInviteMenu}
          />
        </MockedThemeProvider>
      </MemoryRouter>
    );

    expect(container.getByTestId('guest_info')).toBeInTheDocument();
    expect(container.getByTestId('start_of_visit')).toBeInTheDocument();
    expect(container.getByTestId('ends_on_date')).toBeInTheDocument();
    expect(container.getByTestId('video_preview')).toBeInTheDocument();
    expect(container.getByTestId('visit_time')).toBeInTheDocument();
    expect(container.getByTestId('status')).toBeInTheDocument();
    expect(container.getByTestId('invite_status')).toBeInTheDocument();
    expect(container.getByTestId('invite_status').textContent).toContain('guest_book.cancelled');
    expect(container.getByTestId('validity')).toBeInTheDocument();
    expect(container.getByTestId('guest_card')).toBeInTheDocument();
    expect(container.getByTestId('guest_invite_menu')).toBeInTheDocument();
    fireEvent.click(container.getByTestId('guest_card'));
    expect(mockHistory.push).toBeCalled();
    expect(mockHistory.push).toBeCalledWith('/request/2acd2ecc-7ff2-4e93-a0fe-329468b2e420?type=view');
  });

  it('should render spinner', async () => {
    const t = jest.fn(() => 'guest_book.active');
    const handleInviteMenu = jest.fn()
    const invite = { ...guest, thumbnailUrl: null, status: 'active' }
    const currentInvite = { id: invite.id, loading: true }
    const container = render(
      <MemoryRouter>
        <MockedThemeProvider>
          <GuestListCard
            invite={invite}
            translate={t}
            styles={{
            theme: {
              palette: {
                info: { main: 'sdasd' }
              },
              success: { main: 'sdasd' }
            }
          }}
            tz="Africa/Cairo"
            currentInvite={currentInvite}
            handleInviteMenu={handleInviteMenu}
          />
        </MockedThemeProvider>
      </MemoryRouter>
    );

    expect(container.getByTestId('guest_info')).toBeInTheDocument();
    expect(container.getByTestId('start_of_visit')).toBeInTheDocument();
    expect(container.getByTestId('ends_on_date')).toBeInTheDocument();
    expect(container.getByTestId('request_avatar')).toBeInTheDocument();
    expect(container.getByTestId('visit_time')).toBeInTheDocument();
    expect(container.queryByTestId('status')).not.toBeInTheDocument();
    expect(container.queryByTestId('invite_status')).not.toBeInTheDocument();
    expect(container.queryByTestId('validity')).not.toBeInTheDocument();
    expect(container.queryByTestId('guest_card')).toBeInTheDocument();
    expect(container.queryByTestId('guest_invite_menu')).not.toBeInTheDocument();
    expect(container.queryByTestId('loader')).toBeInTheDocument();
    fireEvent.click(container.getByTestId('guest_card'));
    expect(mockHistory.push).toBeCalled();
    expect(mockHistory.push).toBeCalledWith('/request/2acd2ecc-7ff2-4e93-a0fe-329468b2e420?type=view');
  });
});
