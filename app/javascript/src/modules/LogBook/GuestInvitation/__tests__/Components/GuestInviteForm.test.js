import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import routeData, { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/react-testing';
import GuestInviteForm from '../../Components/GuestInviteForm';
import '@testing-library/jest-dom/extend-expect';
import InvitationCreateMutation from '../../graphql/mutations';
import { Context } from '../../../../../containers/Provider/AuthStateProvider';
import userMock from '../../../../../__mocks__/authstate';

describe('Guest Invitation Form', () => {
  const mockHistory = {
    push: jest.fn()
  };
  beforeEach(() => {
    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockHistory);
  });

  it('should render the invitation form', async () => {
    const guest = {
      id: null,
      name: '342',
      email: '232',
      phoneNumber: '232',
      visitationDate: null,
      startsAt: null,
      endsAt: null,
      occursOn: [],
      visitEndDate: null
    };

    const createInviteMock = {
      request: {
        query: InvitationCreateMutation,
        variables: {
          guestId: guest.id,
          name: guest.name,
          email: guest.email,
          phoneNumber: guest.phoneNumber,
          visitationDate: guest.visitationDate,
          startsAt: guest.startsAt,
          endsAt: guest.endsAt,
          occursOn: guest.occursOn,
          visitEndDate: guest.visitEndDate
        }
      },
      result: {
        data: {
          invitationCreate: {
            entryTime: {
              id: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3'
            }
          }
        }
      }
    };
    const { getByTestId, queryAllByText } = render(
      <MemoryRouter>
        <Context.Provider value={userMock}>
          <MockedProvider mocks={[createInviteMock]} addTypename={false}>
            <GuestInviteForm guest={guest} />
          </MockedProvider>
        </Context.Provider>
      </MemoryRouter>
    );

    const name = getByTestId('guest_entry_name');
    const email = getByTestId('guest_entry_email');
    const phoneNumber = getByTestId('guest_entry_phone_number');

    expect(name).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(phoneNumber).toBeInTheDocument();
    expect(getByTestId('invite_button')).toBeInTheDocument();

    fireEvent.change(name, { target: { value: 'Some random name' } });
    expect(name.value).toBe('Some random name');

    fireEvent.change(email, { target: { value: 'Some@random.name' } });
    expect(email.value).toBe('Some@random.name');

    expect(phoneNumber).not.toBeDisabled()
    fireEvent.change(phoneNumber, { target: { value: '090909090' } });
    expect(phoneNumber.value).toBe('090909090');


    fireEvent.click(getByTestId('invite_button'));

    await waitFor(() => {
      expect(queryAllByText('logbook:errors.required_field')[0]).toBeInTheDocument();
      expect(queryAllByText('logbook:errors.required_field')).toHaveLength(1);
      expect(mockHistory.push).not.toBeCalled(); // due to failure in validation
    }, 10);
  });
});
