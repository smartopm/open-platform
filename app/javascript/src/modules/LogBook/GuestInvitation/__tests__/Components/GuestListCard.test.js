import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import routeData, { MemoryRouter } from 'react-router';
import GuestListCard from '../../Components/GuestListCard';
import '@testing-library/jest-dom/extend-expect';

describe('Render Guest List Card Component', () => {
  const mockHistory = {
    push: jest.fn()
  };
  beforeEach(() => {
    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockHistory);
  });
  it('should render Guest List Card component', async () => {
    const guest = {
      id: '4af00f39-7fcd-47d2-89bf-e93827d34666',
      guest: {
        id: '1388d45c-5279-4e90-9815-8ab33c49d382',
        name: 'Test two',
        imageUrl: null,
        avatarUrl: null,
        request: {
          id: '2acd2ecc-7ff2-4e93-a0fe-329468b2e420',
          status: 'pending',
          revoked: false
        }
      },
      entryTime: {
        id: '1841e4dc-0e7c-4297-be0b-3c00db12a668',
        occursOn: [],
        visitEndDate: null,
        visitationDate: '2021-11-30T11:54:00Z',
        endsAt: '2021-11-01T21:15:29Z',
        startsAt: '2021-11-01T09:15:29Z'
      }
    };
    const t = jest.fn(() => 'translated');
    const container = render(
      <MemoryRouter>
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
        />
      </MemoryRouter>
    );

    expect(container.getByTestId('guest_info')).toBeInTheDocument();
    expect(container.getByTestId('start_of_visit')).toBeInTheDocument();
    expect(container.getByTestId('ends_on_date')).toBeInTheDocument();
    expect(container.getByTestId('visit_time')).toBeInTheDocument();
    expect(container.getByTestId('status')).toBeInTheDocument();
    expect(container.getByTestId('validity')).toBeInTheDocument();
    expect(container.getByTestId('guest_card')).toBeInTheDocument();
    fireEvent.click(container.getByTestId('guest_card'));
    expect(mockHistory.push).toBeCalled();
    expect(mockHistory.push).toBeCalledWith('/request/2acd2ecc-7ff2-4e93-a0fe-329468b2e420?type=view');
  });
});
