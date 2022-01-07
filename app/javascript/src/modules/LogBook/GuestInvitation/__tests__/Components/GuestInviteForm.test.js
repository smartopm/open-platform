/* eslint-disable max-statements */
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
          visitationDate: guest.visitationDate,
          startsAt: guest.startsAt,
          endsAt: guest.endsAt,
          occursOn: guest.occursOn,
          visitEndDate: guest.visitEndDate,
          guests: [],
          userIds: []
        }
      },
      result: {
        data: {
          invitationCreate: {
            success: true
          }
        }
      }
    };
    const { getByTestId, getAllByTestId, getAllByText } = render(
      <MemoryRouter>
        <Context.Provider value={userMock}>
          <MockedProvider mocks={[createInviteMock]} addTypename={false}>
            <GuestInviteForm />
          </MockedProvider>
        </Context.Provider>
      </MemoryRouter>
    );

    const firstName = getByTestId('guest_entry_first_name');
    const lastName = getByTestId('guest_entry_last_name');
    const phoneNumber = getByTestId('guest_entry_phone_number');

    expect(firstName).toBeInTheDocument();
    expect(lastName).toBeInTheDocument();
    expect(phoneNumber).toBeInTheDocument();
    expect(getByTestId('invite_button')).toBeInTheDocument();

    fireEvent.change(firstName, { target: { value: 'Some random firstName' } });
    expect(firstName.value).toBe('Some random firstName');

    fireEvent.change(lastName, { target: { value: 'Some random lastName' } });
    expect(lastName.value).toBe('Some random lastName');

    expect(phoneNumber).not.toBeDisabled()
    fireEvent.change(phoneNumber, { target: { value: '090909090' } });
    expect(phoneNumber.value).toBe('090909090');


    expect(getByTestId('add_remove_guest_btn')).toBeInTheDocument();
    expect(getByTestId('add_remove_guest_btn').textContent).toContain('misc.add')

    fireEvent.click(getByTestId('add_remove_guest_btn'));
    // we should expect multiple guest inputs
    expect(getAllByTestId('add_remove_guest_btn')).toHaveLength(2);

    expect(getAllByTestId('add_remove_guest_btn')[0].textContent).toContain('misc.remove')

    fireEvent.click(getAllByTestId('add_remove_guest_btn')[0]);
    // we should expect to only have input after clicking the remove btn
    expect(getAllByTestId('add_remove_guest_btn')).toHaveLength(1);

    expect(getAllByText('common:misc.day_of_visit')[0]).toBeInTheDocument();
    expect(getAllByText('common:misc.start_time')[0]).toBeInTheDocument();
    expect(getAllByText('common:misc.end_time')[0]).toBeInTheDocument();


    fireEvent.click(getByTestId('invite_button'));

    await waitFor(() => {
      expect(mockHistory.push).not.toBeCalled();
    }, 10);
  });
});
